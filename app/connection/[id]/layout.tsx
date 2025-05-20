import React from 'react'

// Sample connection IDs for static generation
const sampleConnectionIds = ["1", "2"]

// This function is called at build time to generate all possible paths
export function generateStaticParams() {
  return sampleConnectionIds.map((id) => ({
    id: id,
  }))
}

export default function ConnectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 