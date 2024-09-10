// File: components/utility/import.tsx
import{ChatbotUIContext}from "@/context/context"
import{createAssistants}from "@/db/assistants"
import{createChats}from "@/db/chats"
import{createCollections}from "@/db/collections"
import{createFiles}from "@/db/files"
import{createPresets}from "@/db/presets"
import{createPrompts}from "@/db/prompts"
import{createTools}from "@/db/tools"
import{IconUpload,IconX}from "@tabler/icons-react"
import{FC,useContext,useRef,useState}from "react"
import{toast}from "sonner"
import{SIDEBAR_ICON_SIZE}from "../sidebar/sidebar-switcher"
import{Badge}from "../ui/badge"
import{Button}from "../ui/button"
import{
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader
}from "../ui/dialog"
import{Input}from "../ui/input"
interfaceImportProps {}
export constImport:FC<ImportProps> = ({}) => {
const{
profile,
selectedWorkspace,
setChats,
setPresets,
setPrompts,
setFiles,
setCollections,
setAssistants,
setTools
} = useContext(ChatbotUIContext)
constinputRef = useRef<HTMLInputElement>(null)
constbuttonRef = useRef<HTMLButtonElement>(null)
const[isOpen,setIsOpen] = useState(false)
const[importList,setImportList] = useState<Array<Record<string,any>>>([])
const[importCounts,setImportCounts] = useState<{
chats:number
presets:number
prompts:number
files:number
collections:number
assistants:number
tools:number
}>({
chats:0,
presets:0,
prompts:0,
files:0,
collections:0,
assistants:0,
tools:0
})
conststateUpdateFunctions = {
chats:setChats,
presets:setPresets,
prompts:setPrompts,
files:setFiles,
collections:setCollections,
assistants:setAssistants,
tools:setTools
}
consthandleSelectFiles = async (e:any) => {
constfilePromises = Array.from(e.target.files).map(file => {
return new Promise((resolve,reject) => {
constreader = new FileReader()
reader.onload = event => {
try {
constdata = JSON.parse(event.target?.result as string)
resolve(Array.isArray(data) ? data :[data])
} catch (error) {
reject(error)
}
}
reader.readAsText(file as Blob)
})
})
try {
constresults = await Promise.all(filePromises)
constflatResults = results.flat()
letuniqueResults:Array<Record<string,any>> = []
setImportList(prevState => {
constnewState = [...prevState,...flatResults]
uniqueResults = Array.from(
new Set(newState.map(item => JSON.stringify(item)))
).map(item => JSON.parse(item))
return uniqueResults
})
setImportCounts(prevCounts => {
constcountTypes = [
"chats",
"presets",
"prompts",
"files",
"collections",
"assistants"
]
constnewCounts:any = {...prevCounts}
countTypes.forEach(type=> {
newCounts[type] = uniqueResults.filter(
item => item.contentType === type
).length
})
return newCounts
})
} catch (error) {
console.error(error)
}
}
consthandleRemoveItem = (item:any) => {
setImportList(prev => prev.filter(prevItem => prevItem !== item))
setImportCounts(prev => {
constnewCounts:any = {...prev}
newCounts[item.contentType] -= 1
return newCounts
})
}
consthandleCancel = () => {
setImportList([])
setImportCounts({
chats:0,
presets:0,
prompts:0,
files:0,
collections:0,
assistants:0,
tools:0
})
setIsOpen(false)
}
consthandleSaveData = async () => {
if (!profile) return
if (!selectedWorkspace) return
constsaveData:any = {
chats:[],
presets:[],
prompts:[],
files:[],
collections:[],
assistants:[],
tools:[]
}
importList.forEach(item => {
const{contentType,...itemWithoutContentType} = item
itemWithoutContentType.user_id = profile.user_id
itemWithoutContentType.workspace_id = selectedWorkspace.id
saveData[contentType].push(itemWithoutContentType)
})
constcreatedItems = {
chats:await createChats(saveData.chats),
presets:await createPresets(saveData.presets,selectedWorkspace.id),
prompts:await createPrompts(saveData.prompts,selectedWorkspace.id),
files:await createFiles(saveData.files,selectedWorkspace.id),
collections:await createCollections(
saveData.collections,
selectedWorkspace.id
),
assistants:await createAssistants(
saveData.assistants,
selectedWorkspace.id
),
tools:await createTools(saveData.tools,selectedWorkspace.id)
}
Object.keys(createdItems).forEach(key => {
consttypedKey = key as keyof typeof stateUpdateFunctions
stateUpdateFunctions[typedKey]((prevItems:any) => [
...prevItems,
...createdItems[typedKey]
])
})
toast.success("Data imported successfully!")
setImportList([])
setImportCounts({
chats:0,
presets:0,
prompts:0,
files:0,
collections:0,
assistants:0,
tools:0
})
setIsOpen(false)
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter" && !e.shiftKey) {
e.preventDefault()
buttonRef.current?.click()
}
}
return (
<>
<IconUpload
className="cursor-pointer hover:opacity-50"
size={SIDEBAR_ICON_SIZE}
onClick={() => setIsOpen(true)}
/>
{isOpen && (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
<DialogContent
className="max-w-[600px] space-y-4"
onKeyDown={handleKeyDown}
>
<DialogHeader>
<div className="text-2xl font-bold">Import Data</div>
<DialogDescription>
Import data from a JSON file(s).
</DialogDescription>
</DialogHeader>
<div className="max-w-[560px] space-y-4">
<div className="space-y-1">
{importList.map((item,index) => (
<div key={index} className="flex space-x-2">
<Button className="shrink-0" variant="ghost" size="icon">
<IconX
className="cursor-pointer hover:opacity-50"
onClick={() => handleRemoveItem(item)}
/>
</Button>
<div className="flex items-center space-x-2 truncate">
<Badge>
{item.contentType.slice(0,-1).toUpperCase()}
</Badge>
<div className="truncate">{item.name}</div>
</div>
</div>
))}
</div>
{Object.entries(importCounts).map(([key,value]) => {
if (value > 0) {
return <div key={key}>{`${key}:${value}`}</div>
}
return null
})}
<Input
className="mt-4"
ref={inputRef}
type="file"
onChange={handleSelectFiles}
accept=".json"
multiple
/>
</div>
<DialogFooter>
<Button variant="ghost" onClick={handleCancel}>
Cancel
</Button>
<Button
ref={buttonRef}
onClick={handleSaveData}
disabled={importList.length === 0}
>
Save Data
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)}
</>
)
}

// File: components/utility/profile-settings.tsx
import{ChatbotUIContext}from "@/context/context"
import{
PROFILE_CONTEXT_MAX,
PROFILE_DISPLAY_NAME_MAX,
PROFILE_USERNAME_MAX,
PROFILE_USERNAME_MIN
}from "@/db/limits"
import{updateProfile}from "@/db/profile"
import{uploadProfileImage}from "@/db/storage/profile-images"
import{exportLocalStorageAsJSON}from "@/lib/export-old-data"
import{fetchOpenRouterModels}from "@/lib/models/fetch-models"
import{LLM_LIST_MAP}from "@/lib/models/llm/llm-list"
import{supabase}from "@/lib/supabase/browser-client"
import{cn}from "@/lib/utils"
import{OpenRouterLLM}from "@/types"
import{
IconCircleCheckFilled,
IconCircleXFilled,
IconFileDownload,
IconLoader2,
IconLogout,
IconUser
}from "@tabler/icons-react"
import Image from "next/image"
import{useRouter}from "next/navigation"
import{FC,useCallback,useContext,useRef,useState}from "react"
import{toast}from "sonner"
import{SIDEBAR_ICON_SIZE}from "../sidebar/sidebar-switcher"
import{Button}from "../ui/button"
import ImagePicker from "../ui/image-picker"
import{Input}from "../ui/input"
import{Label}from "../ui/label"
import{LimitDisplay}from "../ui/limit-display"
import{
Sheet,
SheetContent,
SheetHeader,
SheetTitle,
SheetTrigger
}from "../ui/sheet"
import{Tabs,TabsContent,TabsList,TabsTrigger}from "../ui/tabs"
import{TextareaAutosize}from "../ui/textarea-autosize"
import{WithTooltip}from "../ui/with-tooltip"
import{ThemeSwitcher}from "./theme-switcher"
interfaceProfileSettingsProps {}
export constProfileSettings:FC<ProfileSettingsProps> = ({}) => {
const{
profile,
setProfile,
envKeyMap,
setAvailableHostedModels,
setAvailableOpenRouterModels,
availableOpenRouterModels
} = useContext(ChatbotUIContext)
constrouter = useRouter()
constbuttonRef = useRef<HTMLButtonElement>(null)
const[isOpen,setIsOpen] = useState(false)
const[displayName,setDisplayName] = useState(profile?.display_name || "")
const[username,setUsername] = useState(profile?.username || "")
const[usernameAvailable,setUsernameAvailable] = useState(true)
const[loadingUsername,setLoadingUsername] = useState(false)
const[profileImageSrc,setProfileImageSrc] = useState(
profile?.image_url || ""
)
const[profileImageFile,setProfileImageFile] = useState<File | null>(null)
const[profileInstructions,setProfileInstructions] = useState(
profile?.profile_context || ""
)
const[useAzureOpenai,setUseAzureOpenai] = useState(
profile?.use_azure_openai
)
const[openaiAPIKey,setOpenaiAPIKey] = useState(
profile?.openai_api_key || ""
)
const[openaiOrgID,setOpenaiOrgID] = useState(
profile?.openai_organization_id || ""
)
const[azureOpenaiAPIKey,setAzureOpenaiAPIKey] = useState(
profile?.azure_openai_api_key || ""
)
const[azureOpenaiEndpoint,setAzureOpenaiEndpoint] = useState(
profile?.azure_openai_endpoint || ""
)
const[azureOpenai35TurboID,setAzureOpenai35TurboID] = useState(
profile?.azure_openai_35_turbo_id || ""
)
const[azureOpenai45TurboID,setAzureOpenai45TurboID] = useState(
profile?.azure_openai_45_turbo_id || ""
)
const[azureOpenai45VisionID,setAzureOpenai45VisionID] = useState(
profile?.azure_openai_45_vision_id || ""
)
const[azureEmbeddingsID,setAzureEmbeddingsID] = useState(
profile?.azure_openai_embeddings_id || ""
)
const[anthropicAPIKey,setAnthropicAPIKey] = useState(
profile?.anthropic_api_key || ""
)
const[googleGeminiAPIKey,setGoogleGeminiAPIKey] = useState(
profile?.google_gemini_api_key || ""
)
const[mistralAPIKey,setMistralAPIKey] = useState(
profile?.mistral_api_key || ""
)
const[groqAPIKey,setGroqAPIKey] = useState(profile?.groq_api_key || "")
const[perplexityAPIKey,setPerplexityAPIKey] = useState(
profile?.perplexity_api_key || ""
)
const[openrouterAPIKey,setOpenrouterAPIKey] = useState(
profile?.openrouter_api_key || ""
)
consthandleSignOut = async () => {
await supabase.auth.signOut()
router.push("/login")
router.refresh()
return
}
consthandleSave = async () => {
if (!profile) return
letprofileImageUrl = profile.image_url
letprofileImagePath = ""
if (profileImageFile) {
const{path,url} = await uploadProfileImage(profile,profileImageFile)
profileImageUrl = url ?? profileImageUrl
profileImagePath = path
}
constupdatedProfile = await updateProfile(profile.id,{
...profile,
display_name:displayName,
username,
profile_context:profileInstructions,
image_url:profileImageUrl,
image_path:profileImagePath,
openai_api_key:openaiAPIKey,
openai_organization_id:openaiOrgID,
anthropic_api_key:anthropicAPIKey,
google_gemini_api_key:googleGeminiAPIKey,
mistral_api_key:mistralAPIKey,
groq_api_key:groqAPIKey,
perplexity_api_key:perplexityAPIKey,
use_azure_openai:useAzureOpenai,
azure_openai_api_key:azureOpenaiAPIKey,
azure_openai_endpoint:azureOpenaiEndpoint,
azure_openai_35_turbo_id:azureOpenai35TurboID,
azure_openai_45_turbo_id:azureOpenai45TurboID,
azure_openai_45_vision_id:azureOpenai45VisionID,
azure_openai_embeddings_id:azureEmbeddingsID,
openrouter_api_key:openrouterAPIKey
})
setProfile(updatedProfile)
toast.success("Profile updated!")
constproviders = [
"openai",
"google",
"azure",
"anthropic",
"mistral",
"groq",
"perplexity",
"openrouter"
]
providers.forEach(async provider => {
letproviderKey:keyof typeof profile
if (provider === "google") {
providerKey = "google_gemini_api_key"
} else if (provider === "azure") {
providerKey = "azure_openai_api_key"
} else {
providerKey = `${provider}_api_key` as keyof typeof profile
}
constmodels = LLM_LIST_MAP[provider]
constenvKeyActive = envKeyMap[provider]
if (!envKeyActive) {
consthasApiKey = !!updatedProfile[providerKey]
if (provider === "openrouter") {
if (hasApiKey && availableOpenRouterModels.length === 0) {
constopenrouterModels:OpenRouterLLM[] =
await fetchOpenRouterModels()
setAvailableOpenRouterModels(prev => {
constnewModels = openrouterModels.filter(
model =>
!prev.some(prevModel => prevModel.modelId === model.modelId)
)
return [...prev,...newModels]
})
} else {
setAvailableOpenRouterModels([])
}
} else {
if (hasApiKey && Array.isArray(models)) {
setAvailableHostedModels(prev => {
constnewModels = models.filter(
model =>
!prev.some(prevModel => prevModel.modelId === model.modelId)
)
return [...prev,...newModels]
})
} else if (!hasApiKey && Array.isArray(models)) {
setAvailableHostedModels(prev =>
prev.filter(model => !models.includes(model))
)
}
}
}
})
setIsOpen(false)
}
constdebounce = (func:(...args:any[]) => void,wait:number) => {
lettimeout:NodeJS.Timeout | null
return (...args:any[]) => {
constlater = () => {
if (timeout) clearTimeout(timeout)
func(...args)
}
if (timeout) clearTimeout(timeout)
timeout = setTimeout(later,wait)
}
}
constcheckUsernameAvailability = useCallback(
debounce(async (username:string) => {
if (!username) return
if (username.length < PROFILE_USERNAME_MIN) {
setUsernameAvailable(false)
return
}
if (username.length > PROFILE_USERNAME_MAX) {
setUsernameAvailable(false)
return
}
constusernameRegex = /^[a-zA-Z0-9_]+$/
if (!usernameRegex.test(username)) {
setUsernameAvailable(false)
toast.error(
"Username must be letters,numbers,or underscores only - no other characters or spacing allowed."
)
return
}
setLoadingUsername(true)
constresponse = await fetch(`/api/username/available`,{
method:"POST",
body:JSON.stringify({username})
})
constdata = await response.json()
constisAvailable = data.isAvailable
setUsernameAvailable(isAvailable)
if (username === profile?.username) {
setUsernameAvailable(true)
}
setLoadingUsername(false)
},500),
[]
)
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
buttonRef.current?.click()
}
}
if (!profile) return null
return (
<Sheet open={isOpen} onOpenChange={setIsOpen}>
<SheetTrigger asChild>
{profile.image_url ? (
<Image
className="mt-2 size-[34px] cursor-pointer rounded hover:opacity-50"
src={profile.image_url + "?" + new Date().getTime()}
height={34}
width={34}
alt={"Image"}
/>
) :(
<Button size="icon" variant="ghost">
<IconUser size={SIDEBAR_ICON_SIZE} />
</Button>
)}
</SheetTrigger>
<SheetContent
className="flex flex-col justify-between"
side="left"
onKeyDown={handleKeyDown}
>
<div className="grow overflow-auto">
<SheetHeader>
<SheetTitle className="flex items-center justify-between space-x-2">
<div>User Settings</div>
<Button
tabIndex={-1}
className="text-xs"
size="sm"
onClick={handleSignOut}
>
<IconLogout className="mr-1" size={20} />
Logout
</Button>
</SheetTitle>
</SheetHeader>
<Tabs defaultValue="profile">
<TabsList className="mt-4 grid w-full grid-cols-2">
<TabsTrigger value="profile">Profile</TabsTrigger>
<TabsTrigger value="keys">API Keys</TabsTrigger>
</TabsList>
<TabsContent className="mt-4 space-y-4" value="profile">
<div className="space-y-1">
<div className="flex items-center space-x-2">
<Label>Username</Label>
<div className="text-xs">
{username !== profile.username ? (
usernameAvailable ? (
<div className="text-green-500">AVAILABLE</div>
) :(
<div className="text-red-500">UNAVAILABLE</div>
)
) :null}
</div>
</div>
<div className="relative">
<Input
className="pr-10"
placeholder="Username..."
value={username}
onChange={e => {
setUsername(e.target.value)
checkUsernameAvailability(e.target.value)
}}
minLength={PROFILE_USERNAME_MIN}
maxLength={PROFILE_USERNAME_MAX}
/>
{username !== profile.username ? (
<div className="absolute inset-y-0 right-0 flex items-center pr-3">
{loadingUsername ? (
<IconLoader2 className="animate-spin" />
) :usernameAvailable ? (
<IconCircleCheckFilled className="text-green-500" />
) :(
<IconCircleXFilled className="text-red-500" />
)}
</div>
) :null}
</div>
<LimitDisplay
used={username.length}
limit={PROFILE_USERNAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Profile Image</Label>
<ImagePicker
src={profileImageSrc}
image={profileImageFile}
height={50}
width={50}
onSrcChange={setProfileImageSrc}
onImageChange={setProfileImageFile}
/>
</div>
<div className="space-y-1">
<Label>Chat Display Name</Label>
<Input
placeholder="Chat display name..."
value={displayName}
onChange={e => setDisplayName(e.target.value)}
maxLength={PROFILE_DISPLAY_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label className="text-sm">
What would you like the AI to know about you to provide better
responses?
</Label>
<TextareaAutosize
value={profileInstructions}
onValueChange={setProfileInstructions}
placeholder="Profile context... (optional)"
minRows={6}
maxRows={10}
/>
<LimitDisplay
used={profileInstructions.length}
limit={PROFILE_CONTEXT_MAX}
/>
</div>
</TabsContent>
<TabsContent className="mt-4 space-y-4" value="keys">
<div className="mt-5 space-y-2">
<Label className="flex items-center">
{useAzureOpenai
? envKeyMap["azure"]
? ""
:"Azure OpenAI API Key"
:envKeyMap["openai"]
? ""
:"OpenAI API Key"}
<Button
className={cn(
"h-[18px] w-[150px] text-[11px]",
(useAzureOpenai && !envKeyMap["azure"]) ||
(!useAzureOpenai && !envKeyMap["openai"])
? "ml-3"
:"mb-3"
)}
onClick={() => setUseAzureOpenai(!useAzureOpenai)}
>
{useAzureOpenai
? "Switch To Standard OpenAI"
:"Switch To Azure OpenAI"}
</Button>
</Label>
{useAzureOpenai ? (
<>
{envKeyMap["azure"] ? (
<Label>Azure OpenAI API key set by admin.</Label>
) :(
<Input
placeholder="Azure OpenAI API Key"
type="password"
value={azureOpenaiAPIKey}
onChange={e => setAzureOpenaiAPIKey(e.target.value)}
/>
)}
</>
) :(
<>
{envKeyMap["openai"] ? (
<Label>OpenAI API key set by admin.</Label>
) :(
<Input
placeholder="OpenAI API Key"
type="password"
value={openaiAPIKey}
onChange={e => setOpenaiAPIKey(e.target.value)}
/>
)}
</>
)}
</div>
<div className="ml-8 space-y-3">
{useAzureOpenai ? (
<>
{
<div className="space-y-1">
{envKeyMap["azure_openai_endpoint"] ? (
<Label className="text-xs">
Azure endpoint set by admin.
</Label>
) :(
<>
<Label>Azure Endpoint</Label>
<Input
placeholder="https:
value={azureOpenaiEndpoint}
onChange={e =>
setAzureOpenaiEndpoint(e.target.value)
}
/>
</>
)}
</div>
}
{
<div className="space-y-1">
{envKeyMap["azure_gpt_35_turbo_name"] ? (
<Label className="text-xs">
Azure GPT-3.5 Turbo deployment name set by admin.
</Label>
) :(
<>
<Label>Azure GPT-3.5 Turbo Deployment Name</Label>
<Input
placeholder="Azure GPT-3.5 Turbo Deployment Name"
value={azureOpenai35TurboID}
onChange={e =>
setAzureOpenai35TurboID(e.target.value)
}
/>
</>
)}
</div>
}
{
<div className="space-y-1">
{envKeyMap["azure_gpt_45_turbo_name"] ? (
<Label className="text-xs">
Azure GPT-4.5 Turbo deployment name set by admin.
</Label>
) :(
<>
<Label>Azure GPT-4.5 Turbo Deployment Name</Label>
<Input
placeholder="Azure GPT-4.5 Turbo Deployment Name"
value={azureOpenai45TurboID}
onChange={e =>
setAzureOpenai45TurboID(e.target.value)
}
/>
</>
)}
</div>
}
{
<div className="space-y-1">
{envKeyMap["azure_gpt_45_vision_name"] ? (
<Label className="text-xs">
Azure GPT-4.5 Vision deployment name set by admin.
</Label>
) :(
<>
<Label>Azure GPT-4.5 Vision Deployment Name</Label>
<Input
placeholder="Azure GPT-4.5 Vision Deployment Name"
value={azureOpenai45VisionID}
onChange={e =>
setAzureOpenai45VisionID(e.target.value)
}
/>
</>
)}
</div>
}
{
<div className="space-y-1">
{envKeyMap["azure_embeddings_name"] ? (
<Label className="text-xs">
Azure Embeddings deployment name set by admin.
</Label>
) :(
<>
<Label>Azure Embeddings Deployment Name</Label>
<Input
placeholder="Azure Embeddings Deployment Name"
value={azureEmbeddingsID}
onChange={e =>
setAzureEmbeddingsID(e.target.value)
}
/>
</>
)}
</div>
}
</>
) :(
<>
<div className="space-y-1">
{envKeyMap["openai_organization_id"] ? (
<Label className="text-xs">
OpenAI Organization ID set by admin.
</Label>
) :(
<>
<Label>OpenAI Organization ID</Label>
<Input
placeholder="OpenAI Organization ID (optional)"
disabled={
!!process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION_ID
}
type="password"
value={openaiOrgID}
onChange={e => setOpenaiOrgID(e.target.value)}
/>
</>
)}
</div>
</>
)}
</div>
<div className="space-y-1">
{envKeyMap["anthropic"] ? (
<Label>Anthropic API key set by admin.</Label>
) :(
<>
<Label>Anthropic API Key</Label>
<Input
placeholder="Anthropic API Key"
type="password"
value={anthropicAPIKey}
onChange={e => setAnthropicAPIKey(e.target.value)}
/>
</>
)}
</div>
<div className="space-y-1">
{envKeyMap["google"] ? (
<Label>Google Gemini API key set by admin.</Label>
) :(
<>
<Label>Google Gemini API Key</Label>
<Input
placeholder="Google Gemini API Key"
type="password"
value={googleGeminiAPIKey}
onChange={e => setGoogleGeminiAPIKey(e.target.value)}
/>
</>
)}
</div>
<div className="space-y-1">
{envKeyMap["mistral"] ? (
<Label>Mistral API key set by admin.</Label>
) :(
<>
<Label>Mistral API Key</Label>
<Input
placeholder="Mistral API Key"
type="password"
value={mistralAPIKey}
onChange={e => setMistralAPIKey(e.target.value)}
/>
</>
)}
</div>
<div className="space-y-1">
{envKeyMap["groq"] ? (
<Label>Groq API key set by admin.</Label>
) :(
<>
<Label>Groq API Key</Label>
<Input
placeholder="Groq API Key"
type="password"
value={groqAPIKey}
onChange={e => setGroqAPIKey(e.target.value)}
/>
</>
)}
</div>
<div className="space-y-1">
{envKeyMap["perplexity"] ? (
<Label>Perplexity API key set by admin.</Label>
) :(
<>
<Label>Perplexity API Key</Label>
<Input
placeholder="Perplexity API Key"
type="password"
value={perplexityAPIKey}
onChange={e => setPerplexityAPIKey(e.target.value)}
/>
</>
)}
</div>
<div className="space-y-1">
{envKeyMap["openrouter"] ? (
<Label>OpenRouter API key set by admin.</Label>
) :(
<>
<Label>OpenRouter API Key</Label>
<Input
placeholder="OpenRouter API Key"
type="password"
value={openrouterAPIKey}
onChange={e => setOpenrouterAPIKey(e.target.value)}
/>
</>
)}
</div>
</TabsContent>
</Tabs>
</div>
<div className="mt-6 flex items-center">
<div className="flex items-center space-x-1">
<ThemeSwitcher />
<WithTooltip
display={
<div>
Download Chatbot UI 1.0 data as JSON. Import coming soon!
</div>
}
trigger={
<IconFileDownload
className="cursor-pointer hover:opacity-50"
size={32}
onClick={exportLocalStorageAsJSON}
/>
}
/>
</div>
<div className="ml-auto space-x-2">
<Button variant="ghost" onClick={() => setIsOpen(false)}>
Cancel
</Button>
<Button ref={buttonRef} onClick={handleSave}>
Save
</Button>
</div>
</div>
</SheetContent>
</Sheet>
)
}

// File: components/utility/providers.tsx
"use client"
import{TooltipProvider}from "@/components/ui/tooltip"
import{ThemeProvider as NextThemesProvider}from "next-themes"
import{ThemeProviderProps}from "next-themes/dist/types"
import{FC}from "react"
export constProviders:FC<ThemeProviderProps> = ({children,...props}) => {
return (
<NextThemesProvider {...props}>
<TooltipProvider>{children}</TooltipProvider>
</NextThemesProvider>
)
}

// File: components/utility/theme-switcher.tsx
import{IconMoon,IconSun}from "@tabler/icons-react"
import{useTheme}from "next-themes"
import{FC}from "react"
import{SIDEBAR_ICON_SIZE}from "../sidebar/sidebar-switcher"
import{Button}from "../ui/button"
interfaceThemeSwitcherProps {}
export constThemeSwitcher:FC<ThemeSwitcherProps> = () => {
const{setTheme,theme} = useTheme()
consthandleChange = (theme:"dark" | "light") => {
localStorage.setItem("theme",theme)
setTheme(theme)
}
return (
<Button
className="flex cursor-pointer space-x-2"
variant="ghost"
size="icon"
onClick={() => handleChange(theme === "light" ? "dark" :"light")}
>
{theme === "dark" ? (
<IconMoon size={SIDEBAR_ICON_SIZE} />
) :(
<IconSun size={SIDEBAR_ICON_SIZE} />
)}
</Button>
)
}

// File: components/utility/translations-provider.tsx
"use client"
import initTranslations from "@/lib/i18n"
import{createInstance}from "i18next"
import{I18nextProvider}from "react-i18next"
export default function TranslationsProvider({
children,
locale,
namespaces,
resources
}:any) {
consti18n = createInstance()
initTranslations(locale,namespaces,i18n,resources)
return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

// File: components/utility/workspace-switcher.tsx
"use client"
import{useChatHandler}from "@/components/chat/chat-hooks/use-chat-handler"
import{
Popover,
PopoverContent,
PopoverTrigger
}from "@/components/ui/popover"
import{ChatbotUIContext}from "@/context/context"
import{createWorkspace}from "@/db/workspaces"
import useHotkey from "@/lib/hooks/use-hotkey"
import{IconBuilding,IconHome,IconPlus}from "@tabler/icons-react"
import{ChevronsUpDown}from "lucide-react"
import Image from "next/image"
import{useRouter}from "next/navigation"
import{FC,useContext,useEffect,useState}from "react"
import{Button}from "../ui/button"
import{Input}from "../ui/input"
interfaceWorkspaceSwitcherProps {}
export constWorkspaceSwitcher:FC<WorkspaceSwitcherProps> = ({}) => {
useHotkey(";",() => setOpen(prevState => !prevState))
const{
workspaces,
workspaceImages,
selectedWorkspace,
setSelectedWorkspace,
setWorkspaces
} = useContext(ChatbotUIContext)
const{handleNewChat} = useChatHandler()
constrouter = useRouter()
const[open,setOpen] = useState(false)
const[value,setValue] = useState("")
const[search,setSearch] = useState("")
useEffect(() => {
if (!selectedWorkspace) return
setValue(selectedWorkspace.id)
},[selectedWorkspace])
consthandleCreateWorkspace = async () => {
if (!selectedWorkspace) return
constcreatedWorkspace = await createWorkspace({
user_id:selectedWorkspace.user_id,
default_context_length:selectedWorkspace.default_context_length,
default_model:selectedWorkspace.default_model,
default_prompt:selectedWorkspace.default_prompt,
default_temperature:selectedWorkspace.default_temperature,
description:"",
embeddings_provider:"openai",
include_profile_context:selectedWorkspace.include_profile_context,
include_workspace_instructions:
selectedWorkspace.include_workspace_instructions,
instructions:selectedWorkspace.instructions,
is_home:false,
name:"New Workspace"
})
setWorkspaces([...workspaces,createdWorkspace])
setSelectedWorkspace(createdWorkspace)
setOpen(false)
return router.push(`/${createdWorkspace.id}/chat`)
}
constgetWorkspaceName = (workspaceId:string) => {
constworkspace = workspaces.find(workspace => workspace.id === workspaceId)
if (!workspace) return
return workspace.name
}
consthandleSelect = (workspaceId:string) => {
constworkspace = workspaces.find(workspace => workspace.id === workspaceId)
if (!workspace) return
setSelectedWorkspace(workspace)
setOpen(false)
return router.push(`/${workspace.id}/chat`)
}
constworkspaceImage = workspaceImages.find(
image => image.workspaceId === selectedWorkspace?.id
)
constimageSrc = workspaceImage
? workspaceImage.url
:selectedWorkspace?.is_home
? ""
:""
constIconComponent = selectedWorkspace?.is_home ? IconHome :IconBuilding
return (
<Popover open={open} onOpenChange={setOpen}>
<PopoverTrigger
className="border-input flex h-[36px]
w-full cursor-pointer items-center justify-between rounded-md border px-2 py-1 hover:opacity-50"
>
<div className="flex items-center truncate">
{selectedWorkspace && (
<div className="flex items-center">
{workspaceImage ? (
<Image
style={{width:"22px",height:"22px"}}
className="mr-2 rounded"
src={imageSrc}
width={22}
height={22}
alt={selectedWorkspace.name}
/>
) :(
<IconComponent className="mb-0.5 mr-2" size={22} />
)}
</div>
)}
{getWorkspaceName(value) || "Select workspace..."}
</div>
<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
</PopoverTrigger>
<PopoverContent className="p-2">
<div className="space-y-2">
<Button
className="flex w-full items-center space-x-2"
size="sm"
onClick={handleCreateWorkspace}
>
<IconPlus />
<div className="ml-2">New Workspace</div>
</Button>
<Input
placeholder="Search workspaces..."
autoFocus
value={search}
onChange={e => setSearch(e.target.value)}
/>
<div className="flex flex-col space-y-1">
{workspaces
.filter(workspace => workspace.is_home)
.map(workspace => {
constimage = workspaceImages.find(
image => image.workspaceId === workspace.id
)
return (
<Button
key={workspace.id}
className="flex items-center justify-start"
variant="ghost"
onClick={() => handleSelect(workspace.id)}
>
{image ? (
<Image
style={{width:"28px",height:"28px"}}
className="mr-3 rounded"
src={image.url || ""}
width={28}
height={28}
alt={workspace.name}
/>
) :(
<IconHome className="mr-3" size={28} />
)}
<div className="text-lg font-semibold">
{workspace.name}
</div>
</Button>
)
})}
{workspaces
.filter(
workspace =>
!workspace.is_home &&
workspace.name.toLowerCase().includes(search.toLowerCase())
)
.sort((a,b) => a.name.localeCompare(b.name))
.map(workspace => {
constimage = workspaceImages.find(
image => image.workspaceId === workspace.id
)
return (
<Button
key={workspace.id}
className="flex items-center justify-start"
variant="ghost"
onClick={() => handleSelect(workspace.id)}
>
{image ? (
<Image
style={{width:"28px",height:"28px"}}
className="mr-3 rounded"
src={image.url || ""}
width={28}
height={28}
alt={workspace.name}
/>
) :(
<IconBuilding className="mr-3" size={28} />
)}
<div className="text-lg font-semibold">
{workspace.name}
</div>
</Button>
)
})}
</div>
</div>
</PopoverContent>
</Popover>
)
}

// File: components/workspace/assign-workspaces.tsx
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{IconChevronDown,IconCircleCheckFilled}from "@tabler/icons-react"
import{FC,useContext,useEffect,useRef,useState}from "react"
import{Button}from "../ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuTrigger
}from "../ui/dropdown-menu"
import{Input}from "../ui/input"
import{toast}from "sonner"
interfaceAssignWorkspaces {
selectedWorkspaces:Tables<"workspaces">[]
onSelectWorkspace:(workspace:Tables<"workspaces">) => void
}
export constAssignWorkspaces:FC<AssignWorkspaces> = ({
selectedWorkspaces,
onSelectWorkspace
}) => {
const{workspaces} = useContext(ChatbotUIContext)
constinputRef = useRef<HTMLInputElement>(null)
consttriggerRef = useRef<HTMLButtonElement>(null)
const[isOpen,setIsOpen] = useState(false)
const[search,setSearch] = useState("")
useEffect(() => {
if (isOpen) {
setTimeout(() => {
inputRef.current?.focus()
},100) 
}
},[isOpen])
consthandleWorkspaceSelect = (workspace:Tables<"workspaces">) => {
onSelectWorkspace(workspace)
}
if (!workspaces) return null
return (
<DropdownMenu
open={isOpen}
onOpenChange={isOpen => {
setIsOpen(isOpen)
setSearch("")
}}
>
<DropdownMenuTrigger
className="bg-background w-full justify-start border-2 px-3 py-5"
asChild
>
<Button
ref={triggerRef}
className="flex items-center justify-between"
variant="ghost"
>
<div className="flex items-center">
<div className="ml-2 flex items-center">
{selectedWorkspaces.length} workspaces selected
</div>
</div>
<IconChevronDown />
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent
style={{width:triggerRef.current?.offsetWidth}}
className="space-y-2 overflow-auto p-2"
align="start"
>
<Input
ref={inputRef}
placeholder="Search workspaces..."
value={search}
onChange={e => setSearch(e.target.value)}
onKeyDown={e => e.stopPropagation()}
/>
{selectedWorkspaces
.filter(workspace =>
workspace.name.toLowerCase().includes(search.toLowerCase())
)
.map(workspace => (
<WorkspaceItem
key={workspace.id}
selectedWorkspaces={selectedWorkspaces}
workspace={workspace}
selected={selectedWorkspaces.some(
selectedWorkspace => selectedWorkspace.id === workspace.id
)}
onSelect={handleWorkspaceSelect}
/>
))}
{workspaces
.filter(
workspace =>
!selectedWorkspaces.some(
selectedWorkspace => selectedWorkspace.id === workspace.id
) && workspace.name.toLowerCase().includes(search.toLowerCase())
)
.map(workspace => (
<WorkspaceItem
key={workspace.id}
selectedWorkspaces={selectedWorkspaces}
workspace={workspace}
selected={selectedWorkspaces.some(
selectedWorkspace => selectedWorkspace.id === workspace.id
)}
onSelect={handleWorkspaceSelect}
/>
))}
</DropdownMenuContent>
</DropdownMenu>
)
}
interfaceWorkspaceItemProps {
selectedWorkspaces:Tables<"workspaces">[]
workspace:Tables<"workspaces">
selected:boolean
onSelect:(workspace:Tables<"workspaces">) => void
}
constWorkspaceItem:FC<WorkspaceItemProps> = ({
selectedWorkspaces,
workspace,
selected,
onSelect
}) => {
consthandleSelect = () => {
if (selected && selectedWorkspaces.length === 1) {
toast.info("You must select at least one workspace")
return
}
onSelect(workspace)
}
return (
<div
className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
onClick={handleSelect}
>
<div className="flex grow items-center truncate">
<div className="truncate">{workspace.name}</div>
</div>
{selected && (
<IconCircleCheckFilled size={20} className="min-w-[30px] flex-none" />
)}
</div>
)
}

// File: components/workspace/delete-workspace.tsx
import{useChatHandler}from "@/components/chat/chat-hooks/use-chat-handler"
import{Button}from "@/components/ui/button"
import{
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger
}from "@/components/ui/dialog"
import{ChatbotUIContext}from "@/context/context"
import{deleteWorkspace}from "@/db/workspaces"
import{Tables}from "@/supabase/types"
import{FC,useContext,useRef,useState}from "react"
import{Input}from "../ui/input"
import{useRouter}from "next/navigation"
interfaceDeleteWorkspaceProps {
workspace:Tables<"workspaces">
onDelete:() => void
}
export constDeleteWorkspace:FC<DeleteWorkspaceProps> = ({
workspace,
onDelete
}) => {
const{setWorkspaces,setSelectedWorkspace} = useContext(ChatbotUIContext)
const{handleNewChat} = useChatHandler()
constrouter = useRouter()
constbuttonRef = useRef<HTMLButtonElement>(null)
const[showWorkspaceDialog,setShowWorkspaceDialog] = useState(false)
const[name,setName] = useState("")
consthandleDeleteWorkspace = async () => {
await deleteWorkspace(workspace.id)
setWorkspaces(prevWorkspaces => {
constfilteredWorkspaces = prevWorkspaces.filter(
w => w.id !== workspace.id
)
constdefaultWorkspace = filteredWorkspaces[0]
setSelectedWorkspace(defaultWorkspace)
router.push(`/${defaultWorkspace.id}/chat`)
return filteredWorkspaces
})
setShowWorkspaceDialog(false)
onDelete()
handleNewChat()
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
buttonRef.current?.click()
}
}
return (
<Dialog open={showWorkspaceDialog} onOpenChange={setShowWorkspaceDialog}>
<DialogTrigger asChild>
<Button variant="destructive">Delete</Button>
</DialogTrigger>
<DialogContent onKeyDown={handleKeyDown}>
<DialogHeader>
<DialogTitle>Delete {workspace.name}</DialogTitle>
<DialogDescription className="space-y-1">
WARNING:Deleting a workspace will delete all of its data.
</DialogDescription>
</DialogHeader>
<Input
className="mt-4"
placeholder="Type the name of this workspace to confirm"
value={name}
onChange={e => setName(e.target.value)}
/>
<DialogFooter>
<Button variant="ghost" onClick={() => setShowWorkspaceDialog(false)}>
Cancel
</Button>
<Button
ref={buttonRef}
variant="destructive"
onClick={handleDeleteWorkspace}
disabled={name !== workspace.name}
>
Delete
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)
}

