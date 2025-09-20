'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Heart,
  Shield,
  Sparkles,
  Star,
  Users,
  TrendingUp,
  Zap
} from 'lucide-react'

interface FeatureCard {
  id: string
  title: string
  icon: React.ComponentType<any>
  description: string
  details: string
  features: string[]
  color: string
}

const features: FeatureCard[] = [
  {
    id: 'numerology',
    title: 'Numerology Readings',
    icon: Calculator,
    description: 'Deep insights from your birth date and name',
    details: 'Discover your life path number, personality traits, and destiny through ancient numerological wisdom. Our advanced algorithms analyze your birth date and name to reveal hidden patterns.',
    features: [
      'Life Path Number calculation',
      'Personality analysis',
      'Destiny number insights',
      'Soul urge interpretation',
      'Monthly predictions'
    ],
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'compatibility',
    title: 'Love Compatibility',
    icon: Heart,
    description: 'Discover relationship potential with anyone',
    details: 'Analyze romantic compatibility between you and your partner using numerology, astrology, and psychological profiling. Get detailed insights into your relationship dynamics.',
    features: [
      'Compatibility percentage',
      'Relationship strengths',
      'Potential challenges',
      'Communication tips',
      'Long-term outlook'
    ],
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'trust',
    title: 'Trust Assessment',
    icon: Shield,
    description: 'Evaluate character and trustworthiness',
    details: 'Use psychological indicators and behavioral analysis to assess the trustworthiness of people in your life. Perfect for business relationships and new connections.',
    features: [
      'Trust score calculation',
      'Behavioral red flags',
      'Character analysis',
      'Risk assessment',
      'Interaction guidelines'
    ],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    icon: Sparkles,
    description: 'Personalized analysis and predictions',
    details: 'Our AI combines multiple data points to provide personalized insights about your future, career, relationships, and personal growth opportunities.',
    features: [
      'Personalized predictions',
      'Career guidance',
      'Relationship advice',
      'Growth opportunities',
      'Daily cosmic insights'
    ],
    color: 'from-amber-500 to-orange-600'
  }
]

export function FlipCardFeatures() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null)

  const handleCardClick = (cardId: string) => {
    setFlippedCard(flippedCard === cardId ? null : cardId)
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative h-64 cursor-pointer"
          onClick={() => handleCardClick(feature.id)}
        >
          <div className="relative w-full h-full preserve-3d">
            <AnimatePresence mode="wait">
              {flippedCard !== feature.id ? (
                <motion.div
                  key="front"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 backface-hidden"
                >
                  <div className="glass border-white/10 bg-white/5 backdrop-blur-lg rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center hover:transform hover:scale-105 transition-all duration-300 card-glow">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Click to learn more
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ rotateY: -180 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: -180 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 backface-hidden"
                >
                  <div className={`bg-gradient-to-br ${feature.color} rounded-3xl p-6 h-full flex flex-col justify-between text-white shadow-2xl`}>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <feature.icon className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-sm opacity-90 mb-4 leading-relaxed">
                        {feature.details}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Key Features:
                      </h4>
                      <ul className="text-xs space-y-1">
                        {feature.features.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-xs opacity-75 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Click to flip back
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  )
}