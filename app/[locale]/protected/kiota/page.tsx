// app/page.tsx or app/[locale]/protected/kiota/page.tsx
import { TodoTaskList } from "@/kiota/models/index" // Adjust the import path as needed
import { getTaskLists } from "./actions" // Adjust the import path as needed

export default async function TaskListsPage() {
  let taskLists: TodoTaskList[] = []
  let error: string | null = null

  try {
    taskLists = await getTaskLists()
  } catch (err) {
    error = "Failed to fetch task lists"
    console.error(error, err)
  }

  return (
    <div>
      <h1>Task Lists</h1>
      {error ? (
        <div>Error: {error}</div>
      ) : taskLists.length === 0 ? (
        <p>No task lists found.</p>
      ) : (
        <ul>
          {taskLists.map(list => (
            <li key={list.id}>
              <h2>{list.displayName}</h2>
              {/* Add more details or actions here if needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