// File: components/workspace/oauth-integrations.tsx
"use client"
import{useState,useContext,useEffect}from "react"
import{usePathname,useRouter,useSearchParams}from "next/navigation"
import{ChatbotUIContext}from "@/context/context"
import{IconPlug}from "@tabler/icons-react"
import{Button}from "../ui/button"
import{
Sheet,
SheetContent,
SheetHeader,
SheetTitle,
SheetTrigger
}from "../ui/sheet"
import{WithTooltip}from "../ui/with-tooltip"
import{login,logout}from "@/app/[locale]/protected/actions/auth"
interfaceOAuthIntegration {
id:string
name:string
description:string
icon:React.ReactNode
isInstalled:boolean
}
constOAUTH_INTEGRATIONS:OAuthIntegration[] = [
{
id:"google",
name:"Google",
description:
"Connect your Google account to access various Google services.",
icon:(
<svg viewBox="0 0 24 24" className="size-6">
<path
fill="#4285F4"
d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
/>
<path
fill="#34A853"
d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
/>
<path
fill="#FBBC05"
d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
/>
<path
fill="#EA4335"
d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
/>
</svg>
),
isInstalled:false
},
{
id:"azure",
name:"Azure",
description:"Integrate with Microsoft Azure for cloud computing services.",
icon:(
<svg viewBox="0 0 23 23" className="size-6">
<path fill="#f35325" d="M1 1h10v10H1z" />
<path fill="#81bc06" d="M12 1h10v10H12z" />
<path fill="#05a6f0" d="M1 12h10v10H1z" />
<path fill="#ffba08" d="M12 12h10v10H12z" />
</svg>
),
isInstalled:false
}
]
export constOAuthIntegrations = () => {
const[isOpen,setIsOpen] = useState(false)
const{selectedWorkspace} = useContext(ChatbotUIContext)
constpathname = usePathname()
constrouter = useRouter()
constsearchParams = useSearchParams()
useEffect(() => {
constoauthOpen = searchParams.get("oauthOpen")
if (oauthOpen === "true") {
setIsOpen(true)
}
},[searchParams])
consthandleAction = async (
action:typeof login | typeof logout,
integration:OAuthIntegration
) => {
constformData = new FormData()
constcurrentParams = new URLSearchParams(searchParams.toString())
currentParams.set("oauthOpen","true")
formData.append("origin",`${pathname}?${currentParams.toString()}`)
formData.append("integration",integration.id)
await action(null,formData)
}
consthandleOpenChange = (open:boolean) => {
setIsOpen(open)
constnewParams = new URLSearchParams(searchParams.toString())
if (open) {
newParams.set("oauthOpen","true")
} else {
newParams.delete("oauthOpen")
}
router.push(`${pathname}?${newParams.toString()}`)
}
return (
<Sheet open={isOpen} onOpenChange={handleOpenChange}>
<SheetTrigger asChild>
<WithTooltip
display={<div>OAuth Integrations</div>}
trigger={
<IconPlug
className="ml-3 cursor-pointer pr-[5px] hover:opacity-50"
size={32}
onClick={() => handleOpenChange(true)}
/>
}
/>
</SheetTrigger>
<SheetContent className="flex flex-col justify-between" side="left">
<div className="grow overflow-auto">
<SheetHeader>
<SheetTitle>OAuth Integrations</SheetTitle>
</SheetHeader>
<div className="mt-4 space-y-4">
{OAUTH_INTEGRATIONS.map(integration => (
<div
key={integration.id}
className="flex items-center justify-between space-x-4 rounded-lg border p-4"
>
<div className="flex items-center space-x-4">
<div className="size-10 shrink-0">{integration.icon}</div>
<div>
<h3 className="font-semibold">{integration.name}</h3>
<p className="text-sm text-gray-500">
{integration.description}
</p>
</div>
</div>
<Button
onClick={() =>
handleAction(
integration.isInstalled ? logout :login,
integration
)
}
variant={integration.isInstalled ? "destructive" :"default"}
>
{integration.isInstalled ? "Uninstall" :"Install"}
</Button>
</div>
))}
</div>
</div>
<div className="mt-6 flex justify-end">
<Button onClick={() => handleOpenChange(false)}>Close</Button>
</div>
</SheetContent>
</Sheet>
)
}

