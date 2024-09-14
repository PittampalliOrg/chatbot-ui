import {
  AuthenticationProvider,
  RequestInformation
} from "@microsoft/kiota-abstractions"
import { AuthProvider as MyAuthProvider } from "../utils/AuthProvider"
import { ConfidentialClientApplication } from "@azure/msal-node"

export class CustomKiotaAuthenticationProvider
  implements AuthenticationProvider
{
  private authProvider: MyAuthProvider
  private scopes: string[]

  constructor(authProvider: MyAuthProvider, scopes: string[]) {
    this.authProvider = authProvider
    this.scopes = scopes
  }

  public async authenticateRequest(request: RequestInformation): Promise<void> {
    // Use your AuthProvider to get the authenticated instance and account
    const { account, instance } = await this.authProvider.authenticate()

    if (!account) {
      throw new Error("No account is currently authenticated.")
    }

    // Prepare the token request
    const tokenRequest = {
      scopes: this.scopes,
      account: account
    }

    // Acquire token silently
    const authResult = await instance.acquireTokenSilent(tokenRequest)

    if (!authResult || !authResult.accessToken) {
      throw new Error("Failed to acquire access token silently.")
    }

    // Add the Authorization header to the request using addRequestHeaders
    request.addRequestHeaders({
      Authorization: `Bearer ${authResult.accessToken}`
    })
  }
}
