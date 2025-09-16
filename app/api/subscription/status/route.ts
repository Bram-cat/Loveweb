import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { SubscriptionService } from '@/lib/subscription'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user subscription and usage
    const [subscription, usage] = await Promise.all([
      SubscriptionService.getUserSubscription(userId),
      SubscriptionService.getUserUsage(userId)
    ])

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Check if subscription is expired
    const now = new Date()
    const isExpired = subscription.currentPeriodEnd && now > subscription.currentPeriodEnd

    // Calculate days remaining
    let daysRemaining = null
    if (subscription.currentPeriodEnd && subscription.tier !== 'free') {
      const timeDiff = subscription.currentPeriodEnd.getTime() - now.getTime()
      daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        tier: subscription.tier,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        isExpired,
        daysRemaining,
      },
      usage: {
        numerology: usage.numerologyCount,
        loveMatch: usage.loveMatchCount,
        trustAssessment: usage.trustAssessmentCount,
        resetDate: usage.resetDate,
      },
      limits: {
        numerology: subscription.tier === 'free' ? 3 : subscription.tier === 'premium' ? 50 : -1,
        loveMatch: subscription.tier === 'free' ? 3 : subscription.tier === 'premium' ? 50 : -1,
        trustAssessment: subscription.tier === 'free' ? 3 : subscription.tier === 'premium' ? 50 : -1,
      }
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}