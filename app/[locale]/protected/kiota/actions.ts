import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary"
import { createGraphClient } from "@/Graph/graphClient" // Adjust the import path
import { CustomKiotaAuthenticationProvider } from "./CustomKiotaAuthenticationProvider" // Adjust the import path
import {
  JsonParseNodeFactory,
  JsonSerializationWriterFactory
} from "@microsoft/kiota-serialization-json"
import {
  ParseNodeFactoryRegistry,
  SerializationWriterFactoryRegistry
} from "@microsoft/kiota-abstractions"
import { Message } from "@/Graph/models" // Adjust the import path
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
const scopes = ["Mail.ReadWrite"] // Adjust the scopes as needed

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

export async function getMessages(): Promise<Partial<Message>[]> {
  try {
    // GET /me/messages?$top=5&$select=toRecipients,from,subject,bodyPreview&$orderby=receivedDateTime desc
    const messagesResponse = await client.me.messages.get({
      queryParameters: {
        top: 5,
        select: ["toRecipients", "from", "subject", "bodyPreview"], // Select specific fields
        orderby: ["receivedDateTime desc"] // Order by the most recent
      }
    })

    // Access the 'value' property to get the array of messages
    const messages = messagesResponse?.value || []

    // Return only the relevant fields from each message
    return messages.map(message => ({
      toRecipients: message.toRecipients,
      from: message.from,
      subject: message.subject,
      bodyPreview: message.bodyPreview
    }))
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}
