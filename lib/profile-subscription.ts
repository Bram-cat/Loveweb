import { supabase } from './supabase'
import { stripe, type SubscriptionTier, type SubscriptionStatus } from './stripe'

export interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  stripe_customer_id?: string
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  subscription_id?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export class ProfileSubscriptionService {
  static async getProfile(clerkUserId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .single()

      if (error || !data) {
        console.log('No profile found for user:', clerkUserId)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error getting profile:', error)
      return null
    }
  }

  static async createProfile(userData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          ...userData,
          subscription_tier: userData.subscription_tier || 'free',
          subscription_status: userData.subscription_status || 'active',
          cancel_at_period_end: false
        }])
        .select()
        .single()

      if (error || !data) {
        console.error('Error creating profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error creating profile:', error)
      return null
    }
  }

  static async updateProfile(clerkUserId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_user_id', clerkUserId)
        .select()
        .single()

      if (error || !data) {
        console.error('Error updating profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }

  static async updateSubscription(
    clerkUserId: string,
    subscriptionData: {
      tier: SubscriptionTier
      status: SubscriptionStatus
      subscription_id?: string
      current_period_end?: string
      cancel_at_period_end?: boolean
    }
  ): Promise<UserProfile | null> {
    return this.updateProfile(clerkUserId, {
      subscription_tier: subscriptionData.tier,
      subscription_status: subscriptionData.status,
      subscription_id: subscriptionData.subscription_id,
      current_period_end: subscriptionData.current_period_end,
      cancel_at_period_end: subscriptionData.cancel_at_period_end || false
    })
  }

  static async getSubscriptionUsage(clerkUserId: string) {
    // Mock usage data - replace with actual usage tracking
    return {
      numerology: { used: 0, limit: 3 },
      loveMatch: { used: 0, limit: 3 },
      trustAssessment: { used: 0, limit: 3 }
    }
  }

  static async handleSubscriptionExpired(clerkUserId: string): Promise<void> {
    try {
      await this.updateSubscription(clerkUserId, {
        tier: 'free',
        status: 'active'
      })
      console.log('Downgraded expired subscription to free tier for user:', clerkUserId)
    } catch (error) {
      console.error('Error handling expired subscription:', error)
    }
  }

  static async getSubscriptionStatus(clerkUserId: string) {
    // Get subscription status with profile information
    try {
      const usage = await this.getSubscriptionUsage(clerkUserId)
      const profile = await this.getProfile(clerkUserId)

      return {
        ...usage,
        subscription: profile,
        profile: profile
      }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return null
    }
  }

  static async getUserSubscription(clerkUserId: string) {
    // Return user profile which contains subscription information
    return this.getProfile(clerkUserId)
  }

  static async updateSubscriptionFromStripe(subscriptionData: any, clerkUserId?: string) {
    // Update subscription based on Stripe data
    try {
      // If clerkUserId not provided, try to find it from Stripe customer ID
      if (!clerkUserId && subscriptionData.customer) {
        // Try to find user by stripe_customer_id
        const { data } = await supabase
          .from('users')
          .select('clerk_user_id')
          .eq('stripe_customer_id', subscriptionData.customer)
          .single()

        if (data) {
          clerkUserId = data.clerk_user_id
        }
      }

      if (!clerkUserId) {
        console.error('Cannot update subscription: no user ID provided')
        return null
      }

      const updates: Partial<UserProfile> = {
        subscription_status: subscriptionData.status || 'active',
        subscription_tier: subscriptionData.tier || 'free',
        stripe_customer_id: subscriptionData.customer || undefined,
        subscription_id: subscriptionData.id || undefined,
        current_period_end: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end * 1000).toISOString() : undefined,
        cancel_at_period_end: subscriptionData.cancel_at_period_end || false
      }

      return this.updateProfile(clerkUserId, updates)
    } catch (error) {
      console.error('Error updating subscription from Stripe:', error)
      return null
    }
  }

  static async downgradeExpiredSubscription(clerkUserId: string) {
    // Downgrade user to free tier when subscription expires
    try {
      const updates: Partial<UserProfile> = {
        subscription_tier: 'free',
        subscription_status: 'active',
        cancel_at_period_end: false
      }

      return this.updateProfile(clerkUserId, updates)
    } catch (error) {
      console.error('Error downgrading expired subscription:', error)
      return null
    }
  }

  static async getFallbackProfile(clerkUserId: string): Promise<UserProfile> {
    return {
      id: 'fallback',
      clerk_user_id: clerkUserId,
      email: 'unknown@example.com',
      subscription_tier: 'free',
      subscription_status: 'active',
      cancel_at_period_end: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}