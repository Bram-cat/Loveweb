'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Diamond, Heart, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLAN_DETAILS, type PlanType } from '@/lib/stripe'

interface PricingPlansProps {
  currentPlan?: PlanType
}

export function PricingPlans({ currentPlan = 'free' }: PricingPlansProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { user } = useUser()
  const router = useRouter()

  const handleSubscribe = async (priceId: string, planType: PlanType) => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    setLoading(planType)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = (await import('@stripe/stripe-js')).loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      )

      const stripeInstance = await stripe
      if (stripeInstance) {
        await stripeInstance.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(null)
    }
  }

  const plans: Array<{
    key: PlanType
    icon: React.ComponentType<{ className?: string }>
    popular?: boolean
    gradient: string
  }> = [
    {
      key: 'free',
      icon: Heart,
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      key: 'premium',
      icon: Crown,
      popular: true,
      gradient: 'from-green-500 to-green-600',
    },
    {
      key: 'unlimited',
      icon: Diamond,
      gradient: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      {plans.map(({ key, icon: Icon, popular, gradient }) => {
        const plan = PLAN_DETAILS[key]
        const isCurrentPlan = currentPlan === key
        const isFreePlan = key === 'free'

        return (
          <Card
            key={key}
            className={cn(
              "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
              popular && "ring-2 ring-orange-500 scale-105",
              isCurrentPlan && "ring-2 ring-blue-500"
            )}
          >
            {popular && (
              <Badge
                variant="popular"
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
              >
                MOST POPULAR
              </Badge>
            )}

            <div className={cn("h-2 bg-gradient-to-r", gradient)} />

            <CardHeader className="text-center pb-4">
              <div className={cn(
                "mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r text-white mb-4",
                gradient
              )}>
                <Icon className="w-6 h-6" />
              </div>

              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>

              <div className="space-y-1">
                <div className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                  {!isFreePlan && (
                    <span className="text-lg font-normal text-gray-500">/month</span>
                  )}
                </div>
                {isFreePlan && (
                  <CardDescription className="text-sm">Perfect to get started</CardDescription>
                )}
                {key === 'premium' && (
                  <CardDescription className="text-sm">Perfect for regular users</CardDescription>
                )}
                {key === 'unlimited' && (
                  <CardDescription className="text-sm">For power users</CardDescription>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r",
                      gradient
                    )}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-4">
              {isCurrentPlan ? (
                <Button disabled className="w-full" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Current Plan
                </Button>
              ) : isFreePlan ? (
                <Button disabled className="w-full" variant="outline">
                  Always Free
                </Button>
              ) : (
                <Button
                  className={cn(
                    "w-full bg-gradient-to-r text-white font-semibold",
                    gradient,
                    "hover:opacity-90 transition-opacity"
                  )}
                  onClick={() => handleSubscribe((plan as any).priceId || '', key)}
                  disabled={loading === key}
                >
                  {loading === key ? (
                    "Processing..."
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to {plan.name}
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}