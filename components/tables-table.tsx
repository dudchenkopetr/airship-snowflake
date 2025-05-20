"use client"

import { useState } from "react"
import { Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Table as TableType } from "@/lib/types"

interface TablesTableProps {
  tables: TableType[]
  onEdit: (table: TableType) => void
  onDelete: (id: string) => void
  hasUserSegmentation: boolean
}

type SortField = "name" | "identifierColumn" | "createdAt" | "lastSynced" | "fieldMappings"
type SortDirection = "asc" | "desc"

export default function TablesTable({ tables, onEdit, onDelete, hasUserSegmentation }: TablesTableProps) {
  const [tableToDelete, setTableToDelete] = useState<TableType | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10;

  const handleDeleteClick = (table: TableType) => {
    setTableToDelete(table)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (tableToDelete) {
      onDelete(tableToDelete.id)
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

  // Sort tables based on current sort field and direction
  const sortedTables = [...tables].sort((a, b) => {
    let aValue: any
    let bValue: any

    // Extract values based on sort field
    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case "identifierColumn":
        aValue = a.identifierColumn.toLowerCase()
        bValue = b.identifierColumn.toLowerCase()
        break
      case "createdAt":
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case "lastSynced":
        aValue = a.lastSynced ? new Date(a.lastSynced).getTime() : 0
        bValue = b.lastSynced ? new Date(b.lastSynced).getTime() : 0
        break
      case "fieldMappings":
        aValue = a.fieldMappings.length
        bValue = b.fieldMappings.length
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
  const totalPages = Math.ceil(sortedTables.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, sortedTables.length)
  const currentTables = sortedTables.slice(startIndex, endIndex)

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

  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
        <h3 className="mb-2 text-lg font-medium">No tables/views found</h3>
        <p className="mb-4 text-sm text-gray-500">Add your first Snowflake table/view to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border bg-white overflow-x-auto relative">
        <div className="min-w-[800px]">
          {" "}
          {/* Add minimum width to ensure scrolling */}
          <Table aria-label="Snowflake Tables and Views">
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="sticky left-0 z-20 bg-white shadow-[1px_0_0_0_#e5e7eb]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Name {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead scope="col">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("identifierColumn")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Identifier {getSortIcon("identifierColumn")}
                  </Button>
                </TableHead>
                <TableHead scope="col">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Created {getSortIcon("createdAt")}
                  </Button>
                </TableHead>
                <TableHead scope="col">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("lastSynced")}
                    className="p-0 font-medium flex items-center hover:bg-transparent"
                  >
                    Last Synced {getSortIcon("lastSynced")}
                  </Button>
                </TableHead>
                <TableHead scope="col" className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("fieldMappings")}
                    className="p-0 font-medium flex items-center justify-end hover:bg-transparent w-full"
                  >
                    Field Mappings {getSortIcon("fieldMappings")}
                  </Button>
                </TableHead>
                <TableHead scope="col" className="sticky right-0 z-20 bg-white shadow-[-1px_0_0_0_#e5e7eb] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium sticky left-0 z-10 bg-white shadow-[1px_0_0_0_#e5e7eb]">
                    {table.name}
                  </TableCell>
                  <TableCell>{table.identifierColumn}</TableCell>
                  <TableCell>{formatDate(table.createdAt)}</TableCell>
                  <TableCell>{formatDate(table.lastSynced || "")}</TableCell>
                  <TableCell className="text-right">{table.fieldMappings.length}</TableCell>
                  <TableCell className="text-right sticky right-0 z-10 bg-white shadow-[-1px_0_0_0_#e5e7eb]">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(table)}
                        aria-label={`Edit ${table.name}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(table)}
                        aria-label={`Delete ${table.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
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
              <span className="font-medium">{sortedTables.length}</span> tables
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
        title="Delete Table/View"
        description={`Are you sure you want to delete ${tableToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </>
  )
}
