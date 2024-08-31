import { FC, useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

const OAuthIntegrations: FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const handleOAuthLogin = (service: string) => {
    setSelectedService(service)
    // Implement the OAuth2 authentication logic here
    // For example, redirect to the OAuth2 authorization URL
    if (service === "azure") {
      window.location.href =
        "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&response_mode=query&scope=openid%20profile&state=12345"
    } else if (service === "google") {
      window.location.href =
        "https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=openid%20profile&state=12345"
    }
  }

  return (
    <div className="space-y-4">
      <Label>Select a service to integrate:</Label>
      <Button onClick={() => handleOAuthLogin("azure")}>Azure</Button>
      <Button onClick={() => handleOAuthLogin("google")}>Google</Button>
      {selectedService && <div>Authenticating with {selectedService}...</div>}
    </div>
  )
}

export default OAuthIntegrations
