'use client'

import { useUser, UserProfile } from '@clerk/nextjs'
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
              className="text-gray-300 hover:text-white transition-colors"
            >
              Back to Dashboard
            </a>
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

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Quick Actions Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="glass border-white/10 bg-white/5 backdrop-blur-lg sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </a>
                  <a
                    href="/pricing"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Subscription</span>
                  </a>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 text-gray-400">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">Soon</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 text-gray-400">
                    <Key className="w-4 h-4" />
                    <span>API Access</span>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">Soon</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Account Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <Card className="glass border-white/10 bg-white/5 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <User className="w-5 h-5" />
                    Profile & Security
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage your personal information, security settings, and account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Clerk UserProfile Component */}
                  <div className="clerk-profile-container">
                    <UserProfile
                      appearance={{
                        baseTheme: undefined,
                        variables: {
                          colorPrimary: '#8b5cf6',
                          colorBackground: 'rgba(255, 255, 255, 0.05)',
                          colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                          colorInputText: '#ffffff',
                          colorText: '#ffffff',
                          colorTextSecondary: '#d1d5db',
                          colorSuccess: '#10b981',
                          colorDanger: '#ef4444',
                          colorWarning: '#f59e0b',
                          colorNeutral: '#6b7280',
                          borderRadius: '0.75rem',
                        },
                        elements: {
                          rootBox: {
                            backgroundColor: 'transparent',
                          },
                          card: {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '1rem',
                          },
                          headerTitle: {
                            color: '#ffffff',
                          },
                          headerSubtitle: {
                            color: '#d1d5db',
                          },
                          formButtonPrimary: {
                            backgroundColor: '#8b5cf6',
                            '&:hover': {
                              backgroundColor: '#7c3aed',
                            },
                          },
                          formFieldInput: {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            '&:focus': {
                              borderColor: '#8b5cf6',
                              boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                            },
                          },
                          formFieldLabel: {
                            color: '#ffffff',
                          },
                          dividerLine: {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                          navbarButton: {
                            color: '#d1d5db',
                            '&:hover': {
                              color: '#ffffff',
                            },
                          },
                          navbarButtonActive: {
                            color: '#8b5cf6',
                          },
                          menuButton: {
                            color: '#d1d5db',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#ffffff',
                            },
                          },
                          menuItemButton: {
                            color: '#d1d5db',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#ffffff',
                            },
                          },
                          profileSectionTitle: {
                            color: '#ffffff',
                          },
                          profileSectionContent: {
                            color: '#d1d5db',
                          },
                          badge: {
                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                            color: '#8b5cf6',
                          },
                          alert: {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}