// File: components/workspace/workspace-settings.tsx
import{ChatbotUIContext}from "@/context/context"
import{WORKSPACE_INSTRUCTIONS_MAX}from "@/db/limits"
import{
getWorkspaceImageFromStorage,
uploadWorkspaceImage
}from "@/db/storage/workspace-images"
import{updateWorkspace}from "@/db/workspaces"
import{convertBlobToBase64}from "@/lib/blob-to-b64"
import{LLMID}from "@/types"
import{IconHome,IconSettings}from "@tabler/icons-react"
import{FC,useContext,useEffect,useRef,useState}from "react"
import{toast}from "sonner"
import{Button}from "../ui/button"
import{ChatSettingsForm}from "../ui/chat-settings-form"
import ImagePicker from "../ui/image-picker"
import{Input}from "../ui/input"
import{Label}from "../ui/label"
import{LimitDisplay}from "../ui/limit-display"
import{
Sheet,
SheetContent,
SheetHeader,
SheetTitle,
SheetTrigger
}from "../ui/sheet"
import{Tabs,TabsContent,TabsList,TabsTrigger}from "../ui/tabs"
import{TextareaAutosize}from "../ui/textarea-autosize"
import{WithTooltip}from "../ui/with-tooltip"
import{DeleteWorkspace}from "./delete-workspace"
interfaceWorkspaceSettingsProps {}
export constWorkspaceSettings:FC<WorkspaceSettingsProps> = ({}) => {
const{
profile,
selectedWorkspace,
setSelectedWorkspace,
setWorkspaces,
setChatSettings,
workspaceImages,
setWorkspaceImages
} = useContext(ChatbotUIContext)
constbuttonRef = useRef<HTMLButtonElement>(null)
const[isOpen,setIsOpen] = useState(false)
const[name,setName] = useState(selectedWorkspace?.name || "")
const[imageLink,setImageLink] = useState("")
const[selectedImage,setSelectedImage] = useState<File | null>(null)
const[description,setDescription] = useState(
selectedWorkspace?.description || ""
)
const[instructions,setInstructions] = useState(
selectedWorkspace?.instructions || ""
)
const[defaultChatSettings,setDefaultChatSettings] = useState({
model:selectedWorkspace?.default_model,
prompt:selectedWorkspace?.default_prompt,
temperature:selectedWorkspace?.default_temperature,
contextLength:selectedWorkspace?.default_context_length,
includeProfileContext:selectedWorkspace?.include_profile_context,
includeWorkspaceInstructions:
selectedWorkspace?.include_workspace_instructions,
embeddingsProvider:selectedWorkspace?.embeddings_provider
})
useEffect(() => {
constworkspaceImage =
workspaceImages.find(
image => image.path === selectedWorkspace?.image_path
)?.base64 || ""
setImageLink(workspaceImage)
},[workspaceImages])
consthandleSave = async () => {
if (!selectedWorkspace) return
letimagePath = ""
if (selectedImage) {
imagePath = await uploadWorkspaceImage(selectedWorkspace,selectedImage)
consturl = (await getWorkspaceImageFromStorage(imagePath)) || ""
if (url) {
constresponse = await fetch(url)
constblob = await response.blob()
constbase64 = await convertBlobToBase64(blob)
setWorkspaceImages(prev => [
...prev,
{
workspaceId:selectedWorkspace.id,
path:imagePath,
base64,
url
}
])
}
}
constupdatedWorkspace = await updateWorkspace(selectedWorkspace.id,{
...selectedWorkspace,
name,
description,
image_path:imagePath,
instructions,
default_model:defaultChatSettings.model,
default_prompt:defaultChatSettings.prompt,
default_temperature:defaultChatSettings.temperature,
default_context_length:defaultChatSettings.contextLength,
embeddings_provider:defaultChatSettings.embeddingsProvider,
include_profile_context:defaultChatSettings.includeProfileContext,
include_workspace_instructions:
defaultChatSettings.includeWorkspaceInstructions
})
if (
defaultChatSettings.model &&
defaultChatSettings.prompt &&
defaultChatSettings.temperature &&
defaultChatSettings.contextLength &&
defaultChatSettings.includeProfileContext &&
defaultChatSettings.includeWorkspaceInstructions &&
defaultChatSettings.embeddingsProvider
) {
setChatSettings({
model:defaultChatSettings.model as LLMID,
prompt:defaultChatSettings.prompt,
temperature:defaultChatSettings.temperature,
contextLength:defaultChatSettings.contextLength,
includeProfileContext:defaultChatSettings.includeProfileContext,
includeWorkspaceInstructions:
defaultChatSettings.includeWorkspaceInstructions,
embeddingsProvider:defaultChatSettings.embeddingsProvider as
| "openai"
| "local"
})
}
setIsOpen(false)
setSelectedWorkspace(updatedWorkspace)
setWorkspaces(workspaces => {
return workspaces.map(workspace => {
if (workspace.id === selectedWorkspace.id) {
return updatedWorkspace
}
return workspace
})
})
toast.success("Workspace updated!")
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter" && !e.shiftKey) {
buttonRef.current?.click()
}
}
if (!selectedWorkspace || !profile) return null
return (
<Sheet open={isOpen} onOpenChange={setIsOpen}>
<SheetTrigger asChild>
<WithTooltip
display={<div>Workspace Settings</div>}
trigger={
<IconSettings
className="ml-3 cursor-pointer pr-[5px] hover:opacity-50"
size={32}
onClick={() => setIsOpen(true)}
/>
}
/>
</SheetTrigger>
<SheetContent
className="flex flex-col justify-between"
side="left"
onKeyDown={handleKeyDown}
>
<div className="grow overflow-auto">
<SheetHeader>
<SheetTitle className="flex items-center justify-between">
Workspace Settings
{selectedWorkspace?.is_home && <IconHome />}
</SheetTitle>
{selectedWorkspace?.is_home && (
<div className="text-sm font-light">
This is your home workspace for personal use.
</div>
)}
</SheetHeader>
<Tabs defaultValue="main">
<TabsList className="mt-4 grid w-full grid-cols-2">
<TabsTrigger value="main">Main</TabsTrigger>
<TabsTrigger value="defaults">Defaults</TabsTrigger>
</TabsList>
<TabsContent className="mt-4 space-y-4" value="main">
<>
<div className="space-y-1">
<Label>Workspace Name</Label>
<Input
placeholder="Name..."
value={name}
onChange={e => setName(e.target.value)}
/>
</div>
{/* <div className="space-y-1">
<Label>Description</Label>
<Input
placeholder="Description... (optional)"
value={description}
onChange={e => setDescription(e.target.value)}
/>
</div> */}
<div className="space-y-1">
<Label>Workspace Image</Label>
<ImagePicker
src={imageLink}
image={selectedImage}
onSrcChange={setImageLink}
onImageChange={setSelectedImage}
width={50}
height={50}
/>
</div>
</>
<div className="space-y-1">
<Label>
How would you like the AI to respond in this workspace?
</Label>
<TextareaAutosize
placeholder="Instructions... (optional)"
value={instructions}
onValueChange={setInstructions}
minRows={5}
maxRows={10}
maxLength={1500}
/>
<LimitDisplay
used={instructions.length}
limit={WORKSPACE_INSTRUCTIONS_MAX}
/>
</div>
</TabsContent>
<TabsContent className="mt-5" value="defaults">
<div className="mb-4 text-sm">
These are the settings your workspace begins with when selected.
</div>
<ChatSettingsForm
chatSettings={defaultChatSettings as any}
onChangeChatSettings={setDefaultChatSettings}
/>
</TabsContent>
</Tabs>
</div>
<div className="mt-6 flex justify-between">
<div>
{!selectedWorkspace.is_home && (
<DeleteWorkspace
workspace={selectedWorkspace}
onDelete={() => setIsOpen(false)}
/>
)}
</div>
<div className="space-x-2">
<Button variant="ghost" onClick={() => setIsOpen(false)}>
Cancel
</Button>
<Button ref={buttonRef} onClick={handleSave}>
Save
</Button>
</div>
</div>
</SheetContent>
</Sheet>
)
}

// File: context/context.tsx
import{Tables}from "@/supabase/types"
import{
ChatFile,
ChatMessage,
ChatSettings,
LLM,
MessageImage,
OpenRouterLLM,
WorkspaceImage
}from "@/types"
import{AssistantImage}from "@/types/images/assistant-image"
import{VALID_ENV_KEYS}from "@/types/valid-keys"
import{Dispatch,SetStateAction,createContext}from "react"
interfaceChatbotUIContext {

profile:Tables<"profiles"> | null
setProfile:Dispatch<SetStateAction<Tables<"profiles"> | null>>

assistants:Tables<"assistants">[]
setAssistants:Dispatch<SetStateAction<Tables<"assistants">[]>>
collections:Tables<"collections">[]
setCollections:Dispatch<SetStateAction<Tables<"collections">[]>>
chats:Tables<"chats">[]
setChats:Dispatch<SetStateAction<Tables<"chats">[]>>
files:Tables<"files">[]
setFiles:Dispatch<SetStateAction<Tables<"files">[]>>
folders:Tables<"folders">[]
setFolders:Dispatch<SetStateAction<Tables<"folders">[]>>
models:Tables<"models">[]
setModels:Dispatch<SetStateAction<Tables<"models">[]>>
presets:Tables<"presets">[]
setPresets:Dispatch<SetStateAction<Tables<"presets">[]>>
prompts:Tables<"prompts">[]
setPrompts:Dispatch<SetStateAction<Tables<"prompts">[]>>
tools:Tables<"tools">[]
setTools:Dispatch<SetStateAction<Tables<"tools">[]>>
workspaces:Tables<"workspaces">[]
setWorkspaces:Dispatch<SetStateAction<Tables<"workspaces">[]>>

envKeyMap:Record<string,VALID_ENV_KEYS>
setEnvKeyMap:Dispatch<SetStateAction<Record<string,VALID_ENV_KEYS>>>
availableHostedModels:LLM[]
setAvailableHostedModels:Dispatch<SetStateAction<LLM[]>>
availableLocalModels:LLM[]
setAvailableLocalModels:Dispatch<SetStateAction<LLM[]>>
availableOpenRouterModels:OpenRouterLLM[]
setAvailableOpenRouterModels:Dispatch<SetStateAction<OpenRouterLLM[]>>

selectedWorkspace:Tables<"workspaces"> | null
setSelectedWorkspace:Dispatch<SetStateAction<Tables<"workspaces"> | null>>
workspaceImages:WorkspaceImage[]
setWorkspaceImages:Dispatch<SetStateAction<WorkspaceImage[]>>

selectedPreset:Tables<"presets"> | null
setSelectedPreset:Dispatch<SetStateAction<Tables<"presets"> | null>>

selectedAssistant:Tables<"assistants"> | null
setSelectedAssistant:Dispatch<SetStateAction<Tables<"assistants"> | null>>
assistantImages:AssistantImage[]
setAssistantImages:Dispatch<SetStateAction<AssistantImage[]>>
openaiAssistants:any[]
setOpenaiAssistants:Dispatch<SetStateAction<any[]>>

userInput:string
setUserInput:Dispatch<SetStateAction<string>>
chatMessages:ChatMessage[]
setChatMessages:Dispatch<SetStateAction<ChatMessage[]>>
chatSettings:ChatSettings | null
setChatSettings:Dispatch<SetStateAction<ChatSettings>>
selectedChat:Tables<"chats"> | null
setSelectedChat:Dispatch<SetStateAction<Tables<"chats"> | null>>
chatFileItems:Tables<"file_items">[]
setChatFileItems:Dispatch<SetStateAction<Tables<"file_items">[]>>

abortController:AbortController | null
setAbortController:Dispatch<SetStateAction<AbortController | null>>
firstTokenReceived:boolean
setFirstTokenReceived:Dispatch<SetStateAction<boolean>>
isGenerating:boolean
setIsGenerating:Dispatch<SetStateAction<boolean>>

isPromptPickerOpen:boolean
setIsPromptPickerOpen:Dispatch<SetStateAction<boolean>>
slashCommand:string
setSlashCommand:Dispatch<SetStateAction<string>>
isFilePickerOpen:boolean
setIsFilePickerOpen:Dispatch<SetStateAction<boolean>>
hashtagCommand:string
setHashtagCommand:Dispatch<SetStateAction<string>>
isToolPickerOpen:boolean
setIsToolPickerOpen:Dispatch<SetStateAction<boolean>>
toolCommand:string
setToolCommand:Dispatch<SetStateAction<string>>
focusPrompt:boolean
setFocusPrompt:Dispatch<SetStateAction<boolean>>
focusFile:boolean
setFocusFile:Dispatch<SetStateAction<boolean>>
focusTool:boolean
setFocusTool:Dispatch<SetStateAction<boolean>>
focusAssistant:boolean
setFocusAssistant:Dispatch<SetStateAction<boolean>>
atCommand:string
setAtCommand:Dispatch<SetStateAction<string>>
isAssistantPickerOpen:boolean
setIsAssistantPickerOpen:Dispatch<SetStateAction<boolean>>

chatFiles:ChatFile[]
setChatFiles:Dispatch<SetStateAction<ChatFile[]>>
chatImages:MessageImage[]
setChatImages:Dispatch<SetStateAction<MessageImage[]>>
newMessageFiles:ChatFile[]
setNewMessageFiles:Dispatch<SetStateAction<ChatFile[]>>
newMessageImages:MessageImage[]
setNewMessageImages:Dispatch<SetStateAction<MessageImage[]>>
showFilesDisplay:boolean
setShowFilesDisplay:Dispatch<SetStateAction<boolean>>

useRetrieval:boolean
setUseRetrieval:Dispatch<SetStateAction<boolean>>
sourceCount:number
setSourceCount:Dispatch<SetStateAction<number>>

selectedTools:Tables<"tools">[]
setSelectedTools:Dispatch<SetStateAction<Tables<"tools">[]>>
toolInUse:string
setToolInUse:Dispatch<SetStateAction<string>>
}
export constChatbotUIContext = createContext<ChatbotUIContext>({

profile:null,
setProfile:() => {},

assistants:[],
setAssistants:() => {},
collections:[],
setCollections:() => {},
chats:[],
setChats:() => {},
files:[],
setFiles:() => {},
folders:[],
setFolders:() => {},
models:[],
setModels:() => {},
presets:[],
setPresets:() => {},
prompts:[],
setPrompts:() => {},
tools:[],
setTools:() => {},
workspaces:[],
setWorkspaces:() => {},

envKeyMap:{},
setEnvKeyMap:() => {},
availableHostedModels:[],
setAvailableHostedModels:() => {},
availableLocalModels:[],
setAvailableLocalModels:() => {},
availableOpenRouterModels:[],
setAvailableOpenRouterModels:() => {},

selectedWorkspace:null,
setSelectedWorkspace:() => {},
workspaceImages:[],
setWorkspaceImages:() => {},

selectedPreset:null,
setSelectedPreset:() => {},

selectedAssistant:null,
setSelectedAssistant:() => {},
assistantImages:[],
setAssistantImages:() => {},
openaiAssistants:[],
setOpenaiAssistants:() => {},

userInput:"",
setUserInput:() => {},
selectedChat:null,
setSelectedChat:() => {},
chatMessages:[],
setChatMessages:() => {},
chatSettings:null,
setChatSettings:() => {},
chatFileItems:[],
setChatFileItems:() => {},

isGenerating:false,
setIsGenerating:() => {},
firstTokenReceived:false,
setFirstTokenReceived:() => {},
abortController:null,
setAbortController:() => {},

isPromptPickerOpen:false,
setIsPromptPickerOpen:() => {},
slashCommand:"",
setSlashCommand:() => {},
isFilePickerOpen:false,
setIsFilePickerOpen:() => {},
hashtagCommand:"",
setHashtagCommand:() => {},
isToolPickerOpen:false,
setIsToolPickerOpen:() => {},
toolCommand:"",
setToolCommand:() => {},
focusPrompt:false,
setFocusPrompt:() => {},
focusFile:false,
setFocusFile:() => {},
focusTool:false,
setFocusTool:() => {},
focusAssistant:false,
setFocusAssistant:() => {},
atCommand:"",
setAtCommand:() => {},
isAssistantPickerOpen:false,
setIsAssistantPickerOpen:() => {},

chatFiles:[],
setChatFiles:() => {},
chatImages:[],
setChatImages:() => {},
newMessageFiles:[],
setNewMessageFiles:() => {},
newMessageImages:[],
setNewMessageImages:() => {},
showFilesDisplay:false,
setShowFilesDisplay:() => {},

useRetrieval:false,
setUseRetrieval:() => {},
sourceCount:4,
setSourceCount:() => {},

selectedTools:[],
setSelectedTools:() => {},
toolInUse:"none",
setToolInUse:() => {}
})

// File: db/assistant-collections.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert}from "@/supabase/types"
export constgetAssistantCollectionsByAssistantId = async (
assistantId:string
) => {
const{data:assistantCollections,error} = await supabase
.from("assistants")
.select(
`
id,
name,
collections (*)
`
)
.eq("id",assistantId)
.single()
if (!assistantCollections) {
throw new Error(error.message)
}
return assistantCollections
}
export constcreateAssistantCollection = async (
assistantCollection:TablesInsert<"assistant_collections">
) => {
const{data:createdAssistantCollection,error} = await supabase
.from("assistant_collections")
.insert(assistantCollection)
.select("*")
if (!createdAssistantCollection) {
throw new Error(error.message)
}
return createdAssistantCollection
}
export constcreateAssistantCollections = async (
assistantCollections:TablesInsert<"assistant_collections">[]
) => {
const{data:createdAssistantCollections,error} = await supabase
.from("assistant_collections")
.insert(assistantCollections)
.select("*")
if (!createdAssistantCollections) {
throw new Error(error.message)
}
return createdAssistantCollections
}
export constdeleteAssistantCollection = async (
assistantId:string,
collectionId:string
) => {
const{error} = await supabase
.from("assistant_collections")
.delete()
.eq("assistant_id",assistantId)
.eq("collection_id",collectionId)
if (error) throw new Error(error.message)
return true
}

// File: db/assistant-files.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert}from "@/supabase/types"
export constgetAssistantFilesByAssistantId = async (assistantId:string) => {
const{data:assistantFiles,error} = await supabase
.from("assistants")
.select(
`
id,
name,
files (*)
`
)
.eq("id",assistantId)
.single()
if (!assistantFiles) {
throw new Error(error.message)
}
return assistantFiles
}
export constcreateAssistantFile = async (
assistantFile:TablesInsert<"assistant_files">
) => {
const{data:createdAssistantFile,error} = await supabase
.from("assistant_files")
.insert(assistantFile)
.select("*")
if (!createdAssistantFile) {
throw new Error(error.message)
}
return createdAssistantFile
}
export constcreateAssistantFiles = async (
assistantFiles:TablesInsert<"assistant_files">[]
) => {
const{data:createdAssistantFiles,error} = await supabase
.from("assistant_files")
.insert(assistantFiles)
.select("*")
if (!createdAssistantFiles) {
throw new Error(error.message)
}
return createdAssistantFiles
}
export constdeleteAssistantFile = async (
assistantId:string,
fileId:string
) => {
const{error} = await supabase
.from("assistant_files")
.delete()
.eq("assistant_id",assistantId)
.eq("file_id",fileId)
if (error) throw new Error(error.message)
return true
}

// File: db/assistant-tools.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert}from "@/supabase/types"
export constgetAssistantToolsByAssistantId = async (assistantId:string) => {
const{data:assistantTools,error} = await supabase
.from("assistants")
.select(
`
id,
name,
tools (*)
`
)
.eq("id",assistantId)
.single()
if (!assistantTools) {
throw new Error(error.message)
}
return assistantTools
}
export constcreateAssistantTool = async (
assistantTool:TablesInsert<"assistant_tools">
) => {
const{data:createdAssistantTool,error} = await supabase
.from("assistant_tools")
.insert(assistantTool)
.select("*")
if (!createdAssistantTool) {
throw new Error(error.message)
}
return createdAssistantTool
}
export constcreateAssistantTools = async (
assistantTools:TablesInsert<"assistant_tools">[]
) => {
const{data:createdAssistantTools,error} = await supabase
.from("assistant_tools")
.insert(assistantTools)
.select("*")
if (!createdAssistantTools) {
throw new Error(error.message)
}
return createdAssistantTools
}
export constdeleteAssistantTool = async (
assistantId:string,
toolId:string
) => {
const{error} = await supabase
.from("assistant_tools")
.delete()
.eq("assistant_id",assistantId)
.eq("tool_id",toolId)
if (error) throw new Error(error.message)
return true
}

