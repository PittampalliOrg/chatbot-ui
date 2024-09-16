// app/components/SideNavigation.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavigationItem } from "../models/NavigationItem"
import {
  Tab,
  TabList,
  makeStyles,
  mergeClasses,
  tokens
} from "@fluentui/react-components"

export interface ISideNavigationProps {
  items: any[]
}

const useStyles = makeStyles({
  tab: {
    paddingTop: "12px",
    paddingBottom: "12px"
  },
  activeTab: {
    backgroundColor: tokens.colorSubtleBackgroundHover
  }
})

const isUserSignedIn = true

export function SideNavigation({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname()

  return (
    <nav>
      <ul>
        {items.map(
          item =>
            (!item.requiresLogin || isUserSignedIn) && (
              <li key={item.key}>
                <Link href={item.url}>
                  <div className={pathname === item.url ? "active" : ""}>
                    {item.icon}
                    {item.name}
                  </div>
                </Link>
              </li>
            )
        )}
      </ul>
    </nav>
  )
}
