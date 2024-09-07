"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { acquireTasksTokenInteractive } from "../actions/auth"

export default function Error({
  error
}: {
  error: Error & { digest?: string }
}) {
  if (error.message === "InteractionRequiredAuthError") {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Please consent to see your task events.
          </h2>
          <form action={acquireTasksTokenInteractive}>
            <Button type="submit" className="w-full">
              Consent task permissions
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-semibold">
          An error occurred while getting tasks.
        </h2>
        <p>{error.message}</p>
      </CardContent>
    </Card>
  )
}
