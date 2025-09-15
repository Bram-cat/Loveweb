import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check all our required environment variables
    const envVars = {
      STRIPE_SECRET_KEY: {
        present: !!process.env.STRIPE_SECRET_KEY,
        length: process.env.STRIPE_SECRET_KEY?.length || 0,
        preview: process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 10)}...` : 'Missing'
      },
      STRIPE_WEBHOOK_SECRET: {
        present: !!process.env.STRIPE_WEBHOOK_SECRET,
        length: process.env.STRIPE_WEBHOOK_SECRET?.length || 0,
        preview: process.env.STRIPE_WEBHOOK_SECRET ? `${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 10)}...` : 'Missing'
      },
      STRIPE_PREMIUM_MONTHLY_PRICE_ID: {
        present: !!process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
        value: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'Missing'
      },
      STRIPE_PREMIUM_YEARLY_PRICE_ID: {
        present: !!process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
        value: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || 'Missing'
      },
      STRIPE_UNLIMITED_MONTHLY_PRICE_ID: {
        present: !!process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID,
        value: process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID || 'Missing'
      },
      STRIPE_UNLIMITED_YEARLY_PRICE_ID: {
        present: !!process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID,
        value: process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID || 'Missing'
      },
      NEXT_PUBLIC_DOMAIN: {
        present: !!process.env.NEXT_PUBLIC_DOMAIN,
        value: process.env.NEXT_PUBLIC_DOMAIN || 'Missing'
      },
      NODE_ENV: {
        value: process.env.NODE_ENV || 'undefined'
      }
    }

    // Count missing variables
    const missing = Object.entries(envVars).filter(([key, info]) => {
      if (key === 'NODE_ENV') return false // NODE_ENV is not required
      return 'present' in info && !info.present
    }).map(([key]) => key)

    return NextResponse.json({
      success: missing.length === 0,
      missingCount: missing.length,
      missing,
      environment: envVars,
      deployment: {
        timestamp: new Date().toISOString(),
        platform: process.env.VERCEL ? 'Vercel' : 'Unknown',
        vercelEnv: process.env.VERCEL_ENV || 'Unknown'
      }
    })

  } catch (error) {
    console.error('Environment debug error:', error)
    return NextResponse.json(
      {
        error: 'Failed to check environment variables',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}