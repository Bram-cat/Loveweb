import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import { ProfileSubscriptionService } from '@/lib/profile-subscription'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action, priceId, subscriptionId } = await request.json()

    console.log('Subscription management request:', { action, priceId, subscriptionId, userId })

    switch (action) {
      case 'upgrade':
      case 'change_plan':
        return await handlePlanChange(userId, priceId, subscriptionId)

      case 'cancel':
        return await handleCancelSubscription(subscriptionId)

      case 'reactivate':
        return await handleReactivateSubscription(subscriptionId)

      case 'change_billing_cycle':
        return await handleChangeBillingCycle(userId, priceId, subscriptionId)

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in subscription management:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle plan upgrades/downgrades
async function handlePlanChange(userId: string, newPriceId: string, subscriptionId?: string) {
  try {
    // Get current subscription
    const userSubscription = await ProfileSubscriptionService.getUserSubscription(userId)

    if (!userSubscription?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Retrieve current Stripe subscription
    const subscription = await stripe.subscriptions.retrieve(userSubscription.stripe_subscription_id)

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found in Stripe' },
        { status: 404 }
      )
    }

    // Update the subscription to the new price
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations', // Create prorations for immediate changes
    })

    // Update local database
    await ProfileSubscriptionService.updateSubscriptionFromStripe(updatedSubscription)

    console.log('Successfully updated subscription:', updatedSubscription.id)

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: 'Subscription updated successfully'
    })

  } catch (error) {
    console.error('Error changing plan:', error)
    return NextResponse.json(
      { error: 'Failed to change plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle subscription cancellation
async function handleCancelSubscription(subscriptionId: string) {
  try {
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Cancel at period end (don't immediately cancel)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    console.log('Successfully scheduled cancellation for subscription:', subscription.id)

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Subscription will be cancelled at the end of the current period'
    })

  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle subscription reactivation
async function handleReactivateSubscription(subscriptionId: string) {
  try {
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Remove the cancellation
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    console.log('Successfully reactivated subscription:', subscription.id)

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Subscription reactivated successfully'
    })

  } catch (error) {
    console.error('Error reactivating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to reactivate subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle billing cycle changes (monthly to yearly or vice versa)
async function handleChangeBillingCycle(userId: string, newPriceId: string, subscriptionId: string) {
  try {
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Update the subscription to the new billing cycle
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    })

    // Update local database
    await ProfileSubscriptionService.updateSubscriptionFromStripe(updatedSubscription)

    console.log('Successfully changed billing cycle for subscription:', updatedSubscription.id)

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: 'Billing cycle updated successfully'
    })

  } catch (error) {
    console.error('Error changing billing cycle:', error)
    return NextResponse.json(
      { error: 'Failed to change billing cycle', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Get subscription management options
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current subscription
    const userSubscription = await ProfileSubscriptionService.getUserSubscription(userId)
    const subscriptionData = await ProfileSubscriptionService.getSubscriptionStatus(userId)

    if (!userSubscription?.stripe_subscription_id) {
      return NextResponse.json({
        hasSubscription: false,
        availableActions: ['upgrade'],
        currentTier: 'free'
      })
    }

    // Get available price IDs for upgrades/downgrades
    const availableActions = []
    const currentTier = subscriptionData.subscription.tier

    // Determine available actions based on current tier
    if (currentTier === 'free') {
      availableActions.push('upgrade')
    } else {
      availableActions.push('cancel', 'change_plan', 'change_billing_cycle')

      if (subscriptionData.subscription.cancelAtPeriodEnd) {
        availableActions.push('reactivate')
      }
    }

    return NextResponse.json({
      hasSubscription: true,
      currentTier,
      subscription: subscriptionData.subscription,
      availableActions,
      stripeSubscriptionId: userSubscription.stripe_subscription_id
    })

  } catch (error) {
    console.error('Error getting subscription management options:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription options', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}