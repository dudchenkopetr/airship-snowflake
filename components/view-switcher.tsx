"use client"

import { LayoutGrid, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ViewMode = "cards" | "table"

interface ViewSwitcherProps {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewSwitcher({ viewMode, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 ${viewMode === "cards" ? "text-primary" : "text-gray-500"}`}
        onClick={() => onChange("cards")}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Cards View</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 ${viewMode === "table" ? "text-primary" : "text-gray-500"}`}
        onClick={() => onChange("table")}
      >
        <LayoutList className="h-4 w-4" />
        <span className="sr-only">Table View</span>
      </Button>
    </div>
  )
}
