import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Heart,
  Shield,
  ArrowLeft,
  Eye,
  Brain,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Search
} from 'lucide-react'
import Link from 'next/link'

export default async function TrustAssessmentPage() {
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
            <Shield className="w-4 h-4 mr-2" />
            Trust Assessment
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Evaluate Relationship Dynamics
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gain deep insights into trust levels, relationship patterns, and emotional dynamics. Our advanced assessment helps you understand the foundation of your connections with others.
          </p>
        </div>

        {/* What is Trust Assessment */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span>How Trust Assessment Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Our Trust Assessment analyzes behavioral patterns, communication styles, and emotional indicators to provide insights into relationship dynamics. We evaluate:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Trust Indicators</h4>
                  <p className="text-sm text-gray-600">Signs of reliability and honesty in behavior</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Emotional Patterns</h4>
                  <p className="text-sm text-gray-600">How emotions influence relationship dynamics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Communication Style</h4>
                  <p className="text-sm text-gray-600">How openness and honesty manifest in conversation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Future Potential</h4>
                  <p className="text-sm text-gray-600">Likelihood of building deeper trust over time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-primary-600" />
              <span>Start Your Trust Assessment</span>
            </CardTitle>
            <CardDescription>
              Provide information about the person or relationship you&apos;d like to assess
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="personName">Person&apos;s Name</Label>
                <Input
                  id="personName"
                  placeholder="Enter their full name"
                  className="border-gray-300 focus:border-primary-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationshipType">Relationship Type</Label>
                <select
                  id="relationshipType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select relationship type</option>
                  <option value="romantic">Romantic Partner</option>
                  <option value="friend">Friend</option>
                  <option value="family">Family Member</option>
                  <option value="colleague">Colleague</option>
                  <option value="business">Business Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="knownDuration">How long have you known this person?</Label>
              <select
                id="knownDuration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select duration</option>
                <option value="days">A few days</option>
                <option value="weeks">A few weeks</option>
                <option value="months">A few months</option>
                <option value="1-2years">1-2 years</option>
                <option value="3-5years">3-5 years</option>
                <option value="5+years">5+ years</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificConcerns">Specific Concerns or Observations</Label>
              <Textarea
                id="specificConcerns"
                placeholder="Describe any specific behaviors, situations, or feelings that prompted this assessment..."
                className="border-gray-300 focus:border-primary-500 min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="behaviorExamples">Recent Behavior Examples</Label>
              <Textarea
                id="behaviorExamples"
                placeholder="Share specific examples of their recent behavior or interactions..."
                className="border-gray-300 focus:border-primary-500 min-h-24"
              />
            </div>

            <Button className="w-full bg-gradient-primary text-white hover:opacity-90 text-lg py-3">
              <Shield className="w-5 h-5 mr-2" />
              Generate Trust Assessment Report
            </Button>
          </CardContent>
        </Card>

        {/* Sample Assessment Preview */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Sample Trust Assessment</CardTitle>
            <CardDescription className="text-amber-700">
              Here&apos;s what your comprehensive trust analysis will include:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-amber-200">
              <div>
                <h4 className="font-semibold text-gray-900">Overall Trust Score</h4>
                <p className="text-sm text-gray-600">Based on behavioral analysis and patterns</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">High</Badge>
                <span className="text-2xl font-bold text-green-600">8.2/10</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-gray-900">Reliability</h4>
                </div>
                <p className="text-sm text-gray-600">Consistently follows through on commitments</p>
                <Badge variant="secondary" className="mt-2">Strong</Badge>
              </div>

              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-gray-900">Transparency</h4>
                </div>
                <p className="text-sm text-gray-600">Open and honest in communication</p>
                <Badge variant="secondary" className="mt-2">Good</Badge>
              </div>

              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold text-gray-900">Red Flags</h4>
                </div>
                <p className="text-sm text-gray-600">Areas requiring attention</p>
                <Badge variant="outline" className="mt-2">Minimal</Badge>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-2">Key Findings</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Shows consistent patterns of trustworthy behavior</li>
                <li>• Communication style indicates honesty and openness</li>
                <li>• Minor inconsistencies in some areas need monitoring</li>
                <li>• Strong potential for building deeper trust over time</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
              <p className="text-sm text-gray-600">
                Continue building the relationship with normal caution. Focus on strengthening communication in areas where minor inconsistencies were noted. Consider having open conversations about expectations and boundaries.
              </p>
            </div>

            <p className="text-sm text-amber-700 font-medium">
              Plus detailed behavioral analysis, risk assessment, and actionable advice for your relationship!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}