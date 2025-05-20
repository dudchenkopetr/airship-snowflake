import { useEffect, useState } from 'react'
import type { Connection, Table as TableType, FieldMapping } from "./types"

// Sample field mappings for initial data
const sampleFieldMappings: FieldMapping[] = [
  { id: "fm1", externalAttributeName: "EMAIL", airshipAttributeName: "email", fieldType: "Text" },
  { id: "fm2", externalAttributeName: "FIRST_NAME", airshipAttributeName: "first_name", fieldType: "Text" },
  { id: "fm3", externalAttributeName: "LAST_PURCHASE_DATE", airshipAttributeName: "last_purchase_date", fieldType: "Date" },
]

// Initial data to populate the store if nothing exists in localStorage
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

// Initial tables
const initialTables: TableType[] = [
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

// Helper to safely access localStorage in a browser environment
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

// Helper to safely set localStorage in a browser environment
const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
  }
}

// Hook to manage connections
export const useConnections = () => {
  // Initialize state from localStorage or use initial data
  const [connections, setConnections] = useState<Connection[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const storedConnections = getLocalStorage<Connection[]>('connections', initialConnections)
    setConnections(storedConnections)
    setIsLoaded(true)
  }, [])

  // Update localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      setLocalStorage('connections', connections)
    }
  }, [connections, isLoaded])

  // Functions for managing connections
  const getConnection = (id: string) => connections.find(c => c.id === id) || null

  const addConnection = (connection: Omit<Connection, 'id' | 'createdAt' | 'lastUsed' | 'status'>) => {
    const newConnection: Connection = {
      ...connection,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      lastUsed: "",
      status: "disconnected"
    }
    setConnections([...connections, newConnection])
    return newConnection
  }

  const updateConnection = (updatedConnection: Connection) => {
    setConnections(connections.map(conn => 
      conn.id === updatedConnection.id ? updatedConnection : conn
    ))
  }

  const deleteConnection = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id))
  }

  return {
    connections,
    getConnection,
    addConnection,
    updateConnection,
    deleteConnection,
    isLoaded
  }
}

// Hook to manage tables
export const useTables = () => {
  // Initialize state from localStorage or use initial data
  const [tables, setTables] = useState<TableType[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const storedTables = getLocalStorage<TableType[]>('tables', initialTables)
    setTables(storedTables)
    setIsLoaded(true)
  }, [])

  // Update localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      setLocalStorage('tables', tables)
    }
  }, [tables, isLoaded])

  // Functions for managing tables
  const getTablesForWarehouse = (warehouseId: string) => 
    tables.filter(table => table.warehouseId === warehouseId)

  const getTable = (id: string) => 
    tables.find(table => table.id === id) || null

  const addTable = (table: Omit<TableType, 'id' | 'createdAt' | 'lastSynced'>) => {
    const newTable: TableType = {
      ...table,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      lastSynced: "",
    }
    setTables([...tables, newTable])
    return newTable
  }

  const updateTable = (updatedTable: TableType) => {
    setTables(tables.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ))
  }

  const deleteTable = (id: string) => {
    setTables(tables.filter(table => table.id !== id))
  }

  // Delete all tables for a specific warehouse
  const deleteTablesForWarehouse = (warehouseId: string) => {
    setTables(tables.filter(table => table.warehouseId !== warehouseId))
  }

  return {
    tables,
    getTablesForWarehouse,
    getTable,
    addTable,
    updateTable,
    deleteTable,
    deleteTablesForWarehouse,
    isLoaded
  }
} 