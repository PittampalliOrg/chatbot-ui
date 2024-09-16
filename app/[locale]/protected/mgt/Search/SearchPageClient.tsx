// app/search/SearchPageClient.tsx
"use client"

import * as React from "react"
import { AllResults, PeopleResults } from "."
import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabValue,
  makeStyles,
  shorthands
} from "@fluentui/react-components"
import { ExternalItemsResults } from "./ExternalItemsResults"
import { FilesResults } from "./FilesResults"
import { useRouter, useSearchParams } from "next/navigation"

const useStyles = makeStyles({
  panels: {
    ...shorthands.padding("10px")
  },
  container: {
    maxWidth: "1028px",
    width: "100%"
  }
})

export default function SearchPageClient({
  initialQuery
}: {
  initialQuery: string
}) {
  const styles = useStyles()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTab, setSelectedTab] = React.useState<TabValue>("allResults")

  const query = searchParams.get("q") || initialQuery

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value)
  }

  React.useEffect(() => {
    if (query && query !== searchParams.get("q")) {
      router.push(`/protected/mgt/Search?q=${encodeURIComponent(query)}`)
    }
  }, [query, router, searchParams])

  return (
    <div className={styles.container}>
      <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
        <Tab value="allResults">All Results</Tab>
        <Tab value="driveItems">Files</Tab>
        <Tab value="externalItems">External Items</Tab>
        <Tab value="people">People</Tab>
      </TabList>
      <div className={styles.panels}>
        {selectedTab === "allResults" && <AllResults searchTerm={query} />}
        {selectedTab === "driveItems" && <FilesResults searchTerm={query} />}
        {selectedTab === "externalItems" && (
          <ExternalItemsResults searchTerm={query} />
        )}
        {selectedTab === "people" && <PeopleResults searchTerm={query} />}
      </div>
    </div>
  )
}
