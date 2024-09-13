import { getPosts } from './actions'; // Adjust this import path as needed
import { Post } from '@/kiota/models/index'; // Adjust this import path as needed

export default async function Home() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    posts = await getPosts();
    console.log(posts);
  } catch (err) {
    error = 'Failed to fetch posts';
    console.error(error, err);
  }

  return (
    <div>
      <h1>Posts</h1>
      {error ? (
        <div>Error: {error}</div>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}