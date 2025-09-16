import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { SubscriptionService } from '@/lib/subscription'

// API endpoint to monitor and handle subscription expirations
// This should be called by a cron job or scheduled task
export async function POST(request: NextRequest) {
  try {
    // Verify request is from authorized source (in production, add proper auth)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN || 'dev_token_123'

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting subscription monitoring...')

    // Find subscriptions that have expired
    const { data: expiredSubscriptions, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('status', 'active')
      .lt('current_period_end', new Date().toISOString())
      .not('tier', 'eq', 'free')

    if (error) {
      throw error
    }

    console.log(`Found ${expiredSubscriptions?.length || 0} expired subscriptions`)

    const results = []

    if (expiredSubscriptions && expiredSubscriptions.length > 0) {
      for (const subscription of expiredSubscriptions) {
        try {
          // Update subscription to free tier
          const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update({
              tier: 'free',
              status: 'canceled',
              updated_at: new Date().toISOString()
            })
            .eq('id', subscription.id)

          if (updateError) {
            throw updateError
          }

          // Reset usage to free tier limits if needed
          await SubscriptionService.resetUsage(subscription.clerk_id)

          results.push({
            clerkId: subscription.clerk_id,
            previousTier: subscription.tier,
            status: 'downgraded_to_free',
            expiredAt: subscription.current_period_end
          })

          console.log(`Downgraded expired subscription for user ${subscription.clerk_id}`)
        } catch (error) {
          console.error(`Failed to handle expired subscription for user ${subscription.clerk_id}:`, error)
          results.push({
            clerkId: subscription.clerk_id,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }

    // Also find subscriptions expiring in the next 7 days for warning notifications
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const { data: expiringSubscriptions, error: expiringError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('status', 'active')
      .lt('current_period_end', sevenDaysFromNow.toISOString())
      .gt('current_period_end', new Date().toISOString())
      .not('tier', 'eq', 'free')

    if (expiringError) {
      console.error('Error fetching expiring subscriptions:', expiringError)
    }

    const expiringWarnings = expiringSubscriptions?.map(sub => {
      const daysUntilExpiry = Math.ceil(
        (new Date(sub.current_period_end).getTime() - new Date().getTime())
        / (1000 * 60 * 60 * 24)
      )
      return {
        clerkId: sub.clerk_id,
        tier: sub.tier,
        daysUntilExpiry,
        expiresAt: sub.current_period_end
      }
    }) || []

    return NextResponse.json({
      success: true,
      processed: results.length,
      expired: results,
      expiringSoon: expiringWarnings,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in subscription monitoring:', error)
    return NextResponse.json(
      {
        error: 'Failed to monitor subscriptions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Manual trigger endpoint for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const testMode = searchParams.get('test') === 'true'

  if (!testMode) {
    return NextResponse.json(
      { error: 'Use POST for monitoring or add ?test=true for manual trigger' },
      { status: 400 }
    )
  }

  // Simulate a POST request for testing
  const testRequest = new Request(request.url, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${process.env.CRON_SECRET_TOKEN || 'dev_token_123'}`
    }
  })

  return POST(testRequest as NextRequest)
}