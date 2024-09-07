import { redirect } from "next/navigation"
import { authProvider } from "../services/auth"
import { graphConfig } from "../serverConfig"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GraphProfile {
  displayName: string
  jobTitle: string
  mail: string
  userPrincipalName: string
}

async function getUserInfo() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return null
  }

  const token = await instance.acquireTokenSilent({
    account,
    scopes: ["User.Read"]
  })

  if (!token) {
    return null
  }

  const response = await fetch(`${graphConfig.meEndpoint}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`
    }
  })

  return (await response.json()) as GraphProfile
}

export default async function GraphRequestPage() {
  const profile = await getUserInfo()

  if (!profile) {
    return redirect("/")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Graph Request Result</h1>
      <Card>
        <CardHeader>
          <CardTitle>{profile.displayName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Job Title: {profile.jobTitle}</p>
          <p>Email: {profile.mail}</p>
          <p>User Principal Name: {profile.userPrincipalName}</p>
        </CardContent>
      </Card>
    </div>
  )
}
