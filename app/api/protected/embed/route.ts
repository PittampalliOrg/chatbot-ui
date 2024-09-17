// app/api/getEmbedLink/route.ts
import { NextRequest, NextResponse } from "next/server"
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary"
import { createBeta } from "@/Beta/beta"
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
const beta = createBeta(adapter)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { driveId, driveItemId, mimeType } = body

  if (!driveId || !driveItemId) {
    return NextResponse.json(
      { error: "driveId and driveItemId are required" },
      { status: 400 }
    )
  }
  const options = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
    "text/csv",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.template",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
    "application/msonenote",
    "application/vnd.ms-visio.drawing"
  ]

  const previewOptions = options.includes(mimeType)
    ? { allowEdit: true, viewer: "office" }
    : {}

  try {
    const response = await beta.drives
      .byDriveId(driveId)
      .items.byDriveItemId(driveItemId)
      .preview.post(previewOptions)
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
