import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ProfileSubscriptionService } from '@/lib/profile-subscription'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Getting customer information for user:', userId)

    try {
      // Get subscription status which includes all the information we need
      const subscriptionData = await ProfileSubscriptionService.getSubscriptionStatus(userId)

      if (!subscriptionData) {
        return NextResponse.json(
          { error: 'User subscription data not found' },
          { status: 404 }
        )
      }

      const { subscription, profile } = subscriptionData

      // Try to get Stripe customer information if we have a stripe_customer_id
      const userSubscription = await ProfileSubscriptionService.getUserSubscription(userId)
      let stripeCustomer = null

      if (userSubscription?.stripe_customer_id) {
        try {
          stripeCustomer = await stripe.customers.retrieve(userSubscription.stripe_customer_id)
          console.log('Retrieved Stripe customer:', stripeCustomer.id)
        } catch (stripeError) {
          console.error('Error retrieving Stripe customer:', stripeError)
        }
      }

      // Format customer data for the dashboard
      const customer = {
        id: userSubscription?.stripe_customer_id || `mock_${userId}`,
        email: profile?.email || 'user@example.com',
        subscription: {
          id: userSubscription?.stripe_subscription_id || `mock_sub_${userId}`,
          status: userSubscription?.subscription_status || 'active',
          tier: userSubscription?.subscription_tier || 'free',
          currentPeriodEnd: userSubscription?.current_period_end ? new Date(userSubscription.current_period_end) : null,
          cancelAtPeriodEnd: userSubscription?.cancel_at_period_end || false,
          is_premium: userSubscription?.subscription_tier === 'premium',
          is_unlimited: userSubscription?.subscription_tier === 'unlimited'
        }
      }

      console.log('Returning customer data:', customer)
      return NextResponse.json(customer)
    } catch (serviceError) {
      console.error('Service error in get-customer:', serviceError)

      // Return basic customer structure for free users or when service fails
      const fallbackCustomer = {
        id: `fallback_${userId}`,
        email: 'user@example.com',
        subscription: {
          id: `fallback_sub_${userId}`,
          status: 'active',
          tier: 'free',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          is_premium: false,
          is_unlimited: false
        }
      }

      console.log('Returning fallback customer data:', fallbackCustomer)
      return NextResponse.json(fallbackCustomer)
    }
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer information', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}