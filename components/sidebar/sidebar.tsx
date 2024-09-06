import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { SIDEBAR_WIDTH } from "../ui/dashboard"
import { TabsContent } from "../ui/tabs"
import { WorkspaceSwitcher } from "../utility/workspace-switcher"
import { WorkspaceSettings } from "../workspace/workspace-settings"
import { SidebarContent } from "./sidebar-content"
import AuthComponent from "@/app/api/protected/AuthComponent"
import RestAPIComponent from "@/app/api/protected/RestApiComponent"
import { Login } from "@microsoft/mgt-react"
import { Providers } from "@microsoft/mgt-element"

import { Providers as MGT } from "@microsoft/mgt-element"
import { Msal2Provider } from "@microsoft/mgt-msal2-provider"
import { prepScopes } from "@microsoft/mgt-element"
import { sendMailAction } from "@/app/api/protected/actions"

MGT.globalProvider = new Msal2Provider({
  clientId: "7e15b39d-44e0-4397-877e-4c88fe0f9ab1",
  authority:
    "https://login.microsoftonline.com/0c4da9c5-40ea-4e7d-9c7a-e7308d4f8e38",
  redirectUri: "http://localhost:3000",
  scopes: ["Mail.Send"]
})

interface SidebarProps {
  contentType: ContentType
  showSidebar: boolean
}

export const Sidebar: FC<SidebarProps> = ({ contentType, showSidebar }) => {
  const {
    folders,
    chats,
    presets,
    prompts,
    files,
    collections,
    assistants,
    tools,
    models,
    integrations
  } = useContext(ChatbotUIContext)

  const chatFolders = folders.filter(folder => folder.type === "chats")
  const presetFolders = folders.filter(folder => folder.type === "presets")
  const promptFolders = folders.filter(folder => folder.type === "prompts")
  const filesFolders = folders.filter(folder => folder.type === "files")
  const collectionFolders = folders.filter(
    folder => folder.type === "collections"
  )
  const assistantFolders = folders.filter(
    folder => folder.type === "assistants"
  )
  const toolFolders = folders.filter(folder => folder.type === "tools")
  const modelFolders = folders.filter(folder => folder.type === "models")
  const integrationFolders = folders.filter(
    folder => folder.type === "integrations"
  )

  const renderSidebarContent = (
    contentType: ContentType,
    data: any[],
    folders: Tables<"folders">[]
  ) => {
    return (
      <SidebarContent contentType={contentType} data={data} folders={folders} />
    )
  }

  return (
    <TabsContent
      className="m-0 w-full space-y-2"
      style={{
        minWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px",
        maxWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px",
        width: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px"
      }}
      value={contentType}
    >
      <div className="flex h-full flex-col p-3">
        <div className="flex items-center border-b-2 pb-2">
          <WorkspaceSwitcher />
          <WorkspaceSettings />
        </div>

        {(() => {
          switch (contentType) {
            case "chats":
              return renderSidebarContent("chats", chats, chatFolders)
            case "presets":
              return renderSidebarContent("presets", presets, presetFolders)
            case "prompts":
              return renderSidebarContent("prompts", prompts, promptFolders)
            case "files":
              return renderSidebarContent("files", files, filesFolders)
            case "collections":
              return renderSidebarContent(
                "collections",
                collections,
                collectionFolders
              )
            case "assistants":
              return renderSidebarContent(
                "assistants",
                assistants,
                assistantFolders
              )
            case "tools":
              return renderSidebarContent("tools", tools, toolFolders)
            case "models":
              return renderSidebarContent("models", models, modelFolders)
            case "integrations":
              return (
                <>
                  <Login />
                  <AuthComponent />
                  <form
                    action={async () => {
                      const token =
                        await Providers.globalProvider.getAccessToken({
                          scopes: [
                            "api://68865588-d66d-4db6-8680-0ad4369fdf5b/access_as_user"
                          ]
                        })
                      const headers = new Headers()
                      headers.append("Authorization", `Bearer ${token}`)

                      const options = {
                        method: "GET",
                        headers: headers
                      }

                      try {
                        const response = await fetch(
                          "http://localhost:3000/api/protected",
                          options
                        )
                        return await response.json()
                      } catch (error) {
                        console.error("API call failed: ", error)
                        throw error
                      }
                    }}
                  >
                    <button type="submit">Send Mail</button>
                  </form>
                </>
              )

            default:
              return null
          }
        })()}
      </div>
    </TabsContent>
  )
}
