import { auth, EnrichedSession } from "@/auth"

export default async function ProtectedComponent() {
  const session = (await auth()) as EnrichedSession | null

  if (session) {
    const googleToken = session.providers?.google?.accessToken
    const azureToken = session.providers?.["azure-ad"]?.accessToken

    // Use these tokens to make API calls
    // ...

    return (
      <>
        <div style={{ width: "100%", whiteSpace: "pre-wrap" }}>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      </>
    )
  }

  return <div>Please sign in</div>
}
