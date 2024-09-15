// app/services/Navigation.tsx
import {
  HomeRegular,
  SearchRegular,
  TextBulletListSquareRegular,
  CalendarMailRegular,
  DocumentRegular,
  TagMultipleRegular
} from "@fluentui/react-icons"
import { HomePage } from "../pages/HomePage"
import DashboardPage from "../Dashboard/page"
import OutlookPage from "../Outlook/page"
import FilesPage from "../Files/page"
import TaxonomyPage from "../Taxonomy/page"
import SearchPage from "../Search/page"
import { NavigationItem } from "../models/NavigationItem"

export const getNavigation = (isSignedIn: boolean): NavigationItem[] => {
  const navItems: NavigationItem[] = []

  navItems.push({
    name: "Home",
    url: "/protected/mgt/",
    icon: <HomeRegular />,
    key: "home",
    requiresLogin: false,
    component: <HomePage />,
    exact: true
  })

  if (isSignedIn) {
    navItems.push({
      name: "Dashboard",
      url: "/protected/mgt/Dashboard",
      icon: <TextBulletListSquareRegular />,
      key: "dashboard",
      requiresLogin: true,
      component: <DashboardPage />,
      exact: true
    })

    navItems.push({
      name: "Mail and Calendar",
      url: "/protected/mgt/Outlook",
      icon: <CalendarMailRegular />,
      key: "outlook",
      requiresLogin: true,
      component: <OutlookPage />,
      exact: true
    })

    navItems.push({
      name: "Files",
      url: "/protected/mgt/Files",
      icon: <DocumentRegular />,
      key: "files",
      requiresLogin: true,
      component: <FilesPage />,
      exact: true
    })

    navItems.push({
      name: "Taxonomy",
      url: "/protected/mgt/Taxonomy",
      icon: <TagMultipleRegular />,
      key: "files",
      requiresLogin: true,
      component: <TaxonomyPage />,
      exact: true
    })

    navItems.push({
      name: "Search",
      url: "/protected/mgt/Search",
      pattern: "/search/:query",
      icon: <SearchRegular />,
      key: "search",
      requiresLogin: true,
      component: <SearchPage />,
      exact: false
    })
  }
  return navItems
}
