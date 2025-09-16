import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ProfileSubscriptionService } from '@/lib/profile-subscription'

export async function GET(request: NextRequest) {
  console.log('Subscription status API called')

  try {
    // For testing purposes, allow a test user ID via query parameter
    const url = new URL(request.url)
    const testUserId = url.searchParams.get('testUserId')

    let userId: string | null = null

    if (testUserId) {
      console.log('Using test user ID:', testUserId)
      userId = testUserId
    } else {
      console.log('Attempting to get auth...')
      const authResult = await auth()
      userId = authResult.userId
      console.log('Auth result:', { userId })

      if (!userId) {
        console.log('No userId found, returning 401')
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    console.log('Getting subscription status for user:', userId)

    // Get profile first to test basic connection
    console.log('Testing profile fetch...')
    const profile = await ProfileSubscriptionService.getUserProfile(userId)
    console.log('Profile result:', profile)

    // Get subscription
    console.log('Testing subscription fetch...')
    const subscription = await ProfileSubscriptionService.getUserSubscription(userId)
    console.log('Subscription result:', subscription)

    // Get usage stats
    console.log('Testing usage stats fetch...')
    const usage = await ProfileSubscriptionService.getUsageStats(userId)
    console.log('Usage result:', usage)

    // Return simplified response
    return NextResponse.json({
      subscription: {
        id: subscription?.id || '',
        tier: subscription?.subscription_type || 'free',
        status: subscription?.status || 'active',
        is_premium: subscription?.is_premium || false,
        is_unlimited: subscription?.is_unlimited || false,
        billing_cycle: subscription?.billing_cycle || 'monthly',
        currentPeriodStart: subscription?.starts_at,
        currentPeriodEnd: subscription?.ends_at,
        cancelAtPeriodEnd: false,
        isExpired: false,
        daysRemaining: null,
      },
      usage,
      limits: {
        numerology: 3,
        loveMatch: 3,
        trustAssessment: 3
      }
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}