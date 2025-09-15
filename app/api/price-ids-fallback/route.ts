import { NextRequest, NextResponse } from 'next/server'

// Fallback price IDs based on your .env file
const FALLBACK_PRICE_IDS = {
  premium: {
    monthly: 'price_1S7Q4zGNqirbVSGkHxQN02xl',
    yearly: 'price_1S6ZjwCWEq8iX3p2b3V15kV7'
  },
  unlimited: {
    monthly: 'price_1S2lLrCWEq8iX3p2yN5YJwPE',
    yearly: 'price_1S6ZlBCWEq8iX3p2RuX8Gz4E'
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Using fallback price IDs due to environment variable issues')

    return NextResponse.json({
      success: true,
      fallback: true,
      priceIds: FALLBACK_PRICE_IDS,
      message: 'Using fallback price IDs - environment variables may not be properly loaded',
      subscriptionPlans: {
        premium: {
          monthly: {
            priceId: FALLBACK_PRICE_IDS.premium.monthly,
            price: 4.99,
            interval: 'month',
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
            priceId: FALLBACK_PRICE_IDS.premium.yearly,
            price: 49.99,
            interval: 'year',
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
            priceId: FALLBACK_PRICE_IDS.unlimited.monthly,
            price: 12.99,
            interval: 'month',
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
            priceId: FALLBACK_PRICE_IDS.unlimited.yearly,
            price: 129.99,
            interval: 'year',
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
    })
  } catch (error) {
    console.error('Error in fallback price IDs:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve fallback price configuration' },
      { status: 500 }
    )
  }
}