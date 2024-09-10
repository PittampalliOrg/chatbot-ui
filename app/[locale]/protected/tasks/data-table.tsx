"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import { TodoTask } from "@microsoft/microsoft-graph-types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { DataTablePagination } from "./components/data-table-pagination"
import { DataTableViewOptions } from "./components/data-table-view-options"
import { addTasks, deleteTasks } from "./actions"
import { useOptimistic } from "react"
import { OptimisticTask } from "./types"
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
  data = [],
  initialTasks = [],
  listId
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [tasks, setTasks] = React.useState(initialTasks)
  const [isPending, startTransition] = React.useTransition()

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state: OptimisticTask[], newTask: OptimisticTask) => [...state, newTask]
  )

  const table = useReactTable({
    data: optimisticTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  async function formAction(formData: FormData) {
    const newTaskTitle = formData.get("item") as string
    if (!newTaskTitle.trim() || !listId) return

    const newTask: OptimisticTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: "notStarted",
      sending: true
    }

    addOptimisticTask(newTask)

    startTransition(async () => {
      try {
        const addedTasks = await addTasks(listId, [newTaskTitle])
        setTasks(currentTasks => [
          ...currentTasks,
          { ...newTask, id: addedTasks[0].id, sending: false }
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
    if (!listId) return

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const tasksToDelete = selectedRows
      .map(row => row.original.id)
      .filter((id): id is string => typeof id === "string")

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
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter tasks..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={event =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <form action={formAction} className="flex items-center gap-2">
            <div className="grow">
              <Input
                type="text"
                name="item"
                placeholder="Make a video ... "
                className="w-full"
              />
            </div>
            <Button type="submit" size="sm" disabled={isPending || !listId}>
              Add Task
            </Button>
          </form>
          <Button
            onClick={handleDeleteTasks}
            size="sm"
            disabled={isPending || !listId}
          >
            Delete
          </Button>
        </div>
        <DataTableViewOptions table={table} />
      </div>

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
      <DataTablePagination table={table} />
    </div>
  )
}
