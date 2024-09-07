import { acquireCalendarTokenInteractive } from "../actions/auth"
import { Button } from "@/components/ui/button"

export default function ConsentButton() {
  return (
    <form action={acquireCalendarTokenInteractive}>
      <Button className="w-full" type="submit">
        Consent calendar permissions
      </Button>
    </form>
  )
}
