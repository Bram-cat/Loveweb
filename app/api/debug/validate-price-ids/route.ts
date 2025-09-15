import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const priceIds = [
      process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
      process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID,
      process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID,
    ].filter(Boolean)

    const validationResults = []

    for (const priceId of priceIds) {
      if (!priceId) continue // Skip undefined price IDs

      try {
        console.log(`Validating price ID: ${priceId}`)
        const price = await stripe.prices.retrieve(priceId)

        validationResults.push({
          priceId,
          status: 'valid',
          active: price.active,
          currency: price.currency,
          amount: price.unit_amount,
          interval: price.recurring?.interval,
          product: typeof price.product === 'string' ? price.product : price.product?.id,
          mode: price.type,
          created: new Date(price.created * 1000).toISOString()
        })

      } catch (error) {
        console.error(`Price ID ${priceId} validation failed:`, error)

        validationResults.push({
          priceId,
          status: 'invalid',
          error: error instanceof Error ? error.message : 'Unknown error',
          possibleCauses: [
            'Price ID does not exist in Stripe',
            'Price ID is from test mode but using live keys (or vice versa)',
            'Price ID has been deleted or archived',
            'Invalid Stripe API key'
          ]
        })
      }
    }

    // Check if we're using test or live keys
    const keyType = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test' :
                   process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 'unknown'

    return NextResponse.json({
      stripeKeyType: keyType,
      totalPriceIds: priceIds.length,
      validPriceIds: validationResults.filter(r => r.status === 'valid').length,
      invalidPriceIds: validationResults.filter(r => r.status === 'invalid').length,
      results: validationResults,
      recommendations: [
        keyType === 'live' ?
          'You are using LIVE Stripe keys. Ensure all price IDs are from your LIVE Stripe dashboard.' :
          'You are using TEST Stripe keys. Ensure all price IDs are from your TEST Stripe dashboard.',
        'Check your Stripe Dashboard → Products to verify price IDs exist',
        'Ensure price IDs are active and not archived',
        'Verify you\'re looking in the correct Stripe account'
      ]
    })

  } catch (error) {
    console.error('Price validation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to validate price IDs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}