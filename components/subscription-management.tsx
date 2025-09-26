'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, Calendar, CreditCard, ArrowUpCircle, XCircle, RotateCcw } from 'lucide-react'

interface SubscriptionManagementData {
  hasSubscription: boolean
  currentTier: 'free' | 'premium' | 'unlimited'
  subscription?: {
    id: string
    status: string
    currentPeriodEnd?: string
    cancelAtPeriodEnd: boolean
    billing_cycle: 'monthly' | 'yearly'
  }
  availableActions: string[]
  stripeSubscriptionId?: string
}

interface PriceOption {
  priceId: string
  tier: 'premium' | 'unlimited'
  interval: 'month' | 'year'
  price: number
  name: string
}

export function SubscriptionManagement() {
  const { user, isLoaded } = useUser()
  const [managementData, setManagementData] = useState<SubscriptionManagementData | null>(null)
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch subscription management data
  const fetchManagementData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching subscription management data...')

      // Try the main API first
      let response = await fetch('/api/subscription/manage')

      // If main API fails, try the simple status API
      if (!response.ok) {
        console.log('Main API failed, trying simple status API...')
        response = await fetch('/api/get-customer')
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API response not ok:', response.status, errorText)
        throw new Error(`Failed to fetch subscription data: ${response.status}`)
      }

      const data = await response.json()
      console.log('Subscription management data received:', data)

      // Transform the data to match expected format
      const transformedData: SubscriptionManagementData = {
        hasSubscription: data.subscription?.status !== 'free' && !data.subscription?.id?.startsWith('mock_'),
        currentTier: data.subscription?.tier || 'free',
        subscription: data.subscription ? {
          id: data.subscription.id,
          status: data.subscription.status,
          currentPeriodEnd: data.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd || false,
          billing_cycle: 'monthly' // Default fallback
        } : undefined,
        availableActions: [],
        stripeSubscriptionId: data.subscription?.id
      }

      setManagementData(transformedData)
    } catch (err) {
      console.error('Error fetching subscription management data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchManagementData()
    }
  }, [isLoaded, user])

  // Handle billing portal redirect
  const handleBillingPortal = async () => {
    try {
      setActionLoading('billing_portal')

      // First get customer information
      const customerResponse = await fetch('/api/get-customer', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!customerResponse.ok) {
        throw new Error('Failed to fetch customer information')
      }

      const customer = await customerResponse.json()

      // Check if user has a real Stripe customer ID
      if (!customer.id || customer.id.startsWith('mock_') || customer.id.startsWith('fallback_')) {
        // User doesn't have an active paid subscription, redirect to pricing
        alert('Billing portal is only available for active paid subscriptions. Please upgrade to access billing management.')
        window.location.href = '/pricing'
        return
      }

      // Create billing portal session
      const response = await fetch('/api/create-billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customer.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // If no active subscription or billing portal not configured, redirect to pricing
        if (errorData.error && (
          errorData.error.includes('No active subscription') ||
          errorData.error.includes('configuration') ||
          errorData.error.includes('not been created')
        )) {
          alert('Billing portal is temporarily unavailable. Please use the pricing page to manage your subscription.')
          window.location.href = '/pricing'
          return
        }

        throw new Error(errorData.error || 'Failed to create billing portal session')
      }

      const data = await response.json()

      // Redirect to Stripe billing portal
      window.location.href = data.url

    } catch (err) {
      console.error('Error opening billing portal:', err)
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to open billing portal'}`)
    } finally {
      setActionLoading(null)
    }
  }

  if (!isLoaded || !user) {
    return <div className="animate-pulse">Loading user...</div>
  }

  if (loading) {
    return <div className="animate-pulse">Loading subscription management...</div>
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            <p className="font-medium">Error loading subscription management</p>
            <p className="text-sm">{error}</p>
            <Button onClick={fetchManagementData} className="mt-2" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!managementData) {
    return <div>No subscription data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={managementData.currentTier === 'free' ? 'secondary' : 'default'}>
                {managementData.currentTier.charAt(0).toUpperCase() + managementData.currentTier.slice(1)}
              </Badge>
              {managementData.hasSubscription && (
                <Badge variant="outline">
                  Monthly
                </Badge>
              )}
            </div>

            {managementData.hasSubscription && (
              <Button
                onClick={handleBillingPortal}
                disabled={actionLoading === 'billing_portal'}
                variant="outline"
                size="sm"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {actionLoading === 'billing_portal' ? 'Loading...' : 'Billing Portal'}
              </Button>
            )}
          </div>

          {managementData.subscription?.currentPeriodEnd && (
            <div className="text-sm text-gray-600">
              <Calendar className="h-4 w-4 inline mr-1" />
              Next billing: {new Date(managementData.subscription.currentPeriodEnd).toLocaleDateString()}
            </div>
          )}

          {managementData.subscription?.cancelAtPeriodEnd && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Your subscription will be cancelled at the end of the current period.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Management Actions */}
      {managementData.hasSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Management</CardTitle>
            <CardDescription>
              Use the billing portal to manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleBillingPortal}
              disabled={actionLoading === 'billing_portal'}
              className="w-full"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {actionLoading === 'billing_portal' ? 'Loading...' : 'Manage Subscription'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upgrade from Free */}
      {!managementData.hasSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
            <CardDescription>
              Choose a plan to unlock premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                onClick={() => {
                  window.location.href = '/pricing'
                }}
                className="justify-between"
              >
                <span>View Pricing Plans</span>
                <ArrowUpCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}