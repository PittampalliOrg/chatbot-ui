import React from "react"
import { TasksProvider } from "./tasks-context"

export default function TasksLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <TasksProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">Tasks</h1>
        {children}
      </div>
    </TasksProvider>
  )
}
