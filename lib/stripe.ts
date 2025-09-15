import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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

// Client-side accessible price IDs - these need to be hardcoded or loaded from a server endpoint
// Since price IDs are not sensitive, we can include them directly
export const SUBSCRIPTION_PLANS = {
  premium: {
    monthly: {
      priceId: PRICE_IDS.premium.monthly,
      price: 4.99,
      interval: 'month' as const,
      name: 'Premium Monthly',
      features: [
        'Up to 25 Numerology readings per month',
        'Up to 15 Love Match analyses per month',
        'Up to 10 Trust Assessments per month',
        'Advanced AI insights',
        'Priority support'
      ]
    },
    yearly: {
      priceId: PRICE_IDS.premium.yearly,
      price: 49.99,
      interval: 'year' as const,
      name: 'Premium Yearly',
      originalPrice: 59.88,
      features: [
        'Up to 25 Numerology readings per month',
        'Up to 15 Love Match analyses per month',
        'Up to 10 Trust Assessments per month',
        'Advanced AI insights',
        'Priority support',
        'Save $9.89/year'
      ]
    }
  },
  unlimited: {
    monthly: {
      priceId: PRICE_IDS.unlimited.monthly,
      price: 12.99,
      interval: 'month' as const,
      name: 'Unlimited Monthly',
      features: [
        'Unlimited Numerology readings',
        'Unlimited Love Match analyses',
        'Unlimited Trust Assessments',
        'Advanced AI insights',
        'Priority support',
        'Early access to new features',
        'Export capabilities'
      ]
    },
    yearly: {
      priceId: PRICE_IDS.unlimited.yearly,
      price: 129.99,
      interval: 'year' as const,
      name: 'Unlimited Yearly',
      originalPrice: 155.88,
      features: [
        'Unlimited Numerology readings',
        'Unlimited Love Match analyses',
        'Unlimited Trust Assessments',
        'Advanced AI insights',
        'Priority support',
        'Early access to new features',
        'Export capabilities',
        'Save $25.89/year'
      ]
    }
  }
}

export const USAGE_LIMITS = {
  free: {
    numerology: 3,
    loveMatch: 2,
    trustAssessment: 1
  },
  premium: {
    numerology: 25,
    loveMatch: 15,
    trustAssessment: 10
  },
  unlimited: {
    numerology: -1, // Unlimited
    loveMatch: -1,  // Unlimited
    trustAssessment: -1 // Unlimited
  }
}

export type SubscriptionTier = 'free' | 'premium' | 'unlimited'
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