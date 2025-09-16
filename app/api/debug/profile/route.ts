import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log(`Debug profile check for user: ${userId}`)

    // Check if profile exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)

    // Check if subscription exists
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)

    // Test database connection
    const { count: profileCount, error: testError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      user_id: userId,
      profile: {
        exists: !profileError && profile && profile.length > 0,
        data: profile,
        error: profileError?.message
      },
      subscription: {
        exists: !subscriptionError && subscription && subscription.length > 0,
        data: subscription,
        error: subscriptionError?.message
      },
      database: {
        connected: !testError,
        error: testError?.message,
        totalProfiles: profileCount || 0
      }
    })
  } catch (error) {
    console.error('Debug profile error:', error)
    return NextResponse.json(
      {
        error: 'Debug failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST endpoint to create a profile manually
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: userId,
        email: body.email || `user-${userId}@example.com`,
        full_name: body.full_name || `User ${userId.slice(0, 8)}`,
        wants_premium: false,
        wants_notifications: true,
        agreed_to_terms: false,
        onboarding_completed: false,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      profile: data
    })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      {
        error: 'Failed to create profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}