// integrations-content.tsx
import { FC } from "react"
import { Button } from "../../../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../ui/card"

interface Integration {
  id: string
  name: string
  description: string
  isInstalled: boolean
}

interface IntegrationsContentProps {
  integrations: Integration[]
}

export const IntegrationsContent: FC<IntegrationsContentProps> = ({
  integrations
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Integrations</h2>
      {integrations.map(integration => (
        <Card key={integration.id}>
          <CardHeader>
            <CardTitle>{integration.name}</CardTitle>
            <CardDescription>{integration.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>{integration.isInstalled ? "Uninstall" : "Install"}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
