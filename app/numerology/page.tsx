import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Heart,
  Star,
  Calculator,
  Sparkles,
  ArrowLeft,
  Calendar,
  User
} from 'lucide-react'
import Link from 'next/link'

export default async function NumerologyPage() {
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
              <span className="font-display font-bold text-xl text-gray-900">Lovelock</span>
            </Link>

            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary/10 text-primary-700 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Numerology Reading
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Personality Secrets
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover hidden personality traits, life patterns, and destiny insights through the ancient wisdom of numerology. Your birth date and name reveal powerful truths about your character.
          </p>
        </div>

        {/* What is Numerology */}
        <Card className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>What is Numerology?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Numerology is the ancient practice of finding meaning in numbers and their relationship to your life. By analyzing your birth date and the numerical values of your name, we can uncover:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Life Path Number</h4>
                  <p className="text-sm text-gray-600">Your core personality and life purpose</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Destiny Number</h4>
                  <p className="text-sm text-gray-600">Your natural talents and abilities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Soul Urge Number</h4>
                  <p className="text-sm text-gray-600">Your inner desires and motivations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Personality Insights</h4>
                  <p className="text-sm text-gray-600">How others perceive you</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-primary-600" />
              <span>Get Your Numerology Reading</span>
            </CardTitle>
            <CardDescription>
              Enter your information below to receive a personalized numerology analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  className="border-gray-300 focus:border-primary-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  className="border-gray-300 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                className="border-gray-300 focus:border-primary-500"
              />
            </div>

            <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
              <Star className="w-4 h-4 mr-2" />
              Generate My Numerology Reading
            </Button>
          </CardContent>
        </Card>

        {/* Sample Reading Preview */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Sample Reading Preview</CardTitle>
            <CardDescription className="text-orange-700">
              Here&apos;s what your personalized reading will include:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-gray-900 mb-2">Life Path Number: 7</h4>
              <p className="text-sm text-gray-600">
                You are a natural seeker of truth with deep analytical abilities. Your path involves spiritual growth, introspection, and the pursuit of wisdom. You have an intuitive nature and are drawn to mystical and philosophical subjects.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-gray-900 mb-2">Destiny Number: 3</h4>
              <p className="text-sm text-gray-600">
                You possess natural creative talents and excellent communication skills. Your destiny involves inspiring and entertaining others through your artistic abilities and charismatic personality.
              </p>
            </div>
            <p className="text-sm text-orange-700 font-medium">
              Plus detailed insights into your personality, strengths, challenges, and life guidance!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}