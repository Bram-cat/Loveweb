'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import {
  Heart,
  Star,
  Mail,
  Twitter,
  Instagram,
  Facebook,
  Sparkles,
  Moon,
  Sun,
  Gift,
  Users,
  Shield,
  HelpCircle
} from 'lucide-react'

export function EnhancedFooter() {
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      addToast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "warning"
      })
      return
    }

    setLoading(true)

    // Simulate newsletter signup
    setTimeout(() => {
      addToast({
        title: "Welcome to the Cosmic Circle! ✨",
        description: "You'll receive weekly insights and special cosmic updates",
        variant: "cosmic",
        duration: 8000
      })
      setEmail('')
      setLoading(false)
    }, 1500)
  }

  const handleSocialClick = (platform: string) => {
    addToast({
      title: `Follow us on ${platform}`,
      description: "Join our community for daily insights and cosmic wisdom",
      variant: "info"
    })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 px-6 py-16 border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 mb-6"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white text-glow">Lovelock</span>
            </motion.div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Unlock the mysteries of personality, relationships, and destiny through ancient wisdom and modern insights.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Twitter, name: "Twitter" },
                { icon: Instagram, name: "Instagram" },
                { icon: Facebook, name: "Facebook" }
              ].map((social, index) => (
                <motion.button
                  key={social.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialClick(social.name)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <social.icon className="w-5 h-5 text-gray-300" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-3">
              {[
                { name: "Numerology Readings", icon: Sparkles },
                { name: "Love Compatibility", icon: Heart },
                { name: "Trust Assessment", icon: Shield },
                { name: "Community", icon: Users }
              ].map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group">
                    <item.icon className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                    {item.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {[
                { name: "Help Center", icon: HelpCircle },
                { name: "Privacy Policy", icon: Shield },
                { name: "Terms of Service", icon: Shield },
                { name: "Contact Us", icon: Mail }
              ].map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group">
                    <item.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                    {item.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Cosmic Updates</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get weekly insights, cosmic forecasts, and exclusive features delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Joining...
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Join the Circle
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <Card className="glass border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { number: "50,000+", label: "Happy Users", icon: Users },
                  { number: "1M+", label: "Readings Generated", icon: Sparkles },
                  { number: "98%", label: "Satisfaction Rate", icon: Star },
                  { number: "24/7", label: "Cosmic Support", icon: Moon }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Lovelock. All rights reserved. Made with cosmic energy ✨
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-1">
              <Gift className="w-4 h-4" />
              <span>Version 2.1.0</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
              animate={{
                y: [0, -100, 0],
                x: [0, 50, 0],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  )
}