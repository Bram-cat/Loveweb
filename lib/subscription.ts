import { supabase } from './supabase'
import { stripe, UserSubscription, UsageTracking, SubscriptionTier, USAGE_LIMITS } from './stripe'
import Stripe from 'stripe'
// Note: clerkClient not available in Clerk v5, using placeholder

export class SubscriptionService {

  // Get user subscription from Supabase
  static async getUserSubscription(clerkId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('clerk_id', clerkId)
        .single()

      if (error || !data) {
        // Create free subscription if none exists
        return await this.createFreeSubscription(clerkId)
      }

      return {
        id: data.id,
        userId: data.user_id,
        clerkId: data.clerk_id,
        tier: data.tier,
        status: data.status,
        stripeCustomerId: data.stripe_customer_id || undefined,
        stripeSubscriptionId: data.stripe_subscription_id || undefined,
        currentPeriodStart: data.current_period_start ? new Date(data.current_period_start) : undefined,
        currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : undefined,
        cancelAtPeriodEnd: data.cancel_at_period_end,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error)
      return null
    }
  }

  // Create free subscription
  static async createFreeSubscription(clerkId: string): Promise<UserSubscription> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        clerk_id: clerkId,
        user_id: clerkId, // Use clerk_id as user_id for simplicity
        tier: 'free',
        status: 'active',
        cancel_at_period_end: false
      })
      .select()
      .single()

    if (error || !data) {
      throw new Error('Failed to create free subscription')
    }

    return {
      id: data.id,
      userId: data.user_id,
      clerkId: data.clerk_id,
      tier: data.tier,
      status: data.status,
      cancelAtPeriodEnd: data.cancel_at_period_end,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    }
  }

  // Get or create usage tracking
  static async getUserUsage(clerkId: string): Promise<UsageTracking> {
    try {
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('clerk_id', clerkId)
        .single()

      if (error || !data) {
        // Create new usage tracking
        const { data: newData, error: createError } = await supabase
          .from('usage_tracking')
          .insert({
            clerk_id: clerkId,
            user_id: clerkId,
            numerology_count: 0,
            love_match_count: 0,
            trust_assessment_count: 0,
            reset_date: new Date().toISOString()
          })
          .select()
          .single()

        if (createError || !newData) {
          throw new Error('Failed to create usage tracking')
        }

        return {
          id: newData.id,
          userId: newData.user_id,
          clerkId: newData.clerk_id,
          numerologyCount: newData.numerology_count,
          loveMatchCount: newData.love_match_count,
          trustAssessmentCount: newData.trust_assessment_count,
          resetDate: new Date(newData.reset_date),
          createdAt: new Date(newData.created_at),
          updatedAt: new Date(newData.updated_at)
        }
      }

      // Check if usage should be reset (monthly)
      const resetDate = new Date(data.reset_date)
      const now = new Date()
      const daysSinceReset = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceReset >= 30) {
        // Reset usage
        await this.resetUsage(clerkId)
        return {
          id: data.id,
          userId: data.user_id,
          clerkId: data.clerk_id,
          numerologyCount: 0,
          loveMatchCount: 0,
          trustAssessmentCount: 0,
          resetDate: now,
          createdAt: new Date(data.created_at),
          updatedAt: now
        }
      }

      return {
        id: data.id,
        userId: data.user_id,
        clerkId: data.clerk_id,
        numerologyCount: data.numerology_count,
        loveMatchCount: data.love_match_count,
        trustAssessmentCount: data.trust_assessment_count,
        resetDate: new Date(data.reset_date),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Error getting user usage:', error)
      throw error
    }
  }

  // Reset usage (called monthly)
  static async resetUsage(clerkId: string): Promise<void> {
    const { error } = await supabase
      .from('usage_tracking')
      .update({
        numerology_count: 0,
        love_match_count: 0,
        trust_assessment_count: 0,
        reset_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', clerkId)

    if (error) {
      throw new Error('Failed to reset usage')
    }
  }

  // Check if user can use a feature
  static async canUseFeature(clerkId: string, feature: 'numerology' | 'loveMatch' | 'trustAssessment'): Promise<{ canUse: boolean; reason?: string }> {
    try {
      const subscription = await this.getUserSubscription(clerkId)
      const usage = await this.getUserUsage(clerkId)

      if (!subscription || subscription.status !== 'active') {
        return { canUse: false, reason: 'No active subscription' }
      }

      const limits = USAGE_LIMITS[subscription.tier]
      const featureMap = {
        numerology: { current: usage.numerologyCount, limit: limits.numerology },
        loveMatch: { current: usage.loveMatchCount, limit: limits.loveMatch },
        trustAssessment: { current: usage.trustAssessmentCount, limit: limits.trustAssessment }
      }

      const { current, limit } = featureMap[feature]

      // Unlimited tier
      if (limit === -1) {
        return { canUse: true }
      }

      // Check if under limit
      if (current < limit) {
        return { canUse: true }
      }

      return {
        canUse: false,
        reason: `Usage limit reached (${current}/${limit}). Upgrade to get more access.`
      }
    } catch (error) {
      console.error('Error checking feature usage:', error)
      return { canUse: false, reason: 'Error checking usage limits' }
    }
  }

  // Increment usage
  static async incrementUsage(clerkId: string, feature: 'numerology' | 'loveMatch' | 'trustAssessment'): Promise<void> {
    try {
      const columnMap = {
        numerology: 'numerology_count',
        loveMatch: 'love_match_count',
        trustAssessment: 'trust_assessment_count'
      }

      const { error } = await supabase.rpc('increment_feature_usage', {
        p_clerk_id: clerkId,
        p_feature: columnMap[feature]
      })

      if (error) {
        throw new Error(`Failed to increment ${feature} usage: ${error.message}`)
      }
    } catch (error) {
      console.error(`Error incrementing ${feature} usage:`, error)
      throw error
    }
  }

  // Create Stripe checkout session
  static async createCheckoutSession(
    clerkId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    try {
      // Get or create Stripe customer
      const customer = await this.getOrCreateStripeCustomer(clerkId)

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          clerk_id: clerkId,
        },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
      })

      if (!session.url) {
        throw new Error('Failed to create checkout session URL')
      }

      return session.url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  // Get or create Stripe customer
  static async getOrCreateStripeCustomer(clerkId: string) {
    try {
      // Check if customer exists in our database
      const subscription = await this.getUserSubscription(clerkId)

      if (subscription?.stripeCustomerId) {
        // Verify customer exists in Stripe
        try {
          const customer = await stripe.customers.retrieve(subscription.stripeCustomerId)
          return customer as Stripe.Customer
        } catch {
          // Customer doesn't exist in Stripe, create new one
        }
      }

      // Create new Stripe customer (simplified for Clerk v5 compatibility)
      const customer = await stripe.customers.create({
        email: `user-${clerkId}@example.com`, // Placeholder email
        name: `User ${clerkId}`,
        metadata: {
          clerk_id: clerkId,
        },
      })

      // Update subscription with Stripe customer ID
      await supabase
        .from('user_subscriptions')
        .update({
          stripe_customer_id: customer.id,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_id', clerkId)

      return customer
    } catch (error) {
      console.error('Error getting/creating Stripe customer:', error)
      throw error
    }
  }

  // Create billing portal session
  static async createBillingPortalSession(clerkId: string, returnUrl: string): Promise<string> {
    try {
      const subscription = await this.getUserSubscription(clerkId)

      if (!subscription?.stripeCustomerId) {
        throw new Error('No Stripe customer found')
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: returnUrl,
      })

      return session.url
    } catch (error) {
      console.error('Error creating billing portal session:', error)
      throw error
    }
  }

  // Update subscription from Stripe webhook
  static async updateSubscriptionFromStripe(subscription: Stripe.Subscription): Promise<void> {
    try {
      const clerkId = subscription.metadata?.clerk_id
      if (!clerkId) {
        throw new Error('No clerk_id in subscription metadata')
      }

      // Determine tier from price ID using our configured price IDs
      const priceId = subscription.items.data[0]?.price.id
      let tier: SubscriptionTier = 'free'

      console.log('Determining tier for price ID:', priceId)

      // Map price IDs to tiers using environment variables
      const PRICE_ID_MAP: Record<string, SubscriptionTier> = {}

      // Build the map from environment variables
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

      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          clerk_id: clerkId,
          user_id: clerkId,
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          tier: tier,
          status: subscription.status === 'active' ? 'active' :
                 subscription.status === 'canceled' ? 'canceled' :
                 subscription.status === 'past_due' ? 'past_due' : 'incomplete',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }

      console.log(`Updated subscription for user ${clerkId}: ${tier} (${subscription.status})`)
    } catch (error) {
      console.error('Error updating subscription from Stripe:', error)
      throw error
    }
  }
}