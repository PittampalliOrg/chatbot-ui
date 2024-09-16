// app/[locale]/protected/mgt/Search/AllResults.tsx
"use client"

import * as React from "react"
import { IResultsProps } from "./IResultsProps"
import { MgtTemplateProps, SearchResults } from "@microsoft/mgt-react"

export const AllResults: React.FunctionComponent<IResultsProps> = ({
  searchTerm
}) => {
  return (
    <>
      {searchTerm && (
        <>
          {searchTerm !== "*" && (
            <SearchResults
              entityTypes={["bookmark"]}
              queryString={searchTerm}
              version="beta"
              size={1}
              scopes={["Bookmark.Read.All"]}
            >
              <NoDataTemplate />
            </SearchResults>
          )}
          <SearchResults
            entityTypes={["driveItem", "listItem", "site"]}
            queryString={searchTerm}
            scopes={["Files.Read.All", "Sites.Read.All"]}
            fetchThumbnail={true}
          />
        </>
      )}
    </>
  )
}

const NoDataTemplate: React.FC<MgtTemplateProps> = props => {
  if (props.template !== "no-data") return null
  return <></>
}
