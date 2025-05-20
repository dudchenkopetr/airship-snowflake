"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ConnectionsList from "@/components/connections-list"
import ConnectionsTable from "@/components/connections-table"
import ConnectionDrawer from "@/components/connection-drawer"
import ViewSwitcher, { type ViewMode } from "@/components/view-switcher"
import type { Connection } from "@/lib/types"
import { useConnections } from "@/lib/store"

// Import the error handling utilities
import { useErrorHandler, withErrorHandling } from "@/lib/error-utils"
import { ErrorBoundary } from "@/components/error-boundary"

// Sample data for demonstration
const initialConnections: Connection[] = [
  {
    id: "1",
    name: "Production Data Warehouse",
    accountUrl: "myorg-prod.snowflakecomputing.com",
    database: "ANALYTICS",
    warehouse: "COMPUTE_WH",
    schema: "PUBLIC",
    encodedPrivateKey: "-----BEGIN PRIVATE KEY----- (encrypted) -----END PRIVATE KEY-----",
    privateKeyPassword: "",
    createdAt: "2023-10-15T14:30:00Z",
    lastUsed: "2023-11-01T09:15:00Z",
    status: "connected",
  },
  {
    id: "2",
    name: "Development Environment",
    accountUrl: "myorg-dev.snowflakecomputing.com",
    database: "DEV_DB",
    warehouse: "DEV_WH",
    schema: "DEV_SCHEMA",
    encodedPrivateKey: "-----BEGIN PRIVATE KEY----- (encrypted) -----END PRIVATE KEY-----",
    privateKeyPassword: "",
    createdAt: "2023-09-05T11:20:00Z",
    lastUsed: "2023-10-28T16:45:00Z",
    status: "disconnected",
  },
]

// Add error handling to the component
export default function SnowflakeConnectionManager() {
  const { connections, addConnection, updateConnection, deleteConnection, isLoaded } = useConnections()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentConnection, setCurrentConnection] = useState<Connection | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [isLoading, setIsLoading] = useState(false)
  const { handleError } = useErrorHandler()

  const handleAddConnection = () => {
    setCurrentConnection(null)
    setIsDrawerOpen(true)
  }

  const handleEditConnection = (connection: Connection) => {
    setCurrentConnection(connection)
    setIsDrawerOpen(true)
  }

  // Update the handleSaveConnection function to use error handling
  const handleSaveConnection = async (connection: Connection) => {
    setIsLoading(true)

    await withErrorHandling(
      async () => {
        if (connection.id) {
          // Edit existing connection
          updateConnection(connection)
        } else {
          // Add new connection (addConnection will handle generating ID, etc.)
          addConnection({
            name: connection.name,
            accountUrl: connection.accountUrl,
            database: connection.database,
            warehouse: connection.warehouse,
            schema: connection.schema,
            encodedPrivateKey: connection.encodedPrivateKey,
            privateKeyPassword: connection.privateKeyPassword
          })
        }
        setIsDrawerOpen(false)
      },
      (error) => handleError(error, "saving connection"),
      "Connection Save",
    )

    setIsLoading(false)
  }

  // Update the handleDeleteConnection function to use error handling
  const handleDeleteConnection = async (id: string) => {
    await withErrorHandling(
      async () => {
        deleteConnection(id)
      },
      (error) => handleError(error, "deleting connection"),
      "Connection Delete",
    )
  }

  // Filter connections based on search query
  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.accountUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (connection.database && connection.database.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (connection.warehouse && connection.warehouse.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (connection.schema && connection.schema.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Add a function to periodically check connection status
  const checkConnectionStatus = React.useCallback(() => {
    // This would be replaced with an actual API call in production
    if (!connections.length) return;
    
    // Use a stable way to update connection statuses
    const updates = connections.reduce((acc, conn) => {
      // Generate a stable random value based on the connection ID
      const rand = parseFloat('0.' + Array.from(conn.id).map(c => c.charCodeAt(0)).join('').slice(0, 6));
      const newStatus = rand > 0.8 ? "error" : rand > 0.3 ? "connected" : "disconnected";
      
      if (conn.status !== newStatus) {
        acc.push({
          ...conn,
          status: newStatus
        });
      }
      return acc;
    }, [] as Connection[]);
    
    // Only update connections that actually changed
    if (updates.length > 0) {
      updates.forEach(conn => updateConnection(conn));
    }
  }, [connections, updateConnection]);

  React.useEffect(() => {
    if (isLoaded) {
      // Check connection status initially and then every 30 seconds
      checkConnectionStatus()
      const interval = setInterval(checkConnectionStatus, 30000)
      return () => clearInterval(interval)
    }
  }, [isLoaded, checkConnectionStatus])

  // Wrap the return statement with ErrorBoundary
  return (
    <ErrorBoundary context="Connection Manager">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search connections..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher viewMode={viewMode} onChange={setViewMode} />
            <Button onClick={handleAddConnection} className="h-8 py-0 bg-primary hover:bg-primary-600">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Connection
            </Button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <ConnectionsList
            connections={filteredConnections}
            onEdit={handleEditConnection}
            onDelete={handleDeleteConnection}
          />
        ) : (
          <ConnectionsTable
            connections={filteredConnections}
            onEdit={handleEditConnection}
            onDelete={handleDeleteConnection}
          />
        )}

        <ConnectionDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveConnection}
          connection={currentConnection}
        />
      </div>
    </ErrorBoundary>
  )
}
