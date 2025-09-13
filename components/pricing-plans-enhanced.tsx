'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { PricingPlans } from './pricing-plans'
import { AppRedirectHandler } from './app-redirect-handler'

export function PricingPlansEnhanced() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()

  const fromApp = searchParams.get('from') === 'app'
  const suggestedPlan = searchParams.get('plan')

  const handlePlanSelect = (planType: string) => {
    // Handle plan selection from app redirect
    if (fromApp && typeof window !== 'undefined') {
      // Update URL to reflect selected plan
      const url = new URL(window.location.href)
      url.searchParams.set('plan', planType)
      router.replace(url.toString())
    }
  }

  return (
    <div>
      {fromApp && <AppRedirectHandler onPlanSelect={handlePlanSelect} />}
      <PricingPlans currentPlan={suggestedPlan as any} />
    </div>
  )
}