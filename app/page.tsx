import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Heart,
  Star,
  Users,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: Heart,
      title: "Love Match Analysis",
      description: "Discover your compatibility with anyone using advanced numerology algorithms."
    },
    {
      icon: Star,
      title: "Numerology Readings",
      description: "Unlock hidden personality traits and life patterns through ancient numerology wisdom."
    },
    {
      icon: Users,
      title: "Trust Assessment",
      description: "Evaluate relationship dynamics and trust levels with precision insights."
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get instant, personalized analysis powered by advanced artificial intelligence."
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Lovelock helped me understand my relationship patterns. The insights are incredibly accurate!"
    },
    {
      name: "David R.",
      rating: 5,
      text: "The numerology readings revealed things about myself I never knew. Amazing accuracy."
    },
    {
      name: "Emma L.",
      rating: 5,
      text: "The love compatibility analysis was spot-on. It helped me navigate my relationships better."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg sm:text-xl text-gray-900">Lovelock</span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/pricing" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm" className="sm:size-default">Pricing</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="sm:size-default">Sign In</Button>
              </Link>
              <Link href="/sign-up" className="hidden xs:inline-block">
                <Button variant="gradient" size="sm" className="sm:size-default">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-secondary-100 animate-gradient" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary/10 text-primary-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Unlock Your Heart&apos;s Secrets
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Discover Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Love </span>
            Destiny
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Master the art of reading people using ancient numerology and modern psychology.
            Predict behavior, understand compatibility, and unlock hidden personality patterns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/pricing">
              <Button size="xl" variant="gradient" className="animate-float">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="xl" variant="outline">
                I Have an Account
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>1M+ Users Trust Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Love & Life
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need to understand yourself and your relationships at a deeper level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-white">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Join thousands of satisfied users who&apos;ve unlocked their potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="font-semibold text-gray-900">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Unlock Your Love Destiny?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-white/90 px-4">
            Join over 1 million users who&apos;ve discovered their true potential
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="xl" className="bg-white text-primary-600 hover:bg-gray-100">
                Choose Your Plan
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold mb-1">1M+</div>
              <div className="text-white/80">Happy Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">99.9%</div>
              <div className="text-white/80">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-white/80">Support</div>
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

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
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
            © 2024 Lovelock. All rights reserved. • Privacy Policy • Terms of Service
          </div>
        </div>
      </footer>
    </div>
  )
}