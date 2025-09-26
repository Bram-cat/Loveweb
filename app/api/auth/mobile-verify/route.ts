import { NextRequest, NextResponse } from 'next/server'

interface MobileVerifyRequest {
  userId: string
  email: string
  source: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, source }: MobileVerifyRequest = await request.json()

    if (!userId || !email || source !== 'mobile') {
      return NextResponse.json(
        { error: 'Invalid mobile verification request' },
        { status: 400 }
      )
    }

    // For now, just return success - user will be redirected to sign-in
    // This can be expanded later to handle Clerk user creation
    return NextResponse.json({
      success: true,
      message: 'Mobile parameters received, redirecting to sign-in'
    })

  } catch (error) {
    console.error('Mobile verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}