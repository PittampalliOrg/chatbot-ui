import React from "react"
import { TaskComboboxForm } from "./tasks-combobox-form"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { getTasks, getLists } from "./actions"
import { TodoTask, TodoTaskList } from "@microsoft/microsoft-graph-types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function TasksPage() {
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

  if (!error && lists.length > 0) {
    const defaultListId = lists[0].id
    if (defaultListId) {
      try {
        tasks = await getTasks(defaultListId)
      } catch (e) {
        console.error("Error fetching tasks:", e)
        error =
          e instanceof Error
            ? e
            : new Error("Unknown error occurred while fetching tasks")
      }
    } else {
      error = new Error("Default list ID is undefined")
    }
  } else if (!error) {
    error = new Error("No lists available")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">Tasks</h1>
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
            listId={lists[0]?.id}
            tableLayout="fixed" // Set to "fixed" to maintain consistent column widths
          />
        )}
      </div>
    </div>
  )
}
