"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useErrorHandler } from "@/lib/error-utils"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  context?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    console.error(`Error in ${this.props.context || "component"}:`, error, errorInfo)

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-red-900">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
            <h3 className="text-lg font-medium">Something went wrong</h3>
          </div>
          <p className="mb-4 text-sm">{this.state.error?.message || "An unexpected error occurred"}</p>
          <Button variant="outline" onClick={() => this.setState({ hasError: false })} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook wrapper for the error boundary
export function ErrorBoundary({ children, context, ...props }: ErrorBoundaryProps) {
  const { handleError } = useErrorHandler()

  const handleBoundaryError = (error: Error, errorInfo: React.ErrorInfo) => {
    handleError(error, context)

    if (props.onError) {
      props.onError(error, errorInfo)
    }
  }

  return (
    <ErrorBoundaryClass {...props} onError={handleBoundaryError} context={context}>
      {children}
    </ErrorBoundaryClass>
  )
}
