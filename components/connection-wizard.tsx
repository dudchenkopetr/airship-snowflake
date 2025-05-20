"use client"

import { useState } from "react"
import { Check, ChevronRight, Database, Snowflake } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SnowflakeConnectionForm from "@/components/snowflake-connection-form"
import ConnectionSuccess from "@/components/connection-success"

export default function ConnectionWizard() {
  const [step, setStep] = useState(1)
  const [connectionType, setConnectionType] = useState("snowflake")
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectionSuccess = () => {
    setIsConnected(true)
    setStep(3)
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-white border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Connect Data Source</CardTitle>
          <div className="flex items-center space-x-2 text-sm">
            <div className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${step >= 1 ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"}`}
              >
                {step > 1 ? <Check className="h-3 w-3" /> : "1"}
              </div>
              <span className="ml-2">Select Source</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${step >= 2 ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"}`}
              >
                {step > 2 ? <Check className="h-3 w-3" /> : "2"}
              </div>
              <span className="ml-2">Configure</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${step >= 3 ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"}`}
              >
                {step > 3 ? <Check className="h-3 w-3" /> : "3"}
              </div>
              <span className="ml-2">Test & Finish</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {step === 1 && (
          <div className="p-6">
            <CardDescription className="mb-6">Select the data source you want to connect to Airship</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer hover:border-blue-500 transition-all ${connectionType === "snowflake" ? "border-blue-500 bg-blue-50" : ""}`}
                onClick={() => setConnectionType("snowflake")}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <Snowflake className="h-8 w-8 text-blue-500" />
                    {connectionType === "snowflake" && <Check className="h-5 w-5 text-blue-500" />}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h3 className="font-medium">Snowflake</h3>
                  <p className="text-sm text-gray-500">Connect to your Snowflake data warehouse</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-blue-500 transition-all opacity-60">
                <CardHeader className="p-4">
                  <Database className="h-8 w-8 text-gray-500" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h3 className="font-medium">PostgreSQL</h3>
                  <p className="text-sm text-gray-500">Connect to your PostgreSQL database</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-blue-500 transition-all opacity-60">
                <CardHeader className="p-4">
                  <Database className="h-8 w-8 text-gray-500" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h3 className="font-medium">BigQuery</h3>
                  <p className="text-sm text-gray-500">Connect to Google BigQuery</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6">
            <CardDescription className="mb-6">Enter your Snowflake connection details</CardDescription>
            <SnowflakeConnectionForm onSuccess={handleConnectionSuccess} />
          </div>
        )}

        {step === 3 && (
          <div className="p-6">
            <ConnectionSuccess />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
          Back
        </Button>
        <Button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 2 || step === 3}>
          {step === 3 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )
}
