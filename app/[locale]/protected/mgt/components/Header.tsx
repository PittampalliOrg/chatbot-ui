"use client"

import * as React from "react"
import { Login, SearchBox } from "@microsoft/mgt-react"
import { PACKAGE_VERSION } from "@microsoft/mgt-element"
import { InfoButton } from "@fluentui/react-components/unstable"
import { SimpleLogin } from "./SimpleLogin"
import { useIsSignedIn } from "../hooks/useIsSignedIn"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ThemeSwitcher } from "./ThemeSwitcher"
import { useAppContext } from "../AppContext"
import {
  Label,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens
} from "@fluentui/react-components"
import { GridDotsRegular } from "@fluentui/react-icons"

const useStyles = makeStyles({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "48px",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding("0", "20px"),
    ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1)
  },
  waffle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "220px"
  },
  waffleLogo: {
    ...shorthands.padding("4px"),
    ...shorthands.margin("0", "4px", "0", "0")
  },
  wafffleIcon: {
    fontSize: "20px",
    color: tokens.colorNeutralForeground1
  },
  waffleTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    fontWeight: tokens.fontWeightSemibold
  },
  infoIcon: {
    ...shorthands.margin("0", "0", "0", "4px")
  },
  search: {
    flexGrow: 1,
    ...shorthands.padding("0", "20px")
  },
  searchBox: {
    width: "100%",
    maxWidth: "600px"
  },
  login: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  root: {
    ...shorthands.margin("0", "10px")
  },
  signedOut: {
    width: "80px"
  },
  signedIn: {
    width: "240px"
  }
})

const HeaderComponent: React.FunctionComponent = () => {
  const styles = useStyles()
  const isSignedIn = useIsSignedIn()
  const appContext = useAppContext()
  const setAppContext = appContext.setState
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const onSearchTermChanged = (e: CustomEvent) => {
    if (
      !(e.detail === "" && appContext.state.searchTerm === "*") &&
      e.detail !== appContext.state.searchTerm
    ) {
      appContext.setState({
        ...appContext.state,
        searchTerm: e.detail === "" ? "*" : e.detail
      })

      if (e.detail === "") {
        router.push("/protected/mgt/Search")
      } else {
        router.push(`/protected/mgt/Search?q=${encodeURIComponent(e.detail)}`)
      }
    }
  }

  React.useEffect(() => {
    if (pathname === "/protected/mgt/Search") {
      const searchTerm = searchParams.get("q") || ""
      setAppContext(previous => {
        return { ...previous, searchTerm: searchTerm === "" ? "*" : searchTerm }
      })
    }
  }, [pathname, searchParams, setAppContext])

  return (
    <div className={styles.header}>
      <div className={styles.waffle}>
        <div className={styles.waffleLogo}>
          <a
            href={"https://www.office.com/apps?auth=2"}
            target="_blank"
            rel="noreferrer"
          >
            <GridDotsRegular className={styles.wafffleIcon} />
          </a>
        </div>

        <div className={styles.waffleTitle}>
          <Label className={styles.name}>
            {process.env.NEXT_PUBLIC_SITE_NAME}{" "}
          </Label>
          <InfoButton
            className={styles.infoIcon}
            size="medium"
            info={
              <pre>
                {JSON.stringify({
                  searchTerm: appContext.state.searchTerm,
                  sidebar: appContext.state.sidebar
                })}
              </pre>
            }
          />
        </div>
      </div>
      <div className={styles.search}>
        <SearchBox
          className={styles.searchBox}
          searchTermChanged={onSearchTermChanged}
          searchTerm={
            appContext.state.searchTerm !== "*"
              ? appContext.state.searchTerm
              : ""
          }
        ></SearchBox>
      </div>

      <div className={styles.login}>
        <ThemeSwitcher />
        <div
          className={mergeClasses(
            !isSignedIn ? styles.signedOut : styles.signedIn,
            styles.root
          )}
        >
          <Login>
            <SimpleLogin template="signed-in-button-content" />
          </Login>
        </div>
      </div>
    </div>
  )
}

export const Header = React.memo(HeaderComponent)
