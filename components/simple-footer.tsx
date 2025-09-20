'use client'

import { Heart, Mail, Github, Twitter, Instagram } from 'lucide-react'

export function SimpleFooter() {
  return (
    <footer className="relative z-10 px-6 py-12 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Lovelock</span>
            </div>
            <p className="text-gray-400 text-sm">
              Unlock hidden secrets about yourself and others through ancient numerology and modern psychology.
            </p>
          </div>

          {/* Features */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Numerology Readings</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Love Compatibility</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Trust Assessment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">AI Insights</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-gray-300" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-gray-300" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4 text-gray-300" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">support@lovelock.com</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Lovelock. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Made with ❤️ for cosmic souls</span>
          </div>
        </div>
      </div>
    </footer>
  )
}