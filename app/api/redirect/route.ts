import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const planType = searchParams.get('plan')
  const source = searchParams.get('source')

  // Validate parameters
  if (!userId) {
    // If no user ID, redirect to sign-in first
    return NextResponse.redirect(new URL('/sign-in?redirect=pricing', request.url))
  }

  // If user ID is provided but they need to authenticate on web
  if (source === 'app') {
    // Store the intended plan in a URL parameter for after authentication
    const redirectUrl = planType
      ? `/pricing?plan=${planType}&from=app&userId=${userId}`
      : `/pricing?from=app&userId=${userId}`

    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Default redirect to pricing page
  return NextResponse.redirect(new URL('/pricing', request.url))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, planType } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Create a redirect URL with the user information
    const redirectUrl = new URL('/pricing', request.url)
    redirectUrl.searchParams.set('userId', userId)
    if (email) redirectUrl.searchParams.set('email', email)
    if (planType) redirectUrl.searchParams.set('plan', planType)
    redirectUrl.searchParams.set('from', 'app')

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl.toString()
    })
  } catch (error) {
    console.error('Error processing redirect request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}