// File: db/assistants.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetAssistantById = async (assistantId:string) => {
const{data:assistant,error} = await supabase
.from("assistants")
.select("*")
.eq("id",assistantId)
.single()
if (!assistant) {
throw new Error(error.message)
}
return assistant
}
export constgetAssistantWorkspacesByWorkspaceId = async (
workspaceId:string
) => {
const{data:workspace,error} = await supabase
.from("workspaces")
.select(
`
id,
name,
assistants (*)
`
)
.eq("id",workspaceId)
.single()
if (!workspace) {
throw new Error(error.message)
}
return workspace
}
export constgetAssistantWorkspacesByAssistantId = async (
assistantId:string
) => {
const{data:assistant,error} = await supabase
.from("assistants")
.select(
`
id,
name,
workspaces (*)
`
)
.eq("id",assistantId)
.single()
if (!assistant) {
throw new Error(error.message)
}
return assistant
}
export constcreateAssistant = async (
assistant:TablesInsert<"assistants">,
workspace_id:string
) => {
const{data:createdAssistant,error} = await supabase
.from("assistants")
.insert([assistant])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
await createAssistantWorkspace({
user_id:createdAssistant.user_id,
assistant_id:createdAssistant.id,
workspace_id
})
return createdAssistant
}
export constcreateAssistants = async (
assistants:TablesInsert<"assistants">[],
workspace_id:string
) => {
const{data:createdAssistants,error} = await supabase
.from("assistants")
.insert(assistants)
.select("*")
if (error) {
throw new Error(error.message)
}
await createAssistantWorkspaces(
createdAssistants.map(assistant => ({
user_id:assistant.user_id,
assistant_id:assistant.id,
workspace_id
}))
)
return createdAssistants
}
export constcreateAssistantWorkspace = async (item:{
user_id:string
assistant_id:string
workspace_id:string
}) => {
const{data:createdAssistantWorkspace,error} = await supabase
.from("assistant_workspaces")
.insert([item])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdAssistantWorkspace
}
export constcreateAssistantWorkspaces = async (
items:{user_id:string;assistant_id:string;workspace_id:string}[]
) => {
const{data:createdAssistantWorkspaces,error} = await supabase
.from("assistant_workspaces")
.insert(items)
.select("*")
if (error) throw new Error(error.message)
return createdAssistantWorkspaces
}
export constupdateAssistant = async (
assistantId:string,
assistant:TablesUpdate<"assistants">
) => {
const{data:updatedAssistant,error} = await supabase
.from("assistants")
.update(assistant)
.eq("id",assistantId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedAssistant
}
export constdeleteAssistant = async (assistantId:string) => {
const{error} = await supabase
.from("assistants")
.delete()
.eq("id",assistantId)
if (error) {
throw new Error(error.message)
}
return true
}
export constdeleteAssistantWorkspace = async (
assistantId:string,
workspaceId:string
) => {
const{error} = await supabase
.from("assistant_workspaces")
.delete()
.eq("assistant_id",assistantId)
.eq("workspace_id",workspaceId)
if (error) throw new Error(error.message)
return true
}

// File: db/chat-files.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert}from "@/supabase/types"
export constgetChatFilesByChatId = async (chatId:string) => {
const{data:chatFiles,error} = await supabase
.from("chats")
.select(
`
id,
name,
files (*)
`
)
.eq("id",chatId)
.single()
if (!chatFiles) {
throw new Error(error.message)
}
return chatFiles
}
export constcreateChatFile = async (chatFile:TablesInsert<"chat_files">) => {
const{data:createdChatFile,error} = await supabase
.from("chat_files")
.insert(chatFile)
.select("*")
if (!createdChatFile) {
throw new Error(error.message)
}
return createdChatFile
}
export constcreateChatFiles = async (
chatFiles:TablesInsert<"chat_files">[]
) => {
const{data:createdChatFiles,error} = await supabase
.from("chat_files")
.insert(chatFiles)
.select("*")
if (!createdChatFiles) {
throw new Error(error.message)
}
return createdChatFiles
}

// File: db/chats.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetChatById = async (chatId:string) => {
const{data:chat} = await supabase
.from("chats")
.select("*")
.eq("id",chatId)
.maybeSingle()
return chat
}
export constgetChatsByWorkspaceId = async (workspaceId:string) => {
const{data:chats,error} = await supabase
.from("chats")
.select("*")
.eq("workspace_id",workspaceId)
.order("created_at",{ascending:false})
if (!chats) {
throw new Error(error.message)
}
return chats
}
export constcreateChat = async (chat:TablesInsert<"chats">) => {
const{data:createdChat,error} = await supabase
.from("chats")
.insert([chat])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdChat
}
export constcreateChats = async (chats:TablesInsert<"chats">[]) => {
const{data:createdChats,error} = await supabase
.from("chats")
.insert(chats)
.select("*")
if (error) {
throw new Error(error.message)
}
return createdChats
}
export constupdateChat = async (
chatId:string,
chat:TablesUpdate<"chats">
) => {
const{data:updatedChat,error} = await supabase
.from("chats")
.update(chat)
.eq("id",chatId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedChat
}
export constdeleteChat = async (chatId:string) => {
const{error} = await supabase.from("chats").delete().eq("id",chatId)
if (error) {
throw new Error(error.message)
}
return true
}

// File: db/collection-files.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert}from "@/supabase/types"
export constgetCollectionFilesByCollectionId = async (
collectionId:string
) => {
const{data:collectionFiles,error} = await supabase
.from("collections")
.select(
`
id,
name,
files ( id,name,type)
`
)
.eq("id",collectionId)
.single()
if (!collectionFiles) {
throw new Error(error.message)
}
return collectionFiles
}
export constcreateCollectionFile = async (
collectionFile:TablesInsert<"collection_files">
) => {
const{data:createdCollectionFile,error} = await supabase
.from("collection_files")
.insert(collectionFile)
.select("*")
if (!createdCollectionFile) {
throw new Error(error.message)
}
return createdCollectionFile
}
export constcreateCollectionFiles = async (
collectionFiles:TablesInsert<"collection_files">[]
) => {
const{data:createdCollectionFiles,error} = await supabase
.from("collection_files")
.insert(collectionFiles)
.select("*")
if (!createdCollectionFiles) {
throw new Error(error.message)
}
return createdCollectionFiles
}
export constdeleteCollectionFile = async (
collectionId:string,
fileId:string
) => {
const{error} = await supabase
.from("collection_files")
.delete()
.eq("collection_id",collectionId)
.eq("file_id",fileId)
if (error) throw new Error(error.message)
return true
}

// File: db/collections.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetCollectionById = async (collectionId:string) => {
const{data:collection,error} = await supabase
.from("collections")
.select("*")
.eq("id",collectionId)
.single()
if (!collection) {
throw new Error(error.message)
}
return collection
}
export constgetCollectionWorkspacesByWorkspaceId = async (
workspaceId:string
) => {
const{data:workspace,error} = await supabase
.from("workspaces")
.select(
`
id,
name,
collections (*)
`
)
.eq("id",workspaceId)
.single()
if (!workspace) {
throw new Error(error.message)
}
return workspace
}
export constgetCollectionWorkspacesByCollectionId = async (
collectionId:string
) => {
const{data:collection,error} = await supabase
.from("collections")
.select(
`
id,
name,
workspaces (*)
`
)
.eq("id",collectionId)
.single()
if (!collection) {
throw new Error(error.message)
}
return collection
}
export constcreateCollection = async (
collection:TablesInsert<"collections">,
workspace_id:string
) => {
const{data:createdCollection,error} = await supabase
.from("collections")
.insert([collection])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
await createCollectionWorkspace({
user_id:createdCollection.user_id,
collection_id:createdCollection.id,
workspace_id
})
return createdCollection
}
export constcreateCollections = async (
collections:TablesInsert<"collections">[],
workspace_id:string
) => {
const{data:createdCollections,error} = await supabase
.from("collections")
.insert(collections)
.select("*")
if (error) {
throw new Error(error.message)
}
await createCollectionWorkspaces(
createdCollections.map(collection => ({
user_id:collection.user_id,
collection_id:collection.id,
workspace_id
}))
)
return createdCollections
}
export constcreateCollectionWorkspace = async (item:{
user_id:string
collection_id:string
workspace_id:string
}) => {
const{data:createdCollectionWorkspace,error} = await supabase
.from("collection_workspaces")
.insert([item])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdCollectionWorkspace
}
export constcreateCollectionWorkspaces = async (
items:{user_id:string;collection_id:string;workspace_id:string}[]
) => {
const{data:createdCollectionWorkspaces,error} = await supabase
.from("collection_workspaces")
.insert(items)
.select("*")
if (error) throw new Error(error.message)
return createdCollectionWorkspaces
}
export constupdateCollection = async (
collectionId:string,
collection:TablesUpdate<"collections">
) => {
const{data:updatedCollection,error} = await supabase
.from("collections")
.update(collection)
.eq("id",collectionId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedCollection
}
export constdeleteCollection = async (collectionId:string) => {
const{error} = await supabase
.from("collections")
.delete()
.eq("id",collectionId)
if (error) {
throw new Error(error.message)
}
return true
}
export constdeleteCollectionWorkspace = async (
collectionId:string,
workspaceId:string
) => {
const{error} = await supabase
.from("collection_workspaces")
.delete()
.eq("collection_id",collectionId)
.eq("workspace_id",workspaceId)
if (error) throw new Error(error.message)
return true
}

// File: db/files.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
import mammoth from "mammoth"
import{toast}from "sonner"
import{uploadFile}from "./storage/files"
export constgetFileById = async (fileId:string) => {
const{data:file,error} = await supabase
.from("files")
.select("*")
.eq("id",fileId)
.single()
if (!file) {
throw new Error(error.message)
}
return file
}
export constgetFileWorkspacesByWorkspaceId = async (workspaceId:string) => {
const{data:workspace,error} = await supabase
.from("workspaces")
.select(
`
id,
name,
files (*)
`
)
.eq("id",workspaceId)
.single()
if (!workspace) {
throw new Error(error.message)
}
return workspace
}
export constgetFileWorkspacesByFileId = async (fileId:string) => {
const{data:file,error} = await supabase
.from("files")
.select(
`
id,
name,
workspaces (*)
`
)
.eq("id",fileId)
.single()
if (!file) {
throw new Error(error.message)
}
return file
}
export constcreateFileBasedOnExtension = async (
file:File,
fileRecord:TablesInsert<"files">,
workspace_id:string,
embeddingsProvider:"openai" | "local"
) => {
constfileExtension = file.name.split(".").pop()
if (fileExtension === "docx") {
constarrayBuffer = await file.arrayBuffer()
constresult = await mammoth.extractRawText({
arrayBuffer
})
return createDocXFile(
result.value,
file,
fileRecord,
workspace_id,
embeddingsProvider
)
} else {
return createFile(file,fileRecord,workspace_id,embeddingsProvider)
}
}

export constcreateFile = async (
file:File,
fileRecord:TablesInsert<"files">,
workspace_id:string,
embeddingsProvider:"openai" | "local"
) => {
letvalidFilename = fileRecord.name.replace(/[^a-z0-9.]/gi,"_").toLowerCase()
constextension = file.name.split(".").pop()
constextensionIndex = validFilename.lastIndexOf(".")
constbaseName = validFilename.substring(
0,
extensionIndex < 0 ? undefined :extensionIndex
)
constmaxBaseNameLength = 100 - (extension?.length || 0) - 1
if (baseName.length > maxBaseNameLength) {
fileRecord.name = baseName.substring(0,maxBaseNameLength) + "." + extension
} else {
fileRecord.name = baseName + "." + extension
}
const{data:createdFile,error} = await supabase
.from("files")
.insert([fileRecord])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
await createFileWorkspace({
user_id:createdFile.user_id,
file_id:createdFile.id,
workspace_id
})
constfilePath = await uploadFile(file,{
name:createdFile.name,
user_id:createdFile.user_id,
file_id:createdFile.name
})
await updateFile(createdFile.id,{
file_path:filePath
})
constformData = new FormData()
formData.append("file_id",createdFile.id)
formData.append("embeddingsProvider",embeddingsProvider)
constresponse = await fetch("/api/retrieval/process",{
method:"POST",
body:formData
})
if (!response.ok) {
constjsonText = await response.text()
constjson = JSON.parse(jsonText)
console.error(
`Error processing file:${createdFile.id},status:${response.status},response:${json.message}`
)
toast.error("Failed to process file. Reason:" + json.message,{
duration:10000
})
await deleteFile(createdFile.id)
}
constfetchedFile = await getFileById(createdFile.id)
return fetchedFile
}

export constcreateDocXFile = async (
text:string,
file:File,
fileRecord:TablesInsert<"files">,
workspace_id:string,
embeddingsProvider:"openai" | "local"
) => {
const{data:createdFile,error} = await supabase
.from("files")
.insert([fileRecord])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
await createFileWorkspace({
user_id:createdFile.user_id,
file_id:createdFile.id,
workspace_id
})
constfilePath = await uploadFile(file,{
name:createdFile.name,
user_id:createdFile.user_id,
file_id:createdFile.name
})
await updateFile(createdFile.id,{
file_path:filePath
})
constresponse = await fetch("/api/retrieval/process/docx",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
text:text,
fileId:createdFile.id,
embeddingsProvider,
fileExtension:"docx"
})
})
if (!response.ok) {
constjsonText = await response.text()
constjson = JSON.parse(jsonText)
console.error(
`Error processing file:${createdFile.id},status:${response.status},response:${json.message}`
)
toast.error("Failed to process file. Reason:" + json.message,{
duration:10000
})
await deleteFile(createdFile.id)
}
constfetchedFile = await getFileById(createdFile.id)
return fetchedFile
}
export constcreateFiles = async (
files:TablesInsert<"files">[],
workspace_id:string
) => {
const{data:createdFiles,error} = await supabase
.from("files")
.insert(files)
.select("*")
if (error) {
throw new Error(error.message)
}
await createFileWorkspaces(
createdFiles.map(file => ({
user_id:file.user_id,
file_id:file.id,
workspace_id
}))
)
return createdFiles
}
export constcreateFileWorkspace = async (item:{
user_id:string
file_id:string
workspace_id:string
}) => {
const{data:createdFileWorkspace,error} = await supabase
.from("file_workspaces")
.insert([item])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdFileWorkspace
}
export constcreateFileWorkspaces = async (
items:{user_id:string;file_id:string;workspace_id:string}[]
) => {
const{data:createdFileWorkspaces,error} = await supabase
.from("file_workspaces")
.insert(items)
.select("*")
if (error) throw new Error(error.message)
return createdFileWorkspaces
}
export constupdateFile = async (
fileId:string,
file:TablesUpdate<"files">
) => {
const{data:updatedFile,error} = await supabase
.from("files")
.update(file)
.eq("id",fileId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedFile
}
export constdeleteFile = async (fileId:string) => {
const{error} = await supabase.from("files").delete().eq("id",fileId)
if (error) {
throw new Error(error.message)
}
return true
}
export constdeleteFileWorkspace = async (
fileId:string,
workspaceId:string
) => {
const{error} = await supabase
.from("file_workspaces")
.delete()
.eq("file_id",fileId)
.eq("workspace_id",workspaceId)
if (error) throw new Error(error.message)
return true
}

// File: db/folders.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetFoldersByWorkspaceId = async (workspaceId:string) => {
const{data:folders,error} = await supabase
.from("folders")
.select("*")
.eq("workspace_id",workspaceId)
if (!folders) {
throw new Error(error.message)
}
return folders
}
export constcreateFolder = async (folder:TablesInsert<"folders">) => {
const{data:createdFolder,error} = await supabase
.from("folders")
.insert([folder])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdFolder
}
export constupdateFolder = async (
folderId:string,
folder:TablesUpdate<"folders">
) => {
const{data:updatedFolder,error} = await supabase
.from("folders")
.update(folder)
.eq("id",folderId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedFolder
}
export constdeleteFolder = async (folderId:string) => {
const{error} = await supabase.from("folders").delete().eq("id",folderId)
if (error) {
throw new Error(error.message)
}
return true
}

// File: db/index.ts
import "./assistants"
import "./chats"
import "./file-items"
import "./files"
import "./folders"
import "./messages"
import "./presets"
import "./profile"
import "./prompts"
import "./workspaces"

// File: db/limits.ts

export constPROFILE_BIO_MAX = 500
export constPROFILE_DISPLAY_NAME_MAX = 100
export constPROFILE_CONTEXT_MAX = 1500
export constPROFILE_USERNAME_MIN = 3
export constPROFILE_USERNAME_MAX = 25

export constWORKSPACE_NAME_MAX = 100
export constWORKSPACE_DESCRIPTION_MAX = 500
export constWORKSPACE_INSTRUCTIONS_MAX = 1500


export constPRESET_NAME_MAX = 100
export constPRESET_DESCRIPTION_MAX = 500
export constPRESET_PROMPT_MAX = 100000

export constPROMPT_NAME_MAX = 100
export constPROMPT_CONTENT_MAX = 100000

export constFILE_NAME_MAX = 100
export constFILE_DESCRIPTION_MAX = 500

export constCOLLECTION_NAME_MAX = 100
export constCOLLECTION_DESCRIPTION_MAX = 500

export constASSISTANT_NAME_MAX = 100
export constASSISTANT_DESCRIPTION_MAX = 500
export constASSISTANT_PROMPT_MAX = 100000

export constTOOL_NAME_MAX = 100
export constTOOL_DESCRIPTION_MAX = 500

export constMODEL_NAME_MAX = 100
export constMODEL_DESCRIPTION_MAX = 500

// File: db/message-file-items.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert}from "@/supabase/types"
export constgetMessageFileItemsByMessageId = async (messageId:string) => {
const{data:messageFileItems,error} = await supabase
.from("messages")
.select(
`
id,
file_items (*)
`
)
.eq("id",messageId)
.single()
if (!messageFileItems) {
throw new Error(error.message)
}
return messageFileItems
}
export constcreateMessageFileItems = async (
messageFileItems:TablesInsert<"message_file_items">[]
) => {
const{data:createdMessageFileItems,error} = await supabase
.from("message_file_items")
.insert(messageFileItems)
.select("*")
if (!createdMessageFileItems) {
throw new Error(error.message)
}
return createdMessageFileItems
}

// File: db/messages.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetMessageById = async (messageId:string) => {
const{data:message} = await supabase
.from("messages")
.select("*")
.eq("id",messageId)
.single()
if (!message) {
throw new Error("Message not found")
}
return message
}
export constgetMessagesByChatId = async (chatId:string) => {
const{data:messages} = await supabase
.from("messages")
.select("*")
.eq("chat_id",chatId)
if (!messages) {
throw new Error("Messages not found")
}
return messages
}
export constcreateMessage = async (message:TablesInsert<"messages">) => {
const{data:createdMessage,error} = await supabase
.from("messages")
.insert([message])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdMessage
}
export constcreateMessages = async (messages:TablesInsert<"messages">[]) => {
const{data:createdMessages,error} = await supabase
.from("messages")
.insert(messages)
.select("*")
if (error) {
throw new Error(error.message)
}
return createdMessages
}
export constupdateMessage = async (
messageId:string,
message:TablesUpdate<"messages">
) => {
const{data:updatedMessage,error} = await supabase
.from("messages")
.update(message)
.eq("id",messageId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedMessage
}
export constdeleteMessage = async (messageId:string) => {
const{error} = await supabase.from("messages").delete().eq("id",messageId)
if (error) {
throw new Error(error.message)
}
return true
}
export async function deleteMessagesIncludingAndAfter(
userId:string,
chatId:string,
sequenceNumber:number
) {
const{error} = await supabase.rpc("delete_messages_including_and_after",{
p_user_id:userId,
p_chat_id:chatId,
p_sequence_number:sequenceNumber
})
if (error) {
return {
error:"Failed to delete messages."
}
}
return true
}

// File: db/models.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetModelById = async (modelId:string) => {
const{data:model,error} = await supabase
.from("models")
.select("*")
.eq("id",modelId)
.single()
if (!model) {
throw new Error(error.message)
}
return model
}
export constgetModelWorkspacesByWorkspaceId = async (workspaceId:string) => {
const{data:workspace,error} = await supabase
.from("workspaces")
.select(
`
id,
name,
models (*)
`
)
.eq("id",workspaceId)
.single()
if (!workspace) {
throw new Error(error.message)
}
return workspace
}
export constgetModelWorkspacesByModelId = async (modelId:string) => {
const{data:model,error} = await supabase
.from("models")
.select(
`
id,
name,
workspaces (*)
`
)
.eq("id",modelId)
.single()
if (!model) {
throw new Error(error.message)
}
return model
}
export constcreateModel = async (
model:TablesInsert<"models">,
workspace_id:string
) => {
const{data:createdModel,error} = await supabase
.from("models")
.insert([model])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
await createModelWorkspace({
user_id:model.user_id,
model_id:createdModel.id,
workspace_id:workspace_id
})
return createdModel
}
export constcreateModels = async (
models:TablesInsert<"models">[],
workspace_id:string
) => {
const{data:createdModels,error} = await supabase
.from("models")
.insert(models)
.select("*")
if (error) {
throw new Error(error.message)
}
await createModelWorkspaces(
createdModels.map(model => ({
user_id:model.user_id,
model_id:model.id,
workspace_id
}))
)
return createdModels
}
export constcreateModelWorkspace = async (item:{
user_id:string
model_id:string
workspace_id:string
}) => {
const{data:createdModelWorkspace,error} = await supabase
.from("model_workspaces")
.insert([item])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdModelWorkspace
}
export constcreateModelWorkspaces = async (
items:{user_id:string;model_id:string;workspace_id:string}[]
) => {
const{data:createdModelWorkspaces,error} = await supabase
.from("model_workspaces")
.insert(items)
.select("*")
if (error) throw new Error(error.message)
return createdModelWorkspaces
}
export constupdateModel = async (
modelId:string,
model:TablesUpdate<"models">
) => {
const{data:updatedModel,error} = await supabase
.from("models")
.update(model)
.eq("id",modelId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedModel
}
export constdeleteModel = async (modelId:string) => {
const{error} = await supabase.from("models").delete().eq("id",modelId)
if (error) {
throw new Error(error.message)
}
return true
}
export constdeleteModelWorkspace = async (
modelId:string,
workspaceId:string
) => {
const{error} = await supabase
.from("model_workspaces")
.delete()
.eq("model_id",modelId)
.eq("workspace_id",workspaceId)
if (error) throw new Error(error.message)
return true
}

// File: db/presets.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetPresetById = async (presetId:string) => {
const{data:preset,error} = await supabase
.from("presets")
.select("*")
.eq("id",presetId)
.single()
if (!preset) {
throw new Error(error.message)
}
return preset
}
export constgetPresetWorkspacesByWorkspaceId = async (workspaceId:string) => {
const{data:workspace,error} = await supabase
.from("workspaces")
.select(
`
id,
name,
presets (*)
`
)
.eq("id",workspaceId)
.single()
if (!workspace) {
throw new Error(error.message)
}
return workspace
}
export constgetPresetWorkspacesByPresetId = async (presetId:string) => {
const{data:preset,error} = await supabase
.from("presets")
.select(
`
id,
name,
workspaces (*)
`
)
.eq("id",presetId)
.single()
if (!preset) {
throw new Error(error.message)
}
return preset
}
export constcreatePreset = async (
preset:TablesInsert<"presets">,
workspace_id:string
) => {
const{data:createdPreset,error} = await supabase
.from("presets")
.insert([preset])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
await createPresetWorkspace({
user_id:preset.user_id,
preset_id:createdPreset.id,
workspace_id:workspace_id
})
return createdPreset
}
export constcreatePresets = async (
presets:TablesInsert<"presets">[],
workspace_id:string
) => {
const{data:createdPresets,error} = await supabase
.from("presets")
.insert(presets)
.select("*")
if (error) {
throw new Error(error.message)
}
await createPresetWorkspaces(
createdPresets.map(preset => ({
user_id:preset.user_id,
preset_id:preset.id,
workspace_id
}))
)
return createdPresets
}
export constcreatePresetWorkspace = async (item:{
user_id:string
preset_id:string
workspace_id:string
}) => {
const{data:createdPresetWorkspace,error} = await supabase
.from("preset_workspaces")
.insert([item])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdPresetWorkspace
}
export constcreatePresetWorkspaces = async (
items:{user_id:string;preset_id:string;workspace_id:string}[]
) => {
const{data:createdPresetWorkspaces,error} = await supabase
.from("preset_workspaces")
.insert(items)
.select("*")
if (error) throw new Error(error.message)
return createdPresetWorkspaces
}
export constupdatePreset = async (
presetId:string,
preset:TablesUpdate<"presets">
) => {
const{data:updatedPreset,error} = await supabase
.from("presets")
.update(preset)
.eq("id",presetId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedPreset
}
export constdeletePreset = async (presetId:string) => {
const{error} = await supabase.from("presets").delete().eq("id",presetId)
if (error) {
throw new Error(error.message)
}
return true
}
export constdeletePresetWorkspace = async (
presetId:string,
workspaceId:string
) => {
const{error} = await supabase
.from("preset_workspaces")
.delete()
.eq("preset_id",presetId)
.eq("workspace_id",workspaceId)
if (error) throw new Error(error.message)
return true
}

// File: db/profile.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetProfileByUserId = async (userId:string) => {
const{data:profile,error} = await supabase
.from("profiles")
.select("*")
.eq("user_id",userId)
.single()
if (!profile) {
throw new Error(error.message)
}
return profile
}
export constgetProfilesByUserId = async (userId:string) => {
const{data:profiles,error} = await supabase
.from("profiles")
.select("*")
.eq("user_id",userId)
if (!profiles) {
throw new Error(error.message)
}
return profiles
}
export constcreateProfile = async (profile:TablesInsert<"profiles">) => {
const{data:createdProfile,error} = await supabase
.from("profiles")
.insert([profile])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdProfile
}
export constupdateProfile = async (
profileId:string,
profile:TablesUpdate<"profiles">
) => {
const{data:updatedProfile,error} = await supabase
.from("profiles")
.update(profile)
.eq("id",profileId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedProfile
}
export constdeleteProfile = async (profileId:string) => {
const{error} = await supabase.from("profiles").delete().eq("id",profileId)
if (error) {
throw new Error(error.message)
}
return true
}

// File: db/prompts.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetPromptById = async (promptId:string) => {
const{data:prompt,error} = await supabase
.from("prompts")
.select("*")
.eq("id",promptId)
.single()
if (!prompt) {
throw new Error(error.message)
}
return prompt
}
export constgetPromptWorkspacesByWorkspaceId = async (workspaceId:string) => {
const{data:workspace,error} = await supabase
.from("workspaces")
.select(
`
id,
name,
prompts (*)
`
)
.eq("id",workspaceId)
.single()
if (!workspace) {
throw new Error(error.message)
}
return workspace
}
export constgetPromptWorkspacesByPromptId = async (promptId:string) => {
const{data:prompt,error} = await supabase
.from("prompts")
.select(
`
id,
name,
workspaces (*)
`
)
.eq("id",promptId)
.single()
if (!prompt) {
throw new Error(error.message)
}
return prompt
}
export constcreatePrompt = async (
prompt:TablesInsert<"prompts">,
workspace_id:string
) => {
const{data:createdPrompt,error} = await supabase
.from("prompts")
.insert([prompt])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
await createPromptWorkspace({
user_id:createdPrompt.user_id,
prompt_id:createdPrompt.id,
workspace_id
})
return createdPrompt
}
export constcreatePrompts = async (
prompts:TablesInsert<"prompts">[],
workspace_id:string
) => {
const{data:createdPrompts,error} = await supabase
.from("prompts")
.insert(prompts)
.select("*")
if (error) {
throw new Error(error.message)
}
await createPromptWorkspaces(
createdPrompts.map(prompt => ({
user_id:prompt.user_id,
prompt_id:prompt.id,
workspace_id
}))
)
return createdPrompts
}
export constcreatePromptWorkspace = async (item:{
user_id:string
prompt_id:string
workspace_id:string
}) => {
const{data:createdPromptWorkspace,error} = await supabase
.from("prompt_workspaces")
.insert([item])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdPromptWorkspace
}
export constcreatePromptWorkspaces = async (
items:{user_id:string;prompt_id:string;workspace_id:string}[]
) => {
const{data:createdPromptWorkspaces,error} = await supabase
.from("prompt_workspaces")
.insert(items)
.select("*")
if (error) throw new Error(error.message)
return createdPromptWorkspaces
}
export constupdatePrompt = async (
promptId:string,
prompt:TablesUpdate<"prompts">
) => {
const{data:updatedPrompt,error} = await supabase
.from("prompts")
.update(prompt)
.eq("id",promptId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedPrompt
}
export constdeletePrompt = async (promptId:string) => {
const{error} = await supabase.from("prompts").delete().eq("id",promptId)
if (error) {
throw new Error(error.message)
}
return true
}
export constdeletePromptWorkspace = async (
promptId:string,
workspaceId:string
) => {
const{error} = await supabase
.from("prompt_workspaces")
.delete()
.eq("prompt_id",promptId)
.eq("workspace_id",workspaceId)
if (error) throw new Error(error.message)
return true
}

// File: db/storage/assistant-images.ts
import{supabase}from "@/lib/supabase/browser-client"
import{Tables}from "@/supabase/types"
export constuploadAssistantImage = async (
assistant:Tables<"assistants">,
image:File
) => {
constbucket = "assistant_images"
constimageSizeLimit = 6000000 
if (image.size > imageSizeLimit) {
throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
}
constcurrentPath = assistant.image_path
letfilePath = `${assistant.user_id}/${assistant.id}/${Date.now()}`
if (currentPath.length > 0) {
const{error:deleteError} = await supabase.storage
.from(bucket)
.remove([currentPath])
if (deleteError) {
throw new Error("Error deleting old image")
}
}
const{error} = await supabase.storage
.from(bucket)
.upload(filePath,image,{
upsert:true
})
if (error) {
throw new Error("Error uploading image")
}
return filePath
}
export constgetAssistantImageFromStorage = async (filePath:string) => {
try {
const{data,error} = await supabase.storage
.from("assistant_images")
.createSignedUrl(filePath,60 * 60 * 24) 
if (error) {
throw new Error("Error downloading assistant image")
}
return data.signedUrl
} catch (error) {
console.error(error)
}
}

// File: db/storage/files.ts
import{supabase}from "@/lib/supabase/browser-client"
import{toast}from "sonner"
export constuploadFile = async (
file:File,
payload:{
name:string
user_id:string
file_id:string
}
) => {
constSIZE_LIMIT = parseInt(
process.env.NEXT_PUBLIC_USER_FILE_SIZE_LIMIT || "10000000"
)
if (file.size > SIZE_LIMIT) {
throw new Error(
`File must be less than ${Math.floor(SIZE_LIMIT / 1000000)}MB`
)
}
constfilePath = `${payload.user_id}/${Buffer.from(payload.file_id).toString("base64")}`
const{error} = await supabase.storage
.from("files")
.upload(filePath,file,{
upsert:true
})
if (error) {
throw new Error("Error uploading file")
}
return filePath
}
export constdeleteFileFromStorage = async (filePath:string) => {
const{error} = await supabase.storage.from("files").remove([filePath])
if (error) {
toast.error("Failed to remove file!")
return
}
}
export constgetFileFromStorage = async (filePath:string) => {
const{data,error} = await supabase.storage
.from("files")
.createSignedUrl(filePath,60 * 60 * 24) 
if (error) {
console.error(`Error uploading file with path:${filePath}`,error)
throw new Error("Error downloading file")
}
return data.signedUrl
}

// File: db/storage/message-images.ts
import{supabase}from "@/lib/supabase/browser-client"
export constuploadMessageImage = async (path:string,image:File) => {
constbucket = "message_images"
constimageSizeLimit = 6000000 
if (image.size > imageSizeLimit) {
throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
}
const{error} = await supabase.storage.from(bucket).upload(path,image,{
upsert:true
})
if (error) {
throw new Error("Error uploading image")
}
return path
}
export constgetMessageImageFromStorage = async (filePath:string) => {
const{data,error} = await supabase.storage
.from("message_images")
.createSignedUrl(filePath,60 * 60 * 24) 
if (error) {
throw new Error("Error downloading message image")
}
return data.signedUrl
}

// File: db/storage/profile-images.ts
import{supabase}from "@/lib/supabase/browser-client"
import{Tables}from "@/supabase/types"
export constuploadProfileImage = async (
profile:Tables<"profiles">,
image:File
) => {
constbucket = "profile_images"
constimageSizeLimit = 2000000 
if (image.size > imageSizeLimit) {
throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
}
constcurrentPath = profile.image_path
letfilePath = `${profile.user_id}/${Date.now()}`
if (currentPath.length > 0) {
const{error:deleteError} = await supabase.storage
.from(bucket)
.remove([currentPath])
if (deleteError) {
throw new Error("Error deleting old image")
}
}
const{error} = await supabase.storage
.from(bucket)
.upload(filePath,image,{
upsert:true
})
if (error) {
throw new Error("Error uploading image")
}
const{data:getPublicUrlData} = supabase.storage
.from(bucket)
.getPublicUrl(filePath)
return {
path:filePath,
url:getPublicUrlData.publicUrl
}
}

// File: db/storage/workspace-images.ts
import{supabase}from "@/lib/supabase/browser-client"
import{Tables}from "@/supabase/types"
export constuploadWorkspaceImage = async (
workspace:Tables<"workspaces">,
image:File
) => {
constbucket = "workspace_images"
constimageSizeLimit = 6000000 
if (image.size > imageSizeLimit) {
throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
}
constcurrentPath = workspace.image_path
letfilePath = `${workspace.user_id}/${workspace.id}/${Date.now()}`
if (currentPath.length > 0) {
const{error:deleteError} = await supabase.storage
.from(bucket)
.remove([currentPath])
if (deleteError) {
throw new Error("Error deleting old image")
}
}
const{error} = await supabase.storage
.from(bucket)
.upload(filePath,image,{
upsert:true
})
if (error) {
throw new Error("Error uploading image")
}
return filePath
}
export constgetWorkspaceImageFromStorage = async (filePath:string) => {
try {
const{data,error} = await supabase.storage
.from("workspace_images")
.createSignedUrl(filePath,60 * 60 * 24) 
if (error) {
throw new Error("Error downloading workspace image")
}
return data.signedUrl
} catch (error) {
console.error(error)
}
}

// File: db/tools.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetToolById = async (toolId:string) => {
const{data:tool,error} = await supabase
.from("tools")
.select("*")
.eq("id",toolId)
.single()
if (!tool) {
throw new Error(error.message)
}
return tool
}
export constgetToolWorkspacesByWorkspaceId = async (workspaceId:string) => {
const{data:workspace,error} = await supabase
.from("workspaces")
.select(
`
id,
name,
tools (*)
`
)
.eq("id",workspaceId)
.single()
if (!workspace) {
throw new Error(error.message)
}
return workspace
}
export constgetToolWorkspacesByToolId = async (toolId:string) => {
const{data:tool,error} = await supabase
.from("tools")
.select(
`
id,
name,
workspaces (*)
`
)
.eq("id",toolId)
.single()
if (!tool) {
throw new Error(error.message)
}
return tool
}
export constcreateTool = async (
tool:TablesInsert<"tools">,
workspace_id:string
) => {
const{data:createdTool,error} = await supabase
.from("tools")
.insert([tool])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
await createToolWorkspace({
user_id:createdTool.user_id,
tool_id:createdTool.id,
workspace_id
})
return createdTool
}
export constcreateTools = async (
tools:TablesInsert<"tools">[],
workspace_id:string
) => {
const{data:createdTools,error} = await supabase
.from("tools")
.insert(tools)
.select("*")
if (error) {
throw new Error(error.message)
}
await createToolWorkspaces(
createdTools.map(tool => ({
user_id:tool.user_id,
tool_id:tool.id,
workspace_id
}))
)
return createdTools
}
export constcreateToolWorkspace = async (item:{
user_id:string
tool_id:string
workspace_id:string
}) => {
const{data:createdToolWorkspace,error} = await supabase
.from("tool_workspaces")
.insert([item])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdToolWorkspace
}
export constcreateToolWorkspaces = async (
items:{user_id:string;tool_id:string;workspace_id:string}[]
) => {
const{data:createdToolWorkspaces,error} = await supabase
.from("tool_workspaces")
.insert(items)
.select("*")
if (error) throw new Error(error.message)
return createdToolWorkspaces
}
export constupdateTool = async (
toolId:string,
tool:TablesUpdate<"tools">
) => {
const{data:updatedTool,error} = await supabase
.from("tools")
.update(tool)
.eq("id",toolId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedTool
}
export constdeleteTool = async (toolId:string) => {
const{error} = await supabase.from("tools").delete().eq("id",toolId)
if (error) {
throw new Error(error.message)
}
return true
}
export constdeleteToolWorkspace = async (
toolId:string,
workspaceId:string
) => {
const{error} = await supabase
.from("tool_workspaces")
.delete()
.eq("tool_id",toolId)
.eq("workspace_id",workspaceId)
if (error) throw new Error(error.message)
return true
}

// File: db/workspaces.ts
import{supabase}from "@/lib/supabase/browser-client"
import{TablesInsert,TablesUpdate}from "@/supabase/types"
export constgetHomeWorkspaceByUserId = async (userId:string) => {
const{data:homeWorkspace,error} = await supabase
.from("workspaces")
.select("*")
.eq("user_id",userId)
.eq("is_home",true)
.single()
if (!homeWorkspace) {
throw new Error(error.message)
}
return homeWorkspace.id
}
export constgetWorkspaceById = async (workspaceId:string) => {
const{data:workspace,error} = await supabase
.from("workspaces")
.select("*")
.eq("id",workspaceId)
.single()
if (!workspace) {
throw new Error(error.message)
}
return workspace
}
export constgetWorkspacesByUserId = async (userId:string) => {
const{data:workspaces,error} = await supabase
.from("workspaces")
.select("*")
.eq("user_id",userId)
.order("created_at",{ascending:false})
if (!workspaces) {
throw new Error(error.message)
}
return workspaces
}
export constcreateWorkspace = async (
workspace:TablesInsert<"workspaces">
) => {
const{data:createdWorkspace,error} = await supabase
.from("workspaces")
.insert([workspace])
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return createdWorkspace
}
export constupdateWorkspace = async (
workspaceId:string,
workspace:TablesUpdate<"workspaces">
) => {
const{data:updatedWorkspace,error} = await supabase
.from("workspaces")
.update(workspace)
.eq("id",workspaceId)
.select("*")
.single()
if (error) {
throw new Error(error.message)
}
return updatedWorkspace
}
export constdeleteWorkspace = async (workspaceId:string) => {
const{error} = await supabase
.from("workspaces")
.delete()
.eq("id",workspaceId)
if (error) {
throw new Error(error.message)
}
return true
}

// File: jest.config.ts
import type{Config}from "jest"
import nextJest from "next/jest.js"
constcreateJestConfig = nextJest({

dir:"./"
})

constconfig:Config = {
coverageProvider:"v8",
testEnvironment:"jsdom"


}

export default createJestConfig(config)

// File: lib/blob-to-b64.ts
export constconvertBlobToBase64 = async (blob:Blob):Promise<string> => {
return new Promise((resolve,reject) => {
constreader = new FileReader()
reader.onloadend = () => resolve(reader.result as string)
reader.onerror = reject
reader.readAsDataURL(blob)
})
}

// File: lib/build-prompt.ts
import{Tables}from "@/supabase/types"
import{ChatPayload,MessageImage}from "@/types"
import{encode}from "gpt-tokenizer"
import{getBase64FromDataURL,getMediaTypeFromDataURL}from "@/lib/utils"
constbuildBasePrompt = (
prompt:string,
profileContext:string,
workspaceInstructions:string,
assistant:Tables<"assistants"> | null
) => {
letfullPrompt = ""
if (assistant) {
fullPrompt += `<INJECT ROLE>\nYou are not an AI. You are ${assistant.name}.\n</INJECT ROLE>\n\n`
}
fullPrompt += `Today is ${new Date().toLocaleDateString()}.\n\n`
if (profileContext) {
fullPrompt += `User Info:\n${profileContext}\n\n`
}
if (workspaceInstructions) {
fullPrompt += `System Instructions:\n${workspaceInstructions}\n\n`
}
fullPrompt += `User Instructions:\n${prompt}`
return fullPrompt
}
export async function buildFinalMessages(
payload:ChatPayload,
profile:Tables<"profiles">,
chatImages:MessageImage[]
) {
const{
chatSettings,
workspaceInstructions,
chatMessages,
assistant,
messageFileItems,
chatFileItems
} = payload
constBUILT_PROMPT = buildBasePrompt(
chatSettings.prompt,
chatSettings.includeProfileContext ? profile.profile_context || "" :"",
chatSettings.includeWorkspaceInstructions ? workspaceInstructions :"",
assistant
)
constCHUNK_SIZE = chatSettings.contextLength
constPROMPT_TOKENS = encode(chatSettings.prompt).length
letremainingTokens = CHUNK_SIZE - PROMPT_TOKENS
letusedTokens = 0
usedTokens += PROMPT_TOKENS
constprocessedChatMessages = chatMessages.map((chatMessage,index) => {
constnextChatMessage = chatMessages[index + 1]
if (nextChatMessage === undefined) {
return chatMessage
}
constnextChatMessageFileItems = nextChatMessage.fileItems
if (nextChatMessageFileItems.length > 0) {
constfindFileItems = nextChatMessageFileItems
.map(fileItemId =>
chatFileItems.find(chatFileItem => chatFileItem.id === fileItemId)
)
.filter(item => item !== undefined) as Tables<"file_items">[]
constretrievalText = buildRetrievalText(findFileItems)
return {
message:{
...chatMessage.message,
content:
`${chatMessage.message.content}\n\n${retrievalText}` as string
},
fileItems:[]
}
}
return chatMessage
})
letfinalMessages = []
for (leti = processedChatMessages.length - 1;i >= 0;i--) {
constmessage = processedChatMessages[i].message
constmessageTokens = encode(message.content).length
if (messageTokens <= remainingTokens) {
remainingTokens -= messageTokens
usedTokens += messageTokens
finalMessages.unshift(message)
} else {
break
}
}
lettempSystemMessage:Tables<"messages"> = {
chat_id:"",
assistant_id:null,
content:BUILT_PROMPT,
created_at:"",
id:processedChatMessages.length + "",
image_paths:[],
model:payload.chatSettings.model,
role:"system",
sequence_number:processedChatMessages.length,
updated_at:"",
user_id:""
}
finalMessages.unshift(tempSystemMessage)
finalMessages = finalMessages.map(message => {
letcontent
if (message.image_paths.length > 0) {
content = [
{
type:"text",
text:message.content
},
...message.image_paths.map(path => {
letformedUrl = ""
if (path.startsWith("data")) {
formedUrl = path
} else {
constchatImage = chatImages.find(image => image.path === path)
if (chatImage) {
formedUrl = chatImage.base64
}
}
return {
type:"image_url",
image_url:{
url:formedUrl
}
}
})
]
} else {
content = message.content
}
return {
role:message.role,
content
}
})
if (messageFileItems.length > 0) {
constretrievalText = buildRetrievalText(messageFileItems)
finalMessages[finalMessages.length - 1] = {
...finalMessages[finalMessages.length - 1],
content:`${
finalMessages[finalMessages.length - 1].content
}\n\n${retrievalText}`
}
}
return finalMessages
}
function buildRetrievalText(fileItems:Tables<"file_items">[]) {
constretrievalText = fileItems
.map(item => `<BEGIN SOURCE>\n${item.content}\n</END SOURCE>`)
.join("\n\n")
return `You may use the following sources if needed to answer the user's question. If you don't know the answer,say "I don't know."\n\n${retrievalText}`
}
function adaptSingleMessageForGoogleGemini(message:any) {
letadaptedParts = []
letrawParts = []
if (!Array.isArray(message.content)) {
rawParts.push({type:"text",text:message.content})
} else {
rawParts = message.content
}
for (leti = 0;i < rawParts.length;i++) {
letrawPart = rawParts[i]
if (rawPart.type== "text") {
adaptedParts.push({text:rawPart.text})
} else if (rawPart.type=== "image_url") {
adaptedParts.push({
inlineData:{
data:getBase64FromDataURL(rawPart.image_url.url),
mimeType:getMediaTypeFromDataURL(rawPart.image_url.url)
}
})
}
}
letrole = "user"
if (["user","system"].includes(message.role)) {
role = "user"
} else if (message.role === "assistant") {
role = "model"
}
return {
role:role,
parts:adaptedParts
}
}
function adaptMessagesForGeminiVision(messages:any[]) {


constbasePrompt = messages[0].parts[0].text
constbaseRole = messages[0].role
constlastMessage = messages[messages.length - 1]
constvisualMessageParts = lastMessage.parts
letvisualQueryMessages = [
{
role:"user",
parts:[
`${baseRole}:\n${basePrompt}\n\nuser:\n${visualMessageParts[0].text}\n\n`,
visualMessageParts.slice(1)
]
}
]
return visualQueryMessages
}
export async function adaptMessagesForGoogleGemini(
payload:ChatPayload,
messages:any[]
) {
letgeminiMessages = []
for (leti = 0;i < messages.length;i++) {
letadaptedMessage = adaptSingleMessageForGoogleGemini(messages[i])
geminiMessages.push(adaptedMessage)
}
if (payload.chatSettings.model === "gemini-pro-vision") {
geminiMessages = adaptMessagesForGeminiVision(geminiMessages)
}
return geminiMessages
}

// File: lib/chat-setting-limits.ts
import{LLMID}from "@/types"
typeChatSettingLimits = {
MIN_TEMPERATURE:number
MAX_TEMPERATURE:number
MAX_TOKEN_OUTPUT_LENGTH:number
MAX_CONTEXT_LENGTH:number
}
export constCHAT_SETTING_LIMITS:Record<LLMID,ChatSettingLimits> = {

"claude-2.1":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:200000
},
"claude-instant-1.2":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:100000
},
"claude-3-haiku-20240307":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:200000
},
"claude-3-sonnet-20240229":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:200000
},
"claude-3-opus-20240229":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:200000
},
"claude-3-5-sonnet-20240620":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:200000
},

