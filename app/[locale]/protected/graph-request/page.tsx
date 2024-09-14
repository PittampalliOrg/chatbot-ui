"use client"
// app/[locale]/protected/mgt/page.tsx

import React from "react"
import MgtProvider from "../../protected/actions/mgt-provider"
import { Todo, FileList } from "@microsoft/mgt-react"

export default function MgtSamplePage() {
  return (
    <MgtProvider>
      <div>
        <h1>Microsoft Graph Toolkit Sample</h1>
        <FileList />
      </div>
    </MgtProvider>
  )
}
