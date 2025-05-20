"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FieldMappingComponent from "@/components/field-mapping"
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"

// Import custom drawer styling
import "@/styles/custom-drawer.css"
import type { Table, Warehouse, FieldMapping } from "@/lib/types"

interface TableDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (table: Table) => void
  table: Table | null
  warehouse: Warehouse | null
  hasUserSegmentation: boolean
}

export default function TableDrawer({
  isOpen,
  onClose,
  onSave,
  table,
  warehouse,
  hasUserSegmentation,
}: TableDrawerProps) {
  const [formData, setFormData] = useState<Partial<Table>>({
    name: "",
    type: "TABLE",
    identifierColumn: "",
    identifierType: "contact",
    fieldMappings: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (table) {
      setFormData({
        ...table,
      })
    } else {
      setFormData({
        name: "",
        type: "TABLE",
        identifierColumn: "",
        identifierType: "contact",
        fieldMappings: [],
      })
    }
    setErrors({})
  }, [table, warehouse, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }) => {
    // Handle both DOM events and direct value objects
    const name = 'target' in e ? e.target.name : e.name;
    const value = 'target' in e ? e.target.value : e.value;
    
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFieldMappingsChange = (fieldMappings: FieldMapping[]) => {
    setFormData((prev) => ({ ...prev, fieldMappings }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Table/View name is required"
    }

    if (!formData.identifierColumn?.trim()) {
      newErrors.identifierColumn = "Identifier column is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Set default values for fields we're not collecting
      const fullTableData: Table = {
        ...(formData as Table),
        fullPath: warehouse ? `${warehouse.database}.${warehouse.schema}.${formData.name}` : formData.name,
        fieldMappings: formData.fieldMappings || [],
      }
      onSave(fullTableData)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} side="right">
      <div className="drawer-header">
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="drawer-button" 
          aria-label="Cancel and close drawer"
        >
          Cancel
        </Button>
        
        <h2 className="drawer-title">
          {table ? "Edit Table/View" : "Add Table/View"}
        </h2>
        
        <Button
          onClick={handleSubmit}
          className="drawer-button bg-primary hover:bg-primary-600"
          aria-label="Save table/view"
        >
          Save
        </Button>
      </div>

      <DrawerContent className="drawer-custom-content">
        <div className="grid gap-6 overflow-visible pt-4">
          <div className="grid gap-1.5 p-0.5 overflow-visible">
            <Label htmlFor="name" className="text-sm">
              Table/View Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter table or view name"
              value={formData.name}
              onChange={handleChange}
              className={`h-8 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid gap-1.5 p-0.5 overflow-visible">
            <Label htmlFor="identifierColumn" className="text-sm">
              Contact or Channel Identifier
            </Label>
            <Input
              id="identifierColumn"
              name="identifierColumn"
              placeholder="EMAIL, USER_ID, etc."
              value={formData.identifierColumn}
              onChange={handleChange}
              className={`h-8 ${errors.identifierColumn ? "border-red-500" : ""}`}
            />
            {errors.identifierColumn && <p className="text-xs text-red-500">{errors.identifierColumn}</p>}
            <p className="text-xs text-gray-500">The identifier that uniquely identifies each record</p>
          </div>

          <div className="mt-4">
            <FieldMappingComponent fieldMappings={formData.fieldMappings || []} onChange={handleFieldMappingsChange} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
