"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TablesList from "@/components/tables-list"
import TablesTable from "@/components/tables-table"
import TableDrawer from "@/components/table-drawer"
import ViewSwitcher, { type ViewMode } from "@/components/view-switcher"
import type { Warehouse, Table, FieldMapping } from "@/lib/types"
import { useConnections, useTables } from "@/lib/store"

// Sample data for demonstration
const initialWarehouses: Warehouse[] = [
  {
    id: "1",
    name: "Production Data Warehouse",
    accountUrl: "myorg-prod.snowflakecomputing.com",
    database: "ANALYTICS",
    warehouse: "COMPUTE_WH",
    schema: "PUBLIC",
  },
  {
    id: "2",
    name: "Development Environment",
    accountUrl: "myorg-dev.snowflakecomputing.com",
    database: "DEV_DB",
    warehouse: "DEV_WH",
    schema: "DEV_SCHEMA",
  },
]

// Sample field mappings
const sampleFieldMappings: FieldMapping[] = [
  {
    id: "fm1",
    externalAttributeName: "EMAIL",
    airshipAttributeName: "email",
    fieldType: "Text",
  },
  {
    id: "fm2",
    externalAttributeName: "FIRST_NAME",
    airshipAttributeName: "first_name",
    fieldType: "Text",
  },
  {
    id: "fm3",
    externalAttributeName: "LAST_PURCHASE_DATE",
    airshipAttributeName: "last_purchase_date",
    fieldType: "Date",
  },
]

const initialTables: Table[] = [
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
    warehouseId: "2",
    name: "CHANNEL_METRICS",
    fullPath: "DEV_DB.DEV_SCHEMA.CHANNEL_METRICS",
    type: "TABLE",
    identifierColumn: "CHANNEL_ID",
    identifierType: "channel",
    createdAt: "2023-08-12T10:15:00Z",
    lastSynced: "2023-10-20T14:30:00Z",
    fieldMappings: [],
  },
]

export default function SnowflakeTableManager() {
  const { connections, isLoaded: connectionsLoaded } = useConnections()
  const { tables, getTablesForWarehouse, addTable, updateTable, deleteTable, isLoaded: tablesLoaded } = useTables()
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentTable, setCurrentTable] = useState<Table | null>(null)
  const [hasUserSegmentation] = useState(true) // This would come from your app state or API
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [filteredTables, setFilteredTables] = useState<Table[]>([])

  // Set initial warehouse selection when connections load
  useEffect(() => {
    if (connectionsLoaded && connections.length > 0 && !selectedWarehouseId) {
      setSelectedWarehouseId(connections[0].id)
    }
  }, [connectionsLoaded, connections, selectedWarehouseId])

  // Update filtered tables when relevant data changes - use a ref to prevent extra renders
  const tablesRef = React.useRef(tables);
  React.useEffect(() => {
    tablesRef.current = tables;
  }, [tables]);

  // Filter tables when warehouse selection or search query changes
  const updateFilteredTables = useCallback(() => {
    if (!selectedWarehouseId || !tablesLoaded) return

    const warehouseTables = getTablesForWarehouse(selectedWarehouseId)
    
    if (searchQuery) {
      setFilteredTables(
        warehouseTables.filter(
          (table) =>
            table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (table.fullPath && table.fullPath.toLowerCase().includes(searchQuery.toLowerCase())) ||
            table.identifierColumn.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredTables(warehouseTables)
    }
  }, [selectedWarehouseId, tablesLoaded, getTablesForWarehouse, searchQuery])

  // Update filtered tables when relevant data changes
  useEffect(() => {
    updateFilteredTables()
  }, [updateFilteredTables])

  // Get the selected warehouse object
  const selectedWarehouse = connections.find((conn) => conn.id === selectedWarehouseId) || null

  const handleAddTable = () => {
    setCurrentTable(null)
    setIsDrawerOpen(true)
  }

  const handleEditTable = (table: Table) => {
    setCurrentTable(table)
    setIsDrawerOpen(true)
  }

  const handleDeleteTable = (id: string) => {
    deleteTable(id)
  }

  const handleSaveTable = (table: Table) => {
    if (table.id) {
      // Edit existing table
      updateTable(table)
    } else {
      // Add new table with default values
      addTable({
        ...table,
        warehouseId: selectedWarehouseId,
        fullPath: `${selectedWarehouse?.database}.${selectedWarehouse?.schema}.${table.name}`,
        fieldMappings: table.fieldMappings || [],
      })
    }
    setIsDrawerOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
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
        <div className="flex items-center gap-3">
          <ViewSwitcher viewMode={viewMode} onChange={setViewMode} />
          <Button onClick={handleAddTable} className="h-8 py-0 bg-primary hover:bg-primary-600">
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Table/View
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-lg">Select Warehouse</CardTitle>
          <CardDescription className="text-sm">Choose a Snowflake warehouse to manage its tables</CardDescription>
        </CardHeader>
        <CardContent className="pb-4 pt-2 px-4">
          <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
            <SelectTrigger className="w-full sm:w-80 h-8 text-left">
              <SelectValue placeholder="Select a warehouse" />
            </SelectTrigger>
            <SelectContent>
              {connections.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.warehouse})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedWarehouse && (
            <>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Database</p>
                  <p className="font-medium">{selectedWarehouse.database}</p>
                </div>
                <div>
                  <p className="text-gray-500">Warehouse</p>
                  <p className="font-medium">{selectedWarehouse.warehouse}</p>
                </div>
                <div>
                  <p className="text-gray-500">Schema</p>
                  <p className="font-medium">{selectedWarehouse.schema}</p>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                {viewMode === "cards" ? (
                  <TablesList
                    tables={filteredTables}
                    onEdit={handleEditTable}
                    onDelete={handleDeleteTable}
                    hasUserSegmentation={hasUserSegmentation}
                  />
                ) : (
                  <TablesTable
                    tables={filteredTables}
                    onEdit={handleEditTable}
                    onDelete={handleDeleteTable}
                    hasUserSegmentation={hasUserSegmentation}
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <TableDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveTable}
        table={currentTable}
        warehouse={selectedWarehouse ? {
          id: selectedWarehouse.id,
          name: selectedWarehouse.name,
          accountUrl: selectedWarehouse.accountUrl,
          database: selectedWarehouse.database || "",
          warehouse: selectedWarehouse.warehouse || "",
          schema: selectedWarehouse.schema || "",
        } : null}
        hasUserSegmentation={hasUserSegmentation}
      />
    </div>
  )
}
