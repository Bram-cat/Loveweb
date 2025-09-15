import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Price IDs configuration
// Based on your clarification: only premium monthly is development price ID, rest are real production price IDs
const PRICE_IDS = {
  premium: {
    monthly: 'price_1S7Q4zGNqirbVSGkHxQN02xl', // Development price ID (will work on lovelock.it.com if using same Stripe account)
    yearly: 'price_1S6ZjwCWEq8iX3p2b3V15kV7',  // Real production price ID
  },
  unlimited: {
    monthly: 'price_1S2lLrCWEq8iX3p2yN5YJwPE', // Real production price ID
    yearly: 'price_1S6ZlBCWEq8iX3p2RuX8Gz4E'   // Real production price ID
  }
}

console.log('Stripe price IDs configured:', PRICE_IDS)

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