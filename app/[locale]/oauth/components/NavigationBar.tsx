// app/[locale]/oauth/components/NavigationBar.tsx

import React from "react"
import { Nav, Navbar, Button } from "react-bootstrap"

interface NavigationBarProps {
  account: any
  login: () => void
  logout: () => void
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  account,
  login,
  logout
}) => {
  return (
    <>
      <Navbar bg="primary" variant="dark" className="navbarStyle">
        <a className="navbar-brand" href="/">
          Microsoft identity platform
        </a>
        {account ? (
          <>
            <Nav.Link className="navbarButton" href="/profile">
              Profile
            </Nav.Link>
            <div className="navbar-collapse justify-content-end collapse">
              <Button
                variant="warning"
                className="ml-auto"
                drop="start"
                as="button"
                onClick={() => {
                  logout()
                }}
              >
                Sign out
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-collapse justify-content-end collapse">
              <Button
                variant="secondary"
                className="ml-auto"
                drop="start"
                as="button"
                onClick={() => {
                  login()
                }}
              >
                Sign in
              </Button>
            </div>
          </>
        )}
      </Navbar>
    </>
  )
}
