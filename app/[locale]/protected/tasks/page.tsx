import { InteractionRequiredAuthError } from "@azure/msal-node"
import { CalendarEvent, GraphCalendarEvent } from "../components/CalendarEvent"
import { graphConfig } from "../serverConfig"
import { authProvider } from "../services/auth"

async function getTaskLists() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    throw new Error("No Account logged in")
  }

  try {
    const token = await instance.acquireTokenSilent({
      account,
      scopes: ["Tasks.Read"]
    })

    if (!token) {
      throw new Error("Token null")
    }

    const response = await fetch(graphConfig.meEndpoint + "/todo/lists", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    })

    const data: { value: GraphCalendarEvent[] } = await response.json()

    return data.value[0]
  } catch (error: unknown) {
    // rethrow with a message that can be serialized and read by a client component
    // https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-server-errors
    if (error instanceof InteractionRequiredAuthError) {
      throw new Error("InteractionRequiredAuthError")
    }
    throw error
  }
}

export default async function TasksPage() {
  const tasks = await getTaskLists()

  return JSON.stringify(tasks)
}
