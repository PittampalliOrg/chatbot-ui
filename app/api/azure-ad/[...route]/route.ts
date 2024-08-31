// app/api/azure-ad/[...route]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { EnrichedSession } from "@/auth"
import { Client } from "@microsoft/microsoft-graph-client"
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials"
import { ClientSecretCredential } from "@azure/identity"

export async function GET(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const session = (await auth()) as EnrichedSession | null

  if (!session || !session.providers || !session.providers["azure-ad"]) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { accessToken, refreshToken } = session.providers["azure-ad"]

  // Create a credential using client secret
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID!,
    process.env.AZURE_CLIENT_ID!,
    process.env.AZURE_CLIENT_SECRET!
  )

  // Create an auth provider using the credential
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"]
  })

  // Initialize the Graph client
  const graphClient = Client.initWithMiddleware({ authProvider })

  try {
    let result

    switch (params.route[0]) {
      case "me":
        result = await graphClient.api("/me").get()
        break
      case "calendar":
        result = await graphClient
          .api("/me/calendar/events")
          .select("subject,organizer,start,end")
          .orderby("createdDateTime DESC")
          .get()
        break
      // Add more cases for different API endpoints as needed
      default:
        return NextResponse.json({ error: "Invalid route" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error calling Microsoft Graph API:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = (await auth()) as EnrichedSession | null

  if (!session || !session.providers || !session.providers["azure-ad"]) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { accessToken, refreshToken } = session.providers["azure-ad"]

  // Create a credential using client secret
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID!,
    process.env.AZURE_CLIENT_ID!,
    process.env.AZURE_CLIENT_SECRET!
  )

  // Create an auth provider using the credential
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"]
  })

  // Initialize the Graph client
  const graphClient = Client.initWithMiddleware({ authProvider })

  try {
    const body = await request.json()

    // Example: Create a calendar event
    const result = await graphClient.api("/me/events").post(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error calling Microsoft Graph API:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
