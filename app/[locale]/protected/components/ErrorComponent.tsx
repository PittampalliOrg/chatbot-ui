import { AuthError } from "@azure/msal-node"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function ErrorComponent({ error }: { error: AuthError }) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>An error occurred: {error.errorCode}</AlertDescription>
    </Alert>
  )
}