"gemini-1.5-flash":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:8192,
MAX_CONTEXT_LENGTH:1040384
},
"gemini-1.5-pro-latest":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:8192,
MAX_CONTEXT_LENGTH:1040384
},
"gemini-pro":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:2048,
MAX_CONTEXT_LENGTH:30720
},
"gemini-pro-vision":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:12288
},

"mistral-tiny":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:2000,
MAX_CONTEXT_LENGTH:8000
},
"mistral-small-latest":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:2000,
MAX_CONTEXT_LENGTH:32000
},
"mistral-medium-latest":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:2000,
MAX_CONTEXT_LENGTH:32000
},
"mistral-large-latest":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:2000,
MAX_CONTEXT_LENGTH:32000
},

"llama3-8b-8192":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:8192,
MAX_CONTEXT_LENGTH:8192
},
"llama3-70b-8192":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:8192,
MAX_CONTEXT_LENGTH:8192
},
"mixtral-8x7b-32768":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:32768
},
"gemma-7b-it":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:2.0,
MAX_TOKEN_OUTPUT_LENGTH:8192,
MAX_CONTEXT_LENGTH:8192
},

"gpt-3.5-turbo":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:2.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:4096

},
"gpt-4-turbo-preview":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:2.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:128000
},
"gpt-4-vision-preview":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:2.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:128000
},
"gpt-4":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:2.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:8192
},
"gpt-4o":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:2.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:128000
},

"pplx-7b-online":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.99,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:4096
},
"pplx-70b-online":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.99,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:4096
},
"pplx-7b-chat":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:8192
},
"pplx-70b-chat":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:4096
},
"mixtral-8x7b-instruct":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:16384,
MAX_CONTEXT_LENGTH:16384
},
"mistral-7b-instruct":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:16384,
MAX_CONTEXT_LENGTH:16384
},
"llama-2-70b-chat":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:2.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:4096
},
"codellama-34b-instruct":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:4096,
MAX_CONTEXT_LENGTH:16384
},
"codellama-70b-instruct":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:16384,
MAX_CONTEXT_LENGTH:16384
},
"sonar-small-chat":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:16384,
MAX_CONTEXT_LENGTH:16384
},
"sonar-small-online":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:12000,
MAX_CONTEXT_LENGTH:12000
},
"sonar-medium-chat":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:16384,
MAX_CONTEXT_LENGTH:16384
},
"sonar-medium-online":{
MIN_TEMPERATURE:0.0,
MAX_TEMPERATURE:1.0,
MAX_TOKEN_OUTPUT_LENGTH:12000,
MAX_CONTEXT_LENGTH:12000
}
}

// File: lib/consume-stream.ts
export async function consumeReadableStream(
stream:ReadableStream<Uint8Array>,
callback:(chunk:string) => void,
signal:AbortSignal
):Promise<void> {
constreader = stream.getReader()
constdecoder = new TextDecoder()
signal.addEventListener("abort",() => reader.cancel(),{once:true})
try {
while (true) {
const{done,value} = await reader.read()
if (done) {
break
}
if (value) {
callback(decoder.decode(value,{stream:true}))
}
}
} catch (error) {
if (signal.aborted) {
console.error("Stream reading was aborted:",error)
} else {
console.error("Error consuming stream:",error)
}
} finally {
reader.releaseLock()
}
}

// File: lib/envs.ts
import{EnvKey}from "@/types/key-type"

export function isUsingEnvironmentKey(type:EnvKey) {
return Boolean(process.env[type])
}

// File: lib/export-old-data.ts
export function exportLocalStorageAsJSON() {
constdata:{[key:string]:string | null} = {}
for (leti = 0;i < localStorage.length;i++) {
constkey = localStorage.key(i)
if (key !== null) {
data[key] = localStorage.getItem(key)
}
}
constjson = JSON.stringify(data)
constblob = new Blob([json],{type:"application/json"})
consturl = URL.createObjectURL(blob)
consta = document.createElement("a")
a.href = url
a.download = "chatbot-ui-data.json"
document.body.appendChild(a)
a.click()
document.body.removeChild(a)
URL.revokeObjectURL(url)
}

// File: lib/generate-local-embedding.ts
import{pipeline}from "@xenova/transformers"
export async function generateLocalEmbedding(content:string) {
constgenerateEmbedding = await pipeline(
"feature-extraction",
"Xenova/all-MiniLM-L6-v2"
)
constoutput = await generateEmbedding(content,{
pooling:"mean",
normalize:true
})
constembedding = Array.from(output.data)
return embedding
}

// File: lib/hooks/use-copy-to-clipboard.tsx
import{useState}from "react"
export interfaceuseCopyToClipboardProps {
timeout?:number
}
export function useCopyToClipboard({
timeout = 2000
}:useCopyToClipboardProps) {
const[isCopied,setIsCopied] = useState<Boolean>(false)
constcopyToClipboard = (value:string) => {
if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
return
}
if (!value) {
return
}
navigator.clipboard.writeText(value).then(() => {
setIsCopied(true)
setTimeout(() => {
setIsCopied(false)
},timeout)
})
}
return {isCopied,copyToClipboard}
}

// File: lib/hooks/use-hotkey.tsx
import{useEffect}from "react"
constuseHotkey = (key:string,callback:() => void):void => {
useEffect(() => {
consthandleKeyDown = (event:KeyboardEvent):void => {
if (event.metaKey && event.shiftKey && event.key === key) {
event.preventDefault()
callback()
}
}
window.addEventListener("keydown",handleKeyDown)
return () => {
window.removeEventListener("keydown",handleKeyDown)
}
},[key,callback])
}
export default useHotkey

