import { authProvider } from "../services/auth"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default async function WelcomeName() {
  try {
    const account = await authProvider.getAccount()

    if (account?.name) {
      return (
        <p className="text-lg font-semibold">
          Welcome, {account.name.split(" ")[0]}
        </p>
      )
    } else {
      return null
    }
  } catch (error) {
    return (
      <div className="flex items-center text-yellow-500">
        <ExclamationTriangleIcon className="mr-2 size-4" />
        <span>Error loading user data</span>
      </div>
    )
  }
}
