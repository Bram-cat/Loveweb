import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Star,
  Users,
  Crown,
  Zap,
  CheckCircle,
  ArrowRight,
  Download,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get user subscription info from Supabase
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  const subscriptionTier = userData?.subscription_tier || 'free'
  const subscriptionStatus = userData?.subscription_status || 'active'

  const getUsageLimits = (tier: string) => {
    switch (tier) {
      case 'premium':
        return { numerology: 50, loveMatch: 50, trustAssessment: 50 }
      case 'unlimited':
        return { numerology: '∞', loveMatch: '∞', trustAssessment: '∞' }
      default:
        return { numerology: 5, loveMatch: 5, trustAssessment: 5 }
    }
  }

  const limits = getUsageLimits(subscriptionTier)

  const features = [
    {
      icon: Star,
      title: "Numerology Readings",
      description: "Unlock hidden personality traits and life patterns",
      usage: `0 / ${limits.numerology}`,
      available: true,
      href: "/numerology"
    },
    {
      icon: Heart,
      title: "Love Match Analysis",
      description: "Discover your compatibility with anyone",
      usage: `0 / ${limits.loveMatch}`,
      available: true,
      href: "/love-match"
    },
    {
      icon: Users,
      title: "Trust Assessment",
      description: "Evaluate relationship dynamics and trust levels",
      usage: `0 / ${limits.trustAssessment}`,
      available: true,
      href: "/trust-assessment"
    },
    {
      icon: Download,
      title: "Export Reports",
      description: "Download detailed analysis reports",
      usage: "Premium feature",
      available: subscriptionTier !== 'free'
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights and trend analysis",
      usage: "Unlimited feature",
      available: subscriptionTier === 'unlimited'
    }
  ]

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
              <span className="font-display font-bold text-lg sm:text-xl text-gray-900">Lovelock</span>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge
                variant={subscriptionTier === 'free' ? 'outline' : 'default'}
                className={subscriptionTier !== 'free' ? 'bg-gradient-primary text-white' : ''}
              >
                {subscriptionTier === 'free' ? 'Free' :
                 subscriptionTier === 'premium' ? 'Premium' : 'Unlimited'}
              </Badge>
              <UserButton afterSignOutUrl="/">
                <UserButton.UserProfilePage label="Account" />
                <UserButton.UserProfilePage label="Security" url="security" />
              </UserButton>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Lovelock User'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Your journey to unlock your heart&apos;s secrets continues here.
          </p>
        </div>

        {/* Success Message - This would need to be handled via a client component or URL params */}

        {/* Subscription Status */}
        {subscriptionTier === 'free' && (
          <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-orange-800">Upgrade to Premium</CardTitle>
                </div>
                <Link href="/pricing">
                  <Button size="sm" className="bg-gradient-primary text-white">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-orange-700">
                Unlock unlimited readings, advanced AI insights, and premium features.
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => {
            const cardContent = (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      feature.available ? 'bg-gradient-primary' : 'bg-gray-200'
                    }`}>
                      <feature.icon className={`w-5 h-5 ${feature.available ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    {feature.available && <Zap className="w-4 h-4 text-green-500" />}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {feature.usage}
                    </span>
                    {feature.available ? (
                      <Button size="sm" variant="ghost" className="p-1">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {subscriptionTier === 'free' ? 'Premium' : 'Unlimited'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </>
            )

            return feature.available && feature.href ? (
              <Link href={feature.href} key={index}>
                <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer hover:scale-105">
                  {cardContent}
                </Card>
              </Link>
            ) : (
              <Card
                key={index}
                className={`transition-all duration-200 hover:shadow-lg ${
                  feature.available ? 'cursor-pointer hover:scale-105' : 'opacity-60'
                }`}
              >
                {cardContent}
              </Card>
            )
          })}
        </div>

        {/* App Integration Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary-600" />
              <span>Mobile App Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Your subscription is automatically synced with the Lovelock mobile app.
              Download the app to access all features on the go!
            </CardDescription>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">iOS & Android</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Access numerology readings, love matches, and trust assessments from anywhere.
                </p>
                <Button variant="outline" size="sm">
                  Coming Soon
                </Button>
              </div>

              <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Seamless Sync</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your subscription and usage automatically sync across all devices.
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active & Synced
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {subscriptionTier === 'free' && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Ready to unlock your full potential?
            </p>
            <Link href="/pricing">
              <Button size="lg" className="bg-gradient-primary text-white">
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}