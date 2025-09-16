import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Checking user subscription data for:', userId)

    // Check profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Check subscriptions
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)

    console.log('Profile data:', profile)
    console.log('Subscriptions data:', subscriptions)

    return NextResponse.json({
      userId,
      profile: {
        data: profile,
        error: profileError
      },
      subscriptions: {
        data: subscriptions,
        error: subError
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Failed to debug user subscription' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'create_premium') {
      console.log('Creating premium subscription for user:', userId)

      // First ensure profile exists
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          user_id: userId,
          email: `user-${userId}@example.com`,
          wants_premium: true,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
      }

      // Create premium subscription
      const now = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // 1 month

      const { data: subscription, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: userId,
          subscription_type: 'premium',
          status: 'active',
          is_premium: true,
          is_unlimited: false,
          billing_cycle: 'monthly',
          starts_at: now.toISOString(),
          ends_at: endDate.toISOString(),
          stripe_subscription_id: `manual_${Date.now()}`,
          stripe_customer_id: `manual_customer_${userId}`,
          updated_at: now.toISOString()
        })
        .select()
        .single()

      if (subError) {
        console.error('Subscription error:', subError)
        return NextResponse.json({ error: 'Failed to create subscription', details: subError }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Premium subscription created',
        profile,
        subscription
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}