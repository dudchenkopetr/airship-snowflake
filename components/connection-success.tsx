import { CheckCircle2, Database, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConnectionSuccess() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="mb-4 rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Connection Successful!</h2>
        <p className="text-center text-gray-600">
          Your Snowflake connection has been successfully established. You can now access your data in Airship.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Available Tables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["CUSTOMERS", "ORDERS", "PRODUCTS", "SALES"].map((table) => (
            <Card key={table} className="border border-gray-200">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center">
                  <Database className="mr-2 h-4 w-4 text-blue-500" />
                  <CardTitle className="text-sm font-medium">{table}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription className="text-xs">MY_DATABASE.PUBLIC.{table}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center pt-4">
          <Button
            variant="outline"
            className="flex items-center h-8 py-0 text-primary border-primary hover:bg-primary-50"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Refresh Tables
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-medium text-blue-700">Next Steps</h3>
        <ul className="list-disc pl-5 text-sm text-blue-700">
          <li className="mb-1">Create your first analysis using the connected data</li>
          <li className="mb-1">Set up scheduled data refreshes</li>
          <li className="mb-1">Invite team members to collaborate</li>
          <li>Configure data transformations</li>
        </ul>
      </div>
    </div>
  )
}
