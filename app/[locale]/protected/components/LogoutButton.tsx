import { logout } from "../actions/auth"

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button color="primary" type="submit">
        Logout
      </button>
    </form>
  )
}
