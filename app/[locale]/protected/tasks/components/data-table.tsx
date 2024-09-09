"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { addTasks, deleteTasks } from "../actions"
import { OptimisticTask } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableProps {
  columns: ColumnDef<OptimisticTask>[]
  data: OptimisticTask[]
  initialTasks: OptimisticTask[]
  listId?: string
}

export function DataTable({
  columns,
  data,
  initialTasks,
  listId
}: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [tasks, setTasks] = React.useState(initialTasks)
  const [isPending, startTransition] = React.useTransition()
  const [newTaskTitle, setNewTaskTitle] = React.useState("")

  const [optimisticTasks, addOptimisticTask] = React.useOptimistic(
    tasks,
    (state: OptimisticTask[], newTask: OptimisticTask) => [...state, newTask]
  )

  const table = useReactTable({
    data: optimisticTasks,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  async function handleAddTask(taskTitle: string) {
    if (!taskTitle.trim()) return

    const newTask: OptimisticTask = {
      id: Date.now().toString(),
      title: taskTitle,
      status: "notStarted",
      sending: true
    }

    addOptimisticTask(newTask)

    startTransition(async () => {
      try {
        const addedTask = await addTasks(listId, [taskTitle])
        setTasks(currentTasks => [
          ...currentTasks,
          { ...newTask, id: addedTask[0].id, sending: false }
        ])
      } catch (error) {
        console.error("Failed to add task:", error)
        setTasks(currentTasks =>
          currentTasks.filter(task => task.id !== newTask.id)
        )
      }
    })
  }

  async function handleDeleteTasks() {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const tasksToDelete = selectedRows
      .map(row => row.original.id)
      .filter((id): id is string => id !== undefined)

    setTasks(currentTasks =>
      currentTasks.filter(task => task.id && !tasksToDelete.includes(task.id))
    )

    try {
      await deleteTasks(listId, tasksToDelete)
      table.toggleAllRowsSelected(false)
    } catch (error) {
      console.error("Failed to delete tasks:", error)
      setTasks(initialTasks)
    }
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        onAddTask={handleAddTask}
        onDeleteTasks={handleDeleteTasks}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
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
      <DataTablePagination table={table} />
    </div>
  )
}
