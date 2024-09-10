import React from "react"
import { TaskComboboxForm } from "../tasks-combobox-form"
import { DataTable } from "../data-table"
import { columns } from "../columns"
import { getTasks, getLists } from "../actions"
import { TodoTask, TodoTaskList } from "@microsoft/microsoft-graph-types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function TasksListPage({
  params
}: {
  params: { listId: string }
}) {
  let lists: TodoTaskList[] = []
  let tasks: TodoTask[] = []
  let error: Error | null = null

  try {
    lists = await getLists()
  } catch (e) {
    console.error("Error fetching lists:", e)
    error =
      e instanceof Error
        ? e
        : new Error("Unknown error occurred while fetching lists")
  }

  if (!error && params.listId) {
    try {
      tasks = await getTasks(params.listId)
    } catch (e) {
      console.error("Error fetching tasks:", e)
      error =
        e instanceof Error
          ? e
          : new Error("Unknown error occurred while fetching tasks")
    }
  } else if (!params.listId) {
    error = new Error("No list ID provided")
  }

  return (
    <div>
      <TaskComboboxForm lists={lists} />
      <div className="mt-6">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message}
              {error.stack && (
                <details>
                  <summary>Error Details</summary>
                  <pre>{error.stack}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <DataTable
            columns={columns}
            data={tasks}
            initialTasks={tasks}
            listId={params.listId}
            tableLayout="fixed" // Set to "fixed" to maintain consistent column widths
          />
        )}
      </div>
    </div>
  )
}
