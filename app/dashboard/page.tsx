"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Settings,
  Crown,
  Calculator,
  Shield,
  User,
  LogOut,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SubscriptionStatus } from "@/components/subscription-status";
import { SubscriptionManagement } from "@/components/subscription-management";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBillingPortal = async () => {
    try {
      setLoading(true);

      // First get customer information
      const customerResponse = await fetch('/api/get-customer', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!customerResponse.ok) {
        throw new Error('Failed to fetch customer information');
      }

      const customer = await customerResponse.json();

      // Check if user has a real Stripe customer ID
      if (!customer.id || customer.id.startsWith('mock_') || customer.id.startsWith('fallback_')) {
        // User doesn't have an active paid subscription, redirect to pricing
        const shouldRedirect = confirm('You need an active subscription to access the billing portal. Would you like to view our pricing plans?');
        if (shouldRedirect) {
          router.push('/pricing');
        }
        return;
      }

      // Create billing portal session
      const response = await fetch('/api/create-billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customer.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // If no active subscription, redirect to pricing
        if (errorData.error && errorData.error.includes('No active subscription')) {
          const shouldRedirect = confirm('You need an active subscription to access the billing portal. Would you like to view our pricing plans?');
          if (shouldRedirect) {
            router.push('/pricing');
          }
          return;
        }

        throw new Error(errorData.error || 'Failed to create billing portal session');
      }

      const data = await response.json();

      // Redirect to Stripe billing portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to open billing portal. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white text-glow">
              Lovelock
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user.imageUrl}
                alt={user.firstName || "User"}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{user.firstName}</span>
            </div>
            <SignOutButton>
              <button className="glass p-2 rounded-lg text-white hover:bg-white/20 transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </SignOutButton>
          </div>
        </div>
      </nav>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-glow">
              Welcome Back,
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                {user.firstName}
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your cosmic journey continues. Manage your subscription and
              explore your insights.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-1 gap-8">
              {/* Real Subscription Status Component */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SubscriptionStatus />
              </motion.div>

              {/* Subscription Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <SubscriptionManagement />
              </motion.div>

              {/* App Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-3"
              >
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Available in the Lovelock App
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        icon: Calculator,
                        title: "Numerology Readings",
                        description:
                          "Deep insights from your birth date and name",
                      },
                      {
                        icon: Heart,
                        title: "Love Compatibility",
                        description:
                          "Discover relationship potential with anyone",
                      },
                      {
                        icon: Shield,
                        title: "Trust Assessment",
                        description: "Evaluate character and trustworthiness",
                      },
                      {
                        icon: Sparkles,
                        title: "AI Insights",
                        description: "Personalized analysis and predictions",
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="glass p-6 rounded-2xl text-center"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex gap-4 justify-center flex-wrap">
                    <button
                      onClick={handleBillingPortal}
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-xl text-white font-semibold btn-cosmic hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Settings className="w-5 h-5" />
                      <span>{loading ? 'Loading...' : 'Manage Subscription'}</span>
                    </button>
                    <button
                      onClick={() => router.push("/pricing")}
                      className="glass px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all inline-flex items-center space-x-2"
                    >
                      <Crown className="w-5 h-5" />
                      <span>View Plans</span>
                    </button>
                    <button
                      onClick={() => router.push("/privacy")}
                      className="glass px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all inline-flex items-center space-x-2"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Privacy Policy</span>
                    </button>
                    <button
                      onClick={() => router.push("/terms")}
                      className="glass px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all inline-flex items-center space-x-2"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Terms & Conditions</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
