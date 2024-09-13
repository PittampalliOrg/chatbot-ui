import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary"
import { createApiClient } from "@/kiota/apiClient" // Adjust the import path
import { CustomKiotaAuthenticationProvider } from "./CustomKiotaAuthenticationProvider" // Adjust the import path
import {
  JsonParseNodeFactory,
  JsonSerializationWriterFactory
} from "@microsoft/kiota-serialization-json"
import {
  ParseNodeFactoryRegistry,
  SerializationWriterFactoryRegistry
} from "@microsoft/kiota-abstractions"
import { TodoTaskList } from "@/kiota/models/index" // Adjust the import path
import { authProvider as myAuthProvider } from "@/app/[locale]/protected/services/auth"

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
const scopes = ["User.Read"] // Adjust the scopes as needed

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
const client = createApiClient(adapter)

// Now you can use the client in your actions
export async function getTaskLists(): Promise<TodoTaskList[]> {
  try {
    // GET /me/todo/lists
    const allTaskListsResponse = await client.me.todo.lists.get()

    // Access the 'value' property to get the array of task lists
    const allTaskLists = allTaskListsResponse?.value || []

    return allTaskLists
  } catch (error) {
    console.error("Error fetching task lists:", error)
    return []
  }
}
