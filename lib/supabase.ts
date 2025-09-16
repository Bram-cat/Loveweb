import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that need elevated permissions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          clerk_id: string
          full_name: string | null
          birth_date: string | null
          email: string | null
          created_at: string
          updated_at: string
          onboarding_completed: boolean
          subscription_tier: 'free' | 'premium' | 'unlimited'
          subscription_status: 'active' | 'canceled' | 'past_due'
        }
        Insert: {
          id?: string
          clerk_id: string
          full_name?: string | null
          birth_date?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          subscription_tier?: 'free' | 'premium' | 'unlimited'
          subscription_status?: 'active' | 'canceled' | 'past_due'
        }
        Update: {
          id?: string
          clerk_id?: string
          full_name?: string | null
          birth_date?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          subscription_tier?: 'free' | 'premium' | 'unlimited'
          subscription_status?: 'active' | 'canceled' | 'past_due'
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          clerk_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: 'free' | 'premium' | 'unlimited'
          status: 'active' | 'canceled' | 'past_due' | 'incomplete'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clerk_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: 'free' | 'premium' | 'unlimited'
          status?: 'active' | 'canceled' | 'past_due' | 'incomplete'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clerk_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: 'free' | 'premium' | 'unlimited'
          status?: 'active' | 'canceled' | 'past_due' | 'incomplete'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          clerk_id: string
          numerology_count: number
          love_match_count: number
          trust_assessment_count: number
          reset_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clerk_id: string
          numerology_count?: number
          love_match_count?: number
          trust_assessment_count?: number
          reset_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clerk_id?: string
          numerology_count?: number
          love_match_count?: number
          trust_assessment_count?: number
          reset_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}