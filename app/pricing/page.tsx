'use client'

import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Check, Crown, Heart, Sparkles, Star, Zap, Shield, Calculator } from 'lucide-react'
import { useState } from 'react'
import { SUBSCRIPTION_PLANS, formatPrice } from '@/lib/stripe'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      return // User needs to sign in first
    }

    setLoading(priceId)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userEmail: user.primaryEmailAddress?.emailAddress
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to start subscription process. Please try again.'
      alert(`Error: ${errorMessage}`)
    } finally {
      setLoading(null)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const plans = [
    {
      tier: 'free',
      name: 'Free',
      price: 0,
      originalPrice: null,
      interval: null,
      description: 'Get started with basic features',
      features: [
        '3 Numerology readings per month',
        '2 Love Match analyses per month',
        '1 Trust Assessment per month',
        'Basic insights',
        'Community support'
      ],
      cta: 'Current Plan',
      highlight: false,
      icon: Heart,
      gradient: 'from-gray-400 to-gray-600'
    },
    {
      tier: 'premium',
      name: isYearly ? 'Premium Yearly' : 'Premium Monthly',
      price: isYearly ? SUBSCRIPTION_PLANS.premium.yearly.price : SUBSCRIPTION_PLANS.premium.monthly.price,
      originalPrice: isYearly ? SUBSCRIPTION_PLANS.premium.yearly.originalPrice : null,
      interval: isYearly ? 'year' : 'month',
      priceId: isYearly ? SUBSCRIPTION_PLANS.premium.yearly.priceId : SUBSCRIPTION_PLANS.premium.monthly.priceId,
      description: 'Perfect for regular users',
      features: isYearly ? SUBSCRIPTION_PLANS.premium.yearly.features : SUBSCRIPTION_PLANS.premium.monthly.features,
      cta: 'Start Premium',
      highlight: true,
      icon: Sparkles,
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      tier: 'unlimited',
      name: isYearly ? 'Unlimited Yearly' : 'Unlimited Monthly',
      price: isYearly ? SUBSCRIPTION_PLANS.unlimited.yearly.price : SUBSCRIPTION_PLANS.unlimited.monthly.price,
      originalPrice: isYearly ? SUBSCRIPTION_PLANS.unlimited.yearly.originalPrice : null,
      interval: isYearly ? 'year' : 'month',
      priceId: isYearly ? SUBSCRIPTION_PLANS.unlimited.yearly.priceId : SUBSCRIPTION_PLANS.unlimited.monthly.priceId,
      description: 'For power users who want everything',
      features: isYearly ? SUBSCRIPTION_PLANS.unlimited.yearly.features : SUBSCRIPTION_PLANS.unlimited.monthly.features,
      cta: 'Go Unlimited',
      highlight: false,
      icon: Crown,
      gradient: 'from-yellow-500 to-orange-600'
    }
  ]

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
            {!user ? (
              <>
                <SignInButton mode="modal">
                  <button className="glass px-6 py-2 rounded-lg text-white hover:bg-white/20 transition-all">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-lg text-white font-medium btn-cosmic hover:shadow-lg transition-all">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-white">Welcome, {user.firstName}!</span>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="glass px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
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

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-12 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white">Choose Your Cosmic Journey</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 text-glow"
          >
            Unlock Your
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> Full Potential</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Get unlimited access to numerology readings, love compatibility analysis,
            and trust assessments with our premium plans.
          </motion.p>

          {/* Yearly/Monthly Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-4 mb-12"
          >
            <span className={`text-lg ${!isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                isYearly ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 ${
                  isYearly ? 'left-9' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="glass px-3 py-1 rounded-full text-sm text-green-400 font-medium">
                Save up to 20%
              </span>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`relative pricing-card ${
                  plan.highlight
                    ? 'glass border-2 border-pink-500 shadow-2xl scale-105'
                    : 'glass border border-white/10'
                } p-8 rounded-3xl`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-300 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    {plan.tier === 'free' ? (
                      <div className="text-4xl font-bold text-white">Free</div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-4xl font-bold text-white">
                          {formatPrice(plan.price)}
                        </span>
                        <div className="text-left">
                          <div className="text-sm text-gray-400">/{plan.interval}</div>
                          {plan.originalPrice && (
                            <div className="text-sm text-gray-400 line-through">
                              {formatPrice(plan.originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  {plan.tier === 'free' ? (
                    <div className="w-full py-4 px-6 rounded-xl bg-gray-700 text-gray-300 font-semibold">
                      Current Plan
                    </div>
                  ) : !user ? (
                    <SignUpButton mode="modal">
                      <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white btn-cosmic shadow-lg'
                          : 'glass text-white hover:bg-white/20'
                      }`}>
                        {plan.cta}
                      </button>
                    </SignUpButton>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.priceId!, plan.name)}
                      disabled={loading === plan.priceId}
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white btn-cosmic shadow-lg'
                          : 'glass text-white hover:bg-white/20'
                      }`}
                    >
                      {loading === plan.priceId ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        plan.cta
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 text-glow">
              Compare All Features
            </h2>
            <p className="text-xl text-gray-300">
              See what you get with each plan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="glass rounded-2xl p-8"
          >
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div></div>
              <div className="text-center">
                <div className="text-white font-semibold">Free</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">Premium</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">Unlimited</div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { feature: 'Numerology readings/month', free: '3', premium: '25', unlimited: '∞' },
                { feature: 'Love Match analyses/month', free: '2', premium: '15', unlimited: '∞' },
                { feature: 'Trust Assessments/month', free: '1', premium: '10', unlimited: '∞' },
                { feature: 'AI-powered insights', free: '✗', premium: '✓', unlimited: '✓' },
                { feature: 'Priority support', free: '✗', premium: '✓', unlimited: '✓' },
                { feature: 'Early access to features', free: '✗', premium: '✗', unlimited: '✓' },
                { feature: 'Export capabilities', free: '✗', premium: '✗', unlimited: '✓' }
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b border-white/10">
                  <div className="text-gray-300">{row.feature}</div>
                  <div className="text-center text-gray-300">{row.free}</div>
                  <div className="text-center text-pink-400">{row.premium}</div>
                  <div className="text-center text-yellow-400">{row.unlimited}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="text-4xl font-bold text-white mb-16 text-glow">
              Frequently Asked Questions
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              {[
                {
                  question: "Can I change my plan anytime?",
                  answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
                },
                {
                  question: "What happens if I cancel?",
                  answer: "You can cancel anytime. Your subscription remains active until the end of your current billing period."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee if you're not satisfied with your subscription."
                },
                {
                  question: "How accurate are the readings?",
                  answer: "Our readings combine ancient numerology with modern AI to provide highly personalized and accurate insights."
                }
              ].map((faq, index) => (
                <div key={index} className="glass p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Lovelock</span>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                © 2024 Lovelock. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                Secure payments powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}