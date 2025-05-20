"use client"

import { useState } from "react"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Snowflake,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Connection } from "@/lib/types"

interface ConnectionsTableProps {
  connections: Connection[]
  onEdit: (connection: Connection) => void
  onDelete: (id: string) => void
}

type SortField = "name" | "status" | "accountUrl" | "database" | "warehouse" | "schema" | "createdAt" | "lastUsed"
type SortDirection = "asc" | "desc"

export default function ConnectionsTable({ connections, onEdit, onDelete }: ConnectionsTableProps) {
  const [connectionToDelete, setConnectionToDelete] = useState<Connection | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10;

  const handleDeleteClick = (connection: Connection) => {
    setConnectionToDelete(connection)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (connectionToDelete) {
      onDelete(connectionToDelete.id)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (e) {
      return "Invalid date"
    }
  }

  const getStatusIcon = (status: Connection["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4" />
      case "disconnected":
        return <XCircle className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: Connection["status"]) => {
    switch (status) {
      case "connected":
        return "Connected"
      case "disconnected":
        return "Disconnected"
      case "error":
        return "Connection Error"
      default:
        return "Unknown Status"
    }
  }

  const getStatusColor = (status: Connection["status"]) => {
    switch (status) {
      case "connected":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
      case "disconnected":
        return "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
      case "error":
        return "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }

  // Sort connections based on current sort field and direction
  const sortedConnections = [...connections].sort((a, b) => {
    let aValue: any
    let bValue: any

    // Extract values based on sort field
    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case "status":
        aValue = a.status
        bValue = b.status
        break
      case "accountUrl":
        aValue = a.accountUrl.toLowerCase()
        bValue = b.accountUrl.toLowerCase()
        break
      case "database":
        aValue = (a.database || "").toLowerCase()
        bValue = (b.database || "").toLowerCase()
        break
      case "warehouse":
        aValue = (a.warehouse || "").toLowerCase()
        bValue = (b.warehouse || "").toLowerCase()
        break
      case "schema":
        aValue = (a.schema || "").toLowerCase()
        bValue = (b.schema || "").toLowerCase()
        break
      case "createdAt":
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case "lastUsed":
        aValue = a.lastUsed ? new Date(a.lastUsed).getTime() : 0
        bValue = b.lastUsed ? new Date(b.lastUsed).getTime() : 0
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
    }

    // Compare values based on direction
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Pagination calculations
  const totalPages = Math.ceil(sortedConnections.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, sortedConnections.length)
  const currentConnections = sortedConnections.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1) // -1 represents ellipsis
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push(-2) // -2 represents ellipsis
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Snowflake className="h-12 w-12 text-primary mb-3 opacity-70" />
        <h3 className="mb-2 text-lg font-medium">No connections found</h3>
        <p className="mb-4 text-sm text-gray-500">
          {connections.length === 0
            ? "Add your first Snowflake connection to get started"
            : "No connections match your search criteria"}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border bg-white overflow-x-auto relative">
        <div className="min-w-[1000px]">
          {" "}
          {/* Add minimum width to ensure scrolling */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-20 bg-white shadow-[1px_0_0_0_#e5e7eb]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Name {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Status {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("accountUrl")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Account URL {getSortIcon("accountUrl")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("database")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Database {getSortIcon("database")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("warehouse")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Warehouse {getSortIcon("warehouse")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("schema")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Schema {getSortIcon("schema")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Created {getSortIcon("createdAt")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("lastUsed")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Last Used {getSortIcon("lastUsed")}
                  </Button>
                </TableHead>
                <TableHead className="sticky right-0 z-20 bg-white shadow-[-1px_0_0_0_#e5e7eb] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentConnections.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="sticky left-0 z-10 bg-white shadow-[1px_0_0_0_#e5e7eb] font-medium">
                    <Link href={`/connection/${connection.id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                      {connection.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(connection.status)}
                      aria-label={`Status: ${getStatusText(connection.status)}`}
                    >
                      {getStatusText(connection.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate block">{connection.accountUrl}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{connection.accountUrl}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{connection.database || "—"}</TableCell>
                  <TableCell>{connection.warehouse || "—"}</TableCell>
                  <TableCell>{connection.schema || "—"}</TableCell>
                  <TableCell>{formatDate(connection.createdAt)}</TableCell>
                  <TableCell>{formatDate(connection.lastUsed)}</TableCell>
                  <TableCell className="text-right sticky right-0 z-10 bg-white shadow-[-1px_0_0_0_#e5e7eb]">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(connection)}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                          <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteClick(connection)}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500">
                          <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Keep the pagination controls outside the scrollable area */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{endIndex}</span> of{" "}
              <span className="font-medium">{sortedConnections.length}</span> connections
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              page < 0 ? (
                <span key={`ellipsis-${index}`} className="px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`h-8 w-8 p-0 ${currentPage === page ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Connection"
        description={`Are you sure you want to delete the connection "${connectionToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </>
  )
}
