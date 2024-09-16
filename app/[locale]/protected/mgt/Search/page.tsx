// app/search/page.tsx
import { Suspense } from "react"
import SearchPageClient from "./SearchPageClient"
import { PageHeader } from "../components/PageHeader"

export default function SearchPage({
  searchParams
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""

  return (
    <>
      <PageHeader
        title="Search"
        description="Use this Search Center to test Microsoft Graph Toolkit search components capabilities"
      />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPageClient initialQuery={query} />
      </Suspense>
    </>
  )
}
