import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ProfileSubscriptionService } from '@/lib/profile-subscription'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user subscription status using the new service
    const status = await ProfileSubscriptionService.getSubscriptionStatus(userId)

    return NextResponse.json({
      subscription: status.subscription,
      usage: status.usage,
      limits: status.limits
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        userId: userId
      },
      { status: 500 }
    )
  }
}