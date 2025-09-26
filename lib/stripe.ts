import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
})

// Price IDs configuration from environment variables
const PRICE_IDS = {
  premium: {
    monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
    yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
  },
  unlimited: {
    monthly: process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID || '',
    yearly: process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID || ''
  }
}

// Validate that all price IDs are configured
const missingPriceIds = []
if (!PRICE_IDS.premium.monthly) missingPriceIds.push('STRIPE_PREMIUM_MONTHLY_PRICE_ID')
if (!PRICE_IDS.premium.yearly) missingPriceIds.push('STRIPE_PREMIUM_YEARLY_PRICE_ID')
if (!PRICE_IDS.unlimited.monthly) missingPriceIds.push('STRIPE_UNLIMITED_MONTHLY_PRICE_ID')
if (!PRICE_IDS.unlimited.yearly) missingPriceIds.push('STRIPE_UNLIMITED_YEARLY_PRICE_ID')

if (missingPriceIds.length > 0) {
  console.error('Missing required environment variables:', missingPriceIds)
}

console.log('Stripe price IDs configured from environment:', {
  premium: {
    monthly: PRICE_IDS.premium.monthly ? '✅ Set' : '❌ Missing',
    yearly: PRICE_IDS.premium.yearly ? '✅ Set' : '❌ Missing'
  },
  unlimited: {
    monthly: PRICE_IDS.unlimited.monthly ? '✅ Set' : '❌ Missing',
    yearly: PRICE_IDS.unlimited.yearly ? '✅ Set' : '❌ Missing'
  }
})

// Export price IDs for server-side use only
export { PRICE_IDS }

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

export type SubscriptionTier = 'free' | 'premium' | 'unlimited'
export type PlanType = SubscriptionTier // Alias for backwards compatibility
export type SubscriptionInterval = 'month' | 'year'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete'

export interface UserSubscription {
  id: string
  userId: string
  clerkId: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UsageTracking {
  id: string
  userId: string
  clerkId: string
  numerologyCount: number
  loveMatchCount: number
  trustAssessmentCount: number
  resetDate: Date
  createdAt: Date
  updatedAt: Date
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function getPlanDisplayName(tier: SubscriptionTier, interval?: SubscriptionInterval): string {
  if (tier === 'free') return 'Free'
  if (tier === 'premium') {
    return interval === 'year' ? 'Premium Yearly' : 'Premium Monthly'
  }
  if (tier === 'unlimited') {
    return interval === 'year' ? 'Unlimited Yearly' : 'Unlimited Monthly'
  }
  return 'Unknown'
}

// Plan details for pricing components
export const PLAN_DETAILS = {
  free: {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Get started with basic features',
    features: [
      '3 Numerology readings per month',
      '3 Love matches per month',
      '3 Trust assessments per month',
      'Basic AI insights',
      'Email support'
    ],
    popular: false
  },
  premium: {
    name: 'Premium',
    price: { monthly: 9.99, yearly: 99.99 },
    description: 'Unlock advanced features and insights',
    features: [
      '50 Numerology readings per month',
      '50 Love matches per month',
      '50 Trust assessments per month',
      'Advanced AI insights',
      'Priority support',
      'Export reports',
      'Detailed analysis'
    ],
    popular: true
  },
  unlimited: {
    name: 'Unlimited',
    price: { monthly: 19.99, yearly: 199.99 },
    description: 'Everything unlimited for power users',
    features: [
      'Unlimited numerology readings',
      'Unlimited love matches',
      'Unlimited trust assessments',
      'Premium AI insights',
      'VIP support',
      'Advanced analytics',
      'Custom reports',
      'API access'
    ],
    popular: false
  }
} as const