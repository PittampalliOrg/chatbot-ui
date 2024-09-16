"use client"

import { FileList, ThemeToggle } from "@microsoft/mgt-react"
import * as React from "react"
import MgtProvider from "../../protected/actions/mgt-provider"
import TabsComponent from "./tabs"

interface FileItem {
  webUrl: string
  name: string
}

const FilesPage: React.FunctionComponent = () => {
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null)
  const fileListRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const fileListElement = fileListRef.current
    if (fileListElement) {
      const handleItemClick = (e: Event) => {
        const customEvent = e as CustomEvent
        const file = customEvent.detail as FileItem
        setSelectedFile(file)
      }

      fileListElement.addEventListener("itemClick", handleItemClick)

      return () => {
        fileListElement.removeEventListener("itemClick", handleItemClick)
      }
    }
  }, [])

  return (
    <MgtProvider>
      <div className="p-4">
        <ThemeToggle />
        <TabsComponent />
        <div className="mt-4 flex space-x-4">
          <div className="w-1/2">
            <FileList
              ref={fileListRef}
              insightType="used"
              enableFileUpload={false}
              pageSize={25}
            />
          </div>
          <div className="w-1/2">
            {selectedFile ? (
              <div className="rounded-lg border p-4">
                <h2 className="mb-2 text-xl font-bold">{selectedFile.name}</h2>
                <iframe
                  src={selectedFile.webUrl}
                  title={selectedFile.name}
                  className="h-[calc(100vh-200px)] w-full"
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border p-4 text-gray-500">
                Select a file to view its contents
              </div>
            )}
          </div>
        </div>
      </div>
    </MgtProvider>
  )
}

export default FilesPage
