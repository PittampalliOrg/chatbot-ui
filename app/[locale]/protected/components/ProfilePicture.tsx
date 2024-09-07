import { authProvider } from "../services/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export default async function ProfilePicture() {
  const account = await authProvider.getAccount()

  if (!account) {
    return null
  }

  return (
    <Avatar>
      <AvatarImage src="profile/picture" alt="Profile Picture" />
      <AvatarFallback>
        <User className="size-4" />
      </AvatarFallback>
    </Avatar>
  )
}
