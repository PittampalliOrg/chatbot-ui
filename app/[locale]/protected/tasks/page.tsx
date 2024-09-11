import { Suspense } from "react"
import TaskList from "./components/task-list"
import TaskListSkeleton from "./components/task-table-skeleton"

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Your Task Lists</h2>
      <Suspense fallback={<TaskListSkeleton />}>
        <TaskList />
      </Suspense>
    </div>
  )
}
