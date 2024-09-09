import { headers } from "next/headers"

// https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664

export function getCurrentUrl() {
  const headersList = headers()

  // read the custom x-url header
  const url = headersList.get("x-url")

  // If x-url is not set, fall back to a default URL
  return (
    url ||
    `${headersList.get("x-forwarded-proto") || "http"}://${headersList.get("host")}`
  )
}