// File: lib/i18n.ts
import i18nConfig from "@/i18nConfig"
import{createInstance}from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import{initReactI18next}from "react-i18next/initReactI18next"
export default async function initTranslations(
locale:any,
namespaces:any,
i18nInstance?:any,
resources?:any
) {
i18nInstance = i18nInstance || createInstance()
i18nInstance.use(initReactI18next)
if (!resources) {
i18nInstance.use(
resourcesToBackend(
(language:string,namespace:string) =>
import(`/public/locales/${language}/${namespace}.json`)
)
)
}
await i18nInstance.init({
lng:locale,
resources,
fallbackLng:i18nConfig.defaultLocale,
supportedLngs:i18nConfig.locales,
defaultNS:namespaces[0],
fallbackNS:namespaces[0],
ns:namespaces,
preload:resources ? [] :i18nConfig.locales
})
return {
i18n:i18nInstance,
resources:i18nInstance.services.resourceStore.data,
t:i18nInstance.t
}
}

// File: lib/models/fetch-models.ts
import{Tables}from "@/supabase/types"
import{LLM,LLMID,OpenRouterLLM}from "@/types"
import{toast}from "sonner"
import{LLM_LIST_MAP}from "./llm/llm-list"
export constfetchHostedModels = async (profile:Tables<"profiles">) => {
try {
constproviders = ["google","anthropic","mistral","groq","perplexity"]
if (profile.use_azure_openai) {
providers.push("azure")
} else {
providers.push("openai")
}
constresponse = await fetch("/api/keys")
if (!response.ok) {
throw new Error(`Server is not responding.`)
}
constdata = await response.json()
letmodelsToAdd:LLM[] = []
for (constprovider of providers) {
letproviderKey:keyof typeof profile
if (provider === "google") {
providerKey = "google_gemini_api_key"
} else if (provider === "azure") {
providerKey = "azure_openai_api_key"
} else {
providerKey = `${provider}_api_key` as keyof typeof profile
}
if (profile?.[providerKey] || data.isUsingEnvKeyMap[provider]) {
constmodels = LLM_LIST_MAP[provider]
if (Array.isArray(models)) {
modelsToAdd.push(...models)
}
}
}
return {
envKeyMap:data.isUsingEnvKeyMap,
hostedModels:modelsToAdd
}
} catch (error) {
console.warn("Error fetching hosted models:" + error)
}
}
export constfetchOllamaModels = async () => {
try {
constresponse = await fetch(
process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags"
)
if (!response.ok) {
throw new Error(`Ollama server is not responding.`)
}
constdata = await response.json()
constlocalModels:LLM[] = data.models.map((model:any) => ({
modelId:model.name as LLMID,
modelName:model.name,
provider:"ollama",
hostedId:model.name,
platformLink:"https:
imageInput:false
}))
return localModels
} catch (error) {
console.warn("Error fetching Ollama models:" + error)
}
}
export constfetchOpenRouterModels = async () => {
try {
constresponse = await fetch("https:
if (!response.ok) {
throw new Error(`OpenRouter server is not responding.`)
}
const{data} = await response.json()
constopenRouterModels = data.map(
(model:{
id:string
name:string
context_length:number
}):OpenRouterLLM => ({
modelId:model.id as LLMID,
modelName:model.id,
provider:"openrouter",
hostedId:model.name,
platformLink:"https:
imageInput:false,
maxContext:model.context_length
})
)
return openRouterModels
} catch (error) {
console.error("Error fetching Open Router models:" + error)
toast.error("Error fetching Open Router models:" + error)
}
}

// File: lib/models/llm/anthropic-llm-list.ts
import{LLM}from "@/types"
constANTHROPIC_PLATFORM_LINK =
"https:


constCLAUDE_2:LLM = {
modelId:"claude-2.1",
modelName:"Claude 2",
provider:"anthropic",
hostedId:"claude-2.1",
platformLink:ANTHROPIC_PLATFORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:8,
outputCost:24
}
}

constCLAUDE_INSTANT:LLM = {
modelId:"claude-instant-1.2",
modelName:"Claude Instant",
provider:"anthropic",
hostedId:"claude-instant-1.2",
platformLink:ANTHROPIC_PLATFORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:0.8,
outputCost:2.4
}
}

constCLAUDE_3_HAIKU:LLM = {
modelId:"claude-3-haiku-20240307",
modelName:"Claude 3 Haiku",
provider:"anthropic",
hostedId:"claude-3-haiku-20240307",
platformLink:ANTHROPIC_PLATFORM_LINK,
imageInput:true,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:0.25,
outputCost:1.25
}
}

constCLAUDE_3_SONNET:LLM = {
modelId:"claude-3-sonnet-20240229",
modelName:"Claude 3 Sonnet",
provider:"anthropic",
hostedId:"claude-3-sonnet-20240229",
platformLink:ANTHROPIC_PLATFORM_LINK,
imageInput:true,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:3,
outputCost:15
}
}

constCLAUDE_3_OPUS:LLM = {
modelId:"claude-3-opus-20240229",
modelName:"Claude 3 Opus",
provider:"anthropic",
hostedId:"claude-3-opus-20240229",
platformLink:ANTHROPIC_PLATFORM_LINK,
imageInput:true,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:15,
outputCost:75
}
}

constCLAUDE_3_5_SONNET:LLM = {
modelId:"claude-3-5-sonnet-20240620",
modelName:"Claude 3.5 Sonnet",
provider:"anthropic",
hostedId:"claude-3-5-sonnet-20240620",
platformLink:ANTHROPIC_PLATFORM_LINK,
imageInput:true,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:3,
outputCost:15
}
}
export constANTHROPIC_LLM_LIST:LLM[] = [
CLAUDE_2,
CLAUDE_INSTANT,
CLAUDE_3_HAIKU,
CLAUDE_3_SONNET,
CLAUDE_3_OPUS,
CLAUDE_3_5_SONNET
]

// File: lib/models/llm/google-llm-list.ts
import{LLM}from "@/types"
constGOOGLE_PLATORM_LINK = "https:


constGEMINI_1_5_FLASH:LLM = {
modelId:"gemini-1.5-flash",
modelName:"Gemini 1.5 Flash",
provider:"google",
hostedId:"gemini-1.5-flash",
platformLink:GOOGLE_PLATORM_LINK,
imageInput:true
}

constGEMINI_1_5_PRO:LLM = {
modelId:"gemini-1.5-pro-latest",
modelName:"Gemini 1.5 Pro",
provider:"google",
hostedId:"gemini-1.5-pro-latest",
platformLink:GOOGLE_PLATORM_LINK,
imageInput:true
}

constGEMINI_PRO:LLM = {
modelId:"gemini-pro",
modelName:"Gemini Pro",
provider:"google",
hostedId:"gemini-pro",
platformLink:GOOGLE_PLATORM_LINK,
imageInput:false
}

constGEMINI_PRO_VISION:LLM = {
modelId:"gemini-pro-vision",
modelName:"Gemini Pro Vision",
provider:"google",
hostedId:"gemini-pro-vision",
platformLink:GOOGLE_PLATORM_LINK,
imageInput:true
}
export constGOOGLE_LLM_LIST:LLM[] = [
GEMINI_PRO,
GEMINI_PRO_VISION,
GEMINI_1_5_PRO,
GEMINI_1_5_FLASH
]

// File: lib/models/llm/groq-llm-list.ts
import{LLM}from "@/types"
constGROQ_PLATORM_LINK = "https:
constLLaMA3_8B:LLM = {
modelId:"llama3-8b-8192",
modelName:"LLaMA3-8b-chat",
provider:"groq",
hostedId:"llama3-8b-8192",
platformLink:GROQ_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:0.05,
outputCost:0.1
}
}
constLLaMA3_70B:LLM = {
modelId:"llama3-70b-8192",
modelName:"LLaMA3-70b-chat",
provider:"groq",
hostedId:"llama3-70b-4096",
platformLink:GROQ_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:0.59,
outputCost:0.79
}
}
constMIXTRAL_8X7B:LLM = {
modelId:"mixtral-8x7b-32768",
modelName:"Mixtral-8x7b-Instruct-v0.1",
provider:"groq",
hostedId:"mixtral-8x7b-32768",
platformLink:GROQ_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:0.27,
outputCost:0.27
}
}
constGEMMA_7B_IT:LLM = {
modelId:"gemma-7b-it",
modelName:"Gemma-7b-It",
provider:"groq",
hostedId:"gemma-7b-it",
platformLink:GROQ_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:0.15,
outputCost:0.15
}
}
export constGROQ_LLM_LIST:LLM[] = [
LLaMA3_8B,
LLaMA3_70B,
MIXTRAL_8X7B,
GEMMA_7B_IT
]

// File: lib/models/llm/llm-list.ts
import{LLM}from "@/types"
import{ANTHROPIC_LLM_LIST}from "./anthropic-llm-list"
import{GOOGLE_LLM_LIST}from "./google-llm-list"
import{MISTRAL_LLM_LIST}from "./mistral-llm-list"
import{GROQ_LLM_LIST}from "./groq-llm-list"
import{OPENAI_LLM_LIST}from "./openai-llm-list"
import{PERPLEXITY_LLM_LIST}from "./perplexity-llm-list"
export constLLM_LIST:LLM[] = [
...OPENAI_LLM_LIST,
...GOOGLE_LLM_LIST,
...MISTRAL_LLM_LIST,
...GROQ_LLM_LIST,
...PERPLEXITY_LLM_LIST,
...ANTHROPIC_LLM_LIST
]
export constLLM_LIST_MAP:Record<string,LLM[]> = {
openai:OPENAI_LLM_LIST,
azure:OPENAI_LLM_LIST,
google:GOOGLE_LLM_LIST,
mistral:MISTRAL_LLM_LIST,
groq:GROQ_LLM_LIST,
perplexity:PERPLEXITY_LLM_LIST,
anthropic:ANTHROPIC_LLM_LIST
}

// File: lib/models/llm/mistral-llm-list.ts
import{LLM}from "@/types"
constMISTRAL_PLATORM_LINK = "https:


constMISTRAL_7B:LLM = {
modelId:"mistral-tiny",
modelName:"Mistral Tiny",
provider:"mistral",
hostedId:"mistral-tiny",
platformLink:MISTRAL_PLATORM_LINK,
imageInput:false
}

constMIXTRAL:LLM = {
modelId:"mistral-small-latest",
modelName:"Mistral Small",
provider:"mistral",
hostedId:"mistral-small-latest",
platformLink:MISTRAL_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:2,
outputCost:6
}
}

constMISTRAL_MEDIUM:LLM = {
modelId:"mistral-medium-latest",
modelName:"Mistral Medium",
provider:"mistral",
hostedId:"mistral-medium-latest",
platformLink:MISTRAL_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:2.7,
outputCost:8.1
}
}

constMISTRAL_LARGE:LLM = {
modelId:"mistral-large-latest",
modelName:"Mistral Large",
provider:"mistral",
hostedId:"mistral-large-latest",
platformLink:MISTRAL_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:8,
outputCost:24
}
}
export constMISTRAL_LLM_LIST:LLM[] = [
MISTRAL_7B,
MIXTRAL,
MISTRAL_MEDIUM,
MISTRAL_LARGE
]

// File: lib/models/llm/openai-llm-list.ts
import{LLM}from "@/types"
constOPENAI_PLATORM_LINK = "https:

constGPT4o:LLM = {
modelId:"gpt-4o",
modelName:"GPT-4o",
provider:"openai",
hostedId:"gpt-4o",
platformLink:OPENAI_PLATORM_LINK,
imageInput:true,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:5,
outputCost:15
}
}

constGPT4Turbo:LLM = {
modelId:"gpt-4-turbo-preview",
modelName:"GPT-4 Turbo",
provider:"openai",
hostedId:"gpt-4-turbo-preview",
platformLink:OPENAI_PLATORM_LINK,
imageInput:true,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:10,
outputCost:30
}
}

constGPT4Vision:LLM = {
modelId:"gpt-4-vision-preview",
modelName:"GPT-4 Vision",
provider:"openai",
hostedId:"gpt-4-vision-preview",
platformLink:OPENAI_PLATORM_LINK,
imageInput:true,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:10
}
}

constGPT4:LLM = {
modelId:"gpt-4",
modelName:"GPT-4",
provider:"openai",
hostedId:"gpt-4",
platformLink:OPENAI_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:30,
outputCost:60
}
}

constGPT3_5Turbo:LLM = {
modelId:"gpt-3.5-turbo",
modelName:"GPT-3.5 Turbo",
provider:"openai",
hostedId:"gpt-3.5-turbo",
platformLink:OPENAI_PLATORM_LINK,
imageInput:false,
pricing:{
currency:"USD",
unit:"1M tokens",
inputCost:0.5,
outputCost:1.5
}
}
export constOPENAI_LLM_LIST:LLM[] = [
GPT4o,
GPT4Turbo,
GPT4Vision,
GPT4,
GPT3_5Turbo
]

// File: lib/models/llm/perplexity-llm-list.ts
import{LLM}from "@/types"
constPERPLEXITY_PLATORM_LINK =
"https:




constMIXTRAL_8X7B_INSTRUCT:LLM = {
modelId:"mixtral-8x7b-instruct",
modelName:"Mixtral 8x7B Instruct",
provider:"perplexity",
hostedId:"mixtral-8x7b-instruct",
platformLink:PERPLEXITY_PLATORM_LINK,
imageInput:false
}

constMISTRAL_7B_INSTRUCT:LLM = {
modelId:"mistral-7b-instruct",
modelName:"Mistral 7B Instruct",
provider:"perplexity",
hostedId:"mistral-7b-instruct",
platformLink:PERPLEXITY_PLATORM_LINK,
imageInput:false
}

constCODELLAMA_70B_INSTRUCT:LLM = {
modelId:"codellama-70b-instruct",
modelName:"CodeLlama 70B Instruct",
provider:"perplexity",
hostedId:"codellama-70b-instruct",
platformLink:PERPLEXITY_PLATORM_LINK,
imageInput:false
}

constPERPLEXITY_SONAR_SMALL_CHAT_7B:LLM = {
modelId:"sonar-small-chat",
modelName:"Sonar Small Chat",
provider:"perplexity",
hostedId:"sonar-small-chat",
platformLink:PERPLEXITY_PLATORM_LINK,
imageInput:false
}

constPERPLEXITY_SONAR_SMALL_ONLINE_7B:LLM = {
modelId:"sonar-small-online",
modelName:"Sonar Small Online",
provider:"perplexity",
hostedId:"sonar-small-online",
platformLink:PERPLEXITY_PLATORM_LINK,
imageInput:false
}

constPERPLEXITY_SONAR_MEDIUM_CHAT_8x7B:LLM = {
modelId:"sonar-medium-chat",
modelName:"Sonar Medium Chat",
provider:"perplexity",
hostedId:"sonar-medium-chat",
platformLink:PERPLEXITY_PLATORM_LINK,
imageInput:false
}

constPERPLEXITY_SONAR_MEDIUM_ONLINE_8x7B:LLM = {
modelId:"sonar-medium-online",
modelName:"Sonar Medium Online",
provider:"perplexity",
hostedId:"sonar-medium-online",
platformLink:PERPLEXITY_PLATORM_LINK,
imageInput:false
}
export constPERPLEXITY_LLM_LIST:LLM[] = [
MIXTRAL_8X7B_INSTRUCT,
MISTRAL_7B_INSTRUCT,
CODELLAMA_70B_INSTRUCT,
PERPLEXITY_SONAR_SMALL_CHAT_7B,
PERPLEXITY_SONAR_SMALL_ONLINE_7B,
PERPLEXITY_SONAR_MEDIUM_CHAT_8x7B,
PERPLEXITY_SONAR_MEDIUM_ONLINE_8x7B
]

// File: lib/openapi-conversion.ts
import $RefParser from "@apidevtools/json-schema-ref-parser"
interfaceOpenAPIData {
info:{
title:string
description:string
server:string
}
routes:{
path:string
method:string
operationId:string
requestInBody?:boolean
}[]
functions:any
}
export constvalidateOpenAPI = async (openapiSpec:any) => {
if (!openapiSpec.info) {
throw new Error("('info'):field required")
}
if (!openapiSpec.info.title) {
throw new Error("('info','title'):field required")
}
if (!openapiSpec.info.version) {
throw new Error("('info','version'):field required")
}
if (
!openapiSpec.servers ||
!openapiSpec.servers.length ||
!openapiSpec.servers[0].url
) {
throw new Error("Could not find a valid URL in `servers`")
}
if (!openapiSpec.paths || Object.keys(openapiSpec.paths).length === 0) {
throw new Error("No paths found in the OpenAPI spec")
}
Object.keys(openapiSpec.paths).forEach(path => {
if (!path.startsWith("/")) {
throw new Error(`Path ${path} does not start with a slash;skipping`)
}
})
if (
Object.values(openapiSpec.paths).some((methods:any) =>
Object.values(methods).some((spec:any) => !spec.operationId)
)
) {
throw new Error("Some methods are missing operationId")
}
if (
Object.values(openapiSpec.paths).some((methods:any) =>
Object.values(methods).some(
(spec:any) => spec.requestBody && !spec.requestBody.content
)
)
) {
throw new Error(
"Some methods with a requestBody are missing requestBody.content"
)
}
if (
Object.values(openapiSpec.paths).some((methods:any) =>
Object.values(methods).some((spec:any) => {
if (spec.requestBody?.content?.["application/json"]?.schema) {
if (
!spec.requestBody.content["application/json"].schema.properties ||
Object.keys(spec.requestBody.content["application/json"].schema)
.length === 0
) {
throw new Error(
`In context=('paths','${Object.keys(methods)[0]}','${
Object.keys(spec)[0]
}','requestBody','content','application/json','schema'),object schema missing properties`
)
}
}
})
)
) {
throw new Error("Some object schemas are missing properties")
}
}
export constopenapiToFunctions = async (
openapiSpec:any
):Promise<OpenAPIData> => {
constfunctions:any[] = [] 
constroutes:{
path:string
method:string
operationId:string
requestInBody?:boolean 
}[] = []
for (const[path,methods] of Object.entries(openapiSpec.paths)) {
if (typeof methods !== "object" || methods === null) {
continue
}
for (const[method,specWithRef] of Object.entries(
methods as Record<string,any>
)) {
constspec:any = await $RefParser.dereference(specWithRef)
constfunctionName = spec.operationId
constdesc = spec.description || spec.summary || ""
constschema:{type:string;properties:any;required?:string[]} = {
type:"object",
properties:{}
}
constreqBody = spec.requestBody?.content?.["application/json"]?.schema
if (reqBody) {
schema.properties.requestBody = reqBody
}
constparams = spec.parameters || []
if (params.length > 0) {
constparamProperties = params.reduce((acc:any,param:any) => {
if (param.schema) {
acc[param.name] = param.schema
}
return acc
},{})
schema.properties.parameters = {
type:"object",
properties:paramProperties
}
}
functions.push({
type:"function",
function:{
name:functionName,
description:desc,
parameters:schema
}
})

constrequestInBody = !!spec.requestBody
routes.push({
path,
method,
operationId:functionName,
requestInBody 
})
}
}
return {
info:{
title:openapiSpec.info.title,
description:openapiSpec.info.description,
server:openapiSpec.servers[0].url
},
routes,
functions
}
}

// File: lib/retrieval/processing/csv.ts
import{FileItemChunk}from "@/types"
import{encode}from "gpt-tokenizer"
import{CSVLoader}from "langchain/document_loaders/fs/csv"
import{RecursiveCharacterTextSplitter}from "langchain/text_splitter"
import{CHUNK_OVERLAP,CHUNK_SIZE}from "."
export constprocessCSV = async (csv:Blob):Promise<FileItemChunk[]> => {
constloader = new CSVLoader(csv)
constdocs = await loader.load()
letcompleteText = docs.map(doc => doc.pageContent).join("\n\n")
constsplitter = new RecursiveCharacterTextSplitter({
chunkSize:CHUNK_SIZE,
chunkOverlap:CHUNK_OVERLAP,
separators:["\n\n"]
})
constsplitDocs = await splitter.createDocuments([completeText])
letchunks:FileItemChunk[] = []
for (leti = 0;i < splitDocs.length;i++) {
constdoc = splitDocs[i]
chunks.push({
content:doc.pageContent,
tokens:encode(doc.pageContent).length
})
}
return chunks
}

// File: lib/retrieval/processing/docx.ts
import{FileItemChunk}from "@/types"
import{encode}from "gpt-tokenizer"
import{RecursiveCharacterTextSplitter}from "langchain/text_splitter"
import{CHUNK_OVERLAP,CHUNK_SIZE}from "."
export constprocessDocX = async (text:string):Promise<FileItemChunk[]> => {
constsplitter = new RecursiveCharacterTextSplitter({
chunkSize:CHUNK_SIZE,
chunkOverlap:CHUNK_OVERLAP
})
constsplitDocs = await splitter.createDocuments([text])
letchunks:FileItemChunk[] = []
for (leti = 0;i < splitDocs.length;i++) {
constdoc = splitDocs[i]
chunks.push({
content:doc.pageContent,
tokens:encode(doc.pageContent).length
})
}
return chunks
}

// File: lib/retrieval/processing/index.ts
export * from "./csv"
export * from "./docx"
export * from "./json"
export * from "./md"
export * from "./pdf"
export * from "./txt"
export constCHUNK_SIZE = 4000
export constCHUNK_OVERLAP = 200

// File: lib/retrieval/processing/json.ts
import{FileItemChunk}from "@/types"
import{encode}from "gpt-tokenizer"
import{JSONLoader}from "langchain/document_loaders/fs/json"
import{RecursiveCharacterTextSplitter}from "langchain/text_splitter"
import{CHUNK_OVERLAP,CHUNK_SIZE}from "."
export constprocessJSON = async (json:Blob):Promise<FileItemChunk[]> => {
constloader = new JSONLoader(json)
constdocs = await loader.load()
letcompleteText = docs.map(doc => doc.pageContent).join(" ")
constsplitter = new RecursiveCharacterTextSplitter({
chunkSize:CHUNK_SIZE,
chunkOverlap:CHUNK_OVERLAP
})
constsplitDocs = await splitter.createDocuments([completeText])
letchunks:FileItemChunk[] = []
splitDocs.forEach(doc => {
constdocTokens = encode(doc.pageContent).length
})
for (leti = 0;i < splitDocs.length;i++) {
constdoc = splitDocs[i]
chunks.push({
content:doc.pageContent,
tokens:encode(doc.pageContent).length
})
}
return chunks
}

// File: lib/retrieval/processing/md.ts
import{FileItemChunk}from "@/types"
import{encode}from "gpt-tokenizer"
import{RecursiveCharacterTextSplitter}from "langchain/text_splitter"
import{CHUNK_OVERLAP,CHUNK_SIZE}from "."
export constprocessMarkdown = async (
markdown:Blob
):Promise<FileItemChunk[]> => {
constfileBuffer = Buffer.from(await markdown.arrayBuffer())
consttextDecoder = new TextDecoder("utf-8")
consttextContent = textDecoder.decode(fileBuffer)
constsplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown",{
chunkSize:CHUNK_SIZE,
chunkOverlap:CHUNK_OVERLAP
})
constsplitDocs = await splitter.createDocuments([textContent])
letchunks:FileItemChunk[] = []
for (leti = 0;i < splitDocs.length;i++) {
constdoc = splitDocs[i]
chunks.push({
content:doc.pageContent,
tokens:encode(doc.pageContent).length
})
}
return chunks
}

