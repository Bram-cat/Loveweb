import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lovelock - Unlock Your Heart\'s Secrets',
  description: 'Unlock hidden secrets about yourself and others. Discover personality patterns, predict behavior, and master the art of reading people.',
  keywords: ['personality', 'numerology', 'astrology', 'self-discovery', 'character analysis', 'psychology', 'mind reading', 'prediction', 'life insights'],
  authors: [{ name: 'Lovelock Team' }],
  openGraph: {
    title: 'Lovelock - Unlock Your Heart\'s Secrets',
    description: 'Discover personality patterns, predict behavior, and master the art of reading people using ancient numerology and modern psychology.',
    url: 'https://lovelock.it.com',
    siteName: 'Lovelock',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lovelock - Unlock Your Heart\'s Secrets',
    description: 'Discover personality patterns, predict behavior, and master the art of reading people.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#667eea',
          colorBackground: '#ffffff',
          borderRadius: '12px'
        }
      }}
    >
      <html lang="en">
        <body className={cn(inter.className, 'antialiased')}>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}