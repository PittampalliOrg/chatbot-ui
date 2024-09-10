"use client"

import React from "react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { getTasks } from "./actions"
import { TodoTask } from "@microsoft/microsoft-graph-types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useTasksContext } from "./tasks-context"
import { Toaster } from "@/components/ui/toaster"

export default function TasksPage() {
  const { lists, error: listsError } = useTasksContext()
  const [tasks, setTasks] = React.useState<TodoTask[]>([])
  const [tasksError, setTasksError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchTasks() {
      if (lists.length > 0) {
        const defaultListId = lists[0].id
        try {
          setIsLoading(true)
          const fetchedTasks = await getTasks(defaultListId)
          setTasks(fetchedTasks)
          setTasksError(null)
        } catch (e) {
          console.error("Error fetching tasks:", e)
          setTasksError(
            e instanceof Error
              ? e.message
              : "An unknown error occurred while fetching tasks"
          )
        } finally {
          setIsLoading(false)
        }
      } else {
        setTasksError("No lists available")
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [lists])

  const displayError = listsError || tasksError

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  return (
    <div className="mt-6">
      {displayError ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          data={tasks}
          initialTasks={tasks}
          listId={lists[0]?.id}
          tableLayout="fixed"
        />
      )}
      <Toaster />
    </div>
  )
}
