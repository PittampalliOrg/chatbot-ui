import { InteractionRequiredAuthError } from "@azure/msal-node"
import { graphConfig } from "../serverConfig"
import { authProvider } from "../services/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { acquireTasksTokenInteractive } from "../actions/auth"
import { redirect } from "next/navigation"
import Error from "./error"

interface TaskList {
  id: string
  displayName: string
  isOwner: boolean
  isShared: boolean
}

async function getTaskLists(): Promise<TaskList[] | null> {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return null
  }

  try {
    const token = await instance.acquireTokenSilent({
      account,
      scopes: ["Tasks.Read"]
    })

    if (!token) {
      throw new InteractionRequiredAuthError()
    }

    const response = await fetch(`${graphConfig.meEndpoint}/todo/lists`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: { value: TaskList[] } = await response.json()
    return data.value
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await acquireTasksTokenInteractive()
    }
    throw error
  }
}

export default async function TasksPage() {
  try {
    const taskLists = await getTaskLists()

    if (taskLists === null) {
      return redirect("/")
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">My Task Lists</h1>
        <Card>
          <CardHeader>
            <CardTitle>Task Lists</CardTitle>
            <CardDescription>Your Microsoft To-Do task lists</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {taskLists.map((list, index) => (
                <div key={list.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium leading-none">
                        {list.displayName}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {list.isOwner ? "Owner" : "Shared with you"}
                      </p>
                    </div>
                    {list.isShared && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Shared
                      </span>
                    )}
                  </div>
                  {index < taskLists.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    if (error instanceof Error) {
      return <Error error={error} />
    }
    return <Error error={new Error(String(error))} />
  }
}