// File: lib/retrieval/processing/pdf.ts
import{FileItemChunk}from "@/types"
import{encode}from "gpt-tokenizer"
import{PDFLoader}from "langchain/document_loaders/fs/pdf"
import{RecursiveCharacterTextSplitter}from "langchain/text_splitter"
import{CHUNK_OVERLAP,CHUNK_SIZE}from "."
export constprocessPdf = async (pdf:Blob):Promise<FileItemChunk[]> => {
constloader = new PDFLoader(pdf)
constdocs = await loader.load()
letcompleteText = docs.map(doc => doc.pageContent).join(" ")
constsplitter = new RecursiveCharacterTextSplitter({
chunkSize:CHUNK_SIZE,
chunkOverlap:CHUNK_OVERLAP
})
constsplitDocs = await splitter.createDocuments([completeText])
letchunks:FileItemChunk[] = []
for (leti = 0;i < splitDocs.length;i++) {
constdoc = splitDocs[i]
chunks.push({
content:doc.pageContent,
tokens:encode(doc.pageContent).length
})
}
return chunks
}

// File: lib/retrieval/processing/txt.ts
import{FileItemChunk}from "@/types"
import{encode}from "gpt-tokenizer"
import{RecursiveCharacterTextSplitter}from "langchain/text_splitter"
import{CHUNK_OVERLAP,CHUNK_SIZE}from "."
export constprocessTxt = async (txt:Blob):Promise<FileItemChunk[]> => {
constfileBuffer = Buffer.from(await txt.arrayBuffer())
consttextDecoder = new TextDecoder("utf-8")
consttextContent = textDecoder.decode(fileBuffer)
constsplitter = new RecursiveCharacterTextSplitter({
chunkSize:CHUNK_SIZE,
chunkOverlap:CHUNK_OVERLAP
})
constsplitDocs = await splitter.createDocuments([textContent])
letchunks:FileItemChunk[] = []
for (leti = 0;i < splitDocs.length;i++) {
constdoc = splitDocs[i]
chunks.push({
content:doc.pageContent,
tokens:encode(doc.pageContent).length
})
}
return chunks
}

// File: lib/server/server-chat-helpers.ts
import{Database,Tables}from "@/supabase/types"
import{VALID_ENV_KEYS}from "@/types/valid-keys"
import{createServerClient}from "@supabase/ssr"
import{cookies}from "next/headers"
export async function getServerProfile() {
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
constuser = (await supabase.auth.getUser()).data.user
if (!user) {
throw new Error("User not found")
}
const{data:profile} = await supabase
.from("profiles")
.select("*")
.eq("user_id",user.id)
.single()
if (!profile) {
throw new Error("Profile not found")
}
constprofileWithKeys = addApiKeysToProfile(profile)
return profileWithKeys
}
function addApiKeysToProfile(profile:Tables<"profiles">) {
constapiKeys = {
[VALID_ENV_KEYS.OPENAI_API_KEY]:"openai_api_key",
[VALID_ENV_KEYS.ANTHROPIC_API_KEY]:"anthropic_api_key",
[VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY]:"google_gemini_api_key",
[VALID_ENV_KEYS.MISTRAL_API_KEY]:"mistral_api_key",
[VALID_ENV_KEYS.GROQ_API_KEY]:"groq_api_key",
[VALID_ENV_KEYS.PERPLEXITY_API_KEY]:"perplexity_api_key",
[VALID_ENV_KEYS.AZURE_OPENAI_API_KEY]:"azure_openai_api_key",
[VALID_ENV_KEYS.OPENROUTER_API_KEY]:"openrouter_api_key",
[VALID_ENV_KEYS.OPENAI_ORGANIZATION_ID]:"openai_organization_id",
[VALID_ENV_KEYS.AZURE_OPENAI_ENDPOINT]:"azure_openai_endpoint",
[VALID_ENV_KEYS.AZURE_GPT_35_TURBO_NAME]:"azure_openai_35_turbo_id",
[VALID_ENV_KEYS.AZURE_GPT_45_VISION_NAME]:"azure_openai_45_vision_id",
[VALID_ENV_KEYS.AZURE_GPT_45_TURBO_NAME]:"azure_openai_45_turbo_id",
[VALID_ENV_KEYS.AZURE_EMBEDDINGS_NAME]:"azure_openai_embeddings_id"
}
for (const[envKey,profileKey] of Object.entries(apiKeys)) {
if (process.env[envKey]) {
;(profile as any)[profileKey] = process.env[envKey]
}
}
return profile
}
export function checkApiKey(apiKey:string | null,keyName:string) {
if (apiKey === null || apiKey === "") {
throw new Error(`${keyName} API Key not found`)
}
}

// File: lib/server/server-utils.ts
export function createResponse(data:object,status:number):Response {
return new Response(JSON.stringify(data),{
status,
headers:{
"Content-Type":"application/json"
}
})
}

// File: lib/supabase/browser-client.ts
import{Database}from "@/supabase/types"
import{createBrowserClient}from "@supabase/ssr"
export constsupabase = createBrowserClient<Database>(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// File: lib/supabase/client.ts
import{createBrowserClient}from "@supabase/ssr"
export constcreateClient = () =>
createBrowserClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// File: lib/supabase/middleware.ts
import{createServerClient,typeCookieOptions}from "@supabase/ssr"
import{NextResponse,typeNextRequest}from "next/server"
export constcreateClient = (request:NextRequest) => {

letresponse = NextResponse.next({
request:{
headers:request.headers
}
})
constsupabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies:{
get(name:string) {
return request.cookies.get(name)?.value
},
set(name:string,value:string,options:CookieOptions) {

request.cookies.set({
name,
value,
...options
})
response = NextResponse.next({
request:{
headers:request.headers
}
})
response.cookies.set({
name,
value,
...options
})
},
remove(name:string,options:CookieOptions) {

request.cookies.set({
name,
value:"",
...options
})
response = NextResponse.next({
request:{
headers:request.headers
}
})
response.cookies.set({
name,
value:"",
...options
})
}
}
}
)
return {supabase,response}
}

// File: lib/supabase/server.ts
import{createServerClient,typeCookieOptions}from "@supabase/ssr"
import{cookies}from "next/headers"
export constcreateClient = (cookieStore:ReturnType<typeof cookies>) => {
return createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies:{
get(name:string) {
return cookieStore.get(name)?.value
},
set(name:string,value:string,options:CookieOptions) {
try {
cookieStore.set({name,value,...options})
} catch (error) {



}
},
remove(name:string,options:CookieOptions) {
try {
cookieStore.set({name,value:"",...options})
} catch (error) {



}
}
}
}
)
}

// File: lib/utils.ts
import{clsx,typeClassValue}from "clsx"
import{twMerge}from "tailwind-merge"
export function cn(...inputs:ClassValue[]) {
return twMerge(clsx(inputs))
}
export function formatDate(input:string | number | Date):string {
constdate = new Date(input)
return date.toLocaleDateString("en-US",{
month:"long",
day:"numeric",
year:"numeric"
})
}
export function getMediaTypeFromDataURL(dataURL:string):string | null {
constmatches = dataURL.match(/^data:([A-Za-z-+\/]+);base64/)
return matches ? matches[1] :null
}
export function getBase64FromDataURL(dataURL:string):string | null {
constmatches = dataURL.match(/^data:[A-Za-z-+\/]+;base64,(.*)$/)
return matches ? matches[1] :null
}

// File: middleware.ts
import{createClient}from "@/lib/supabase/middleware"
import{i18nRouter}from "next-i18n-router"
import{NextResponse,typeNextRequest}from "next/server"
import i18nConfig from "./i18nConfig"
export async function middleware(request:NextRequest) {
if (request.nextUrl.pathname.match("{/:locale}/protected")) {
constrequestHeaders = new Headers(request.headers);
requestHeaders.set("x-url",request.url);
console.log(`Protected:${request.nextUrl.pathname.match("{/:locale}/protected")}`);
return NextResponse.next({
request:{

headers:requestHeaders,
},
});
} else {
consti18nResult = i18nRouter(request,i18nConfig)
if (i18nResult) return i18nResult
try {
const{supabase,response} = createClient(request)
constsession = await supabase.auth.getSession()
constredirectToChat = session && request.nextUrl.pathname === "/"
if (redirectToChat) {
const{data:homeWorkspace,error} = await supabase
.from("workspaces")
.select("*")
.eq("user_id",session.data.session?.user.id)
.eq("is_home",true)
.single()
if (!homeWorkspace) {
throw new Error(error?.message)
}
return NextResponse.redirect(
new URL(`/${homeWorkspace.id}/chat`,request.url)
)
}
return response
} catch (e) {
return NextResponse.next({
request:{
headers:request.headers
}
})
}
}
}
export constconfig = {
matcher:"/((?!api|static|.*\\..*|_next|auth).*)"
}

