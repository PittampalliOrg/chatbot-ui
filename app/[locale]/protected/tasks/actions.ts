import { TodoTask, TodoTaskList } from "@microsoft/microsoft-graph-types"

export async function getTasks(listId: string): Promise<TodoTask[]> {
  try {
    const response = await fetch(`/api/tasks/${listId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error("Failed to fetch tasks")
    }

    const tasks: TodoTask[] = await response.json()
    return tasks
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
}

export async function getList(listId: string): Promise<TodoTaskList | null> {
  try {
    const response = await fetch(`/api/tasks/lists/${listId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error("Failed to fetch task list")
    }

    const list: TodoTaskList = await response.json()
    return list
  } catch (error) {
    console.error("Error fetching task list:", error)
    return null
  }
}

export async function addTask(
  listId: string,
  title: string
): Promise<TodoTask> {
  try {
    const response = await fetch(`/api/tasks/${listId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    })

    if (!response.ok) {
      throw new Error("Failed to add task")
    }

    const newTask: TodoTask = await response.json()
    return newTask
  } catch (error) {
    console.error("Error adding task:", error)
    throw error
  }
}

export async function deleteTask(
  listId: string,
  taskId: string
): Promise<void> {
  try {
    const response = await fetch(`/api/tasks/${listId}/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error("Failed to delete task")
    }
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

export async function updateTask(
  listId: string,
  taskId: string,
  updates: Partial<TodoTask>
): Promise<TodoTask> {
  try {
    const response = await fetch(`/api/tasks/${listId}/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error("Failed to update task")
    }

    const updatedTask: TodoTask = await response.json()
    return updatedTask
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export async function addTasks() {}

export async function deleteTasksAndGetUpdated() {}
