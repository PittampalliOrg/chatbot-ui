import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"
import { loginRequest } from "../../serverConfig"
import { authProvider } from "../../services/auth"
import { getCurrentUrl } from "../../utils/url"

export default async function ForcedLayout({ children }: PropsWithChildren) {
  const { account } = await authProvider.authenticate()

  if (!account) {
    redirect(await authProvider.getAuthCodeUrl(loginRequest, getCurrentUrl()))
  }

  return <>{children}</>
}
