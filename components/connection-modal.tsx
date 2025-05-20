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
import { Textarea } from "@/components/ui/textarea"
import type { Connection } from "@/lib/types"

interface ConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (connection: Connection) => void
  connection: Connection | null
}

export default function ConnectionModal({ isOpen, onClose, onSave, connection }: ConnectionModalProps) {
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
      onSave(formData as Connection)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">{connection ? "Edit Connection" : "Add New Connection"}</DialogTitle>
          <DialogDescription className="text-sm">
            {connection ? "Update your Snowflake connection details" : "Enter your Snowflake connection details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3 overflow-visible">
          <div className="grid gap-1.5 p-0.5 overflow-visible">
            <Label htmlFor="name" className="text-sm">
              Connection Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Production Data Warehouse"
              value={formData.name}
              onChange={handleChange}
              className={`h-8 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid gap-1.5 p-0.5 overflow-visible">
            <Label htmlFor="accountUrl">
              Account URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="accountUrl"
              name="accountUrl"
              placeholder="your-account.snowflakecomputing.com"
              value={formData.accountUrl}
              onChange={handleChange}
              className={errors.accountUrl ? "border-red-500" : ""}
            />
            {errors.accountUrl && <p className="text-xs text-red-500">{errors.accountUrl}</p>}
            <p className="text-xs text-gray-500">
              The URL of your Snowflake account (e.g., company-account.snowflakecomputing.com)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-visible">
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
              Encoded Private Key <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="encodedPrivateKey"
              name="encodedPrivateKey"
              placeholder="-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
              value={formData.encodedPrivateKey}
              onChange={handleChange}
              className={`min-h-[80px] font-mono text-xs ${errors.encodedPrivateKey ? "border-red-500" : ""}`}
            />
            {errors.encodedPrivateKey && <p className="text-xs text-red-500">{errors.encodedPrivateKey}</p>}
            <p className="text-xs text-gray-500">
              The PEM-encoded private key for key pair authentication with Snowflake
            </p>
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

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="h-8 py-0">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-8 py-0 bg-primary hover:bg-primary-600">
            Save Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
