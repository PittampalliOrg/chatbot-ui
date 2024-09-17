import { Suspense } from "react"
import SearchComponent from "./searchbox"
import MgtProvider from "../../protected/actions/mgt-provider"
import TabsComponent from "./tabs"

export default function FilesPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const searchTerm = searchParams.q || ""

  return (
    <MgtProvider>
      <TabsComponent />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchComponent initialQuery={searchTerm} />
      </Suspense>
    </MgtProvider>
  )
}
