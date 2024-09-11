import { Suspense } from "react"
import { notFound } from "next/navigation"
import TaskTable from "../components/task-table"
import TaskTableSkeleton from "../components/task-table-skeleton" // Update the import statement to the correct file path
import { getList } from "../actions"

export default async function TaskListPage({
  params
}: {
  params: { listId: string }
}) {
  const list = await getList(params.listId)

  if (!list) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">{list.displayName}</h2>
      <Suspense fallback={<TaskTableSkeleton />}>
        <TaskTable listId={params.listId} />
      </Suspense>
    </div>
  )
}
