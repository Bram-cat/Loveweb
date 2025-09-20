"use client"

import React, { createContext, useContext, useState, useCallback, forwardRef } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "warning" | "info" | "cosmic"
  duration?: number
  onClose?: () => void
}

const variantStyles = {
  default: "bg-background border-border text-foreground",
  destructive: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-50",
  success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-50",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-50",
  info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-50",
  cosmic: "bg-gradient-to-r from-purple-50/90 to-pink-50/90 border-purple-200/50 text-purple-900 backdrop-blur-md dark:from-purple-950/90 dark:to-pink-950/90 dark:border-purple-800/50 dark:text-purple-50 shadow-2xl"
}

const variantIcons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  cosmic: CheckCircle
}

const variantIconColors = {
  default: "text-blue-500",
  destructive: "text-red-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  cosmic: "text-purple-500"
}

export const Toast = forwardRef<
  HTMLDivElement,
  ToastProps
>(({ id, title, description, variant = "default", onClose, ...props }, ref) => {
  const Icon = variantIcons[variant]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full max-w-sm items-start space-x-3 rounded-lg border p-4 shadow-lg transition-all duration-300",
        "animate-in slide-in-from-right-full",
        variantStyles[variant]
      )}
      {...props}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", variantIconColors[variant])} />
      <div className="flex-1 space-y-1">
        {title && (
          <div className="font-semibold text-sm leading-none">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90 leading-relaxed">{description}</div>
        )}
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  )
})
Toast.displayName = "Toast"

export interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}