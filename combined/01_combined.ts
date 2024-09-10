// File: __tests__/lib/openapi-conversion.test.ts
import{openapiToFunctions}from "@/lib/openapi-conversion"
constvalidSchemaURL = JSON.stringify({
openapi:"3.1.0",
info:{
title:"Get weather data",
description:"Retrieves current weather data for a location.",
version:"v1.0.0"
},
servers:[
{
url:"https:
}
],
paths:{
"/location":{
get:{
description:"Get temperature for a specific location",
operationId:"GetCurrentWeather",
parameters:[
{
name:"location",
in:"query",
description:"The city and state to retrieve the weather for",
required:true,
schema:{
type:"string"
}
}
]
}
},
"/summary":{
get:{
description:"Get description of weather for a specific location",
operationId:"GetWeatherSummary",
parameters:[
{
name:"location",
in:"query",
description:"The city and state to retrieve the summary for",
required:true,
schema:{
type:"string"
}
}
]
}
}
}
})
describe("extractOpenapiData for url",() => {
it("should parse a valid OpenAPI url schema",async () => {
const{info,routes,functions} = await openapiToFunctions(
JSON.parse(validSchemaURL)
)
expect(info.title).toBe("Get weather data")
expect(info.description).toBe(
"Retrieves current weather data for a location."
)
expect(info.server).toBe("https:
expect(routes).toHaveLength(2)
expect(functions).toHaveLength(2)
expect(functions[0].function.name).toBe("GetCurrentWeather")
expect(functions[1].function.name).toBe("GetWeatherSummary")
})
})
constvalidSchemaBody = JSON.stringify({
openapi:"3.1.0",
info:{
title:"Get weather data",
description:"Retrieves current weather data for a location.",
version:"v1.0.0"
},
servers:[
{
url:"https:
}
],
paths:{
"/location":{
post:{
description:"Get temperature for a specific location",
operationId:"GetCurrentWeather",
requestBody:{
required:true,
content:{
"application/json":{
schema:{
type:"object",
properties:{
location:{
type:"string",
description:
"The city and state to retrieve the weather for",
example:"New York,NY"
}
}
}
}
}
}
}
}
}
})
describe("extractOpenapiData for body",() => {
it("should parse a valid OpenAPI body schema",async () => {
const{info,routes,functions} = await openapiToFunctions(
JSON.parse(validSchemaBody)
)
expect(info.title).toBe("Get weather data")
expect(info.description).toBe(
"Retrieves current weather data for a location."
)
expect(info.server).toBe("https:
expect(routes).toHaveLength(1)
expect(routes[0].path).toBe("/location")
expect(routes[0].method).toBe("post")
expect(routes[0].operationId).toBe("GetCurrentWeather")
expect(functions).toHaveLength(1)
expect(
functions[0].function.parameters.properties.requestBody.properties
.location.type
).toBe("string")
expect(
functions[0].function.parameters.properties.requestBody.properties
.location.description
).toBe("The city and state to retrieve the weather for")
})
})
constvalidSchemaBody2 = JSON.stringify({
openapi:"3.1.0",
info:{
title:"Polygon.io Stock and Crypto Data API",
description:
"API schema for accessing stock and crypto data from Polygon.io.",
version:"1.0.0"
},
servers:[
{
url:"https:
}
],
paths:{
"/v1/open-close/{stocksTicker}/{date}":{
get:{
summary:"Get Stock Daily Open and Close",
description:"Get the daily open and close for a specific stock.",
operationId:"getStockDailyOpenClose",
parameters:[
{
name:"stocksTicker",
in:"path",
required:true,
schema:{
type:"string"
}
},
{
name:"date",
in:"path",
required:true,
schema:{
type:"string",
format:"date"
}
}
]
}
},
"/v2/aggs/ticker/{stocksTicker}/prev":{
get:{
summary:"Get Stock Previous Close",
description:"Get the previous closing data for a specific stock.",
operationId:"getStockPreviousClose",
parameters:[
{
name:"stocksTicker",
in:"path",
required:true,
schema:{
type:"string"
}
}
]
}
},
"/v3/trades/{stockTicker}":{
get:{
summary:"Get Stock Trades",
description:"Retrieve trades for a specific stock.",
operationId:"getStockTrades",
parameters:[
{
name:"stockTicker",
in:"path",
required:true,
schema:{
type:"string"
}
}
]
}
},
"/v3/trades/{optionsTicker}":{
get:{
summary:"Get Options Trades",
description:"Retrieve trades for a specific options ticker.",
operationId:"getOptionsTrades",
parameters:[
{
name:"optionsTicker",
in:"path",
required:true,
schema:{
type:"string"
}
}
]
}
},
"/v2/last/trade/{optionsTicker}":{
get:{
summary:"Get Last Options Trade",
description:"Get the last trade for a specific options ticker.",
operationId:"getLastOptionsTrade",
parameters:[
{
name:"optionsTicker",
in:"path",
required:true,
schema:{
type:"string"
}
}
]
}
},
"/v1/open-close/crypto/{from}/{to}/{date}":{
get:{
summary:"Get Crypto Daily Open and Close",
description:
"Get daily open and close data for a specific cryptocurrency.",
operationId:"getCryptoDailyOpenClose",
parameters:[
{
name:"from",
in:"path",
required:true,
schema:{
type:"string"
}
},
{
name:"to",
in:"path",
required:true,
schema:{
type:"string"
}
},
{
name:"date",
in:"path",
required:true,
schema:{
type:"string",
format:"date"
}
}
]
}
},
"/v2/aggs/ticker/{cryptoTicker}/prev":{
get:{
summary:"Get Crypto Previous Close",
description:
"Get the previous closing data for a specific cryptocurrency.",
operationId:"getCryptoPreviousClose",
parameters:[
{
name:"cryptoTicker",
in:"path",
required:true,
schema:{
type:"string"
}
}
]
}
}
},
components:{
securitySchemes:{
BearerAuth:{
type:"http",
scheme:"bearer",
bearerFormat:"API Key"
}
}
},
security:[
{
BearerAuth:[]
}
]
})
describe("extractOpenapiData for body 2",() => {
it("should parse a valid OpenAPI body schema for body 2",async () => {
const{info,routes,functions} = await openapiToFunctions(
JSON.parse(validSchemaBody2)
)
expect(info.title).toBe("Polygon.io Stock and Crypto Data API")
expect(info.description).toBe(
"API schema for accessing stock and crypto data from Polygon.io."
)
expect(info.server).toBe("https:
expect(routes).toHaveLength(7)
expect(routes[0].path).toBe("/v1/open-close/{stocksTicker}/{date}")
expect(routes[0].method).toBe("get")
expect(routes[0].operationId).toBe("getStockDailyOpenClose")
expect(functions[0].function.parameters.properties).toHaveProperty(
"stocksTicker"
)
expect(functions[0].function.parameters.properties.stocksTicker.type).toBe(
"string"
)
expect(
functions[0].function.parameters.properties.stocksTicker
).toHaveProperty("required",true)
expect(functions[0].function.parameters.properties).toHaveProperty("date")
expect(functions[0].function.parameters.properties.date.type).toBe("string")
expect(functions[0].function.parameters.properties.date).toHaveProperty(
"format",
"date"
)
expect(functions[0].function.parameters.properties.date).toHaveProperty(
"required",
true
)
expect(routes[1].path).toBe("/v2/aggs/ticker/{stocksTicker}/prev")
expect(routes[1].method).toBe("get")
expect(routes[1].operationId).toBe("getStockPreviousClose")
expect(functions[1].function.parameters.properties).toHaveProperty(
"stocksTicker"
)
expect(functions[1].function.parameters.properties.stocksTicker.type).toBe(
"string"
)
expect(
functions[1].function.parameters.properties.stocksTicker
).toHaveProperty("required",true)
})
})

// File: __tests__/playwright-test/playwright.config.ts
import{defineConfig,devices}from '@playwright/test';
/**
* Read environment variables from file.
* https:
*/

/**
* See https:
*/
export default defineConfig({
testDir:'./tests',

fullyParallel:true,

forbidOnly:!!process.env.CI,

retries:process.env.CI ? 2 :0,

workers:process.env.CI ? 1 :undefined,
/* Reporter to use. See https:
reporter:'html',
/* Shared settings for all the projects below. See https:
use:{


/* Collect trace when retrying the failed test. See https:
trace:'on-first-retry',
},

projects:[
{
name:'chromium',
use:{...devices['Desktop Chrome']},
},
{
name:'firefox',
use:{...devices['Desktop Firefox']},
},
{
name:'webkit',
use:{...devices['Desktop Safari']},
},


















],






});

// File: __tests__/playwright-test/tests/login.spec.ts
import{test,expect}from '@playwright/test';
test('start chatting is displayed',async ({page}) => {
await page.goto('http:

await expect (page.getByRole('link',{name:'Start Chatting'})).toBeVisible();
});
test('No password error message',async ({page}) => {
await page.goto('http:

await page.getByPlaceholder('you@example.com').fill('dummyemail@gmail.com');
await page.getByRole('button',{name:'Login'}).click();

await page.waitForLoadState('networkidle');

await expect(page.getByText('Invalid login credentials')).toBeVisible();
});
test('No password for signup',async ({page}) => {
await page.goto('http:
await page.getByPlaceholder('you@example.com').fill('dummyEmail@Gmail.com');
await page.getByRole('button',{name:'Sign Up'}).click();

await expect(page.getByText('Signup requires a valid')).toBeVisible();
});
test('invalid username for signup',async ({page}) => {
await page.goto('http:
await page.getByPlaceholder('you@example.com').fill('dummyEmail');
await page.getByPlaceholder('••••••••').fill('dummypassword');
await page.getByRole('button',{name:'Sign Up'}).click();

await expect(page.getByText('Unable to validate email')).toBeVisible();
});
test('password reset message',async ({page}) => {
await page.goto('http:
await page.getByPlaceholder('you@example.com').fill('demo@gmail.com');
await page.getByRole('button',{name:'Reset'}).click();

await expect(page.getByText('Check email to reset password')).toBeVisible();
});

// File: app/[locale]/[workspaceid]/chat/[chatid]/page.tsx
"use client"
import{ChatUI}from "@/components/chat/chat-ui"
export default function ChatIDPage() {
return <ChatUI />
}

// File: app/[locale]/[workspaceid]/chat/page.tsx
"use client"
import{ChatHelp}from "@/components/chat/chat-help"
import{useChatHandler}from "@/components/chat/chat-hooks/use-chat-handler"
import{ChatInput}from "@/components/chat/chat-input"
import{ChatSettings}from "@/components/chat/chat-settings"
import{ChatUI}from "@/components/chat/chat-ui"
import{QuickSettings}from "@/components/chat/quick-settings"
import{Brand}from "@/components/ui/brand"
import{ChatbotUIContext}from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import{useTheme}from "next-themes"
import{useContext}from "react"
export default function ChatPage() {
useHotkey("o",() => handleNewChat())
useHotkey("l",() => {
handleFocusChatInput()
})
const{chatMessages} = useContext(ChatbotUIContext)
const{handleNewChat,handleFocusChatInput} = useChatHandler()
const{theme} = useTheme()
return (
<>
{chatMessages.length === 0 ? (
<div className="relative flex h-full flex-col items-center justify-center">
<div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
<Brand theme={theme === "dark" ? "dark" :"light"} />
</div>
<div className="absolute left-2 top-2">
<QuickSettings />
</div>
<div className="absolute right-2 top-2">
<ChatSettings />
</div>
<div className="flex grow flex-col items-center justify-center" />
<div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
<ChatInput />
</div>
<div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
<ChatHelp />
</div>
</div>
) :(
<ChatUI />
)}
</>
)
}

// File: app/[locale]/[workspaceid]/layout.tsx
"use client"
import{Dashboard}from "@/components/ui/dashboard"
import{ChatbotUIContext}from "@/context/context"
import{getAssistantWorkspacesByWorkspaceId}from "@/db/assistants"
import{getChatsByWorkspaceId}from "@/db/chats"
import{getCollectionWorkspacesByWorkspaceId}from "@/db/collections"
import{getFileWorkspacesByWorkspaceId}from "@/db/files"
import{getFoldersByWorkspaceId}from "@/db/folders"
import{getModelWorkspacesByWorkspaceId}from "@/db/models"
import{getPresetWorkspacesByWorkspaceId}from "@/db/presets"
import{getPromptWorkspacesByWorkspaceId}from "@/db/prompts"
import{getAssistantImageFromStorage}from "@/db/storage/assistant-images"
import{getToolWorkspacesByWorkspaceId}from "@/db/tools"
import{getWorkspaceById}from "@/db/workspaces"
import{convertBlobToBase64}from "@/lib/blob-to-b64"
import{supabase}from "@/lib/supabase/browser-client"
import{LLMID}from "@/types"
import{useParams,useRouter,useSearchParams}from "next/navigation"
import{ReactNode,useContext,useEffect,useState}from "react"
import Loading from "../loading"
interfaceWorkspaceLayoutProps {
children:ReactNode
}
export default function WorkspaceLayout({children}:WorkspaceLayoutProps) {
constrouter = useRouter()
constparams = useParams()
constsearchParams = useSearchParams()
constworkspaceId = params.workspaceid as string
const{
setChatSettings,
setAssistants,
setAssistantImages,
setChats,
setCollections,
setFolders,
setFiles,
setPresets,
setPrompts,
setTools,
setModels,
selectedWorkspace,
setSelectedWorkspace,
setSelectedChat,
setChatMessages,
setUserInput,
setIsGenerating,
setFirstTokenReceived,
setChatFiles,
setChatImages,
setNewMessageFiles,
setNewMessageImages,
setShowFilesDisplay
} = useContext(ChatbotUIContext)
const[loading,setLoading] = useState(true)
useEffect(() => {
;(async () => {
constsession = (await supabase.auth.getSession()).data.session
if (!session) {
return router.push("/login")
} else {
await fetchWorkspaceData(workspaceId)
}
})()
},[])
useEffect(() => {
;(async () => await fetchWorkspaceData(workspaceId))()
setUserInput("")
setChatMessages([])
setSelectedChat(null)
setIsGenerating(false)
setFirstTokenReceived(false)
setChatFiles([])
setChatImages([])
setNewMessageFiles([])
setNewMessageImages([])
setShowFilesDisplay(false)
},[workspaceId])
constfetchWorkspaceData = async (workspaceId:string) => {
setLoading(true)
constworkspace = await getWorkspaceById(workspaceId)
setSelectedWorkspace(workspace)
constassistantData = await getAssistantWorkspacesByWorkspaceId(workspaceId)
setAssistants(assistantData.assistants)
for (constassistant of assistantData.assistants) {
leturl = ""
if (assistant.image_path) {
url = (await getAssistantImageFromStorage(assistant.image_path)) || ""
}
if (url) {
constresponse = await fetch(url)
constblob = await response.blob()
constbase64 = await convertBlobToBase64(blob)
setAssistantImages(prev => [
...prev,
{
assistantId:assistant.id,
path:assistant.image_path,
base64,
url
}
])
} else {
setAssistantImages(prev => [
...prev,
{
assistantId:assistant.id,
path:assistant.image_path,
base64:"",
url
}
])
}
}
constchats = await getChatsByWorkspaceId(workspaceId)
setChats(chats)
constcollectionData =
await getCollectionWorkspacesByWorkspaceId(workspaceId)
setCollections(collectionData.collections)
constfolders = await getFoldersByWorkspaceId(workspaceId)
setFolders(folders)
constfileData = await getFileWorkspacesByWorkspaceId(workspaceId)
setFiles(fileData.files)
constpresetData = await getPresetWorkspacesByWorkspaceId(workspaceId)
setPresets(presetData.presets)
constpromptData = await getPromptWorkspacesByWorkspaceId(workspaceId)
setPrompts(promptData.prompts)
consttoolData = await getToolWorkspacesByWorkspaceId(workspaceId)
setTools(toolData.tools)
constmodelData = await getModelWorkspacesByWorkspaceId(workspaceId)
setModels(modelData.models)
setChatSettings({
model:(searchParams.get("model") ||
workspace?.default_model ||
"gpt-4-1106-preview") as LLMID,
prompt:
workspace?.default_prompt ||
"You are a friendly,helpful AI assistant.",
temperature:workspace?.default_temperature || 0.5,
contextLength:workspace?.default_context_length || 4096,
includeProfileContext:workspace?.include_profile_context || true,
includeWorkspaceInstructions:
workspace?.include_workspace_instructions || true,
embeddingsProvider:
(workspace?.embeddings_provider as "openai" | "local") || "openai"
})
setLoading(false)
}
if (loading) {
return <Loading />
}
return <Dashboard>{children}</Dashboard>
}

// File: app/[locale]/[workspaceid]/page.tsx
"use client"
import{ChatbotUIContext}from "@/context/context"
import{useContext}from "react"
export default function WorkspacePage() {
const{selectedWorkspace} = useContext(ChatbotUIContext)
return (
<div className="flex h-screen w-full flex-col items-center justify-center">
<div className="text-4xl">{selectedWorkspace?.name}</div>
</div>
)
}

// File: app/[locale]/help/page.tsx
export default function HelpPage() {
return (
<div className="size-screen flex flex-col items-center justify-center">
<div className="text-4xl">Help under construction.</div>
</div>
)
}

// File: app/[locale]/layout.tsx
import{Toaster}from "@/components/ui/sonner"
import{GlobalState}from "@/components/utility/global-state"
import{Providers}from "@/components/utility/providers"
import TranslationsProvider from "@/components/utility/translations-provider"
import initTranslations from "@/lib/i18n"
import{Database}from "@/supabase/types"
import{createServerClient}from "@supabase/ssr"
import{Metadata,Viewport}from "next"
import{Inter}from "next/font/google"
import{cookies}from "next/headers"
import{ReactNode}from "react"
import "./globals.css"
constinter = Inter({subsets:["latin"]})
constAPP_NAME = "Chatbot UI"
constAPP_DEFAULT_TITLE = "Chatbot UI"
constAPP_TITLE_TEMPLATE = "%s - Chatbot UI"
constAPP_DESCRIPTION = "Chabot UI PWA!"
interfaceRootLayoutProps {
children:ReactNode
params:{
locale:string
}
}
export constmetadata:Metadata = {
applicationName:APP_NAME,
title:{
default:APP_DEFAULT_TITLE,
template:APP_TITLE_TEMPLATE
},
description:APP_DESCRIPTION,
manifest:"/manifest.json",
appleWebApp:{
capable:true,
statusBarStyle:"black",
title:APP_DEFAULT_TITLE
},
formatDetection:{
telephone:false
},
openGraph:{
type:"website",
siteName:APP_NAME,
title:{
default:APP_DEFAULT_TITLE,
template:APP_TITLE_TEMPLATE
},
description:APP_DESCRIPTION
},
twitter:{
card:"summary",
title:{
default:APP_DEFAULT_TITLE,
template:APP_TITLE_TEMPLATE
},
description:APP_DESCRIPTION
}
}
export constviewport:Viewport = {
themeColor:"#000000"
}
consti18nNamespaces = ["translation"]
export default async function RootLayout({
children,
params:{locale}
}:RootLayoutProps) {
constcookieStore = cookies()
constsupabase = createServerClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies:{
get(name:string) {
return cookieStore.get(name)?.value
}
}
}
)
constsession = (await supabase.auth.getSession()).data.session
const{t,resources} = await initTranslations(locale,i18nNamespaces)
return (
<html lang="en" suppressHydrationWarning>
<body className={inter.className}>
<Providers attribute="class" defaultTheme="dark">
<TranslationsProvider
namespaces={i18nNamespaces}
locale={locale}
resources={resources}
>
<Toaster richColors position="top-center" duration={3000} />
<div className="bg-background text-foreground flex h-dvh flex-col items-center overflow-x-auto">
{session ? <GlobalState>{children}</GlobalState> :children}
</div>
</TranslationsProvider>
</Providers>
</body>
</html>
)
}

// File: app/[locale]/loading.tsx
import{IconLoader2}from "@tabler/icons-react"
export default function Loading() {
return (
<div className="flex size-full flex-col items-center justify-center">
<IconLoader2 className="mt-4 size-12 animate-spin" />
</div>
)
}

// File: app/[locale]/login/page.tsx
import{Brand}from "@/components/ui/brand"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{SubmitButton}from "@/components/ui/submit-button"
import{createClient}from "@/lib/supabase/server"
import{Database}from "@/supabase/types"
import{createServerClient}from "@supabase/ssr"
import{get}from "@vercel/edge-config"
import{Metadata}from "next"
import{cookies,headers}from "next/headers"
import{redirect}from "next/navigation"
export constmetadata:Metadata = {
title:"Login"
}
export default async function Login({
searchParams
}:{
searchParams:{message:string}
}) {
constcookieStore = cookies()
constsupabase = createServerClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies:{
get(name:string) {
return cookieStore.get(name)?.value
}
}
}
)
constsession = (await supabase.auth.getSession()).data.session
if (session) {
const{data:homeWorkspace,error} = await supabase
.from("workspaces")
.select("*")
.eq("user_id",session.user.id)
.eq("is_home",true)
.single()
if (!homeWorkspace) {
throw new Error(error.message)
}
return redirect(`/${homeWorkspace.id}/chat`)
}
constsignIn = async (formData:FormData) => {
"use server"
constemail = formData.get("email") as string
constpassword = formData.get("password") as string
constcookieStore = cookies()
constsupabase = createClient(cookieStore)
const{data,error} = await supabase.auth.signInWithPassword({
email,
password
})
if (error) {
return redirect(`/login?message=${error.message}`)
}
const{data:homeWorkspace,error:homeWorkspaceError} = await supabase
.from("workspaces")
.select("*")
.eq("user_id",data.user.id)
.eq("is_home",true)
.single()
if (!homeWorkspace) {
throw new Error(
homeWorkspaceError?.message || "An unexpected error occurred"
)
}
return redirect(`/${homeWorkspace.id}/chat`)
}
constgetEnvVarOrEdgeConfigValue = async (name:string) => {
"use server"
if (process.env.EDGE_CONFIG) {
return await get<string>(name)
}
return process.env[name]
}
constsignUp = async (formData:FormData) => {
"use server"
constemail = formData.get("email") as string
constpassword = formData.get("password") as string
constemailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
"EMAIL_DOMAIN_WHITELIST"
)
constemailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
? emailDomainWhitelistPatternsString?.split(",")
:[]
constemailWhitelistPatternsString =
await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
constemailWhitelist = emailWhitelistPatternsString?.trim()
? emailWhitelistPatternsString?.split(",")
:[]

if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
constdomainMatch = emailDomainWhitelist?.includes(email.split("@")[1])
constemailMatch = emailWhitelist?.includes(email)
if (!domainMatch && !emailMatch) {
return redirect(
`/login?message=Email ${email} is not allowed to sign up.`
)
}
}
constcookieStore = cookies()
constsupabase = createClient(cookieStore)
const{error} = await supabase.auth.signUp({
email,
password,
options:{


}
})
if (error) {
console.error(error)
return redirect(`/login?message=${error.message}`)
}
return redirect("/setup")


}
consthandleResetPassword = async (formData:FormData) => {
"use server"
constorigin = headers().get("origin")
constemail = formData.get("email") as string
constcookieStore = cookies()
constsupabase = createClient(cookieStore)
const{error} = await supabase.auth.resetPasswordForEmail(email,{
redirectTo:`${origin}/auth/callback?next=/login/password`
})
if (error) {
return redirect(`/login?message=${error.message}`)
}
return redirect("/login?message=Check email to reset password")
}
return (
<div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
<form
className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
action={signIn}
>
<Brand />
<Label className="text-md mt-4" htmlFor="email">
Email
</Label>
<Input
className="mb-3 rounded-md border bg-inherit px-4 py-2"
name="email"
placeholder="you@example.com"
required
/>
<Label className="text-md" htmlFor="password">
Password
</Label>
<Input
className="mb-6 rounded-md border bg-inherit px-4 py-2"
type="password"
name="password"
placeholder="••••••••"
/>
<SubmitButton className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white">
Login
</SubmitButton>
<SubmitButton
formAction={signUp}
className="border-foreground/20 mb-2 rounded-md border px-4 py-2"
>
Sign Up
</SubmitButton>
<div className="text-muted-foreground mt-1 flex justify-center text-sm">
<span className="mr-1">Forgot your password?</span>
<button
formAction={handleResetPassword}
className="text-primary ml-1 underline hover:opacity-80"
>
Reset
</button>
</div>
{searchParams?.message && (
<p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
{searchParams.message}
</p>
)}
</form>
</div>
)
}

// File: app/[locale]/login/password/page.tsx
"use client"
import{ChangePassword}from "@/components/utility/change-password"
import{supabase}from "@/lib/supabase/browser-client"
import{useRouter}from "next/navigation"
import{useEffect,useState}from "react"
export default function ChangePasswordPage() {
const[loading,setLoading] = useState(true)
constrouter = useRouter()
useEffect(() => {
;(async () => {
constsession = (await supabase.auth.getSession()).data.session
if (!session) {
router.push("/login")
} else {
setLoading(false)
}
})()
},[])
if (loading) {
return null
}
return <ChangePassword />
}

// File: app/[locale]/page.tsx
"use client"
import{ChatbotUISVG}from "@/components/icons/chatbotui-svg"
import{IconArrowRight}from "@tabler/icons-react"
import{useTheme}from "next-themes"
import Link from "next/link"
export default function HomePage() {
const{theme} = useTheme()
return (
<div className="flex size-full flex-col items-center justify-center">
<div>
<ChatbotUISVG theme={theme === "dark" ? "dark" :"light"} scale={0.3} />
</div>
<div className="mt-2 text-4xl font-bold">Chatbot UI</div>
<Link
className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
href="/login"
>
Start Chatting
<IconArrowRight className="ml-1" size={20} />
</Link>
</div>
)
}

// File: app/[locale]/protected/actions.ts
"use server"
import{prepScopes,Providers}from "@microsoft/mgt-element"
export async function sendMailAction() {
letprovider = Providers.globalProvider
if (provider) {
letgraphClient = provider.graph.client
await graphClient
.api("https:
.middlewareOptions(
prepScopes([
"api:
])
)
.post({
message:{
subject:"Email from a protected API",
body:{
contentType:"Text",
content:
"This is a demo email from a protected API sent on-behalf-of a user."
},
toRecipients:[
{
emailAddress:{
address:"vinod@pittampalli.com"
}
}
]
}
})
}
}

// File: app/[locale]/protected/actions/auth.ts
"use server"
import{AuthorizationUrlRequest}from "@azure/msal-node"
import{cookies}from "next/headers"
import{redirect}from "next/navigation"
import{calendarRequest,loginRequest,tasksRequest}from "../serverConfig"
import{authProvider}from "../services/auth"
import{getCurrentUrl}from "../utils/url"
import{createClient}from "@/lib/supabase/server"
async function acquireToken(
request:Omit<AuthorizationUrlRequest,"redirectUri">,
redirectPath:string
) {
constcurrentUrl = new URL(getCurrentUrl())
currentUrl.pathname = redirectPath.split("?")[0]
currentUrl.search = redirectPath.split("?")[1] || ""
constredirectUrl = currentUrl.toString()
console.log("request",request)
console.log("redirectUrl",redirectUrl)
redirect(await authProvider.getAuthCodeUrl(request,redirectUrl))
}
export async function acquireCalendarTokenInteractive() {
await acquireToken(calendarRequest,"/protected/event")
}
export async function acquireTasksTokenInteractive() {
await acquireToken(tasksRequest,"/protected/tasks")
}
async function redirectToHome():Promise<string> {
constcookieStore = cookies()
constsupabase = createClient(cookieStore)
try {
const{
data:{session}
} = await supabase.auth.getSession()
if (session) {
const{data:homeWorkspace,error} = await supabase
.from("workspaces")
.select("*")
.eq("user_id",session.user.id)
.eq("is_home",true)
.single()
if (error) throw error
if (homeWorkspace) {
return `/${homeWorkspace.id}/chat`
}
}

return "/chat"
} catch (error) {
console.error("Error in home redirect:",error)
return "/chat" 
}
}
export async function login(prevState:any,formData:FormData) {
constorigin = formData.get("origin") as string
await acquireToken(loginRequest,origin)
console.log("loginRequest",loginRequest)
redirect(origin)
}
export async function logout(prevState:any,formData:FormData) {
constorigin = formData.get("origin") as string
const{instance,account} = await authProvider.authenticate()
if (account) {
await instance.getTokenCache().removeAccount(account)
}
cookies().delete("__session")
redirect(origin)
}

// File: app/[locale]/protected/actions/home-redirect.ts
"use server"
import{createClient}from "@/lib/supabase/server"
import{cookies}from "next/headers"
export async function redirectToHome():Promise<string> {
constcookieStore = cookies()
constsupabase = createClient(cookieStore)
try {
const{
data:{session}
} = await supabase.auth.getSession()
if (session) {
const{data:homeWorkspace,error} = await supabase
.from("workspaces")
.select("*")
.eq("user_id",session.user.id)
.eq("is_home",true)
.single()
if (error) throw error
if (homeWorkspace) {
return `/${homeWorkspace.id}/chat`
}
}

return "/chat"
} catch (error) {
console.error("Error in home redirect:",error)
return "/chat" 
}
}

// File: app/[locale]/protected/components/CalendarEvent.tsx
"use client"
import{Card,CardContent}from "@/components/ui/card"
import{Avatar,AvatarFallback}from "@/components/ui/avatar"
import{Calendar,Clock}from "lucide-react"
export typeGraphCalendarEvent = {
subject:string
start:{
dateTime:string
timezone:string
}
}
export constCalendarEvent = ({event}:{event:GraphCalendarEvent}) => {
if (!event) {
return <div className="p-4 text-center">Could not find any events</div>
}
return (
<Card>
<CardContent className="p-6">
<ul className="space-y-4">
<EventItem
icon={<Calendar className="size-4" />}
primary="Title"
secondary={event.subject}
/>
<EventItem
icon={<Clock className="size-4" />}
primary="Start Time"
secondary={event.start.dateTime}
/>
</ul>
</CardContent>
</Card>
)
}
constEventItem = ({
icon,
primary,
secondary
}:{
icon:React.ReactNode
primary:string
secondary:string
}) => (
<li className="flex items-center space-x-4">
<Avatar className="size-10">
<AvatarFallback>{icon}</AvatarFallback>
</Avatar>
<div>
<p className="text-sm font-medium leading-none">{primary}</p>
<p className="text-muted-foreground text-sm">{secondary}</p>
</div>
</li>
)

// File: app/[locale]/protected/components/ConsentButton.tsx
import{acquireCalendarTokenInteractive}from "../actions/auth"
import{Button}from "@/components/ui/button"
export default function ConsentButton() {
return (
<form action={acquireCalendarTokenInteractive}>
<Button className="w-full" type="submit">
Consent calendar permissions
</Button>
</form>
)
}

// File: app/[locale]/protected/components/CopyButton.tsx
"use client"
import{Button}from "@/components/ui/button"
import{Check,Copy}from "lucide-react"
import{useCopyToClipboard}from "@/lib/hooks/use-copy-to-clipboard"
interfaceCopyButtonProps {
value:string
}
export function CopyButton({value}:CopyButtonProps) {
const{isCopied,copyToClipboard} = useCopyToClipboard({timeout:2000})
return (
<Button
variant="ghost"
size="icon"
onClick={() => copyToClipboard(value)}
className="size-6 p-0"
>
{isCopied ? <Check className="size-4" /> :<Copy className="size-4" />}
</Button>
)
}

// File: app/[locale]/protected/components/ErrorComponent.tsx
import{AuthError}from "@azure/msal-node"
import{Alert,AlertTitle,AlertDescription}from "@/components/ui/alert"
import{ExclamationTriangleIcon}from "@radix-ui/react-icons"
export default function ErrorComponent({error}:{error:AuthError}) {
return (
<Alert variant="destructive">
<ExclamationTriangleIcon className="size-4" />
<AlertTitle>Error</AlertTitle>
<AlertDescription>An error occurred:{error.errorCode}</AlertDescription>
</Alert>
)
}

// File: app/[locale]/protected/components/HomeButton.tsx
"use client"
import{useRouter}from "next/navigation"
import{Button}from "@/components/ui/button"
import{redirectToHome}from "../actions/home-redirect"
import{useState}from "react"
import{Home as HomeIcon}from "lucide-react"
export default function HomeButton() {
constrouter = useRouter()
const[isLoading,setIsLoading] = useState(false)
consthandleHomeClick = async (event:React.FormEvent) => {
event.preventDefault()
setIsLoading(true)
try {
constredirectUrl = await redirectToHome()
router.push(redirectUrl)
} catch (error) {
console.error("Error redirecting to home:",error)
router.push("/chat") 
} finally {
setIsLoading(false)
}
}
return (
<form onSubmit={handleHomeClick}>
<Button
type="submit"
variant="ghost"
size="sm"
className=""
disabled={isLoading}
>
<HomeIcon className="mr-2 size-4" />
{isLoading ? "Redirecting..." :"Home"}
</Button>
</form>
)
}

// File: app/[locale]/protected/components/LoginButton.tsx
import{login}from "../actions/auth"
export default function LoginButton() {
return (

<button color="primary" type="submit">
Login
</button>

)
}

// File: app/[locale]/protected/components/LogoutButton.tsx
import{logout}from "../actions/auth"
export default function LogoutButton() {
consthandleLogout = (formData:FormData) => {

}
return (

<button color="primary" type="submit">
Logout
</button>

)
}

// File: app/[locale]/protected/components/NavBar.tsx
import Link from "next/link"
import{Button}from "@/components/ui/button"
import WelcomeName from "./WelcomeName"
import ProfilePicture from "./ProfilePicture"
import{logout}from "../actions/auth"
import{login}from "../actions/auth" 
import HomeButton from "./HomeButton"
import{LayoutDashboard}from "lucide-react"
import{authProvider}from "../services/auth"
export default async function NavBar() {
constaccount = await authProvider.getAccount()
constnavLinks = [
{name:"Profile",path:"/protected/profile"},
{name:"Graph Request",path:"/protected/graph-request"},
{name:"Events",path:"/protected/event"},
{name:"Tasks",path:"/protected/tasks"},
{name:"Token Information",path:"/protected/token-info"}
]
return (
<nav className="bg-background border-b">
<div className="container mx-auto px-4">
<div className="flex h-16 items-center justify-between">
<div className="flex items-center space-x-4">
<HomeButton />
</div>
<div className="flex items-center space-x-1">
{navLinks.map(link => (
<Button key={link.path} asChild variant="ghost" size="sm">
<Link href={link.path}>{link.name}</Link>
</Button>
))}
</div>
<div className="flex items-center space-x-4">
<WelcomeName />
<ProfilePicture />
<form action={account ? "logout" :"login"}>
<Button type="submit" variant="outline" size="sm">
{account ? "Logout" :"Login"}
</Button>
</form>
</div>
</div>
</div>
</nav>
)
}

// File: app/[locale]/protected/components/ProfileData.tsx
"use client"
import{Card,CardContent}from "@/components/ui/card"
import{Avatar,AvatarFallback}from "@/components/ui/avatar"
import{User,Briefcase,Mail,Phone,MapPin}from "lucide-react"
export typeGraphProfile = {
displayName:string
jobTitle:string
mail:string
businessPhones:string[]
officeLocation:string
}
export constProfileData = ({graphData}:{graphData:GraphProfile}) => {
return (
<Card>
<CardContent className="p-6">
<ul className="space-y-4">
<ProfileItem
icon={<User className="size-4" />}
primary="Name"
secondary={graphData.displayName}
/>
<ProfileItem
icon={<Briefcase className="size-4" />}
primary="Title"
secondary={graphData.jobTitle}
/>
<ProfileItem
icon={<Mail className="size-4" />}
primary="Mail"
secondary={graphData.mail}
/>
<ProfileItem
icon={<Phone className="size-4" />}
primary="Phone"
secondary={graphData.businessPhones[0]}
/>
<ProfileItem
icon={<MapPin className="size-4" />}
primary="Location"
secondary={graphData.officeLocation}
/>
</ul>
</CardContent>
</Card>
)
}
constProfileItem = ({
icon,
primary,
secondary
}:{
icon:React.ReactNode
primary:string
secondary:string
}) => (
<li className="flex items-center space-x-4">
<Avatar className="size-10">
<AvatarFallback>{icon}</AvatarFallback>
</Avatar>
<div>
<p className="text-sm font-medium leading-none">{primary}</p>
<p className="text-muted-foreground text-sm">{secondary}</p>
</div>
</li>
)

// File: app/[locale]/protected/components/ProfilePicture.tsx
import{authProvider}from "../services/auth"
import{Avatar,AvatarFallback,AvatarImage}from "@/components/ui/avatar"
import{User}from "lucide-react"
export default async function ProfilePicture() {
constaccount = await authProvider.getAccount()
if (!account) {
return null
}
return (
<Avatar>
<AvatarImage src="profile/picture" alt="Profile Picture" />
<AvatarFallback>
<User className="size-4" />
</AvatarFallback>
</Avatar>
)
}

// File: app/[locale]/protected/components/WelcomeName.tsx
import{authProvider}from "../services/auth"
import{ExclamationTriangleIcon}from "@radix-ui/react-icons"
export default async function WelcomeName() {
try {
constaccount = await authProvider.getAccount()
if (account?.name) {
return (
<p className="text-lg font-semibold">
Welcome,{account.name.split(" ")[0]}
</p>
)
} else {
return null
}
} catch (error) {
return (
<div className="flex items-center text-yellow-500">
<ExclamationTriangleIcon className="mr-2 size-4" />
<span>Error loading user data</span>
</div>
)
}
}

// File: app/[locale]/protected/components/graph-request-form.tsx
"use client"
import{useState}from "react"
import{useRouter}from "next/navigation"
import{Button}from "@/components/ui/button"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{Textarea}from "@/components/ui/textarea"
import{Card,CardContent,CardHeader,CardTitle}from "@/components/ui/card"
export function GraphRequestForm() {
constrouter = useRouter()
const[endpoint,setEndpoint] = useState(
"https:
)
const[scopes,setScopes] = useState(["User.Read"])
const[requestBody,setRequestBody] = useState("")
const[method,setMethod] = useState("GET")
consthandleSubmit = (e:React.FormEvent) => {
e.preventDefault()
constsearchParams = new URLSearchParams({
endpoint,
method,
scopes:scopes.join(",")
})
if (method !== "GET" && requestBody) {
searchParams.append("body",requestBody)
}
router.push(`/protected/graph-request?${searchParams.toString()}`)
}
return (
<Card>
<CardHeader>
<CardTitle>Request Configuration</CardTitle>
</CardHeader>
<CardContent>
<form onSubmit={handleSubmit} className="space-y-4">
<div>
<Label htmlFor="endpoint">Endpoint</Label>
<Input
id="endpoint"
value={endpoint}
onChange={e => setEndpoint(e.target.value)}
placeholder="https:
/>
</div>
<div>
<Label htmlFor="scopes">Scopes (comma-separated)</Label>
<Input
id="scopes"
value={scopes.join(",")}
onChange={e => setScopes(e.target.value.split(","))}
placeholder="User.Read"
/>
</div>
<div>
<Label htmlFor="method">Method</Label>
<select
id="method"
value={method}
onChange={e => setMethod(e.target.value)}
className="w-full rounded border p-2"
>
<option value="GET">GET</option>
<option value="POST">POST</option>
<option value="PATCH">PATCH</option>
<option value="DELETE">DELETE</option>
</select>
</div>
{method !== "GET" && (
<div>
<Label htmlFor="requestBody">Request Body (JSON)</Label>
<Textarea
id="requestBody"
value={requestBody}
onChange={e => setRequestBody(e.target.value)}
placeholder="{}"
rows={4}
/>
</div>
)}
<Button type="submit">Send Request</Button>
</form>
</CardContent>
</Card>
)
}

// File: app/[locale]/protected/event/error.tsx
"use client"
import{Card,CardContent}from "@/components/ui/card"
import{Button}from "@/components/ui/button"
import{acquireCalendarTokenInteractive}from "../actions/auth"
export default function Error({
error
}:{
error:Error & {digest?:string}
}) {
if (error.message === "InteractionRequiredAuthError") {
return (
<Card>
<CardContent className="p-6">
<h2 className="mb-4 text-xl font-semibold">
Please consent to see your calendar events.
</h2>
<form action={acquireCalendarTokenInteractive}>
<Button type="submit" className="w-full">
Consent calendar permissions
</Button>
</form>
</CardContent>
</Card>
)
}
return (
<Card>
<CardContent className="space-y-4 p-6">
<h2 className="text-xl font-semibold">
An error occurred while getting events.
</h2>
<p>{error.message}</p>
</CardContent>
</Card>
)
}

// File: app/[locale]/protected/event/page.tsx
import{InteractionRequiredAuthError}from "@azure/msal-node"
import{CalendarEvent,GraphCalendarEvent}from "../components/CalendarEvent"
import{graphConfig}from "../serverConfig"
import{authProvider}from "../services/auth"
async function getEvent() {
const{account,instance} = await authProvider.authenticate()
if (!account) {
throw new Error("No Account logged in")
}
try {
consttoken = await instance.acquireTokenSilent({
account,
scopes:["Calendars.Read"]
})
if (!token) {
throw new Error("Token null")
}
constresponse = await fetch(graphConfig.eventEndpoint,{
headers:{
Authorization:`Bearer ${token.accessToken}`
}
})
constdata:{value:GraphCalendarEvent[]} = await response.json()
return data.value[0]
} catch (error:unknown) {


if (error instanceof InteractionRequiredAuthError) {
throw new Error("InteractionRequiredAuthError")
}
throw error
}
}
export default async function EventPage() {
constevent = await getEvent()
return <CalendarEvent event={event} />
}

// File: app/[locale]/protected/forced/layout.tsx
import{redirect}from "next/navigation"
import{PropsWithChildren}from "react"
import{loginRequest}from "../serverConfig"
import{authProvider}from "../services/auth"
import{getCurrentUrl}from "../utils/url"
export default async function ForcedLayout({children}:PropsWithChildren) {
const{account} = await authProvider.authenticate()
if (!account) {
redirect(await authProvider.getAuthCodeUrl(loginRequest,getCurrentUrl()))
}
return <>{children}</>
}

// File: app/[locale]/protected/forced/page.tsx
import{authProvider}from "../services/auth"
export default async function ForcedPage() {
constaccount = await authProvider.getAccount()
if (!account) {
throw new Error("How did this happen?")
}
return <div>Hello {account.name}</div>
}

// File: app/[locale]/protected/graph-request/_page.tsx
import{redirect}from "next/navigation"
import{authProvider}from "../services/auth"
import{GraphRequestForm}from "../components/graph-request-form"
import{Card,CardContent,CardHeader,CardTitle}from "@/components/ui/card"
interfaceGraphRequestResult {
request:string
response:string
}
async function makeGraphRequest(
endpoint:string,
method:string,
scopes:string[],
body?:string
) {
const{account,instance} = await authProvider.authenticate()
if (!account) {
return null
}
consttoken = await instance.acquireTokenSilent({
account,
scopes
})
if (!token) {
return null
}
constheaders = new Headers({
Authorization:`Bearer ${token.accessToken}`,
"Content-Type":"application/json"
})
constrequestOptions:RequestInit = {
method,
headers,
body:method !== "GET" ? body :undefined
}
constrequest = JSON.stringify(
{endpoint,method,headers:Object.fromEntries(headers),body},
null,
2
)
constresponse = await fetch(endpoint,requestOptions)
constdata = await response.json()
return {
request,
response:JSON.stringify(data,null,2)
} as GraphRequestResult
}
export default async function GraphRequestPage({
searchParams
}:{
searchParams:{[key:string]:string | string[] | undefined}
}) {
letresult:GraphRequestResult | null = null
if (searchParams.endpoint && searchParams.method && searchParams.scopes) {
constendpoint = searchParams.endpoint as string
constmethod = searchParams.method as string
constscopes = (searchParams.scopes as string).split(",")
constbody = searchParams.body as string | undefined
result = await makeGraphRequest(endpoint,method,scopes,body)
}
if (searchParams.endpoint && !result) {
return redirect("/protected/graph-request")
}
return (
<div className="container mx-auto p-4">
<h1 className="mb-4 text-2xl font-bold">Microsoft Graph API Tester</h1>
<GraphRequestForm />
{result && (
<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
<Card>
<CardHeader>
<CardTitle>Request</CardTitle>
</CardHeader>
<CardContent>
<pre className="max-h-96 overflow-auto rounded bg-gray-100 p-2">
{result.request}
</pre>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle>Response</CardTitle>
</CardHeader>
<CardContent>
<pre className="max-h-96 overflow-auto rounded bg-gray-100 p-2">
{result.response}
</pre>
</CardContent>
</Card>
</div>
)}
</div>
)
}

// File: app/[locale]/protected/graph-request/page.tsx
import{redirect}from "next/navigation"
import{authProvider}from "../services/auth"
import{graphConfig}from "../serverConfig"
import{Card,CardContent,CardHeader,CardTitle}from "@/components/ui/card"
interfaceGraphProfile {
displayName:string
jobTitle:string
mail:string
userPrincipalName:string
}
async function getUserInfo() {
const{account,instance} = await authProvider.authenticate()
if (!account) {
return null
}
consttoken = await instance.acquireTokenSilent({
account,
scopes:["User.Read"]
})
if (!token) {
return null
}
constresponse = await fetch(`${graphConfig.meEndpoint}`,{
headers:{
Authorization:`Bearer ${token.accessToken}`
}
})
return (await response.json()) as GraphProfile
}
export default async function GraphRequestPage() {
constprofile = await getUserInfo()
if (!profile) {
return redirect("/")
}
return (
<div className="container mx-auto p-4">
<h1 className="mb-4 text-2xl font-bold">Graph Request Result</h1>
<Card>
<CardHeader>
<CardTitle>{profile.displayName}</CardTitle>
</CardHeader>
<CardContent>
<p>Job Title:{profile.jobTitle}</p>
<p>Email:{profile.mail}</p>
<p>User Principal Name:{profile.userPrincipalName}</p>
</CardContent>
</Card>
</div>
)
}

// File: app/[locale]/protected/layout.tsx
import Navbar from "./components/NavBar"
export default function DashboardLayout({
children
}:{
children:React.ReactNode
}) {
return (
<div>
<Navbar />
{children}
</div>
)
}

// File: app/[locale]/protected/page.tsx
import{authProvider}from "./services/auth"
import{
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle
}from "@/components/ui/card"
import{
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
}from "@/components/ui/table"
import{ScrollArea}from "@/components/ui/scroll-area"
import{Badge}from "@/components/ui/badge"
import{CopyButton}from "./components/CopyButton"
interfaceTokenClaim {
claim:string
value:string
description:string
}
function createClaimsTable(claims:Record<string,any>):TokenClaim[] {
constclaimsArray:TokenClaim[] = []
constpopulateClaim = (claim:string,value:string,description:string) => {
claimsArray.push({claim,value,description})
}
constchangeDateFormat = (date:number):string => {
constdateObj = new Date(date * 1000)
return `${date} - [${dateObj.toString()}]`
}
Object.entries(claims).forEach(([key,value]) => {
if (typeof value !== "string" && typeof value !== "number") return
switch (key) {
case "aud":
populateClaim(
key,
String(value),
"Identifies the intended recipient of the token. In ID tokens,the audience is your app's Application ID,assigned to your app in the Azure portal."
)
break
case "iss":
populateClaim(
key,
String(value),
"Identifies the issuer,or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated."
)
break
case "iat":
populateClaim(
key,
changeDateFormat(Number(value)),
'"Issued At" indicates the timestamp when the authentication for this user occurred.'
)
break
case "nbf":
populateClaim(
key,
changeDateFormat(Number(value)),
'The "not before" claim dictates the time before which the JWT must not be accepted for processing.'
)
break
case "exp":
populateClaim(
key,
changeDateFormat(Number(value)),
"The expiration time claim dictates the expiration time on or after which the JWT must not be accepted for processing."
)
break
case "name":
populateClaim(
key,
String(value),
"The name claim provides a human-readable value that identifies the subject of the token."
)
break
case "preferred_username":
populateClaim(
key,
String(value),
"The primary username that represents the user. It could be an email address,phone number,or a generic username without a specified format."
)
break
case "oid":
populateClaim(
key,
String(value),
"The user's object id is the only claim that should be used to uniquely identify a user in an Azure AD tenant."
)
break
case "tid":
populateClaim(
key,
String(value),
"The id of the tenant where this app resides."
)
break
case "sub":
populateClaim(
key,
String(value),
"The subject claim is a pairwise identifier - it is unique to a particular application ID."
)
break
default:
populateClaim(key,String(value),"")
}
})
return claimsArray
}
function formatTimeAgo(timestamp:number):string {
constnow = Date.now()
constsecondsAgo = Math.floor((now - timestamp * 1000) / 1000)
if (secondsAgo < 60) return `${secondsAgo} seconds ago`
if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`
if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`
return `${Math.floor(secondsAgo / 86400)} days ago`
}
function formatTimeUntil(timestamp:number):string {
constnow = Date.now()
constsecondsUntil = Math.floor((timestamp * 1000 - now) / 1000)
if (secondsUntil < 60) return `in ${secondsUntil} seconds`
if (secondsUntil < 3600) return `in ${Math.floor(secondsUntil / 60)} minutes`
if (secondsUntil < 86400) return `in ${Math.floor(secondsUntil / 3600)} hours`
return `in ${Math.floor(secondsUntil / 86400)} days`
}
async function getTokenInfo() {
const{account,instance} = await authProvider.authenticate()
if (!account) {
return null
}
consttokenClaims = createClaimsTable(account.idTokenClaims || {})
constgraphToken = await instance.acquireTokenSilent({
account,
scopes:["User.Read"]
})
return {
tokenClaims,
graphToken,
issuedAt:account.idTokenClaims?.iat as number
}
}
export default async function TokenInfoPage() {
consttokenInfo = await getTokenInfo()
if (!tokenInfo) {
return <div>No account information available.</div>
}
constexpiresOn = tokenInfo.graphToken.expiresOn
? new Date(tokenInfo.graphToken.expiresOn).toLocaleString()
:"Not available"
constexpiresInFormatted = tokenInfo.graphToken.expiresOn
? formatTimeUntil(Math.floor(Number(tokenInfo.graphToken.expiresOn) / 1000))
:"Unknown"
constissuedAtFormatted = tokenInfo.issuedAt
? new Date(tokenInfo.issuedAt * 1000).toLocaleString()
:"Not available"
consttimeAgo = tokenInfo.issuedAt
? formatTimeAgo(tokenInfo.issuedAt)
:"Unknown"
return (
<div className="container mx-auto space-y-6 p-4">
<Card>
<CardHeader>
<CardTitle>Microsoft Graph API Token</CardTitle>
<CardDescription>
Information about the acquired access token for Microsoft Graph API
</CardDescription>
</CardHeader>
<CardContent>
<div className="space-y-2">
<p>
<strong>Scopes:</strong>{" "}
{tokenInfo.graphToken.scopes.map(scope => (
<Badge key={scope} variant="secondary" className="mr-1">
{scope}
</Badge>
))}
</p>
<p>
<strong>Token Type:</strong> {tokenInfo.graphToken.tokenType}
</p>
<p>
<strong>Issued At:</strong> {issuedAtFormatted} ({timeAgo})
</p>
<p>
<strong>Expires:</strong> {expiresOn} ({expiresInFormatted})
</p>
</div>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle>ID Token Claims</CardTitle>
<CardDescription>
Claims in your ID token. For more information,visit:{" "}
<a
href="https:
className="text-blue-500 hover:underline"
>
docs.microsoft.com
</a>
</CardDescription>
</CardHeader>
<CardContent>
<ScrollArea className="h-[800px] w-full rounded-md border">
<Table>
<TableHeader>
<TableRow>
<TableHead className="w-[100px]">Claim</TableHead>
<TableHead className="w-[200px]">Value</TableHead>
<TableHead>Description</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{tokenInfo.tokenClaims.map((claim,index) => (
<TableRow key={index}>
<TableCell className="font-medium">{claim.claim}</TableCell>
<TableCell className="font-mono text-sm">
<div className="flex items-center space-x-2">
<span className="truncate">{claim.value}</span>
<CopyButton value={claim.value} />
</div>
</TableCell>
<TableCell>{claim.description}</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</ScrollArea>
</CardContent>
</Card>
</div>
)
}

// File: app/[locale]/protected/profile/page.tsx
import{redirect}from "next/navigation"
import{GraphProfile,ProfileData}from "../components/ProfileData"
import{graphConfig}from "../serverConfig"
import{authProvider}from "../services/auth"
async function getUserInfo() {
const{account,instance} = await authProvider.authenticate()
if (!account) {
return null
}
consttoken = await instance.acquireTokenSilent({
account,
scopes:["User.Read"]
})
if (!token) {
return null
}
constresponse = await fetch(graphConfig.meEndpoint,{
headers:{
Authorization:`Bearer ${token.accessToken}`
}
})
return (await response.json()) as GraphProfile
}
export default async function ProfilePage() {
constprofile = await getUserInfo()
if (!profile) {
return redirect("/")
}
return <ProfileData graphData={profile} />
}

// File: app/[locale]/protected/profile/picture/route.tsx
import{graphConfig}from "../../serverConfig"
import{authProvider}from "../../services/auth"
export async function GET() {
const{account,instance} = await authProvider.authenticate()
if (!account) {
return new Response(null,{status:401})
}
consttoken = await instance.acquireTokenSilent({
account,
scopes:["User.Read"]
})
if (!token) {
return new Response(null,{status:403})
}
return await fetch(graphConfig.profilePhotoEndpoint,{
headers:{
Authorization:`Bearer ${token.accessToken}`
}
})
}

// File: app/[locale]/protected/serverConfig.ts


import{Configuration,LogLevel}from "@azure/msal-node"
import "server-only"
export constgraphConfig = {
graphEndpoint:"https:
meEndpoint:"https:
eventEndpoint:"https:
profilePhotoEndpoint:"https:
mailEndpoint:"https:
}
export constmsalConfig:Configuration = {
auth:{
clientId:process.env.AZURE_AD_CLIENT_ID!,
clientSecret:process.env.AZURE_AD_CLIENT_SECRET!,
authority:
process.env.AZURE_AD_AUTHORITY ??
"https:
},
system:{
loggerOptions:{
piiLoggingEnabled:false,
logLevel:LogLevel.Info,
loggerCallback(logLevel,message) {
switch (logLevel) {
case LogLevel.Error:
console.error(message)
return
case LogLevel.Info:
console.info(message)
return
case LogLevel.Verbose:
console.debug(message)
return
case LogLevel.Warning:
console.warn(message)
return
default:
console.log(message)
return
}
}
}
}
}
export constloginRequest = {
scopes:["User.Read"]
}
export constcalendarRequest = {
scopes:["Calendars.Read"]
}
export consttasksRequest = {
scopes:["Tasks.Read"]
}
export constauthCallbackUri =
process.env.AUTH_CALLBACK_URI ?? "http:
export constsessionSecret = process.env.SESSION_SECRET!


export constredisUrl = process.env.REDIS_REDIS_URL

// File: app/[locale]/protected/services/auth.ts
import{SessionPartitionManager}from "../utils/SessionPartitionManager"
import RedisCacheClient from "../utils/RedisCacheClient"
import{redisClient}from "./redis"
import{AuthProvider}from "../utils/AuthProvider"
import{getSession}from "./session"
import{cookies}from "next/headers"
import{authCallbackUri,msalConfig}from "../serverConfig"
import "server-only"
async function partitionManagerFactory() {
constcookie = cookies().get("__session")
constsession = await getSession(`__session=${cookie?.value}`)
return new SessionPartitionManager(session)
}
export constauthProvider = new AuthProvider(
msalConfig,
authCallbackUri,
new RedisCacheClient(redisClient),
partitionManagerFactory
)

// File: app/[locale]/protected/services/redis.ts
import{createClient}from "redis"
import "server-only"
import{redisUrl}from "../serverConfig"
export constredisClient = createClient(
redisUrl ? {url:redisUrl} :undefined
)
redisClient.on("error",err => console.log("Redis Client Error",err))

// File: app/[locale]/protected/services/session.ts
import{createCookieSessionStorage}from "@remix-run/node"
import{sessionSecret}from "../serverConfig"
import "server-only"
export typeSessionData = {
homeAccountId:string
}

export const{getSession,commitSession,destroySession} =
createCookieSessionStorage<SessionData>({
cookie:{
name:"__session",
secrets:[sessionSecret],
sameSite:"lax",
path:"/",
httpOnly:true,
secure:process.env.NODE_ENV === "production"
}
})

// File: app/[locale]/protected/tasks/[listId]/page.tsx
import React from "react"
import{TaskComboboxForm}from "../tasks-combobox-form"
import{DataTable}from "../data-table"
import{columns}from "../columns"
import{getTasks,getLists}from "../actions"
import{TodoTask,TodoTaskList}from "@microsoft/microsoft-graph-types"
import{Alert,AlertDescription,AlertTitle}from "@/components/ui/alert"
import{AlertCircle}from "lucide-react"
export default async function TasksListPage({
params
}:{
params:{listId:string}
}) {
letlists:TodoTaskList[] = []
lettasks:TodoTask[] = []
leterror:Error | null = null
try {
lists = await getLists()
} catch (e) {
console.error("Error fetching lists:",e)
error =
e instanceof Error
? e
:new Error("Unknown error occurred while fetching lists")
}
if (!error && params.listId) {
try {
tasks = await getTasks(params.listId)
} catch (e) {
console.error("Error fetching tasks:",e)
error =
e instanceof Error
? e
:new Error("Unknown error occurred while fetching tasks")
}
} else if (!params.listId) {
error = new Error("No list ID provided")
}
return (
<div>
<TaskComboboxForm lists={lists} />
<div className="mt-6">
{error ? (
<Alert variant="destructive">
<AlertCircle className="size-4" />
<AlertTitle>Error</AlertTitle>
<AlertDescription>
{error.message}
{error.stack && (
<details>
<summary>Error Details</summary>
<pre>{error.stack}</pre>
</details>
)}
</AlertDescription>
</Alert>
) :(
<DataTable
columns={columns}
data={tasks}
initialTasks={tasks}
listId={params.listId}
/>
)}
</div>
</div>
)
}

// File: app/[locale]/protected/tasks/_page.tsx
import{InteractionRequiredAuthError}from "@azure/msal-node"
import{CalendarEvent,GraphCalendarEvent}from "../components/CalendarEvent"
import{graphConfig}from "../serverConfig"
import{authProvider}from "../services/auth"
async function getTaskLists() {
const{account,instance} = await authProvider.authenticate()
if (!account) {
throw new Error("No Account logged in")
}
try {
consttoken = await instance.acquireTokenSilent({
account,
scopes:["Tasks.Read"]
})
if (!token) {
throw new Error("Token null")
}
constresponse = await fetch(graphConfig.meEndpoint + "/todo/lists",{
headers:{
Authorization:`Bearer ${token.accessToken}`
}
})
constdata:{value:GraphCalendarEvent[]} = await response.json()
return data.value[0]
} catch (error:unknown) {


if (error instanceof InteractionRequiredAuthError) {
throw new Error("InteractionRequiredAuthError")
}
throw error
}
}
export default async function TasksPage() {
consttasks = await getTaskLists()
return JSON.stringify(tasks)
}

// File: app/[locale]/protected/tasks/actions.ts
"use server"
import{revalidatePath}from "next/cache"
import{InteractionRequiredAuthError}from "@azure/msal-node"
import{TodoTask,TodoTaskList}from "@microsoft/microsoft-graph-types"
import{graphConfig}from "@/app/[locale]/protected/serverConfig"
import{authProvider}from "@/app/[locale]/protected/services/auth"
async function getGraphClient() {
const{account,instance} = await authProvider.authenticate()
if (!account) {
throw new Error("No Account logged in")
}
try {
consttoken = await instance.acquireTokenSilent({
account,
scopes:["Tasks.ReadWrite"]
})
if (!token) {
throw new Error("Token null")
}
return {
api:(endpoint:string) => ({
get:async () => {
constresponse = await fetch(
`${graphConfig.graphEndpoint}${endpoint}`,
{
headers:{
Authorization:`Bearer ${token.accessToken}`
}
}
)
if (!response.ok) {
consterrorText = await response.text()
console.error(`API Error Response:${errorText}`)
throw new Error(
`HTTP error! status:${response.status},body:${errorText}`
)
}
return response.json()
},
post:async (body:any) => {
constresponse = await fetch(
`${graphConfig.graphEndpoint}${endpoint}`,
{
method:"POST",
headers:{
Authorization:`Bearer ${token.accessToken}`,
"Content-Type":"application/json"
},
body:JSON.stringify(body)
}
)
if (!response.ok) {
consterrorText = await response.text()
console.error(`API Error Response:${errorText}`)
throw new Error(
`HTTP error! status:${response.status},body:${errorText}`
)
}
return response.json()
},
delete:async () => {
constresponse = await fetch(
`${graphConfig.graphEndpoint}${endpoint}`,
{
method:"DELETE",
headers:{
Authorization:`Bearer ${token.accessToken}`
}
}
)
if (!response.ok) {
consterrorText = await response.text()
console.error(`API Error Response:${errorText}`)
throw new Error(
`HTTP error! status:${response.status},body:${errorText}`
)
}
}
})
}
} catch (error:unknown) {
if (error instanceof InteractionRequiredAuthError) {
throw new Error("InteractionRequiredAuthError")
}
throw error
}
}
function isValidListId(listId:string):boolean {
return typeof listId === "string" && listId.trim().length > 0
}
export async function getTasks(listId:string):Promise<TodoTask[]> {
if (!listId) {
throw new Error("List ID is required")
}
if (!isValidListId(listId)) {
throw new Error("Invalid list ID format")
}
constclient = await getGraphClient()
try {
console.log(`Fetching tasks for list ID:${listId}`)
constresponse = await client.api(`/me/todo/lists/${listId}/tasks`).get()
console.log(`API Response for tasks:`,response)
return response.value
} catch (error) {
console.error("Error fetching tasks:",error)
if (error instanceof Error) {
throw new Error(`Failed to fetch tasks:${error.message}`)
} else {
throw new Error("An unknown error occurred while fetching tasks")
}
}
}
export async function getLists():Promise<TodoTaskList[]> {
constclient = await getGraphClient()
try {
constresponse = await client.api(`/me/todo/lists`).get()
console.log(`API Response for lists:`,response)
return response.value
} catch (error) {
console.error("Error fetching lists:",error)
if (error instanceof Error) {
throw new Error(`Failed to fetch lists:${error.message}`)
} else {
throw new Error("An unknown error occurred while fetching lists")
}
}
}
export async function addTasks(
listId:string,
tasks:string[]
):Promise<TodoTask[]> {
if (!listId || !isValidListId(listId)) {
throw new Error("Invalid list ID")
}
constclient = await getGraphClient()
letaddedTasks:TodoTask[] = []
if (tasks.length === 0) {
return addedTasks
}
if (tasks.length === 1) {
consttodoTask = {title:tasks[0]}
constsingleTaskResponse = await client
.api(`/me/todo/lists/${listId}/tasks`)
.post(todoTask)
addedTasks.push(singleTaskResponse)
} else {
constbatchRequestBody = {
requests:tasks.map((task,index) => ({
id:index.toString(),
method:"POST",
url:`/me/todo/lists/${listId}/tasks`,
headers:{
"Content-Type":"application/json"
},
body:{title:task}
}))
}
constbatchResponse = await client.api("/$batch").post(batchRequestBody)
addedTasks = batchResponse.responses
.filter((res:any) => res.status === 201)
.map((res:any) => res.body)
}
revalidatePath("/tasks")
return addedTasks
}
export async function deleteTasks(
listId:string,
taskIds:string[]
):Promise<void> {
if (!listId || !isValidListId(listId)) {
throw new Error("Invalid list ID")
}
if (taskIds.length === 0) {
return
}
constclient = await getGraphClient()
if (taskIds.length === 1) {
await client.api(`/me/todo/lists/${listId}/tasks/${taskIds[0]}`).delete()
} else {
constbatchRequestBody = {
requests:taskIds.map((taskId,index) => ({
id:index.toString(),
method:"DELETE",
url:`/me/todo/lists/${listId}/tasks/${taskId}`,
headers:{
"Content-Type":"application/json"
}
}))
}
await client.api("/$batch").post(batchRequestBody)
}
revalidatePath("/tasks")
}

// File: app/[locale]/protected/tasks/columns.tsx
"use client"
import{ColumnDef}from "@tanstack/react-table"
import{Checkbox}from "@/components/ui/checkbox"
import{TodoTask}from "@microsoft/microsoft-graph-types"
import{DataTableColumnHeader}from "./components/data-table-column-header"
import{DataTableRowActions}from "./components/data-table-row-actions"
import{OptimisticTask}from "./types"
conststatusIcons = {
notStarted:() => <span className="text-gray-500">●</span>,
inProgress:() => <span className="text-blue-500">●</span>,
completed:() => <span className="text-green-500">●</span>
}
constimportanceIcons = {
low:() => <span className="text-gray-500">▼</span>,
normal:() => <span className="text-blue-500">■</span>,
high:() => <span className="text-red-500">▲</span>
}
export constcolumns:ColumnDef<OptimisticTask>[] = [
{
id:"select",
header:({table}) => (
<Checkbox
checked={
table.getIsAllPageRowsSelected() ||
(table.getIsSomePageRowsSelected() && "indeterminate")
}
onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
aria-label="Select all"
className="translate-y-[2px]"
/>
),
cell:({row}) => (
<Checkbox
checked={row.getIsSelected()}
onCheckedChange={value => row.toggleSelected(!!value)}
aria-label="Select row"
className="translate-y-[2px]"
/>
),
enableSorting:false,
enableHiding:false
},
{
accessorKey:"status",
header:({column}) => (
<DataTableColumnHeader column={column} title="Status" />
),
cell:({row}) => {
conststatus = row.getValue("status") as string | undefined
constStatusIcon = status
? statusIcons[status as keyof typeof statusIcons]
:statusIcons.notStarted
return (
<div className="flex items-center">
<StatusIcon />
<span className="ml-2 capitalize">{status || "Not Started"}</span>
</div>
)
}
},
{
accessorKey:"title",
header:({column}) => (
<DataTableColumnHeader column={column} title="Title" />
),
cell:({row}) => {
return (
<div className="flex space-x-2">
<span className="max-w-[500px] truncate font-medium">
{row.getValue("title")}
</span>
</div>
)
}
},
{
accessorKey:"importance",
header:({column}) => (
<DataTableColumnHeader column={column} title="Importance" />
),
cell:({row}) => {
constimportance = row.getValue("importance") as string | undefined
constImportanceIcon = importance
? importanceIcons[importance as keyof typeof importanceIcons]
:importanceIcons.normal
return (
<div className="flex items-center">
<ImportanceIcon />
<span className="ml-2 capitalize">{importance || "Normal"}</span>
</div>
)
}
},
{
accessorKey:"createdDateTime",
header:({column}) => (
<DataTableColumnHeader column={column} title="Created" />
),
cell:({row}) => {
constcreatedDateTime = row.getValue("createdDateTime") as
| string
| undefined
return (
<span>
{createdDateTime
? new Date(createdDateTime).toLocaleDateString()
:"N/A"}
</span>
)
}
},
{
id:"actions",
cell:({row}) => <DataTableRowActions row={row} />
}
]

// File: app/[locale]/protected/tasks/components/data-table-column-header.tsx
import{
ArrowDownIcon,
ArrowUpIcon,
CaretSortIcon,
EyeNoneIcon
}from "@radix-ui/react-icons"
import{Column}from "@tanstack/react-table"
import{cn}from "@/lib/utils"
import{Button}from "@/components/ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger
}from "@/components/ui/dropdown-menu"
interfaceDataTableColumnHeaderProps<TData,TValue>
extends React.HTMLAttributes<HTMLDivElement> {
column:Column<TData,TValue>
title:string
}
export function DataTableColumnHeader<TData,TValue>({
column,
title,
className
}:DataTableColumnHeaderProps<TData,TValue>) {
if (!column.getCanSort()) {
return <div className={cn(className)}>{title}</div>
}
return (
<div className={cn("flex items-center space-x-2",className)}>
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button
variant="ghost"
size="sm"
className="data-[state=open]:bg-accent -ml-3 h-8"
>
<span>{title}</span>
{column.getIsSorted() === "desc" ? (
<ArrowDownIcon className="ml-2 size-4" />
) :column.getIsSorted() === "asc" ? (
<ArrowUpIcon className="ml-2 size-4" />
) :(
<CaretSortIcon className="ml-2 size-4" />
)}
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="start">
<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
<ArrowUpIcon className="text-muted-foreground/70 mr-2 size-3.5" />
Asc
</DropdownMenuItem>
<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
<ArrowDownIcon className="text-muted-foreground/70 mr-2 size-3.5" />
Desc
</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
<EyeNoneIcon className="text-muted-foreground/70 mr-2 size-3.5" />
Hide
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</div>
)
}

// File: app/[locale]/protected/tasks/components/data-table-faceted-filter.tsx
import * as React from "react"
import{CheckIcon,PlusCircledIcon}from "@radix-ui/react-icons"
import{Column}from "@tanstack/react-table"
import{cn}from "@/lib/utils"
import{Badge}from "@/components/ui/badge"
import{Button}from "@/components/ui/button"
import{
Command,
CommandEmpty,
CommandGroup,
CommandInput,
CommandItem,
CommandList,
CommandSeparator
}from "@/components/ui/command"
import{
Popover,
PopoverContent,
PopoverTrigger
}from "@/components/ui/popover"
import{Separator}from "@/components/ui/separator"
interfaceDataTableFacetedFilterProps<TData,TValue> {
column?:Column<TData,TValue>
title?:string
options:{
label:string
value:string
icon?:React.ComponentType<{className?:string}>
}[]
}
export function DataTableFacetedFilter<TData,TValue>({
column,
title,
options
}:DataTableFacetedFilterProps<TData,TValue>) {
constfacets = column?.getFacetedUniqueValues()
constselectedValues = new Set(column?.getFilterValue() as string[])
return (
<Popover>
<PopoverTrigger asChild>
<Button variant="outline" size="sm" className="h-8 border-dashed">
<PlusCircledIcon className="mr-2 size-4" />
{title}
{selectedValues?.size > 0 && (
<>
<Separator orientation="vertical" className="mx-2 h-4" />
<Badge
variant="secondary"
className="rounded-sm px-1 font-normal lg:hidden"
>
{selectedValues.size}
</Badge>
<div className="hidden space-x-1 lg:flex">
{selectedValues.size > 2 ? (
<Badge
variant="secondary"
className="rounded-sm px-1 font-normal"
>
{selectedValues.size} selected
</Badge>
) :(
options
.filter(option => selectedValues.has(option.value))
.map(option => (
<Badge
variant="secondary"
key={option.value}
className="rounded-sm px-1 font-normal"
>
{option.label}
</Badge>
))
)}
</div>
</>
)}
</Button>
</PopoverTrigger>
<PopoverContent className="w-[200px] p-0" align="start">
<Command>
<CommandInput placeholder={title} />
<CommandList>
<CommandEmpty>No results found.</CommandEmpty>
<CommandGroup>
{options.map(option => {
constisSelected = selectedValues.has(option.value)
return (
<CommandItem
key={option.value}
onSelect={() => {
if (isSelected) {
selectedValues.delete(option.value)
} else {
selectedValues.add(option.value)
}
constfilterValues = Array.from(selectedValues)
column?.setFilterValue(
filterValues.length ? filterValues :undefined
)
}}
>
<div
className={cn(
"border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
isSelected
? "bg-primary text-primary-foreground"
:"opacity-50 [&_svg]:invisible"
)}
>
<CheckIcon className={cn("size-4")} />
</div>
{option.icon && (
<option.icon className="text-muted-foreground mr-2 size-4" />
)}
<span>{option.label}</span>
{facets?.get(option.value) && (
<span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
{facets.get(option.value)}
</span>
)}
</CommandItem>
)
})}
</CommandGroup>
{selectedValues.size > 0 && (
<>
<CommandSeparator />
<CommandGroup>
<CommandItem
onSelect={() => column?.setFilterValue(undefined)}
className="justify-center text-center"
>
Clear filters
</CommandItem>
</CommandGroup>
</>
)}
</CommandList>
</Command>
</PopoverContent>
</Popover>
)
}

// File: app/[locale]/protected/tasks/components/data-table-pagination.tsx
import{
ChevronLeftIcon,
ChevronRightIcon,
DoubleArrowLeftIcon,
DoubleArrowRightIcon
}from "@radix-ui/react-icons"
import{Table}from "@tanstack/react-table"
import{Button}from "@/components/ui/button"
import{
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue
}from "@/components/ui/select"
interfaceDataTablePaginationProps<TData> {
table:Table<TData>
}
export function DataTablePagination<TData>({
table
}:DataTablePaginationProps<TData>) {
return (
<div className="flex items-center justify-between px-2">
<div className="text-muted-foreground flex-1 text-sm">
{table.getFilteredSelectedRowModel().rows.length} of{" "}
{table.getFilteredRowModel().rows.length} row(s) selected.
</div>
<div className="flex items-center space-x-6 lg:space-x-8">
<div className="flex items-center space-x-2">
<p className="text-sm font-medium">Rows per page</p>
<Select
value={`${table.getState().pagination.pageSize}`}
onValueChange={value => {
table.setPageSize(Number(value))
}}
>
<SelectTrigger className="h-8 w-[70px]">
<SelectValue placeholder={table.getState().pagination.pageSize} />
</SelectTrigger>
<SelectContent side="top">
{[10,20,30,40,50].map(pageSize => (
<SelectItem key={pageSize} value={`${pageSize}`}>
{pageSize}
</SelectItem>
))}
</SelectContent>
</Select>
</div>
<div className="flex w-[100px] items-center justify-center text-sm font-medium">
Page {table.getState().pagination.pageIndex + 1} of{" "}
{table.getPageCount()}
</div>
<div className="flex items-center space-x-2">
<Button
variant="outline"
className="hidden size-8 p-0 lg:flex"
onClick={() => table.setPageIndex(0)}
disabled={!table.getCanPreviousPage()}
>
<span className="sr-only">Go to first page</span>
<DoubleArrowLeftIcon className="size-4" />
</Button>
<Button
variant="outline"
className="size-8 p-0"
onClick={() => table.previousPage()}
disabled={!table.getCanPreviousPage()}
>
<span className="sr-only">Go to previous page</span>
<ChevronLeftIcon className="size-4" />
</Button>
<Button
variant="outline"
className="size-8 p-0"
onClick={() => table.nextPage()}
disabled={!table.getCanNextPage()}
>
<span className="sr-only">Go to next page</span>
<ChevronRightIcon className="size-4" />
</Button>
<Button
variant="outline"
className="hidden size-8 p-0 lg:flex"
onClick={() => table.setPageIndex(table.getPageCount() - 1)}
disabled={!table.getCanNextPage()}
>
<span className="sr-only">Go to last page</span>
<DoubleArrowRightIcon className="size-4" />
</Button>
</div>
</div>
</div>
)
}

// File: app/[locale]/protected/tasks/components/data-table-row-actions.tsx
import{DotsHorizontalIcon}from "@radix-ui/react-icons"
import{Row}from "@tanstack/react-table"
import{TodoTask}from "@microsoft/microsoft-graph-types"
import{Button}from "@/components/ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuRadioGroup,
DropdownMenuRadioItem,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuSub,
DropdownMenuSubContent,
DropdownMenuSubTrigger,
DropdownMenuTrigger
}from "@/components/ui/dropdown-menu"
interfaceDataTableRowActionsProps {
row:Row<TodoTask>
}
export function DataTableRowActions({row}:DataTableRowActionsProps) {
consttask = row.original
return (
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button
variant="ghost"
className="data-[state=open]:bg-muted flex size-8 p-0"
>
<DotsHorizontalIcon className="size-4" />
<span className="sr-only">Open menu</span>
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end" className="w-[160px]">
<DropdownMenuItem>Edit</DropdownMenuItem>
<DropdownMenuItem>Make a copy</DropdownMenuItem>
<DropdownMenuItem>Favorite</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuSub>
<DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
<DropdownMenuSubContent>
<DropdownMenuRadioGroup value={task.status}>
<DropdownMenuRadioItem value="notStarted">
Not started
</DropdownMenuRadioItem>
<DropdownMenuRadioItem value="inProgress">
In progress
</DropdownMenuRadioItem>
<DropdownMenuRadioItem value="completed">
Completed
</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
</DropdownMenuSubContent>
</DropdownMenuSub>
<DropdownMenuSeparator />
<DropdownMenuItem>
Delete
<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
)
}

// File: app/[locale]/protected/tasks/components/data-table-toolbar.tsx
import * as React from "react"
import{Table}from "@tanstack/react-table"
import{Button}from "@/components/ui/button"
import{Input}from "@/components/ui/input"
import{DataTableViewOptions}from "./data-table-view-options"
import{TodoTask}from "@microsoft/microsoft-graph-types"
interfaceDataTableToolbarProps {
table:Table<TodoTask>
onAddTask:(title:string) => Promise<void>
onDeleteTasks:() => Promise<void>
}
export function DataTableToolbar({
table,
onAddTask,
onDeleteTasks
}:DataTableToolbarProps) {
const[newTaskTitle,setNewTaskTitle] = React.useState("")
consthandleAddTask = () => {
if (newTaskTitle.trim()) {
onAddTask(newTaskTitle.trim())
setNewTaskTitle("")
}
}
return (
<div className="flex items-center justify-between">
<div className="flex flex-1 items-center space-x-2">
<Input
placeholder="Filter tasks..."
value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
onChange={event =>
table.getColumn("title")?.setFilterValue(event.target.value)
}
className="h-8 w-[150px] lg:w-[250px]"
/>
<Input
placeholder="New task title"
value={newTaskTitle}
onChange={e => setNewTaskTitle(e.target.value)}
className="h-8 w-[200px] lg:w-[300px]"
/>
<Button onClick={handleAddTask} size="sm">
Add Task
</Button>
<Button onClick={onDeleteTasks} size="sm" variant="destructive">
Delete Selected
</Button>
</div>
<DataTableViewOptions table={table} />
</div>
)
}

// File: app/[locale]/protected/tasks/components/data-table-view-options.tsx
"use client"
import{DropdownMenuTrigger}from "@radix-ui/react-dropdown-menu"
import{MixerHorizontalIcon}from "@radix-ui/react-icons"
import{Table}from "@tanstack/react-table"
import{Button}from "@/components/ui/button"
import{
DropdownMenu,
DropdownMenuCheckboxItem,
DropdownMenuContent,
DropdownMenuLabel,
DropdownMenuSeparator
}from "@/components/ui/dropdown-menu"
interfaceDataTableViewOptionsProps<TData> {
table:Table<TData>
}
export function DataTableViewOptions<TData>({
table
}:DataTableViewOptionsProps<TData>) {
return (
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button
variant="outline"
size="sm"
className="ml-auto hidden h-8 lg:flex"
>
<MixerHorizontalIcon className="mr-2 size-4" />
View
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end" className="w-[150px]">
<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
<DropdownMenuSeparator />
{table
.getAllColumns()
.filter(
column =>
typeof column.accessorFn !== "undefined" && column.getCanHide()
)
.map(column => {
return (
<DropdownMenuCheckboxItem
key={column.id}
className="capitalize"
checked={column.getIsVisible()}
onCheckedChange={value => column.toggleVisibility(!!value)}
>
{column.id}
</DropdownMenuCheckboxItem>
)
})}
</DropdownMenuContent>
</DropdownMenu>
)
}

// File: app/[locale]/protected/tasks/components/data-table.tsx
import React from "react"
import{
ColumnDef,
ColumnFiltersState,
SortingState,
VisibilityState,
flexRender,
getCoreRowModel,
getFilteredRowModel,
getPaginationRowModel,
getSortedRowModel,
useReactTable
}from "@tanstack/react-table"
import{TodoTask}from "@microsoft/microsoft-graph-types"
import{
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
}from "@/components/ui/table"
import{DataTablePagination}from "./data-table-pagination"
import{DataTableViewOptions}from "./data-table-view-options"
import{addTasks,deleteTasks}from "../actions"
import{useOptimistic}from "react"
import{OptimisticTask}from "../types"
import{Button}from "@/components/ui/button"
import{Input}from "@/components/ui/input"
interfaceDataTableProps {
columns:ColumnDef<TodoTask>[]
data:OptimisticTask[]
initialTasks:OptimisticTask[]
listId?:string
}
export function DataTable({
columns,
data = [],
initialTasks = [],
listId
}:DataTableProps) {
const[sorting,setSorting] = React.useState<SortingState>([])
const[columnFilters,setColumnFilters] = React.useState<ColumnFiltersState>(
[]
)
const[columnVisibility,setColumnVisibility] =
React.useState<VisibilityState>({})
const[rowSelection,setRowSelection] = React.useState({})
const[tasks,setTasks] = React.useState(initialTasks)
const[isPending,startTransition] = React.useTransition()
const[newTaskTitle,setNewTaskTitle] = React.useState("")
const[optimisticTasks,addOptimisticTask] = useOptimistic(
tasks,
(state:OptimisticTask[],newTask:OptimisticTask) => [...state,newTask]
)
consttable = useReactTable({
data:data || [],
columns,
getCoreRowModel:getCoreRowModel(),
getPaginationRowModel:getPaginationRowModel(),
onSortingChange:setSorting,
getSortedRowModel:getSortedRowModel(),
onColumnFiltersChange:setColumnFilters,
getFilteredRowModel:getFilteredRowModel(),
onColumnVisibilityChange:setColumnVisibility,
onRowSelectionChange:setRowSelection,
state:{
sorting,
columnFilters,
columnVisibility,
rowSelection
}
})
async function formAction(formData:FormData) {
constnewTaskTitle = formData.get("item") as string
if (!newTaskTitle.trim() || !listId) return
constnewTask:OptimisticTask = {
id:Date.now().toString(),
title:newTaskTitle,
status:"notStarted",
sending:true
}
addOptimisticTask(newTask)
startTransition(async () => {
try {
constaddedTask = await addTasks(listId,[newTaskTitle])
setTasks(currentTasks => [
...currentTasks,
{...newTask,id:addedTask[0].id,sending:false}
])
setNewTaskTitle("")
} catch (error) {
console.error("Failed to add task:",error)
setTasks(currentTasks =>
currentTasks.filter(task => task.id !== newTask.id)
)
}
})
}
async function handleDeleteTasks() {
if (!listId) return
constselectedRows = table.getFilteredSelectedRowModel().rows
consttasksToDelete = selectedRows
.map(row => row.original.id)
.filter((id):id is string => id !== undefined)
setTasks(currentTasks =>
currentTasks.filter(task => task.id && !tasksToDelete.includes(task.id))
)
try {
await deleteTasks(listId,tasksToDelete)
table.toggleAllRowsSelected(false)
} catch (error) {
console.error("Failed to delete tasks:",error)
setTasks(initialTasks)
}
}
return (
<div className="space-y-4">
<div className="flex items-center justify-between">
<div className="flex flex-1 items-center space-x-2">
<Input
placeholder="Filter tasks..."
value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
onChange={event =>
table.getColumn("title")?.setFilterValue(event.target.value)
}
className="h-8 w-[150px] lg:w-[250px]"
/>
<form action={formAction} className="flex items-center gap-2">
<div className="grow">
<Input
type="text"
name="item"
placeholder="Make a video ... "
className="w-full"
/>
</div>
<Button type="submit" size="sm" disabled={isPending || !listId}>
Add Task
</Button>
</form>
<form action={handleDeleteTasks} className="flex items-center gap-2">
<Button type="submit" size="sm" disabled={isPending || !listId}>
Delete
</Button>
</form>
</div>
<DataTableViewOptions table={table} />
</div>
<div className="rounded-md border">
<Table>
<TableHeader>
{table.getHeaderGroups().map(headerGroup => (
<TableRow key={headerGroup.id}>
{headerGroup.headers.map(header => (
<TableHead key={header.id}>
{header.isPlaceholder
? null
:flexRender(
header.column.columnDef.header,
header.getContext()
)}
</TableHead>
))}
</TableRow>
))}
</TableHeader>
<TableBody>
{table.getRowModel().rows?.length ? (
table.getRowModel().rows.map(row => (
<TableRow
key={row.id}
data-state={row.getIsSelected() && "selected"}
>
{row.getVisibleCells().map(cell => (
<TableCell key={cell.id}>
{flexRender(
cell.column.columnDef.cell,
cell.getContext()
)}
</TableCell>
))}
</TableRow>
))
) :(
<TableRow>
<TableCell
colSpan={columns.length}
className="h-24 text-center"
>
No results.
</TableCell>
</TableRow>
)}
</TableBody>
</Table>
</div>
<DataTablePagination table={table} />
</div>
)
}

// File: app/[locale]/protected/tasks/components/user-nav.tsx
import{Avatar,AvatarFallback,AvatarImage}from "@/components/ui/avatar"
import{Button}from "@/components/ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuTrigger
}from "@/components/ui/dropdown-menu"
export function UserNav() {
return (
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button variant="ghost" className="relative size-8 rounded-full">
<Avatar className="size-9">
<AvatarImage src="/avatars/03.png" alt="@shadcn" />
<AvatarFallback>SC</AvatarFallback>
</Avatar>
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent className="w-56" align="end" forceMount>
<DropdownMenuLabel className="font-normal">
<div className="flex flex-col space-y-1">
<p className="text-sm font-medium leading-none">shadcn</p>
<p className="text-muted-foreground text-xs leading-none">
m@example.com
</p>
</div>
</DropdownMenuLabel>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
Profile
<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
Billing
<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
Settings
<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>New Team</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuItem>
Log out
<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
)
}

// File: app/[locale]/protected/tasks/data-table.tsx
"use client"
import * as React from "react"
import{
ColumnDef,
ColumnFiltersState,
SortingState,
VisibilityState,
flexRender,
getCoreRowModel,
getFilteredRowModel,
getPaginationRowModel,
getSortedRowModel,
useReactTable
}from "@tanstack/react-table"
import{TodoTask}from "@microsoft/microsoft-graph-types"
import{
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
}from "@/components/ui/table"
import{DataTablePagination}from "./components/data-table-pagination"
import{DataTableViewOptions}from "./components/data-table-view-options"
import{addTasks,deleteTasks}from "./actions"
import{useOptimistic}from "react"
import{OptimisticTask}from "./types"
import{Button}from "@/components/ui/button"
import{Input}from "@/components/ui/input"
interfaceDataTableProps {
columns:ColumnDef<OptimisticTask>[]
data:OptimisticTask[]
initialTasks:OptimisticTask[]
listId?:string
}
export function DataTable({
columns,
data = [],
initialTasks = [],
listId
}:DataTableProps) {
const[sorting,setSorting] = React.useState<SortingState>([])
const[columnFilters,setColumnFilters] = React.useState<ColumnFiltersState>(
[]
)
const[columnVisibility,setColumnVisibility] =
React.useState<VisibilityState>({})
const[rowSelection,setRowSelection] = React.useState({})
const[tasks,setTasks] = React.useState(initialTasks)
const[isPending,startTransition] = React.useTransition()
const[optimisticTasks,addOptimisticTask] = useOptimistic(
tasks,
(state:OptimisticTask[],newTask:OptimisticTask) => [...state,newTask]
)
consttable = useReactTable({
data:optimisticTasks,
columns,
getCoreRowModel:getCoreRowModel(),
getPaginationRowModel:getPaginationRowModel(),
onSortingChange:setSorting,
getSortedRowModel:getSortedRowModel(),
onColumnFiltersChange:setColumnFilters,
getFilteredRowModel:getFilteredRowModel(),
onColumnVisibilityChange:setColumnVisibility,
onRowSelectionChange:setRowSelection,
state:{
sorting,
columnFilters,
columnVisibility,
rowSelection
}
})
async function formAction(formData:FormData) {
constnewTaskTitle = formData.get("item") as string
if (!newTaskTitle.trim() || !listId) return
constnewTask:OptimisticTask = {
id:Date.now().toString(),
title:newTaskTitle,
status:"notStarted",
sending:true
}
addOptimisticTask(newTask)
startTransition(async () => {
try {
constaddedTasks = await addTasks(listId,[newTaskTitle])
setTasks(currentTasks => [
...currentTasks,
{...newTask,id:addedTasks[0].id,sending:false}
])
} catch (error) {
console.error("Failed to add task:",error)
setTasks(currentTasks =>
currentTasks.filter(task => task.id !== newTask.id)
)
}
})
}
async function handleDeleteTasks() {
if (!listId) return
constselectedRows = table.getFilteredSelectedRowModel().rows
consttasksToDelete = selectedRows
.map(row => row.original.id)
.filter((id):id is string => typeof id === "string")
setTasks(currentTasks =>
currentTasks.filter(task => task.id && !tasksToDelete.includes(task.id))
)
try {
await deleteTasks(listId,tasksToDelete)
table.toggleAllRowsSelected(false)
} catch (error) {
console.error("Failed to delete tasks:",error)
setTasks(initialTasks)
}
}
return (
<div className="space-y-4">
<div className="flex items-center justify-between">
<div className="flex flex-1 items-center space-x-2">
<Input
placeholder="Filter tasks..."
value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
onChange={event =>
table.getColumn("title")?.setFilterValue(event.target.value)
}
className="h-8 w-[150px] lg:w-[250px]"
/>
<form action={formAction} className="flex items-center gap-2">
<div className="grow">
<Input
type="text"
name="item"
placeholder="Make a video ... "
className="w-full"
/>
</div>
<Button type="submit" size="sm" disabled={isPending || !listId}>
Add Task
</Button>
</form>
<Button
onClick={handleDeleteTasks}
size="sm"
disabled={isPending || !listId}
>
Delete
</Button>
</div>
<DataTableViewOptions table={table} />
</div>
<div className="rounded-md border">
<Table>
<TableHeader>
{table.getHeaderGroups().map(headerGroup => (
<TableRow key={headerGroup.id}>
{headerGroup.headers.map(header => (
<TableHead key={header.id}>
{header.isPlaceholder
? null
:flexRender(
header.column.columnDef.header,
header.getContext()
)}
</TableHead>
))}
</TableRow>
))}
</TableHeader>
<TableBody>
{table.getRowModel().rows?.length ? (
table.getRowModel().rows.map(row => (
<TableRow
key={row.id}
data-state={row.getIsSelected() && "selected"}
>
{row.getVisibleCells().map(cell => (
<TableCell key={cell.id}>
{flexRender(
cell.column.columnDef.cell,
cell.getContext()
)}
</TableCell>
))}
</TableRow>
))
) :(
<TableRow>
<TableCell
colSpan={columns.length}
className="h-24 text-center"
>
No results.
</TableCell>
</TableRow>
)}
</TableBody>
</Table>
</div>
<DataTablePagination table={table} />
</div>
)
}

// File: app/[locale]/protected/tasks/error.tsx
"use client"
import{Card,CardContent}from "@/components/ui/card"
import{Button}from "@/components/ui/button"
import{acquireTasksTokenInteractive}from "../actions/auth"
export default function Error({
error
}:{
error:Error & {digest?:string}
}) {
if (error.message === "InteractionRequiredAuthError") {
return (
<Card>
<CardContent className="p-6">
<h2 className="mb-4 text-xl font-semibold">
Please consent to see your task events.
</h2>
<form action={acquireTasksTokenInteractive}>
<Button type="submit" className="w-full">
Consent task permissions
</Button>
</form>
</CardContent>
</Card>
)
}
return (
<Card>
<CardContent className="space-y-4 p-6">
<h2 className="text-xl font-semibold">
An error occurred while getting tasks.
</h2>
<p>{error.message}</p>
</CardContent>
</Card>
)
}

// File: app/[locale]/protected/tasks/layout.tsx
import React from "react"
import{getLists}from "./actions"
import{TodoTaskList}from "@microsoft/microsoft-graph-types"
export default async function TasksLayout({
children
}:{
children:React.ReactNode
}) {
constlists:TodoTaskList[] = await getLists()
return (
<div className="container mx-auto py-10">
<h1 className="mb-5 text-2xl font-bold">Tasks</h1>
{children}
</div>
)
}

// File: app/[locale]/protected/tasks/page.tsx
import React from "react"
import{TaskComboboxForm}from "./tasks-combobox-form"
import{DataTable}from "./data-table"
import{columns}from "./columns"
import{getTasks,getLists}from "./actions"
import{TodoTask,TodoTaskList}from "@microsoft/microsoft-graph-types"
import{Alert,AlertDescription,AlertTitle}from "@/components/ui/alert"
import{AlertCircle}from "lucide-react"
export default async function TasksPage() {
letlists:TodoTaskList[] = []
lettasks:TodoTask[] = []
leterror:Error | null = null
try {
lists = await getLists()
} catch (e) {
console.error("Error fetching lists:",e)
error =
e instanceof Error
? e
:new Error("Unknown error occurred while fetching lists")
}
if (!error && lists.length > 0) {
constdefaultListId = lists[0].id
if (defaultListId) {
try {
tasks = await getTasks(defaultListId)
} catch (e) {
console.error("Error fetching tasks:",e)
error =
e instanceof Error
? e
:new Error("Unknown error occurred while fetching tasks")
}
} else {
error = new Error("Default list ID is undefined")
}
} else if (!error) {
error = new Error("No lists available")
}
return (
<div className="container mx-auto py-10">
<h1 className="mb-5 text-2xl font-bold">Tasks</h1>
<TaskComboboxForm lists={lists} />
<div className="mt-6">
{error ? (
<Alert variant="destructive">
<AlertCircle className="size-4" />
<AlertTitle>Error</AlertTitle>
<AlertDescription>
{error.message}
{error.stack && (
<details>
<summary>Error Details</summary>
<pre>{error.stack}</pre>
</details>
)}
</AlertDescription>
</Alert>
) :(
<DataTable
columns={columns}
data={tasks}
initialTasks={tasks}
listId={lists[0]?.id}
/>
)}
</div>
</div>
)
}

// File: app/[locale]/protected/tasks/taskTypes.ts
import{TodoTask}from "@microsoft/microsoft-graph-types"
export typeTask = TodoTask
export interfaceTasksResponse {
value:Task[]
}

// File: app/[locale]/protected/tasks/tasks-combobox-form.tsx
"use client"
import * as React from "react"
import{Check,ChevronsUpDown}from "lucide-react"
import{cn}from "@/lib/utils"
import{Button}from "@/components/ui/button"
import{
Command,
CommandEmpty,
CommandGroup,
CommandInput,
CommandItem,
CommandList
}from "@/components/ui/command"
import{
Popover,
PopoverContent,
PopoverTrigger
}from "@/components/ui/popover"
import{TodoTaskList}from "@microsoft/microsoft-graph-types"
import{useRouter,useParams}from "next/navigation"
interfaceTaskComboboxFormProps {
lists:TodoTaskList[]
}
export function TaskComboboxForm({lists}:TaskComboboxFormProps) {
const[open,setOpen] = React.useState(false)
constrouter = useRouter()
constparams = useParams()
constcurrentListId = (params.listId as string) || lists[0]?.id || ""
const[value,setValue] = React.useState(currentListId)
constonListSelect = (listId:string) => {
if (listId) {
setValue(listId)
setOpen(false)
router.push(`/protected/tasks/${listId}`)
}
}
if (!lists || lists.length === 0) {
return <Button disabled>No lists available</Button>
}
return (
<Popover open={open} onOpenChange={setOpen}>
<PopoverTrigger asChild>
<Button
variant="outline"
role="combobox"
aria-expanded={open}
className="w-[200px] justify-between"
>
{value
? lists.find(list => list.id === value)?.displayName ||
"Select list..."
:"Select list..."}
<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
</Button>
</PopoverTrigger>
<PopoverContent className="w-[200px] p-0">
<Command>
<CommandInput placeholder="Search list..." />
<CommandList>
<CommandEmpty>No list found.</CommandEmpty>
<CommandGroup>
{lists.map(list => (
<CommandItem
key={list.id}
value={list.id}
onSelect={(selectedValue:string) => {
if (list.id) {
onListSelect(list.id)
}
}}
>
<Check
className={cn(
"mr-2 size-4",
value === list.id ? "opacity-100" :"opacity-0"
)}
/>
{list.displayName}
</CommandItem>
))}
</CommandGroup>
</CommandList>
</Command>
</PopoverContent>
</Popover>
)
}

// File: app/[locale]/protected/tasks/types/index.ts
import{TodoTask}from "@microsoft/microsoft-graph-types"
export interfaceSearchParams {
[key:string]:string | string[] | undefined
}
export interfaceOption {
label:string
value:string
icon?:React.ComponentType<{className?:string}>
withCount?:boolean
}
export interfaceDataTableFilterField<TData> {
label:string
value:keyof TData
placeholder?:string
options?:Option[]
}
export interfaceDataTableFilterOption<TData> {
id:string
label:string
value:keyof TData
options:Option[]
filterValues?:string[]
filterOperator?:string
isMulti?:boolean
}
export interfaceOptimisticTask extends TodoTask {
sending?:boolean
}
export interfaceMail {
id:string
name:string
email:string
subject:string
text:string
date:string
read:boolean
labels:string[]
}

// File: app/[locale]/protected/tasks/utils.ts


// File: app/[locale]/protected/token-info/page.tsx
import{authProvider}from "../services/auth"
import{
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle
}from "@/components/ui/card"
import{
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
}from "@/components/ui/table"
import{ScrollArea}from "@/components/ui/scroll-area"
import{Badge}from "@/components/ui/badge"
import{CopyButton}from "../components/CopyButton"
interfaceTokenClaim {
claim:string
value:string
description:string
}
function createClaimsTable(claims:Record<string,any>):TokenClaim[] {
constclaimsArray:TokenClaim[] = []
constpopulateClaim = (claim:string,value:string,description:string) => {
claimsArray.push({claim,value,description})
}
constchangeDateFormat = (date:number):string => {
constdateObj = new Date(date * 1000)
return `${date} - [${dateObj.toString()}]`
}
Object.entries(claims).forEach(([key,value]) => {
if (typeof value !== "string" && typeof value !== "number") return
switch (key) {
case "aud":
populateClaim(
key,
String(value),
"Identifies the intended recipient of the token. In ID tokens,the audience is your app's Application ID,assigned to your app in the Azure portal."
)
break
case "iss":
populateClaim(
key,
String(value),
"Identifies the issuer,or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated."
)
break
case "iat":
populateClaim(
key,
changeDateFormat(Number(value)),
'"Issued At" indicates the timestamp when the authentication for this user occurred.'
)
break
case "nbf":
populateClaim(
key,
changeDateFormat(Number(value)),
'The "not before" claim dictates the time before which the JWT must not be accepted for processing.'
)
break
case "exp":
populateClaim(
key,
changeDateFormat(Number(value)),
"The expiration time claim dictates the expiration time on or after which the JWT must not be accepted for processing."
)
break
case "name":
populateClaim(
key,
String(value),
"The name claim provides a human-readable value that identifies the subject of the token."
)
break
case "preferred_username":
populateClaim(
key,
String(value),
"The primary username that represents the user. It could be an email address,phone number,or a generic username without a specified format."
)
break
case "oid":
populateClaim(
key,
String(value),
"The user's object id is the only claim that should be used to uniquely identify a user in an Azure AD tenant."
)
break
case "tid":
populateClaim(
key,
String(value),
"The id of the tenant where this app resides."
)
break
case "sub":
populateClaim(
key,
String(value),
"The subject claim is a pairwise identifier - it is unique to a particular application ID."
)
break
default:
populateClaim(key,String(value),"")
}
})
return claimsArray
}
function formatTimeAgo(timestamp:number):string {
constnow = Date.now()
constsecondsAgo = Math.floor((now - timestamp * 1000) / 1000)
if (secondsAgo < 60) return `${secondsAgo} seconds ago`
if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`
if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`
return `${Math.floor(secondsAgo / 86400)} days ago`
}
function formatTimeUntil(timestamp:number):string {
constnow = Date.now()
constsecondsUntil = Math.floor((timestamp * 1000 - now) / 1000)
if (secondsUntil < 60) return `in ${secondsUntil} seconds`
if (secondsUntil < 3600) return `in ${Math.floor(secondsUntil / 60)} minutes`
if (secondsUntil < 86400) return `in ${Math.floor(secondsUntil / 3600)} hours`
return `in ${Math.floor(secondsUntil / 86400)} days`
}
async function getTokenInfo() {
const{account,instance} = await authProvider.authenticate()
if (!account) {
return null
}
consttokenClaims = createClaimsTable(account.idTokenClaims || {})
constgraphToken = await instance.acquireTokenSilent({
account,
scopes:["User.Read"]
})
return {
tokenClaims,
graphToken,
issuedAt:account.idTokenClaims?.iat as number
}
}
export default async function TokenInfoPage() {
consttokenInfo = await getTokenInfo()
if (!tokenInfo) {
return <div>No account information available.</div>
}
constexpiresOn = tokenInfo.graphToken.expiresOn
? new Date(tokenInfo.graphToken.expiresOn).toLocaleString()
:"Not available"
constexpiresInFormatted = tokenInfo.graphToken.expiresOn
? formatTimeUntil(Math.floor(Number(tokenInfo.graphToken.expiresOn) / 1000))
:"Unknown"
constissuedAtFormatted = tokenInfo.issuedAt
? new Date(tokenInfo.issuedAt * 1000).toLocaleString()
:"Not available"
consttimeAgo = tokenInfo.issuedAt
? formatTimeAgo(tokenInfo.issuedAt)
:"Unknown"
return (
<div className="container mx-auto space-y-6 p-4">
<Card>
<CardHeader>
<CardTitle>Microsoft Graph API Token</CardTitle>
<CardDescription>
Information about the acquired access token for Microsoft Graph API
</CardDescription>
</CardHeader>
<CardContent>
<div className="space-y-2">
<p>
<strong>Scopes:</strong>{" "}
{tokenInfo.graphToken.scopes.map(scope => (
<Badge key={scope} variant="secondary" className="mr-1">
{scope}
</Badge>
))}
</p>
<p>
<strong>Token Type:</strong> {tokenInfo.graphToken.tokenType}
</p>
<p>
<strong>Issued At:</strong> {issuedAtFormatted} ({timeAgo})
</p>
<p>
<strong>Expires:</strong> {expiresOn} ({expiresInFormatted})
</p>
</div>
</CardContent>
</Card>
<Card>
<CardHeader>
<CardTitle>ID Token Claims</CardTitle>
<CardDescription>
Claims in your ID token. For more information,visit:{" "}
<a
href="https:
className="text-blue-500 hover:underline"
>
docs.microsoft.com
</a>
</CardDescription>
</CardHeader>
<CardContent>
<ScrollArea className="h-[800px] w-full rounded-md border">
<Table>
<TableHeader>
<TableRow>
<TableHead className="w-[100px]">Claim</TableHead>
<TableHead className="w-[200px]">Value</TableHead>
<TableHead>Description</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{tokenInfo.tokenClaims.map((claim,index) => (
<TableRow key={index}>
<TableCell className="font-medium">{claim.claim}</TableCell>
<TableCell className="font-mono text-sm">
<div className="flex items-center space-x-2">
<span className="truncate">{claim.value}</span>
<CopyButton value={claim.value} />
</div>
</TableCell>
<TableCell>{claim.description}</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</ScrollArea>
</CardContent>
</Card>
</div>
)
}

// File: app/[locale]/protected/utils/AuthProvider.ts
import{
AuthorizationCodePayload,
AuthorizationCodeRequest,
AuthorizationUrlRequest,
ConfidentialClientApplication,
Configuration,
CryptoProvider,
DistributedCachePlugin,
ICacheClient,
IPartitionManager,
ResponseMode
}from "@azure/msal-node"
import{cache}from "react"
export typePartitionManagerFactory = () => Promise<IPartitionManager>
typeAuthCodeRequestState = {
returnTo:string
request:Pick<
AuthorizationCodeRequest,
"correlationId" | "scopes" | "claims" | "azureCloudOptions"
>
}
/**
* Light wrapper for msal-node's ConfidentialClientApplication.
*/
export class AuthProvider {
configuration:Configuration
cacheClient:ICacheClient
partitionManagerFactory:PartitionManagerFactory
cryptoProvider:CryptoProvider
redirectUri:string
/**
* Initialize the AuthProvider.
* @param configuration The msal configuration object
* @param redirectUri Uri that authentication requests will redirect back to
* @param cacheClient The cache client used to store the token cache
* @param partitionManagerFactory Factory that returns a PartitionManager for the current executing context
*/
constructor(
configuration:Configuration,
redirectUri:string,
cacheClient:ICacheClient,
partitionManagerFactory:PartitionManagerFactory
) {
this.configuration = configuration
this.redirectUri = redirectUri
this.cacheClient = cacheClient
this.partitionManagerFactory = cache(partitionManagerFactory)
this.cryptoProvider = new CryptoProvider()
}
/**
* Get url for an auth code request
* @param request Authorization request to initialize the flow
* @param returnTo Where the user should be redirected to after a successful flow
* @returns The url to redirect the client to
*/
async getAuthCodeUrl(
request:Omit<AuthorizationUrlRequest,"redirectUri" | "responseMode">,
returnTo:string
) {
constinstance = await this.getInstance()
conststate:AuthCodeRequestState = {
request:{
correlationId:request.correlationId,
scopes:request.scopes,
claims:request.claims,
azureCloudOptions:request.azureCloudOptions
},
returnTo
}
constencodedState = this.cryptoProvider.base64Encode(JSON.stringify(state))
return await instance.getAuthCodeUrl({
...request,
responseMode:ResponseMode.FORM_POST,
redirectUri:this.redirectUri,
state:encodedState
})
}
/**
* Handles token acquisition based on the url that the user was sent to from Azure.
* @param url The return url from Azure
* @returns An object containing the logged in account,and where the user should be redirected to.
*/
async handleAuthCodeCallback(formData:FormData) {
constpayload = this.getAuthorizationCodePayload(formData)
constinstance = await this.getInstance()
conststate:AuthCodeRequestState = JSON.parse(
this.cryptoProvider.base64Decode(payload.state)
)
constauthResult = await instance.acquireTokenByCode(
{
...state.request,
redirectUri:this.redirectUri,
code:payload.code
},
payload
)
return {
account:authResult.account,
returnTo:state.returnTo
}
}
/**
* Authenticate a user.
* @returns The logged in account along with an instance that is configured with a partitioned cache.
* @remarks Can safely be called in multiple server components.
*/
authenticate = cache(async () => {
constpartitionManager = await this.partitionManagerFactory()
consthomeAccountId = await partitionManager.getKey()
constinstance = await this.getInstance()
constaccount = homeAccountId
? await instance.getTokenCache().getAccountByHomeId(homeAccountId)
:null
return {account,instance}
})
/**
* Get the current logged in account.
* @returns An account object if a user is logged in,or null if no user is logged in.
* @remarks Can safely be called in multiple server components.
* @remarks Prefer authenticate() in Server Actions and Route Handlers
*/
getAccount = cache(async () => {
constpartitionManager = await this.partitionManagerFactory()
consthomeAccountId = await partitionManager.getKey()
if (!homeAccountId) {
return null
}
constinstance = await this.getInstance()
return await instance.getTokenCache().getAccountByHomeId(homeAccountId)
})
/**
* Get an instance configured with a partitioned cache to the current logged in user.
* @returns A ConfidentialClientApplication instance
* @remarks Can safely be called in multiple server components.
* @remarks Prefer authenticate() in Server Actions and Route Handlers
*/
getInstance = cache(async () => {
constcachePlugin = new DistributedCachePlugin(
this.cacheClient,
await this.partitionManagerFactory()
)
constconfig = {
...this.configuration,
cache:{
cachePlugin
}
}
/**
* If the current msal configuration does not have cloudDiscoveryMetadata or authorityMetadata,we will
* make a request to the relevant endpoints to retrieve the metadata. This allows MSAL to avoid making
* metadata discovery calls,thereby improving performance of token acquisition process. For more,see:
* https:
*/
if (!config.auth.cloudDiscoveryMetadata || !config.auth.authorityMetadata) {
constmetadata = await this.getMetadata(
config.auth.clientId,
config.auth.authority ?? "https:
)
if (metadata) {
config.auth.cloudDiscoveryMetadata = metadata.cloudDiscoveryMetadata
config.auth.authorityMetadata = metadata.authorityMetadata
}
}
return new ConfidentialClientApplication(config)
})

private getAuthorizationCodePayload(formData:FormData) {

conststringEntries = Array.from(formData.entries()).filter(
([,value]) => typeof value === "string"
)
constdata = Object.fromEntries(stringEntries)
if (!("state" in data)) {
throw new Error("No state found in payload.")
}
if (!("code" in data)) {
throw new Error("No code found in payload.")
}
return data as Omit<AuthorizationCodePayload,"state"> &
Required<Pick<AuthorizationCodePayload,"state">>
}
/**
* Gets the cloud discovery metadata and authority metadata for the given authority
* @param clientId Application Client ID
* @param authority The authority configured for the application
* @returns The cloud discovery metadata and authority metadata
*/
private async getMetadata(clientId:string,authority:string) {
consttenantId = authority!.split("/").pop()!
try {
let[cloudDiscoveryMetadata,authorityMetadata] = await Promise.all([
this.cacheClient.get(`${clientId}.${tenantId}.discovery-metadata`),
this.cacheClient.get(`${clientId}.${tenantId}.authority-metadata`)
])
if (cloudDiscoveryMetadata && authorityMetadata) {
return {
cloudDiscoveryMetadata,
authorityMetadata
}
}
;[cloudDiscoveryMetadata,authorityMetadata] = await Promise.all([
AuthProvider.fetchCloudDiscoveryMetadata(tenantId),
AuthProvider.fetchOIDCMetadata(tenantId)
])
if (cloudDiscoveryMetadata && authorityMetadata) {
await this.cacheClient.set(
`${clientId}.${tenantId}.discovery-metadata`,
cloudDiscoveryMetadata
)
await this.cacheClient.set(
`${clientId}.${tenantId}.authority-metadata`,
authorityMetadata
)
}
return {
cloudDiscoveryMetadata,
authorityMetadata
}
} catch (error) {
console.log(error)
return null
}
}
/**
* Fetches the cloud discovery metadata for the given tenant ID
* @param tenantId The tenant ID
* @returns The cloud discovery metadata as a string
*/
private static async fetchCloudDiscoveryMetadata(tenantId:string) {
constendpoint = new URL(
"https:
)
endpoint.searchParams.set("api-version","1.1")
endpoint.searchParams.set(
"authorization_endpoint",
`https:
)
constresponse = await fetch(endpoint)
if (!response.ok) {
throw new Error("Could not fetch cloud discovery metadata from endpoint")
}
return await response.text()
}
/**
* Fetches the OIDC metadata for the given tenant ID
* @param tenantId The tenant ID
* @returns The OIDC metadata as a string
*/
private static async fetchOIDCMetadata(tenantId:string) {
constendpoint = `https:
constresponse = await fetch(endpoint)
if (!response.ok) {
throw new Error("Could not fetch OIDC metadata from endpoint")
}
return await response.text()
}
}

// File: app/[locale]/protected/utils/RedisCacheClient.ts
import type{ICacheClient}from "@azure/msal-node"
import type{RedisClientType}from "redis"
export default class RedisCacheClient<
RedisClient extends RedisClientType<any,any,any>
> implements ICacheClient
{
client:RedisClient
constructor(client:RedisClient) {
this.client = client
}
async get(key:string) {
if (!key) {
return ""
}
await this.ensureConnected()
constvalue = await this.client.get(key)
return value ?? ""
}
async set(key:string,value:string) {
if (!key) {
return value
}
await this.ensureConnected()
constcacheValue = await this.client.set(key,value)
if (!cacheValue) {
throw new Error("Couldn't set cache for key " + key)
}
return cacheValue
}
async ensureConnected() {
if (!this.client.isOpen) {
await this.client.connect()
}
}
}

// File: app/[locale]/protected/utils/SessionPartitionManager.ts
import type{AccountEntity}from "@azure/msal-common"
import type{IPartitionManager}from "@azure/msal-node"
import type{Session}from "@remix-run/node"
export class SessionPartitionManager implements IPartitionManager {
session:Session
constructor(session:Session) {
this.session = session
}
async getKey() {
consthomeAccountId = this.session.get("homeAccountId") || ""
return homeAccountId
}
async extractKey(accountEntity:AccountEntity) {
if (!accountEntity.homeAccountId) {
throw new Error("No homeAccountId found in accountEntity")
}
return accountEntity.homeAccountId
}
}

// File: app/[locale]/protected/utils/url.ts
import{headers}from "next/headers"

export function getCurrentUrl() {
constheadersList = headers()

consturl = headersList.get("x-url")

return (
url ||
`${headersList.get("x-forwarded-proto") || "http"}:
)
}

// File: app/[locale]/setup/page.tsx
"use client"
import{ChatbotUIContext}from "@/context/context"
import{getProfileByUserId,updateProfile}from "@/db/profile"
import{
getHomeWorkspaceByUserId,
getWorkspacesByUserId
}from "@/db/workspaces"
import{
fetchHostedModels,
fetchOpenRouterModels
}from "@/lib/models/fetch-models"
import{supabase}from "@/lib/supabase/browser-client"
import{TablesUpdate}from "@/supabase/types"
import{useRouter}from "next/navigation"
import{useContext,useEffect,useState}from "react"
import{APIStep}from "../../../components/setup/api-step"
import{FinishStep}from "../../../components/setup/finish-step"
import{ProfileStep}from "../../../components/setup/profile-step"
import{
SETUP_STEP_COUNT,
StepContainer
}from "../../../components/setup/step-container"
export default function SetupPage() {
const{
profile,
setProfile,
setWorkspaces,
setSelectedWorkspace,
setEnvKeyMap,
setAvailableHostedModels,
setAvailableOpenRouterModels
} = useContext(ChatbotUIContext)
constrouter = useRouter()
const[loading,setLoading] = useState(true)
const[currentStep,setCurrentStep] = useState(1)

const[displayName,setDisplayName] = useState("")
const[username,setUsername] = useState(profile?.username || "")
const[usernameAvailable,setUsernameAvailable] = useState(true)

const[useAzureOpenai,setUseAzureOpenai] = useState(false)
const[openaiAPIKey,setOpenaiAPIKey] = useState("")
const[openaiOrgID,setOpenaiOrgID] = useState("")
const[azureOpenaiAPIKey,setAzureOpenaiAPIKey] = useState("")
const[azureOpenaiEndpoint,setAzureOpenaiEndpoint] = useState("")
const[azureOpenai35TurboID,setAzureOpenai35TurboID] = useState("")
const[azureOpenai45TurboID,setAzureOpenai45TurboID] = useState("")
const[azureOpenai45VisionID,setAzureOpenai45VisionID] = useState("")
const[azureOpenaiEmbeddingsID,setAzureOpenaiEmbeddingsID] = useState("")
const[anthropicAPIKey,setAnthropicAPIKey] = useState("")
const[googleGeminiAPIKey,setGoogleGeminiAPIKey] = useState("")
const[mistralAPIKey,setMistralAPIKey] = useState("")
const[groqAPIKey,setGroqAPIKey] = useState("")
const[perplexityAPIKey,setPerplexityAPIKey] = useState("")
const[openrouterAPIKey,setOpenrouterAPIKey] = useState("")
useEffect(() => {
;(async () => {
constsession = (await supabase.auth.getSession()).data.session
if (!session) {
return router.push("/login")
} else {
constuser = session.user
constprofile = await getProfileByUserId(user.id)
setProfile(profile)
setUsername(profile.username)
if (!profile.has_onboarded) {
setLoading(false)
} else {
constdata = await fetchHostedModels(profile)
if (!data) return
setEnvKeyMap(data.envKeyMap)
setAvailableHostedModels(data.hostedModels)
if (profile["openrouter_api_key"] || data.envKeyMap["openrouter"]) {
constopenRouterModels = await fetchOpenRouterModels()
if (!openRouterModels) return
setAvailableOpenRouterModels(openRouterModels)
}
consthomeWorkspaceId = await getHomeWorkspaceByUserId(
session.user.id
)
return router.push(`/${homeWorkspaceId}/chat`)
}
}
})()
},[])
consthandleShouldProceed = (proceed:boolean) => {
if (proceed) {
if (currentStep === SETUP_STEP_COUNT) {
handleSaveSetupSetting()
} else {
setCurrentStep(currentStep + 1)
}
} else {
setCurrentStep(currentStep - 1)
}
}
consthandleSaveSetupSetting = async () => {
constsession = (await supabase.auth.getSession()).data.session
if (!session) {
return router.push("/login")
}
constuser = session.user
constprofile = await getProfileByUserId(user.id)
constupdateProfilePayload:TablesUpdate<"profiles"> = {
...profile,
has_onboarded:true,
display_name:displayName,
username,
openai_api_key:openaiAPIKey,
openai_organization_id:openaiOrgID,
anthropic_api_key:anthropicAPIKey,
google_gemini_api_key:googleGeminiAPIKey,
mistral_api_key:mistralAPIKey,
groq_api_key:groqAPIKey,
perplexity_api_key:perplexityAPIKey,
openrouter_api_key:openrouterAPIKey,
use_azure_openai:useAzureOpenai,
azure_openai_api_key:azureOpenaiAPIKey,
azure_openai_endpoint:azureOpenaiEndpoint,
azure_openai_35_turbo_id:azureOpenai35TurboID,
azure_openai_45_turbo_id:azureOpenai45TurboID,
azure_openai_45_vision_id:azureOpenai45VisionID,
azure_openai_embeddings_id:azureOpenaiEmbeddingsID
}
constupdatedProfile = await updateProfile(profile.id,updateProfilePayload)
setProfile(updatedProfile)
constworkspaces = await getWorkspacesByUserId(profile.user_id)
consthomeWorkspace = workspaces.find(w => w.is_home)

setSelectedWorkspace(homeWorkspace!)
setWorkspaces(workspaces)
return router.push(`/${homeWorkspace?.id}/chat`)
}
constrenderStep = (stepNum:number) => {
switch (stepNum) {

case 1:
return (
<StepContainer
stepDescription="Let's create your profile."
stepNum={currentStep}
stepTitle="Welcome to Chatbot UI"
onShouldProceed={handleShouldProceed}
showNextButton={!!(username && usernameAvailable)}
showBackButton={false}
>
<ProfileStep
username={username}
usernameAvailable={usernameAvailable}
displayName={displayName}
onUsernameAvailableChange={setUsernameAvailable}
onUsernameChange={setUsername}
onDisplayNameChange={setDisplayName}
/>
</StepContainer>
)

case 2:
return (
<StepContainer
stepDescription="Enter API keys for each service you'd like to use."
stepNum={currentStep}
stepTitle="Set API Keys (optional)"
onShouldProceed={handleShouldProceed}
showNextButton={true}
showBackButton={true}
>
<APIStep
openaiAPIKey={openaiAPIKey}
openaiOrgID={openaiOrgID}
azureOpenaiAPIKey={azureOpenaiAPIKey}
azureOpenaiEndpoint={azureOpenaiEndpoint}
azureOpenai35TurboID={azureOpenai35TurboID}
azureOpenai45TurboID={azureOpenai45TurboID}
azureOpenai45VisionID={azureOpenai45VisionID}
azureOpenaiEmbeddingsID={azureOpenaiEmbeddingsID}
anthropicAPIKey={anthropicAPIKey}
googleGeminiAPIKey={googleGeminiAPIKey}
mistralAPIKey={mistralAPIKey}
groqAPIKey={groqAPIKey}
perplexityAPIKey={perplexityAPIKey}
useAzureOpenai={useAzureOpenai}
onOpenaiAPIKeyChange={setOpenaiAPIKey}
onOpenaiOrgIDChange={setOpenaiOrgID}
onAzureOpenaiAPIKeyChange={setAzureOpenaiAPIKey}
onAzureOpenaiEndpointChange={setAzureOpenaiEndpoint}
onAzureOpenai35TurboIDChange={setAzureOpenai35TurboID}
onAzureOpenai45TurboIDChange={setAzureOpenai45TurboID}
onAzureOpenai45VisionIDChange={setAzureOpenai45VisionID}
onAzureOpenaiEmbeddingsIDChange={setAzureOpenaiEmbeddingsID}
onAnthropicAPIKeyChange={setAnthropicAPIKey}
onGoogleGeminiAPIKeyChange={setGoogleGeminiAPIKey}
onMistralAPIKeyChange={setMistralAPIKey}
onGroqAPIKeyChange={setGroqAPIKey}
onPerplexityAPIKeyChange={setPerplexityAPIKey}
onUseAzureOpenaiChange={setUseAzureOpenai}
openrouterAPIKey={openrouterAPIKey}
onOpenrouterAPIKeyChange={setOpenrouterAPIKey}
/>
</StepContainer>
)

case 3:
return (
<StepContainer
stepDescription="You are all set up!"
stepNum={currentStep}
stepTitle="Setup Complete"
onShouldProceed={handleShouldProceed}
showNextButton={true}
showBackButton={true}
>
<FinishStep displayName={displayName} />
</StepContainer>
)
default:
return null
}
}
if (loading) {
return null
}
return (
<div className="flex h-full items-center justify-center">
{renderStep(currentStep)}
</div>
)
}

// File: app/api/assistants/openai/route.ts
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{ServerRuntime}from "next"
import OpenAI from "openai"
export construntime:ServerRuntime = "edge"
export async function GET() {
try {
constprofile = await getServerProfile()
checkApiKey(profile.openai_api_key,"OpenAI")
constopenai = new OpenAI({
apiKey:profile.openai_api_key || "",
organization:profile.openai_organization_id
})
constmyAssistants = await openai.beta.assistants.list({
limit:100
})
return new Response(JSON.stringify({assistants:myAssistants.data}),{
status:200
})
} catch (error:any) {
consterrorMessage = error.error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/anthropic/route.ts
import{CHAT_SETTING_LIMITS}from "@/lib/chat-setting-limits"
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{getBase64FromDataURL,getMediaTypeFromDataURL}from "@/lib/utils"
import{ChatSettings}from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import{AnthropicStream,StreamingTextResponse}from "ai"
import{NextRequest,NextResponse}from "next/server"
export construntime = "edge"
export async function POST(request:NextRequest) {
constjson = await request.json()
const{chatSettings,messages} = json as {
chatSettings:ChatSettings
messages:any[]
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.anthropic_api_key,"Anthropic")
letANTHROPIC_FORMATTED_MESSAGES:any = messages.slice(1)
ANTHROPIC_FORMATTED_MESSAGES = ANTHROPIC_FORMATTED_MESSAGES?.map(
(message:any) => {
constmessageContent =
typeof message?.content === "string"
? [message.content]
:message?.content
return {
...message,
content:messageContent.map((content:any) => {
if (typeof content === "string") {

return {type:"text",text:content}
} else if (
content?.type=== "image_url" &&
content?.image_url?.url?.length
) {
return {
type:"image",
source:{
type:"base64",
media_type:getMediaTypeFromDataURL(content.image_url.url),
data:getBase64FromDataURL(content.image_url.url)
}
}
} else {
return content
}
})
}
}
)
constanthropic = new Anthropic({
apiKey:profile.anthropic_api_key || ""
})
try {
constresponse = await anthropic.messages.create({
model:chatSettings.model,
messages:ANTHROPIC_FORMATTED_MESSAGES,
temperature:chatSettings.temperature,
system:messages[0].content,
max_tokens:
CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
stream:true
})
try {
conststream = AnthropicStream(response)
return new StreamingTextResponse(stream)
} catch (error:any) {
console.error("Error parsing Anthropic API response:",error)
return new NextResponse(
JSON.stringify({
message:
"An error occurred while parsing the Anthropic API response"
}),
{status:500}
)
}
} catch (error:any) {
console.error("Error calling Anthropic API:",error)
return new NextResponse(
JSON.stringify({
message:"An error occurred while calling the Anthropic API"
}),
{status:500}
)
}
} catch (error:any) {
leterrorMessage = error.message || "An unexpected error occurred"
consterrorCode = error.status || 500
if (errorMessage.toLowerCase().includes("api key not found")) {
errorMessage =
"Anthropic API Key not found. Please set it in your profile settings."
} else if (errorCode === 401) {
errorMessage =
"Anthropic API Key is incorrect. Please fix it in your profile settings."
}
return new NextResponse(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/azure/route.ts
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{ChatAPIPayload}from "@/types"
import{OpenAIStream,StreamingTextResponse}from "ai"
import OpenAI from "openai"
import{ChatCompletionCreateParamsBase}from "openai/resources/chat/completions.mjs"
export construntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages} = json as ChatAPIPayload
try {
constprofile = await getServerProfile()
checkApiKey(profile.azure_openai_api_key,"Azure OpenAI")
constENDPOINT = profile.azure_openai_endpoint
constKEY = profile.azure_openai_api_key
letDEPLOYMENT_ID = ""
switch (chatSettings.model) {
case "gpt-3.5-turbo":
DEPLOYMENT_ID = profile.azure_openai_35_turbo_id || ""
break
case "gpt-4-turbo-preview":
DEPLOYMENT_ID = profile.azure_openai_45_turbo_id || ""
break
case "gpt-4-vision-preview":
DEPLOYMENT_ID = profile.azure_openai_45_vision_id || ""
break
default:
return new Response(JSON.stringify({message:"Model not found"}),{
status:400
})
}
if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
return new Response(
JSON.stringify({message:"Azure resources not found"}),
{
status:400
}
)
}
constazureOpenai = new OpenAI({
apiKey:KEY,
baseURL:`${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}`,
defaultQuery:{"api-version":"2023-12-01-preview"},
defaultHeaders:{"api-key":KEY}
})
constresponse = await azureOpenai.chat.completions.create({
model:DEPLOYMENT_ID as ChatCompletionCreateParamsBase["model"],
messages:messages as ChatCompletionCreateParamsBase["messages"],
temperature:chatSettings.temperature,
max_tokens:chatSettings.model === "gpt-4-vision-preview" ? 4096 :null,
stream:true
})
conststream = OpenAIStream(response)
return new StreamingTextResponse(stream)
} catch (error:any) {
consterrorMessage = error.error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/custom/route.ts
import{Database}from "@/supabase/types"
import{ChatSettings}from "@/types"
import{createClient}from "@supabase/supabase-js"
import{OpenAIStream,StreamingTextResponse}from "ai"
import{ServerRuntime}from "next"
import OpenAI from "openai"
import{ChatCompletionCreateParamsBase}from "openai/resources/chat/completions.mjs"
export construntime:ServerRuntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages,customModelId} = json as {
chatSettings:ChatSettings
messages:any[]
customModelId:string
}
try {
constsupabaseAdmin = createClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const{data:customModel,error} = await supabaseAdmin
.from("models")
.select("*")
.eq("id",customModelId)
.single()
if (!customModel) {
throw new Error(error.message)
}
constcustom = new OpenAI({
apiKey:customModel.api_key || "",
baseURL:customModel.base_url
})
constresponse = await custom.chat.completions.create({
model:chatSettings.model as ChatCompletionCreateParamsBase["model"],
messages:messages as ChatCompletionCreateParamsBase["messages"],
temperature:chatSettings.temperature,
stream:true
})
conststream = OpenAIStream(response)
return new StreamingTextResponse(stream)
} catch (error:any) {
leterrorMessage = error.message || "An unexpected error occurred"
consterrorCode = error.status || 500
if (errorMessage.toLowerCase().includes("api key not found")) {
errorMessage =
"Custom API Key not found. Please set it in your profile settings."
} else if (errorMessage.toLowerCase().includes("incorrect api key")) {
errorMessage =
"Custom API Key is incorrect. Please fix it in your profile settings."
}
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/google/route.ts
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{ChatSettings}from "@/types"
import{GoogleGenerativeAI}from "@google/generative-ai"
export construntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages} = json as {
chatSettings:ChatSettings
messages:any[]
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.google_gemini_api_key,"Google")
constgenAI = new GoogleGenerativeAI(profile.google_gemini_api_key || "")
constgoogleModel = genAI.getGenerativeModel({model:chatSettings.model})
constlastMessage = messages.pop()
constchat = googleModel.startChat({
history:messages,
generationConfig:{
temperature:chatSettings.temperature
}
})
constresponse = await chat.sendMessageStream(lastMessage.parts)
constencoder = new TextEncoder()
constreadableStream = new ReadableStream({
async start(controller) {
for await (constchunk of response.stream) {
constchunkText = chunk.text()
controller.enqueue(encoder.encode(chunkText))
}
controller.close()
}
})
return new Response(readableStream,{
headers:{"Content-Type":"text/plain"}
})
} catch (error:any) {
leterrorMessage = error.message || "An unexpected error occurred"
consterrorCode = error.status || 500
if (errorMessage.toLowerCase().includes("api key not found")) {
errorMessage =
"Google Gemini API Key not found. Please set it in your profile settings."
} else if (errorMessage.toLowerCase().includes("api key not valid")) {
errorMessage =
"Google Gemini API Key is incorrect. Please fix it in your profile settings."
}
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/groq/route.ts
import{CHAT_SETTING_LIMITS}from "@/lib/chat-setting-limits"
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{ChatSettings}from "@/types"
import{OpenAIStream,StreamingTextResponse}from "ai"
import OpenAI from "openai"
export construntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages} = json as {
chatSettings:ChatSettings
messages:any[]
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.groq_api_key,"G")

constgroq = new OpenAI({
apiKey:profile.groq_api_key || "",
baseURL:"https:
})
constresponse = await groq.chat.completions.create({
model:chatSettings.model,
messages,
max_tokens:
CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
stream:true
})

conststream = OpenAIStream(response)

return new StreamingTextResponse(stream)
} catch (error:any) {
leterrorMessage = error.message || "An unexpected error occurred"
consterrorCode = error.status || 500
if (errorMessage.toLowerCase().includes("api key not found")) {
errorMessage =
"Groq API Key not found. Please set it in your profile settings."
} else if (errorCode === 401) {
errorMessage =
"Groq API Key is incorrect. Please fix it in your profile settings."
}
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/mistral/route.ts
import{CHAT_SETTING_LIMITS}from "@/lib/chat-setting-limits"
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{ChatSettings}from "@/types"
import{OpenAIStream,StreamingTextResponse}from "ai"
import OpenAI from "openai"
export construntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages} = json as {
chatSettings:ChatSettings
messages:any[]
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.mistral_api_key,"Mistral")

constmistral = new OpenAI({
apiKey:profile.mistral_api_key || "",
baseURL:"https:
})
constresponse = await mistral.chat.completions.create({
model:chatSettings.model,
messages,
max_tokens:
CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
stream:true
})

conststream = OpenAIStream(response)

return new StreamingTextResponse(stream)
} catch (error:any) {
leterrorMessage = error.message || "An unexpected error occurred"
consterrorCode = error.status || 500
if (errorMessage.toLowerCase().includes("api key not found")) {
errorMessage =
"Mistral API Key not found. Please set it in your profile settings."
} else if (errorCode === 401) {
errorMessage =
"Mistral API Key is incorrect. Please fix it in your profile settings."
}
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/openai/route.ts
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{ChatSettings}from "@/types"
import{OpenAIStream,StreamingTextResponse}from "ai"
import{ServerRuntime}from "next"
import OpenAI from "openai"
import{ChatCompletionCreateParamsBase}from "openai/resources/chat/completions.mjs"
export construntime:ServerRuntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages} = json as {
chatSettings:ChatSettings
messages:any[]
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.openai_api_key,"OpenAI")
constopenai = new OpenAI({
apiKey:profile.openai_api_key || "",
organization:profile.openai_organization_id
})
constresponse = await openai.chat.completions.create({
model:chatSettings.model as ChatCompletionCreateParamsBase["model"],
messages:messages as ChatCompletionCreateParamsBase["messages"],
temperature:chatSettings.temperature,
max_tokens:
chatSettings.model === "gpt-4-vision-preview" ||
chatSettings.model === "gpt-4o"
? 4096
:null,
stream:true
})
conststream = OpenAIStream(response)
return new StreamingTextResponse(stream)
} catch (error:any) {
leterrorMessage = error.message || "An unexpected error occurred"
consterrorCode = error.status || 500
if (errorMessage.toLowerCase().includes("api key not found")) {
errorMessage =
"OpenAI API Key not found. Please set it in your profile settings."
} else if (errorMessage.toLowerCase().includes("incorrect api key")) {
errorMessage =
"OpenAI API Key is incorrect. Please fix it in your profile settings."
}
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/openrouter/route.ts
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{ChatSettings}from "@/types"
import{OpenAIStream,StreamingTextResponse}from "ai"
import{ServerRuntime}from "next"
import OpenAI from "openai"
import{ChatCompletionCreateParamsBase}from "openai/resources/chat/completions.mjs"
export construntime:ServerRuntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages} = json as {
chatSettings:ChatSettings
messages:any[]
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.openrouter_api_key,"OpenRouter")
constopenai = new OpenAI({
apiKey:profile.openrouter_api_key || "",
baseURL:"https:
})
constresponse = await openai.chat.completions.create({
model:chatSettings.model as ChatCompletionCreateParamsBase["model"],
messages:messages as ChatCompletionCreateParamsBase["messages"],
temperature:chatSettings.temperature,
max_tokens:undefined,
stream:true
})
conststream = OpenAIStream(response)
return new StreamingTextResponse(stream)
} catch (error:any) {
leterrorMessage = error.message || "An unexpected error occurred"
consterrorCode = error.status || 500
if (errorMessage.toLowerCase().includes("api key not found")) {
errorMessage =
"OpenRouter API Key not found. Please set it in your profile settings."
}
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/perplexity/route.ts
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{ChatSettings}from "@/types"
import{OpenAIStream,StreamingTextResponse}from "ai"
import OpenAI from "openai"
export construntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages} = json as {
chatSettings:ChatSettings
messages:any[]
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.perplexity_api_key,"Perplexity")

constperplexity = new OpenAI({
apiKey:profile.perplexity_api_key || "",
baseURL:"https:
})
constresponse = await perplexity.chat.completions.create({
model:chatSettings.model,
messages,
stream:true
})
conststream = OpenAIStream(response)
return new StreamingTextResponse(stream)
} catch (error:any) {
leterrorMessage = error.message || "An unexpected error occurred"
consterrorCode = error.status || 500
if (errorMessage.toLowerCase().includes("api key not found")) {
errorMessage =
"Perplexity API Key not found. Please set it in your profile settings."
} else if (errorCode === 401) {
errorMessage =
"Perplexity API Key is incorrect. Please fix it in your profile settings."
}
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/chat/tools/route.ts
import{openapiToFunctions}from "@/lib/openapi-conversion"
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{Tables}from "@/supabase/types"
import{ChatSettings}from "@/types"
import{OpenAIStream,StreamingTextResponse}from "ai"
import OpenAI from "openai"
import{ChatCompletionCreateParamsBase}from "openai/resources/chat/completions.mjs"
export async function POST(request:Request) {
constjson = await request.json()
const{chatSettings,messages,selectedTools} = json as {
chatSettings:ChatSettings
messages:any[]
selectedTools:Tables<"tools">[]
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.openai_api_key,"OpenAI")
constopenai = new OpenAI({
apiKey:profile.openai_api_key || "",
organization:profile.openai_organization_id
})
letallTools:OpenAI.Chat.Completions.ChatCompletionTool[] = []
letallRouteMaps = {}
letschemaDetails = []
for (constselectedTool of selectedTools) {
try {
constconvertedSchema = await openapiToFunctions(
JSON.parse(selectedTool.schema as string)
)
consttools = convertedSchema.functions || []
allTools = allTools.concat(tools)
constrouteMap = convertedSchema.routes.reduce(
(map:Record<string,string>,route) => {
map[route.path.replace(/{(\w+)}/g,":$1")] = route.operationId
return map
},
{}
)
allRouteMaps = {...allRouteMaps,...routeMap}
schemaDetails.push({
title:convertedSchema.info.title,
description:convertedSchema.info.description,
url:convertedSchema.info.server,
headers:selectedTool.custom_headers,
routeMap,
requestInBody:convertedSchema.routes[0].requestInBody
})
} catch (error:any) {
console.error("Error converting schema",error)
}
}
constfirstResponse = await openai.chat.completions.create({
model:chatSettings.model as ChatCompletionCreateParamsBase["model"],
messages,
tools:allTools.length > 0 ? allTools :undefined
})
constmessage = firstResponse.choices[0].message
messages.push(message)
consttoolCalls = message.tool_calls || []
if (toolCalls.length === 0) {
return new Response(message.content,{
headers:{
"Content-Type":"application/json"
}
})
}
if (toolCalls.length > 0) {
for (consttoolCall of toolCalls) {
constfunctionCall = toolCall.function
constfunctionName = functionCall.name
constargumentsString = toolCall.function.arguments.trim()
constparsedArgs = JSON.parse(argumentsString)

constschemaDetail = schemaDetails.find(detail =>
Object.values(detail.routeMap).includes(functionName)
)
if (!schemaDetail) {
throw new Error(`Function ${functionName} not found in any schema`)
}
constpathTemplate = Object.keys(schemaDetail.routeMap).find(
key => schemaDetail.routeMap[key] === functionName
)
if (!pathTemplate) {
throw new Error(`Path for function ${functionName} not found`)
}
constpath = pathTemplate.replace(/:(\w+)/g,(_,paramName) => {
constvalue = parsedArgs.parameters[paramName]
if (!value) {
throw new Error(
`Parameter ${paramName} not found for function ${functionName}`
)
}
return encodeURIComponent(value)
})
if (!path) {
throw new Error(`Path for function ${functionName} not found`)
}

constisRequestInBody = schemaDetail.requestInBody
letdata = {}
if (isRequestInBody) {

letheaders = {
"Content-Type":"application/json"
}

constcustomHeaders = schemaDetail.headers 

if (customHeaders && typeof customHeaders === "string") {
letparsedCustomHeaders = JSON.parse(customHeaders) as Record<
string,
string
>
headers = {
...headers,
...parsedCustomHeaders
}
}
constfullUrl = schemaDetail.url + path
constbodyContent = parsedArgs.requestBody || parsedArgs
constrequestInit = {
method:"POST",
headers,
body:JSON.stringify(bodyContent) 
}
constresponse = await fetch(fullUrl,requestInit)
if (!response.ok) {
data = {
error:response.statusText
}
} else {
data = await response.json()
}
} else {

constqueryParams = new URLSearchParams(
parsedArgs.parameters
).toString()
constfullUrl =
schemaDetail.url + path + (queryParams ? "?" + queryParams :"")
letheaders = {}

constcustomHeaders = schemaDetail.headers
if (customHeaders && typeof customHeaders === "string") {
headers = JSON.parse(customHeaders)
}
constresponse = await fetch(fullUrl,{
method:"GET",
headers:headers
})
if (!response.ok) {
data = {
error:response.statusText
}
} else {
data = await response.json()
}
}
messages.push({
tool_call_id:toolCall.id,
role:"tool",
name:functionName,
content:JSON.stringify(data)
})
}
}
constsecondResponse = await openai.chat.completions.create({
model:chatSettings.model as ChatCompletionCreateParamsBase["model"],
messages,
stream:true
})
conststream = OpenAIStream(secondResponse)
return new StreamingTextResponse(stream)
} catch (error:any) {
console.error(error)
consterrorMessage = error.error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/command/route.ts
import{CHAT_SETTING_LIMITS}from "@/lib/chat-setting-limits"
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import OpenAI from "openai"
export construntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{input} = json as {
input:string
}
try {
constprofile = await getServerProfile()
checkApiKey(profile.openai_api_key,"OpenAI")
constopenai = new OpenAI({
apiKey:profile.openai_api_key || "",
organization:profile.openai_organization_id
})
constresponse = await openai.chat.completions.create({
model:"gpt-4-1106-preview",
messages:[
{
role:"system",
content:"Respond to the user."
},
{
role:"user",
content:input
}
],
temperature:0,
max_tokens:
CHAT_SETTING_LIMITS["gpt-4-turbo-preview"].MAX_TOKEN_OUTPUT_LENGTH


})
constcontent = response.choices[0].message.content
return new Response(JSON.stringify({content}),{
status:200
})
} catch (error:any) {
consterrorMessage = error.error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/keys/route.ts
import{isUsingEnvironmentKey}from "@/lib/envs"
import{createResponse}from "@/lib/server/server-utils"
import{EnvKey}from "@/types/key-type"
import{VALID_ENV_KEYS}from "@/types/valid-keys"
export async function GET() {
constenvKeyMap:Record<string,VALID_ENV_KEYS> = {
azure:VALID_ENV_KEYS.AZURE_OPENAI_API_KEY,
openai:VALID_ENV_KEYS.OPENAI_API_KEY,
google:VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY,
anthropic:VALID_ENV_KEYS.ANTHROPIC_API_KEY,
mistral:VALID_ENV_KEYS.MISTRAL_API_KEY,
groq:VALID_ENV_KEYS.GROQ_API_KEY,
perplexity:VALID_ENV_KEYS.PERPLEXITY_API_KEY,
openrouter:VALID_ENV_KEYS.OPENROUTER_API_KEY,
openai_organization_id:VALID_ENV_KEYS.OPENAI_ORGANIZATION_ID,
azure_openai_endpoint:VALID_ENV_KEYS.AZURE_OPENAI_ENDPOINT,
azure_gpt_35_turbo_name:VALID_ENV_KEYS.AZURE_GPT_35_TURBO_NAME,
azure_gpt_45_vision_name:VALID_ENV_KEYS.AZURE_GPT_45_VISION_NAME,
azure_gpt_45_turbo_name:VALID_ENV_KEYS.AZURE_GPT_45_TURBO_NAME,
azure_embeddings_name:VALID_ENV_KEYS.AZURE_EMBEDDINGS_NAME
}
constisUsingEnvKeyMap = Object.keys(envKeyMap).reduce<
Record<string,boolean>
>((acc,provider) => {
constkey = envKeyMap[provider]
if (key) {
acc[provider] = isUsingEnvironmentKey(key as EnvKey)
}
return acc
},{})
return createResponse({isUsingEnvKeyMap},200)
}

// File: app/api/protected/account-status/route.ts
import{NextResponse}from "next/server"
import{authProvider}from "@/app/[locale]/protected/services/auth"
export async function GET() {
try {
constaccount = await authProvider.getAccount()
return NextResponse.json({isSignedIn:!!account})
} catch (error) {
console.error("Error checking account status:",error)
return NextResponse.json({isSignedIn:false},{status:500})
}
}

// File: app/api/protected/callback/route.ts
import{NextRequest,NextResponse}from "next/server"
import{authProvider}from "@/app/[locale]/protected/services/auth"
import{
commitSession,
getSession
}from "@/app/[locale]/protected/services/session"
export constdynamic = "force-dynamic"
export async function POST(request:NextRequest) {
try {
const{account,returnTo} = await authProvider.handleAuthCodeCallback(
await request.formData()
)
if (!account) {
throw new Error("No account found")
}
constsession = await getSession(request.headers.get("Cookie"))
session.set("homeAccountId",account.homeAccountId)

constlocale = request.nextUrl.pathname.split("/")[1]

constdefaultReturnTo = new URL(
`/${locale}/protected`,
request.url
).toString()
constsafeReturnTo =
returnTo && returnTo !== "" ? returnTo :defaultReturnTo

constredirectUrl = new URL(safeReturnTo,request.url).toString()
return NextResponse.redirect(redirectUrl,{
status:303,
headers:{
"Set-Cookie":await commitSession(session)
}
})
} catch (error) {
console.error(error)

return NextResponse.json(
{error:"Authentication failed"},
{status:500}
)
}
}

// File: app/api/protected/eventConsent/route.ts
import{NextRequest,NextResponse}from "next/server"
import{calendarRequest}from "@/app/[locale]/protected/serverConfig"
import{authProvider}from "@/app/[locale]/protected/services/auth"
export async function POST(request:NextRequest) {
constreturnTo = new URL("/api/protected/event",request.url).toString()
return NextResponse.redirect(
await authProvider.getAuthCodeUrl(calendarRequest,returnTo),
{
status:303
}
)
}

// File: app/api/retrieval/process/docx/route.ts
import{generateLocalEmbedding}from "@/lib/generate-local-embedding"
import{processDocX}from "@/lib/retrieval/processing"
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{Database}from "@/supabase/types"
import{FileItemChunk}from "@/types"
import{createClient}from "@supabase/supabase-js"
import{NextResponse}from "next/server"
import OpenAI from "openai"
export async function POST(req:Request) {
constjson = await req.json()
const{text,fileId,embeddingsProvider,fileExtension} = json as {
text:string
fileId:string
embeddingsProvider:"openai" | "local"
fileExtension:string
}
try {
constsupabaseAdmin = createClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)
constprofile = await getServerProfile()
if (embeddingsProvider === "openai") {
if (profile.use_azure_openai) {
checkApiKey(profile.azure_openai_api_key,"Azure OpenAI")
} else {
checkApiKey(profile.openai_api_key,"OpenAI")
}
}
letchunks:FileItemChunk[] = []
switch (fileExtension) {
case "docx":
chunks = await processDocX(text)
break
default:
return new NextResponse("Unsupported file type",{
status:400
})
}
letembeddings:any = []
letopenai
if (profile.use_azure_openai) {
openai = new OpenAI({
apiKey:profile.azure_openai_api_key || "",
baseURL:`${profile.azure_openai_endpoint}/openai/deployments/${profile.azure_openai_embeddings_id}`,
defaultQuery:{"api-version":"2023-12-01-preview"},
defaultHeaders:{"api-key":profile.azure_openai_api_key}
})
} else {
openai = new OpenAI({
apiKey:profile.openai_api_key || "",
organization:profile.openai_organization_id
})
}
if (embeddingsProvider === "openai") {
constresponse = await openai.embeddings.create({
model:"text-embedding-3-small",
input:chunks.map(chunk => chunk.content)
})
embeddings = response.data.map((item:any) => {
return item.embedding
})
} else if (embeddingsProvider === "local") {
constembeddingPromises = chunks.map(async chunk => {
try {
return await generateLocalEmbedding(chunk.content)
} catch (error) {
console.error(`Error generating embedding for chunk:${chunk}`,error)
return null
}
})
embeddings = await Promise.all(embeddingPromises)
}
constfile_items = chunks.map((chunk,index) => ({
file_id:fileId,
user_id:profile.user_id,
content:chunk.content,
tokens:chunk.tokens,
openai_embedding:
embeddingsProvider === "openai"
? ((embeddings[index] || null) as any)
:null,
local_embedding:
embeddingsProvider === "local"
? ((embeddings[index] || null) as any)
:null
}))
await supabaseAdmin.from("file_items").upsert(file_items)
consttotalTokens = file_items.reduce((acc,item) => acc + item.tokens,0)
await supabaseAdmin
.from("files")
.update({tokens:totalTokens})
.eq("id",fileId)
return new NextResponse("Embed Successful",{
status:200
})
} catch (error:any) {
console.error(error)
consterrorMessage = error.error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/retrieval/process/route.ts
import{generateLocalEmbedding}from "@/lib/generate-local-embedding"
import{
processCSV,
processJSON,
processMarkdown,
processPdf,
processTxt
}from "@/lib/retrieval/processing"
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{Database}from "@/supabase/types"
import{FileItemChunk}from "@/types"
import{createClient}from "@supabase/supabase-js"
import{NextResponse}from "next/server"
import OpenAI from "openai"
export async function POST(req:Request) {
try {
constsupabaseAdmin = createClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)
constprofile = await getServerProfile()
constformData = await req.formData()
constfile_id = formData.get("file_id") as string
constembeddingsProvider = formData.get("embeddingsProvider") as string
const{data:fileMetadata,error:metadataError} = await supabaseAdmin
.from("files")
.select("*")
.eq("id",file_id)
.single()
if (metadataError) {
throw new Error(
`Failed to retrieve file metadata:${metadataError.message}`
)
}
if (!fileMetadata) {
throw new Error("File not found")
}
if (fileMetadata.user_id !== profile.user_id) {
throw new Error("Unauthorized")
}
const{data:file,error:fileError} = await supabaseAdmin.storage
.from("files")
.download(fileMetadata.file_path)
if (fileError)
throw new Error(`Failed to retrieve file:${fileError.message}`)
constfileBuffer = Buffer.from(await file.arrayBuffer())
constblob = new Blob([fileBuffer])
constfileExtension = fileMetadata.name.split(".").pop()?.toLowerCase()
if (embeddingsProvider === "openai") {
try {
if (profile.use_azure_openai) {
checkApiKey(profile.azure_openai_api_key,"Azure OpenAI")
} else {
checkApiKey(profile.openai_api_key,"OpenAI")
}
} catch (error:any) {
error.message =
error.message +
",make sure it is configured or else use local embeddings"
throw error
}
}
letchunks:FileItemChunk[] = []
switch (fileExtension) {
case "csv":
chunks = await processCSV(blob)
break
case "json":
chunks = await processJSON(blob)
break
case "md":
chunks = await processMarkdown(blob)
break
case "pdf":
chunks = await processPdf(blob)
break
case "txt":
chunks = await processTxt(blob)
break
default:
return new NextResponse("Unsupported file type",{
status:400
})
}
letembeddings:any = []
letopenai
if (profile.use_azure_openai) {
openai = new OpenAI({
apiKey:profile.azure_openai_api_key || "",
baseURL:`${profile.azure_openai_endpoint}/openai/deployments/${profile.azure_openai_embeddings_id}`,
defaultQuery:{"api-version":"2023-12-01-preview"},
defaultHeaders:{"api-key":profile.azure_openai_api_key}
})
} else {
openai = new OpenAI({
apiKey:profile.openai_api_key || "",
organization:profile.openai_organization_id
})
}
if (embeddingsProvider === "openai") {
constresponse = await openai.embeddings.create({
model:"text-embedding-3-small",
input:chunks.map(chunk => chunk.content)
})
embeddings = response.data.map((item:any) => {
return item.embedding
})
} else if (embeddingsProvider === "local") {
constembeddingPromises = chunks.map(async chunk => {
try {
return await generateLocalEmbedding(chunk.content)
} catch (error) {
console.error(`Error generating embedding for chunk:${chunk}`,error)
return null
}
})
embeddings = await Promise.all(embeddingPromises)
}
constfile_items = chunks.map((chunk,index) => ({
file_id,
user_id:profile.user_id,
content:chunk.content,
tokens:chunk.tokens,
openai_embedding:
embeddingsProvider === "openai"
? ((embeddings[index] || null) as any)
:null,
local_embedding:
embeddingsProvider === "local"
? ((embeddings[index] || null) as any)
:null
}))
await supabaseAdmin.from("file_items").upsert(file_items)
consttotalTokens = file_items.reduce((acc,item) => acc + item.tokens,0)
await supabaseAdmin
.from("files")
.update({tokens:totalTokens})
.eq("id",file_id)
return new NextResponse("Embed Successful",{
status:200
})
} catch (error:any) {
console.log(`Error in retrieval/process:${error.stack}`)
consterrorMessage = error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/retrieval/retrieve/route.ts
import{generateLocalEmbedding}from "@/lib/generate-local-embedding"
import{checkApiKey,getServerProfile}from "@/lib/server/server-chat-helpers"
import{Database}from "@/supabase/types"
import{createClient}from "@supabase/supabase-js"
import OpenAI from "openai"
export async function POST(request:Request) {
constjson = await request.json()
const{userInput,fileIds,embeddingsProvider,sourceCount} = json as {
userInput:string
fileIds:string[]
embeddingsProvider:"openai" | "local"
sourceCount:number
}
constuniqueFileIds = [...new Set(fileIds)]
try {
constsupabaseAdmin = createClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)
constprofile = await getServerProfile()
if (embeddingsProvider === "openai") {
if (profile.use_azure_openai) {
checkApiKey(profile.azure_openai_api_key,"Azure OpenAI")
} else {
checkApiKey(profile.openai_api_key,"OpenAI")
}
}
letchunks:any[] = []
letopenai
if (profile.use_azure_openai) {
openai = new OpenAI({
apiKey:profile.azure_openai_api_key || "",
baseURL:`${profile.azure_openai_endpoint}/openai/deployments/${profile.azure_openai_embeddings_id}`,
defaultQuery:{"api-version":"2023-12-01-preview"},
defaultHeaders:{"api-key":profile.azure_openai_api_key}
})
} else {
openai = new OpenAI({
apiKey:profile.openai_api_key || "",
organization:profile.openai_organization_id
})
}
if (embeddingsProvider === "openai") {
constresponse = await openai.embeddings.create({
model:"text-embedding-3-small",
input:userInput
})
constopenaiEmbedding = response.data.map(item => item.embedding)[0]
const{data:openaiFileItems,error:openaiError} =
await supabaseAdmin.rpc("match_file_items_openai",{
query_embedding:openaiEmbedding as any,
match_count:sourceCount,
file_ids:uniqueFileIds
})
if (openaiError) {
throw openaiError
}
chunks = openaiFileItems
} else if (embeddingsProvider === "local") {
constlocalEmbedding = await generateLocalEmbedding(userInput)
const{data:localFileItems,error:localFileItemsError} =
await supabaseAdmin.rpc("match_file_items_local",{
query_embedding:localEmbedding as any,
match_count:sourceCount,
file_ids:uniqueFileIds
})
if (localFileItemsError) {
throw localFileItemsError
}
chunks = localFileItems
}
constmostSimilarChunks = chunks?.sort(
(a,b) => b.similarity - a.similarity
)
return new Response(JSON.stringify({results:mostSimilarChunks}),{
status:200
})
} catch (error:any) {
consterrorMessage = error.error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/username/available/route.ts
import{Database}from "@/supabase/types"
import{createClient}from "@supabase/supabase-js"
export construntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{username} = json as {
username:string
}
try {
constsupabaseAdmin = createClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const{data:usernames,error} = await supabaseAdmin
.from("profiles")
.select("username")
.eq("username",username)
if (!usernames) {
throw new Error(error.message)
}
return new Response(JSON.stringify({isAvailable:!usernames.length}),{
status:200
})
} catch (error:any) {
consterrorMessage = error.error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/api/username/get/route.ts
import{Database}from "@/supabase/types"
import{createClient}from "@supabase/supabase-js"
export construntime = "edge"
export async function POST(request:Request) {
constjson = await request.json()
const{userId} = json as {
userId:string
}
try {
constsupabaseAdmin = createClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const{data,error} = await supabaseAdmin
.from("profiles")
.select("username")
.eq("user_id",userId)
.single()
if (!data) {
throw new Error(error.message)
}
return new Response(JSON.stringify({username:data.username}),{
status:200
})
} catch (error:any) {
consterrorMessage = error.error?.message || "An unexpected error occurred"
consterrorCode = error.status || 500
return new Response(JSON.stringify({message:errorMessage}),{
status:errorCode
})
}
}

// File: app/auth/callback/route.ts
import{createClient}from "@/lib/supabase/server"
import{cookies}from "next/headers"
import{NextResponse}from "next/server"
export async function GET(request:Request) {
constrequestUrl = new URL(request.url)
constcode = requestUrl.searchParams.get("code")
constnext = requestUrl.searchParams.get("next")
if (code) {
constcookieStore = cookies()
constsupabase = createClient(cookieStore)
await supabase.auth.exchangeCodeForSession(code)
}
if (next) {
return NextResponse.redirect(requestUrl.origin + next)
} else {
return NextResponse.redirect(requestUrl.origin)
}
}

// File: components/chat/assistant-picker.tsx
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{IconRobotFace}from "@tabler/icons-react"
import Image from "next/image"
import{FC,useContext,useEffect,useRef}from "react"
import{usePromptAndCommand}from "./chat-hooks/use-prompt-and-command"
interfaceAssistantPickerProps {}
export constAssistantPicker:FC<AssistantPickerProps> = ({}) => {
const{
assistants,
assistantImages,
focusAssistant,
atCommand,
isAssistantPickerOpen,
setIsAssistantPickerOpen
} = useContext(ChatbotUIContext)
const{handleSelectAssistant} = usePromptAndCommand()
constitemsRef = useRef<(HTMLDivElement | null)[]>([])
useEffect(() => {
if (focusAssistant && itemsRef.current[0]) {
itemsRef.current[0].focus()
}
},[focusAssistant])
constfilteredAssistants = assistants.filter(assistant =>
assistant.name.toLowerCase().includes(atCommand.toLowerCase())
)
consthandleOpenChange = (isOpen:boolean) => {
setIsAssistantPickerOpen(isOpen)
}
constcallSelectAssistant = (assistant:Tables<"assistants">) => {
handleSelectAssistant(assistant)
handleOpenChange(false)
}
constgetKeyDownHandler =
(index:number) => (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Backspace") {
e.preventDefault()
handleOpenChange(false)
} else if (e.key === "Enter") {
e.preventDefault()
callSelectAssistant(filteredAssistants[index])
} else if (
(e.key === "Tab" || e.key === "ArrowDown") &&
!e.shiftKey &&
index === filteredAssistants.length - 1
) {
e.preventDefault()
itemsRef.current[0]?.focus()
} else if (e.key === "ArrowUp" && !e.shiftKey && index === 0) {

e.preventDefault()
itemsRef.current[itemsRef.current.length - 1]?.focus()
} else if (e.key === "ArrowUp") {
e.preventDefault()
constprevIndex =
index - 1 >= 0 ? index - 1 :itemsRef.current.length - 1
itemsRef.current[prevIndex]?.focus()
} else if (e.key === "ArrowDown") {
e.preventDefault()
constnextIndex = index + 1 < itemsRef.current.length ? index + 1 :0
itemsRef.current[nextIndex]?.focus()
}
}
return (
<>
{isAssistantPickerOpen && (
<div className="bg-background flex flex-col space-y-1 rounded-xl border-2 p-2 text-sm">
{filteredAssistants.length === 0 ? (
<div className="text-md flex h-14 cursor-pointer items-center justify-center italic hover:opacity-50">
No matching assistants.
</div>
) :(
<>
{filteredAssistants.map((item,index) => (
<div
key={item.id}
ref={ref => {
itemsRef.current[index] = ref
}}
tabIndex={0}
className="hover:bg-accent focus:bg-accent flex cursor-pointer items-center rounded p-2 focus:outline-none"
onClick={() =>
callSelectAssistant(item as Tables<"assistants">)
}
onKeyDown={getKeyDownHandler(index)}
>
{item.image_path ? (
<Image
src={
assistantImages.find(
image => image.path === item.image_path
)?.url || ""
}
alt={item.name}
width={32}
height={32}
className="rounded"
/>
) :(
<IconRobotFace size={32} />
)}
<div className="ml-3 flex flex-col">
<div className="font-bold">{item.name}</div>
<div className="truncate text-sm opacity-80">
{item.description || "No description."}
</div>
</div>
</div>
))}
</>
)}
</div>
)}
</>
)
}

// File: components/chat/chat-command-input.tsx
import{ChatbotUIContext}from "@/context/context"
import{FC,useContext}from "react"
import{AssistantPicker}from "./assistant-picker"
import{usePromptAndCommand}from "./chat-hooks/use-prompt-and-command"
import{FilePicker}from "./file-picker"
import{PromptPicker}from "./prompt-picker"
import{ToolPicker}from "./tool-picker"
interfaceChatCommandInputProps {}
export constChatCommandInput:FC<ChatCommandInputProps> = ({}) => {
const{
newMessageFiles,
chatFiles,
slashCommand,
isFilePickerOpen,
setIsFilePickerOpen,
hashtagCommand,
focusPrompt,
focusFile
} = useContext(ChatbotUIContext)
const{handleSelectUserFile,handleSelectUserCollection} =
usePromptAndCommand()
return (
<>
<PromptPicker />
<FilePicker
isOpen={isFilePickerOpen}
searchQuery={hashtagCommand}
onOpenChange={setIsFilePickerOpen}
selectedFileIds={[...newMessageFiles,...chatFiles].map(
file => file.id
)}
selectedCollectionIds={[]}
onSelectFile={handleSelectUserFile}
onSelectCollection={handleSelectUserCollection}
isFocused={focusFile}
/>
<ToolPicker />
<AssistantPicker />
</>
)
}

// File: components/chat/chat-files-display.tsx
import{ChatbotUIContext}from "@/context/context"
import{getFileFromStorage}from "@/db/storage/files"
import useHotkey from "@/lib/hooks/use-hotkey"
import{cn}from "@/lib/utils"
import{ChatFile,MessageImage}from "@/types"
import{
IconCircleFilled,
IconFileFilled,
IconFileTypeCsv,
IconFileTypeDocx,
IconFileTypePdf,
IconFileTypeTxt,
IconJson,
IconLoader2,
IconMarkdown,
IconX
}from "@tabler/icons-react"
import Image from "next/image"
import{FC,useContext,useState}from "react"
import{Button}from "../ui/button"
import{FilePreview}from "../ui/file-preview"
import{WithTooltip}from "../ui/with-tooltip"
import{ChatRetrievalSettings}from "./chat-retrieval-settings"
interfaceChatFilesDisplayProps {}
export constChatFilesDisplay:FC<ChatFilesDisplayProps> = ({}) => {
useHotkey("f",() => setShowFilesDisplay(prev => !prev))
useHotkey("e",() => setUseRetrieval(prev => !prev))
const{
files,
newMessageImages,
setNewMessageImages,
newMessageFiles,
setNewMessageFiles,
setShowFilesDisplay,
showFilesDisplay,
chatFiles,
chatImages,
setChatImages,
setChatFiles,
setUseRetrieval
} = useContext(ChatbotUIContext)
const[selectedFile,setSelectedFile] = useState<ChatFile | null>(null)
const[selectedImage,setSelectedImage] = useState<MessageImage | null>(null)
const[showPreview,setShowPreview] = useState(false)
constmessageImages = [
...newMessageImages.filter(
image =>
!chatImages.some(chatImage => chatImage.messageId === image.messageId)
)
]
constcombinedChatFiles = [
...newMessageFiles.filter(
file => !chatFiles.some(chatFile => chatFile.id === file.id)
),
...chatFiles
]
constcombinedMessageFiles = [...messageImages,...combinedChatFiles]
constgetLinkAndView = async (file:ChatFile) => {
constfileRecord = files.find(f => f.id === file.id)
if (!fileRecord) return
constlink = await getFileFromStorage(fileRecord.file_path)
window.open(link,"_blank")
}
return showFilesDisplay && combinedMessageFiles.length > 0 ? (
<>
{showPreview && selectedImage && (
<FilePreview
type="image"
item={selectedImage}
isOpen={showPreview}
onOpenChange={(isOpen:boolean) => {
setShowPreview(isOpen)
setSelectedImage(null)
}}
/>
)}
{showPreview && selectedFile && (
<FilePreview
type="file"
item={selectedFile}
isOpen={showPreview}
onOpenChange={(isOpen:boolean) => {
setShowPreview(isOpen)
setSelectedFile(null)
}}
/>
)}
<div className="space-y-2">
<div className="flex w-full items-center justify-center">
<Button
className="flex h-[32px] w-[140px] space-x-2"
onClick={() => setShowFilesDisplay(false)}
>
<RetrievalToggle />
<div>Hide files</div>
<div onClick={e => e.stopPropagation()}>
<ChatRetrievalSettings />
</div>
</Button>
</div>
<div className="overflow-auto">
<div className="flex gap-2 overflow-auto pt-2">
{messageImages.map((image,index) => (
<div
key={index}
className="relative flex h-[64px] cursor-pointer items-center space-x-4 rounded-xl hover:opacity-50"
>
<Image
className="rounded"

style={{
minWidth:"56px",
minHeight:"56px",
maxHeight:"56px",
maxWidth:"56px"
}}
src={image.base64} 
alt="File image"
width={56}
height={56}
onClick={() => {
setSelectedImage(image)
setShowPreview(true)
}}
/>
<IconX
className="bg-muted-foreground border-primary absolute right-[-6px] top-[-2px] flex size-5 cursor-pointer items-center justify-center rounded-full border-DEFAULT text-[10px] hover:border-red-500 hover:bg-white hover:text-red-500"
onClick={e => {
e.stopPropagation()
setNewMessageImages(
newMessageImages.filter(
f => f.messageId !== image.messageId
)
)
setChatImages(
chatImages.filter(f => f.messageId !== image.messageId)
)
}}
/>
</div>
))}
{combinedChatFiles.map((file,index) =>
file.id === "loading" ? (
<div
key={index}
className="relative flex h-[64px] items-center space-x-4 rounded-xl border-2 px-4 py-3"
>
<div className="rounded bg-blue-500 p-2">
<IconLoader2 className="animate-spin" />
</div>
<div className="truncate text-sm">
<div className="truncate">{file.name}</div>
<div className="truncate opacity-50">{file.type}</div>
</div>
</div>
) :(
<div
key={file.id}
className="relative flex h-[64px] cursor-pointer items-center space-x-4 rounded-xl border-2 px-4 py-3 hover:opacity-50"
onClick={() => getLinkAndView(file)}
>
<div className="rounded bg-blue-500 p-2">
{(() => {
letfileExtension = file.type.includes("/")
? file.type.split("/")[1]
:file.type
switch (fileExtension) {
case "pdf":
return <IconFileTypePdf />
case "markdown":
return <IconMarkdown />
case "txt":
return <IconFileTypeTxt />
case "json":
return <IconJson />
case "csv":
return <IconFileTypeCsv />
case "docx":
return <IconFileTypeDocx />
default:
return <IconFileFilled />
}
})()}
</div>
<div className="truncate text-sm">
<div className="truncate">{file.name}</div>
</div>
<IconX
className="bg-muted-foreground border-primary absolute right-[-6px] top-[-6px] flex size-5 cursor-pointer items-center justify-center rounded-full border-DEFAULT text-[10px] hover:border-red-500 hover:bg-white hover:text-red-500"
onClick={e => {
e.stopPropagation()
setNewMessageFiles(
newMessageFiles.filter(f => f.id !== file.id)
)
setChatFiles(chatFiles.filter(f => f.id !== file.id))
}}
/>
</div>
)
)}
</div>
</div>
</div>
</>
) :(
combinedMessageFiles.length > 0 && (
<div className="flex w-full items-center justify-center space-x-2">
<Button
className="flex h-[32px] w-[140px] space-x-2"
onClick={() => setShowFilesDisplay(true)}
>
<RetrievalToggle />
<div>
{" "}
View {combinedMessageFiles.length} file
{combinedMessageFiles.length > 1 ? "s" :""}
</div>
<div onClick={e => e.stopPropagation()}>
<ChatRetrievalSettings />
</div>
</Button>
</div>
)
)
}
constRetrievalToggle = ({}) => {
const{useRetrieval,setUseRetrieval} = useContext(ChatbotUIContext)
return (
<div className="flex items-center">
<WithTooltip
delayDuration={0}
side="top"
display={
<div>
{useRetrieval
? "File retrieval is enabled on the selected files for this message. Click the indicator to disable."
:"Click the indicator to enable file retrieval for this message."}
</div>
}
trigger={
<IconCircleFilled
className={cn(
"p-1",
useRetrieval ? "text-green-500" :"text-red-500",
useRetrieval ? "hover:text-green-200" :"hover:text-red-200"
)}
size={24}
onClick={e => {
e.stopPropagation()
setUseRetrieval(prev => !prev)
}}
/>
}
/>
</div>
)
}

// File: components/chat/chat-help.tsx
import useHotkey from "@/lib/hooks/use-hotkey"
import{
IconBrandGithub,
IconBrandX,
IconHelpCircle,
IconQuestionMark
}from "@tabler/icons-react"
import Link from "next/link"
import{FC,useState}from "react"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger
}from "../ui/dropdown-menu"
import{Announcements}from "../utility/announcements"
interfaceChatHelpProps {}
export constChatHelp:FC<ChatHelpProps> = ({}) => {
useHotkey("/",() => setIsOpen(prevState => !prevState))
const[isOpen,setIsOpen] = useState(false)
return (
<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
<DropdownMenuTrigger asChild>
<IconQuestionMark className="bg-primary text-secondary size-[24px] cursor-pointer rounded-full p-0.5 opacity-60 hover:opacity-50 lg:size-[30px] lg:p-1" />
</DropdownMenuTrigger>
<DropdownMenuContent align="end">
<DropdownMenuLabel className="flex items-center justify-between">
<div className="flex space-x-2">
<Link
className="cursor-pointer hover:opacity-50"
href="https:
target="_blank"
rel="noopener noreferrer"
>
<IconBrandX />
</Link>
<Link
className="cursor-pointer hover:opacity-50"
href="https:
target="_blank"
rel="noopener noreferrer"
>
<IconBrandGithub />
</Link>
</div>
<div className="flex space-x-2">
<Announcements />
<Link
className="cursor-pointer hover:opacity-50"
href="/help"
target="_blank"
rel="noopener noreferrer"
>
<IconHelpCircle size={24} />
</Link>
</div>
</DropdownMenuLabel>
<DropdownMenuSeparator />
<DropdownMenuItem className="flex justify-between">
<div>Show Help</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
/
</div>
</div>
</DropdownMenuItem>
<DropdownMenuItem className="flex justify-between">
<div>Show Workspaces</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
;
</div>
</div>
</DropdownMenuItem>
<DropdownMenuItem className="flex w-[300px] justify-between">
<div>New Chat</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
O
</div>
</div>
</DropdownMenuItem>
<DropdownMenuItem className="flex justify-between">
<div>Focus Chat</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
L
</div>
</div>
</DropdownMenuItem>
<DropdownMenuItem className="flex justify-between">
<div>Toggle Files</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
F
</div>
</div>
</DropdownMenuItem>
<DropdownMenuItem className="flex justify-between">
<div>Toggle Retrieval</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
E
</div>
</div>
</DropdownMenuItem>
<DropdownMenuItem className="flex justify-between">
<div>Open Settings</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
I
</div>
</div>
</DropdownMenuItem>
<DropdownMenuItem className="flex justify-between">
<div>Open Quick Settings</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
P
</div>
</div>
</DropdownMenuItem>
<DropdownMenuItem className="flex justify-between">
<div>Toggle Sidebar</div>
<div className="flex opacity-60">
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
⌘
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
Shift
</div>
<div className="min-w-[30px] rounded border-DEFAULT p-1 text-center">
S
</div>
</div>
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
)
}

// File: components/chat/chat-helpers/index.ts

import{createChatFiles}from "@/db/chat-files"
import{createChat}from "@/db/chats"
import{createMessageFileItems}from "@/db/message-file-items"
import{createMessages,updateMessage}from "@/db/messages"
import{uploadMessageImage}from "@/db/storage/message-images"
import{
buildFinalMessages,
adaptMessagesForGoogleGemini
}from "@/lib/build-prompt"
import{consumeReadableStream}from "@/lib/consume-stream"
import{Tables,TablesInsert}from "@/supabase/types"
import{
ChatFile,
ChatMessage,
ChatPayload,
ChatSettings,
LLM,
MessageImage
}from "@/types"
import React from "react"
import{toast}from "sonner"
import{v4 as uuidv4}from "uuid"
export constvalidateChatSettings = (
chatSettings:ChatSettings | null,
modelData:LLM | undefined,
profile:Tables<"profiles"> | null,
selectedWorkspace:Tables<"workspaces"> | null,
messageContent:string
) => {
if (!chatSettings) {
throw new Error("Chat settings not found")
}
if (!modelData) {
throw new Error("Model not found")
}
if (!profile) {
throw new Error("Profile not found")
}
if (!selectedWorkspace) {
throw new Error("Workspace not found")
}
if (!messageContent) {
throw new Error("Message content not found")
}
}
export consthandleRetrieval = async (
userInput:string,
newMessageFiles:ChatFile[],
chatFiles:ChatFile[],
embeddingsProvider:"openai" | "local",
sourceCount:number
) => {
constresponse = await fetch("/api/retrieval/retrieve",{
method:"POST",
body:JSON.stringify({
userInput,
fileIds:[...newMessageFiles,...chatFiles].map(file => file.id),
embeddingsProvider,
sourceCount
})
})
if (!response.ok) {
console.error("Error retrieving:",response)
}
const{results} = (await response.json()) as {
results:Tables<"file_items">[]
}
return results
}
export constcreateTempMessages = (
messageContent:string,
chatMessages:ChatMessage[],
chatSettings:ChatSettings,
b64Images:string[],
isRegeneration:boolean,
setChatMessages:React.Dispatch<React.SetStateAction<ChatMessage[]>>,
selectedAssistant:Tables<"assistants"> | null
) => {
lettempUserChatMessage:ChatMessage = {
message:{
chat_id:"",
assistant_id:null,
content:messageContent,
created_at:"",
id:uuidv4(),
image_paths:b64Images,
model:chatSettings.model,
role:"user",
sequence_number:chatMessages.length,
updated_at:"",
user_id:""
},
fileItems:[]
}
lettempAssistantChatMessage:ChatMessage = {
message:{
chat_id:"",
assistant_id:selectedAssistant?.id || null,
content:"",
created_at:"",
id:uuidv4(),
image_paths:[],
model:chatSettings.model,
role:"assistant",
sequence_number:chatMessages.length + 1,
updated_at:"",
user_id:""
},
fileItems:[]
}
letnewMessages = []
if (isRegeneration) {
constlastMessageIndex = chatMessages.length - 1
chatMessages[lastMessageIndex].message.content = ""
newMessages = [...chatMessages]
} else {
newMessages = [
...chatMessages,
tempUserChatMessage,
tempAssistantChatMessage
]
}
setChatMessages(newMessages)
return {
tempUserChatMessage,
tempAssistantChatMessage
}
}
export consthandleLocalChat = async (
payload:ChatPayload,
profile:Tables<"profiles">,
chatSettings:ChatSettings,
tempAssistantMessage:ChatMessage,
isRegeneration:boolean,
newAbortController:AbortController,
setIsGenerating:React.Dispatch<React.SetStateAction<boolean>>,
setFirstTokenReceived:React.Dispatch<React.SetStateAction<boolean>>,
setChatMessages:React.Dispatch<React.SetStateAction<ChatMessage[]>>,
setToolInUse:React.Dispatch<React.SetStateAction<string>>
) => {
constformattedMessages = await buildFinalMessages(payload,profile,[])

constresponse = await fetchChatResponse(
process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/chat",
{
model:chatSettings.model,
messages:formattedMessages,
options:{
temperature:payload.chatSettings.temperature
}
},
false,
newAbortController,
setIsGenerating,
setChatMessages
)
return await processResponse(
response,
isRegeneration
? payload.chatMessages[payload.chatMessages.length - 1]
:tempAssistantMessage,
false,
newAbortController,
setFirstTokenReceived,
setChatMessages,
setToolInUse
)
}
export consthandleHostedChat = async (
payload:ChatPayload,
profile:Tables<"profiles">,
modelData:LLM,
tempAssistantChatMessage:ChatMessage,
isRegeneration:boolean,
newAbortController:AbortController,
newMessageImages:MessageImage[],
chatImages:MessageImage[],
setIsGenerating:React.Dispatch<React.SetStateAction<boolean>>,
setFirstTokenReceived:React.Dispatch<React.SetStateAction<boolean>>,
setChatMessages:React.Dispatch<React.SetStateAction<ChatMessage[]>>,
setToolInUse:React.Dispatch<React.SetStateAction<string>>
) => {
constprovider =
modelData.provider === "openai" && profile.use_azure_openai
? "azure"
:modelData.provider
letdraftMessages = await buildFinalMessages(payload,profile,chatImages)
letformattedMessages:any[] = []
if (provider === "google") {
formattedMessages = await adaptMessagesForGoogleGemini(
payload,
draftMessages
)
} else {
formattedMessages = draftMessages
}
constapiEndpoint =
provider === "custom" ? "/api/chat/custom" :`/api/chat/${provider}`
constrequestBody = {
chatSettings:payload.chatSettings,
messages:formattedMessages,
customModelId:provider === "custom" ? modelData.hostedId :""
}
constresponse = await fetchChatResponse(
apiEndpoint,
requestBody,
true,
newAbortController,
setIsGenerating,
setChatMessages
)
return await processResponse(
response,
isRegeneration
? payload.chatMessages[payload.chatMessages.length - 1]
:tempAssistantChatMessage,
true,
newAbortController,
setFirstTokenReceived,
setChatMessages,
setToolInUse
)
}
export constfetchChatResponse = async (
url:string,
body:object,
isHosted:boolean,
controller:AbortController,
setIsGenerating:React.Dispatch<React.SetStateAction<boolean>>,
setChatMessages:React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
constresponse = await fetch(url,{
method:"POST",
body:JSON.stringify(body),
signal:controller.signal
})
if (!response.ok) {
if (response.status === 404 && !isHosted) {
toast.error(
"Model not found. Make sure you have it downloaded via Ollama."
)
}
consterrorData = await response.json()
toast.error(errorData.message)
setIsGenerating(false)
setChatMessages(prevMessages => prevMessages.slice(0,-2))
}
return response
}
export constprocessResponse = async (
response:Response,
lastChatMessage:ChatMessage,
isHosted:boolean,
controller:AbortController,
setFirstTokenReceived:React.Dispatch<React.SetStateAction<boolean>>,
setChatMessages:React.Dispatch<React.SetStateAction<ChatMessage[]>>,
setToolInUse:React.Dispatch<React.SetStateAction<string>>
) => {
letfullText = ""
letcontentToAdd = ""
if (response.body) {
await consumeReadableStream(
response.body,
chunk => {
setFirstTokenReceived(true)
setToolInUse("none")
try {
contentToAdd = isHosted
? chunk
:



chunk
.trimEnd()
.split("\n")
.reduce(
(acc,line) => acc + JSON.parse(line).message.content,
""
)
fullText += contentToAdd
} catch (error) {
console.error("Error parsing JSON:",error)
}
setChatMessages(prev =>
prev.map(chatMessage => {
if (chatMessage.message.id === lastChatMessage.message.id) {
constupdatedChatMessage:ChatMessage = {
message:{
...chatMessage.message,
content:fullText
},
fileItems:chatMessage.fileItems
}
return updatedChatMessage
}
return chatMessage
})
)
},
controller.signal
)
return fullText
} else {
throw new Error("Response body is null")
}
}
export consthandleCreateChat = async (
chatSettings:ChatSettings,
profile:Tables<"profiles">,
selectedWorkspace:Tables<"workspaces">,
messageContent:string,
selectedAssistant:Tables<"assistants">,
newMessageFiles:ChatFile[],
setSelectedChat:React.Dispatch<React.SetStateAction<Tables<"chats"> | null>>,
setChats:React.Dispatch<React.SetStateAction<Tables<"chats">[]>>,
setChatFiles:React.Dispatch<React.SetStateAction<ChatFile[]>>
) => {
constcreatedChat = await createChat({
user_id:profile.user_id,
workspace_id:selectedWorkspace.id,
assistant_id:selectedAssistant?.id || null,
context_length:chatSettings.contextLength,
include_profile_context:chatSettings.includeProfileContext,
include_workspace_instructions:chatSettings.includeWorkspaceInstructions,
model:chatSettings.model,
name:messageContent.substring(0,100),
prompt:chatSettings.prompt,
temperature:chatSettings.temperature,
embeddings_provider:chatSettings.embeddingsProvider
})
setSelectedChat(createdChat)
setChats(chats => [createdChat,...chats])
await createChatFiles(
newMessageFiles.map(file => ({
user_id:profile.user_id,
chat_id:createdChat.id,
file_id:file.id
}))
)
setChatFiles(prev => [...prev,...newMessageFiles])
return createdChat
}
export consthandleCreateMessages = async (
chatMessages:ChatMessage[],
currentChat:Tables<"chats">,
profile:Tables<"profiles">,
modelData:LLM,
messageContent:string,
generatedText:string,
newMessageImages:MessageImage[],
isRegeneration:boolean,
retrievedFileItems:Tables<"file_items">[],
setChatMessages:React.Dispatch<React.SetStateAction<ChatMessage[]>>,
setChatFileItems:React.Dispatch<
React.SetStateAction<Tables<"file_items">[]>
>,
setChatImages:React.Dispatch<React.SetStateAction<MessageImage[]>>,
selectedAssistant:Tables<"assistants"> | null
) => {
constfinalUserMessage:TablesInsert<"messages"> = {
chat_id:currentChat.id,
assistant_id:null,
user_id:profile.user_id,
content:messageContent,
model:modelData.modelId,
role:"user",
sequence_number:chatMessages.length,
image_paths:[]
}
constfinalAssistantMessage:TablesInsert<"messages"> = {
chat_id:currentChat.id,
assistant_id:selectedAssistant?.id || null,
user_id:profile.user_id,
content:generatedText,
model:modelData.modelId,
role:"assistant",
sequence_number:chatMessages.length + 1,
image_paths:[]
}
letfinalChatMessages:ChatMessage[] = []
if (isRegeneration) {
constlastStartingMessage = chatMessages[chatMessages.length - 1].message
constupdatedMessage = await updateMessage(lastStartingMessage.id,{
...lastStartingMessage,
content:generatedText
})
chatMessages[chatMessages.length - 1].message = updatedMessage
finalChatMessages = [...chatMessages]
setChatMessages(finalChatMessages)
} else {
constcreatedMessages = await createMessages([
finalUserMessage,
finalAssistantMessage
])

constuploadPromises = newMessageImages
.filter(obj => obj.file !== null)
.map(obj => {
letfilePath = `${profile.user_id}/${currentChat.id}/${
createdMessages[0].id
}/${uuidv4()}`
return uploadMessageImage(filePath,obj.file as File).catch(error => {
console.error(`Failed to upload image at ${filePath}:`,error)
return null
})
})
constpaths = (await Promise.all(uploadPromises)).filter(
Boolean
) as string[]
setChatImages(prevImages => [
...prevImages,
...newMessageImages.map((obj,index) => ({
...obj,
messageId:createdMessages[0].id,
path:paths[index]
}))
])
constupdatedMessage = await updateMessage(createdMessages[0].id,{
...createdMessages[0],
image_paths:paths
})
constcreatedMessageFileItems = await createMessageFileItems(
retrievedFileItems.map(fileItem => {
return {
user_id:profile.user_id,
message_id:createdMessages[1].id,
file_item_id:fileItem.id
}
})
)
finalChatMessages = [
...chatMessages,
{
message:updatedMessage,
fileItems:[]
},
{
message:createdMessages[1],
fileItems:retrievedFileItems.map(fileItem => fileItem.id)
}
]
setChatFileItems(prevFileItems => {
constnewFileItems = retrievedFileItems.filter(
fileItem => !prevFileItems.some(prevItem => prevItem.id === fileItem.id)
)
return [...prevFileItems,...newFileItems]
})
setChatMessages(finalChatMessages)
}
}

// File: components/chat/chat-hooks/use-chat-handler.tsx
import{ChatbotUIContext}from "@/context/context"
import{getAssistantCollectionsByAssistantId}from "@/db/assistant-collections"
import{getAssistantFilesByAssistantId}from "@/db/assistant-files"
import{getAssistantToolsByAssistantId}from "@/db/assistant-tools"
import{updateChat}from "@/db/chats"
import{getCollectionFilesByCollectionId}from "@/db/collection-files"
import{deleteMessagesIncludingAndAfter}from "@/db/messages"
import{buildFinalMessages}from "@/lib/build-prompt"
import{Tables}from "@/supabase/types"
import{ChatMessage,ChatPayload,LLMID,ModelProvider}from "@/types"
import{useRouter}from "next/navigation"
import{useContext,useEffect,useRef}from "react"
import{LLM_LIST}from "../../../lib/models/llm/llm-list"
import{
createTempMessages,
handleCreateChat,
handleCreateMessages,
handleHostedChat,
handleLocalChat,
handleRetrieval,
processResponse,
validateChatSettings
}from "../chat-helpers"
export constuseChatHandler = () => {
constrouter = useRouter()
const{
userInput,
chatFiles,
setUserInput,
setNewMessageImages,
profile,
setIsGenerating,
setChatMessages,
setFirstTokenReceived,
selectedChat,
selectedWorkspace,
setSelectedChat,
setChats,
setSelectedTools,
availableLocalModels,
availableOpenRouterModels,
abortController,
setAbortController,
chatSettings,
newMessageImages,
selectedAssistant,
chatMessages,
chatImages,
setChatImages,
setChatFiles,
setNewMessageFiles,
setShowFilesDisplay,
newMessageFiles,
chatFileItems,
setChatFileItems,
setToolInUse,
useRetrieval,
sourceCount,
setIsPromptPickerOpen,
setIsFilePickerOpen,
selectedTools,
selectedPreset,
setChatSettings,
models,
isPromptPickerOpen,
isFilePickerOpen,
isToolPickerOpen
} = useContext(ChatbotUIContext)
constchatInputRef = useRef<HTMLTextAreaElement>(null)
useEffect(() => {
if (!isPromptPickerOpen || !isFilePickerOpen || !isToolPickerOpen) {
chatInputRef.current?.focus()
}
},[isPromptPickerOpen,isFilePickerOpen,isToolPickerOpen])
consthandleNewChat = async () => {
if (!selectedWorkspace) return
setUserInput("")
setChatMessages([])
setSelectedChat(null)
setChatFileItems([])
setIsGenerating(false)
setFirstTokenReceived(false)
setChatFiles([])
setChatImages([])
setNewMessageFiles([])
setNewMessageImages([])
setShowFilesDisplay(false)
setIsPromptPickerOpen(false)
setIsFilePickerOpen(false)
setSelectedTools([])
setToolInUse("none")
if (selectedAssistant) {
setChatSettings({
model:selectedAssistant.model as LLMID,
prompt:selectedAssistant.prompt,
temperature:selectedAssistant.temperature,
contextLength:selectedAssistant.context_length,
includeProfileContext:selectedAssistant.include_profile_context,
includeWorkspaceInstructions:
selectedAssistant.include_workspace_instructions,
embeddingsProvider:selectedAssistant.embeddings_provider as
| "openai"
| "local"
})
letallFiles = []
constassistantFiles = (
await getAssistantFilesByAssistantId(selectedAssistant.id)
).files
allFiles = [...assistantFiles]
constassistantCollections = (
await getAssistantCollectionsByAssistantId(selectedAssistant.id)
).collections
for (constcollection of assistantCollections) {
constcollectionFiles = (
await getCollectionFilesByCollectionId(collection.id)
).files
allFiles = [...allFiles,...collectionFiles]
}
constassistantTools = (
await getAssistantToolsByAssistantId(selectedAssistant.id)
).tools
setSelectedTools(assistantTools)
setChatFiles(
allFiles.map(file => ({
id:file.id,
name:file.name,
type:file.type,
file:null
}))
)
if (allFiles.length > 0) setShowFilesDisplay(true)
} else if (selectedPreset) {
setChatSettings({
model:selectedPreset.model as LLMID,
prompt:selectedPreset.prompt,
temperature:selectedPreset.temperature,
contextLength:selectedPreset.context_length,
includeProfileContext:selectedPreset.include_profile_context,
includeWorkspaceInstructions:
selectedPreset.include_workspace_instructions,
embeddingsProvider:selectedPreset.embeddings_provider as
| "openai"
| "local"
})
} else if (selectedWorkspace) {
















}
return router.push(`/${selectedWorkspace.id}/chat`)
}
consthandleFocusChatInput = () => {
chatInputRef.current?.focus()
}
consthandleStopMessage = () => {
if (abortController) {
abortController.abort()
}
}
consthandleSendMessage = async (
messageContent:string,
chatMessages:ChatMessage[],
isRegeneration:boolean
) => {
conststartingInput = messageContent
try {
setUserInput("")
setIsGenerating(true)
setIsPromptPickerOpen(false)
setIsFilePickerOpen(false)
setNewMessageImages([])
constnewAbortController = new AbortController()
setAbortController(newAbortController)
constmodelData = [
...models.map(model => ({
modelId:model.model_id as LLMID,
modelName:model.name,
provider:"custom" as ModelProvider,
hostedId:model.id,
platformLink:"",
imageInput:false
})),
...LLM_LIST,
...availableLocalModels,
...availableOpenRouterModels
].find(llm => llm.modelId === chatSettings?.model)
validateChatSettings(
chatSettings,
modelData,
profile,
selectedWorkspace,
messageContent
)
letcurrentChat = selectedChat ? {...selectedChat} :null
constb64Images = newMessageImages.map(image => image.base64)
letretrievedFileItems:Tables<"file_items">[] = []
if (
(newMessageFiles.length > 0 || chatFiles.length > 0) &&
useRetrieval
) {
setToolInUse("retrieval")
retrievedFileItems = await handleRetrieval(
userInput,
newMessageFiles,
chatFiles,
chatSettings!.embeddingsProvider,
sourceCount
)
}
const{tempUserChatMessage,tempAssistantChatMessage} =
createTempMessages(
messageContent,
chatMessages,
chatSettings!,
b64Images,
isRegeneration,
setChatMessages,
selectedAssistant
)
letpayload:ChatPayload = {
chatSettings:chatSettings!,
workspaceInstructions:selectedWorkspace!.instructions || "",
chatMessages:isRegeneration
? [...chatMessages]
:[...chatMessages,tempUserChatMessage],
assistant:selectedChat?.assistant_id ? selectedAssistant :null,
messageFileItems:retrievedFileItems,
chatFileItems:chatFileItems
}
letgeneratedText = ""
if (selectedTools.length > 0) {
setToolInUse("Tools")
constformattedMessages = await buildFinalMessages(
payload,
profile!,
chatImages
)
constresponse = await fetch("/api/chat/tools",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
chatSettings:payload.chatSettings,
messages:formattedMessages,
selectedTools
})
})
setToolInUse("none")
generatedText = await processResponse(
response,
isRegeneration
? payload.chatMessages[payload.chatMessages.length - 1]
:tempAssistantChatMessage,
true,
newAbortController,
setFirstTokenReceived,
setChatMessages,
setToolInUse
)
} else {
if (modelData!.provider === "ollama") {
generatedText = await handleLocalChat(
payload,
profile!,
chatSettings!,
tempAssistantChatMessage,
isRegeneration,
newAbortController,
setIsGenerating,
setFirstTokenReceived,
setChatMessages,
setToolInUse
)
} else {
generatedText = await handleHostedChat(
payload,
profile!,
modelData!,
tempAssistantChatMessage,
isRegeneration,
newAbortController,
newMessageImages,
chatImages,
setIsGenerating,
setFirstTokenReceived,
setChatMessages,
setToolInUse
)
}
}
if (!currentChat) {
currentChat = await handleCreateChat(
chatSettings!,
profile!,
selectedWorkspace!,
messageContent,
selectedAssistant!,
newMessageFiles,
setSelectedChat,
setChats,
setChatFiles
)
} else {
constupdatedChat = await updateChat(currentChat.id,{
updated_at:new Date().toISOString()
})
setChats(prevChats => {
constupdatedChats = prevChats.map(prevChat =>
prevChat.id === updatedChat.id ? updatedChat :prevChat
)
return updatedChats
})
}
await handleCreateMessages(
chatMessages,
currentChat,
profile!,
modelData!,
messageContent,
generatedText,
newMessageImages,
isRegeneration,
retrievedFileItems,
setChatMessages,
setChatFileItems,
setChatImages,
selectedAssistant
)
setIsGenerating(false)
setFirstTokenReceived(false)
} catch (error) {
setIsGenerating(false)
setFirstTokenReceived(false)
setUserInput(startingInput)
}
}
consthandleSendEdit = async (
editedContent:string,
sequenceNumber:number
) => {
if (!selectedChat) return
await deleteMessagesIncludingAndAfter(
selectedChat.user_id,
selectedChat.id,
sequenceNumber
)
constfilteredMessages = chatMessages.filter(
chatMessage => chatMessage.message.sequence_number < sequenceNumber
)
setChatMessages(filteredMessages)
handleSendMessage(editedContent,filteredMessages,false)
}
return {
chatInputRef,
prompt,
handleNewChat,
handleSendMessage,
handleFocusChatInput,
handleStopMessage,
handleSendEdit
}
}

// File: components/chat/chat-hooks/use-chat-history.tsx
import{ChatbotUIContext}from "@/context/context"
import{useContext,useEffect,useState}from "react"
/**
* Custom hook for handling chat history in the chat component.
* It provides functions to set the new message content to the previous or next user message in the chat history.
*
* @returns An object containing the following functions:
*   - setNewMessageContentToPreviousUserMessage:Sets the new message content to the previous user message.
*   - setNewMessageContentToNextUserMessage:Sets the new message content to the next user message in the chat history.
*/
export constuseChatHistoryHandler = () => {
const{setUserInput,chatMessages,isGenerating} =
useContext(ChatbotUIContext)
constuserRoleString = "user"
const[messageHistoryIndex,setMessageHistoryIndex] = useState<number>(
chatMessages.length
)
useEffect(() => {

if (!isGenerating && messageHistoryIndex > chatMessages.length)
setMessageHistoryIndex(chatMessages.length)
},[chatMessages,isGenerating,messageHistoryIndex])
/**
* Sets the new message content to the previous user message.
*/
constsetNewMessageContentToPreviousUserMessage = () => {
lettempIndex = messageHistoryIndex
while (
tempIndex > 0 &&
chatMessages[tempIndex - 1].message.role !== userRoleString
) {
tempIndex--
}
constpreviousUserMessage =
chatMessages.length > 0 && tempIndex > 0
? chatMessages[tempIndex - 1]
:null
if (previousUserMessage) {
setUserInput(previousUserMessage.message.content)
setMessageHistoryIndex(tempIndex - 1)
}
}
/**
* Sets the new message content to the next user message in the chat history.
* If there is a next user message,it updates the user input and message history index accordingly.
* If there is no next user message,it resets the user input and sets the message history index to the end of the chat history.
*/
constsetNewMessageContentToNextUserMessage = () => {
lettempIndex = messageHistoryIndex
while (
tempIndex < chatMessages.length - 1 &&
chatMessages[tempIndex + 1].message.role !== userRoleString
) {
tempIndex++
}
constnextUserMessage =
chatMessages.length > 0 && tempIndex < chatMessages.length - 1
? chatMessages[tempIndex + 1]
:null
setUserInput(nextUserMessage?.message.content || "")
setMessageHistoryIndex(
nextUserMessage ? tempIndex + 1 :chatMessages.length
)
}
return {
setNewMessageContentToPreviousUserMessage,
setNewMessageContentToNextUserMessage
}
}

// File: components/chat/chat-hooks/use-prompt-and-command.tsx
import{ChatbotUIContext}from "@/context/context"
import{getAssistantCollectionsByAssistantId}from "@/db/assistant-collections"
import{getAssistantFilesByAssistantId}from "@/db/assistant-files"
import{getAssistantToolsByAssistantId}from "@/db/assistant-tools"
import{getCollectionFilesByCollectionId}from "@/db/collection-files"
import{Tables}from "@/supabase/types"
import{LLMID}from "@/types"
import{useContext}from "react"
export constusePromptAndCommand = () => {
const{
chatFiles,
setNewMessageFiles,
userInput,
setUserInput,
setShowFilesDisplay,
setIsPromptPickerOpen,
setIsFilePickerOpen,
setSlashCommand,
setHashtagCommand,
setUseRetrieval,
setToolCommand,
setIsToolPickerOpen,
setSelectedTools,
setAtCommand,
setIsAssistantPickerOpen,
setSelectedAssistant,
setChatSettings,
setChatFiles
} = useContext(ChatbotUIContext)
consthandleInputChange = (value:string) => {
constatTextRegex = /@([^ ]*)$/
constslashTextRegex = /\/([^ ]*)$/
consthashtagTextRegex = /#([^ ]*)$/
consttoolTextRegex = /!([^ ]*)$/
constatMatch = value.match(atTextRegex)
constslashMatch = value.match(slashTextRegex)
consthashtagMatch = value.match(hashtagTextRegex)
consttoolMatch = value.match(toolTextRegex)
if (atMatch) {
setIsAssistantPickerOpen(true)
setAtCommand(atMatch[1])
} else if (slashMatch) {
setIsPromptPickerOpen(true)
setSlashCommand(slashMatch[1])
} else if (hashtagMatch) {
setIsFilePickerOpen(true)
setHashtagCommand(hashtagMatch[1])
} else if (toolMatch) {
setIsToolPickerOpen(true)
setToolCommand(toolMatch[1])
} else {
setIsPromptPickerOpen(false)
setIsFilePickerOpen(false)
setIsToolPickerOpen(false)
setIsAssistantPickerOpen(false)
setSlashCommand("")
setHashtagCommand("")
setToolCommand("")
setAtCommand("")
}
setUserInput(value)
}
consthandleSelectPrompt = (prompt:Tables<"prompts">) => {
setIsPromptPickerOpen(false)
setUserInput(userInput.replace(/\/[^ ]*$/,"") + prompt.content)
}
consthandleSelectUserFile = async (file:Tables<"files">) => {
setShowFilesDisplay(true)
setIsFilePickerOpen(false)
setUseRetrieval(true)
setNewMessageFiles(prev => {
constfileAlreadySelected =
prev.some(prevFile => prevFile.id === file.id) ||
chatFiles.some(chatFile => chatFile.id === file.id)
if (!fileAlreadySelected) {
return [
...prev,
{
id:file.id,
name:file.name,
type:file.type,
file:null
}
]
}
return prev
})
setUserInput(userInput.replace(/#[^ ]*$/,""))
}
consthandleSelectUserCollection = async (
collection:Tables<"collections">
) => {
setShowFilesDisplay(true)
setIsFilePickerOpen(false)
setUseRetrieval(true)
constcollectionFiles = await getCollectionFilesByCollectionId(
collection.id
)
setNewMessageFiles(prev => {
constnewFiles = collectionFiles.files
.filter(
file =>
!prev.some(prevFile => prevFile.id === file.id) &&
!chatFiles.some(chatFile => chatFile.id === file.id)
)
.map(file => ({
id:file.id,
name:file.name,
type:file.type,
file:null
}))
return [...prev,...newFiles]
})
setUserInput(userInput.replace(/#[^ ]*$/,""))
}
consthandleSelectTool = (tool:Tables<"tools">) => {
setIsToolPickerOpen(false)
setUserInput(userInput.replace(/![^ ]*$/,""))
setSelectedTools(prev => [...prev,tool])
}
consthandleSelectAssistant = async (assistant:Tables<"assistants">) => {
setIsAssistantPickerOpen(false)
setUserInput(userInput.replace(/@[^ ]*$/,""))
setSelectedAssistant(assistant)
setChatSettings({
model:assistant.model as LLMID,
prompt:assistant.prompt,
temperature:assistant.temperature,
contextLength:assistant.context_length,
includeProfileContext:assistant.include_profile_context,
includeWorkspaceInstructions:assistant.include_workspace_instructions,
embeddingsProvider:assistant.embeddings_provider as "openai" | "local"
})
letallFiles = []
constassistantFiles = (await getAssistantFilesByAssistantId(assistant.id))
.files
allFiles = [...assistantFiles]
constassistantCollections = (
await getAssistantCollectionsByAssistantId(assistant.id)
).collections
for (constcollection of assistantCollections) {
constcollectionFiles = (
await getCollectionFilesByCollectionId(collection.id)
).files
allFiles = [...allFiles,...collectionFiles]
}
constassistantTools = (await getAssistantToolsByAssistantId(assistant.id))
.tools
setSelectedTools(assistantTools)
setChatFiles(
allFiles.map(file => ({
id:file.id,
name:file.name,
type:file.type,
file:null
}))
)
if (allFiles.length > 0) setShowFilesDisplay(true)
}
return {
handleInputChange,
handleSelectPrompt,
handleSelectUserFile,
handleSelectUserCollection,
handleSelectTool,
handleSelectAssistant
}
}

// File: components/chat/chat-hooks/use-scroll.tsx
import{ChatbotUIContext}from "@/context/context"
import{
typeUIEventHandler,
useCallback,
useContext,
useEffect,
useRef,
useState
}from "react"
export constuseScroll = () => {
const{isGenerating,chatMessages} = useContext(ChatbotUIContext)
constmessagesStartRef = useRef<HTMLDivElement>(null)
constmessagesEndRef = useRef<HTMLDivElement>(null)
constisAutoScrolling = useRef(false)
const[isAtTop,setIsAtTop] = useState(false)
const[isAtBottom,setIsAtBottom] = useState(true)
const[userScrolled,setUserScrolled] = useState(false)
const[isOverflowing,setIsOverflowing] = useState(false)
useEffect(() => {
setUserScrolled(false)
if (!isGenerating && userScrolled) {
setUserScrolled(false)
}
},[isGenerating])
useEffect(() => {
if (isGenerating && !userScrolled) {
scrollToBottom()
}
},[chatMessages])
consthandleScroll:UIEventHandler<HTMLDivElement> = useCallback(e => {
consttarget = e.target as HTMLDivElement
constbottom =
Math.round(target.scrollHeight) - Math.round(target.scrollTop) ===
Math.round(target.clientHeight)
setIsAtBottom(bottom)
consttop = target.scrollTop === 0
setIsAtTop(top)
if (!bottom && !isAutoScrolling.current) {
setUserScrolled(true)
} else {
setUserScrolled(false)
}
constisOverflow = target.scrollHeight > target.clientHeight
setIsOverflowing(isOverflow)
},[])
constscrollToTop = useCallback(() => {
if (messagesStartRef.current) {
messagesStartRef.current.scrollIntoView({behavior:"instant"})
}
},[])
constscrollToBottom = useCallback(() => {
isAutoScrolling.current = true
setTimeout(() => {
if (messagesEndRef.current) {
messagesEndRef.current.scrollIntoView({behavior:"instant"})
}
isAutoScrolling.current = false
},100)
},[])
return {
messagesStartRef,
messagesEndRef,
isAtTop,
isAtBottom,
userScrolled,
isOverflowing,
handleScroll,
scrollToTop,
scrollToBottom,
setIsAtBottom
}
}

// File: components/chat/chat-hooks/use-select-file-handler.tsx
import{ChatbotUIContext}from "@/context/context"
import{createDocXFile,createFile}from "@/db/files"
import{LLM_LIST}from "@/lib/models/llm/llm-list"
import mammoth from "mammoth"
import{useContext,useEffect,useState}from "react"
import{toast}from "sonner"
export constACCEPTED_FILE_TYPES = [
"text/csv",
"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
"application/json",
"text/markdown",
"application/pdf",
"text/plain"
].join(",")
export constuseSelectFileHandler = () => {
const{
selectedWorkspace,
profile,
chatSettings,
setNewMessageImages,
setNewMessageFiles,
setShowFilesDisplay,
setFiles,
setUseRetrieval
} = useContext(ChatbotUIContext)
const[filesToAccept,setFilesToAccept] = useState(ACCEPTED_FILE_TYPES)
useEffect(() => {
handleFilesToAccept()
},[chatSettings?.model])
consthandleFilesToAccept = () => {
constmodel = chatSettings?.model
constFULL_MODEL = LLM_LIST.find(llm => llm.modelId === model)
if (!FULL_MODEL) return
setFilesToAccept(
FULL_MODEL.imageInput
? `${ACCEPTED_FILE_TYPES},image/*`
:ACCEPTED_FILE_TYPES
)
}
consthandleSelectDeviceFile = async (file:File) => {
if (!profile || !selectedWorkspace || !chatSettings) return
setShowFilesDisplay(true)
setUseRetrieval(true)
if (file) {
letsimplifiedFileType = file.type.split("/")[1]
letreader = new FileReader()
if (file.type.includes("image")) {
reader.readAsDataURL(file)
} else if (ACCEPTED_FILE_TYPES.split(",").includes(file.type)) {
if (simplifiedFileType.includes("vnd.adobe.pdf")) {
simplifiedFileType = "pdf"
} else if (
simplifiedFileType.includes(
"vnd.openxmlformats-officedocument.wordprocessingml.document" ||
"docx"
)
) {
simplifiedFileType = "docx"
}
setNewMessageFiles(prev => [
...prev,
{
id:"loading",
name:file.name,
type:simplifiedFileType,
file:file
}
])

if (
file.type.includes(
"vnd.openxmlformats-officedocument.wordprocessingml.document" ||
"docx"
)
) {
constarrayBuffer = await file.arrayBuffer()
constresult = await mammoth.extractRawText({
arrayBuffer
})
constcreatedFile = await createDocXFile(
result.value,
file,
{
user_id:profile.user_id,
description:"",
file_path:"",
name:file.name,
size:file.size,
tokens:0,
type:simplifiedFileType
},
selectedWorkspace.id,
chatSettings.embeddingsProvider
)
setFiles(prev => [...prev,createdFile])
setNewMessageFiles(prev =>
prev.map(item =>
item.id === "loading"
? {
id:createdFile.id,
name:createdFile.name,
type:createdFile.type,
file:file
}
:item
)
)
reader.onloadend = null
return
} else {

file.type.includes("pdf")
? reader.readAsArrayBuffer(file)
:reader.readAsText(file)
}
} else {
throw new Error("Unsupported file type")
}
reader.onloadend = async function () {
try {
if (file.type.includes("image")) {

constimageUrl = URL.createObjectURL(file)

setNewMessageImages(prev => [
...prev,
{
messageId:"temp",
path:"",
base64:reader.result,
url:imageUrl,
file
}
])
} else {
constcreatedFile = await createFile(
file,
{
user_id:profile.user_id,
description:"",
file_path:"",
name:file.name,
size:file.size,
tokens:0,
type:simplifiedFileType
},
selectedWorkspace.id,
chatSettings.embeddingsProvider
)
setFiles(prev => [...prev,createdFile])
setNewMessageFiles(prev =>
prev.map(item =>
item.id === "loading"
? {
id:createdFile.id,
name:createdFile.name,
type:createdFile.type,
file:file
}
:item
)
)
}
} catch (error:any) {
toast.error("Failed to upload. " + error?.message,{
duration:10000
})
setNewMessageImages(prev =>
prev.filter(img => img.messageId !== "temp")
)
setNewMessageFiles(prev => prev.filter(file => file.id !== "loading"))
}
}
}
}
return {
handleSelectDeviceFile,
filesToAccept
}
}

// File: components/chat/chat-input.tsx
import{ChatbotUIContext}from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import{LLM_LIST}from "@/lib/models/llm/llm-list"
import{cn}from "@/lib/utils"
import{
IconBolt,
IconCirclePlus,
IconPlayerStopFilled,
IconSend
}from "@tabler/icons-react"
import Image from "next/image"
import{FC,useContext,useEffect,useRef,useState}from "react"
import{useTranslation}from "react-i18next"
import{toast}from "sonner"
import{Input}from "../ui/input"
import{TextareaAutosize}from "../ui/textarea-autosize"
import{ChatCommandInput}from "./chat-command-input"
import{ChatFilesDisplay}from "./chat-files-display"
import{useChatHandler}from "./chat-hooks/use-chat-handler"
import{useChatHistoryHandler}from "./chat-hooks/use-chat-history"
import{usePromptAndCommand}from "./chat-hooks/use-prompt-and-command"
import{useSelectFileHandler}from "./chat-hooks/use-select-file-handler"
interfaceChatInputProps {}
export constChatInput:FC<ChatInputProps> = ({}) => {
const{t} = useTranslation()
useHotkey("l",() => {
handleFocusChatInput()
})
const[isTyping,setIsTyping] = useState<boolean>(false)
const{
isAssistantPickerOpen,
focusAssistant,
setFocusAssistant,
userInput,
chatMessages,
isGenerating,
selectedPreset,
selectedAssistant,
focusPrompt,
setFocusPrompt,
focusFile,
focusTool,
setFocusTool,
isToolPickerOpen,
isPromptPickerOpen,
setIsPromptPickerOpen,
isFilePickerOpen,
setFocusFile,
chatSettings,
selectedTools,
setSelectedTools,
assistantImages
} = useContext(ChatbotUIContext)
const{
chatInputRef,
handleSendMessage,
handleStopMessage,
handleFocusChatInput
} = useChatHandler()
const{handleInputChange} = usePromptAndCommand()
const{filesToAccept,handleSelectDeviceFile} = useSelectFileHandler()
const{
setNewMessageContentToNextUserMessage,
setNewMessageContentToPreviousUserMessage
} = useChatHistoryHandler()
constfileInputRef = useRef<HTMLInputElement>(null)
useEffect(() => {
setTimeout(() => {
handleFocusChatInput()
},200) 
},[selectedPreset,selectedAssistant])
consthandleKeyDown = (event:React.KeyboardEvent) => {
if (!isTyping && event.key === "Enter" && !event.shiftKey) {
event.preventDefault()
setIsPromptPickerOpen(false)
handleSendMessage(userInput,chatMessages,false)
}

if (
isPromptPickerOpen ||
isFilePickerOpen ||
isToolPickerOpen ||
isAssistantPickerOpen
) {
if (
event.key === "Tab" ||
event.key === "ArrowUp" ||
event.key === "ArrowDown"
) {
event.preventDefault()

if (isPromptPickerOpen) setFocusPrompt(!focusPrompt)
if (isFilePickerOpen) setFocusFile(!focusFile)
if (isToolPickerOpen) setFocusTool(!focusTool)
if (isAssistantPickerOpen) setFocusAssistant(!focusAssistant)
}
}
if (event.key === "ArrowUp" && event.shiftKey && event.ctrlKey) {
event.preventDefault()
setNewMessageContentToPreviousUserMessage()
}
if (event.key === "ArrowDown" && event.shiftKey && event.ctrlKey) {
event.preventDefault()
setNewMessageContentToNextUserMessage()
}

if (event.key === "ArrowUp" && event.shiftKey && event.ctrlKey) {
event.preventDefault()
setNewMessageContentToPreviousUserMessage()
}
if (event.key === "ArrowDown" && event.shiftKey && event.ctrlKey) {
event.preventDefault()
setNewMessageContentToNextUserMessage()
}
if (
isAssistantPickerOpen &&
(event.key === "Tab" ||
event.key === "ArrowUp" ||
event.key === "ArrowDown")
) {
event.preventDefault()
setFocusAssistant(!focusAssistant)
}
}
consthandlePaste = (event:React.ClipboardEvent) => {
constimagesAllowed = LLM_LIST.find(
llm => llm.modelId === chatSettings?.model
)?.imageInput
constitems = event.clipboardData.items
for (constitem of items) {
if (item.type.indexOf("image") === 0) {
if (!imagesAllowed) {
toast.error(
`Images are not supported for this model. Use models like GPT-4 Vision instead.`
)
return
}
constfile = item.getAsFile()
if (!file) return
handleSelectDeviceFile(file)
}
}
}
return (
<>
<div className="flex flex-col flex-wrap justify-center gap-2">
<ChatFilesDisplay />
{selectedTools &&
selectedTools.map((tool,index) => (
<div
key={index}
className="flex justify-center"
onClick={() =>
setSelectedTools(
selectedTools.filter(
selectedTool => selectedTool.id !== tool.id
)
)
}
>
<div className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-purple-600 px-3 py-1 hover:opacity-50">
<IconBolt size={20} />
<div>{tool.name}</div>
</div>
</div>
))}
{selectedAssistant && (
<div className="border-primary mx-auto flex w-fit items-center space-x-2 rounded-lg border p-1.5">
{selectedAssistant.image_path && (
<Image
className="rounded"
src={
assistantImages.find(
img => img.path === selectedAssistant.image_path
)?.base64
}
width={28}
height={28}
alt={selectedAssistant.name}
/>
)}
<div className="text-sm font-bold">
Talking to {selectedAssistant.name}
</div>
</div>
)}
</div>
<div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
<div className="absolute bottom-[76px] left-0 max-h-[300px] w-full overflow-auto rounded-xl dark:border-none">
<ChatCommandInput />
</div>
<>
<IconCirclePlus
className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
size={32}
onClick={() => fileInputRef.current?.click()}
/>
{}
<Input
ref={fileInputRef}
className="hidden"
type="file"
onChange={e => {
if (!e.target.files) return
handleSelectDeviceFile(e.target.files[0])
}}
accept={filesToAccept}
/>
</>
<TextareaAutosize
textareaRef={chatInputRef}
className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
placeholder={t(

`Ask anything. Type @  /  #  !`
)}
onValueChange={handleInputChange}
value={userInput}
minRows={1}
maxRows={18}
onKeyDown={handleKeyDown}
onPaste={handlePaste}
onCompositionStart={() => setIsTyping(true)}
onCompositionEnd={() => setIsTyping(false)}
/>
<div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
{isGenerating ? (
<IconPlayerStopFilled
className="hover:bg-background animate-pulse rounded bg-transparent p-1"
onClick={handleStopMessage}
size={30}
/>
) :(
<IconSend
className={cn(
"bg-primary text-secondary rounded p-1",
!userInput && "cursor-not-allowed opacity-50"
)}
onClick={() => {
if (!userInput) return
handleSendMessage(userInput,chatMessages,false)
}}
size={30}
/>
)}
</div>
</div>
</>
)
}

// File: components/chat/chat-messages.tsx
import{useChatHandler}from "@/components/chat/chat-hooks/use-chat-handler"
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{FC,useContext,useState}from "react"
import{Message}from "../messages/message"
interfaceChatMessagesProps {}
export constChatMessages:FC<ChatMessagesProps> = ({}) => {
const{chatMessages,chatFileItems} = useContext(ChatbotUIContext)
const{handleSendEdit} = useChatHandler()
const[editingMessage,setEditingMessage] = useState<Tables<"messages">>()
return chatMessages
.sort((a,b) => a.message.sequence_number - b.message.sequence_number)
.map((chatMessage,index,array) => {
constmessageFileItems = chatFileItems.filter(
(chatFileItem,_,self) =>
chatMessage.fileItems.includes(chatFileItem.id) &&
self.findIndex(item => item.id === chatFileItem.id) === _
)
return (
<Message
key={chatMessage.message.sequence_number}
message={chatMessage.message}
fileItems={messageFileItems}
isEditing={editingMessage?.id === chatMessage.message.id}
isLast={index === array.length - 1}
onStartEdit={setEditingMessage}
onCancelEdit={() => setEditingMessage(undefined)}
onSubmitEdit={handleSendEdit}
/>
)
})
}

// File: components/chat/chat-retrieval-settings.tsx
import{ChatbotUIContext}from "@/context/context"
import{IconAdjustmentsHorizontal}from "@tabler/icons-react"
import{FC,useContext,useState}from "react"
import{Button}from "../ui/button"
import{
Dialog,
DialogContent,
DialogFooter,
DialogTrigger
}from "../ui/dialog"
import{Label}from "../ui/label"
import{Slider}from "../ui/slider"
import{WithTooltip}from "../ui/with-tooltip"
interfaceChatRetrievalSettingsProps {}
export constChatRetrievalSettings:FC<ChatRetrievalSettingsProps> = ({}) => {
const{sourceCount,setSourceCount} = useContext(ChatbotUIContext)
const[isOpen,setIsOpen] = useState(false)
return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
<DialogTrigger>
<WithTooltip
delayDuration={0}
side="top"
display={<div>Adjust retrieval settings.</div>}
trigger={
<IconAdjustmentsHorizontal
className="cursor-pointer pt-[4px] hover:opacity-50"
size={24}
/>
}
/>
</DialogTrigger>
<DialogContent>
<div className="space-y-3">
<Label className="flex items-center space-x-1">
<div>Source Count:</div>
<div>{sourceCount}</div>
</Label>
<Slider
value={[sourceCount]}
onValueChange={values => {
setSourceCount(values[0])
}}
min={1}
max={10}
step={1}
/>
</div>
<DialogFooter>
<Button size="sm" onClick={() => setIsOpen(false)}>
Save & Close
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)
}

// File: components/chat/chat-scroll-buttons.tsx
import{
IconCircleArrowDownFilled,
IconCircleArrowUpFilled
}from "@tabler/icons-react"
import{FC}from "react"
interfaceChatScrollButtonsProps {
isAtTop:boolean
isAtBottom:boolean
isOverflowing:boolean
scrollToTop:() => void
scrollToBottom:() => void
}
export constChatScrollButtons:FC<ChatScrollButtonsProps> = ({
isAtTop,
isAtBottom,
isOverflowing,
scrollToTop,
scrollToBottom
}) => {
return (
<>
{!isAtTop && isOverflowing && (
<IconCircleArrowUpFilled
className="cursor-pointer opacity-50 hover:opacity-100"
size={32}
onClick={scrollToTop}
/>
)}
{!isAtBottom && isOverflowing && (
<IconCircleArrowDownFilled
className="cursor-pointer opacity-50 hover:opacity-100"
size={32}
onClick={scrollToBottom}
/>
)}
</>
)
}

// File: components/chat/chat-secondary-buttons.tsx
import{useChatHandler}from "@/components/chat/chat-hooks/use-chat-handler"
import{ChatbotUIContext}from "@/context/context"
import{IconInfoCircle,IconMessagePlus}from "@tabler/icons-react"
import{FC,useContext}from "react"
import{WithTooltip}from "../ui/with-tooltip"
interfaceChatSecondaryButtonsProps {}
export constChatSecondaryButtons:FC<ChatSecondaryButtonsProps> = ({}) => {
const{selectedChat} = useContext(ChatbotUIContext)
const{handleNewChat} = useChatHandler()
return (
<>
{selectedChat && (
<>
<WithTooltip
delayDuration={200}
display={
<div>
<div className="text-xl font-bold">Chat Info</div>
<div className="mx-auto mt-2 max-w-xs space-y-2 sm:max-w-sm md:max-w-md lg:max-w-lg">
<div>Model:{selectedChat.model}</div>
<div>Prompt:{selectedChat.prompt}</div>
<div>Temperature:{selectedChat.temperature}</div>
<div>Context Length:{selectedChat.context_length}</div>
<div>
Profile Context:{" "}
{selectedChat.include_profile_context
? "Enabled"
:"Disabled"}
</div>
<div>
{" "}
Workspace Instructions:{" "}
{selectedChat.include_workspace_instructions
? "Enabled"
:"Disabled"}
</div>
<div>
Embeddings Provider:{selectedChat.embeddings_provider}
</div>
</div>
</div>
}
trigger={
<div className="mt-1">
<IconInfoCircle
className="cursor-default hover:opacity-50"
size={24}
/>
</div>
}
/>
<WithTooltip
delayDuration={200}
display={<div>Start a new chat</div>}
trigger={
<div className="mt-1">
<IconMessagePlus
className="cursor-pointer hover:opacity-50"
size={24}
onClick={handleNewChat}
/>
</div>
}
/>
</>
)}
</>
)
}

// File: components/chat/chat-settings.tsx
import{ChatbotUIContext}from "@/context/context"
import{CHAT_SETTING_LIMITS}from "@/lib/chat-setting-limits"
import useHotkey from "@/lib/hooks/use-hotkey"
import{LLMID,ModelProvider}from "@/types"
import{IconAdjustmentsHorizontal}from "@tabler/icons-react"
import{FC,useContext,useEffect,useRef}from "react"
import{Button}from "../ui/button"
import{ChatSettingsForm}from "../ui/chat-settings-form"
import{Popover,PopoverContent,PopoverTrigger}from "../ui/popover"
interfaceChatSettingsProps {}
export constChatSettings:FC<ChatSettingsProps> = ({}) => {
useHotkey("i",() => handleClick())
const{
chatSettings,
setChatSettings,
models,
availableHostedModels,
availableLocalModels,
availableOpenRouterModels
} = useContext(ChatbotUIContext)
constbuttonRef = useRef<HTMLButtonElement>(null)
consthandleClick = () => {
if (buttonRef.current) {
buttonRef.current.click()
}
}
useEffect(() => {
if (!chatSettings) return
setChatSettings({
...chatSettings,
temperature:Math.min(
chatSettings.temperature,
CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_TEMPERATURE || 1
),
contextLength:Math.min(
chatSettings.contextLength,
CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_CONTEXT_LENGTH || 4096
)
})
},[chatSettings?.model])
if (!chatSettings) return null
constallModels = [
...models.map(model => ({
modelId:model.model_id as LLMID,
modelName:model.name,
provider:"custom" as ModelProvider,
hostedId:model.id,
platformLink:"",
imageInput:false
})),
...availableHostedModels,
...availableLocalModels,
...availableOpenRouterModels
]
constfullModel = allModels.find(llm => llm.modelId === chatSettings.model)
return (
<Popover>
<PopoverTrigger>
<Button
ref={buttonRef}
className="flex items-center space-x-2"
variant="ghost"
>
<div className="max-w-[120px] truncate text-lg sm:max-w-[300px] lg:max-w-[500px]">
{fullModel?.modelName || chatSettings.model}
</div>
<IconAdjustmentsHorizontal size={28} />
</Button>
</PopoverTrigger>
<PopoverContent
className="bg-background border-input relative flex max-h-[calc(100vh-60px)] w-[300px] flex-col space-y-4 overflow-auto rounded-lg border-2 p-6 sm:w-[350px] md:w-[400px] lg:w-[500px] dark:border-none"
align="end"
>
<ChatSettingsForm
chatSettings={chatSettings}
onChangeChatSettings={setChatSettings}
/>
</PopoverContent>
</Popover>
)
}

// File: components/chat/chat-ui.tsx
import Loading from "@/app/[locale]/loading"
import{useChatHandler}from "@/components/chat/chat-hooks/use-chat-handler"
import{ChatbotUIContext}from "@/context/context"
import{getAssistantToolsByAssistantId}from "@/db/assistant-tools"
import{getChatFilesByChatId}from "@/db/chat-files"
import{getChatById}from "@/db/chats"
import{getMessageFileItemsByMessageId}from "@/db/message-file-items"
import{getMessagesByChatId}from "@/db/messages"
import{getMessageImageFromStorage}from "@/db/storage/message-images"
import{convertBlobToBase64}from "@/lib/blob-to-b64"
import useHotkey from "@/lib/hooks/use-hotkey"
import{LLMID,MessageImage}from "@/types"
import{useParams}from "next/navigation"
import{FC,useContext,useEffect,useState}from "react"
import{ChatHelp}from "./chat-help"
import{useScroll}from "./chat-hooks/use-scroll"
import{ChatInput}from "./chat-input"
import{ChatMessages}from "./chat-messages"
import{ChatScrollButtons}from "./chat-scroll-buttons"
import{ChatSecondaryButtons}from "./chat-secondary-buttons"
interfaceChatUIProps {}
export constChatUI:FC<ChatUIProps> = ({}) => {
useHotkey("o",() => handleNewChat())
constparams = useParams()
const{
setChatMessages,
selectedChat,
setSelectedChat,
setChatSettings,
setChatImages,
assistants,
setSelectedAssistant,
setChatFileItems,
setChatFiles,
setShowFilesDisplay,
setUseRetrieval,
setSelectedTools
} = useContext(ChatbotUIContext)
const{handleNewChat,handleFocusChatInput} = useChatHandler()
const{
messagesStartRef,
messagesEndRef,
handleScroll,
scrollToBottom,
setIsAtBottom,
isAtTop,
isAtBottom,
isOverflowing,
scrollToTop
} = useScroll()
const[loading,setLoading] = useState(true)
useEffect(() => {
constfetchData = async () => {
await fetchMessages()
await fetchChat()
scrollToBottom()
setIsAtBottom(true)
}
if (params.chatid) {
fetchData().then(() => {
handleFocusChatInput()
setLoading(false)
})
} else {
setLoading(false)
}
},[])
constfetchMessages = async () => {
constfetchedMessages = await getMessagesByChatId(params.chatid as string)
constimagePromises:Promise<MessageImage>[] = fetchedMessages.flatMap(
message =>
message.image_paths
? message.image_paths.map(async imagePath => {
consturl = await getMessageImageFromStorage(imagePath)
if (url) {
constresponse = await fetch(url)
constblob = await response.blob()
constbase64 = await convertBlobToBase64(blob)
return {
messageId:message.id,
path:imagePath,
base64,
url,
file:null
}
}
return {
messageId:message.id,
path:imagePath,
base64:"",
url,
file:null
}
})
:[]
)
constimages:MessageImage[] = await Promise.all(imagePromises.flat())
setChatImages(images)
constmessageFileItemPromises = fetchedMessages.map(
async message => await getMessageFileItemsByMessageId(message.id)
)
constmessageFileItems = await Promise.all(messageFileItemPromises)
constuniqueFileItems = messageFileItems.flatMap(item => item.file_items)
setChatFileItems(uniqueFileItems)
constchatFiles = await getChatFilesByChatId(params.chatid as string)
setChatFiles(
chatFiles.files.map(file => ({
id:file.id,
name:file.name,
type:file.type,
file:null
}))
)
setUseRetrieval(true)
setShowFilesDisplay(true)
constfetchedChatMessages = fetchedMessages.map(message => {
return {
message,
fileItems:messageFileItems
.filter(messageFileItem => messageFileItem.id === message.id)
.flatMap(messageFileItem =>
messageFileItem.file_items.map(fileItem => fileItem.id)
)
}
})
setChatMessages(fetchedChatMessages)
}
constfetchChat = async () => {
constchat = await getChatById(params.chatid as string)
if (!chat) return
if (chat.assistant_id) {
constassistant = assistants.find(
assistant => assistant.id === chat.assistant_id
)
if (assistant) {
setSelectedAssistant(assistant)
constassistantTools = (
await getAssistantToolsByAssistantId(assistant.id)
).tools
setSelectedTools(assistantTools)
}
}
setSelectedChat(chat)
setChatSettings({
model:chat.model as LLMID,
prompt:chat.prompt,
temperature:chat.temperature,
contextLength:chat.context_length,
includeProfileContext:chat.include_profile_context,
includeWorkspaceInstructions:chat.include_workspace_instructions,
embeddingsProvider:chat.embeddings_provider as "openai" | "local"
})
}
if (loading) {
return <Loading />
}
return (
<div className="relative flex h-full flex-col items-center">
<div className="absolute left-4 top-2.5 flex justify-center">
<ChatScrollButtons
isAtTop={isAtTop}
isAtBottom={isAtBottom}
isOverflowing={isOverflowing}
scrollToTop={scrollToTop}
scrollToBottom={scrollToBottom}
/>
</div>
<div className="absolute right-4 top-1 flex h-[40px] items-center space-x-2">
<ChatSecondaryButtons />
</div>
<div className="bg-secondary flex max-h-[50px] min-h-[50px] w-full items-center justify-center border-b-2 font-bold">
<div className="max-w-[200px] truncate sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
{selectedChat?.name || "Chat"}
</div>
</div>
<div
className="flex size-full flex-col overflow-auto border-b"
onScroll={handleScroll}
>
<div ref={messagesStartRef} />
<ChatMessages />
<div ref={messagesEndRef} />
</div>
<div className="relative w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
<ChatInput />
</div>
<div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
<ChatHelp />
</div>
</div>
)
}

// File: components/chat/file-picker.tsx
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{IconBooks}from "@tabler/icons-react"
import{FC,useContext,useEffect,useRef}from "react"
import{FileIcon}from "../ui/file-icon"
interfaceFilePickerProps {
isOpen:boolean
searchQuery:string
onOpenChange:(isOpen:boolean) => void
selectedFileIds:string[]
selectedCollectionIds:string[]
onSelectFile:(file:Tables<"files">) => void
onSelectCollection:(collection:Tables<"collections">) => void
isFocused:boolean
}
export constFilePicker:FC<FilePickerProps> = ({
isOpen,
searchQuery,
onOpenChange,
selectedFileIds,
selectedCollectionIds,
onSelectFile,
onSelectCollection,
isFocused
}) => {
const{files,collections,setIsFilePickerOpen} =
useContext(ChatbotUIContext)
constitemsRef = useRef<(HTMLDivElement | null)[]>([])
useEffect(() => {
if (isFocused && itemsRef.current[0]) {
itemsRef.current[0].focus()
}
},[isFocused])
constfilteredFiles = files.filter(
file =>
file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
!selectedFileIds.includes(file.id)
)
constfilteredCollections = collections.filter(
collection =>
collection.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
!selectedCollectionIds.includes(collection.id)
)
consthandleOpenChange = (isOpen:boolean) => {
onOpenChange(isOpen)
}
consthandleSelectFile = (file:Tables<"files">) => {
onSelectFile(file)
handleOpenChange(false)
}
consthandleSelectCollection = (collection:Tables<"collections">) => {
onSelectCollection(collection)
handleOpenChange(false)
}
constgetKeyDownHandler =
(index:number,type:"file" | "collection",item:any) =>
(e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Escape") {
e.preventDefault()
setIsFilePickerOpen(false)
} else if (e.key === "Backspace") {
e.preventDefault()
} else if (e.key === "Enter") {
e.preventDefault()
if (type=== "file") {
handleSelectFile(item)
} else {
handleSelectCollection(item)
}
} else if (
(e.key === "Tab" || e.key === "ArrowDown") &&
!e.shiftKey &&
index === filteredFiles.length + filteredCollections.length - 1
) {
e.preventDefault()
itemsRef.current[0]?.focus()
} else if (e.key === "ArrowUp" && !e.shiftKey && index === 0) {

e.preventDefault()
itemsRef.current[itemsRef.current.length - 1]?.focus()
} else if (e.key === "ArrowUp") {
e.preventDefault()
constprevIndex =
index - 1 >= 0 ? index - 1 :itemsRef.current.length - 1
itemsRef.current[prevIndex]?.focus()
} else if (e.key === "ArrowDown") {
e.preventDefault()
constnextIndex = index + 1 < itemsRef.current.length ? index + 1 :0
itemsRef.current[nextIndex]?.focus()
}
}
return (
<>
{isOpen && (
<div className="bg-background flex flex-col space-y-1 rounded-xl border-2 p-2 text-sm">
{filteredFiles.length === 0 && filteredCollections.length === 0 ? (
<div className="text-md flex h-14 cursor-pointer items-center justify-center italic hover:opacity-50">
No matching files.
</div>
) :(
<>
{[...filteredFiles,...filteredCollections].map((item,index) => (
<div
key={item.id}
ref={ref => {
itemsRef.current[index] = ref
}}
tabIndex={0}
className="hover:bg-accent focus:bg-accent flex cursor-pointer items-center rounded p-2 focus:outline-none"
onClick={() => {
if ("type" in item) {
handleSelectFile(item as Tables<"files">)
} else {
handleSelectCollection(item)
}
}}
onKeyDown={e =>
getKeyDownHandler(
index,
"type" in item ? "file" :"collection",
item
)(e)
}
>
{"type" in item ? (
<FileIcon type={(item as Tables<"files">).type} size={32} />
) :(
<IconBooks size={32} />
)}
<div className="ml-3 flex flex-col">
<div className="font-bold">{item.name}</div>
<div className="truncate text-sm opacity-80">
{item.description || "No description."}
</div>
</div>
</div>
))}
</>
)}
</div>
)}
</>
)
}

// File: components/chat/prompt-picker.tsx
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{FC,useContext,useEffect,useRef,useState}from "react"
import{Button}from "../ui/button"
import{Dialog,DialogContent,DialogHeader,DialogTitle}from "../ui/dialog"
import{Label}from "../ui/label"
import{TextareaAutosize}from "../ui/textarea-autosize"
import{usePromptAndCommand}from "./chat-hooks/use-prompt-and-command"
interfacePromptPickerProps {}
export constPromptPicker:FC<PromptPickerProps> = ({}) => {
const{
prompts,
isPromptPickerOpen,
setIsPromptPickerOpen,
focusPrompt,
slashCommand
} = useContext(ChatbotUIContext)
const{handleSelectPrompt} = usePromptAndCommand()
constitemsRef = useRef<(HTMLDivElement | null)[]>([])
const[promptVariables,setPromptVariables] = useState<
{
promptId:string
name:string
value:string
}[]
>([])
const[showPromptVariables,setShowPromptVariables] = useState(false)
useEffect(() => {
if (focusPrompt && itemsRef.current[0]) {
itemsRef.current[0].focus()
}
},[focusPrompt])
const[isTyping,setIsTyping] = useState(false)
constfilteredPrompts = prompts.filter(prompt =>
prompt.name.toLowerCase().includes(slashCommand.toLowerCase())
)
consthandleOpenChange = (isOpen:boolean) => {
setIsPromptPickerOpen(isOpen)
}
constcallSelectPrompt = (prompt:Tables<"prompts">) => {
constregex = /\{\{.*?\}\}/g
constmatches = prompt.content.match(regex)
if (matches) {
constnewPromptVariables = matches.map(match => ({
promptId:prompt.id,
name:match.replace(/\{\{|\}\}/g,""),
value:""
}))
setPromptVariables(newPromptVariables)
setShowPromptVariables(true)
} else {
handleSelectPrompt(prompt)
handleOpenChange(false)
}
}
constgetKeyDownHandler =
(index:number) => (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Backspace") {
e.preventDefault()
handleOpenChange(false)
} else if (e.key === "Enter") {
e.preventDefault()
callSelectPrompt(filteredPrompts[index])
} else if (
(e.key === "Tab" || e.key === "ArrowDown") &&
!e.shiftKey &&
index === filteredPrompts.length - 1
) {
e.preventDefault()
itemsRef.current[0]?.focus()
} else if (e.key === "ArrowUp" && !e.shiftKey && index === 0) {

e.preventDefault()
itemsRef.current[itemsRef.current.length - 1]?.focus()
} else if (e.key === "ArrowUp") {
e.preventDefault()
constprevIndex =
index - 1 >= 0 ? index - 1 :itemsRef.current.length - 1
itemsRef.current[prevIndex]?.focus()
} else if (e.key === "ArrowDown") {
e.preventDefault()
constnextIndex = index + 1 < itemsRef.current.length ? index + 1 :0
itemsRef.current[nextIndex]?.focus()
}
}
consthandleSubmitPromptVariables = () => {
constnewPromptContent = promptVariables.reduce(
(prevContent,variable) =>
prevContent.replace(
new RegExp(`\\{\\{${variable.name}\\}\\}`,"g"),
variable.value
),
prompts.find(prompt => prompt.id === promptVariables[0].promptId)
?.content || ""
)
constnewPrompt:any = {
...prompts.find(prompt => prompt.id === promptVariables[0].promptId),
content:newPromptContent
}
handleSelectPrompt(newPrompt)
handleOpenChange(false)
setShowPromptVariables(false)
setPromptVariables([])
}
consthandleCancelPromptVariables = () => {
setShowPromptVariables(false)
setPromptVariables([])
}
consthandleKeydownPromptVariables = (
e:React.KeyboardEvent<HTMLDivElement>
) => {
if (!isTyping && e.key === "Enter" && !e.shiftKey) {
e.preventDefault()
handleSubmitPromptVariables()
}
}
return (
<>
{isPromptPickerOpen && (
<div className="bg-background flex flex-col space-y-1 rounded-xl border-2 p-2 text-sm">
{showPromptVariables ? (
<Dialog
open={showPromptVariables}
onOpenChange={setShowPromptVariables}
>
<DialogContent onKeyDown={handleKeydownPromptVariables}>
<DialogHeader>
<DialogTitle>Enter Prompt Variables</DialogTitle>
</DialogHeader>
<div className="mt-2 space-y-6">
{promptVariables.map((variable,index) => (
<div key={index} className="flex flex-col space-y-2">
<Label>{variable.name}</Label>
<TextareaAutosize
placeholder={`Enter a value for ${variable.name}...`}
value={variable.value}
onValueChange={value => {
constnewPromptVariables = [...promptVariables]
newPromptVariables[index].value = value
setPromptVariables(newPromptVariables)
}}
minRows={3}
maxRows={5}
onCompositionStart={() => setIsTyping(true)}
onCompositionEnd={() => setIsTyping(false)}
/>
</div>
))}
</div>
<div className="mt-2 flex justify-end space-x-2">
<Button
variant="ghost"
size="sm"
onClick={handleCancelPromptVariables}
>
Cancel
</Button>
<Button size="sm" onClick={handleSubmitPromptVariables}>
Submit
</Button>
</div>
</DialogContent>
</Dialog>
) :filteredPrompts.length === 0 ? (
<div className="text-md flex h-14 cursor-pointer items-center justify-center italic hover:opacity-50">
No matching prompts.
</div>
) :(
filteredPrompts.map((prompt,index) => (
<div
key={prompt.id}
ref={ref => {
itemsRef.current[index] = ref
}}
tabIndex={0}
className="hover:bg-accent focus:bg-accent flex cursor-pointer flex-col rounded p-2 focus:outline-none"
onClick={() => callSelectPrompt(prompt)}
onKeyDown={getKeyDownHandler(index)}
>
<div className="font-bold">{prompt.name}</div>
<div className="truncate text-sm opacity-80">
{prompt.content}
</div>
</div>
))
)}
</div>
)}
</>
)
}

// File: components/chat/quick-setting-option.tsx
import{LLM_LIST}from "@/lib/models/llm/llm-list"
import{Tables}from "@/supabase/types"
import{IconCircleCheckFilled,IconRobotFace}from "@tabler/icons-react"
import Image from "next/image"
import{FC}from "react"
import{ModelIcon}from "../models/model-icon"
import{DropdownMenuItem}from "../ui/dropdown-menu"
interfaceQuickSettingOptionProps {
contentType:"presets" | "assistants"
isSelected:boolean
item:Tables<"presets"> | Tables<"assistants">
onSelect:() => void
image:string
}
export constQuickSettingOption:FC<QuickSettingOptionProps> = ({
contentType,
isSelected,
item,
onSelect,
image
}) => {
constmodelDetails = LLM_LIST.find(model => model.modelId === item.model)
return (
<DropdownMenuItem
tabIndex={0}
className="cursor-pointer items-center"
onSelect={onSelect}
>
<div className="w-[32px]">
{contentType === "presets" ? (
<ModelIcon
provider={modelDetails?.provider || "custom"}
width={32}
height={32}
/>
) :image ? (
<Image
style={{width:"32px",height:"32px"}}
className="rounded"
src={image}
alt="Assistant"
width={32}
height={32}
/>
) :(
<IconRobotFace
className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
size={32}
/>
)}
</div>
<div className="ml-4 flex grow flex-col space-y-1">
<div className="text-md font-bold">{item.name}</div>
{item.description && (
<div className="text-sm font-light">{item.description}</div>
)}
</div>
<div className="min-w-[40px]">
{isSelected ? (
<IconCircleCheckFilled className="ml-4" size={20} />
) :null}
</div>
</DropdownMenuItem>
)
}

// File: components/chat/quick-settings.tsx
import{ChatbotUIContext}from "@/context/context"
import{getAssistantCollectionsByAssistantId}from "@/db/assistant-collections"
import{getAssistantFilesByAssistantId}from "@/db/assistant-files"
import{getAssistantToolsByAssistantId}from "@/db/assistant-tools"
import{getCollectionFilesByCollectionId}from "@/db/collection-files"
import useHotkey from "@/lib/hooks/use-hotkey"
import{LLM_LIST}from "@/lib/models/llm/llm-list"
import{Tables}from "@/supabase/types"
import{LLMID}from "@/types"
import{IconChevronDown,IconRobotFace}from "@tabler/icons-react"
import Image from "next/image"
import{FC,useContext,useEffect,useRef,useState}from "react"
import{useTranslation}from "react-i18next"
import{ModelIcon}from "../models/model-icon"
import{Button}from "../ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuTrigger
}from "../ui/dropdown-menu"
import{Input}from "../ui/input"
import{QuickSettingOption}from "./quick-setting-option"
import{set}from "date-fns"
interfaceQuickSettingsProps {}
export constQuickSettings:FC<QuickSettingsProps> = ({}) => {
const{t} = useTranslation()
useHotkey("p",() => setIsOpen(prevState => !prevState))
const{
presets,
assistants,
selectedAssistant,
selectedPreset,
chatSettings,
setSelectedPreset,
setSelectedAssistant,
setChatSettings,
assistantImages,
setChatFiles,
setSelectedTools,
setShowFilesDisplay,
selectedWorkspace
} = useContext(ChatbotUIContext)
constinputRef = useRef<HTMLInputElement>(null)
const[isOpen,setIsOpen] = useState(false)
const[search,setSearch] = useState("")
const[loading,setLoading] = useState(false)
useEffect(() => {
if (isOpen) {
setTimeout(() => {
inputRef.current?.focus()
},100) 
}
},[isOpen])
consthandleSelectQuickSetting = async (
item:Tables<"presets"> | Tables<"assistants"> | null,
contentType:"presets" | "assistants" | "remove"
) => {
console.log({item,contentType})
if (contentType === "assistants" && item) {
setSelectedAssistant(item as Tables<"assistants">)
setLoading(true)
letallFiles = []
constassistantFiles = (await getAssistantFilesByAssistantId(item.id))
.files
allFiles = [...assistantFiles]
constassistantCollections = (
await getAssistantCollectionsByAssistantId(item.id)
).collections
for (constcollection of assistantCollections) {
constcollectionFiles = (
await getCollectionFilesByCollectionId(collection.id)
).files
allFiles = [...allFiles,...collectionFiles]
}
constassistantTools = (await getAssistantToolsByAssistantId(item.id))
.tools
setSelectedTools(assistantTools)
setChatFiles(
allFiles.map(file => ({
id:file.id,
name:file.name,
type:file.type,
file:null
}))
)
if (allFiles.length > 0) setShowFilesDisplay(true)
setLoading(false)
setSelectedPreset(null)
} else if (contentType === "presets" && item) {
setSelectedPreset(item as Tables<"presets">)
setSelectedAssistant(null)
setChatFiles([])
setSelectedTools([])
} else {
setSelectedPreset(null)
setSelectedAssistant(null)
setChatFiles([])
setSelectedTools([])
if (selectedWorkspace) {
setChatSettings({
model:selectedWorkspace.default_model as LLMID,
prompt:selectedWorkspace.default_prompt,
temperature:selectedWorkspace.default_temperature,
contextLength:selectedWorkspace.default_context_length,
includeProfileContext:selectedWorkspace.include_profile_context,
includeWorkspaceInstructions:
selectedWorkspace.include_workspace_instructions,
embeddingsProvider:selectedWorkspace.embeddings_provider as
| "openai"
| "local"
})
}
return
}
setChatSettings({
model:item.model as LLMID,
prompt:item.prompt,
temperature:item.temperature,
contextLength:item.context_length,
includeProfileContext:item.include_profile_context,
includeWorkspaceInstructions:item.include_workspace_instructions,
embeddingsProvider:item.embeddings_provider as "openai" | "local"
})
}
constcheckIfModified = () => {
if (!chatSettings) return false
if (selectedPreset) {
return (
selectedPreset.include_profile_context !==
chatSettings?.includeProfileContext ||
selectedPreset.include_workspace_instructions !==
chatSettings.includeWorkspaceInstructions ||
selectedPreset.context_length !== chatSettings.contextLength ||
selectedPreset.model !== chatSettings.model ||
selectedPreset.prompt !== chatSettings.prompt ||
selectedPreset.temperature !== chatSettings.temperature
)
} else if (selectedAssistant) {
return (
selectedAssistant.include_profile_context !==
chatSettings.includeProfileContext ||
selectedAssistant.include_workspace_instructions !==
chatSettings.includeWorkspaceInstructions ||
selectedAssistant.context_length !== chatSettings.contextLength ||
selectedAssistant.model !== chatSettings.model ||
selectedAssistant.prompt !== chatSettings.prompt ||
selectedAssistant.temperature !== chatSettings.temperature
)
}
return false
}
constisModified = checkIfModified()
constitems = [
...presets.map(preset => ({...preset,contentType:"presets"})),
...assistants.map(assistant => ({
...assistant,
contentType:"assistants"
}))
]
constselectedAssistantImage = selectedPreset
? ""
:assistantImages.find(
image => image.path === selectedAssistant?.image_path
)?.base64 || ""
constmodelDetails = LLM_LIST.find(
model => model.modelId === selectedPreset?.model
)
return (
<DropdownMenu
open={isOpen}
onOpenChange={isOpen => {
setIsOpen(isOpen)
setSearch("")
}}
>
<DropdownMenuTrigger asChild className="max-w-[400px]" disabled={loading}>
<Button variant="ghost" className="flex space-x-3 text-lg">
{selectedPreset && (
<ModelIcon
provider={modelDetails?.provider || "custom"}
width={32}
height={32}
/>
)}
{selectedAssistant &&
(selectedAssistantImage ? (
<Image
className="rounded"
src={selectedAssistantImage}
alt="Assistant"
width={28}
height={28}
/>
) :(
<IconRobotFace
className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
size={28}
/>
))}
{loading ? (
<div className="animate-pulse">Loading assistant...</div>
) :(
<>
<div className="overflow-hidden text-ellipsis">
{isModified &&
(selectedPreset || selectedAssistant) &&
"Modified "}
{selectedPreset?.name ||
selectedAssistant?.name ||
t("Quick Settings")}
</div>
<IconChevronDown className="ml-1" />
</>
)}
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent
className="min-w-[300px] max-w-[500px] space-y-4"
align="start"
>
{presets.length === 0 && assistants.length === 0 ? (
<div className="p-8 text-center">No items found.</div>
) :(
<>
<Input
ref={inputRef}
className="w-full"
placeholder="Search..."
value={search}
onChange={e => setSearch(e.target.value)}
onKeyDown={e => e.stopPropagation()}
/>
{!!(selectedPreset || selectedAssistant) && (
<QuickSettingOption
contentType={selectedPreset ? "presets" :"assistants"}
isSelected={true}
item={
selectedPreset ||
(selectedAssistant as
| Tables<"presets">
| Tables<"assistants">)
}
onSelect={() => {
handleSelectQuickSetting(null,"remove")
}}
image={selectedPreset ? "" :selectedAssistantImage}
/>
)}
{items
.filter(
item =>
item.name.toLowerCase().includes(search.toLowerCase()) &&
item.id !== selectedPreset?.id &&
item.id !== selectedAssistant?.id
)
.map(({contentType,...item}) => (
<QuickSettingOption
key={item.id}
contentType={contentType as "presets" | "assistants"}
isSelected={false}
item={item}
onSelect={() =>
handleSelectQuickSetting(
item,
contentType as "presets" | "assistants"
)
}
image={
contentType === "assistants"
? assistantImages.find(
image =>
image.path ===
(item as Tables<"assistants">).image_path
)?.base64 || ""
:""
}
/>
))}
</>
)}
</DropdownMenuContent>
</DropdownMenu>
)
}

// File: components/chat/tool-picker.tsx
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{IconBolt}from "@tabler/icons-react"
import{FC,useContext,useEffect,useRef}from "react"
import{usePromptAndCommand}from "./chat-hooks/use-prompt-and-command"
interfaceToolPickerProps {}
export constToolPicker:FC<ToolPickerProps> = ({}) => {
const{
tools,
focusTool,
toolCommand,
isToolPickerOpen,
setIsToolPickerOpen
} = useContext(ChatbotUIContext)
const{handleSelectTool} = usePromptAndCommand()
constitemsRef = useRef<(HTMLDivElement | null)[]>([])
useEffect(() => {
if (focusTool && itemsRef.current[0]) {
itemsRef.current[0].focus()
}
},[focusTool])
constfilteredTools = tools.filter(tool =>
tool.name.toLowerCase().includes(toolCommand.toLowerCase())
)
consthandleOpenChange = (isOpen:boolean) => {
setIsToolPickerOpen(isOpen)
}
constcallSelectTool = (tool:Tables<"tools">) => {
handleSelectTool(tool)
handleOpenChange(false)
}
constgetKeyDownHandler =
(index:number) => (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Backspace") {
e.preventDefault()
handleOpenChange(false)
} else if (e.key === "Enter") {
e.preventDefault()
callSelectTool(filteredTools[index])
} else if (
(e.key === "Tab" || e.key === "ArrowDown") &&
!e.shiftKey &&
index === filteredTools.length - 1
) {
e.preventDefault()
itemsRef.current[0]?.focus()
} else if (e.key === "ArrowUp" && !e.shiftKey && index === 0) {

e.preventDefault()
itemsRef.current[itemsRef.current.length - 1]?.focus()
} else if (e.key === "ArrowUp") {
e.preventDefault()
constprevIndex =
index - 1 >= 0 ? index - 1 :itemsRef.current.length - 1
itemsRef.current[prevIndex]?.focus()
} else if (e.key === "ArrowDown") {
e.preventDefault()
constnextIndex = index + 1 < itemsRef.current.length ? index + 1 :0
itemsRef.current[nextIndex]?.focus()
}
}
return (
<>
{isToolPickerOpen && (
<div className="bg-background flex flex-col space-y-1 rounded-xl border-2 p-2 text-sm">
{filteredTools.length === 0 ? (
<div className="text-md flex h-14 cursor-pointer items-center justify-center italic hover:opacity-50">
No matching tools.
</div>
) :(
<>
{filteredTools.map((item,index) => (
<div
key={item.id}
ref={ref => {
itemsRef.current[index] = ref
}}
tabIndex={0}
className="hover:bg-accent focus:bg-accent flex cursor-pointer items-center rounded p-2 focus:outline-none"
onClick={() => callSelectTool(item as Tables<"tools">)}
onKeyDown={getKeyDownHandler(index)}
>
<IconBolt size={32} />
<div className="ml-3 flex flex-col">
<div className="font-bold">{item.name}</div>
<div className="truncate text-sm opacity-80">
{item.description || "No description."}
</div>
</div>
</div>
))}
</>
)}
</div>
)}
</>
)
}

// File: components/icons/anthropic-svg.tsx
import{FC}from "react"
interfaceAnthropicSVGProps {
height?:number
width?:number
className?:string
}
export constAnthropicSVG:FC<AnthropicSVGProps> = ({
height = 40,
width = 40,
className
}) => {
return (
<svg
className={className}
width={width}
height={height}
viewBox="0 0 24 16"
overflow="visible"
>
<g
style={{
transform:"translateX(13px) rotateZ(0deg)",
transformOrigin:"4.775px 7.73501px"
}}
>
<path
fill="currentColor"
d=" M0,0 C0,0 6.1677093505859375,15.470022201538086 6.1677093505859375,15.470022201538086 C6.1677093505859375,15.470022201538086 9.550004005432129,15.470022201538086 9.550004005432129,15.470022201538086 C9.550004005432129,15.470022201538086 3.382294178009033,0 3.382294178009033,0 C3.382294178009033,0 0,0 0,0 C0,0 0,0 0,0z"
></path>
</g>
<g
style={{transform:"none",transformOrigin:"7.935px 7.73501px"}}
opacity="1"
>
<path
fill="currentColor"
d=" M5.824605464935303,9.348296165466309 C5.824605464935303,9.348296165466309 7.93500280380249,3.911694288253784 7.93500280380249,3.911694288253784 C7.93500280380249,3.911694288253784 10.045400619506836,9.348296165466309 10.045400619506836,9.348296165466309 C10.045400619506836,9.348296165466309 5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309 C5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309z M6.166755199432373,0 C6.166755199432373,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.4480772018432617,15.470022201538086 3.4480772018432617,15.470022201538086 C3.4480772018432617,15.470022201538086 4.709278583526611,12.22130012512207 4.709278583526611,12.22130012512207 C4.709278583526611,12.22130012512207 11.16093635559082,12.22130012512207 11.16093635559082,12.22130012512207 C11.16093635559082,12.22130012512207 12.421928405761719,15.470022201538086 12.421928405761719,15.470022201538086 C12.421928405761719,15.470022201538086 15.87000560760498,15.470022201538086 15.87000560760498,15.470022201538086 C15.87000560760498,15.470022201538086 9.703250885009766,0 9.703250885009766,0 C9.703250885009766,0 6.166755199432373,0 6.166755199432373,0 C6.166755199432373,0 6.166755199432373,0 6.166755199432373,0z"
></path>
</g>
</svg>
)
}

// File: components/icons/chatbotui-svg.tsx
import{FC}from "react"
interfaceChatbotUISVGProps {
theme:"dark" | "light"
scale?:number
}
export constChatbotUISVG:FC<ChatbotUISVGProps> = ({theme,scale = 1}) => {
return (
<svg
width={189 * scale}
height={194 * scale}
viewBox="0 0 189 194"
fill="none"
xmlns="http:
>
<rect
x="12.5"
y="12.5"
width="164"
height="127"
rx="37.5"
fill={`${theme === "dark" ? "#000" :"#fff"}`}
stroke={`${theme === "dark" ? "#fff" :"#000"}`}
strokeWidth="25"
/>
<path
d="M72.7643 143.457C77.2953 143.443 79.508 148.98 76.2146 152.092L42.7738 183.69C39.5361 186.749 34.2157 184.366 34.3419 179.914L35.2341 148.422C35.3106 145.723 37.5158 143.572 40.2158 143.564L72.7643 143.457Z"
fill={`${theme === "dark" ? "#fff" :"#000"}`}
/>
<path
d="M59.6722 51.6H75.5122V84C75.5122 86.016 76.0162 87.672 77.0242 88.968C78.0802 90.216 79.6882 90.84 81.8482 90.84C84.0082 90.84 85.5922 90.216 86.6002 88.968C87.6562 87.672 88.1842 86.016 88.1842 84V51.6H104.024V85.44C104.024 89.04 103.424 92.088 102.224 94.584C101.072 97.032 99.4642 99.024 97.4002 100.56C95.3362 102.048 92.9602 103.128 90.2722 103.8C87.6322 104.52 84.8242 104.88 81.8482 104.88C78.8722 104.88 76.0402 104.52 73.3522 103.8C70.7122 103.128 68.3602 102.048 66.2962 100.56C64.2322 99.024 62.6002 97.032 61.4002 94.584C60.2482 92.088 59.6722 89.04 59.6722 85.44V51.6ZM113.751 51.6H129.951V102H113.751V51.6Z"
fill={`${theme === "dark" ? "#fff" :"#000"}`}
/>
</svg>
)
}

// File: components/icons/google-svg.tsx
import{FC}from "react"
interfaceGoogleSVGProps {
height?:number
width?:number
className?:string
}
export constGoogleSVG:FC<GoogleSVGProps> = ({
height = 40,
width = 40,
className
}) => {
return (
<svg
className={className}
width={width}
height={height}
xmlns="http:
x="0px"
y="0px"
viewBox="0 0 48 48"
>
<path
fill="#FFC107"
d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
></path>
<path
fill="#FF3D00"
d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
></path>
<path
fill="#4CAF50"
d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
></path>
<path
fill="#1976D2"
d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
></path>
</svg>
)
}

// File: components/icons/openai-svg.tsx
import{FC}from "react"
interfaceOpenAISVGProps {
height?:number
width?:number
className?:string
}
export constOpenAISVG:FC<OpenAISVGProps> = ({
height = 40,
width = 40,
className
}) => {
return (
<svg
className={className}
width={width}
height={height}
viewBox="0 0 41 41"
fill="none"
xmlns="http:
strokeWidth="1.5"
role="img"
>
<path
d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
fill="currentColor"
></path>
</svg>
)
}

// File: components/messages/message-actions.tsx
import{ChatbotUIContext}from "@/context/context"
import{IconCheck,IconCopy,IconEdit,IconRepeat}from "@tabler/icons-react"
import{FC,useContext,useEffect,useState}from "react"
import{WithTooltip}from "../ui/with-tooltip"
export constMESSAGE_ICON_SIZE = 18
interfaceMessageActionsProps {
isAssistant:boolean
isLast:boolean
isEditing:boolean
isHovering:boolean
onCopy:() => void
onEdit:() => void
onRegenerate:() => void
}
export constMessageActions:FC<MessageActionsProps> = ({
isAssistant,
isLast,
isEditing,
isHovering,
onCopy,
onEdit,
onRegenerate
}) => {
const{isGenerating} = useContext(ChatbotUIContext)
const[showCheckmark,setShowCheckmark] = useState(false)
consthandleCopy = () => {
onCopy()
setShowCheckmark(true)
}
consthandleForkChat = async () => {}
useEffect(() => {
if (showCheckmark) {
consttimer = setTimeout(() => {
setShowCheckmark(false)
},2000)
return () => clearTimeout(timer)
}
},[showCheckmark])
return (isLast && isGenerating) || isEditing ? null :(
<div className="text-muted-foreground flex items-center space-x-2">
{/* {((isAssistant && isHovering) || isLast) && (
<WithTooltip
delayDuration={1000}
side="bottom"
display={<div>Fork Chat</div>}
trigger={
<IconGitFork
className="cursor-pointer hover:opacity-50"
size={MESSAGE_ICON_SIZE}
onClick={handleForkChat}
/>
}
/>
)} */}
{!isAssistant && isHovering && (
<WithTooltip
delayDuration={1000}
side="bottom"
display={<div>Edit</div>}
trigger={
<IconEdit
className="cursor-pointer hover:opacity-50"
size={MESSAGE_ICON_SIZE}
onClick={onEdit}
/>
}
/>
)}
{(isHovering || isLast) && (
<WithTooltip
delayDuration={1000}
side="bottom"
display={<div>Copy</div>}
trigger={
showCheckmark ? (
<IconCheck size={MESSAGE_ICON_SIZE} />
) :(
<IconCopy
className="cursor-pointer hover:opacity-50"
size={MESSAGE_ICON_SIZE}
onClick={handleCopy}
/>
)
}
/>
)}
{isLast && (
<WithTooltip
delayDuration={1000}
side="bottom"
display={<div>Regenerate</div>}
trigger={
<IconRepeat
className="cursor-pointer hover:opacity-50"
size={MESSAGE_ICON_SIZE}
onClick={onRegenerate}
/>
}
/>
)}
{}
</div>
)
}

// File: components/messages/message-codeblock.tsx
import{Button}from "@/components/ui/button"
import{useCopyToClipboard}from "@/lib/hooks/use-copy-to-clipboard"
import{IconCheck,IconCopy,IconDownload}from "@tabler/icons-react"
import{FC,memo}from "react"
import{Prism as SyntaxHighlighter}from "react-syntax-highlighter"
import{oneDark}from "react-syntax-highlighter/dist/cjs/styles/prism"
interfaceMessageCodeBlockProps {
language:string
value:string
}
interfacelanguageMap {
[key:string]:string | undefined
}
export constprogrammingLanguages:languageMap = {
javascript:".js",
python:".py",
java:".java",
c:".c",
cpp:".cpp",
"c++":".cpp",
"c#":".cs",
ruby:".rb",
php:".php",
swift:".swift",
"objective-c":".m",
kotlin:".kt",
typescript:".ts",
go:".go",
perl:".pl",
rust:".rs",
scala:".scala",
haskell:".hs",
lua:".lua",
shell:".sh",
sql:".sql",
html:".html",
css:".css"
}
export constgenerateRandomString = (length:number,lowercase = false) => {
constchars = "ABCDEFGHJKLMNPQRSTUVWXY3456789" 
letresult = ""
for (leti = 0;i < length;i++) {
result += chars.charAt(Math.floor(Math.random() * chars.length))
}
return lowercase ? result.toLowerCase() :result
}
export constMessageCodeBlock:FC<MessageCodeBlockProps> = memo(
({language,value}) => {
const{isCopied,copyToClipboard} = useCopyToClipboard({timeout:2000})
constdownloadAsFile = () => {
if (typeof window === "undefined") {
return
}
constfileExtension = programmingLanguages[language] || ".file"
constsuggestedFileName = `file-${generateRandomString(
3,
true
)}${fileExtension}`
constfileName = window.prompt("Enter file name" || "",suggestedFileName)
if (!fileName) {
return
}
constblob = new Blob([value],{type:"text/plain"})
consturl = URL.createObjectURL(blob)
constlink = document.createElement("a")
link.download = fileName
link.href = url
link.style.display = "none"
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
URL.revokeObjectURL(url)
}
constonCopy = () => {
if (isCopied) return
copyToClipboard(value)
}
return (
<div className="codeblock relative w-full bg-zinc-950 font-sans">
<div className="flex w-full items-center justify-between bg-zinc-700 px-4 text-white">
<span className="text-xs lowercase">{language}</span>
<div className="flex items-center space-x-1">
<Button
variant="ghost"
size="icon"
className="hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
onClick={downloadAsFile}
>
<IconDownload size={16} />
</Button>
<Button
variant="ghost"
size="icon"
className="text-xs hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
onClick={onCopy}
>
{isCopied ? <IconCheck size={16} /> :<IconCopy size={16} />}
</Button>
</div>
</div>
<SyntaxHighlighter
language={language}
style={oneDark}

customStyle={{
margin:0,
width:"100%",
background:"transparent"
}}
codeTagProps={{
style:{
fontSize:"14px",
fontFamily:"var(--font-mono)"
}
}}
>
{value}
</SyntaxHighlighter>
</div>
)
}
)
MessageCodeBlock.displayName = "MessageCodeBlock"

// File: components/messages/message-markdown-memoized.tsx
import{FC,memo}from "react"
import ReactMarkdown,{Options}from "react-markdown"
export constMessageMarkdownMemoized:FC<Options> = memo(
ReactMarkdown,
(prevProps,nextProps) =>
prevProps.children === nextProps.children &&
prevProps.className === nextProps.className
)

// File: components/messages/message-markdown.tsx
import React,{FC}from "react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import{MessageCodeBlock}from "./message-codeblock"
import{MessageMarkdownMemoized}from "./message-markdown-memoized"
interfaceMessageMarkdownProps {
content:string
}
export constMessageMarkdown:FC<MessageMarkdownProps> = ({content}) => {
return (
<MessageMarkdownMemoized
className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
remarkPlugins={[remarkGfm,remarkMath]}
components={{
p({children}) {
return <p className="mb-2 last:mb-0">{children}</p>
},
img({node,...props}) {
return <img className="max-w-[67%]" {...props} />
},
code({node,className,children,...props}) {
constchildArray = React.Children.toArray(children)
constfirstChild = childArray[0] as React.ReactElement
constfirstChildAsString = React.isValidElement(firstChild)
? (firstChild as React.ReactElement).props.children
:firstChild
if (firstChildAsString === "▍") {
return <span className="mt-1 animate-pulse cursor-default">▍</span>
}
if (typeof firstChildAsString === "string") {
childArray[0] = firstChildAsString.replace("`▍`","▍")
}
constmatch = /language-(\w+)/.exec(className || "")
if (
typeof firstChildAsString === "string" &&
!firstChildAsString.includes("\n")
) {
return (
<code className={className} {...props}>
{childArray}
</code>
)
}
return (
<MessageCodeBlock
key={Math.random()}
language={(match && match[1]) || ""}
value={String(childArray).replace(/\n$/,"")}
{...props}
/>
)
}
}}
>
{content}
</MessageMarkdownMemoized>
)
}

// File: components/messages/message-replies.tsx
import{IconMessage}from "@tabler/icons-react"
import{FC,useState}from "react"
import{
Sheet,
SheetContent,
SheetDescription,
SheetHeader,
SheetTitle,
SheetTrigger
}from "../ui/sheet"
import{WithTooltip}from "../ui/with-tooltip"
import{MESSAGE_ICON_SIZE}from "./message-actions"
interfaceMessageRepliesProps {}
export constMessageReplies:FC<MessageRepliesProps> = ({}) => {
const[isOpen,setIsOpen] = useState(false)
return (
<Sheet open={isOpen} onOpenChange={setIsOpen}>
<SheetTrigger asChild>
<WithTooltip
delayDuration={1000}
side="bottom"
display={<div>View Replies</div>}
trigger={
<div
className="relative cursor-pointer hover:opacity-50"
onClick={() => setIsOpen(true)}
>
<IconMessage size={MESSAGE_ICON_SIZE} />
<div className="notification-indicator absolute right-[-4px] top-[-4px] flex size-3 items-center justify-center rounded-full bg-red-600 text-[8px] text-white">
{1}
</div>
</div>
}
/>
</SheetTrigger>
<SheetContent>
<SheetHeader>
<SheetTitle>Are you sure absolutely sure?</SheetTitle>
<SheetDescription>
This action cannot be undone. This will permanently delete your
account and remove your data from our servers.
</SheetDescription>
</SheetHeader>
</SheetContent>
</Sheet>
)
}

