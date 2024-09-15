"use client"

import React from "react"
import {
  FluentProvider,
  makeStyles,
  mergeClasses,
  shorthands
} from "@fluentui/react-components"
import { tokens } from "@fluentui/react-theme"
import { applyTheme } from "@microsoft/mgt-react"
import { useAppContext } from "../AppContext"
import { Header } from "../components/Header"
import { SideNavigation } from "../components/SideNavigation"

const useStyles = makeStyles({
  sidebar: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    height: "100%",
    minWidth: "295px",
    boxSizing: "border-box",
    backgroundColor: tokens.colorNeutralBackground6
  },
  main: {
    backgroundColor: tokens.colorNeutralBackground1,
    display: "flex",
    flexDirection: "row",
    width: "auto",
    height: "calc(100vh - 50px)",
    boxSizing: "border-box"
  },
  minimized: {
    minWidth: "auto"
  },
  page: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    width: "100%",
    height: "auto",
    boxSizing: "border-box",
    ...shorthands.margin("10px"),
    ...shorthands.overflow("auto")
  }
})

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const styles = useStyles()
  const appContext = useAppContext()

  React.useEffect(() => {
    // Applies the theme to the MGT components
    applyTheme(appContext.state.theme.key as any)
  }, [appContext])

  return (
    <FluentProvider theme={appContext.state.theme.fluentTheme}>
      <div className={styles.page}>
        <Header />
        <div className={styles.main}>
          <div
            className={mergeClasses(
              styles.sidebar,
              `${appContext.state.sidebar.isMinimized ? styles.minimized : ""}`
            )}
          >
            <SideNavigation items={[]} />
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </FluentProvider>
  )
}
