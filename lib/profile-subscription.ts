import { supabaseAdmin } from './supabase'
import { stripe } from './stripe'
import Stripe from 'stripe'

export type SubscriptionTier = 'free' | 'premium' | 'unlimited'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete'

export interface UserProfile {
  id: string
  clerk_id: string
  email: string | null
  full_name: string | null
  birth_date?: string | null
  onboarding_completed: boolean
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  clerk_id: string
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  tier: SubscriptionTier
  status: SubscriptionStatus
  current_period_start?: string | null
  current_period_end?: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface UsageStats {
  numerology: number
  loveMatch: number
  trustAssessment: number
}

export const USAGE_LIMITS = {
  free: {
    numerology: 3,
    loveMatch: 3,
    trustAssessment: 3
  },
  premium: {
    numerology: 50,
    loveMatch: 50,
    trustAssessment: 50
  },
  unlimited: {
    numerology: -1, // Unlimited
    loveMatch: -1,  // Unlimited
    trustAssessment: -1 // Unlimited
  }
}

export class ProfileSubscriptionService {

  // Get user profile with subscription info
  static async getUserProfile(clerkId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('clerk_id', clerkId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          console.log('Profile not found, will create default profile')
          return null
        }
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  }

  // Create default profile for new users
  static async createDefaultProfile(clerkId: string, email?: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert({
          clerk_id: clerkId,
          email: email || `user-${clerkId}@example.com`,
          full_name: `User ${clerkId.slice(0, 8)}`,
          subscription_tier: 'free',
          subscription_status: 'active',
          onboarding_completed: false,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      console.log(`Created default profile for user ${clerkId}`)
      return data
    } catch (error) {
      console.error('Error creating default profile:', error)
      throw error
    }
  }

  // Get user subscription from subscriptions table
  static async getUserSubscription(clerkId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('clerk_id', clerkId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Error fetching subscription:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getUserSubscription:', error)
      return null
    }
  }

  // Get usage statistics from usage_tracking table
  static async getUsageStats(clerkId: string): Promise<UsageStats> {
    try {
      const { data, error } = await supabaseAdmin
        .from('usage_tracking')
        .select('numerology_count, love_match_count, trust_assessment_count')
        .eq('clerk_id', clerkId)
        .single()

      if (error) {
        console.error('Error fetching usage stats:', error)
        return { numerology: 0, loveMatch: 0, trustAssessment: 0 }
      }

      return {
        numerology: data?.numerology_count || 0,
        loveMatch: data?.love_match_count || 0,
        trustAssessment: data?.trust_assessment_count || 0
      }
    } catch (error) {
      console.error('Error getting usage stats:', error)
      return { numerology: 0, loveMatch: 0, trustAssessment: 0 }
    }
  }

  // Get complete subscription status
  static async getSubscriptionStatus(clerkId: string) {
    try {
      let profile = await this.getUserProfile(clerkId)

      // Create default profile if it doesn't exist
      if (!profile) {
        profile = await this.createDefaultProfile(clerkId)
      }

      const [subscription, usage] = await Promise.all([
        this.getUserSubscription(clerkId),
        this.getUsageStats(clerkId)
      ])

      // Determine current tier
      let tier: SubscriptionTier = 'free'
      let status: SubscriptionStatus = 'active'
      let currentPeriodStart: Date | null = null
      let currentPeriodEnd: Date | null = null
      let isExpired = false
      let daysRemaining: number | null = null

      if (subscription && subscription.status === 'active') {
        tier = subscription.tier
        status = subscription.status

        if (subscription.current_period_start) {
          currentPeriodStart = new Date(subscription.current_period_start)
        }
        if (subscription.current_period_end) {
          currentPeriodEnd = new Date(subscription.current_period_end)
          const now = new Date()
          isExpired = now > currentPeriodEnd
          daysRemaining = Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

          // If expired, downgrade to free
          if (isExpired) {
            tier = 'free'
            status = 'canceled'
            await this.downgradeExpiredSubscription(clerkId)
          }
        }
      } else if (profile.subscription_tier !== 'free') {
        // User has premium tier in profile but no active subscription, check if it expired
        tier = 'free'
        status = 'canceled'
      }

      const limits = USAGE_LIMITS[tier]

      return {
        subscription: {
          id: subscription?.id || '',
          tier,
          status,
          currentPeriodStart: currentPeriodStart?.toISOString(),
          currentPeriodEnd: currentPeriodEnd?.toISOString(),
          cancelAtPeriodEnd: false,
          isExpired,
          daysRemaining,
        },
        usage,
        limits,
        profile
      }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      throw error
    }
  }

  // Create or update subscription when payment succeeds
  static async createSubscription(
    clerkId: string,
    tier: 'premium' | 'unlimited',
    interval: 'month' | 'year',
    stripeSubscriptionId?: string
  ) {
    try {
      const now = new Date()
      const endDate = new Date()

      // Set end date based on interval
      if (interval === 'year') {
        endDate.setFullYear(endDate.getFullYear() + 1)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      // Update profile to indicate the subscription tier
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_tier: tier,
          subscription_status: 'active',
          updated_at: now.toISOString()
        })
        .eq('clerk_id', clerkId)

      if (profileError) {
        throw profileError
      }

      // Create subscription record
      const { data, error } = await supabaseAdmin
        .from('user_subscriptions')
        .upsert({
          clerk_id: clerkId,
          user_id: clerkId,
          tier: tier,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
          stripe_subscription_id: stripeSubscriptionId,
          cancel_at_period_end: false,
          updated_at: now.toISOString()
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      console.log(`Created ${tier} subscription for user ${clerkId}, expires: ${endDate.toISOString()}`)
      return data
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  }

  // Cancel subscription
  static async cancelSubscription(clerkId: string) {
    try {
      const now = new Date()

      // Update profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_tier: 'free',
          subscription_status: 'canceled',
          updated_at: now.toISOString()
        })
        .eq('clerk_id', clerkId)

      if (profileError) {
        throw profileError
      }

      // Cancel active subscriptions
      const { error } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          status: 'canceled',
          updated_at: now.toISOString()
        })
        .eq('clerk_id', clerkId)
        .eq('status', 'active')

      if (error) {
        throw error
      }

      console.log(`Cancelled subscription for user ${clerkId}`)
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      throw error
    }
  }

