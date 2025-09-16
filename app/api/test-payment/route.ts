import { NextRequest, NextResponse } from 'next/server'
import { ProfileSubscriptionService } from '@/lib/profile-subscription'

// Test endpoint to simulate successful payment completion
// This allows testing subscription updates without actual Stripe payments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerkId, tier, interval = 'month' } = body

    if (!clerkId || !tier) {
      return NextResponse.json(
        { error: 'clerkId and tier are required' },
        { status: 400 }
      )
    }

    if (!['premium', 'unlimited'].includes(tier)) {
      return NextResponse.json(
        { error: 'tier must be premium or unlimited' },
        { status: 400 }
      )
    }

    // Get the correct price ID from environment variables
    const getPriceId = (tier: string, interval: string) => {
      if (tier === 'premium' && interval === 'month') {
        return process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID
      }
      if (tier === 'premium' && interval === 'year') {
        return process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID
      }
      if (tier === 'unlimited' && interval === 'month') {
        return process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID
      }
      if (tier === 'unlimited' && interval === 'year') {
        return process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID
      }
      return `price_test_${tier}_${interval}ly` // fallback
    }

    // Create a mock Stripe subscription object
    const now = Math.floor(Date.now() / 1000)
    const periodEnd = interval === 'year' ?
      now + (365 * 24 * 60 * 60) : // 1 year from now
      now + (30 * 24 * 60 * 60)    // 30 days from now

    const priceId = getPriceId(tier, interval)
    console.log(`Creating test subscription for ${clerkId}: ${tier} ${interval}ly with price ID: ${priceId}`)

    const mockSubscription = {
      id: `sub_test_${Date.now()}`,
      customer: `cus_test_${clerkId}`,
      status: 'active' as const,
      current_period_start: now,
      current_period_end: periodEnd,
      cancel_at_period_end: false,
      metadata: {
        clerk_id: clerkId,
      },
      items: {
        data: [{
          price: {
            id: priceId,
          }
        }]
      }
    }

    // Update the subscription in our database using the new service
    await ProfileSubscriptionService.createSubscription(
      clerkId,
      tier as 'premium' | 'unlimited',
      interval as 'month' | 'year',
      mockSubscription.id
    )

    console.log(`Test payment completed for user ${clerkId}: ${tier} ${interval}ly`)

    return NextResponse.json({
      success: true,
      message: `Test payment completed successfully`,
      subscription: {
        clerkId,
        tier,
        interval,
        status: 'active',
        current_period_start: new Date(now * 1000).toISOString(),
        current_period_end: new Date(periodEnd * 1000).toISOString(),
      }
    })
  } catch (error) {
    console.error('Error processing test payment:', error)
    return NextResponse.json(
      { error: 'Failed to process test payment' },
      { status: 500 }
    )
  }
}

// GET endpoint to simulate payment cancellation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clerkId = searchParams.get('clerkId')

    if (!clerkId) {
      return NextResponse.json(
        { error: 'clerkId is required' },
        { status: 400 }
      )
    }

    // Create a mock cancelled subscription
    const mockSubscription = {
      id: `sub_test_cancelled_${Date.now()}`,
      customer: `cus_test_${clerkId}`,
      status: 'canceled' as const,
      current_period_start: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60),
      current_period_end: Math.floor(Date.now() / 1000),
      cancel_at_period_end: true,
      metadata: {
        clerk_id: clerkId,
      },
      items: {
        data: [{
          price: {
            id: 'price_test_cancelled',
          }
        }]
      }
    }

    await ProfileSubscriptionService.cancelSubscription(clerkId)

    console.log(`Test subscription cancelled for user ${clerkId}`)

    return NextResponse.json({
      success: true,
      message: `Test subscription cancelled successfully`,
      subscription: {
        clerkId,
        tier: 'free',
        status: 'canceled',
      }
    })
  } catch (error) {
    console.error('Error processing test cancellation:', error)
    return NextResponse.json(
      { error: 'Failed to process test cancellation' },
      { status: 500 }
    )
  }
}