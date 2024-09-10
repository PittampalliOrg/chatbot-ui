import { getTaskLists } from "./actions"
import { TodoTaskList } from "@microsoft/microsoft-graph-types"
import { TasksLayoutWrapper } from "./tasks-layout-wrapper"
import { SerializedTaskList } from "./tasks-context"

interface TasksLayoutProps {
  children: React.ReactNode
}

export default async function TasksLayout({ children }: TasksLayoutProps) {
  let lists: TodoTaskList[] = []
  let error: string | null = null

  try {
    lists = await getTaskLists()
  } catch (e) {
    console.error("Error fetching lists:", e)
    error =
      e instanceof Error
        ? e.message
        : "An unknown error occurred while fetching lists"
  }

  const serializedLists: SerializedTaskList[] = lists
    .filter(
      (list): list is TodoTaskList & { id: string; displayName: string } =>
        typeof list.id === "string" && typeof list.displayName === "string"
    )
    .map(list => ({
      id: list.id,
      displayName: list.displayName
    }))

  return (
    <TasksLayoutWrapper lists={serializedLists} error={error}>
      {children}
    </TasksLayoutWrapper>
  )
}
