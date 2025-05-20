import type { Connection, Table, FieldMapping } from "@/lib/types"

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

// Sample data for connections
export const connections: Connection[] = [
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

// Sample data for tables
export const tables: Table[] = [
  {
    id: "1",
    warehouseId: "1", // Linked to Production Data Warehouse
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
    warehouseId: "1", // Linked to Production Data Warehouse
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
    warehouseId: "2", // Linked to Development Environment
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