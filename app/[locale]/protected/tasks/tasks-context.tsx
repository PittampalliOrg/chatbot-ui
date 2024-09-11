"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { TodoTaskList } from "@microsoft/microsoft-graph-types"

interface TasksContextType {
  lists: TodoTaskList[]
  error: string | null
  loading: boolean
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<TodoTaskList[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTaskLists() {
      try {
        const response = await fetch("/api/tasks/lists")
        if (!response.ok) {
          throw new Error("Failed to fetch task lists")
        }
        const data: TodoTaskList[] = await response.json()
        setLists(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTaskLists()
  }, [])

  return (
    <TasksContext.Provider value={{ lists, error, loading }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasksContext() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useTasksContext must be used within a TasksProvider")
  }
  return context
}
