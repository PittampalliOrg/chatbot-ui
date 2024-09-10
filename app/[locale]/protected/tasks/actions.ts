"use server"

import { revalidatePath } from "next/cache"
import { InteractionRequiredAuthError } from "@azure/msal-node"
import { TodoTask, TodoTaskList } from "@microsoft/microsoft-graph-types"
import { graphConfig } from "@/app/[locale]/protected/serverConfig"
import { authProvider } from "@/app/[locale]/protected/services/auth"

async function getGraphClient() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    throw new Error("No Account logged in")
  }

  try {
    const token = await instance.acquireTokenSilent({
      account,
      scopes: ["Tasks.ReadWrite"]
    })

    if (!token) {
      throw new Error("Token null")
    }

    return {
      api: (endpoint: string) => ({
        get: async () => {
          const response = await fetch(
            `${graphConfig.graphEndpoint}${endpoint}`,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`
              }
            }
          )
          if (!response.ok) {
            const errorText = await response.text()
            console.error(`API Error Response: ${errorText}`)
            throw new Error(
              `HTTP error! status: ${response.status}, body: ${errorText}`
            )
          }
          return response.json()
        },
        post: async (body: any) => {
          const response = await fetch(
            `${graphConfig.graphEndpoint}${endpoint}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            }
          )
          if (!response.ok) {
            const errorText = await response.text()
            console.error(`API Error Response: ${errorText}`)
            throw new Error(
              `HTTP error! status: ${response.status}, body: ${errorText}`
            )
          }
          return response.json()
        },
        delete: async () => {
          const response = await fetch(
            `${graphConfig.graphEndpoint}${endpoint}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token.accessToken}`
              }
            }
          )
          if (!response.ok) {
            const errorText = await response.text()
            console.error(`API Error Response: ${errorText}`)
            throw new Error(
              `HTTP error! status: ${response.status}, body: ${errorText}`
            )
          }
        }
      })
    }
  } catch (error: unknown) {
    if (error instanceof InteractionRequiredAuthError) {
      throw new Error("InteractionRequiredAuthError")
    }
    throw error
  }
}

function isValidListId(listId: string): boolean {
  return typeof listId === "string" && listId.trim().length > 0
}

export async function getTasks(listId: string): Promise<TodoTask[]> {
  if (!listId) {
    throw new Error("List ID is required")
  }

  if (!isValidListId(listId)) {
    throw new Error("Invalid list ID format")
  }

  const client = await getGraphClient()
  try {
    console.log(`Fetching tasks for list ID: ${listId}`)
    const response = await client.api(`/me/todo/lists/${listId}/tasks`).get()
    console.log(`API Response for tasks:`, response)
    return response.value
  } catch (error) {
    console.error("Error fetching tasks:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    } else {
      throw new Error("An unknown error occurred while fetching tasks")
    }
  }
}

export async function getLists(): Promise<TodoTaskList[]> {
  const client = await getGraphClient()
  try {
    const response = await client.api(`/me/todo/lists`).get()
    console.log(`API Response for lists:`, response)
    return response.value
  } catch (error) {
    console.error("Error fetching lists:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch lists: ${error.message}`)
    } else {
      throw new Error("An unknown error occurred while fetching lists")
    }
  }
}

export async function addTasks(
  listId: string,
  tasks: string[]
): Promise<TodoTask[]> {
  if (!listId || !isValidListId(listId)) {
    throw new Error("Invalid list ID")
  }

  const client = await getGraphClient()
  let addedTasks: TodoTask[] = []

  if (tasks.length === 0) {
    return addedTasks
  }

  if (tasks.length === 1) {
    const todoTask = { title: tasks[0] }
    const singleTaskResponse = await client
      .api(`/me/todo/lists/${listId}/tasks`)
      .post(todoTask)
    addedTasks.push(singleTaskResponse)
  } else {
    const batchRequestBody = {
      requests: tasks.map((task, index) => ({
        id: index.toString(),
        method: "POST",
        url: `/me/todo/lists/${listId}/tasks`,
        headers: {
          "Content-Type": "application/json"
        },
        body: { title: task }
      }))
    }

    const batchResponse = await client.api("/$batch").post(batchRequestBody)
    addedTasks = batchResponse.responses
      .filter((res: any) => res.status === 201)
      .map((res: any) => res.body)
  }

  revalidatePath("/tasks")
  return addedTasks
}

export async function deleteTasks(
  listId: string,
  taskIds: string[]
): Promise<void> {
  if (!listId || !isValidListId(listId)) {
    throw new Error("Invalid list ID")
  }

  if (taskIds.length === 0) {
    return
  }

  const client = await getGraphClient()

  if (taskIds.length === 1) {
    await client.api(`/me/todo/lists/${listId}/tasks/${taskIds[0]}`).delete()
  } else {
    const batchRequestBody = {
      requests: taskIds.map((taskId, index) => ({
        id: index.toString(),
        method: "DELETE",
        url: `/me/todo/lists/${listId}/tasks/${taskId}`,
        headers: {
          "Content-Type": "application/json"
        }
      }))
    }

    await client.api("/$batch").post(batchRequestBody)
  }

  revalidatePath("/tasks")
}
