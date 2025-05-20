"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

interface SnowflakeConnectionFormProps {
  onSuccess: () => void
}

export default function SnowflakeConnectionForm({ onSuccess }: SnowflakeConnectionFormProps) {
  const [authMethod, setAuthMethod] = useState("password")
  const [isLoading, setIsLoading] = useState(false)

  const handleTestConnection = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
    }, 2000)
  }

  return (
    <div className="space-y-6 overflow-visible">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible">
        <div className="space-y-2 p-0.5 overflow-visible">
          <Label htmlFor="account">Account Identifier</Label>
          <Input id="account" placeholder="organization-account" />
          <p className="text-xs text-gray-500">Your Snowflake account identifier (e.g., xy12345.us-east-1)</p>
        </div>

        <div className="space-y-2 p-0.5 overflow-visible">
          <Label htmlFor="warehouse">Warehouse</Label>
          <Input id="warehouse" placeholder="COMPUTE_WH" />
          <p className="text-xs text-gray-500">The warehouse that will process your queries</p>
        </div>

        <div className="space-y-2 p-0.5 overflow-visible">
          <Label htmlFor="database">Database</Label>
          <Input id="database" placeholder="MY_DATABASE" />
        </div>

        <div className="space-y-2 p-0.5 overflow-visible">
          <Label htmlFor="schema">Schema</Label>
          <Input id="schema" placeholder="PUBLIC" />
        </div>

        <div className="space-y-2 p-0.5 overflow-visible">
          <Label htmlFor="role">Role</Label>
          <Input id="role" placeholder="ACCOUNTADMIN" />
          <p className="text-xs text-gray-500">The role to use for this connection</p>
        </div>

        <div className="space-y-2 p-0.5 overflow-visible">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="AIRSHIP_USER" />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Authentication Method</Label>
        <Tabs defaultValue="password" onValueChange={setAuthMethod}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="keypair">Key Pair</TabsTrigger>
          </TabsList>
          <TabsContent value="password" className="space-y-4 pt-4 overflow-visible">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </TabsContent>
          <TabsContent value="keypair" className="space-y-4 pt-4 overflow-visible">
            <div className="space-y-2">
              <Label htmlFor="private-key">Private Key</Label>
              <Input id="private-key" type="file" />
              <p className="text-xs text-gray-500">Upload your private key file (.p8)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passphrase">Private Key Passphrase (Optional)</Label>
              <Input id="passphrase" type="password" />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <Label>Advanced Options</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="save-credentials" />
            <Label htmlFor="save-credentials" className="text-sm font-normal">
              Save credentials securely
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ssl" defaultChecked />
            <Label htmlFor="ssl" className="text-sm font-normal">
              Use SSL connection
            </Label>
          </div>
        </div>
      </div>

      <Button onClick={handleTestConnection} className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing Connection...
          </>
        ) : (
          "Test Connection"
        )}
      </Button>
    </div>
  )
}
