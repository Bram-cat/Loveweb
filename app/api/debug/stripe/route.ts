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
        stripeKeyPresent: !!process.env.STRIPE_SECRET_KEY
      },
      priceStatuses,
      subscriptionPlans: {
        premium: {
          monthly: { priceId: SUBSCRIPTION_PLANS.premium.monthly.priceId },
          yearly: { priceId: SUBSCRIPTION_PLANS.premium.yearly.priceId }
        },
        unlimited: {
          monthly: { priceId: SUBSCRIPTION_PLANS.unlimited.monthly.priceId },
          yearly: { priceId: SUBSCRIPTION_PLANS.unlimited.yearly.priceId }
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