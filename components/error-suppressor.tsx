'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
  useEffect(() => {
    const originalError = console.error
    const originalWarn = console.warn

    console.error = (...args) => {
      const message = args[0]?.toString() || ''

      // Suppress known external/extension errors
      if (
        message.includes('apiKey nor config.authenticator') ||
        message.includes('714-f4706624d7e8aa9b') ||
        message.includes('255-01c481785f268126') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('terms2_psc') ||
        message.includes('privacy2_psc')
      ) {
        return // Suppress these errors
      }

      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      const message = args[0]?.toString() || ''

      // Suppress known warnings from browser extensions
      if (
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('psc=')
      ) {
        return // Suppress these warnings
      }

      originalWarn.apply(console, args)
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || ''

      if (
        reason.includes('apiKey') ||
        reason.includes('config.authenticator') ||
        reason.includes('714-f4706624d7e8aa9b') ||
        reason.includes('255-01c481785f268126')
      ) {
        event.preventDefault() // Prevent these from showing in console
        return
      }
    }

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      const message = event.message || ''
      const filename = event.filename || ''

      if (
        message.includes('apiKey') ||
        message.includes('config.authenticator') ||
        filename.includes('714-f4706624d7e8aa9b') ||
        filename.includes('255-01c481785f268126') ||
        filename.includes('chrome-extension') ||
        filename.includes('moz-extension')
      ) {
        event.preventDefault() // Prevent these from showing
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