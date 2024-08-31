// apps/page.tsx
import { OAuthProviderCard } from "./oauth-provider-card"

const providers = [
  {
    id: "azure-ad",
    name: "Microsoft Azure",
    description:
      "Microsoft Azure Active Directory OAuth provider for enterprise applications.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 23 23"
        fill="currentColor"
        className="size-6 text-blue-500"
      >
        <path d="M0 0h23v23H0z" fill="#F25022" />
        <path d="M0 0h11v11H0z" fill="#00A4EF" />
        <path d="M12 0h11v11H12z" fill="#7FBA00" />
        <path d="M12 12h11v11H12z" fill="#FFB900" />
      </svg>
    )
  },
  {
    id: "google",
    name: "Google",
    description:
      "Google OAuth provider for accessing Google services and user data.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    )
  }
]

export default function OAuthProvidersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">OAuth Providers</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers.map(provider => (
          <OAuthProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  )
}
