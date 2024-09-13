import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import { createApiClient } from '@/kiota/apiClient';
import { Post } from '@/kiota/models/index';
import { JsonParseNodeFactory, JsonSerializationWriterFactory } from '@microsoft/kiota-serialization-json';
import {
  ParseNodeFactoryRegistry,
  SerializationWriterFactoryRegistry,
} from '@microsoft/kiota-abstractions';

// Create and register the JSON factories
const parseNodeFactoryRegistry = new ParseNodeFactoryRegistry();
parseNodeFactoryRegistry.contentTypeAssociatedFactories.set(
  'application/json',
  new JsonParseNodeFactory()
);

const serializationWriterFactoryRegistry = new SerializationWriterFactoryRegistry();
serializationWriterFactoryRegistry.contentTypeAssociatedFactories.set(
  'application/json',
  new JsonSerializationWriterFactory()
);

// API requires no authentication, so use the anonymous authentication provider
const authProvider = new AnonymousAuthenticationProvider();

// Create request adapter using the fetch-based implementation
const adapter = new FetchRequestAdapter(
  authProvider,
  parseNodeFactoryRegistry,
  serializationWriterFactoryRegistry
);

// Create the API client
const client = createApiClient(adapter);

export async function getPosts(): Promise<Post[]> {
  try {
    // GET /posts
    const allPosts = await client.posts.get();
    console.log(`Retrieved ${allPosts?.length} posts.`);
    return allPosts ?? [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}
