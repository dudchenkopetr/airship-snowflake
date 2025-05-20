"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FieldMappingComponent from "@/components/field-mapping"
import type { Table, Warehouse, FieldMapping } from "@/lib/types"

interface TableModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (table: Table) => void
  table: Table | null
  warehouse: Warehouse | null
  hasUserSegmentation: boolean
}

export default function TableModal({
  isOpen,
  onClose,
  onSave,
  table,
  warehouse,
  hasUserSegmentation,
}: TableModalProps) {
  const [formData, setFormData] = useState<Partial<Table>>({
    name: "",
    type: "TABLE",
    identifierColumn: "",
    identifierType: "contact",
    fieldMappings: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availableTables, setAvailableTables] = useState<string[]>([
    "CUSTOMERS",
    "ORDERS",
    "PRODUCTS",
    "USER_EVENTS",
    "MARKETING_CAMPAIGNS",
    "CHANNEL_METRICS",
  ])

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
    const { name, value } = e.target ? e.target : e
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">{table ? "Edit Table/View" : "Add New Table/View"}</DialogTitle>
          <DialogDescription className="text-sm">
            {table ? "Update your Snowflake table/view details" : "Enter your Snowflake table/view details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3 overflow-visible">
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
              Contact or Channel Identifier Column
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
            <p className="text-xs text-gray-500">The column that uniquely identifies each record</p>
          </div>

          <div className="mt-2 overflow-visible">
            <FieldMappingComponent fieldMappings={formData.fieldMappings || []} onChange={handleFieldMappingsChange} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="h-8 py-0">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-8 py-0 bg-primary hover:bg-primary-600">
            Save Table/View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
