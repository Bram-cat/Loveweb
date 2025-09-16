import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, tier = 'premium' } = body

    console.log(`Fix subscription action: ${action} for user: ${userId}`)

    if (action === 'create_premium_subscription') {
      // First, cancel any existing active subscriptions
      const { error: cancelError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'active')

      if (cancelError) {
        console.error('Error canceling existing subscriptions:', cancelError)
      }

      // Ensure profile exists and is set to want premium
      await supabaseAdmin
        .from('profiles')
        .upsert({
          user_id: userId,
          email: `user-${userId}@example.com`,
          wants_premium: true,
          updated_at: new Date().toISOString()
        })

      // Create new premium subscription
      const now = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // 1 month from now

      const { data: newSubscription, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          subscription_type: tier,
          status: 'active',
          is_premium: tier === 'premium' || tier === 'unlimited',
          is_unlimited: tier === 'unlimited',
          billing_cycle: 'monthly',
          starts_at: now.toISOString(),
          ends_at: endDate.toISOString(),
          stripe_subscription_id: `manual_fix_${Date.now()}`,
          stripe_customer_id: `manual_customer_${userId}`,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        })
        .select()
        .single()

      if (subError) {
        console.error('Error creating subscription:', subError)
        return NextResponse.json({
          error: 'Failed to create subscription',
          details: subError.message
        }, { status: 500 })
      }

      console.log('Successfully created premium subscription:', newSubscription)

      return NextResponse.json({
        success: true,
        message: 'Premium subscription created successfully',
        subscription: newSubscription
      })
    }

    if (action === 'check_subscription_data') {
      // Check current subscription status
      const { data: subscriptions, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      return NextResponse.json({
        userId,
        profile: {
          data: profile,
          error: profileError?.message
        },
        subscriptions: {
          data: subscriptions,
          error: subError?.message
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Fix subscription error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fix subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}