"use client"

import { useState } from "react"
import {
  MoreVertical,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Snowflake,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Connection } from "@/lib/types"

interface ConnectionsListProps {
  connections: Connection[]
  onEdit: (connection: Connection) => void
  onDelete: (id: string) => void
}

export default function ConnectionsList({ connections, onEdit, onDelete }: ConnectionsListProps) {
  const [connectionToDelete, setConnectionToDelete] = useState<Connection | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

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
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {connections.map((connection) => (
          <Card
            key={connection.id}
            className="overflow-hidden border border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
            tabIndex={0}
          >
            <CardHeader className="pb-2 p-3">
              <Link href={`/connection/${connection.id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                <CardTitle className="text-lg">{connection.name}</CardTitle>
              </Link>
              <CardDescription>{connection.accountUrl}</CardDescription>
            </CardHeader>

            <CardContent className="pb-1 px-3">
              <div className="mb-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        className={`font-normal inline-block ${getStatusColor(connection.status)}`}
                        aria-label={`Status: ${getStatusText(connection.status)}`}
                      >
                        {getStatusText(connection.status)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Status: {getStatusText(connection.status)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Database</p>
                  <p className="font-medium">{connection.database || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Warehouse</p>
                  <p className="font-medium">{connection.warehouse || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Schema</p>
                  <p className="font-medium">{connection.schema || "—"}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-3 pt-2 flex justify-between items-center border-t text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(connection.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(connection)
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(connection)
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500">
                    <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
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
