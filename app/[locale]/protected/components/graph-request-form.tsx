"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GraphRequestForm() {
  const router = useRouter()
  const [endpoint, setEndpoint] = useState(
    "https://graph.microsoft.com/v1.0/me"
  )
  const [scopes, setScopes] = useState(["User.Read"])
  const [requestBody, setRequestBody] = useState("")
  const [method, setMethod] = useState("GET")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams({
      endpoint,
      method,
      scopes: scopes.join(",")
    })
    if (method !== "GET" && requestBody) {
      searchParams.append("body", requestBody)
    }
    router.push(`/protected/graph-request?${searchParams.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="endpoint">Endpoint</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={e => setEndpoint(e.target.value)}
              placeholder="https://graph.microsoft.com/v1.0/me"
            />
          </div>
          <div>
            <Label htmlFor="scopes">Scopes (comma-separated)</Label>
            <Input
              id="scopes"
              value={scopes.join(",")}
              onChange={e => setScopes(e.target.value.split(","))}
              placeholder="User.Read"
            />
          </div>
          <div>
            <Label htmlFor="method">Method</Label>
            <select
              id="method"
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          {method !== "GET" && (
            <div>
              <Label htmlFor="requestBody">Request Body (JSON)</Label>
              <Textarea
                id="requestBody"
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                placeholder="{}"
                rows={4}
              />
            </div>
          )}
          <Button type="submit">Send Request</Button>
        </form>
      </CardContent>
    </Card>
  )
}
