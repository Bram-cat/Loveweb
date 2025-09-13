import { PricingPlansEnhanced } from '@/components/pricing-plans-enhanced'
import { Button } from '@/components/ui/button'
import { Heart, Shield, Zap, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">Lovelock</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary/10 text-primary-700 text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Choose Your Love Journey
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Unlock Your Heart&apos;s
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Potential</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Select the perfect plan to discover your love destiny and unlock the mysteries of relationships
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-12">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure billing with Stripe</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Instant activation</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-purple-500" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <PricingPlansEnhanced />
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Master Love & Relationships
          </h2>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Free Column */}
              <div className="p-8 border-r border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Free</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    5 numerology readings/month
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    5 love matches/month
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    5 trust assessments/month
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Basic insights
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Community support
                  </li>
                </ul>
              </div>

              {/* Premium Column */}
              <div className="p-8 border-r border-gray-200 bg-gradient-to-br from-green-50 to-green-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Premium</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    50 numerology readings/month
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    50 love matches/month
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    50 trust assessments/month
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Advanced AI insights
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Priority support
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Detailed reports
                  </li>
                </ul>
              </div>

              {/* Unlimited Column */}
              <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Unlimited</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Unlimited numerology readings
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Unlimited love matches
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Unlimited trust assessments
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Premium AI insights
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Priority support
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Export capabilities
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    Advanced analytics
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use Stripe for payment processing, which is the same technology used by millions of businesses worldwide. Your payment information is encrypted and secure.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                You can cancel anytime. You&apos;ll continue to have access to premium features until the end of your current billing period, then you&apos;ll be moved to the free plan.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee. If you&apos;re not satisfied with your premium plan, contact us within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">Lovelock</span>
          </div>

          <p className="text-gray-400 mb-4">
            Unlock hidden secrets about yourself and others through the power of numerology and psychology.
          </p>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Secure billing powered by Stripe</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400 text-sm">
            © 2024 Lovelock. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}