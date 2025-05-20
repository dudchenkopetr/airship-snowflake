"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, Plus, Slash } from "lucide-react"
import Link from "next/link"
import React from "react"

import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import TablesTable from "@/components/tables-table"
import TableDrawer from "@/components/table-drawer"
import type { Warehouse, Table as TableType, Connection, FieldMapping } from "@/lib/types"
import { useConnections, useTables } from "@/lib/store"
import { format } from "date-fns"

// Inline sample data to avoid import issues
// In a real app, this would come from an API
const sampleFieldMappings: FieldMapping[] = [
  { id: "fm1", externalAttributeName: "EMAIL", airshipAttributeName: "email", fieldType: "Text" },
  { id: "fm2", externalAttributeName: "FIRST_NAME", airshipAttributeName: "first_name", fieldType: "Text" },
  { id: "fm3", externalAttributeName: "LAST_PURCHASE_DATE", airshipAttributeName: "last_purchase_date", fieldType: "Date" },
]

const sampleConnections: Connection[] = [
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

// Expanded sample tables with more items
const sampleTables: TableType[] = [
  {
    id: "1",
    warehouseId: "1",
    name: "CUSTOMERS",
    fullPath: "ANALYTICS.PUBLIC.CUSTOMERS",
    type: "TABLE",
    identifierColumn: "EMAIL",
    identifierType: "contact",
    createdAt: "2023-10-15T14:30:00Z",
    lastSynced: "2023-11-01T09:15:00Z",
    fieldMappings: sampleFieldMappings,
  },
  {
    id: "2",
    warehouseId: "1",
    name: "USER_EVENTS",
    fullPath: "ANALYTICS.PUBLIC.USER_EVENTS",
    type: "VIEW",
    identifierColumn: "USER_ID",
    identifierType: "contact",
    createdAt: "2023-09-05T11:20:00Z",
    lastSynced: "2023-10-28T16:45:00Z",
    fieldMappings: [],
  },
  {
    id: "3",
    warehouseId: "1",
    name: "PRODUCTS",
    fullPath: "ANALYTICS.PUBLIC.PRODUCTS",
    type: "TABLE",
    identifierColumn: "PRODUCT_ID",
    identifierType: "contact",
    createdAt: "2023-11-20T10:30:00Z",
    lastSynced: "2023-12-05T08:45:00Z",
    fieldMappings: sampleFieldMappings.slice(0, 1),
  },
  {
    id: "4",
    warehouseId: "1",
    name: "ORDERS",
    fullPath: "ANALYTICS.PUBLIC.ORDERS",
    type: "TABLE",
    identifierColumn: "ORDER_ID",
    identifierType: "contact",
    createdAt: "2023-10-25T09:20:00Z",
    lastSynced: "2023-11-10T14:15:00Z",
    fieldMappings: sampleFieldMappings.slice(0, 2),
  },
  {
    id: "5",
    warehouseId: "2",
    name: "DEV_CUSTOMERS",
    fullPath: "DEV_DB.DEV_SCHEMA.DEV_CUSTOMERS",
    type: "TABLE",
    identifierColumn: "EMAIL",
    identifierType: "contact",
    createdAt: "2023-09-18T11:45:00Z",
    lastSynced: "2023-10-05T16:30:00Z",
    fieldMappings: sampleFieldMappings,
  },
  {
    id: "6",
    warehouseId: "2",
    name: "DEV_METRICS",
    fullPath: "DEV_DB.DEV_SCHEMA.DEV_METRICS",
    type: "VIEW",
    identifierColumn: "METRIC_ID",
    identifierType: "channel",
    createdAt: "2023-08-30T14:20:00Z",
    lastSynced: "2023-09-25T10:10:00Z",
    fieldMappings: sampleFieldMappings.slice(1, 2),
  },
]

export default function ConnectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const connectionId = params.id as string
  
  // Use our store hooks for data synchronization
  const { connections, getConnection, isLoaded: connectionsLoaded } = useConnections()
  const { tables, getTablesForWarehouse, addTable, updateTable, deleteTable } = useTables()
  
  const [connection, setConnection] = useState<Connection | null>(null)
  const [filteredTables, setFilteredTables] = useState<TableType[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentTable, setCurrentTable] = useState<TableType | null>(null)
  const [hasUserSegmentation] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("")
  const [currentWarehouse, setCurrentWarehouse] = useState<Connection | null>(null)

  // Load data from the store - runs only once on initial load
  useEffect(() => {
    if (!connectionsLoaded) {
      // Still loading connections from storage
      return;
    }
    
    let conn = getConnection(connectionId);
    
    // Fallback to sample data if the connection isn't found
    if (!conn && connections.length === 0) {
      // If there are no connections at all, use the sample connection
      conn = sampleConnections.find(c => c.id === connectionId) || null;
    }
    
    if (conn) {
      setConnection(conn)
      setSelectedWarehouseId(conn.id)
      setCurrentWarehouse(conn)
      
      // Initially filter tables by the connection ID
      updateFilteredTables(getTablesForWarehouse(conn.id), searchQuery)
    }
    
    setIsLoading(false)
  }, [connectionId, connectionsLoaded]) // Only depend on the ID and connection load state

  // Combined effect to handle warehouse selection, search query, and tables data changes
  useEffect(() => {
    if (selectedWarehouseId && connectionsLoaded) {
      // Find the selected warehouse details
      const selectedWarehouse = connections.find(c => c.id === selectedWarehouseId) || null
      setCurrentWarehouse(selectedWarehouse)
      
      // Update filtered tables based on selected warehouse
      const warehouseTables = getTablesForWarehouse(selectedWarehouseId)
      updateFilteredTables(warehouseTables, searchQuery)
    }
  }, [selectedWarehouseId, searchQuery, tables, connections, connectionsLoaded])

  // Function to update filtered tables based on warehouse ID and search query
  // Defined outside useCallback to avoid dependency issues
  function updateFilteredTables(warehouseTables: TableType[], query: string) {
    if (query) {
      const searchFiltered = warehouseTables.filter(
        table => 
          table.name.toLowerCase().includes(query.toLowerCase()) ||
          table.fullPath?.toLowerCase().includes(query.toLowerCase()) ||
          table.identifierColumn.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredTables(searchFiltered)
    } else {
      setFilteredTables(warehouseTables)
    }
  }

  const handleAddTable = () => {
    setCurrentTable(null)
    setIsDrawerOpen(true)
  }

  const handleEditTable = (table: TableType) => {
    setCurrentTable(table)
    setIsDrawerOpen(true)
  }

  const handleDeleteTable = (id: string) => {
    deleteTable(id)
  }

  const handleSaveTable = (table: TableType) => {
    if (table.id) {
      // Edit existing table
      updateTable(table)
    } else {
      // Add new table with default values
      addTable({
        ...table,
        warehouseId: selectedWarehouseId,
        fullPath: `${currentWarehouse?.database}.${currentWarehouse?.schema}.${table.name}`,
        fieldMappings: table.fieldMappings || [],
      })
    }
    
    setIsDrawerOpen(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return "Invalid date"
    }
  }

  if (isLoading || !connectionsLoaded) {
    return <div className="py-8 text-center">Loading connection details...</div>
  }

  if (!connection) {
    return (
      <div className="py-8 text-center flex flex-col items-center">
        <div className="mb-4 text-red-500">Connection not found</div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/')}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Return to Connections List
        </Button>
      </div>
    )
  }

  // Simple table view that matches the screenshot
  const renderTablesTable = () => {
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Identifier</TableHead>
              <TableHead className="font-medium">Created</TableHead>
              <TableHead className="font-medium">Last Synced</TableHead>
              <TableHead className="font-medium">Field Mappings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.length > 0 ? (
              filteredTables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>{table.identifierColumn}</TableCell>
                  <TableCell>{formatDate(table.createdAt)}</TableCell>
                  <TableCell>{formatDate(table.lastSynced)}</TableCell>
                  <TableCell>{table.fieldMappings.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditTable(table)}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                          <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteTable(table.id)}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500">
                          <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No tables found for this warehouse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredTables.length}</span> of{" "}
              <span className="font-medium">{filteredTables.length}</span> tables
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="sm"
              className="h-8 w-8 p-0"
            >
              1
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-2 md:px-4 py-4">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Connections</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{connection.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/')} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Connections
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Select Warehouse</CardTitle>
              <CardDescription className="text-sm">Choose a Snowflake warehouse to manage its tables</CardDescription>
            </div>
            <Button onClick={handleAddTable} className="h-8 py-0 bg-primary hover:bg-primary-600">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Table/View
            </Button>
          </CardHeader>
          
          <CardContent className="pb-4 pt-2 px-4">
            <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
              <SelectTrigger className="w-full sm:w-80 h-8 text-left mb-4">
                <SelectValue placeholder="Select a warehouse" />
              </SelectTrigger>
              <SelectContent>
                {connections.map((conn) => (
                  <SelectItem key={conn.id} value={conn.id}>
                    {conn.name} ({conn.warehouse})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
              <div>
                <p className="text-gray-500">Database</p>
                <p className="font-medium">{currentWarehouse?.database}</p>
              </div>
              <div>
                <p className="text-gray-500">Warehouse</p>
                <p className="font-medium">{currentWarehouse?.warehouse}</p>
              </div>
              <div>
                <p className="text-gray-500">Schema</p>
                <p className="font-medium">{currentWarehouse?.schema}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-t pt-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search tables/views..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2">
              {renderTablesTable()}
            </div>
          </CardContent>
        </Card>

        <TableDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveTable}
          table={currentTable}
          warehouse={currentWarehouse as unknown as Warehouse}
          hasUserSegmentation={hasUserSegmentation}
        />
      </div>
    </main>
  )
} 