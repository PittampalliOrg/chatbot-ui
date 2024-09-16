// app/search/ExternalItemsResults.tsx
"use client"

import { SearchResults } from "@microsoft/mgt-react"
import * as React from "react"
import { IResultsProps } from "./IResultsProps"

export const ExternalItemsResults: React.FunctionComponent<IResultsProps> = ({
  searchTerm
}) => {
  return (
    <>
      {searchTerm && (
        <SearchResults
          entityTypes={["externalItem"]}
          contentSources={["/external/connections/contosoBlogPosts"]}
          queryString={searchTerm}
          scopes={["ExternalItem.Read.All"]}
          version="beta"
        />
      )}
    </>
  )
}
