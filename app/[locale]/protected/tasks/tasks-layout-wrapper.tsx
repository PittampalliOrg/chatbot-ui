"use client"

import React from "react"
import { TaskComboboxForm } from "./tasks-combobox-form"
import { TasksWrapper, SerializedTaskList } from "./tasks-context"

interface TasksLayoutWrapperProps {
  children: React.ReactNode
  lists: SerializedTaskList[]
  error: string | null
}

export function TasksLayoutWrapper({
  children,
  lists,
  error
}: TasksLayoutWrapperProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">Tasks</h1>
      <div className="mb-5">
        <TaskComboboxForm lists={lists} error={error} />
      </div>
      <TasksWrapper lists={lists} error={error}>
        {children}
      </TasksWrapper>
    </div>
  )
}
