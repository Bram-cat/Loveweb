import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ProfileSubscriptionService } from '@/lib/profile-subscription'

export async function GET(request: NextRequest) {
  console.log('Subscription status API called')

  try {
    console.log('Attempting to get auth...')
    const { userId } = await auth()
    console.log('Auth result:', { userId })

    if (!userId) {
      console.log('No userId found, returning 401')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Getting subscription status for user:', userId)
    // Get user subscription status using the new service
    const status = await ProfileSubscriptionService.getSubscriptionStatus(userId)
    console.log('Subscription status received:', status)

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
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}