import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY are required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          first_name: string | null
          last_name: string | null
          subscription_tier: 'free' | 'premium' | 'unlimited'
          subscription_status: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          subscription_tier?: 'free' | 'premium' | 'unlimited'
          subscription_status?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          subscription_tier?: 'free' | 'premium' | 'unlimited'
          subscription_status?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}