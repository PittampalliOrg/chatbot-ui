import { logout } from "../actions/auth"

export default function LogoutButton() {
  const handleLogout = (formData: FormData) => {
    // handle logout logic here
  }

  return (
    //    <form action={() => handleLogout}>
    <button color="primary" type="submit">
      Logout
    </button>
    //    </form>
  )
}
