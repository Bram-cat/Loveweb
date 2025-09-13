import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_THIN!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('🔔 Received webhook event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`🤷‍♀️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const clerkUserId = session.metadata?.clerk_user_id

  if (!clerkUserId) {
    console.error('No clerk user ID in session metadata')
    return
  }

  console.log('✅ Checkout session completed for user:', clerkUserId)

  // The subscription will be handled by the subscription.created webhook
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Get user by Stripe customer ID
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (userError || !user) {
    console.error('User not found for customer:', customerId, userError)
    return
  }

  // Determine subscription tier based on price ID
  const priceId = subscription.items.data[0]?.price.id
  let subscriptionTier: 'free' | 'premium' | 'unlimited' = 'free'

  if (priceId === process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
    subscriptionTier = 'premium'
  } else if (priceId === process.env.EXPO_PUBLIC_STRIPE_UNLIMITED_PRICE_ID) {
    subscriptionTier = 'unlimited'
  }

  // Update user subscription
  const { error: updateError } = await supabase
    .from('users')
    .update({
      subscription_tier: subscriptionTier,
      subscription_status: subscription.status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (updateError) {
    console.error('Error updating user subscription:', updateError)
    return
  }

  // Upsert subscription record
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: user.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })

  if (subscriptionError) {
    console.error('Error upserting subscription:', subscriptionError)
  }

  console.log('✅ Subscription updated for user:', user.clerk_user_id, 'Tier:', subscriptionTier)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Update user to free tier
  const { error: updateError } = await supabase
    .from('users')
    .update({
      subscription_tier: 'free',
      subscription_status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (updateError) {
    console.error('Error updating user to free tier:', updateError)
    return
  }

  // Update subscription record
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (subscriptionError) {
    console.error('Error updating subscription status:', subscriptionError)
  }

  console.log('✅ Subscription canceled for customer:', customerId)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('✅ Invoice payment succeeded:', invoice.id)
  // Handle successful payment if needed
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('❌ Invoice payment failed:', invoice.id)

  const customerId = invoice.customer as string

  // Optionally update user status or send notification
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating user payment status:', error)
  }
}