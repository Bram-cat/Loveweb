'use client'

import { useUser, UserProfile } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Shield, ArrowLeft } from 'lucide-react'

export default function SecurityPage() {
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
        <div className="glass p-8 rounded-3xl border-white/10 bg-white/5 backdrop-blur-lg">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">Please sign in to access security settings.</p>
          </div>
        </div>
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white text-glow">
              Security Settings
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <a
              href="/account"
              className="glass px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors border border-white/10 hover:border-white/20 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Account
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">
              Security & Privacy
            </h1>
            <p className="text-xl text-gray-300">
              Manage your security settings, passwords, and privacy preferences
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="clerk-profile-container">
              <UserProfile
                path="/account/security"
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
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}