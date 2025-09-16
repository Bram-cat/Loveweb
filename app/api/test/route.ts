import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  console.log('Test API called')

  try {
    // Test basic Supabase connection
    console.log('Testing Supabase connection...')
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('count(*)')
      .limit(1)

    console.log('Supabase test result:', { data, error })

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Supabase connection failed',
        error: error.message
      })
    }

    return NextResponse.json({
      success: true,
      message: 'API working correctly',
      data: data
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}