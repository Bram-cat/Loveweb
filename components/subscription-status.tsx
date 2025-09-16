'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

interface SubscriptionData {
  subscription: {
    id: string
    tier: 'free' | 'premium' | 'unlimited'
    status: string
    currentPeriodStart?: string
    currentPeriodEnd?: string
    cancelAtPeriodEnd: boolean
    isExpired: boolean
    daysRemaining: number | null
  }
  usage: {
    numerology: number
    loveMatch: number
    trustAssessment: number
    resetDate: string
  }
  limits: {
    numerology: number
    loveMatch: number
    trustAssessment: number
  }
}

export function SubscriptionStatus() {
  const { user, isLoaded } = useUser()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription/status')

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }

      const data = await response.json()
      setSubscriptionData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchSubscriptionStatus()
    }
  }, [isLoaded, user])

  if (!isLoaded || !user) {
    return <div className="animate-pulse">Loading user...</div>
  }

  if (loading) {
    return <div className="animate-pulse">Loading subscription status...</div>
  }

  if (error) {
    return (
      <div className="glass p-8 rounded-3xl border-red-300">
        <div className="text-red-300">
          <p className="font-medium text-white">Error loading subscription</p>
          <p className="text-sm">{error}</p>
          <Button
            onClick={fetchSubscriptionStatus}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!subscriptionData) {
    return <div>No subscription data available</div>
  }

  const { subscription, usage, limits } = subscriptionData

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'text-blue-700 bg-blue-100'
      case 'unlimited': return 'text-purple-700 bg-purple-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusColor = (status: string, isExpired: boolean) => {
    if (isExpired) return 'text-red-700 bg-red-100'
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100'
      case 'canceled': return 'text-red-700 bg-red-100'
      case 'past_due': return 'text-yellow-700 bg-yellow-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (used: number, limit: number) => {
    if (limit === -1) return 'bg-green-500' // Unlimited
    const percentage = (used / limit) * 100
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-4">
      {/* Subscription Overview */}
      <div className="glass p-8 rounded-3xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Subscription Status</h3>
            <div className="flex gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(subscription.tier)}`}>
                {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status, subscription.isExpired)}`}>
                {subscription.isExpired ? 'Expired' : subscription.status}
              </span>
            </div>
          </div>
          <Button
            onClick={fetchSubscriptionStatus}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>

        {subscription.tier !== 'free' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscription.currentPeriodStart && (
              <div>
                <p className="text-sm text-gray-600">Current Period</p>
                <p className="font-medium">
                  {formatDate(subscription.currentPeriodStart)} - {' '}
                  {subscription.currentPeriodEnd && formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            )}

            {subscription.daysRemaining !== null && (
              <div>
                <p className="text-sm text-gray-600">
                  {subscription.daysRemaining > 0 ? 'Days Remaining' : 'Days Overdue'}
                </p>
                <p className={`font-medium ${subscription.daysRemaining <= 7 ? 'text-red-600' : ''}`}>
                  {Math.abs(subscription.daysRemaining)} days
                  {subscription.daysRemaining <= 7 && subscription.daysRemaining > 0 && ' (Expires Soon!)'}
                  {subscription.daysRemaining <= 0 && ' (Expired)'}
                </p>
              </div>
            )}
          </div>
        )}

        {subscription.cancelAtPeriodEnd && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Your subscription will be cancelled at the end of the current period.
            </p>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="glass p-8 rounded-3xl">
        <h3 className="text-2xl font-bold text-white mb-4">Usage Statistics</h3>
        <div className="space-y-4">
          {(['numerology', 'loveMatch', 'trustAssessment'] as const).map((feature) => {
            const used = usage[feature] as number
            const limit = limits[feature] as number
            const percentage = getUsagePercentage(used, limit)
            const color = getUsageColor(used, limit)

            return (
              <div key={feature} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize text-sm font-medium">
                    {feature === 'loveMatch' ? 'Love Match' :
                     feature === 'trustAssessment' ? 'Trust Assessment' :
                     feature}
                  </span>
                  <span className="text-sm text-gray-600">
                    {used} / {limit === -1 ? '∞' : limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${color}`}
                    style={{ width: limit === -1 ? '100%' : `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}

          <div className="text-xs text-gray-400 mt-4">
            Usage resets monthly on the 1st
          </div>
        </div>
      </div>

      {/* Test Mode Actions */}
      {process.env.NODE_ENV === 'development' && (
        <div className="glass p-8 rounded-3xl border-dashed border-blue-300">
          <h3 className="text-2xl font-bold text-white mb-4">Test Mode Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TestPaymentButton
              tier="premium"
              interval="month"
              onSuccess={fetchSubscriptionStatus}
            />
            <TestPaymentButton
              tier="unlimited"
              interval="month"
              onSuccess={fetchSubscriptionStatus}
            />
            <TestCancelButton
              onSuccess={fetchSubscriptionStatus}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Test Payment Button Component
function TestPaymentButton({
  tier,
  interval,
  onSuccess
}: {
  tier: 'premium' | 'unlimited'
  interval: 'month' | 'year'
  onSuccess: () => void
}) {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const handleTestPayment = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch('/api/test-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          tier,
          interval,
        }),
      })

      if (!response.ok) {
        throw new Error('Test payment failed')
      }

      const result = await response.json()
      console.log('Test payment result:', result)
      onSuccess()
    } catch (error) {
      console.error('Error processing test payment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleTestPayment}
      disabled={loading}
      variant="outline"
      size="sm"
      className="text-blue-700 border-blue-300 hover:bg-blue-100"
    >
      {loading ? 'Processing...' : `Test ${tier} ${interval}ly`}
    </Button>
  )
}

// Test Cancel Button Component
function TestCancelButton({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const handleTestCancel = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/test-payment?clerkId=${user.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Test cancellation failed')
      }

      const result = await response.json()
      console.log('Test cancellation result:', result)
      onSuccess()
    } catch (error) {
      console.error('Error processing test cancellation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleTestCancel}
      disabled={loading}
      variant="outline"
      size="sm"
      className="text-red-700 border-red-300 hover:bg-red-100"
    >
      {loading ? 'Processing...' : 'Test Cancel'}
    </Button>
  )
}