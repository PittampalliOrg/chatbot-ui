// app/api/getEmbedLink/route.ts
import { NextRequest, NextResponse } from "next/server"
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary"
import { createGraphClient } from "@/Graph/graphClient" // Adjust the import path
import { CustomKiotaAuthenticationProvider } from "@/app/[locale]/protected/kiota/CustomKiotaAuthenticationProvider" // Adjust the import path
import {
  JsonParseNodeFactory,
  JsonSerializationWriterFactory
} from "@microsoft/kiota-serialization-json"
import {
  ParseNodeFactoryRegistry,
  SerializationWriterFactoryRegistry
} from "@microsoft/kiota-abstractions"
import { authProvider as myAuthProvider } from "@/app/[locale]/protected/services/auth" // Adjust the import path

// Create and register the JSON factories
const parseNodeFactoryRegistry = new ParseNodeFactoryRegistry()
parseNodeFactoryRegistry.contentTypeAssociatedFactories.set(
  "application/json",
  new JsonParseNodeFactory()
)

const serializationWriterFactoryRegistry =
  new SerializationWriterFactoryRegistry()
serializationWriterFactoryRegistry.contentTypeAssociatedFactories.set(
  "application/json",
  new JsonSerializationWriterFactory()
)

// Define the scopes required by your API
const scopes = [
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
]

// Instantiate the custom Kiota AuthenticationProvider
const authProvider = new CustomKiotaAuthenticationProvider(
  myAuthProvider,
  scopes
)

// Create request adapter using the fetch-based implementation
const adapter = new FetchRequestAdapter(
  authProvider,
  parseNodeFactoryRegistry,
  serializationWriterFactoryRegistry
)

// Create the API client
const client = createGraphClient(adapter)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { driveId, driveItemId } = body

  if (!driveId || !driveItemId) {
    return NextResponse.json(
      { error: "driveId and driveItemId are required" },
      { status: 400 }
    )
  }

  try {
    const response = await client.drives
      .byDriveId(driveId)
      .items.byDriveItemId(driveItemId)
      .preview.post({})
    console.log(response)
    const embedLink = response?.getUrl || ""

    return NextResponse.json({ embedLink })
  } catch (error) {
    console.error("Error fetching embed link:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
