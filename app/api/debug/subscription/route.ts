import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { searchParams } = new URL(request.url)
    const debugUserId = searchParams.get('userId') || userId

    if (!debugUserId) {
      return NextResponse.json(
        { error: 'No user ID provided' },
        { status: 400 }
      )
    }

    console.log(`Debugging subscription for user: ${debugUserId}`)

    // Check if user exists in subscriptions table
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('clerk_id', debugUserId)
      .single()

    // Check if user exists in usage tracking table
    const { data: usage, error: usageError } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('clerk_id', debugUserId)
      .single()

    // Get all subscriptions for debugging
    const { data: allSubs, error: allSubsError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .limit(5)

    return NextResponse.json({
      user_id: debugUserId,
      subscription: {
        data: subscription,
        error: subError?.message
      },
      usage: {
        data: usage,
        error: usageError?.message
      },
      recent_subscriptions: {
        data: allSubs,
        error: allSubsError?.message
      },
      tables_info: {
        subscription_exists: !subError,
        usage_exists: !usageError
      }
    })
  } catch (error) {
    console.error('Debug subscription error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST endpoint to force create subscription
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const body = await request.json()
    const targetUserId = body.userId || userId

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'No user ID provided' },
        { status: 400 }
      )
    }

    console.log(`Force creating subscription for user: ${targetUserId}`)

    // First, try to create the user_subscriptions record
    const { data: newSub, error: subError } = await supabase
      .from('user_subscriptions')
      .upsert({
        clerk_id: targetUserId,
        user_id: targetUserId,
        tier: body.tier || 'premium',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    // Create usage tracking record
    const { data: newUsage, error: usageError } = await supabase
      .from('usage_tracking')
      .upsert({
        clerk_id: targetUserId,
        user_id: targetUserId,
        numerology_count: 0,
        love_match_count: 0,
        trust_assessment_count: 0,
        reset_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    return NextResponse.json({
      success: true,
      subscription: {
        data: newSub,
        error: subError?.message
      },
      usage: {
        data: newUsage,
        error: usageError?.message
      }
    })
  } catch (error) {
    console.error('Force create subscription error:', error)
    return NextResponse.json(
      { error: 'Force create failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}