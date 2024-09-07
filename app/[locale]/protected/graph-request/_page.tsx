import { redirect } from "next/navigation"
import { authProvider } from "../services/auth"
import { GraphRequestForm } from "../components/graph-request-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GraphRequestResult {
  request: string
  response: string
}

async function makeGraphRequest(
  endpoint: string,
  method: string,
  scopes: string[],
  body?: string
) {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return null
  }

  const token = await instance.acquireTokenSilent({
    account,
    scopes
  })

  if (!token) {
    return null
  }

  const headers = new Headers({
    Authorization: `Bearer ${token.accessToken}`,
    "Content-Type": "application/json"
  })

  const requestOptions: RequestInit = {
    method,
    headers,
    body: method !== "GET" ? body : undefined
  }

  const request = JSON.stringify(
    { endpoint, method, headers: Object.fromEntries(headers), body },
    null,
    2
  )

  const response = await fetch(endpoint, requestOptions)
  const data = await response.json()

  return {
    request,
    response: JSON.stringify(data, null, 2)
  } as GraphRequestResult
}

export default async function GraphRequestPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  let result: GraphRequestResult | null = null

  if (searchParams.endpoint && searchParams.method && searchParams.scopes) {
    const endpoint = searchParams.endpoint as string
    const method = searchParams.method as string
    const scopes = (searchParams.scopes as string).split(",")
    const body = searchParams.body as string | undefined

    result = await makeGraphRequest(endpoint, method, scopes, body)
  }

  if (searchParams.endpoint && !result) {
    return redirect("/protected/graph-request")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Microsoft Graph API Tester</h1>
      <GraphRequestForm />
      {result && (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Request</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-2">
                {result.request}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-2">
                {result.response}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
