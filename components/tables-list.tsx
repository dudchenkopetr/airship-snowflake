"use client"

import { useState } from "react"
import { Edit, Trash2, MoreVertical, Calendar, Database } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import type { Table } from "@/lib/types"

interface TablesListProps {
  tables: Table[]
  onEdit: (table: Table) => void
  onDelete: (id: string) => void
  hasUserSegmentation: boolean
}

export default function TablesList({ tables, onEdit, onDelete, hasUserSegmentation }: TablesListProps) {
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleDeleteClick = (table: Table) => {
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

  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-3">
          <Database className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No tables/views found</h3>
        <p className="mb-4 text-sm text-gray-500">Add your first Snowflake table/view to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.id} className="overflow-hidden border border-gray-200 shadow-sm">
            <CardHeader className="pb-1 pt-3 px-3">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div>
                    <CardTitle className="text-base">{table.name}</CardTitle>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(table)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(table)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-1 px-3">{/* Card content intentionally left empty */}</CardContent>
            <CardFooter className="border-t pt-2 pb-2 px-3 text-xs text-gray-500">
              <div className="flex w-full justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  Added {formatDate(table.createdAt)}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
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
