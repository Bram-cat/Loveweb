'use client'

import { useUser, UserProfile, UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { User, Settings, Shield, Bell, CreditCard, Key } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccountPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center cosmic-bg">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center cosmic-bg">
        <Card className="glass border-white/10 bg-white/5 backdrop-blur-lg p-8">
          <CardContent className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">Please sign in to access your account settings.</p>
          </CardContent>
        </Card>
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
            <a
              href="/dashboard"
              className="glass px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors border border-white/10 hover:border-white/20"
            >
              ← Back to Dashboard
            </a>
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

      {/* Main Content */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">
              Manage Your Account
            </h1>
            <p className="text-xl text-gray-300">
              Update your profile, security settings, and preferences
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Quick Actions Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="glass border-white/15 bg-white/8 backdrop-blur-lg sticky top-6 card-glow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="w-5 h-5 text-purple-400" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-300 text-gray-300 hover:text-white border border-white/5 hover:border-white/20 hover:scale-105"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </a>
                  <a
                    href="/pricing"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-300 text-gray-300 hover:text-white border border-white/5 hover:border-white/20 hover:scale-105"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">Subscription</span>
                  </a>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 text-gray-500 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4" />
                      <span className="font-medium">Notifications</span>
                    </div>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md">Soon</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 text-gray-500 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4" />
                      <span className="font-medium">API Access</span>
                    </div>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md">Soon</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Account Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-4"
            >
              <div className="clerk-profile-container">
                <UserProfile
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
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}