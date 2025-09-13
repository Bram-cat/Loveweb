'use client'

import { useUser, SignOutButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Settings, Crown, Calculator, Shield, User, LogOut, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Mock subscription data for display
  const subscription = {
    tier: 'free',
    status: 'active'
  }

  const usage = {
    numerologyCount: 1,
    loveMatchCount: 0,
    trustAssessmentCount: 0,
    resetDate: new Date()
  }

  const handleBillingPortal = async () => {
    // Placeholder for billing portal - will be implemented later
    alert('Billing portal will be available once backend is fully configured!')
  }

  const handleOpenApp = () => {
    // Try to open mobile app
    window.location.href = 'lovelock://dashboard'

    // Fallback to app store after a delay
    setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)

      if (isIOS) {
        window.open('https://apps.apple.com/app/lovelock', '_blank')
      } else if (isAndroid) {
        window.open('https://play.google.com/store/apps/details?id=com.cowman.lovelock', '_blank')
      }
    }, 1000)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/')
    return null
  }

  const usageLimits = {
    free: { numerology: 3, loveMatch: 2, trustAssessment: 1 },
    premium: { numerology: 25, loveMatch: 15, trustAssessment: 10 },
    unlimited: { numerology: -1, loveMatch: -1, trustAssessment: -1 }
  }

  const currentLimits = subscription ? usageLimits[subscription.tier] : usageLimits.free

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white text-glow">Lovelock</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user.imageUrl}
                alt={user.firstName || 'User'}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{user.firstName}</span>
            </div>
            <SignOutButton>
              <button className="glass p-2 rounded-lg text-white hover:bg-white/20 transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </SignOutButton>
          </div>
        </div>
      </nav>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-glow">
              Welcome Back,
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> {user.firstName}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your cosmic journey continues. Manage your subscription and explore your insights.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Subscription Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="glass p-8 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Subscription Status</h2>
                    {subscription?.tier !== 'free' && (
                      <Crown className="w-8 h-8 text-yellow-400" />
                    )}
                  </div>

                  <div className="mb-6">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      subscription?.tier === 'unlimited'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                        : subscription?.tier === 'premium'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {subscription?.tier?.toUpperCase() || 'FREE'} Plan
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-300 text-lg">
                        Status: <span className="text-white font-semibold capitalize">{subscription?.status || 'Active'}</span>
                      </p>
                      {subscription?.currentPeriodEnd && (
                        <p className="text-gray-400 mt-2">
                          Renews on: {subscription.currentPeriodEnd.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {subscription?.tier === 'free' ? (
                      <button
                        onClick={() => router.push('/pricing')}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-xl text-white font-semibold btn-cosmic hover:shadow-lg transition-all"
                      >
                        Upgrade to Premium
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleBillingPortal}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-xl text-white font-semibold btn-cosmic hover:shadow-lg transition-all"
                        >
                          Manage Billing
                        </button>
                        <button
                          onClick={() => router.push('/pricing')}
                          className="glass px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all"
                        >
                          Change Plan
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>

                  <div className="space-y-4">
                    <button
                      onClick={handleOpenApp}
                      className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-5 h-5 text-pink-400" />
                        <span className="text-white">Open Lovelock App</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => router.push('/pricing')}
                      className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">View Plans</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </button>

                    {subscription?.tier !== 'free' && (
                      <button
                        onClick={handleBillingPortal}
                        className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-white/20 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <Settings className="w-5 h-5 text-blue-400" />
                          <span className="text-white">Billing Portal</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Usage Statistics */}
              {usage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-3"
                >
                  <div className="glass p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">Usage This Month</h3>
                      <div className="text-sm text-gray-400">
                        Resets on: {new Date(usage.resetDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        {
                          icon: Calculator,
                          name: 'Numerology',
                          used: usage.numerologyCount,
                          limit: currentLimits.numerology,
                          color: 'from-blue-500 to-purple-600'
                        },
                        {
                          icon: Heart,
                          name: 'Love Match',
                          used: usage.loveMatchCount,
                          limit: currentLimits.loveMatch,
                          color: 'from-pink-500 to-red-600'
                        },
                        {
                          icon: Shield,
                          name: 'Trust Assessment',
                          used: usage.trustAssessmentCount,
                          limit: currentLimits.trustAssessment,
                          color: 'from-green-500 to-teal-600'
                        }
                      ].map((item, index) => (
                        <div key={index} className="glass p-6 rounded-2xl">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                              <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-white">{item.name}</span>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-2xl font-bold text-white">
                                {item.used}
                              </span>
                              <span className="text-gray-400">
                                {item.limit === -1 ? '∞' : `/ ${item.limit}`}
                              </span>
                            </div>

                            {item.limit !== -1 && (
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-300`}
                                  style={{
                                    width: `${Math.min((item.used / item.limit) * 100, 100)}%`
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="text-sm text-gray-400">
                            {item.limit === -1
                              ? 'Unlimited'
                              : `${item.limit - item.used} remaining`
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* App Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-3"
              >
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Available in the Lovelock App</h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        icon: Calculator,
                        title: "Numerology Readings",
                        description: "Deep insights from your birth date and name"
                      },
                      {
                        icon: Heart,
                        title: "Love Compatibility",
                        description: "Discover relationship potential with anyone"
                      },
                      {
                        icon: Shield,
                        title: "Trust Assessment",
                        description: "Evaluate character and trustworthiness"
                      },
                      {
                        icon: Sparkles,
                        title: "AI Insights",
                        description: "Personalized analysis and predictions"
                      }
                    ].map((feature, index) => (
                      <div key={index} className="glass p-6 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={handleOpenApp}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-xl text-white font-semibold text-lg btn-cosmic hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Open Lovelock App</span>
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}