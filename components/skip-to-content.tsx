"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function SkipToContent() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <a
      href="#main-content"
      className={cn(
        "fixed top-2 left-2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md",
        "opacity-0 focus:opacity-100 pointer-events-none focus:pointer-events-auto",
        "transform -translate-y-12 focus:translate-y-0 transition",
      )}
    >
      Skip to content
    </a>
  )
}
