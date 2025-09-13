import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    const headersList = await headers()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
    }

    // Get user from Supabase or create if doesn't exist
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user:', userError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    let customerId: string

    if (!user) {
      // Create new user in Supabase
      const { data: clerkUser } = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }).then(res => res.json())

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: clerkUser.email_addresses[0]?.email_address,
        name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim(),
        metadata: {
          clerk_user_id: userId,
        },
      })

      customerId = customer.id

      // Create user in Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          clerk_user_id: userId,
          email: clerkUser.email_addresses[0]?.email_address,
          first_name: clerkUser.first_name,
          last_name: clerkUser.last_name,
          stripe_customer_id: customerId,
        })

      if (insertError) {
        console.error('Error creating user:', insertError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
    } else {
      customerId = user.stripe_customer_id

      // If user doesn't have a Stripe customer ID, create one
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          metadata: {
            clerk_user_id: userId,
          },
        })

        customerId = customer.id

        // Update user with Stripe customer ID
        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('clerk_user_id', userId)
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${headersList.get('origin') || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${headersList.get('origin') || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        clerk_user_id: userId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}