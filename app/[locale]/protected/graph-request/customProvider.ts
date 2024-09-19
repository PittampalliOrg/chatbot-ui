import { Providers } from "@microsoft/mgt-element"
import { ProxyProvider } from "@microsoft/mgt-proxy-provider"

// Define the API URL based on the environment (production or local)
const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://chatbot-ui-livid-mu.vercel.app"
    : "http://localhost:3000"

// Set up the ProxyProvider to point to the custom GraphProxy API
export const setupProxyProvider = () => {
  Providers.globalProvider = new ProxyProvider(
    `${apiUrl}/api/protected/proxy` // Replace with your actual domain
  )
}
