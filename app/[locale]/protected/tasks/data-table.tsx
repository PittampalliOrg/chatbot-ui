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
import { addTasks, deleteTask, updateTask, getTasks } from "./actions"
import {
  useOptimistic,
  useTransition,
  useCallback,
  useState,
  useEffect
} from "react"
import { useRouter } from "next/navigation"
import { OptimisticTask } from "./types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TodoTask, TaskStatus } from "@microsoft/microsoft-graph-types"
import { toast } from "@/components/ui/use-toast"

interface DataTableProps {
  columns: ColumnDef<OptimisticTask>[]
  data: OptimisticTask[]
  initialTasks: OptimisticTask[]
  listId?: string
  tableLayout?: "auto" | "fixed"
}

export function DataTable({
  columns,
  data = [],
  initialTasks = [],
  listId,
  tableLayout = "auto"
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [tasks, setTasks] = useState(initialTasks)
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(tasks)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

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

  const selectedRowsCount = Object.keys(rowSelection).length

  const formAction = useCallback(
    async (formData: FormData) => {
      const newTaskTitle = formData.get("item") as string
      if (!newTaskTitle.trim() || !listId) return

      const newTask: OptimisticTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: "notStarted",
        importance: "normal",
        createdDateTime: new Date().toISOString(),
        sending: true
      }

      setOptimisticTasks(prevTasks => [...prevTasks, newTask])

      startTransition(async () => {
        try {
          if (listId) {
            const addedTasks = await addTasks(listId, [newTaskTitle])
            setTasks(prevTasks => [
              ...prevTasks,
              { ...addedTasks[0], sending: false } as OptimisticTask
            ])
            toast({
              title: "Task added",
              description: "New task has been successfully added."
            })
          }
        } catch (error) {
          console.error("Failed to add task:", error)
          setTasks(prevTasks =>
            prevTasks.filter(task => task.id !== newTask.id)
          )
          toast({
            title: "Error",
            description: "Failed to add new task. Please try again.",
            variant: "destructive"
          })
        }
      })
    },
    [listId, setOptimisticTasks]
  )

  const handleDeleteTasks = useCallback(async () => {
    if (!listId) return

    const selectedRows = table.getFilteredSelectedRowModel().rows
    const tasksToDelete = selectedRows
      .map(row => row.original.id)
      .filter((id): id is string => typeof id === "string")

    setOptimisticTasks(prevTasks =>
      prevTasks.filter(task => task.id && !tasksToDelete.includes(task.id))
    )

    startTransition(async () => {
      try {
        const updatedTasks = await deleteTasks(listId, tasksToDelete)
        setTasks(updatedTasks as OptimisticTask[])
        setRowSelection({})
        toast({
          title: "Tasks deleted",
          description: `Successfully deleted ${tasksToDelete.length} task(s).`
        })
      } catch (error) {
        console.error("Failed to delete tasks:", error)
        const tasks = await getTasks(listId)
        setTasks(tasks as OptimisticTask[])
        toast({
          title: "Error",
          description: "Failed to delete tasks. Please try again.",
          variant: "destructive"
        })
      }
    })
  }, [listId, table, setOptimisticTasks, setRowSelection])

  const handleBulkUpdate = useCallback(
    async (status: TaskStatus) => {
      if (!listId) return

      const selectedRows = table.getFilteredSelectedRowModel().rows
      const tasksToUpdate = selectedRows
        .map(row => ({
          id: row.original.id,
          updates: { status } as Partial<TodoTask>
        }))
        .filter(
          (task): task is { id: string; updates: Partial<TodoTask> } =>
            typeof task.id === "string"
        )

      setOptimisticTasks(prevTasks =>
        prevTasks.map(task =>
          tasksToUpdate.some(update => update.id === task.id)
            ? { ...task, status }
            : task
        )
      )

      startTransition(async () => {
        try {
          await bulkUpdateTasks(listId, tasksToUpdate)
          setRowSelection({})
          const updatedTasks = await getTasks(listId)
          setTasks(updatedTasks as OptimisticTask[])
          toast({
            title: "Tasks updated",
            description: `Successfully updated ${tasksToUpdate.length} task(s).`
          })
        } catch (error) {
          console.error("Failed to update tasks:", error)
          const tasks = await getTasks(listId)
          setTasks(tasks as OptimisticTask[])
          toast({
            title: "Error",
            description: "Failed to update tasks. Please try again.",
            variant: "destructive"
          })
        }
      })
    },
    [listId, table, setOptimisticTasks, setRowSelection]
  )

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
          {selectedRowsCount > 0 && (
            <>
              <Badge variant="secondary">{selectedRowsCount} selected</Badge>
              <Button
                onClick={handleDeleteTasks}
                size="sm"
                disabled={isPending || !listId}
              >
                Delete
              </Button>
              <Button
                onClick={() => handleBulkUpdate("completed")}
                size="sm"
                disabled={isPending || !listId}
              >
                Mark as Completed
              </Button>
              <Button
                onClick={() => handleBulkUpdate("notStarted")}
                size="sm"
                disabled={isPending || !listId}
              >
                Mark as Not Started
              </Button>
            </>
          )}
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
