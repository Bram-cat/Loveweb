'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)

    // Filter out common browser extension/third-party errors
    const isExternalError =
      error.message?.includes('apiKey') ||
      error.message?.includes('config.authenticator') ||
      error.stack?.includes('714-f4706624d7e8aa9b') ||
      error.stack?.includes('255-01c481785f268126') ||
      error.stack?.includes('chrome-extension') ||
      error.stack?.includes('moz-extension')

    if (isExternalError) {
      console.warn('External/extension error detected, ignoring:', error.message)
      // Reset the error state for external errors
      this.setState({ hasError: false })
      return
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-4">We&apos;re sorry, but something unexpected happened.</p>
        <button
          onClick={resetError}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Try again
        </button>
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-gray-500 text-sm">Error details</summary>
          <pre className="mt-2 text-xs text-gray-400 bg-gray-100 p-2 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  )
}

export default ErrorBoundary