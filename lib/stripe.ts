import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()
if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not defined in environment variables. Stripe features will not work.')
  // Create a dummy stripe instance for development
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const STRIPE_PRICE_IDS = {
  premium: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
  unlimited: process.env.EXPO_PUBLIC_STRIPE_UNLIMITED_PRICE_ID!,
}

export const PLAN_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '5 numerology readings/month',
      '5 love matches/month',
      '5 trust assessments/month',
      'Basic insights',
      'Community support'
    ]
  },
  premium: {
    name: 'Premium',
    price: 4.99,
    priceId: STRIPE_PRICE_IDS.premium,
    features: [
      '50 numerology readings/month',
      '50 love matches/month',
      '50 trust assessments/month',
      'Advanced AI insights',
      'Priority support',
      'Detailed reports'
    ]
  },
  unlimited: {
    name: 'Unlimited',
    price: 12.99,
    priceId: STRIPE_PRICE_IDS.unlimited,
    features: [
      'Unlimited numerology readings',
      'Unlimited love matches',
      'Unlimited trust assessments',
      'Premium AI insights',
      'Priority support',
      'Export capabilities',
      'Advanced analytics'
    ]
  }
} as const

export type PlanType = keyof typeof PLAN_DETAILS