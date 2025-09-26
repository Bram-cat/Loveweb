'use client'

import { useUser, UserProfile, UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { User, Settings, Shield, Bell, CreditCard, Key } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense, useRef } from 'react'
import Link from 'next/link'
// import { SubscriptionManagement } from '@/components/subscription-management'

function AccountPageContent() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mobileAuth, setMobileAuth] = useState(false)

  // Extract URL parameters safely
  const userId = searchParams?.get('userId') || null
  const email = searchParams?.get('email') || null
  const source = searchParams?.get('source') || null
  const section = searchParams?.get('section') || null

  // Track if redirect has already happened
  const redirected = useRef(false)

  // Handle mobile authentication parameters once
  useEffect(() => {
    if (source === 'mobile' && userId && email) {
      console.log('Mobile auth parameters detected:', { userId, email, section })
      setMobileAuth(true)
    }
  }, [source, userId, email, section]) // Include all dependencies

  // Handle redirects for unauthenticated users
  useEffect(() => {
    if (isLoaded && !user && !redirected.current) {
      redirected.current = true

      if (mobileAuth && section) {
        // For mobile users, redirect to sign-in with return URL
        const returnUrl = `/account?section=${section}`
        router.push(`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`)
      } else {
        // Regular redirect to sign-in
        router.push('/sign-in')
      }
    }
  }, [isLoaded, user, mobileAuth, section, router]) // Include all dependencies

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center cosmic-bg">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    // Show appropriate message based on mobile auth
    return (
      <div className="min-h-screen flex items-center justify-center cosmic-bg">
        {mobileAuth ? (
          <Card className="glass border-white/10 bg-white/5 backdrop-blur-lg p-8">
            <CardContent className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Redirecting</h2>
              <p className="text-gray-300">Taking you to sign in...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="spinner"></div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen cosmic-bg">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white text-glow">
              Account Settings
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="glass px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors border border-white/10 hover:border-white/20"
            >
              ← Back to Dashboard
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-purple-400/50 hover:ring-purple-400 transition-all duration-300",
                  userButtonPopoverCard: "glass border-white/10 bg-white/10 backdrop-blur-lg",
                  userButtonPopoverText: "text-white",
                  userButtonPopoverActionButton: "text-gray-300 hover:text-white",
                  userButtonPopoverFooter: "border-white/10"
                }
              }}
            />
          </div>
        </div>
      </nav>

      {/* Quick Actions Bar */}
      <section className="relative z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-white/15 bg-white/8 backdrop-blur-lg card-glow">
              <CardContent className="py-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-300 text-gray-300 hover:text-white border border-white/5 hover:border-white/20 hover:scale-105"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    href="/account"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border hover:scale-105 ${
                      !section || section !== 'billing'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                        : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border-white/5 hover:border-white/20'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/account?section=billing"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border hover:scale-105 ${
                      section === 'billing'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                        : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border-white/5 hover:border-white/20'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">Billing</span>
                  </Link>
                  <button
                    onClick={() => alert('Notifications feature coming soon! You\'ll be able to manage email preferences and notification settings here.')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-gray-300 border border-white/5 hover:border-white/10"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="font-medium">Notifications</span>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md ml-1">Soon</span>
                  </button>
                  <button
                    onClick={() => alert('API Access feature coming soon! You\'ll be able to generate API keys and manage integrations here.')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-gray-300 border border-white/5 hover:border-white/10"
                  >
                    <Key className="w-4 h-4" />
                    <span className="font-medium">API Access</span>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md ml-1">Soon</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">
              {section === 'billing' ? 'Billing & Subscription' : 'Account Settings'}
            </h1>
            <p className="text-xl text-gray-300">
              {section === 'billing'
                ? 'Manage your subscription and billing information'
                : 'Manage your profile and security settings'
              }
            </p>
          </motion.div>

          {/* Conditional Content Based on Section */}
          {section === 'billing' ? (
            /* Billing Section */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass border-white/10 bg-white/5 backdrop-blur-lg p-8">
                <CardContent className="text-center">
                  <CreditCard className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
                  <p className="text-gray-300 mb-6">Manage your subscription and billing information</p>
                  <Link
                    href="/pricing"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Manage Subscription
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Clerk Account Management */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="clerk-profile-container">
                <UserProfile
                  path="/account"
                  routing="path"
                  appearance={{
                    baseTheme: undefined,
                    variables: {
                      colorPrimary: '#8b5cf6',
                      colorBackground: 'transparent',
                      colorInputBackground: 'rgba(255, 255, 255, 0.12)',
                      colorInputText: '#ffffff',
                      colorText: '#ffffff',
                      colorTextSecondary: '#d1d5db',
                      colorSuccess: '#10b981',
                      colorDanger: '#ef4444',
                      colorWarning: '#f59e0b',
                      colorNeutral: '#6b7280',
                      borderRadius: '1rem',
                    },
                    elements: {
                      // Hide billing-related elements since we handle billing via Stripe
                      navbarButton__billing: {
                        display: 'none'
                      },
                      navbarMobileMenuButton__billing: {
                        display: 'none'
                      }
                    }
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center cosmic-bg">
          <div className="spinner"></div>
        </div>
      }
    >
      <AccountPageContent />
    </Suspense>
  )
}