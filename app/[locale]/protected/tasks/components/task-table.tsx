"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "../data-table"
import { columns } from "../columns"
import { getTasks, addTask, deleteTask, updateTask } from "../actions"
import { OptimisticTask } from "../types"
import { useToast } from "@/components/ui/use-toast"
import { TodoTask } from "@microsoft/microsoft-graph-types"

export default function TaskTable({ listId }: { listId: string }) {
  const [tasks, setTasks] = React.useState<OptimisticTask[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()
  const { toast } = useToast()

  React.useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks = await getTasks(listId)
        setTasks(fetchedTasks as OptimisticTask[])
      } catch (error) {
        console.error("Error fetching tasks:", error)
        toast({
          title: "Error",
          description: "Failed to fetch tasks. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [listId, toast])

  const handleAddTask = React.useCallback(
    async (title: string) => {
      const newTask: OptimisticTask = {
        id: Date.now().toString(),
        title,
        status: "notStarted",
        importance: "normal",
        createdDateTime: new Date().toISOString(),
        sending: true
      }

      setTasks(prevTasks => [...prevTasks, newTask])

      try {
        const addedTask = await addTask(listId, title)
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === newTask.id
              ? ({ ...addedTask, sending: false } as OptimisticTask)
              : task
          )
        )
        toast({
          title: "Task added",
          description: "New task has been successfully added."
        })
      } catch (error) {
        console.error("Failed to add task:", error)
        setTasks(prevTasks => prevTasks.filter(task => task.id !== newTask.id))
        toast({
          title: "Error",
          description: "Failed to add new task. Please try again.",
          variant: "destructive"
        })
      }

      router.refresh()
    },
    [listId, router, toast]
  )

  const handleDeleteTask = React.useCallback(
    async (taskId: string) => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

      try {
        await deleteTask(listId, taskId)
        toast({
          title: "Task deleted",
          description: "Task has been successfully deleted."
        })
      } catch (error) {
        console.error("Failed to delete task:", error)
        const tasks = await getTasks(listId)
        setTasks(tasks as OptimisticTask[])
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive"
        })
      }

      router.refresh()
    },
    [listId, router, toast]
  )

  const handleUpdateTask = React.useCallback(
    async (taskId: string, updates: Partial<TodoTask>) => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...updates, sending: true } : task
        )
      )

      try {
        const updatedTask = await updateTask(listId, taskId, updates)
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId
              ? ({ ...updatedTask, sending: false } as OptimisticTask)
              : task
          )
        )
        toast({
          title: "Task updated",
          description: "Task has been successfully updated."
        })
      } catch (error) {
        console.error("Failed to update task:", error)
        const tasks = await getTasks(listId)
        setTasks(tasks as OptimisticTask[])
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive"
        })
      }

      router.refresh()
    },
    [listId, router, toast]
  )

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  return (
    <DataTable
      columns={columns}
      data={tasks}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      onUpdateTask={handleUpdateTask}
    />
  )
}
