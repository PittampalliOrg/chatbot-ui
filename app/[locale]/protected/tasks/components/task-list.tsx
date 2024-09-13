"use client"

import React from "react"
import Link from "next/link"
import { useTasksContext } from "../tasks-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function TaskList() {
  const { lists, error } = useTasksContext()

  if (error) {
    return <div className="text-red-500">Error loading task lists: {error}</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lists.map(list => (
        <Card key={list.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {list.displayName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {list.tasks?.length || 0} tasks
            </div>
            <p className="text-muted-foreground text-xs">in this list</p>
            <Button asChild className="mt-4 w-full">
              <Link href={`/protected/tasks/${list.id}`}>View Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Create New List</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="mt-4 w-full" variant="outline">
            <PlusCircle className="mr-2 size-4" />
            Add New List
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
