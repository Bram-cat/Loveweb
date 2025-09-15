import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === 'production' ||
                        process.env.NEXT_PUBLIC_DOMAIN?.includes('lovelock.it.com')

    const priceIds = [
      SUBSCRIPTION_PLANS.premium.monthly.priceId,
      SUBSCRIPTION_PLANS.premium.yearly.priceId,
      SUBSCRIPTION_PLANS.unlimited.monthly.priceId,
      SUBSCRIPTION_PLANS.unlimited.yearly.priceId,
    ]

    const priceStatuses = []

    for (const priceId of priceIds) {
      try {
        const price = await stripe.prices.retrieve(priceId)
        priceStatuses.push({
          priceId,
          status: 'valid',
          active: price.active,
          currency: price.currency,
          amount: price.unit_amount,
          type: price.type,
          product: price.product
        })
      } catch (error) {
        priceStatuses.push({
          priceId,
          status: 'invalid',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      environment: {
        nodeEnv: process.env.NODE_ENV,
        domain: process.env.NEXT_PUBLIC_DOMAIN,
        isProduction,
        stripeKeyPresent: !!process.env.STRIPE_SECRET_KEY,
        webhookSecretPresent: !!process.env.STRIPE_WEBHOOK_SECRET,
        priceIdEnvVars: {
          premiumMonthly: !!process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
          premiumYearly: !!process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
          unlimitedMonthly: !!process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID,
          unlimitedYearly: !!process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID
        }
      },
      priceStatuses,
      subscriptionPlans: {
        premium: {
          monthly: {
            priceId: SUBSCRIPTION_PLANS.premium.monthly.priceId,
            fromEnv: 'STRIPE_PREMIUM_MONTHLY_PRICE_ID'
          },
          yearly: {
            priceId: SUBSCRIPTION_PLANS.premium.yearly.priceId,
            fromEnv: 'STRIPE_PREMIUM_YEARLY_PRICE_ID'
          }
        },
        unlimited: {
          monthly: {
            priceId: SUBSCRIPTION_PLANS.unlimited.monthly.priceId,
            fromEnv: 'STRIPE_UNLIMITED_MONTHLY_PRICE_ID'
          },
          yearly: {
            priceId: SUBSCRIPTION_PLANS.unlimited.yearly.priceId,
            fromEnv: 'STRIPE_UNLIMITED_YEARLY_PRICE_ID'
          }
        }
      }
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Stripe information', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}