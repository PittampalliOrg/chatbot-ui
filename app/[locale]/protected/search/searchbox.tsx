"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchResults, ThemeToggle } from "@microsoft/mgt-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchResult {
  webUrl: string
  name: string
  id: string
}

export default function SearchComponent({ initialQuery = "" }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [selectedFile, setSelectedFile] = useState<SearchResult | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchResultsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setSearchTerm(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const handleItemClick = (e: Event) => {
      console.log(e)
      const customEvent = e as CustomEvent
      const clickedFile = customEvent.detail as SearchResult
      setSelectedFile(clickedFile)
      updateUrlWithFileId(clickedFile.id)
    }

    const searchResultsElement = searchResultsRef.current
    if (searchResultsElement) {
      searchResultsElement.addEventListener("itemClick", handleItemClick)
    }

    return () => {
      if (searchResultsElement) {
        searchResultsElement.removeEventListener("itemClick", handleItemClick)
      }
    }
  }, [])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateSearchParams()
  }

  const updateSearchParams = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (searchTerm) {
      current.set("q", searchTerm)
    } else {
      current.delete("q")
    }
    current.delete("fileId") // Remove fileId when performing a new search
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`/protected/search${query}`)
  }

  const updateUrlWithFileId = (fileId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("fileId", fileId)
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`/protected/search${query}`, { scroll: false })
  }

  return (
    <>
      <ThemeToggle />
      <div className="flex h-[calc(100vh-100px)]">
        <div className="w-1/2 space-y-4 overflow-y-auto p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Search files..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="grow"
            />
            <Button type="submit">
              <Search className="mr-2 size-4" />
              Search
            </Button>
          </form>
          <SearchResults
            ref={searchResultsRef}
            entityTypes={["driveItem", "listItem", "site"]}
            queryString={searchTerm}
            scopes={["Files.Read.All", "Sites.Read.All"]}
            fetchThumbnail={true}
          />
        </div>
        <div className="w-1/2 border-l p-4">
          {selectedFile ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{selectedFile.name}</h2>
              <iframe
                src={selectedFile.webUrl}
                title={selectedFile.name}
                className="h-[calc(100vh-200px)] w-full"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </>
  )
}
