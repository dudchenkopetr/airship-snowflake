"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex items-center gap-1 mx-auto"
        >
          <ChevronLeft className="h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  )
} 