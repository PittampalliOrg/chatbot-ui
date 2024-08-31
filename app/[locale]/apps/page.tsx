import { useState } from "react"
import { signIn } from "next-auth/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Sign } from "crypto"
import { SignIn } from "./auth-components"

export default function Component() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Installed Apps</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div>
                <CardTitle>Azure</CardTitle>
                <CardDescription>
                  Microsoft services integration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              <SignIn provider="azure" />
            </p>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div>
                <CardTitle>Google</CardTitle>
                <CardDescription>Google services integration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              <SignIn provider="google" />
            </p>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  )
}
