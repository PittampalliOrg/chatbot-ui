import { Brand } from "@/components/ui/brand"
import { SubmitButton } from "@/components/ui/submit-button"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login"
}

export default async function Login({
  searchParams
}: {
  searchParams: { message: string; error: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const session = (await supabase.auth.getSession()).data.session

  if (session) {
    const { data: homeWorkspace, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      throw new Error(error.message)
    }

    return redirect(`/${homeWorkspace.id}/chat`)
  }

  const signInWithAzure = async () => {
    "use server"

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "email offline_access",
        redirectTo: `${headers().get("origin")}/auth/callback`
      }
    })

    if (error) {
      return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    return redirect(data.url)
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2">
        <Brand />

        <SubmitButton
          formAction={signInWithAzure}
          className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white"
        >
          Sign in with Azure
        </SubmitButton>

        {(searchParams?.message || searchParams?.error) && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message || searchParams.error}
          </p>
        )}
      </form>
    </div>
  )
}
