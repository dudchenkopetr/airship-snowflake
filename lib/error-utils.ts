"use client"

import { useToast } from "@/hooks/use-toast"

// Error types
export type ErrorSource = "connection" | "table" | "field-mapping" | "authentication" | "network" | "unknown"

export interface AppError {
  message: string
  source: ErrorSource
  code?: string
  details?: Record<string, any>
  originalError?: unknown
}

// Format error for display
export function formatError(error: unknown): AppError {
  if (typeof error === "string") {
    return {
      message: error,
      source: "unknown",
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      source: "unknown",
      originalError: error,
    }
  }

  return {
    message: "An unknown error occurred",
    source: "unknown",
    originalError: error,
  }
}

// Create a hook for handling errors
export function useErrorHandler() {
  const { addToast } = useToast()

  const handleError = (error: unknown, context?: string) => {
    const formattedError = formatError(error)

    // Log error to console
    console.error(`Error${context ? ` in ${context}` : ""}:`, formattedError)

    // Show toast notification
    addToast({
      title: context ? `Error in ${context}` : "Error",
      description: formattedError.message,
      type: "error",
      duration: 7000,
    })

    // Return formatted error for further handling if needed
    return formattedError
  }

  return { handleError }
}

// Async error wrapper
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorHandler: (error: unknown) => void,
  context?: string,
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    errorHandler(error)
    return undefined
  }
}
