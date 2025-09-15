import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@clerk/nextjs/server'

// Simplified checkout session creation without complex subscription service dependencies
export async function POST(request: NextRequest) {
  try {
    const { priceId, userEmail } = await request.json()

    console.log('Simple checkout request:', { priceId, userEmail })

    // Basic validation
    if (!priceId || priceId === 'null' || priceId === null) {
      console.error('Invalid price ID received:', priceId)
      return NextResponse.json(
        { error: 'Price ID is required. Please select a valid subscription plan.' },
        { status: 400 }
      )
    }

    if (!userEmail) {
      console.error('Missing user email')
      return NextResponse.json(
        { error: 'User email is required for checkout.' },
        { status: 400 }
      )
    }

    // Verify user authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured')
      return NextResponse.json(
        { error: 'Payment system not properly configured. Please contact support.' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || request.headers.get('origin')

    // Verify price exists in Stripe
    try {
      const price = await stripe.prices.retrieve(priceId)
      console.log('Price verification successful:', {
        priceId,
        active: price.active,
        currency: price.currency,
        amount: price.unit_amount
      })

      if (!price.active) {
        return NextResponse.json(
          { error: 'The selected subscription plan is currently inactive.' },
          { status: 400 }
        )
      }
    } catch (priceError) {
      console.error('Price verification failed:', priceError)
      return NextResponse.json(
        { error: `Invalid price ID: ${priceId}. This subscription plan may not be available.` },
        { status: 400 }
      )
    }

    // Create checkout session with minimal configuration
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      customer_email: userEmail,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        userEmail: userEmail,
        userId: userId,
        source: 'lovelock-simple-checkout'
      },
      subscription_data: {
        metadata: {
          userEmail: userEmail,
          userId: userId,
          source: 'lovelock-simple-checkout'
        }
      }
    })

    console.log('Simple checkout session created:', {
      sessionId: session.id,
      url: !!session.url,
      customer_email: session.customer_email
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Simple checkout error:', error)

    // Handle specific Stripe errors
    if (error instanceof Error) {
      if (error.message.includes('No such price')) {
        return NextResponse.json(
          { error: 'Invalid subscription plan selected. Please try again.' },
          { status: 400 }
        )
      }
      if (error.message.includes('Invalid API Key')) {
        return NextResponse.json(
          { error: 'Payment system configuration error. Please contact support.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Payment processing failed. Please try again.' },
      { status: 500 }
    )
  }
}