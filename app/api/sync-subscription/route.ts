import { NextRequest, NextResponse } from 'next/server'
import { ProfileSubscriptionService } from '@/lib/profile-subscription'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerkId, tier = 'premium', interval = 'month' } = body

    if (!clerkId) {
      return NextResponse.json(
        { error: 'clerkId is required' },
        { status: 400 }
      )
    }

    console.log(`Manually syncing subscription for user ${clerkId}: ${tier} ${interval}ly`)

    // Manually create subscription
    const subscription = await ProfileSubscriptionService.createSubscription(
      clerkId,
      tier as 'premium' | 'unlimited',
      interval as 'month' | 'year',
      `sub_manual_${Date.now()}`,
      `cus_manual_${clerkId}`
    )

    console.log('Subscription created:', subscription)

    return NextResponse.json({
      success: true,
      message: 'Subscription synced successfully',
      subscription
    })
  } catch (error) {
    console.error('Error syncing subscription:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}