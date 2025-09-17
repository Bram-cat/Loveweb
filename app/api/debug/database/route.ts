import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Database debug API called')

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Testing database connectivity for user:', userId)

    const tests = []

    // Test 1: Basic Supabase connection
    try {
      if (!supabaseAdmin) {
        tests.push({ test: 'Supabase Client', status: 'fail', error: 'Supabase admin client not available' })
      } else {
        tests.push({ test: 'Supabase Client', status: 'pass', details: 'Client available' })
      }
    } catch (error) {
      tests.push({ test: 'Supabase Client', status: 'fail', error: error instanceof Error ? error.message : 'Unknown error' })
    }

    // Test 2: Check profiles table
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .limit(1)

      if (error) {
        tests.push({ test: 'Profiles Table', status: 'fail', error: error.message, details: error })
      } else {
        tests.push({ test: 'Profiles Table', status: 'pass', details: `Found ${data?.length || 0} profiles` })
      }
    } catch (error) {
      tests.push({ test: 'Profiles Table', status: 'fail', error: error instanceof Error ? error.message : 'Unknown error' })
    }

    // Test 3: Check subscriptions table
    try {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .limit(1)

      if (error) {
        tests.push({ test: 'Subscriptions Table', status: 'fail', error: error.message, details: error })
      } else {
        tests.push({ test: 'Subscriptions Table', status: 'pass', details: `Found ${data?.length || 0} subscriptions` })
      }
    } catch (error) {
      tests.push({ test: 'Subscriptions Table', status: 'fail', error: error instanceof Error ? error.message : 'Unknown error' })
    }

    // Test 4: Check user-specific profile
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          tests.push({ test: 'User Profile', status: 'pass', details: 'No profile found (expected for new users)' })
        } else {
          tests.push({ test: 'User Profile', status: 'fail', error: error.message, details: error })
        }
      } else {
        tests.push({ test: 'User Profile', status: 'pass', details: `Found profile: ${data.id}` })
      }
    } catch (error) {
      tests.push({ test: 'User Profile', status: 'fail', error: error instanceof Error ? error.message : 'Unknown error' })
    }

    // Test 5: Check user-specific subscription
    try {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        tests.push({ test: 'User Subscription', status: 'fail', error: error.message, details: error })
      } else {
        tests.push({ test: 'User Subscription', status: 'pass', details: `Found ${data?.length || 0} subscriptions` })
      }
    } catch (error) {
      tests.push({ test: 'User Subscription', status: 'fail', error: error instanceof Error ? error.message : 'Unknown error' })
    }

    // Environment info
    const environmentInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyType: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test' : process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 'unknown',
      clerkUserId: userId
    }

    return NextResponse.json({
      userId,
      tests,
      environmentInfo,
      summary: {
        totalTests: tests.length,
        passed: tests.filter(t => t.status === 'pass').length,
        failed: tests.filter(t => t.status === 'fail').length
      }
    })

  } catch (error) {
    console.error('Error in database debug:', error)
    return NextResponse.json(
      { error: 'Debug test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}