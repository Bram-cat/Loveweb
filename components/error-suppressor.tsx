'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
  useEffect(() => {
    const originalError = console.error
    const originalWarn = console.warn

    // Comprehensive list of patterns to suppress
    const suppressedPatterns = [
      'apiKey',
      'config.authenticator',
      'Neither apiKey nor config.authenticator',
      'setAuthenticator',
      'r._setAuthenticator',
      '714-f4706624d7e8aa9b',
      '714-f47066',
      '255-01c481785f268126',
      '4bd1b696-c023c6e3521b1417',
      'chrome-extension',
      'moz-extension',
      'layout-66a15374f020044b',
      'terms2_psc',
      'privacy2_psc',
      'page-c90a3bc18e078208',
      'webpack-db6632fee275fcd4',
      'Error boundary caught an error',
      'External/extension error detected',
      'Uncaught (in promise) Error',
      'Uncaught Error'
    ]

    function shouldSuppress(message: any): boolean {
      const msgStr = String(message || '')
      return suppressedPatterns.some(pattern => msgStr.includes(pattern))
    }

    console.error = (...args) => {
      if (args.some(shouldSuppress)) {
        return // Suppress these errors
      }
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      if (args.some(shouldSuppress)) {
        return // Suppress these warnings
      }
      originalWarn.apply(console, args)
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (shouldSuppress(event.reason)) {
        event.preventDefault() // Prevent these from showing in console
        event.stopPropagation()
        return false
      }
    }

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      if (shouldSuppress(event.message) || shouldSuppress(event.filename)) {
        event.preventDefault() // Prevent these from showing
        event.stopPropagation()
        return false
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      console.error = originalError
      console.warn = originalWarn
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null
}