"use client"

import { signIn } from "@/auth"
import { Provider } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import toast from "react-hot-toast"

function LoginButton() {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const handleClickLoginButton = (provider: Provider) => {
    startTransition(async () => {
      const { errorMessage, url } = await signIn(provider)
      if (!errorMessage && url) {
        router.push(url)
      } else {
        toast.error(errorMessage)
      }
    })
  }

  return (
    <>
      <button
        className="flex w-48 items-center justify-center gap-2 rounded-md border border-white bg-black py-2 hover:bg-emerald-950"
        onClick={() => handleClickLoginButton("azure")}
        disabled={isPending}
      >
        {isPending ? "Logging in..." : "Login with Azure"}
      </button>
      <button
        className="flex w-48 items-center justify-center gap-2 rounded-md border border-white bg-black py-2 hover:bg-emerald-950"
        onClick={() => handleClickLoginButton("google")}
        disabled={isPending}
      >
        {isPending ? "Logging in..." : "Login with Google"}
      </button>
    </>
  )
}

export default LoginButton
