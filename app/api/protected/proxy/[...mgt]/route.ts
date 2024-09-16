// /app/api/protected/proxy/[...mgt]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { authProvider } from "@/app/[locale]/protected/services/auth" // Adjust the import path

// Supported HTTP methods
export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const DELETE = handleProxy
export const PATCH = handleProxy

async function handleProxy(
  request: NextRequest,
  { params }: { params: { mgt?: string[] } }
) {
  // Authenticate the user using your existing AuthProvider
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return NextResponse.json(
      { error: "User is not authenticated" },
      { status: 401 }
    )
  }

  // Prepare the token request
  const tokenRequest = {
    scopes: [
      "Bookmark.Read.All",
      "Calendars.Read",
      "ExternalItem.Read.All",
      "Files.Read",
      "Files.Read.All",
      "Files.ReadWrite.All",
      "Group.Read.All",
      "Group.ReadWrite.All",
      "Mail.Read",
      "Mail.ReadBasic",
      "People.Read",
      "People.Read.All",
      "Presence.Read.All",
      "User.Read",
      "Sites.Read.All",
      "Sites.ReadWrite.All",
      "Tasks.Read",
      "Tasks.ReadWrite",
      "Team.ReadBasic.All",
      "User.ReadBasic.All",
      "User.Read.All"
    ],
    account: account
  }

  // Acquire token silently
  let authResult
  try {
    authResult = await instance.acquireTokenSilent(tokenRequest)
  } catch (error) {
    console.error("Error acquiring token silently:", error)
    return NextResponse.json(
      { error: "Failed to acquire access token" },
      { status: 500 }
    )
  }

  if (!authResult || !authResult.accessToken) {
    return NextResponse.json(
      { error: "Failed to acquire access token" },
      { status: 500 }
    )
  }

  // Extract the path from the params
  const mgtPath = params.mgt ? params.mgt.join("/") : ""
  // Construct the URL to Microsoft Graph API
  const graphUrl = `https://graph.microsoft.com/${mgtPath}${request.nextUrl.search}`

  // Prepare the headers
  const headers = new Headers()
  // Copy request headers, excluding host and other forbidden headers
  request.headers.forEach((value, key) => {
    if (
      !["host", "connection", "content-length", "accept-encoding"].includes(
        key.toLowerCase()
      )
    ) {
      headers.set(key, value)
    }
  })
  // Set the Authorization header
  headers.set("Authorization", `Bearer ${authResult.accessToken}`)
  // Set 'Accept-Encoding' to 'identity' to prevent compression
  headers.set("Accept-Encoding", "identity")

  // Prepare the request options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers
  }

  // Handle the request body for methods that have one
  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("content-type") || ""
    let body: any

    if (contentType.includes("application/json")) {
      body = JSON.stringify(await request.json())
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      body = await request.text()
    } else if (contentType.includes("multipart/form-data")) {
      body = request.body
    } else {
      body = await request.arrayBuffer()
    }

    fetchOptions.body = body
  }

  try {
    // Make the request to Microsoft Graph API
    const response = await fetch(graphUrl, fetchOptions)

    // Remove 'content-encoding' header from the response
    const responseHeaders = new Headers(response.headers)
    responseHeaders.delete("content-encoding")
    responseHeaders.delete("transfer-encoding")

    // Return the response with adjusted headers
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders
    })
  } catch (error) {
    console.error("Error proxying request:", error)
    return NextResponse.json(
      { error: "Error proxying request" },
      { status: 500 }
    )
  }
}
