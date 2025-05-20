"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import type { Connection } from "@/lib/types"

// Custom CSS to hide the X button and adjust drawer padding
import "@/styles/custom-drawer.css"

interface ConnectionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (connection: Connection) => void
  connection: Connection | null
}

export default function ConnectionDrawer({ isOpen, onClose, onSave, connection }: ConnectionDrawerProps) {
  const [formData, setFormData] = useState<Partial<Connection>>({
    name: "",
    accountUrl: "",
    database: "",
    warehouse: "",
    schema: "",
    encodedPrivateKey: "",
    privateKeyPassword: "",
    status: "disconnected",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDefaultsNote, setShowDefaultsNote] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (connection) {
      setFormData({ ...connection })
    } else {
      setFormData({
        name: "",
        accountUrl: "",
        database: "",
        warehouse: "",
        schema: "",
        encodedPrivateKey: "",
        privateKeyPassword: "",
        status: "disconnected",
      })
    }
    setErrors({})
  }, [connection, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Show defaults note when account URL is entered
    if (name === "accountUrl" && value && !formData.database && !formData.warehouse && !formData.schema) {
      setShowDefaultsNote(true)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Connection name is required"
    }

    if (!formData.accountUrl?.trim()) {
      newErrors.accountUrl = "Account URL is required"
    }

    if (!formData.encodedPrivateKey?.trim()) {
      newErrors.encodedPrivateKey = "Encoded Private Key is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoading(true)
      // Fix for the linter error
      try {
        onSave(formData as Connection)
      } finally {
        setIsLoading(false)
      }
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
          {connection ? "Edit Connection" : "Add Connection"}
        </h2>
        
        <Button
          onClick={handleSubmit}
          className="drawer-button bg-primary hover:bg-primary-600"
          aria-label="Save connection"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      <DrawerContent className="drawer-custom-content">
        <div className="grid gap-6 w-full overflow-y-auto overflow-visible pb-4 pt-4">
          <div className="grid gap-1.5 p-0.5 overflow-visible">
            <Label htmlFor="name" className="text-sm">
              Connection Name{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Production Data Warehouse"
              value={formData.name}
              onChange={handleChange}
              className={`h-8 ${errors.name ? "border-red-500" : ""}`}
              aria-required="true"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid gap-1.5 p-0.5 overflow-visible">
            <Label htmlFor="accountUrl">
              Account URL{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            </Label>
            <Input
              id="accountUrl"
              name="accountUrl"
              placeholder="your-account.snowflakecomputing.com"
              value={formData.accountUrl}
              onChange={handleChange}
              className={errors.accountUrl ? "border-red-500" : ""}
              aria-required="true"
              aria-invalid={errors.accountUrl ? "true" : "false"}
              aria-describedby={errors.accountUrl ? "accountUrl-error" : "accountUrl-desc"}
            />
            {errors.accountUrl ? (
              <p id="accountUrl-error" className="text-xs text-red-500">
                {errors.accountUrl}
              </p>
            ) : (
              <p id="accountUrl-desc" className="text-xs text-gray-500">
                The URL of your Snowflake account (e.g., company-account.snowflakecomputing.com)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-visible">
            <div className="grid gap-1.5 p-0.5 overflow-visible">
              <Label htmlFor="database" className="text-sm">
                Database
              </Label>
              <Input
                id="database"
                name="database"
                placeholder="ANALYTICS"
                value={formData.database}
                onChange={handleChange}
                className="h-8"
              />
            </div>

            <div className="grid gap-1.5 p-0.5 overflow-visible">
              <Label htmlFor="warehouse" className="text-sm">
                Warehouse
              </Label>
              <Input
                id="warehouse"
                name="warehouse"
                placeholder="COMPUTE_WH"
                value={formData.warehouse}
                onChange={handleChange}
                className="h-8"
              />
            </div>

            <div className="grid gap-1.5 p-0.5 overflow-visible">
              <Label htmlFor="schema" className="text-sm">
                Schema
              </Label>
              <Input
                id="schema"
                name="schema"
                placeholder="PUBLIC"
                value={formData.schema}
                onChange={handleChange}
                className="h-8"
              />
            </div>
          </div>

          <div className="grid gap-1.5 p-0.5 overflow-visible">
            <Label htmlFor="encodedPrivateKey" className="text-sm">
              Encoded Private Key{" "}
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            </Label>
            <Textarea
              id="encodedPrivateKey"
              name="encodedPrivateKey"
              placeholder="-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
              value={formData.encodedPrivateKey}
              onChange={handleChange}
              className={`min-h-[80px] font-mono text-xs ${errors.encodedPrivateKey ? "border-red-500" : ""}`}
              aria-required="true"
              aria-invalid={errors.encodedPrivateKey ? "true" : "false"}
              aria-describedby={errors.encodedPrivateKey ? "encodedPrivateKey-error" : "encodedPrivateKey-desc"}
            />
            {errors.encodedPrivateKey ? (
              <p id="encodedPrivateKey-error" className="text-xs text-red-500">
                {errors.encodedPrivateKey}
              </p>
            ) : (
              <p id="encodedPrivateKey-desc" className="text-xs text-gray-500">
                The PEM-encoded private key for key pair authentication with Snowflake
              </p>
            )}
          </div>

          <div className="grid gap-1.5 p-0.5 overflow-visible">
            <Label htmlFor="privateKeyPassword">Private Key Password</Label>
            <Input
              id="privateKeyPassword"
              name="privateKeyPassword"
              type="password"
              placeholder="Leave blank if your private key is not password protected"
              value={formData.privateKeyPassword}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">
              Optional: The password for your private key if it is password protected
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
