import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { priceId, userEmail } = await request.json()

    console.log('Checkout session request:', { priceId, userEmail })

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

    // Verify the Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured')
      return NextResponse.json(
        { error: 'Payment system not properly configured. Please contact support.' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || request.headers.get('origin')

    // Verify price exists in Stripe first
    console.log('Attempting to verify price ID:', priceId)
    try {
      const price = await stripe.prices.retrieve(priceId)
      console.log('Price verification successful:', {
        priceId,
        active: price.active,
        currency: price.currency,
        amount: price.unit_amount,
        productId: price.product
      })

      if (!price.active) {
        console.error('Price is not active:', priceId)
        return NextResponse.json(
          { error: `The selected subscription plan is currently inactive. Please try a different plan.` },
          { status: 400 }
        )
      }
    } catch (priceError) {
      console.error('Price verification failed for ID:', priceId, 'Error:', priceError)

      // More specific error handling
      if (priceError instanceof Error) {
        if (priceError.message.includes('No such price')) {
          return NextResponse.json(
            { error: `Invalid price ID: ${priceId}. This subscription plan may not be available in your region or may have been discontinued.` },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        { error: `Failed to validate subscription plan. Please try again or contact support. Price ID: ${priceId}` },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    console.log('Creating checkout session with:', { priceId, userEmail, baseUrl })

    const sessionConfig = {
      mode: 'subscription' as const,
      payment_method_types: ['card' as const],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      customer_email: userEmail,
      allow_promotion_codes: true,
      billing_address_collection: 'auto' as const,
      subscription_data: {
        metadata: {
          userEmail: userEmail,
          source: 'lovelockweb'
        },
      },
      metadata: {
        userEmail: userEmail,
        source: 'lovelockweb'
      }
    }

    console.log('Checkout session config:', JSON.stringify(sessionConfig, null, 2))

    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log('Checkout session created successfully:', {
      sessionId: session.id,
      url: !!session.url,
      mode: session.mode,
      customerId: session.customer,
      customerEmail: session.customer_email
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)

    // Handle specific Stripe errors
    console.error('Create checkout session error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')

    if (error instanceof Error) {
      console.error('Error message:', error.message)

      if (error.message.includes('No such price')) {
        return NextResponse.json(
          { error: 'Invalid subscription plan selected. Please refresh the page and try again.' },
          { status: 400 }
        )
      }
      if (error.message.includes('Invalid API Key')) {
        return NextResponse.json(
          { error: 'Payment system configuration error. Please contact support.' },
          { status: 500 }
        )
      }

      // Return detailed error for debugging
      return NextResponse.json(
        {
          error: `Payment processing failed: ${error.message}`,
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Unable to process payment at this time. Please try again later.' },
      { status: 500 }
    )
  }
}