  // Downgrade expired subscription
  static async downgradeExpiredSubscription(clerkId: string) {
    try {
      const now = new Date()

      // Update profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_tier: 'free',
          subscription_status: 'canceled',
          updated_at: now.toISOString()
        })
        .eq('clerk_id', clerkId)

      if (profileError) {
        throw profileError
      }

      // Update subscription status
      const { error } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          status: 'canceled',
          updated_at: now.toISOString()
        })
        .eq('clerk_id', clerkId)
        .eq('status', 'active')
        .lt('current_period_end', now.toISOString())

      if (error) {
        throw error
      }

      console.log(`Downgraded expired subscription for user ${clerkId}`)
    } catch (error) {
      console.error('Error downgrading expired subscription:', error)
      throw error
    }
  }

  // Process Stripe webhook
  static async updateSubscriptionFromStripe(subscription: Stripe.Subscription): Promise<void> {
    try {
      const clerkId = subscription.metadata?.clerk_id
      if (!clerkId) {
        throw new Error('No clerk_id in subscription metadata')
      }

      // Determine tier from price ID
      const priceId = subscription.items.data[0]?.price.id
      let tier: SubscriptionTier = 'free'

      console.log('Determining tier for price ID:', priceId)

      // Map price IDs to tiers using environment variables
      const PRICE_ID_MAP: Record<string, SubscriptionTier> = {}

      if (process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID) {
        PRICE_ID_MAP[process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID] = 'premium'
      }
      if (process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID) {
        PRICE_ID_MAP[process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID] = 'premium'
      }
      if (process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID) {
        PRICE_ID_MAP[process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID] = 'unlimited'
      }
      if (process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID) {
        PRICE_ID_MAP[process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID] = 'unlimited'
      }

      // Handle test mode price IDs
      if (priceId?.startsWith('price_test_')) {
        if (priceId.includes('premium')) {
          tier = 'premium'
        } else if (priceId.includes('unlimited')) {
          tier = 'unlimited'
        }
      } else {
        tier = PRICE_ID_MAP[priceId] || 'free'
      }

      console.log('Mapped price ID to tier:', { priceId, tier })

      if (subscription.status === 'active' && tier !== 'free') {
        // Determine interval
        const interval = subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'year' : 'month'

        await this.createSubscription(
          clerkId,
          tier as 'premium' | 'unlimited',
          interval,
          subscription.id
        )
      } else {
        // Cancel subscription
        await this.cancelSubscription(clerkId)
      }

    } catch (error) {
      console.error('Error updating subscription from Stripe:', error)
      throw error
    }
  }

  // Check if user can use a feature
  static async canUseFeature(clerkId: string, feature: 'numerology' | 'loveMatch' | 'trustAssessment'): Promise<{ canUse: boolean; reason?: string }> {
    try {
      const status = await this.getSubscriptionStatus(clerkId)
      const { subscription, usage, limits } = status

      if (subscription.status !== 'active' && subscription.tier !== 'free') {
        return { canUse: false, reason: 'No active subscription' }
      }

      const currentUsage = usage[feature]
      const limit = limits[feature]

      // Unlimited tier
      if (limit === -1) {
        return { canUse: true }
      }

      // Check if under limit
      if (currentUsage < limit) {
        return { canUse: true }
      }

      return {
        canUse: false,
        reason: `Usage limit reached (${currentUsage}/${limit}). Upgrade to get more access.`
      }
    } catch (error) {
      console.error('Error checking feature usage:', error)
      return { canUse: false, reason: 'Error checking usage limits' }
    }
  }

  // Increment usage
  static async incrementUsage(clerkId: string, feature: 'numerology' | 'loveMatch' | 'trustAssessment'): Promise<void> {
    try {
      // Get current usage or create if doesn't exist
      const { data: currentUsage, error: fetchError } = await supabaseAdmin
        .from('usage_tracking')
        .select('*')
        .eq('clerk_id', clerkId)
        .single()

      let updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (feature === 'numerology') {
        updateData.numerology_count = (currentUsage?.numerology_count || 0) + 1
      } else if (feature === 'loveMatch') {
        updateData.love_match_count = (currentUsage?.love_match_count || 0) + 1
      } else if (feature === 'trustAssessment') {
        updateData.trust_assessment_count = (currentUsage?.trust_assessment_count || 0) + 1
      }

      const { error } = currentUsage
        ? await supabaseAdmin
            .from('usage_tracking')
            .update(updateData)
            .eq('clerk_id', clerkId)
        : await supabaseAdmin
            .from('usage_tracking')
            .insert({
              clerk_id: clerkId,
              user_id: clerkId,
              numerology_count: feature === 'numerology' ? 1 : 0,
              love_match_count: feature === 'loveMatch' ? 1 : 0,
              trust_assessment_count: feature === 'trustAssessment' ? 1 : 0,
              reset_date: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

      if (error) {
        throw error
      }

      console.log(`Incremented ${feature} usage for user ${clerkId}`)
    } catch (error) {
      console.error(`Error incrementing ${feature} usage:`, error)
      throw error
    }
  }
}