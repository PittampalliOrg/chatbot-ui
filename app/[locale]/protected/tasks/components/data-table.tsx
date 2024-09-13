"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OptimisticTask } from "../types"
import { addTask, deleteTask, updateTask } from "../actions"

interface DataTableProps {
  columns: ColumnDef<OptimisticTask>[]
  data: OptimisticTask[]
  onAddTask: (title: string) => Promise<void>
  onDeleteTask: (taskId: string) => Promise<void>
  onUpdateTask: (
    taskId: string,
    updates: Partial<OptimisticTask>
  ) => Promise<void>
}

export function DataTable({
  columns,
  data,
  onAddTask,
  onDeleteTask,
  onUpdateTask
}: DataTableProps) {
  const [newTaskTitle, setNewTaskTitle] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      await onAddTask(newTaskTitle.trim())
      setNewTaskTitle("")
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTask} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="New task title..."
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          className="grow"
        />
        <Button type="submit">Add Task</Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
