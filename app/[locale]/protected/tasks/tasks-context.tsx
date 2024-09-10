"use client"

import React from "react"

export interface SerializedTaskList {
  id: string
  displayName: string
}

export interface TasksContextProps {
  lists: SerializedTaskList[]
  error: string | null
}

export const TasksContext = React.createContext<TasksContextProps>({
  lists: [],
  error: null
})

export function TasksWrapper({
  children,
  lists,
  error
}: { children: React.ReactNode } & TasksContextProps) {
  return (
    <TasksContext.Provider value={{ lists, error }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasksContext() {
  return React.useContext(TasksContext)
}
