import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Users,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Zap,
  User,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export default async function LoveMatchPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg sm:text-xl text-gray-900">Lovelock</span>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <UserButton afterSignOutUrl="/">
                <UserButton.UserProfilePage label="Account" url="account" labelIcon={<span>👤</span>} />
                <UserButton.UserProfilePage label="Security" url="security" labelIcon={<span>🔒</span>} />
              </UserButton>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary/10 text-primary-700 text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Love Match Analysis
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Your Perfect Match
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Unlock the secrets of romantic compatibility using advanced numerology and psychology. Find out how well you match with someone special and what makes your connection unique.
          </p>
        </div>

        {/* What is Love Match Analysis */}
        <Card className="mb-8 bg-gradient-to-br from-pink-50 to-red-50 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <span>How Love Match Analysis Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Our Love Match Analysis combines numerology, birth date compatibility, and personality insights to give you a comprehensive view of your romantic potential. We analyze:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Emotional Compatibility</h4>
                  <p className="text-sm text-gray-600">How your hearts connect and understand each other</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Communication Style</h4>
                  <p className="text-sm text-gray-600">How well you understand and relate to each other</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Long-term Potential</h4>
                  <p className="text-sm text-gray-600">Your chances for lasting happiness together</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Passion & Chemistry</h4>
                  <p className="text-sm text-gray-600">The spark and attraction between you</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Analysis Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary-600" />
              <span>Analyze Your Love Match</span>
            </CardTitle>
            <CardDescription>
              Enter both your information and your partner&apos;s to discover your compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Your Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yourFirstName">Your First Name</Label>
                  <Input
                    id="yourFirstName"
                    placeholder="Enter your first name"
                    className="border-gray-300 focus:border-primary-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yourLastName">Your Last Name</Label>
                  <Input
                    id="yourLastName"
                    placeholder="Enter your last name"
                    className="border-gray-300 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yourBirthDate">Your Birth Date</Label>
                <Input
                  id="yourBirthDate"
                  type="date"
                  className="border-gray-300 focus:border-primary-500"
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Partner Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <h3 className="text-lg font-semibold text-gray-900">Partner&apos;s Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerFirstName">Partner&apos;s First Name</Label>
                  <Input
                    id="partnerFirstName"
                    placeholder="Enter partner's first name"
                    className="border-gray-300 focus:border-primary-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerLastName">Partner&apos;s Last Name</Label>
                  <Input
                    id="partnerLastName"
                    placeholder="Enter partner's last name"
                    className="border-gray-300 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerBirthDate">Partner&apos;s Birth Date</Label>
                <Input
                  id="partnerBirthDate"
                  type="date"
                  className="border-gray-300 focus:border-primary-500"
                />
              </div>
            </div>

            <Button className="w-full bg-gradient-primary text-white hover:opacity-90 text-lg py-3">
              <Heart className="w-5 h-5 mr-2" />
              Analyze Our Love Compatibility
            </Button>
          </CardContent>
        </Card>

        {/* Sample Analysis Preview */}
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Sample Compatibility Report</CardTitle>
            <CardDescription className="text-green-700">
              Here&apos;s what your detailed love match analysis will include:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
              <div>
                <h4 className="font-semibold text-gray-900">Overall Compatibility</h4>
                <p className="text-sm text-gray-600">Based on numerology and birth analysis</p>
              </div>
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">87%</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Emotional Bond</h4>
                  <Badge variant="secondary">Strong</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  You both share deep emotional intelligence and can connect on a profound level.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Communication</h4>
                  <Badge variant="secondary">Excellent</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Your communication styles complement each other perfectly, creating harmony.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your life path numbers create a powerful spiritual connection</li>
                <li>• You share similar values and long-term goals</li>
                <li>• Your personalities balance each other&apos;s strengths and weaknesses</li>
                <li>• Strong potential for lasting love and partnership</li>
              </ul>
            </div>

            <p className="text-sm text-green-700 font-medium">
              Plus detailed advice on how to strengthen your relationship and overcome challenges!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}