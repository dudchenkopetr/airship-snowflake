export interface Connection {
  id: string
  name: string
  accountUrl: string
  database?: string
  warehouse?: string
  schema?: string
  encodedPrivateKey: string
  privateKeyPassword?: string
  createdAt: string
  lastUsed: string
  status: "connected" | "disconnected" | "error"
}

export interface Warehouse {
  id: string
  name: string
  accountUrl: string
  database: string
  warehouse: string
  schema: string
}

export interface FieldMapping {
  id: string
  externalAttributeName: string
  airshipAttributeName: string
  fieldType: "Text" | "Number" | "Date" | "Version" | "JSON"
}

export interface Table {
  id: string
  warehouseId: string
  name: string
  fullPath?: string
  type: "TABLE" | "VIEW"
  identifierColumn: string
  identifierType: "contact" | "channel"
  createdAt: string
  lastSynced?: string
  fieldMappings: FieldMapping[]
}
