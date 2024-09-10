import React from "react"
import { getLists } from "./actions"
import { TodoTaskList } from "@microsoft/microsoft-graph-types"

export default async function TasksLayout({
  children
}: {
  children: React.ReactNode
}) {
  const lists: TodoTaskList[] = await getLists()

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">Tasks</h1>
      {children}
    </div>
  )
}