// File: supabase/types.ts
export typeJson =
| string
| number
| boolean
| null
| {[key:string]:Json | undefined}
| Json[]
export typeDatabase = {
graphql_public:{
Tables:{
[_ in never]:never
}
Views:{
[_ in never]:never
}
Functions:{
graphql:{
Args:{
operationName?:string
query?:string
variables?:Json
extensions?:Json
}
Returns:Json
}
}
Enums:{
[_ in never]:never
}
CompositeTypes:{
[_ in never]:never
}
}
public:{
Tables:{
assistant_collections:{
Row:{
assistant_id:string
collection_id:string
created_at:string
updated_at:string | null
user_id:string
}
Insert:{
assistant_id:string
collection_id:string
created_at?:string
updated_at?:string | null
user_id:string
}
Update:{
assistant_id?:string
collection_id?:string
created_at?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"assistant_collections_assistant_id_fkey"
columns:["assistant_id"]
isOneToOne:false
referencedRelation:"assistants"
referencedColumns:["id"]
},
{
foreignKeyName:"assistant_collections_collection_id_fkey"
columns:["collection_id"]
isOneToOne:false
referencedRelation:"collections"
referencedColumns:["id"]
},
{
foreignKeyName:"assistant_collections_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
assistant_files:{
Row:{
assistant_id:string
created_at:string
file_id:string
updated_at:string | null
user_id:string
}
Insert:{
assistant_id:string
created_at?:string
file_id:string
updated_at?:string | null
user_id:string
}
Update:{
assistant_id?:string
created_at?:string
file_id?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"assistant_files_assistant_id_fkey"
columns:["assistant_id"]
isOneToOne:false
referencedRelation:"assistants"
referencedColumns:["id"]
},
{
foreignKeyName:"assistant_files_file_id_fkey"
columns:["file_id"]
isOneToOne:false
referencedRelation:"files"
referencedColumns:["id"]
},
{
foreignKeyName:"assistant_files_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
assistant_tools:{
Row:{
assistant_id:string
created_at:string
tool_id:string
updated_at:string | null
user_id:string
}
Insert:{
assistant_id:string
created_at?:string
tool_id:string
updated_at?:string | null
user_id:string
}
Update:{
assistant_id?:string
created_at?:string
tool_id?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"assistant_tools_assistant_id_fkey"
columns:["assistant_id"]
isOneToOne:false
referencedRelation:"assistants"
referencedColumns:["id"]
},
{
foreignKeyName:"assistant_tools_tool_id_fkey"
columns:["tool_id"]
isOneToOne:false
referencedRelation:"tools"
referencedColumns:["id"]
},
{
foreignKeyName:"assistant_tools_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
assistant_workspaces:{
Row:{
assistant_id:string
created_at:string
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
assistant_id:string
created_at?:string
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
assistant_id?:string
created_at?:string
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"assistant_workspaces_assistant_id_fkey"
columns:["assistant_id"]
isOneToOne:false
referencedRelation:"assistants"
referencedColumns:["id"]
},
{
foreignKeyName:"assistant_workspaces_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"assistant_workspaces_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
assistants:{
Row:{
context_length:number
created_at:string
description:string
embeddings_provider:string
folder_id:string | null
id:string
image_path:string
include_profile_context:boolean
include_workspace_instructions:boolean
model:string
name:string
prompt:string
sharing:string
temperature:number
updated_at:string | null
user_id:string
}
Insert:{
context_length:number
created_at?:string
description:string
embeddings_provider:string
folder_id?:string | null
id?:string
image_path:string
include_profile_context:boolean
include_workspace_instructions:boolean
model:string
name:string
prompt:string
sharing?:string
temperature:number
updated_at?:string | null
user_id:string
}
Update:{
context_length?:number
created_at?:string
description?:string
embeddings_provider?:string
folder_id?:string | null
id?:string
image_path?:string
include_profile_context?:boolean
include_workspace_instructions?:boolean
model?:string
name?:string
prompt?:string
sharing?:string
temperature?:number
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"assistants_folder_id_fkey"
columns:["folder_id"]
isOneToOne:false
referencedRelation:"folders"
referencedColumns:["id"]
},
{
foreignKeyName:"assistants_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
chat_files:{
Row:{
chat_id:string
created_at:string
file_id:string
updated_at:string | null
user_id:string
}
Insert:{
chat_id:string
created_at?:string
file_id:string
updated_at?:string | null
user_id:string
}
Update:{
chat_id?:string
created_at?:string
file_id?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"chat_files_chat_id_fkey"
columns:["chat_id"]
isOneToOne:false
referencedRelation:"chats"
referencedColumns:["id"]
},
{
foreignKeyName:"chat_files_file_id_fkey"
columns:["file_id"]
isOneToOne:false
referencedRelation:"files"
referencedColumns:["id"]
},
{
foreignKeyName:"chat_files_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
chats:{
Row:{
assistant_id:string | null
context_length:number
created_at:string
embeddings_provider:string
folder_id:string | null
id:string
include_profile_context:boolean
include_workspace_instructions:boolean
model:string
name:string
prompt:string
sharing:string
temperature:number
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
assistant_id?:string | null
context_length:number
created_at?:string
embeddings_provider:string
folder_id?:string | null
id?:string
include_profile_context:boolean
include_workspace_instructions:boolean
model:string
name:string
prompt:string
sharing?:string
temperature:number
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
assistant_id?:string | null
context_length?:number
created_at?:string
embeddings_provider?:string
folder_id?:string | null
id?:string
include_profile_context?:boolean
include_workspace_instructions?:boolean
model?:string
name?:string
prompt?:string
sharing?:string
temperature?:number
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"chats_assistant_id_fkey"
columns:["assistant_id"]
isOneToOne:false
referencedRelation:"assistants"
referencedColumns:["id"]
},
{
foreignKeyName:"chats_folder_id_fkey"
columns:["folder_id"]
isOneToOne:false
referencedRelation:"folders"
referencedColumns:["id"]
},
{
foreignKeyName:"chats_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"chats_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
collection_files:{
Row:{
collection_id:string
created_at:string
file_id:string
updated_at:string | null
user_id:string
}
Insert:{
collection_id:string
created_at?:string
file_id:string
updated_at?:string | null
user_id:string
}
Update:{
collection_id?:string
created_at?:string
file_id?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"collection_files_collection_id_fkey"
columns:["collection_id"]
isOneToOne:false
referencedRelation:"collections"
referencedColumns:["id"]
},
{
foreignKeyName:"collection_files_file_id_fkey"
columns:["file_id"]
isOneToOne:false
referencedRelation:"files"
referencedColumns:["id"]
},
{
foreignKeyName:"collection_files_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
collection_workspaces:{
Row:{
collection_id:string
created_at:string
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
collection_id:string
created_at?:string
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
collection_id?:string
created_at?:string
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"collection_workspaces_collection_id_fkey"
columns:["collection_id"]
isOneToOne:false
referencedRelation:"collections"
referencedColumns:["id"]
},
{
foreignKeyName:"collection_workspaces_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"collection_workspaces_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
collections:{
Row:{
created_at:string
description:string
folder_id:string | null
id:string
name:string
sharing:string
updated_at:string | null
user_id:string
}
Insert:{
created_at?:string
description:string
folder_id?:string | null
id?:string
name:string
sharing?:string
updated_at?:string | null
user_id:string
}
Update:{
created_at?:string
description?:string
folder_id?:string | null
id?:string
name?:string
sharing?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"collections_folder_id_fkey"
columns:["folder_id"]
isOneToOne:false
referencedRelation:"folders"
referencedColumns:["id"]
},
{
foreignKeyName:"collections_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
file_items:{
Row:{
content:string
created_at:string
file_id:string
id:string
local_embedding:string | null
openai_embedding:string | null
sharing:string
tokens:number
updated_at:string | null
user_id:string
}
Insert:{
content:string
created_at?:string
file_id:string
id?:string
local_embedding?:string | null
openai_embedding?:string | null
sharing?:string
tokens:number
updated_at?:string | null
user_id:string
}
Update:{
content?:string
created_at?:string
file_id?:string
id?:string
local_embedding?:string | null
openai_embedding?:string | null
sharing?:string
tokens?:number
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"file_items_file_id_fkey"
columns:["file_id"]
isOneToOne:false
referencedRelation:"files"
referencedColumns:["id"]
},
{
foreignKeyName:"file_items_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
file_workspaces:{
Row:{
created_at:string
file_id:string
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
created_at?:string
file_id:string
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
created_at?:string
file_id?:string
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"file_workspaces_file_id_fkey"
columns:["file_id"]
isOneToOne:false
referencedRelation:"files"
referencedColumns:["id"]
},
{
foreignKeyName:"file_workspaces_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"file_workspaces_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
files:{
Row:{
created_at:string
description:string
file_path:string
folder_id:string | null
id:string
name:string
sharing:string
size:number
tokens:number
type:string
updated_at:string | null
user_id:string
}
Insert:{
created_at?:string
description:string
file_path:string
folder_id?:string | null
id?:string
name:string
sharing?:string
size:number
tokens:number
type:string
updated_at?:string | null
user_id:string
}
Update:{
created_at?:string
description?:string
file_path?:string
folder_id?:string | null
id?:string
name?:string
sharing?:string
size?:number
tokens?:number
type?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"files_folder_id_fkey"
columns:["folder_id"]
isOneToOne:false
referencedRelation:"folders"
referencedColumns:["id"]
},
{
foreignKeyName:"files_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
folders:{
Row:{
created_at:string
description:string
id:string
name:string
type:string
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
created_at?:string
description:string
id?:string
name:string
type:string
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
created_at?:string
description?:string
id?:string
name?:string
type?:string
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"folders_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"folders_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
message_file_items:{
Row:{
created_at:string
file_item_id:string
message_id:string
updated_at:string | null
user_id:string
}
Insert:{
created_at?:string
file_item_id:string
message_id:string
updated_at?:string | null
user_id:string
}
Update:{
created_at?:string
file_item_id?:string
message_id?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"message_file_items_file_item_id_fkey"
columns:["file_item_id"]
isOneToOne:false
referencedRelation:"file_items"
referencedColumns:["id"]
},
{
foreignKeyName:"message_file_items_message_id_fkey"
columns:["message_id"]
isOneToOne:false
referencedRelation:"messages"
referencedColumns:["id"]
},
{
foreignKeyName:"message_file_items_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
messages:{
Row:{
assistant_id:string | null
chat_id:string
content:string
created_at:string
id:string
image_paths:string[]
model:string
role:string
sequence_number:number
updated_at:string | null
user_id:string
}
Insert:{
assistant_id?:string | null
chat_id:string
content:string
created_at?:string
id?:string
image_paths:string[]
model:string
role:string
sequence_number:number
updated_at?:string | null
user_id:string
}
Update:{
assistant_id?:string | null
chat_id?:string
content?:string
created_at?:string
id?:string
image_paths?:string[]
model?:string
role?:string
sequence_number?:number
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"messages_assistant_id_fkey"
columns:["assistant_id"]
isOneToOne:false
referencedRelation:"assistants"
referencedColumns:["id"]
},
{
foreignKeyName:"messages_chat_id_fkey"
columns:["chat_id"]
isOneToOne:false
referencedRelation:"chats"
referencedColumns:["id"]
},
{
foreignKeyName:"messages_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
model_workspaces:{
Row:{
created_at:string
model_id:string
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
created_at?:string
model_id:string
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
created_at?:string
model_id?:string
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"model_workspaces_model_id_fkey"
columns:["model_id"]
isOneToOne:false
referencedRelation:"models"
referencedColumns:["id"]
},
{
foreignKeyName:"model_workspaces_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"model_workspaces_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
models:{
Row:{
api_key:string
base_url:string
context_length:number
created_at:string
description:string
folder_id:string | null
id:string
model_id:string
name:string
sharing:string
updated_at:string | null
user_id:string
}
Insert:{
api_key:string
base_url:string
context_length?:number
created_at?:string
description:string
folder_id?:string | null
id?:string
model_id:string
name:string
sharing?:string
updated_at?:string | null
user_id:string
}
Update:{
api_key?:string
base_url?:string
context_length?:number
created_at?:string
description?:string
folder_id?:string | null
id?:string
model_id?:string
name?:string
sharing?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"models_folder_id_fkey"
columns:["folder_id"]
isOneToOne:false
referencedRelation:"folders"
referencedColumns:["id"]
},
{
foreignKeyName:"models_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
preset_workspaces:{
Row:{
created_at:string
preset_id:string
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
created_at?:string
preset_id:string
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
created_at?:string
preset_id?:string
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"preset_workspaces_preset_id_fkey"
columns:["preset_id"]
isOneToOne:false
referencedRelation:"presets"
referencedColumns:["id"]
},
{
foreignKeyName:"preset_workspaces_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"preset_workspaces_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
presets:{
Row:{
context_length:number
created_at:string
description:string
embeddings_provider:string
folder_id:string | null
id:string
include_profile_context:boolean
include_workspace_instructions:boolean
model:string
name:string
prompt:string
sharing:string
temperature:number
updated_at:string | null
user_id:string
}
Insert:{
context_length:number
created_at?:string
description:string
embeddings_provider:string
folder_id?:string | null
id?:string
include_profile_context:boolean
include_workspace_instructions:boolean
model:string
name:string
prompt:string
sharing?:string
temperature:number
updated_at?:string | null
user_id:string
}
Update:{
context_length?:number
created_at?:string
description?:string
embeddings_provider?:string
folder_id?:string | null
id?:string
include_profile_context?:boolean
include_workspace_instructions?:boolean
model?:string
name?:string
prompt?:string
sharing?:string
temperature?:number
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"presets_folder_id_fkey"
columns:["folder_id"]
isOneToOne:false
referencedRelation:"folders"
referencedColumns:["id"]
},
{
foreignKeyName:"presets_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
profiles:{
Row:{
anthropic_api_key:string | null
azure_openai_35_turbo_id:string | null
azure_openai_45_turbo_id:string | null
azure_openai_45_vision_id:string | null
azure_openai_api_key:string | null
azure_openai_embeddings_id:string | null
azure_openai_endpoint:string | null
bio:string
created_at:string
display_name:string
google_gemini_api_key:string | null
groq_api_key:string | null
has_onboarded:boolean
id:string
image_path:string
image_url:string
mistral_api_key:string | null
openai_api_key:string | null
openai_organization_id:string | null
openrouter_api_key:string | null
perplexity_api_key:string | null
profile_context:string
updated_at:string | null
use_azure_openai:boolean
user_id:string
username:string
}
Insert:{
anthropic_api_key?:string | null
azure_openai_35_turbo_id?:string | null
azure_openai_45_turbo_id?:string | null
azure_openai_45_vision_id?:string | null
azure_openai_api_key?:string | null
azure_openai_embeddings_id?:string | null
azure_openai_endpoint?:string | null
bio:string
created_at?:string
display_name:string
google_gemini_api_key?:string | null
groq_api_key?:string | null
has_onboarded?:boolean
id?:string
image_path:string
image_url:string
mistral_api_key?:string | null
openai_api_key?:string | null
openai_organization_id?:string | null
openrouter_api_key?:string | null
perplexity_api_key?:string | null
profile_context:string
updated_at?:string | null
use_azure_openai:boolean
user_id:string
username:string
}
Update:{
anthropic_api_key?:string | null
azure_openai_35_turbo_id?:string | null
azure_openai_45_turbo_id?:string | null
azure_openai_45_vision_id?:string | null
azure_openai_api_key?:string | null
azure_openai_embeddings_id?:string | null
azure_openai_endpoint?:string | null
bio?:string
created_at?:string
display_name?:string
google_gemini_api_key?:string | null
groq_api_key?:string | null
has_onboarded?:boolean
id?:string
image_path?:string
image_url?:string
mistral_api_key?:string | null
openai_api_key?:string | null
openai_organization_id?:string | null
openrouter_api_key?:string | null
perplexity_api_key?:string | null
profile_context?:string
updated_at?:string | null
use_azure_openai?:boolean
user_id?:string
username?:string
}
Relationships:[
{
foreignKeyName:"profiles_user_id_fkey"
columns:["user_id"]
isOneToOne:true
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
prompt_workspaces:{
Row:{
created_at:string
prompt_id:string
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
created_at?:string
prompt_id:string
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
created_at?:string
prompt_id?:string
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"prompt_workspaces_prompt_id_fkey"
columns:["prompt_id"]
isOneToOne:false
referencedRelation:"prompts"
referencedColumns:["id"]
},
{
foreignKeyName:"prompt_workspaces_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"prompt_workspaces_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
prompts:{
Row:{
content:string
created_at:string
folder_id:string | null
id:string
name:string
sharing:string
updated_at:string | null
user_id:string
}
Insert:{
content:string
created_at?:string
folder_id?:string | null
id?:string
name:string
sharing?:string
updated_at?:string | null
user_id:string
}
Update:{
content?:string
created_at?:string
folder_id?:string | null
id?:string
name?:string
sharing?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"prompts_folder_id_fkey"
columns:["folder_id"]
isOneToOne:false
referencedRelation:"folders"
referencedColumns:["id"]
},
{
foreignKeyName:"prompts_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
tool_workspaces:{
Row:{
created_at:string
tool_id:string
updated_at:string | null
user_id:string
workspace_id:string
}
Insert:{
created_at?:string
tool_id:string
updated_at?:string | null
user_id:string
workspace_id:string
}
Update:{
created_at?:string
tool_id?:string
updated_at?:string | null
user_id?:string
workspace_id?:string
}
Relationships:[
{
foreignKeyName:"tool_workspaces_tool_id_fkey"
columns:["tool_id"]
isOneToOne:false
referencedRelation:"tools"
referencedColumns:["id"]
},
{
foreignKeyName:"tool_workspaces_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
{
foreignKeyName:"tool_workspaces_workspace_id_fkey"
columns:["workspace_id"]
isOneToOne:false
referencedRelation:"workspaces"
referencedColumns:["id"]
},
]
}
tools:{
Row:{
created_at:string
custom_headers:Json
description:string
folder_id:string | null
id:string
name:string
schema:Json
sharing:string
updated_at:string | null
url:string
user_id:string
}
Insert:{
created_at?:string
custom_headers?:Json
description:string
folder_id?:string | null
id?:string
name:string
schema?:Json
sharing?:string
updated_at?:string | null
url:string
user_id:string
}
Update:{
created_at?:string
custom_headers?:Json
description?:string
folder_id?:string | null
id?:string
name?:string
schema?:Json
sharing?:string
updated_at?:string | null
url?:string
user_id?:string
}
Relationships:[
{
foreignKeyName:"tools_folder_id_fkey"
columns:["folder_id"]
isOneToOne:false
referencedRelation:"folders"
referencedColumns:["id"]
},
{
foreignKeyName:"tools_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
workspaces:{
Row:{
created_at:string
default_context_length:number
default_model:string
default_prompt:string
default_temperature:number
description:string
embeddings_provider:string
id:string
image_path:string
include_profile_context:boolean
include_workspace_instructions:boolean
instructions:string
is_home:boolean
name:string
sharing:string
updated_at:string | null
user_id:string
}
Insert:{
created_at?:string
default_context_length:number
default_model:string
default_prompt:string
default_temperature:number
description:string
embeddings_provider:string
id?:string
image_path?:string
include_profile_context:boolean
include_workspace_instructions:boolean
instructions:string
is_home?:boolean
name:string
sharing?:string
updated_at?:string | null
user_id:string
}
Update:{
created_at?:string
default_context_length?:number
default_model?:string
default_prompt?:string
default_temperature?:number
description?:string
embeddings_provider?:string
id?:string
image_path?:string
include_profile_context?:boolean
include_workspace_instructions?:boolean
instructions?:string
is_home?:boolean
name?:string
sharing?:string
updated_at?:string | null
user_id?:string
}
Relationships:[
{
foreignKeyName:"workspaces_user_id_fkey"
columns:["user_id"]
isOneToOne:false
referencedRelation:"users"
referencedColumns:["id"]
},
]
}
}
Views:{
[_ in never]:never
}
Functions:{
create_duplicate_messages_for_new_chat:{
Args:{
old_chat_id:string
new_chat_id:string
new_user_id:string
}
Returns:undefined
}
delete_message_including_and_after:{
Args:{
p_user_id:string
p_chat_id:string
p_sequence_number:number
}
Returns:undefined
}
delete_messages_including_and_after:{
Args:{
p_user_id:string
p_chat_id:string
p_sequence_number:number
}
Returns:undefined
}
delete_storage_object:{
Args:{
bucket:string
object:string
}
Returns:Record<string,unknown>
}
delete_storage_object_from_bucket:{
Args:{
bucket_name:string
object_path:string
}
Returns:Record<string,unknown>
}
match_file_items_local:{
Args:{
query_embedding:string
match_count?:number
file_ids?:string[]
}
Returns:{
id:string
file_id:string
content:string
tokens:number
similarity:number
}[]
}
match_file_items_openai:{
Args:{
query_embedding:string
match_count?:number
file_ids?:string[]
}
Returns:{
id:string
file_id:string
content:string
tokens:number
similarity:number
}[]
}
non_private_assistant_exists:{
Args:{
p_name:string
}
Returns:boolean
}
non_private_file_exists:{
Args:{
p_name:string
}
Returns:boolean
}
non_private_workspace_exists:{
Args:{
p_name:string
}
Returns:boolean
}
}
Enums:{
[_ in never]:never
}
CompositeTypes:{
[_ in never]:never
}
}
storage:{
Tables:{
buckets:{
Row:{
allowed_mime_types:string[] | null
avif_autodetection:boolean | null
created_at:string | null
file_size_limit:number | null
id:string
name:string
owner:string | null
owner_id:string | null
public:boolean | null
updated_at:string | null
}
Insert:{
allowed_mime_types?:string[] | null
avif_autodetection?:boolean | null
created_at?:string | null
file_size_limit?:number | null
id:string
name:string
owner?:string | null
owner_id?:string | null
public?:boolean | null
updated_at?:string | null
}
Update:{
allowed_mime_types?:string[] | null
avif_autodetection?:boolean | null
created_at?:string | null
file_size_limit?:number | null
id?:string
name?:string
owner?:string | null
owner_id?:string | null
public?:boolean | null
updated_at?:string | null
}
Relationships:[]
}
migrations:{
Row:{
executed_at:string | null
hash:string
id:number
name:string
}
Insert:{
executed_at?:string | null
hash:string
id:number
name:string
}
Update:{
executed_at?:string | null
hash?:string
id?:number
name?:string
}
Relationships:[]
}
objects:{
Row:{
bucket_id:string | null
created_at:string | null
id:string
last_accessed_at:string | null
metadata:Json | null
name:string | null
owner:string | null
owner_id:string | null
path_tokens:string[] | null
updated_at:string | null
user_metadata:Json | null
version:string | null
}
Insert:{
bucket_id?:string | null
created_at?:string | null
id?:string
last_accessed_at?:string | null
metadata?:Json | null
name?:string | null
owner?:string | null
owner_id?:string | null
path_tokens?:string[] | null
updated_at?:string | null
user_metadata?:Json | null
version?:string | null
}
Update:{
bucket_id?:string | null
created_at?:string | null
id?:string
last_accessed_at?:string | null
metadata?:Json | null
name?:string | null
owner?:string | null
owner_id?:string | null
path_tokens?:string[] | null
updated_at?:string | null
user_metadata?:Json | null
version?:string | null
}
Relationships:[
{
foreignKeyName:"objects_bucketId_fkey"
columns:["bucket_id"]
isOneToOne:false
referencedRelation:"buckets"
referencedColumns:["id"]
},
]
}
s3_multipart_uploads:{
Row:{
bucket_id:string
created_at:string
id:string
in_progress_size:number
key:string
owner_id:string | null
upload_signature:string
user_metadata:Json | null
version:string
}
Insert:{
bucket_id:string
created_at?:string
id:string
in_progress_size?:number
key:string
owner_id?:string | null
upload_signature:string
user_metadata?:Json | null
version:string
}
Update:{
bucket_id?:string
created_at?:string
id?:string
in_progress_size?:number
key?:string
owner_id?:string | null
upload_signature?:string
user_metadata?:Json | null
version?:string
}
Relationships:[
{
foreignKeyName:"s3_multipart_uploads_bucket_id_fkey"
columns:["bucket_id"]
isOneToOne:false
referencedRelation:"buckets"
referencedColumns:["id"]
},
]
}
s3_multipart_uploads_parts:{
Row:{
bucket_id:string
created_at:string
etag:string
id:string
key:string
owner_id:string | null
part_number:number
size:number
upload_id:string
version:string
}
Insert:{
bucket_id:string
created_at?:string
etag:string
id?:string
key:string
owner_id?:string | null
part_number:number
size?:number
upload_id:string
version:string
}
Update:{
bucket_id?:string
created_at?:string
etag?:string
id?:string
key?:string
owner_id?:string | null
part_number?:number
size?:number
upload_id?:string
version?:string
}
Relationships:[
{
foreignKeyName:"s3_multipart_uploads_parts_bucket_id_fkey"
columns:["bucket_id"]
isOneToOne:false
referencedRelation:"buckets"
referencedColumns:["id"]
},
{
foreignKeyName:"s3_multipart_uploads_parts_upload_id_fkey"
columns:["upload_id"]
isOneToOne:false
referencedRelation:"s3_multipart_uploads"
referencedColumns:["id"]
},
]
}
}
Views:{
[_ in never]:never
}
Functions:{
can_insert_object:{
Args:{
bucketid:string
name:string
owner:string
metadata:Json
}
Returns:undefined
}
extension:{
Args:{
name:string
}
Returns:string
}
filename:{
Args:{
name:string
}
Returns:string
}
foldername:{
Args:{
name:string
}
Returns:string[]
}
get_size_by_bucket:{
Args:Record<PropertyKey,never>
Returns:{
size:number
bucket_id:string
}[]
}
list_multipart_uploads_with_delimiter:{
Args:{
bucket_id:string
prefix_param:string
delimiter_param:string
max_keys?:number
next_key_token?:string
next_upload_token?:string
}
Returns:{
key:string
id:string
created_at:string
}[]
}
list_objects_with_delimiter:{
Args:{
bucket_id:string
prefix_param:string
delimiter_param:string
max_keys?:number
start_after?:string
next_token?:string
}
Returns:{
name:string
id:string
metadata:Json
updated_at:string
}[]
}
operation:{
Args:Record<PropertyKey,never>
Returns:string
}
search:{
Args:{
prefix:string
bucketname:string
limits?:number
levels?:number
offsets?:number
search?:string
sortcolumn?:string
sortorder?:string
}
Returns:{
name:string
id:string
updated_at:string
created_at:string
last_accessed_at:string
metadata:Json
}[]
}
}
Enums:{
[_ in never]:never
}
CompositeTypes:{
[_ in never]:never
}
}
}
typePublicSchema = Database[Extract<keyof Database,"public">]
export typeTables<
PublicTableNameOrOptions extends
| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
| {schema:keyof Database},
TableName extends PublicTableNameOrOptions extends {schema:keyof Database}
? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
Database[PublicTableNameOrOptions["schema"]]["Views"])
:never = never,
> = PublicTableNameOrOptions extends {schema:keyof Database}
? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
Row:infer R
}
? R
:never
:PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
PublicSchema["Views"])
? (PublicSchema["Tables"] &
PublicSchema["Views"])[PublicTableNameOrOptions] extends {
Row:infer R
}
? R
:never
:never
export typeTablesInsert<
PublicTableNameOrOptions extends
| keyof PublicSchema["Tables"]
| {schema:keyof Database},
TableName extends PublicTableNameOrOptions extends {schema:keyof Database}
? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
:never = never,
> = PublicTableNameOrOptions extends {schema:keyof Database}
? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
Insert:infer I
}
? I
:never
:PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
Insert:infer I
}
? I
:never
:never
export typeTablesUpdate<
PublicTableNameOrOptions extends
| keyof PublicSchema["Tables"]
| {schema:keyof Database},
TableName extends PublicTableNameOrOptions extends {schema:keyof Database}
? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
:never = never,
> = PublicTableNameOrOptions extends {schema:keyof Database}
? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
Update:infer U
}
? U
:never
:PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
Update:infer U
}
? U
:never
:never
export typeEnums<
PublicEnumNameOrOptions extends
| keyof PublicSchema["Enums"]
| {schema:keyof Database},
EnumName extends PublicEnumNameOrOptions extends {schema:keyof Database}
? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
:never = never,
> = PublicEnumNameOrOptions extends {schema:keyof Database}
? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
:PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
? PublicSchema["Enums"][PublicEnumNameOrOptions]
:never

// File: tailwind.config.ts

module.exports = {
darkMode:['class'],
content:[
'./pages*.{ts,tsx}',
'./components*.{ts,tsx}',
'./app*.{ts,tsx}',
'./src*.{ts,tsx}'
],
theme:{
container:{
center:true,
padding:'2rem',
screens:{
'2xl':'1400px'
}
},
extend:{
colors:{
border:'hsl(var(--border))',
input:'hsl(var(--input))',
ring:'hsl(var(--ring))',
background:'hsl(var(--background))',
foreground:'hsl(var(--foreground))',
primary:{
DEFAULT:'hsl(var(--primary))',
foreground:'hsl(var(--primary-foreground))'
},
secondary:{
DEFAULT:'hsl(var(--secondary))',
foreground:'hsl(var(--secondary-foreground))'
},
destructive:{
DEFAULT:'hsl(var(--destructive))',
foreground:'hsl(var(--destructive-foreground))'
},
muted:{
DEFAULT:'hsl(var(--muted))',
foreground:'hsl(var(--muted-foreground))'
},
accent:{
DEFAULT:'hsl(var(--accent))',
foreground:'hsl(var(--accent-foreground))'
},
popover:{
DEFAULT:'hsl(var(--popover))',
foreground:'hsl(var(--popover-foreground))'
},
card:{
DEFAULT:'hsl(var(--card))',
foreground:'hsl(var(--card-foreground))'
}
},
borderRadius:{
lg:'var(--radius)',
md:'calc(var(--radius) - 2px)',
sm:'calc(var(--radius) - 4px)'
},
keyframes:{
'accordion-down':{
from:{height:0},
to:{height:'var(--radix-accordion-content-height)'}
},
'accordion-up':{
from:{height:'var(--radix-accordion-content-height)'},
to:{height:0}
}
},
animation:{
'accordion-down':'accordion-down 0.2s ease-out',
'accordion-up':'accordion-up 0.2s ease-out'
}
}
},
plugins:[require('tailwindcss-animate'),require('@tailwindcss/typography')]
}

// File: types/announcement.ts
export interfaceAnnouncement {
id:string
title:string
content:string
read:boolean
link:string
date:string
}

// File: types/assistant-retrieval-item.ts
export interfaceAssistantRetrievalItem {
id:string
name:string
type:string
}

// File: types/chat-file.tsx
export interfaceChatFile {
id:string
name:string
type:string
file:File | null
}

// File: types/chat-message.ts
import{Tables}from "@/supabase/types"
export interfaceChatMessage {
message:Tables<"messages">
fileItems:string[]
}

// File: types/chat.ts
import{Tables}from "@/supabase/types"
import{ChatMessage,LLMID}from "."
export interfaceChatSettings {
model:LLMID
prompt:string
temperature:number
contextLength:number
includeProfileContext:boolean
includeWorkspaceInstructions:boolean
embeddingsProvider:"openai" | "local"
}
export interfaceChatPayload {
chatSettings:ChatSettings
workspaceInstructions:string
chatMessages:ChatMessage[]
assistant:Tables<"assistants"> | null
messageFileItems:Tables<"file_items">[]
chatFileItems:Tables<"file_items">[]
}
export interfaceChatAPIPayload {
chatSettings:ChatSettings
messages:Tables<"messages">[]
}

// File: types/collection-file.ts
export interfaceCollectionFile {
id:string
name:string
type:string
}

// File: types/content-type.ts
export typeContentType =
| "chats"
| "presets"
| "prompts"
| "files"
| "collections"
| "assistants"
| "tools"
| "models"

// File: types/error-response.ts
import{z}from "zod"
export typeErrorResponse = {
error:{
code:number
message:string
}
}
export constErrorResponseSchema = z.object({
error:z.object({
code:z.number({coerce:true}).default(500),
message:z.string().default("Internal Server Error")
})
})

// File: types/file-item-chunk.ts
export typeFileItemChunk = {
content:string
tokens:number
}

// File: types/images/assistant-image.ts
export interfaceAssistantImage {
assistantId:string
path:string
base64:any 
url:string
}

// File: types/images/message-image.ts
export interfaceMessageImage {
messageId:string
path:string
base64:any 
url:string
file:File | null
}

// File: types/images/workspace-image.ts
export interfaceWorkspaceImage {
workspaceId:string
path:string
base64:any 
url:string
}

// File: types/index.ts
export * from "./announcement"
export * from "./assistant-retrieval-item"
export * from "./chat"
export * from "./chat-file"
export * from "./chat-message"
export * from "./collection-file"
export * from "./content-type"
export * from "./file-item-chunk"
export * from "./images/assistant-image"
export * from "./images/message-image"
export * from "./images/workspace-image"
export * from "./llms"
export * from "./models"
export * from "./sharing"
export * from "./sidebar-data"

// File: types/key-type.ts
export typeEnvKey =
| "OPENAI_API_KEY"
| "ANTHROPIC_API_KEY"
| "GOOGLE_GEMINI_API_KEY"
| "MISTRAL_API_KEY"
| "GROQ_API_KEY"
| "PERPLEXITY_API_KEY"
| "AZURE_OPENAI_API_KEY"

// File: types/llms.ts
import{ModelProvider}from "."
export typeLLMID =
| OpenAILLMID
| GoogleLLMID
| AnthropicLLMID
| MistralLLMID
| GroqLLMID
| PerplexityLLMID

export typeOpenAILLMID =
| "gpt-4o" 
| "gpt-4-turbo-preview" 
| "gpt-4-vision-preview" 
| "gpt-4" 
| "gpt-3.5-turbo" 

export typeGoogleLLMID =
| "gemini-pro" 
| "gemini-pro-vision" 
| "gemini-1.5-pro-latest" 
| "gemini-1.5-flash" 

export typeAnthropicLLMID =
| "claude-2.1" 
| "claude-instant-1.2" 
| "claude-3-haiku-20240307" 
| "claude-3-sonnet-20240229" 
| "claude-3-opus-20240229" 
| "claude-3-5-sonnet-20240620" 

export typeMistralLLMID =
| "mistral-tiny" 
| "mistral-small-latest" 
| "mistral-medium-latest" 
| "mistral-large-latest" 
export typeGroqLLMID =
| "llama3-8b-8192" 
| "llama3-70b-8192" 
| "mixtral-8x7b-32768" 
| "gemma-7b-it" 

export typePerplexityLLMID =
| "pplx-7b-online" 
| "pplx-70b-online" 
| "pplx-7b-chat" 
| "pplx-70b-chat" 
| "mixtral-8x7b-instruct" 
| "mistral-7b-instruct" 
| "llama-2-70b-chat" 
| "codellama-34b-instruct" 
| "codellama-70b-instruct" 
| "sonar-small-chat" 
| "sonar-small-online" 
| "sonar-medium-chat" 
| "sonar-medium-online" 
export interfaceLLM {
modelId:LLMID
modelName:string
provider:ModelProvider
hostedId:string
platformLink:string
imageInput:boolean
pricing?:{
currency:string
unit:string
inputCost:number
outputCost?:number
}
}
export interfaceOpenRouterLLM extends LLM {
maxContext:number
}

// File: types/models.ts
export typeModelProvider =
| "openai"
| "google"
| "anthropic"
| "mistral"
| "groq"
| "perplexity"
| "ollama"
| "openrouter"
| "custom"

// File: types/sharing.ts
export typeSharing = "private" | "public" | "unlisted"

// File: types/sidebar-data.ts
import{Tables}from "@/supabase/types"
export typeDataListType =
| Tables<"collections">[]
| Tables<"chats">[]
| Tables<"presets">[]
| Tables<"prompts">[]
| Tables<"files">[]
| Tables<"assistants">[]
| Tables<"tools">[]
| Tables<"models">[]
export typeDataItemType =
| Tables<"collections">
| Tables<"chats">
| Tables<"presets">
| Tables<"prompts">
| Tables<"files">
| Tables<"assistants">
| Tables<"tools">
| Tables<"models">

// File: types/valid-keys.ts
export enum VALID_ENV_KEYS {
OPENAI_API_KEY = "OPENAI_API_KEY",
ANTHROPIC_API_KEY = "ANTHROPIC_API_KEY",
GOOGLE_GEMINI_API_KEY = "GOOGLE_GEMINI_API_KEY",
MISTRAL_API_KEY = "MISTRAL_API_KEY",
GROQ_API_KEY = "GROQ_API_KEY",
PERPLEXITY_API_KEY = "PERPLEXITY_API_KEY",
AZURE_OPENAI_API_KEY = "AZURE_OPENAI_API_KEY",
OPENROUTER_API_KEY = "OPENROUTER_API_KEY",
OPENAI_ORGANIZATION_ID = "OPENAI_ORGANIZATION_ID",
AZURE_OPENAI_ENDPOINT = "AZURE_OPENAI_ENDPOINT",
AZURE_GPT_35_TURBO_NAME = "AZURE_GPT_35_TURBO_NAME",
AZURE_GPT_45_VISION_NAME = "AZURE_GPT_45_VISION_NAME",
AZURE_GPT_45_TURBO_NAME = "AZURE_GPT_45_TURBO_NAME",
AZURE_EMBEDDINGS_NAME = "AZURE_EMBEDDINGS_NAME"
}

