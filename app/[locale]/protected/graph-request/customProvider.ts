import { Providers } from "@microsoft/mgt-element"
import { ProxyProvider } from "@microsoft/mgt-proxy-provider"

// Set up the ProxyProvider to point to the custom GraphProxy API
export const setupProxyProvider = () => {
  Providers.globalProvider = new ProxyProvider(
    "http://localhost:3000/api/protected/proxy" // Replace with your actual domain
  )
}
