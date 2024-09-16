"use client"

import { FileList, ThemeToggle } from "@microsoft/mgt-react"
import * as React from "react"
import MgtProvider from "../../protected/actions/mgt-provider"
import TabsComponent from "./tabs"

interface FileItem {
  driveId: string
  driveItemId: string
  webUrl: string
  name: string
  mimeType: string
}

export default function FilesPage() {
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null)
  const [embedLink, setEmbedLink] = React.useState<string>("")
  const fileListRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const fileListElement = fileListRef.current
    if (fileListElement) {
      const handleItemClick = (e: Event) => {
        const customEvent = e as CustomEvent
        const driveItem = customEvent.detail
        console.log(driveItem)
        const file: FileItem = {
          driveId: driveItem.parentReference.driveId,
          driveItemId: driveItem.id,
          name: driveItem.name,
          webUrl: driveItem.webUrl,
          mimeType: driveItem.file.mimeType
        }
        setSelectedFile(file)
      }

      fileListElement.addEventListener("itemClick", handleItemClick)

      return () => {
        fileListElement.removeEventListener("itemClick", handleItemClick)
      }
    }
  }, [])

  React.useEffect(() => {
    const fetchEmbedLink = async () => {
      if (selectedFile) {
        try {
          const response = await fetch(`/api/protected/embed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              driveId: selectedFile.driveId,
              driveItemId: selectedFile.driveItemId
            })
          })

          const data = await response.json()

          if (response.ok) {
            setEmbedLink(data.embedLink)
          } else {
            console.error("Error fetching embed link:", data.error)
            setEmbedLink("")
          }
        } catch (error) {
          console.error("Error fetching embed link:", error)
          setEmbedLink("")
        }
      } else {
        setEmbedLink("")
      }
    }

    fetchEmbedLink()
  }, [selectedFile])

  return (
    <MgtProvider>
      <div className="flex h-screen flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <ThemeToggle />
        </div>
        <div className="flex grow flex-col space-y-4 overflow-hidden lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="w-full overflow-auto lg:w-1/3 xl:w-1/4">
            <FileList
              ref={fileListRef}
              insightType="used"
              enableFileUpload={false}
              pageSize={25}
              disableOpenOnClick={true}
            />
          </div>
          <div className="flex w-full flex-col lg:w-2/3 xl:w-3/4">
            {selectedFile ? (
              <div className="flex h-full flex-col rounded-lg border p-4">
                {embedLink ? (
                  <iframe
                    src={embedLink}
                    title={selectedFile.name}
                    className="w-full grow"
                    style={{ minHeight: "500px" }}
                    frameBorder="0"
                  />
                ) : (
                  <p className="py-4 text-center">Loading embed link...</p>
                )}
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
