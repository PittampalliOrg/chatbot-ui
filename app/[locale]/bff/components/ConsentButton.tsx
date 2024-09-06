import { acquireCalendarTokenInteractive } from "../../../../app/[locale]/bff/actions/auth"
import Button from "@mui/material/Button"

export default function ConsentButton() {
  return (
    <form action={acquireCalendarTokenInteractive}>
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Consent calendar permissions
      </Button>
    </form>
  )
}
