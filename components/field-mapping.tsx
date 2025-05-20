"use client"

import { useState } from "react"
import { Plus, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FieldMapping } from "@/lib/types"

interface FieldMappingProps {
  fieldMappings: FieldMapping[]
  onChange: (fieldMappings: FieldMapping[]) => void
}

export default function FieldMappingComponent({ fieldMappings, onChange }: FieldMappingProps) {
  const [editingMapping, setEditingMapping] = useState<FieldMapping | null>(null)
  const [newMapping, setNewMapping] = useState<Partial<FieldMapping>>({
    externalAttributeName: "",
    airshipAttributeName: "",
    fieldType: "Text",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fieldTypes = ["Text", "Number", "Date", "Version", "JSON"] as const

  const handleAddMapping = () => {
    const newErrors: Record<string, string> = {}

    if (!newMapping.externalAttributeName?.trim()) {
      newErrors.externalAttributeName = "External attribute name is required"
    }

    if (!newMapping.airshipAttributeName?.trim()) {
      newErrors.airshipAttributeName = "Airship attribute name is required"
    }

    if (!newMapping.fieldType) {
      newErrors.fieldType = "Field type is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const mapping: FieldMapping = {
        id: Math.random().toString(36).substring(2, 9),
        externalAttributeName: newMapping.externalAttributeName!,
        airshipAttributeName: newMapping.airshipAttributeName!,
        fieldType: newMapping.fieldType as "Text" | "Number" | "Date" | "Version" | "JSON",
      }

      // Add new mapping at the beginning of the array
      onChange([mapping, ...fieldMappings])

      // Reset form
      setNewMapping({
        externalAttributeName: "",
        airshipAttributeName: "",
        fieldType: "Text",
      })
      setErrors({})
    }
  }

  const handleDeleteMapping = (id: string) => {
    onChange(fieldMappings.filter((mapping) => mapping.id !== id))
  }

  const handleEditMapping = (mapping: FieldMapping) => {
    setEditingMapping(mapping)
  }

  const handleSaveEdit = () => {
    if (editingMapping) {
      const newErrors: Record<string, string> = {}

      if (!editingMapping.externalAttributeName?.trim()) {
        newErrors.editExternalAttributeName = "External attribute name is required"
      }

      if (!editingMapping.airshipAttributeName?.trim()) {
        newErrors.editAirshipAttributeName = "Airship attribute name is required"
      }

      if (!editingMapping.fieldType) {
        newErrors.editFieldType = "Field type is required"
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        onChange(fieldMappings.map((mapping) => (mapping.id === editingMapping.id ? editingMapping : mapping)))
        setEditingMapping(null)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingMapping(null)
    setErrors({})
  }

  const handleEditChange = (field: keyof FieldMapping, value: string) => {
    if (editingMapping) {
      setEditingMapping({
        ...editingMapping,
        [field]: value,
      })

      // Clear error when field is edited
      if (errors[`edit${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
        setErrors((prev) => ({
          ...prev,
          [`edit${field.charAt(0).toUpperCase() + field.slice(1)}`]: "",
        }))
      }
    }
  }

  const handleNewMappingChange = (field: keyof Omit<FieldMapping, "id">, value: string) => {
    setNewMapping({
      ...newMapping,
      [field]: value,
    })

    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <div className="p-3 border-b bg-gray-50">
          <h3 className="text-sm font-medium" id="field-mappings-heading">
            Field Mappings
          </h3>
          <p className="text-xs text-gray-500">Map Snowflake fields to Airship attributes</p>
        </div>

        <div className="p-3" aria-labelledby="field-mappings-heading">
          {/* Add New Field Mapping Section - Now First */}
          <div className="border-b pb-4 mb-4">
            <h4 className="text-sm font-medium mb-2" id="add-mapping-heading">
              Add New Field Mapping
            </h4>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-visible"
              role="form"
              aria-labelledby="add-mapping-heading"
            >
              <div className="overflow-visible p-0.5">
                <Label htmlFor="externalAttributeName" className="text-xs mb-1 block">
                  External Attribute Name
                </Label>
                <Input
                  id="externalAttributeName"
                  value={newMapping.externalAttributeName}
                  onChange={(e) => handleNewMappingChange("externalAttributeName", e.target.value)}
                  placeholder="e.g., EMAIL"
                  className={`h-8 ${errors.externalAttributeName ? "border-red-500" : ""}`}
                  aria-required="true"
                  aria-invalid={errors.externalAttributeName ? "true" : "false"}
                  aria-describedby={errors.externalAttributeName ? "ext-attr-error" : undefined}
                />
                {errors.externalAttributeName && (
                  <p id="ext-attr-error" className="text-xs text-red-500 mt-1">
                    {errors.externalAttributeName}
                  </p>
                )}
              </div>
              <div className="overflow-visible p-0.5">
                <Label htmlFor="airshipAttributeName" className="text-xs mb-1 block">
                  Airship Attribute Name
                </Label>
                <Input
                  id="airshipAttributeName"
                  value={newMapping.airshipAttributeName}
                  onChange={(e) => handleNewMappingChange("airshipAttributeName", e.target.value)}
                  placeholder="e.g., email"
                  className={`h-8 ${errors.airshipAttributeName ? "border-red-500" : ""}`}
                  aria-required="true"
                  aria-invalid={errors.airshipAttributeName ? "true" : "false"}
                  aria-describedby={errors.airshipAttributeName ? "air-attr-error" : undefined}
                />
                {errors.airshipAttributeName && (
                  <p id="air-attr-error" className="text-xs text-red-500 mt-1">
                    {errors.airshipAttributeName}
                  </p>
                )}
              </div>
              <div className="overflow-visible p-0.5">
                <Label htmlFor="fieldType" className="text-xs mb-1 block">
                  Field Type
                </Label>
                <Select
                  value={newMapping.fieldType}
                  onValueChange={(value) =>
                    handleNewMappingChange("fieldType", value as "Text" | "Number" | "Date" | "Version" | "JSON")
                  }
                >
                  <SelectTrigger
                    id="fieldType"
                    className={`h-8 ${errors.fieldType ? "border-red-500" : ""}`}
                    aria-required="true"
                    aria-invalid={errors.fieldType ? "true" : "false"}
                    aria-describedby={errors.fieldType ? "field-type-error" : undefined}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fieldType && (
                  <p id="field-type-error" className="text-xs text-red-500 mt-1">
                    {errors.fieldType}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                onClick={handleAddMapping}
                size="sm"
                variant="outline"
                className="h-8 py-0"
                aria-label="Add new field mapping"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Field Mapping
              </Button>
            </div>
          </div>

          {/* Existing Field Mappings - Now Second */}
          {fieldMappings.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500" aria-live="polite">
              No field mappings added yet. Add your first mapping above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Field mappings">
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="text-left py-2 px-3 font-medium">
                      External Attribute
                    </th>
                    <th scope="col" className="text-left py-2 px-3 font-medium">
                      Airship Attribute
                    </th>
                    <th scope="col" className="text-left py-2 px-3 font-medium">
                      Type
                    </th>
                    <th scope="col" className="text-right py-2 px-3 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fieldMappings.map((mapping) => (
                    <tr key={mapping.id} className="border-b last:border-b-0">
                      {editingMapping && editingMapping.id === mapping.id ? (
                        <>
                          <td className="py-2 px-3 overflow-visible">
                            <Input
                              value={editingMapping.externalAttributeName}
                              onChange={(e) => handleEditChange("externalAttributeName", e.target.value)}
                              className={`h-8 ${errors.editExternalAttributeName ? "border-red-500" : ""}`}
                              aria-required="true"
                              aria-invalid={errors.editExternalAttributeName ? "true" : "false"}
                              aria-describedby={errors.editExternalAttributeName ? "edit-ext-attr-error" : undefined}
                            />
                            {errors.editExternalAttributeName && (
                              <p id="edit-ext-attr-error" className="text-xs text-red-500 mt-1">
                                {errors.editExternalAttributeName}
                              </p>
                            )}
                          </td>
                          <td className="py-2 px-3 overflow-visible">
                            <Input
                              value={editingMapping.airshipAttributeName}
                              onChange={(e) => handleEditChange("airshipAttributeName", e.target.value)}
                              className={`h-8 ${errors.editAirshipAttributeName ? "border-red-500" : ""}`}
                              aria-required="true"
                              aria-invalid={errors.editAirshipAttributeName ? "true" : "false"}
                              aria-describedby={errors.editAirshipAttributeName ? "edit-air-attr-error" : undefined}
                            />
                            {errors.editAirshipAttributeName && (
                              <p id="edit-air-attr-error" className="text-xs text-red-500 mt-1">
                                {errors.editAirshipAttributeName}
                              </p>
                            )}
                          </td>
                          <td className="py-2 px-3 overflow-visible">
                            <Select
                              value={editingMapping.fieldType}
                              onValueChange={(value) =>
                                handleEditChange("fieldType", value as "Text" | "Number" | "Date" | "Version" | "JSON")
                              }
                            >
                              <SelectTrigger
                                className={`h-8 ${errors.editFieldType ? "border-red-500" : ""}`}
                                aria-required="true"
                                aria-invalid={errors.editFieldType ? "true" : "false"}
                                aria-describedby={errors.editFieldType ? "edit-field-type-error" : undefined}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.editFieldType && (
                              <p id="edit-field-type-error" className="text-xs text-red-500 mt-1">
                                {errors.editFieldType}
                              </p>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex justify-end space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={handleSaveEdit}
                                aria-label="Save changes"
                              >
                                <Save className="h-3.5 w-3.5" />
                                <span className="sr-only">Save</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={handleCancelEdit}
                                aria-label="Cancel editing"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-3">{mapping.externalAttributeName}</td>
                          <td className="py-2 px-3">{mapping.airshipAttributeName}</td>
                          <td className="py-2 px-3">{mapping.fieldType}</td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex justify-end space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEditMapping(mapping)}
                                aria-label={`Edit ${mapping.externalAttributeName}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-3.5 w-3.5"
                                >
                                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteMapping(mapping.id)}
                                aria-label={`Delete ${mapping.externalAttributeName}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
