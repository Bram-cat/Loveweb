'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Smartphone, ArrowRight, CheckCircle } from 'lucide-react'

interface AppRedirectHandlerProps {
  onPlanSelect?: (planType: string) => void
}

export function AppRedirectHandler({ onPlanSelect }: AppRedirectHandlerProps) {
  const searchParams = useSearchParams()
  const { user, isSignedIn } = useUser()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const fromApp = searchParams.get('from') === 'app'
  const planType = searchParams.get('plan')
  const appUserId = searchParams.get('userId')

  useEffect(() => {
    if (planType) {
      setSelectedPlan(planType)
    }
  }, [planType])

  if (!fromApp) return null

  const handlePlanSelection = (plan: string) => {
    setSelectedPlan(plan)
    onPlanSelect?.(plan)
  }

  return (
    <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-blue-900 flex items-center space-x-2">
              <span>Redirected from Lovelock App</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </CardTitle>
            <CardDescription className="text-blue-700">
              Complete your subscription upgrade to unlock premium features
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {!isSignedIn ? (
            <div className="p-4 bg-white/50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Authentication Required</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Please sign in to continue with your subscription upgrade
                  </p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white/50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Welcome, {user?.firstName}!</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your app account is connected. Choose your plan below to continue.
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Heart className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              </div>
            </div>
          )}

          {planType && (
            <div className="p-4 bg-white/70 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-900">
                    Pre-selected Plan: {planType === 'premium' ? 'Premium' : planType === 'unlimited' ? 'Unlimited' : planType}
                  </p>
                  <p className="text-sm text-green-700">
                    This plan was selected in your mobile app
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4 pt-2">
            <div className="flex items-center text-sm text-blue-600">
              <Heart className="w-4 h-4 mr-1" />
              <span>Secure sync with your mobile app</span>
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Instant activation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}