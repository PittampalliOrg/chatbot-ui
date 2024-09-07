import { authProvider } from "../services/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "../components/CopyButton"

interface TokenClaim {
  claim: string
  value: string
  description: string
}

function createClaimsTable(claims: Record<string, any>): TokenClaim[] {
  const claimsArray: TokenClaim[] = []

  const populateClaim = (claim: string, value: string, description: string) => {
    claimsArray.push({ claim, value, description })
  }

  const changeDateFormat = (date: number): string => {
    const dateObj = new Date(date * 1000)
    return `${date} - [${dateObj.toString()}]`
  }

  Object.entries(claims).forEach(([key, value]) => {
    if (typeof value !== "string" && typeof value !== "number") return

    switch (key) {
      case "aud":
        populateClaim(
          key,
          String(value),
          "Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Azure portal."
        )
        break
      case "iss":
        populateClaim(
          key,
          String(value),
          "Identifies the issuer, or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated."
        )
        break
      case "iat":
        populateClaim(
          key,
          changeDateFormat(Number(value)),
          '"Issued At" indicates the timestamp when the authentication for this user occurred.'
        )
        break
      case "nbf":
        populateClaim(
          key,
          changeDateFormat(Number(value)),
          'The "not before" claim dictates the time before which the JWT must not be accepted for processing.'
        )
        break
      case "exp":
        populateClaim(
          key,
          changeDateFormat(Number(value)),
          "The expiration time claim dictates the expiration time on or after which the JWT must not be accepted for processing."
        )
        break
      case "name":
        populateClaim(
          key,
          String(value),
          "The name claim provides a human-readable value that identifies the subject of the token."
        )
        break
      case "preferred_username":
        populateClaim(
          key,
          String(value),
          "The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format."
        )
        break
      case "oid":
        populateClaim(
          key,
          String(value),
          "The user's object id is the only claim that should be used to uniquely identify a user in an Azure AD tenant."
        )
        break
      case "tid":
        populateClaim(
          key,
          String(value),
          "The id of the tenant where this app resides."
        )
        break
      case "sub":
        populateClaim(
          key,
          String(value),
          "The subject claim is a pairwise identifier - it is unique to a particular application ID."
        )
        break
      default:
        populateClaim(key, String(value), "")
    }
  })

  return claimsArray
}

async function getTokenInfo() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return null
  }

  const tokenClaims = createClaimsTable(account.idTokenClaims || {})

  const graphToken = await instance.acquireTokenSilent({
    account,
    scopes: ["User.Read"]
  })

  return {
    tokenClaims,
    graphToken
  }
}

export default async function TokenInfoPage() {
  const tokenInfo = await getTokenInfo()

  if (!tokenInfo) {
    return <div>No account information available.</div>
  }

  const expiresOn = tokenInfo.graphToken.expiresOn
    ? new Date(tokenInfo.graphToken.expiresOn).toLocaleString()
    : "Not available"

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold">Token Information</h1>

      <Card>
        <CardHeader>
          <CardTitle>ID Token Claims</CardTitle>
          <CardDescription>
            Claims in your ID token. For more information, visit:{" "}
            <a
              href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token"
              className="text-blue-500 hover:underline"
            >
              docs.microsoft.com
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Claim</TableHead>
                  <TableHead className="w-[200px]">Value</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenInfo.tokenClaims.map((claim, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{claim.claim}</TableCell>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="truncate">{claim.value}</span>
                        <CopyButton value={claim.value} />
                      </div>
                    </TableCell>
                    <TableCell>{claim.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Microsoft Graph API Token</CardTitle>
          <CardDescription>
            Information about the acquired access token for Microsoft Graph API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Scopes:</strong>{" "}
              {tokenInfo.graphToken.scopes.map(scope => (
                <Badge key={scope} variant="secondary" className="mr-1">
                  {scope}
                </Badge>
              ))}
            </p>
            <p>
              <strong>Expires:</strong> {expiresOn}
            </p>
            <p>
              <strong>Token Type:</strong> {tokenInfo.graphToken.tokenType}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
