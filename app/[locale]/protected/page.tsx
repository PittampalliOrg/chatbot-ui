import { login } from "../protected/actions/auth"

export default function LoginButton() {
  return (
    <form action={login}>
      <button color="primary" type="submit">
        Login
      </button>
    </form>
  )
}
