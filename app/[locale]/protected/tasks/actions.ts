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
          return response.json()
        },
        delete: async () => {
          await fetch(`${graphConfig.graphEndpoint}${endpoint}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token.accessToken}`
            }
          })
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

export async function getTasks(
  listId: string = "AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA="
): Promise<TodoTask[]> {
  const client = await getGraphClient()
  const response = await client.api(`/me/todo/lists/${listId}/tasks`).get()
  return response.value
}

export async function getLists(): Promise<TodoTaskList[]> {
  const client = await getGraphClient()
  const response = await client.api(`/me/todo/lists`).get()
  return response.value
}

export async function addTasks(
  listId: string = "AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA=",
  tasks: string[]
): Promise<TodoTask[]> {
  const client = await getGraphClient()
  let addedTasks: TodoTask[] = []

  if (tasks.length < 2) {
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
  listId: string = "AAMkADhmYjY3M2VlLTc3YmYtNDJhMy04MjljLTg4NDI0NzQzNjJkMAAuAAAAAAAqiN_iXOf5QJoancmiEuQzAQAVAdL-uyq-SKcP7nACBA3lAAAAO9QQAAA=",
  taskIds: string[]
) {
  const client = await getGraphClient()

  if (taskIds.length < 2) {
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
