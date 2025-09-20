'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import {
  Calculator,
  Heart,
  Shield,
  Sparkles,
  Users,
  Star,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react'

interface QuickNumerologyProps {
  name: string
  birthDate: string
}

export function QuickActions() {
  const { addToast } = useToast()
  const [numerologyData, setNumerologyData] = useState<QuickNumerologyProps>({
    name: '',
    birthDate: ''
  })
  const [compatibilityData, setCompatibilityData] = useState({
    yourName: '',
    partnerName: '',
    yourBirthDate: '',
    partnerBirthDate: ''
  })
  const [trustData, setTrustData] = useState({
    personName: '',
    meetingContext: ''
  })
  const [loading, setLoading] = useState<string | null>(null)

  const handleQuickNumerology = async () => {
    if (!numerologyData.name || !numerologyData.birthDate) {
      addToast({
        title: "Missing Information",
        description: "Please fill in both your name and birth date",
        variant: "warning"
      })
      return
    }

    setLoading('numerology')

    // Simulate API call
    setTimeout(() => {
      const lifePathNumber = calculateLifePathNumber(numerologyData.birthDate)
      addToast({
        title: `Your Life Path Number: ${lifePathNumber}`,
        description: getLifePathDescription(lifePathNumber),
        variant: "cosmic",
        duration: 10000
      })
      setLoading(null)
    }, 2000)
  }

  const handleQuickCompatibility = async () => {
    if (!compatibilityData.yourName || !compatibilityData.partnerName) {
      addToast({
        title: "Missing Information",
        description: "Please fill in both names for compatibility analysis",
        variant: "warning"
      })
      return
    }

    setLoading('compatibility')

    // Simulate API call
    setTimeout(() => {
      const compatibility = calculateCompatibility(compatibilityData.yourName, compatibilityData.partnerName)
      addToast({
        title: `Compatibility Score: ${compatibility}%`,
        description: getCompatibilityDescription(compatibility),
        variant: "cosmic",
        duration: 10000
      })
      setLoading(null)
    }, 2000)
  }

  const handleQuickTrust = async () => {
    if (!trustData.personName) {
      addToast({
        title: "Missing Information",
        description: "Please enter the person's name for trust assessment",
        variant: "warning"
      })
      return
    }

    setLoading('trust')

    // Simulate API call
    setTimeout(() => {
      const trustScore = calculateTrustScore(trustData.personName, trustData.meetingContext)
      addToast({
        title: `Trust Assessment: ${trustScore}/10`,
        description: getTrustDescription(trustScore),
        variant: "cosmic",
        duration: 10000
      })
      setLoading(null)
    }, 2000)
  }

  // Helper functions for calculations
  const calculateLifePathNumber = (birthDate: string): number => {
    const cleanDate = birthDate.replace(/[^0-9]/g, '')
    let sum = cleanDate.split('').reduce((acc, digit) => acc + parseInt(digit), 0)

    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0)
    }

    return sum
  }

  const getLifePathDescription = (number: number): string => {
    const descriptions: Record<number, string> = {
      1: "Natural leader with strong independence and pioneering spirit",
      2: "Diplomatic peacemaker with excellent cooperation skills",
      3: "Creative communicator with artistic talents and optimism",
      4: "Practical organizer with strong work ethic and reliability",
      5: "Freedom-loving adventurer with dynamic energy",
      6: "Nurturing caretaker with deep sense of responsibility",
      7: "Spiritual seeker with analytical and intuitive nature",
      8: "Ambitious achiever with strong business and material instincts",
      9: "Humanitarian visionary with generous and compassionate nature",
      11: "Intuitive master with spiritual insights and inspiration",
      22: "Master builder with ability to turn dreams into reality",
      33: "Master teacher with exceptional healing and teaching abilities"
    }
    return descriptions[number] || "Unique spiritual path with special purpose"
  }

  const calculateCompatibility = (name1: string, name2: string): number => {
    const getNameValue = (name: string) => {
      return name.toLowerCase().split('').reduce((sum, char) => {
        return sum + (char.charCodeAt(0) - 96)
      }, 0) % 9 || 9
    }

    const value1 = getNameValue(name1)
    const value2 = getNameValue(name2)
    const compatibility = Math.abs(value1 - value2)

    return Math.max(60, 100 - (compatibility * 10))
  }

  const getCompatibilityDescription = (score: number): string => {
    if (score >= 90) return "Exceptional harmony and deep understanding"
    if (score >= 80) return "Strong compatibility with great potential"
    if (score >= 70) return "Good match with some areas to work on"
    if (score >= 60) return "Moderate compatibility requiring effort"
    return "Challenging but potentially rewarding with work"
  }

  const calculateTrustScore = (name: string, context: string): number => {
    const nameScore = name.length % 3 + 6
    const contextBonus = context.length > 10 ? 2 : context.length > 5 ? 1 : 0
    return Math.min(10, nameScore + contextBonus)
  }

  const getTrustDescription = (score: number): string => {
    if (score >= 9) return "Highly trustworthy with strong integrity"
    if (score >= 7) return "Generally reliable with good intentions"
    if (score >= 5) return "Moderate trustworthiness, proceed with caution"
    if (score >= 3) return "Lower trust indicators, be careful"
    return "Significant trust concerns detected"
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2 text-glow">Quick Insights</h2>
        <p className="text-gray-300">Get instant readings and discover immediate insights</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Numerology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-white/10 bg-white/5 backdrop-blur-lg hover:transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calculator className="h-5 w-5 text-purple-400" />
                Quick Numerology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your full name"
                value={numerologyData.name}
                onChange={(e) => setNumerologyData({...numerologyData, name: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                type="date"
                value={numerologyData.birthDate}
                onChange={(e) => setNumerologyData({...numerologyData, birthDate: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
              />
              <Button
                onClick={handleQuickNumerology}
                disabled={loading === 'numerology'}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {loading === 'numerology' ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Calculating...
                  </div>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Life Path Number
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Love Compatibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-white/10 bg-white/5 backdrop-blur-lg hover:transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="h-5 w-5 text-pink-400" />
                Love Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your name"
                value={compatibilityData.yourName}
                onChange={(e) => setCompatibilityData({...compatibilityData, yourName: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="Partner's name"
                value={compatibilityData.partnerName}
                onChange={(e) => setCompatibilityData({...compatibilityData, partnerName: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                onClick={handleQuickCompatibility}
                disabled={loading === 'compatibility'}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                {loading === 'compatibility' ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Analyzing...
                  </div>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Check Compatibility
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Trust Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-white/10 bg-white/5 backdrop-blur-lg hover:transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-blue-400" />
                Trust Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Person's name"
                value={trustData.personName}
                onChange={(e) => setTrustData({...trustData, personName: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="How did you meet? (optional)"
                value={trustData.meetingContext}
                onChange={(e) => setTrustData({...trustData, meetingContext: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                onClick={handleQuickTrust}
                disabled={loading === 'trust'}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {loading === 'trust' ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Assessing...
                  </div>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Assess Trust Level
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card className="glass border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 text-yellow-400" />
              Today's Cosmic Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">
              The universe is aligning to bring you clarity today. Pay attention to patterns in your
              relationships and trust your intuition when making important decisions. Your natural
              empathy is heightened, making it an excellent time for deep conversations and understanding others.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Best time: Evening
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}