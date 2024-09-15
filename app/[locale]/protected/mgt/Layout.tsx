// app/components/Layout.tsx
"use client"

import React from "react"
import { Header } from "./components/Header"
import { SideNavigation } from "./components/SideNavigation"
import { useAppContext } from "./AppContext"
import { useIsSignedIn } from "./hooks/useIsSignedIn"
import { getNavigation } from "./services/Navigation"
import {
  makeStyles,
  mergeClasses,
  shorthands
} from "@fluentui/react-components" // Remove FluentProvider import
import { tokens } from "@fluentui/react-theme"

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const styles = useStyles()
  const navigationItems = getNavigation(useIsSignedIn())
  const appContext = useAppContext()

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div
          className={mergeClasses(
            styles.sidebar,
            appContext.state.sidebar.isMinimized ? styles.minimized : ""
          )}
        >
          <SideNavigation items={navigationItems} />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
