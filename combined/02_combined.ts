// File: components/messages/message.tsx
import{useChatHandler}from "@/components/chat/chat-hooks/use-chat-handler"
import{ChatbotUIContext}from "@/context/context"
import{LLM_LIST}from "@/lib/models/llm/llm-list"
import{cn}from "@/lib/utils"
import{Tables}from "@/supabase/types"
import{LLM,LLMID,MessageImage,ModelProvider}from "@/types"
import{
IconBolt,
IconCaretDownFilled,
IconCaretRightFilled,
IconCircleFilled,
IconFileText,
IconMoodSmile,
IconPencil
}from "@tabler/icons-react"
import Image from "next/image"
import{FC,useContext,useEffect,useRef,useState}from "react"
import{ModelIcon}from "../models/model-icon"
import{Button}from "../ui/button"
import{FileIcon}from "../ui/file-icon"
import{FilePreview}from "../ui/file-preview"
import{TextareaAutosize}from "../ui/textarea-autosize"
import{WithTooltip}from "../ui/with-tooltip"
import{MessageActions}from "./message-actions"
import{MessageMarkdown}from "./message-markdown"
constICON_SIZE = 32
interfaceMessageProps {
message:Tables<"messages">
fileItems:Tables<"file_items">[]
isEditing:boolean
isLast:boolean
onStartEdit:(message:Tables<"messages">) => void
onCancelEdit:() => void
onSubmitEdit:(value:string,sequenceNumber:number) => void
}
export constMessage:FC<MessageProps> = ({
message,
fileItems,
isEditing,
isLast,
onStartEdit,
onCancelEdit,
onSubmitEdit
}) => {
const{
assistants,
profile,
isGenerating,
setIsGenerating,
firstTokenReceived,
availableLocalModels,
availableOpenRouterModels,
chatMessages,
selectedAssistant,
chatImages,
assistantImages,
toolInUse,
files,
models
} = useContext(ChatbotUIContext)
const{handleSendMessage} = useChatHandler()
consteditInputRef = useRef<HTMLTextAreaElement>(null)
const[isHovering,setIsHovering] = useState(false)
const[editedMessage,setEditedMessage] = useState(message.content)
const[showImagePreview,setShowImagePreview] = useState(false)
const[selectedImage,setSelectedImage] = useState<MessageImage | null>(null)
const[showFileItemPreview,setShowFileItemPreview] = useState(false)
const[selectedFileItem,setSelectedFileItem] =
useState<Tables<"file_items"> | null>(null)
const[viewSources,setViewSources] = useState(false)
consthandleCopy = () => {
if (navigator.clipboard) {
navigator.clipboard.writeText(message.content)
} else {
consttextArea = document.createElement("textarea")
textArea.value = message.content
document.body.appendChild(textArea)
textArea.focus()
textArea.select()
document.execCommand("copy")
document.body.removeChild(textArea)
}
}
consthandleSendEdit = () => {
onSubmitEdit(editedMessage,message.sequence_number)
onCancelEdit()
}
consthandleKeyDown = (event:React.KeyboardEvent) => {
if (isEditing && event.key === "Enter" && event.metaKey) {
handleSendEdit()
}
}
consthandleRegenerate = async () => {
setIsGenerating(true)
await handleSendMessage(
editedMessage || chatMessages[chatMessages.length - 2].message.content,
chatMessages,
true
)
}
consthandleStartEdit = () => {
onStartEdit(message)
}
useEffect(() => {
setEditedMessage(message.content)
if (isEditing && editInputRef.current) {
constinput = editInputRef.current
input.focus()
input.setSelectionRange(input.value.length,input.value.length)
}
},[isEditing])
constMODEL_DATA = [
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
].find(llm => llm.modelId === message.model) as LLM
constmessageAssistantImage = assistantImages.find(
image => image.assistantId === message.assistant_id
)?.base64
constselectedAssistantImage = assistantImages.find(
image => image.path === selectedAssistant?.image_path
)?.base64
constmodelDetails = LLM_LIST.find(model => model.modelId === message.model)
constfileAccumulator:Record<
string,
{
id:string
name:string
count:number
type:string
description:string
}
> = {}
constfileSummary = fileItems.reduce((acc,fileItem) => {
constparentFile = files.find(file => file.id === fileItem.file_id)
if (parentFile) {
if (!acc[parentFile.id]) {
acc[parentFile.id] = {
id:parentFile.id,
name:parentFile.name,
count:1,
type:parentFile.type,
description:parentFile.description
}
} else {
acc[parentFile.id].count += 1
}
}
return acc
},fileAccumulator)
return (
<div
className={cn(
"flex w-full justify-center",
message.role === "user" ? "" :"bg-secondary"
)}
onMouseEnter={() => setIsHovering(true)}
onMouseLeave={() => setIsHovering(false)}
onKeyDown={handleKeyDown}
>
<div className="relative flex w-full flex-col p-6 sm:w-[550px] sm:px-0 md:w-[650px] lg:w-[650px] xl:w-[700px]">
<div className="absolute right-5 top-7 sm:right-0">
<MessageActions
onCopy={handleCopy}
onEdit={handleStartEdit}
isAssistant={message.role === "assistant"}
isLast={isLast}
isEditing={isEditing}
isHovering={isHovering}
onRegenerate={handleRegenerate}
/>
</div>
<div className="space-y-3">
{message.role === "system" ? (
<div className="flex items-center space-x-4">
<IconPencil
className="border-primary bg-primary text-secondary rounded border-DEFAULT p-1"
size={ICON_SIZE}
/>
<div className="text-lg font-semibold">Prompt</div>
</div>
) :(
<div className="flex items-center space-x-3">
{message.role === "assistant" ? (
messageAssistantImage ? (
<Image
style={{
width:`${ICON_SIZE}px`,
height:`${ICON_SIZE}px`
}}
className="rounded"
src={messageAssistantImage}
alt="assistant image"
height={ICON_SIZE}
width={ICON_SIZE}
/>
) :(
<WithTooltip
display={<div>{MODEL_DATA?.modelName}</div>}
trigger={
<ModelIcon
provider={modelDetails?.provider || "custom"}
height={ICON_SIZE}
width={ICON_SIZE}
/>
}
/>
)
) :profile?.image_url ? (
<Image
className={`size-[32px] rounded`}
src={profile?.image_url}
height={32}
width={32}
alt="user image"
/>
) :(
<IconMoodSmile
className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
size={ICON_SIZE}
/>
)}
<div className="font-semibold">
{message.role === "assistant"
? message.assistant_id
? assistants.find(
assistant => assistant.id === message.assistant_id
)?.name
:selectedAssistant
? selectedAssistant?.name
:MODEL_DATA?.modelName
:(profile?.display_name ?? profile?.username)}
</div>
</div>
)}
{!firstTokenReceived &&
isGenerating &&
isLast &&
message.role === "assistant" ? (
<>
{(() => {
switch (toolInUse) {
case "none":
return (
<IconCircleFilled className="animate-pulse" size={20} />
)
case "retrieval":
return (
<div className="flex animate-pulse items-center space-x-2">
<IconFileText size={20} />
<div>Searching files...</div>
</div>
)
default:
return (
<div className="flex animate-pulse items-center space-x-2">
<IconBolt size={20} />
<div>Using {toolInUse}...</div>
</div>
)
}
})()}
</>
) :isEditing ? (
<TextareaAutosize
textareaRef={editInputRef}
className="text-md"
value={editedMessage}
onValueChange={setEditedMessage}
maxRows={20}
/>
) :(
<MessageMarkdown content={message.content} />
)}
</div>
{fileItems.length > 0 && (
<div className="border-primary mt-6 border-t pt-4 font-bold">
{!viewSources ? (
<div
className="flex cursor-pointer items-center text-lg hover:opacity-50"
onClick={() => setViewSources(true)}
>
{fileItems.length}
{fileItems.length > 1 ? " Sources " :" Source "}
from {Object.keys(fileSummary).length}{" "}
{Object.keys(fileSummary).length > 1 ? "Files" :"File"}{" "}
<IconCaretRightFilled className="ml-1" />
</div>
) :(
<>
<div
className="flex cursor-pointer items-center text-lg hover:opacity-50"
onClick={() => setViewSources(false)}
>
{fileItems.length}
{fileItems.length > 1 ? " Sources " :" Source "}
from {Object.keys(fileSummary).length}{" "}
{Object.keys(fileSummary).length > 1 ? "Files" :"File"}{" "}
<IconCaretDownFilled className="ml-1" />
</div>
<div className="mt-3 space-y-4">
{Object.values(fileSummary).map((file,index) => (
<div key={index}>
<div className="flex items-center space-x-2">
<div>
<FileIcon type={file.type} />
</div>
<div className="truncate">{file.name}</div>
</div>
{fileItems
.filter(fileItem => {
constparentFile = files.find(
parentFile => parentFile.id === fileItem.file_id
)
return parentFile?.id === file.id
})
.map((fileItem,index) => (
<div
key={index}
className="ml-8 mt-1.5 flex cursor-pointer items-center space-x-2 hover:opacity-50"
onClick={() => {
setSelectedFileItem(fileItem)
setShowFileItemPreview(true)
}}
>
<div className="text-sm font-normal">
<span className="mr-1 text-lg font-bold">-</span>{" "}
{fileItem.content.substring(0,200)}...
</div>
</div>
))}
</div>
))}
</div>
</>
)}
</div>
)}
<div className="mt-3 flex flex-wrap gap-2">
{message.image_paths.map((path,index) => {
constitem = chatImages.find(image => image.path === path)
return (
<Image
key={index}
className="cursor-pointer rounded hover:opacity-50"
src={path.startsWith("data") ? path :item?.base64}
alt="message image"
width={300}
height={300}
onClick={() => {
setSelectedImage({
messageId:message.id,
path,
base64:path.startsWith("data") ? path :item?.base64 || "",
url:path.startsWith("data") ? "" :item?.url || "",
file:null
})
setShowImagePreview(true)
}}
loading="lazy"
/>
)
})}
</div>
{isEditing && (
<div className="mt-4 flex justify-center space-x-2">
<Button size="sm" onClick={handleSendEdit}>
Save & Send
</Button>
<Button size="sm" variant="outline" onClick={onCancelEdit}>
Cancel
</Button>
</div>
)}
</div>
{showImagePreview && selectedImage && (
<FilePreview
type="image"
item={selectedImage}
isOpen={showImagePreview}
onOpenChange={(isOpen:boolean) => {
setShowImagePreview(isOpen)
setSelectedImage(null)
}}
/>
)}
{showFileItemPreview && selectedFileItem && (
<FilePreview
type="file_item"
item={selectedFileItem}
isOpen={showFileItemPreview}
onOpenChange={(isOpen:boolean) => {
setShowFileItemPreview(isOpen)
setSelectedFileItem(null)
}}
/>
)}
</div>
)
}

// File: components/models/model-icon.tsx
import{cn}from "@/lib/utils"
import mistral from "@/public/providers/mistral.png"
import groq from "@/public/providers/groq.png"
import perplexity from "@/public/providers/perplexity.png"
import{ModelProvider}from "@/types"
import{IconSparkles}from "@tabler/icons-react"
import{useTheme}from "next-themes"
import Image from "next/image"
import{FC,HTMLAttributes}from "react"
import{AnthropicSVG}from "../icons/anthropic-svg"
import{GoogleSVG}from "../icons/google-svg"
import{OpenAISVG}from "../icons/openai-svg"
interfaceModelIconProps extends HTMLAttributes<HTMLDivElement> {
provider:ModelProvider
height:number
width:number
}
export constModelIcon:FC<ModelIconProps> = ({
provider,
height,
width,
...props
}) => {
const{theme} = useTheme()
switch (provider as ModelProvider) {
case "openai":
return (
<OpenAISVG
className={cn(
"rounded-sm bg-white p-1 text-black",
props.className,
theme === "dark" ? "bg-white" :"border-DEFAULT border-black"
)}
width={width}
height={height}
/>
)
case "mistral":
return (
<Image
className={cn(
"rounded-sm p-1",
theme === "dark" ? "bg-white" :"border-DEFAULT border-black"
)}
src={mistral.src}
alt="Mistral"
width={width}
height={height}
/>
)
case "groq":
return (
<Image
className={cn(
"rounded-sm p-0",
theme === "dark" ? "bg-white" :"border-DEFAULT border-black"
)}
src={groq.src}
alt="Groq"
width={width}
height={height}
/>
)
case "anthropic":
return (
<AnthropicSVG
className={cn(
"rounded-sm bg-white p-1 text-black",
props.className,
theme === "dark" ? "bg-white" :"border-DEFAULT border-black"
)}
width={width}
height={height}
/>
)
case "google":
return (
<GoogleSVG
className={cn(
"rounded-sm bg-white p-1 text-black",
props.className,
theme === "dark" ? "bg-white" :"border-DEFAULT border-black"
)}
width={width}
height={height}
/>
)
case "perplexity":
return (
<Image
className={cn(
"rounded-sm p-1",
theme === "dark" ? "bg-white" :"border-DEFAULT border-black"
)}
src={perplexity.src}
alt="Mistral"
width={width}
height={height}
/>
)
default:
return <IconSparkles size={width} />
}
}

// File: components/models/model-option.tsx
import{LLM}from "@/types"
import{FC}from "react"
import{ModelIcon}from "./model-icon"
import{IconInfoCircle}from "@tabler/icons-react"
import{WithTooltip}from "../ui/with-tooltip"
interfaceModelOptionProps {
model:LLM
onSelect:() => void
}
export constModelOption:FC<ModelOptionProps> = ({model,onSelect}) => {
return (
<WithTooltip
display={
<div>
{model.provider !== "ollama" && model.pricing && (
<div className="space-y-1 text-sm">
<div>
<span className="font-semibold">Input Cost:</span>{" "}
{model.pricing.inputCost} {model.pricing.currency} per{" "}
{model.pricing.unit}
</div>
{model.pricing.outputCost && (
<div>
<span className="font-semibold">Output Cost:</span>{" "}
{model.pricing.outputCost} {model.pricing.currency} per{" "}
{model.pricing.unit}
</div>
)}
</div>
)}
</div>
}
side="bottom"
trigger={
<div
className="hover:bg-accent flex w-full cursor-pointer justify-start space-x-3 truncate rounded p-2 hover:opacity-50"
onClick={onSelect}
>
<div className="flex items-center space-x-2">
<ModelIcon provider={model.provider} width={28} height={28} />
<div className="text-sm font-semibold">{model.modelName}</div>
</div>
</div>
}
/>
)
}

// File: components/models/model-select.tsx
import{ChatbotUIContext}from "@/context/context"
import{LLM,LLMID,ModelProvider}from "@/types"
import{IconCheck,IconChevronDown}from "@tabler/icons-react"
import{FC,useContext,useEffect,useRef,useState}from "react"
import{Button}from "../ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuTrigger
}from "../ui/dropdown-menu"
import{Input}from "../ui/input"
import{Tabs,TabsList,TabsTrigger}from "../ui/tabs"
import{ModelIcon}from "./model-icon"
import{ModelOption}from "./model-option"
interfaceModelSelectProps {
selectedModelId:string
onSelectModel:(modelId:LLMID) => void
}
export constModelSelect:FC<ModelSelectProps> = ({
selectedModelId,
onSelectModel
}) => {
const{
profile,
models,
availableHostedModels,
availableLocalModels,
availableOpenRouterModels
} = useContext(ChatbotUIContext)
constinputRef = useRef<HTMLInputElement>(null)
consttriggerRef = useRef<HTMLButtonElement>(null)
const[isOpen,setIsOpen] = useState(false)
const[search,setSearch] = useState("")
const[tab,setTab] = useState<"hosted" | "local">("hosted")
useEffect(() => {
if (isOpen) {
setTimeout(() => {
inputRef.current?.focus()
},100) 
}
},[isOpen])
consthandleSelectModel = (modelId:LLMID) => {
onSelectModel(modelId)
setIsOpen(false)
}
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
constgroupedModels = allModels.reduce<Record<string,LLM[]>>(
(groups,model) => {
constkey = model.provider
if (!groups[key]) {
groups[key] = []
}
groups[key].push(model)
return groups
},
{}
)
constselectedModel = allModels.find(
model => model.modelId === selectedModelId
)
if (!profile) return null
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
disabled={allModels.length === 0}
>
{allModels.length === 0 ? (
<div className="rounded text-sm font-bold">
Unlock models by entering API keys in your profile settings.
</div>
) :(
<Button
ref={triggerRef}
className="flex items-center justify-between"
variant="ghost"
>
<div className="flex items-center">
{selectedModel ? (
<>
<ModelIcon
provider={selectedModel?.provider}
width={26}
height={26}
/>
<div className="ml-2 flex items-center">
{selectedModel?.modelName}
</div>
</>
) :(
<div className="flex items-center">Select a model</div>
)}
</div>
<IconChevronDown />
</Button>
)}
</DropdownMenuTrigger>
<DropdownMenuContent
className="space-y-2 overflow-auto p-2"
style={{width:triggerRef.current?.offsetWidth}}
align="start"
>
<Tabs value={tab} onValueChange={(value:any) => setTab(value)}>
{availableLocalModels.length > 0 && (
<TabsList defaultValue="hosted" className="grid grid-cols-2">
<TabsTrigger value="hosted">Hosted</TabsTrigger>
<TabsTrigger value="local">Local</TabsTrigger>
</TabsList>
)}
</Tabs>
<Input
ref={inputRef}
className="w-full"
placeholder="Search models..."
value={search}
onChange={e => setSearch(e.target.value)}
/>
<div className="max-h-[300px] overflow-auto">
{Object.entries(groupedModels).map(([provider,models]) => {
constfilteredModels = models
.filter(model => {
if (tab === "hosted") return model.provider !== "ollama"
if (tab === "local") return model.provider === "ollama"
if (tab === "openrouter") return model.provider === "openrouter"
})
.filter(model =>
model.modelName.toLowerCase().includes(search.toLowerCase())
)
.sort((a,b) => a.provider.localeCompare(b.provider))
if (filteredModels.length === 0) return null
return (
<div key={provider}>
<div className="mb-1 ml-2 text-xs font-bold tracking-wide opacity-50">
{provider === "openai" && profile.use_azure_openai
? "AZURE OPENAI"
:provider.toLocaleUpperCase()}
</div>
<div className="mb-4">
{filteredModels.map(model => {
return (
<div
key={model.modelId}
className="flex items-center space-x-1"
>
{selectedModelId === model.modelId && (
<IconCheck className="ml-2" size={32} />
)}
<ModelOption
key={model.modelId}
model={model}
onSelect={() => handleSelectModel(model.modelId)}
/>
</div>
)
})}
</div>
</div>
)
})}
</div>
</DropdownMenuContent>
</DropdownMenu>
)
}

// File: components/setup/api-step.tsx
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{FC}from "react"
import{Button}from "../ui/button"
interfaceAPIStepProps {
openaiAPIKey:string
openaiOrgID:string
azureOpenaiAPIKey:string
azureOpenaiEndpoint:string
azureOpenai35TurboID:string
azureOpenai45TurboID:string
azureOpenai45VisionID:string
azureOpenaiEmbeddingsID:string
anthropicAPIKey:string
googleGeminiAPIKey:string
mistralAPIKey:string
groqAPIKey:string
perplexityAPIKey:string
useAzureOpenai:boolean
openrouterAPIKey:string
onOpenrouterAPIKeyChange:(value:string) => void
onOpenaiAPIKeyChange:(value:string) => void
onOpenaiOrgIDChange:(value:string) => void
onAzureOpenaiAPIKeyChange:(value:string) => void
onAzureOpenaiEndpointChange:(value:string) => void
onAzureOpenai35TurboIDChange:(value:string) => void
onAzureOpenai45TurboIDChange:(value:string) => void
onAzureOpenai45VisionIDChange:(value:string) => void
onAzureOpenaiEmbeddingsIDChange:(value:string) => void
onAnthropicAPIKeyChange:(value:string) => void
onGoogleGeminiAPIKeyChange:(value:string) => void
onMistralAPIKeyChange:(value:string) => void
onGroqAPIKeyChange:(value:string) => void
onPerplexityAPIKeyChange:(value:string) => void
onUseAzureOpenaiChange:(value:boolean) => void
}
export constAPIStep:FC<APIStepProps> = ({
openaiAPIKey,
openaiOrgID,
azureOpenaiAPIKey,
azureOpenaiEndpoint,
azureOpenai35TurboID,
azureOpenai45TurboID,
azureOpenai45VisionID,
azureOpenaiEmbeddingsID,
anthropicAPIKey,
googleGeminiAPIKey,
mistralAPIKey,
groqAPIKey,
perplexityAPIKey,
openrouterAPIKey,
useAzureOpenai,
onOpenaiAPIKeyChange,
onOpenaiOrgIDChange,
onAzureOpenaiAPIKeyChange,
onAzureOpenaiEndpointChange,
onAzureOpenai35TurboIDChange,
onAzureOpenai45TurboIDChange,
onAzureOpenai45VisionIDChange,
onAzureOpenaiEmbeddingsIDChange,
onAnthropicAPIKeyChange,
onGoogleGeminiAPIKeyChange,
onMistralAPIKeyChange,
onGroqAPIKeyChange,
onPerplexityAPIKeyChange,
onUseAzureOpenaiChange,
onOpenrouterAPIKeyChange
}) => {
return (
<>
<div className="mt-5 space-y-2">
<Label className="flex items-center">
<div>
{useAzureOpenai ? "Azure OpenAI API Key" :"OpenAI API Key"}
</div>
<Button
className="ml-3 h-[18px] w-[150px] text-[11px]"
onClick={() => onUseAzureOpenaiChange(!useAzureOpenai)}
>
{useAzureOpenai
? "Switch To Standard OpenAI"
:"Switch To Azure OpenAI"}
</Button>
</Label>
<Input
placeholder={
useAzureOpenai ? "Azure OpenAI API Key" :"OpenAI API Key"
}
type="password"
value={useAzureOpenai ? azureOpenaiAPIKey :openaiAPIKey}
onChange={e =>
useAzureOpenai
? onAzureOpenaiAPIKeyChange(e.target.value)
:onOpenaiAPIKeyChange(e.target.value)
}
/>
</div>
<div className="ml-8 space-y-3">
{useAzureOpenai ? (
<>
<div className="space-y-1">
<Label>Azure OpenAI Endpoint</Label>
<Input
placeholder="https:
type="password"
value={azureOpenaiEndpoint}
onChange={e => onAzureOpenaiEndpointChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Azure OpenAI GPT-3.5 Turbo ID</Label>
<Input
placeholder="Azure OpenAI GPT-3.5 Turbo ID"
type="password"
value={azureOpenai35TurboID}
onChange={e => onAzureOpenai35TurboIDChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Azure OpenAI GPT-4.5 Turbo ID</Label>
<Input
placeholder="Azure OpenAI GPT-4.5 Turbo ID"
type="password"
value={azureOpenai45TurboID}
onChange={e => onAzureOpenai45TurboIDChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Azure OpenAI GPT-4.5 Vision ID</Label>
<Input
placeholder="Azure OpenAI GPT-4.5 Vision ID"
type="password"
value={azureOpenai45VisionID}
onChange={e => onAzureOpenai45VisionIDChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Azure OpenAI Embeddings ID</Label>
<Input
placeholder="Azure OpenAI Embeddings ID"
type="password"
value={azureOpenaiEmbeddingsID}
onChange={e => onAzureOpenaiEmbeddingsIDChange(e.target.value)}
/>
</div>
</>
) :(
<>
<div className="space-y-1">
<Label>OpenAI Organization ID</Label>
<Input
placeholder="OpenAI Organization ID (optional)"
type="password"
value={openaiOrgID}
onChange={e => onOpenaiOrgIDChange(e.target.value)}
/>
</div>
</>
)}
</div>
<div className="space-y-1">
<Label>Anthropic API Key</Label>
<Input
placeholder="Anthropic API Key"
type="password"
value={anthropicAPIKey}
onChange={e => onAnthropicAPIKeyChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Google Gemini API Key</Label>
<Input
placeholder="Google Gemini API Key"
type="password"
value={googleGeminiAPIKey}
onChange={e => onGoogleGeminiAPIKeyChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Mistral API Key</Label>
<Input
placeholder="Mistral API Key"
type="password"
value={mistralAPIKey}
onChange={e => onMistralAPIKeyChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Groq API Key</Label>
<Input
placeholder="Groq API Key"
type="password"
value={groqAPIKey}
onChange={e => onGroqAPIKeyChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Perplexity API Key</Label>
<Input
placeholder="Perplexity API Key"
type="password"
value={perplexityAPIKey}
onChange={e => onPerplexityAPIKeyChange(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>OpenRouter API Key</Label>
<Input
placeholder="OpenRouter API Key"
type="password"
value={openrouterAPIKey}
onChange={e => onOpenrouterAPIKeyChange(e.target.value)}
/>
</div>
</>
)
}

// File: components/setup/finish-step.tsx
import{FC}from "react"
interfaceFinishStepProps {
displayName:string
}
export constFinishStep:FC<FinishStepProps> = ({displayName}) => {
return (
<div className="space-y-4">
<div>
Welcome to Chatbot UI
{displayName.length > 0 ? `,${displayName.split(" ")[0]}` :null}!
</div>
<div>Click next to start chatting.</div>
</div>
)
}

// File: components/setup/profile-step.tsx
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{
PROFILE_DISPLAY_NAME_MAX,
PROFILE_USERNAME_MAX,
PROFILE_USERNAME_MIN
}from "@/db/limits"
import{
IconCircleCheckFilled,
IconCircleXFilled,
IconLoader2
}from "@tabler/icons-react"
import{FC,useCallback,useState}from "react"
import{LimitDisplay}from "../ui/limit-display"
import{toast}from "sonner"
interfaceProfileStepProps {
username:string
usernameAvailable:boolean
displayName:string
onUsernameAvailableChange:(isAvailable:boolean) => void
onUsernameChange:(username:string) => void
onDisplayNameChange:(name:string) => void
}
export constProfileStep:FC<ProfileStepProps> = ({
username,
usernameAvailable,
displayName,
onUsernameAvailableChange,
onUsernameChange,
onDisplayNameChange
}) => {
const[loading,setLoading] = useState(false)
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
onUsernameAvailableChange(false)
return
}
if (username.length > PROFILE_USERNAME_MAX) {
onUsernameAvailableChange(false)
return
}
constusernameRegex = /^[a-zA-Z0-9_]+$/
if (!usernameRegex.test(username)) {
onUsernameAvailableChange(false)
toast.error(
"Username must be letters,numbers,or underscores only - no other characters or spacing allowed."
)
return
}
setLoading(true)
constresponse = await fetch(`/api/username/available`,{
method:"POST",
body:JSON.stringify({username})
})
constdata = await response.json()
constisAvailable = data.isAvailable
onUsernameAvailableChange(isAvailable)
setLoading(false)
},500),
[]
)
return (
<>
<div className="space-y-1">
<div className="flex items-center space-x-2">
<Label>Username</Label>
<div className="text-xs">
{usernameAvailable ? (
<div className="text-green-500">AVAILABLE</div>
) :(
<div className="text-red-500">UNAVAILABLE</div>
)}
</div>
</div>
<div className="relative">
<Input
className="pr-10"
placeholder="username"
value={username}
onChange={e => {
onUsernameChange(e.target.value)
checkUsernameAvailability(e.target.value)
}}
minLength={PROFILE_USERNAME_MIN}
maxLength={PROFILE_USERNAME_MAX}
/>
<div className="absolute inset-y-0 right-0 flex items-center pr-3">
{loading ? (
<IconLoader2 className="animate-spin" />
) :usernameAvailable ? (
<IconCircleCheckFilled className="text-green-500" />
) :(
<IconCircleXFilled className="text-red-500" />
)}
</div>
</div>
<LimitDisplay used={username.length} limit={PROFILE_USERNAME_MAX} />
</div>
<div className="space-y-1">
<Label>Chat Display Name</Label>
<Input
placeholder="Your Name"
value={displayName}
onChange={e => onDisplayNameChange(e.target.value)}
maxLength={PROFILE_DISPLAY_NAME_MAX}
/>
<LimitDisplay
used={displayName.length}
limit={PROFILE_DISPLAY_NAME_MAX}
/>
</div>
</>
)
}

// File: components/setup/step-container.tsx
import{Button}from "@/components/ui/button"
import{
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle
}from "@/components/ui/card"
import{FC,useRef}from "react"
export constSETUP_STEP_COUNT = 3
interfaceStepContainerProps {
stepDescription:string
stepNum:number
stepTitle:string
onShouldProceed:(shouldProceed:boolean) => void
children?:React.ReactNode
showBackButton?:boolean
showNextButton?:boolean
}
export constStepContainer:FC<StepContainerProps> = ({
stepDescription,
stepNum,
stepTitle,
onShouldProceed,
children,
showBackButton = false,
showNextButton = true
}) => {
constbuttonRef = useRef<HTMLButtonElement>(null)
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter" && !e.shiftKey) {
if (buttonRef.current) {
buttonRef.current.click()
}
}
}
return (
<Card
className="max-h-[calc(100vh-60px)] w-[600px] overflow-auto"
onKeyDown={handleKeyDown}
>
<CardHeader>
<CardTitle className="flex justify-between">
<div>{stepTitle}</div>
<div className="text-sm">
{stepNum} / {SETUP_STEP_COUNT}
</div>
</CardTitle>
<CardDescription>{stepDescription}</CardDescription>
</CardHeader>
<CardContent className="space-y-4">{children}</CardContent>
<CardFooter className="flex justify-between">
<div>
{showBackButton && (
<Button
size="sm"
variant="outline"
onClick={() => onShouldProceed(false)}
>
Back
</Button>
)}
</div>
<div>
{showNextButton && (
<Button
ref={buttonRef}
size="sm"
onClick={() => onShouldProceed(true)}
>
Next
</Button>
)}
</div>
</CardFooter>
</Card>
)
}

// File: components/sidebar/items/all/sidebar-create-item.tsx
import{Button}from "@/components/ui/button"
import{
Sheet,
SheetContent,
SheetFooter,
SheetHeader,
SheetTitle
}from "@/components/ui/sheet"
import{ChatbotUIContext}from "@/context/context"
import{createAssistantCollections}from "@/db/assistant-collections"
import{createAssistantFiles}from "@/db/assistant-files"
import{createAssistantTools}from "@/db/assistant-tools"
import{createAssistant,updateAssistant}from "@/db/assistants"
import{createChat}from "@/db/chats"
import{createCollectionFiles}from "@/db/collection-files"
import{createCollection}from "@/db/collections"
import{createFileBasedOnExtension}from "@/db/files"
import{createModel}from "@/db/models"
import{createPreset}from "@/db/presets"
import{createPrompt}from "@/db/prompts"
import{
getAssistantImageFromStorage,
uploadAssistantImage
}from "@/db/storage/assistant-images"
import{createTool}from "@/db/tools"
import{convertBlobToBase64}from "@/lib/blob-to-b64"
import{Tables,TablesInsert}from "@/supabase/types"
import{ContentType}from "@/types"
import{FC,useContext,useRef,useState}from "react"
import{toast}from "sonner"
interfaceSidebarCreateItemProps {
isOpen:boolean
isTyping:boolean
onOpenChange:(isOpen:boolean) => void
contentType:ContentType
renderInputs:() => JSX.Element
createState:any
}
export constSidebarCreateItem:FC<SidebarCreateItemProps> = ({
isOpen,
onOpenChange,
contentType,
renderInputs,
createState,
isTyping
}) => {
const{
selectedWorkspace,
setChats,
setPresets,
setPrompts,
setFiles,
setCollections,
setAssistants,
setAssistantImages,
setTools,
setModels
} = useContext(ChatbotUIContext)
constbuttonRef = useRef<HTMLButtonElement>(null)
const[creating,setCreating] = useState(false)
constcreateFunctions = {
chats:createChat,
presets:createPreset,
prompts:createPrompt,
files:async (
createState:{file:File} & TablesInsert<"files">,
workspaceId:string
) => {
if (!selectedWorkspace) return
const{file,...rest} = createState
constcreatedFile = await createFileBasedOnExtension(
file,
rest,
workspaceId,
selectedWorkspace.embeddings_provider as "openai" | "local"
)
return createdFile
},
collections:async (
createState:{
image:File
collectionFiles:TablesInsert<"collection_files">[]
} & Tables<"collections">,
workspaceId:string
) => {
const{collectionFiles,...rest} = createState
constcreatedCollection = await createCollection(rest,workspaceId)
constfinalCollectionFiles = collectionFiles.map(collectionFile => ({
...collectionFile,
collection_id:createdCollection.id
}))
await createCollectionFiles(finalCollectionFiles)
return createdCollection
},
assistants:async (
createState:{
image:File
files:Tables<"files">[]
collections:Tables<"collections">[]
tools:Tables<"tools">[]
} & Tables<"assistants">,
workspaceId:string
) => {
const{image,files,collections,tools,...rest} = createState
constcreatedAssistant = await createAssistant(rest,workspaceId)
letupdatedAssistant = createdAssistant
if (image) {
constfilePath = await uploadAssistantImage(createdAssistant,image)
updatedAssistant = await updateAssistant(createdAssistant.id,{
image_path:filePath
})
consturl = (await getAssistantImageFromStorage(filePath)) || ""
if (url) {
constresponse = await fetch(url)
constblob = await response.blob()
constbase64 = await convertBlobToBase64(blob)
setAssistantImages(prev => [
...prev,
{
assistantId:updatedAssistant.id,
path:filePath,
base64,
url
}
])
}
}
constassistantFiles = files.map(file => ({
user_id:rest.user_id,
assistant_id:createdAssistant.id,
file_id:file.id
}))
constassistantCollections = collections.map(collection => ({
user_id:rest.user_id,
assistant_id:createdAssistant.id,
collection_id:collection.id
}))
constassistantTools = tools.map(tool => ({
user_id:rest.user_id,
assistant_id:createdAssistant.id,
tool_id:tool.id
}))
await createAssistantFiles(assistantFiles)
await createAssistantCollections(assistantCollections)
await createAssistantTools(assistantTools)
return updatedAssistant
},
tools:createTool,
models:createModel
}
conststateUpdateFunctions = {
chats:setChats,
presets:setPresets,
prompts:setPrompts,
files:setFiles,
collections:setCollections,
assistants:setAssistants,
tools:setTools,
models:setModels
}
consthandleCreate = async () => {
try {
if (!selectedWorkspace) return
if (isTyping) return 
constcreateFunction = createFunctions[contentType]
constsetStateFunction = stateUpdateFunctions[contentType]
if (!createFunction || !setStateFunction) return
setCreating(true)
constnewItem = await createFunction(createState,selectedWorkspace.id)
setStateFunction((prevItems:any) => [...prevItems,newItem])
onOpenChange(false)
setCreating(false)
} catch (error) {
toast.error(`Error creating ${contentType.slice(0,-1)}. ${error}.`)
setCreating(false)
}
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (!isTyping && e.key === "Enter" && !e.shiftKey) {
e.preventDefault()
buttonRef.current?.click()
}
}
return (
<Sheet open={isOpen} onOpenChange={onOpenChange}>
<SheetContent
className="flex min-w-[450px] flex-col justify-between overflow-auto"
side="left"
onKeyDown={handleKeyDown}
>
<div className="grow overflow-auto">
<SheetHeader>
<SheetTitle className="text-2xl font-bold">
Create{" "}
{contentType.charAt(0).toUpperCase() + contentType.slice(1,-1)}
</SheetTitle>
</SheetHeader>
<div className="mt-4 space-y-3">{renderInputs()}</div>
</div>
<SheetFooter className="mt-2 flex justify-between">
<div className="flex grow justify-end space-x-2">
<Button
disabled={creating}
variant="outline"
onClick={() => onOpenChange(false)}
>
Cancel
</Button>
<Button disabled={creating} ref={buttonRef} onClick={handleCreate}>
{creating ? "Creating..." :"Create"}
</Button>
</div>
</SheetFooter>
</SheetContent>
</Sheet>
)
}

// File: components/sidebar/items/all/sidebar-delete-item.tsx
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
import{deleteAssistant}from "@/db/assistants"
import{deleteChat}from "@/db/chats"
import{deleteCollection}from "@/db/collections"
import{deleteFile}from "@/db/files"
import{deleteModel}from "@/db/models"
import{deletePreset}from "@/db/presets"
import{deletePrompt}from "@/db/prompts"
import{deleteFileFromStorage}from "@/db/storage/files"
import{deleteTool}from "@/db/tools"
import{Tables}from "@/supabase/types"
import{ContentType,DataItemType}from "@/types"
import{FC,useContext,useRef,useState}from "react"
interfaceSidebarDeleteItemProps {
item:DataItemType
contentType:ContentType
}
export constSidebarDeleteItem:FC<SidebarDeleteItemProps> = ({
item,
contentType
}) => {
const{
setChats,
setPresets,
setPrompts,
setFiles,
setCollections,
setAssistants,
setTools,
setModels
} = useContext(ChatbotUIContext)
constbuttonRef = useRef<HTMLButtonElement>(null)
const[showDialog,setShowDialog] = useState(false)
constdeleteFunctions = {
chats:async (chat:Tables<"chats">) => {
await deleteChat(chat.id)
},
presets:async (preset:Tables<"presets">) => {
await deletePreset(preset.id)
},
prompts:async (prompt:Tables<"prompts">) => {
await deletePrompt(prompt.id)
},
files:async (file:Tables<"files">) => {
await deleteFileFromStorage(file.file_path)
await deleteFile(file.id)
},
collections:async (collection:Tables<"collections">) => {
await deleteCollection(collection.id)
},
assistants:async (assistant:Tables<"assistants">) => {
await deleteAssistant(assistant.id)
setChats(prevState =>
prevState.filter(chat => chat.assistant_id !== assistant.id)
)
},
tools:async (tool:Tables<"tools">) => {
await deleteTool(tool.id)
},
models:async (model:Tables<"models">) => {
await deleteModel(model.id)
}
}
conststateUpdateFunctions = {
chats:setChats,
presets:setPresets,
prompts:setPrompts,
files:setFiles,
collections:setCollections,
assistants:setAssistants,
tools:setTools,
models:setModels
}
consthandleDelete = async () => {
constdeleteFunction = deleteFunctions[contentType]
constsetStateFunction = stateUpdateFunctions[contentType]
if (!deleteFunction || !setStateFunction) return
await deleteFunction(item as any)
setStateFunction((prevItems:any) =>
prevItems.filter((prevItem:any) => prevItem.id !== item.id)
)
setShowDialog(false)
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
e.stopPropagation()
buttonRef.current?.click()
}
}
return (
<Dialog open={showDialog} onOpenChange={setShowDialog}>
<DialogTrigger asChild>
<Button className="text-red-500" variant="ghost">
Delete
</Button>
</DialogTrigger>
<DialogContent onKeyDown={handleKeyDown}>
<DialogHeader>
<DialogTitle>Delete {contentType.slice(0,-1)}</DialogTitle>
<DialogDescription>
Are you sure you want to delete {item.name}?
</DialogDescription>
</DialogHeader>
<DialogFooter>
<Button variant="ghost" onClick={() => setShowDialog(false)}>
Cancel
</Button>
<Button ref={buttonRef} variant="destructive" onClick={handleDelete}>
Delete
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)
}

// File: components/sidebar/items/all/sidebar-display-item.tsx
import{ChatbotUIContext}from "@/context/context"
import{createChat}from "@/db/chats"
import{cn}from "@/lib/utils"
import{Tables}from "@/supabase/types"
import{ContentType,DataItemType}from "@/types"
import{useRouter}from "next/navigation"
import{FC,useContext,useRef,useState}from "react"
import{SidebarUpdateItem}from "./sidebar-update-item"
interfaceSidebarItemProps {
item:DataItemType
isTyping:boolean
contentType:ContentType
icon:React.ReactNode
updateState:any
renderInputs:(renderState:any) => JSX.Element
}
export constSidebarItem:FC<SidebarItemProps> = ({
item,
contentType,
updateState,
renderInputs,
icon,
isTyping
}) => {
const{selectedWorkspace,setChats,setSelectedAssistant} =
useContext(ChatbotUIContext)
constrouter = useRouter()
constitemRef = useRef<HTMLDivElement>(null)
const[isHovering,setIsHovering] = useState(false)
constactionMap = {
chats:async (item:any) => {},
presets:async (item:any) => {},
prompts:async (item:any) => {},
files:async (item:any) => {},
collections:async (item:any) => {},
assistants:async (assistant:Tables<"assistants">) => {
if (!selectedWorkspace) return
constcreatedChat = await createChat({
user_id:assistant.user_id,
workspace_id:selectedWorkspace.id,
assistant_id:assistant.id,
context_length:assistant.context_length,
include_profile_context:assistant.include_profile_context,
include_workspace_instructions:
assistant.include_workspace_instructions,
model:assistant.model,
name:`Chat with ${assistant.name}`,
prompt:assistant.prompt,
temperature:assistant.temperature,
embeddings_provider:assistant.embeddings_provider
})
setChats(prevState => [createdChat,...prevState])
setSelectedAssistant(assistant)
return router.push(`/${selectedWorkspace.id}/chat/${createdChat.id}`)
},
tools:async (item:any) => {},
models:async (item:any) => {}
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
e.stopPropagation()
itemRef.current?.click()
}
}







return (
<SidebarUpdateItem
item={item}
isTyping={isTyping}
contentType={contentType}
updateState={updateState}
renderInputs={renderInputs}
>
<div
ref={itemRef}
className={cn(
"hover:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none"
)}
tabIndex={0}
onKeyDown={handleKeyDown}
onMouseEnter={() => setIsHovering(true)}
onMouseLeave={() => setIsHovering(false)}
>
{icon}
<div className="ml-3 flex-1 truncate text-sm font-semibold">
{item.name}
</div>
{}
{/* {isHovering && (
<WithTooltip
delayDuration={1000}
display={<div>Start chat with {contentType.slice(0,-1)}</div>}
trigger={
<IconSquarePlus
className="cursor-pointer hover:text-blue-500"
size={20}
onClick={handleClickAction}
/>
}
/>
)} */}
</div>
</SidebarUpdateItem>
)
}

// File: components/sidebar/items/all/sidebar-update-item.tsx
import{Button}from "@/components/ui/button"
import{Label}from "@/components/ui/label"
import{
Sheet,
SheetContent,
SheetFooter,
SheetHeader,
SheetTitle,
SheetTrigger
}from "@/components/ui/sheet"
import{AssignWorkspaces}from "@/components/workspace/assign-workspaces"
import{ChatbotUIContext}from "@/context/context"
import{
createAssistantCollection,
deleteAssistantCollection,
getAssistantCollectionsByAssistantId
}from "@/db/assistant-collections"
import{
createAssistantFile,
deleteAssistantFile,
getAssistantFilesByAssistantId
}from "@/db/assistant-files"
import{
createAssistantTool,
deleteAssistantTool,
getAssistantToolsByAssistantId
}from "@/db/assistant-tools"
import{
createAssistantWorkspaces,
deleteAssistantWorkspace,
getAssistantWorkspacesByAssistantId,
updateAssistant
}from "@/db/assistants"
import{updateChat}from "@/db/chats"
import{
createCollectionFile,
deleteCollectionFile,
getCollectionFilesByCollectionId
}from "@/db/collection-files"
import{
createCollectionWorkspaces,
deleteCollectionWorkspace,
getCollectionWorkspacesByCollectionId,
updateCollection
}from "@/db/collections"
import{
createFileWorkspaces,
deleteFileWorkspace,
getFileWorkspacesByFileId,
updateFile
}from "@/db/files"
import{
createModelWorkspaces,
deleteModelWorkspace,
getModelWorkspacesByModelId,
updateModel
}from "@/db/models"
import{
createPresetWorkspaces,
deletePresetWorkspace,
getPresetWorkspacesByPresetId,
updatePreset
}from "@/db/presets"
import{
createPromptWorkspaces,
deletePromptWorkspace,
getPromptWorkspacesByPromptId,
updatePrompt
}from "@/db/prompts"
import{
getAssistantImageFromStorage,
uploadAssistantImage
}from "@/db/storage/assistant-images"
import{
createToolWorkspaces,
deleteToolWorkspace,
getToolWorkspacesByToolId,
updateTool
}from "@/db/tools"
import{convertBlobToBase64}from "@/lib/blob-to-b64"
import{Tables,TablesUpdate}from "@/supabase/types"
import{CollectionFile,ContentType,DataItemType}from "@/types"
import{FC,useContext,useEffect,useRef,useState}from "react"
import profile from "react-syntax-highlighter/dist/esm/languages/hljs/profile"
import{toast}from "sonner"
import{SidebarDeleteItem}from "./sidebar-delete-item"
interfaceSidebarUpdateItemProps {
isTyping:boolean
item:DataItemType
contentType:ContentType
children:React.ReactNode
renderInputs:(renderState:any) => JSX.Element
updateState:any
}
export constSidebarUpdateItem:FC<SidebarUpdateItemProps> = ({
item,
contentType,
children,
renderInputs,
updateState,
isTyping
}) => {
const{
workspaces,
selectedWorkspace,
setChats,
setPresets,
setPrompts,
setFiles,
setCollections,
setAssistants,
setTools,
setModels,
setAssistantImages
} = useContext(ChatbotUIContext)
constbuttonRef = useRef<HTMLButtonElement>(null)
const[isOpen,setIsOpen] = useState(false)
const[startingWorkspaces,setStartingWorkspaces] = useState<
Tables<"workspaces">[]
>([])
const[selectedWorkspaces,setSelectedWorkspaces] = useState<
Tables<"workspaces">[]
>([])

const[startingCollectionFiles,setStartingCollectionFiles] = useState<
CollectionFile[]
>([])
const[selectedCollectionFiles,setSelectedCollectionFiles] = useState<
CollectionFile[]
>([])

const[startingAssistantFiles,setStartingAssistantFiles] = useState<
Tables<"files">[]
>([])
const[startingAssistantCollections,setStartingAssistantCollections] =
useState<Tables<"collections">[]>([])
const[startingAssistantTools,setStartingAssistantTools] = useState<
Tables<"tools">[]
>([])
const[selectedAssistantFiles,setSelectedAssistantFiles] = useState<
Tables<"files">[]
>([])
const[selectedAssistantCollections,setSelectedAssistantCollections] =
useState<Tables<"collections">[]>([])
const[selectedAssistantTools,setSelectedAssistantTools] = useState<
Tables<"tools">[]
>([])
useEffect(() => {
if (isOpen) {
constfetchData = async () => {
if (workspaces.length > 1) {
constworkspaces = await fetchSelectedWorkspaces()
setStartingWorkspaces(workspaces)
setSelectedWorkspaces(workspaces)
}
constfetchDataFunction = fetchDataFunctions[contentType]
if (!fetchDataFunction) return
await fetchDataFunction(item.id)
}
fetchData()
}
},[isOpen])
constrenderState = {
chats:null,
presets:null,
prompts:null,
files:null,
collections:{
startingCollectionFiles,
setStartingCollectionFiles,
selectedCollectionFiles,
setSelectedCollectionFiles
},
assistants:{
startingAssistantFiles,
setStartingAssistantFiles,
startingAssistantCollections,
setStartingAssistantCollections,
startingAssistantTools,
setStartingAssistantTools,
selectedAssistantFiles,
setSelectedAssistantFiles,
selectedAssistantCollections,
setSelectedAssistantCollections,
selectedAssistantTools,
setSelectedAssistantTools
},
tools:null,
models:null
}
constfetchDataFunctions = {
chats:null,
presets:null,
prompts:null,
files:null,
collections:async (collectionId:string) => {
constcollectionFiles =
await getCollectionFilesByCollectionId(collectionId)
setStartingCollectionFiles(collectionFiles.files)
setSelectedCollectionFiles([])
},
assistants:async (assistantId:string) => {
constassistantFiles = await getAssistantFilesByAssistantId(assistantId)
setStartingAssistantFiles(assistantFiles.files)
constassistantCollections =
await getAssistantCollectionsByAssistantId(assistantId)
setStartingAssistantCollections(assistantCollections.collections)
constassistantTools = await getAssistantToolsByAssistantId(assistantId)
setStartingAssistantTools(assistantTools.tools)
setSelectedAssistantFiles([])
setSelectedAssistantCollections([])
setSelectedAssistantTools([])
},
tools:null,
models:null
}
constfetchWorkpaceFunctions = {
chats:null,
presets:async (presetId:string) => {
constitem = await getPresetWorkspacesByPresetId(presetId)
return item.workspaces
},
prompts:async (promptId:string) => {
constitem = await getPromptWorkspacesByPromptId(promptId)
return item.workspaces
},
files:async (fileId:string) => {
constitem = await getFileWorkspacesByFileId(fileId)
return item.workspaces
},
collections:async (collectionId:string) => {
constitem = await getCollectionWorkspacesByCollectionId(collectionId)
return item.workspaces
},
assistants:async (assistantId:string) => {
constitem = await getAssistantWorkspacesByAssistantId(assistantId)
return item.workspaces
},
tools:async (toolId:string) => {
constitem = await getToolWorkspacesByToolId(toolId)
return item.workspaces
},
models:async (modelId:string) => {
constitem = await getModelWorkspacesByModelId(modelId)
return item.workspaces
}
}
constfetchSelectedWorkspaces = async () => {
constfetchFunction = fetchWorkpaceFunctions[contentType]
if (!fetchFunction) return []
constworkspaces = await fetchFunction(item.id)
return workspaces
}
consthandleWorkspaceUpdates = async (
startingWorkspaces:Tables<"workspaces">[],
selectedWorkspaces:Tables<"workspaces">[],
itemId:string,
deleteWorkspaceFn:(
itemId:string,
workspaceId:string
) => Promise<boolean>,
createWorkspaceFn:(
workspaces:{user_id:string;item_id:string;workspace_id:string}[]
) => Promise<void>,
itemIdKey:string
) => {
if (!selectedWorkspace) return
constdeleteList = startingWorkspaces.filter(
startingWorkspace =>
!selectedWorkspaces.some(
selectedWorkspace => selectedWorkspace.id === startingWorkspace.id
)
)
for (constworkspace of deleteList) {
await deleteWorkspaceFn(itemId,workspace.id)
}
if (deleteList.map(w => w.id).includes(selectedWorkspace.id)) {
constsetStateFunction = stateUpdateFunctions[contentType]
if (setStateFunction) {
setStateFunction((prevItems:any) =>
prevItems.filter((prevItem:any) => prevItem.id !== item.id)
)
}
}
constcreateList = selectedWorkspaces.filter(
selectedWorkspace =>
!startingWorkspaces.some(
startingWorkspace => startingWorkspace.id === selectedWorkspace.id
)
)
await createWorkspaceFn(
createList.map(workspace => {
return {
user_id:workspace.user_id,
[itemIdKey]:itemId,
workspace_id:workspace.id
} as any
})
)
}
constupdateFunctions = {
chats:updateChat,
presets:async (presetId:string,updateState:TablesUpdate<"presets">) => {
constupdatedPreset = await updatePreset(presetId,updateState)
await handleWorkspaceUpdates(
startingWorkspaces,
selectedWorkspaces,
presetId,
deletePresetWorkspace,
createPresetWorkspaces as any,
"preset_id"
)
return updatedPreset
},
prompts:async (promptId:string,updateState:TablesUpdate<"prompts">) => {
constupdatedPrompt = await updatePrompt(promptId,updateState)
await handleWorkspaceUpdates(
startingWorkspaces,
selectedWorkspaces,
promptId,
deletePromptWorkspace,
createPromptWorkspaces as any,
"prompt_id"
)
return updatedPrompt
},
files:async (fileId:string,updateState:TablesUpdate<"files">) => {
constupdatedFile = await updateFile(fileId,updateState)
await handleWorkspaceUpdates(
startingWorkspaces,
selectedWorkspaces,
fileId,
deleteFileWorkspace,
createFileWorkspaces as any,
"file_id"
)
return updatedFile
},
collections:async (
collectionId:string,
updateState:TablesUpdate<"assistants">
) => {
if (!profile) return
const{...rest} = updateState
constfilesToAdd = selectedCollectionFiles.filter(
selectedFile =>
!startingCollectionFiles.some(
startingFile => startingFile.id === selectedFile.id
)
)
constfilesToRemove = startingCollectionFiles.filter(startingFile =>
selectedCollectionFiles.some(
selectedFile => selectedFile.id === startingFile.id
)
)
for (constfile of filesToAdd) {
await createCollectionFile({
user_id:item.user_id,
collection_id:collectionId,
file_id:file.id
})
}
for (constfile of filesToRemove) {
await deleteCollectionFile(collectionId,file.id)
}
constupdatedCollection = await updateCollection(collectionId,rest)
await handleWorkspaceUpdates(
startingWorkspaces,
selectedWorkspaces,
collectionId,
deleteCollectionWorkspace,
createCollectionWorkspaces as any,
"collection_id"
)
return updatedCollection
},
assistants:async (
assistantId:string,
updateState:{
assistantId:string
image:File
} & TablesUpdate<"assistants">
) => {
const{image,...rest} = updateState
constfilesToAdd = selectedAssistantFiles.filter(
selectedFile =>
!startingAssistantFiles.some(
startingFile => startingFile.id === selectedFile.id
)
)
constfilesToRemove = startingAssistantFiles.filter(startingFile =>
selectedAssistantFiles.some(
selectedFile => selectedFile.id === startingFile.id
)
)
for (constfile of filesToAdd) {
await createAssistantFile({
user_id:item.user_id,
assistant_id:assistantId,
file_id:file.id
})
}
for (constfile of filesToRemove) {
await deleteAssistantFile(assistantId,file.id)
}
constcollectionsToAdd = selectedAssistantCollections.filter(
selectedCollection =>
!startingAssistantCollections.some(
startingCollection =>
startingCollection.id === selectedCollection.id
)
)
constcollectionsToRemove = startingAssistantCollections.filter(
startingCollection =>
selectedAssistantCollections.some(
selectedCollection =>
selectedCollection.id === startingCollection.id
)
)
for (constcollection of collectionsToAdd) {
await createAssistantCollection({
user_id:item.user_id,
assistant_id:assistantId,
collection_id:collection.id
})
}
for (constcollection of collectionsToRemove) {
await deleteAssistantCollection(assistantId,collection.id)
}
consttoolsToAdd = selectedAssistantTools.filter(
selectedTool =>
!startingAssistantTools.some(
startingTool => startingTool.id === selectedTool.id
)
)
consttoolsToRemove = startingAssistantTools.filter(startingTool =>
selectedAssistantTools.some(
selectedTool => selectedTool.id === startingTool.id
)
)
for (consttool of toolsToAdd) {
await createAssistantTool({
user_id:item.user_id,
assistant_id:assistantId,
tool_id:tool.id
})
}
for (consttool of toolsToRemove) {
await deleteAssistantTool(assistantId,tool.id)
}
letupdatedAssistant = await updateAssistant(assistantId,rest)
if (image) {
constfilePath = await uploadAssistantImage(updatedAssistant,image)
updatedAssistant = await updateAssistant(assistantId,{
image_path:filePath
})
consturl = (await getAssistantImageFromStorage(filePath)) || ""
if (url) {
constresponse = await fetch(url)
constblob = await response.blob()
constbase64 = await convertBlobToBase64(blob)
setAssistantImages(prev => [
...prev,
{
assistantId:updatedAssistant.id,
path:filePath,
base64,
url
}
])
}
}
await handleWorkspaceUpdates(
startingWorkspaces,
selectedWorkspaces,
assistantId,
deleteAssistantWorkspace,
createAssistantWorkspaces as any,
"assistant_id"
)
return updatedAssistant
},
tools:async (toolId:string,updateState:TablesUpdate<"tools">) => {
constupdatedTool = await updateTool(toolId,updateState)
await handleWorkspaceUpdates(
startingWorkspaces,
selectedWorkspaces,
toolId,
deleteToolWorkspace,
createToolWorkspaces as any,
"tool_id"
)
return updatedTool
},
models:async (modelId:string,updateState:TablesUpdate<"models">) => {
constupdatedModel = await updateModel(modelId,updateState)
await handleWorkspaceUpdates(
startingWorkspaces,
selectedWorkspaces,
modelId,
deleteModelWorkspace,
createModelWorkspaces as any,
"model_id"
)
return updatedModel
}
}
conststateUpdateFunctions = {
chats:setChats,
presets:setPresets,
prompts:setPrompts,
files:setFiles,
collections:setCollections,
assistants:setAssistants,
tools:setTools,
models:setModels
}
consthandleUpdate = async () => {
try {
constupdateFunction = updateFunctions[contentType]
constsetStateFunction = stateUpdateFunctions[contentType]
if (!updateFunction || !setStateFunction) return
if (isTyping) return 
constupdatedItem = await updateFunction(item.id,updateState)
setStateFunction((prevItems:any) =>
prevItems.map((prevItem:any) =>
prevItem.id === item.id ? updatedItem :prevItem
)
)
setIsOpen(false)
toast.success(`${contentType.slice(0,-1)} updated successfully`)
} catch (error) {
toast.error(`Error updating ${contentType.slice(0,-1)}. ${error}`)
}
}
consthandleSelectWorkspace = (workspace:Tables<"workspaces">) => {
setSelectedWorkspaces(prevState => {
constisWorkspaceAlreadySelected = prevState.find(
selectedWorkspace => selectedWorkspace.id === workspace.id
)
if (isWorkspaceAlreadySelected) {
return prevState.filter(
selectedWorkspace => selectedWorkspace.id !== workspace.id
)
} else {
return [...prevState,workspace]
}
})
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (!isTyping && e.key === "Enter" && !e.shiftKey) {
e.preventDefault()
buttonRef.current?.click()
}
}
return (
<Sheet open={isOpen} onOpenChange={setIsOpen}>
<SheetTrigger asChild>{children}</SheetTrigger>
<SheetContent
className="flex min-w-[450px] flex-col justify-between"
side="left"
onKeyDown={handleKeyDown}
>
<div className="grow overflow-auto">
<SheetHeader>
<SheetTitle className="text-2xl font-bold">
Edit {contentType.slice(0,-1)}
</SheetTitle>
</SheetHeader>
<div className="mt-4 space-y-3">
{workspaces.length > 1 && (
<div className="space-y-1">
<Label>Assigned Workspaces</Label>
<AssignWorkspaces
selectedWorkspaces={selectedWorkspaces}
onSelectWorkspace={handleSelectWorkspace}
/>
</div>
)}
{renderInputs(renderState[contentType])}
</div>
</div>
<SheetFooter className="mt-2 flex justify-between">
<SidebarDeleteItem item={item} contentType={contentType} />
<div className="flex grow justify-end space-x-2">
<Button variant="outline" onClick={() => setIsOpen(false)}>
Cancel
</Button>
<Button ref={buttonRef} onClick={handleUpdate}>
Save
</Button>
</div>
</SheetFooter>
</SheetContent>
</Sheet>
)
}

// File: components/sidebar/items/assistants/assistant-item.tsx
import{ChatSettingsForm}from "@/components/ui/chat-settings-form"
import ImagePicker from "@/components/ui/image-picker"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{ChatbotUIContext}from "@/context/context"
import{ASSISTANT_DESCRIPTION_MAX,ASSISTANT_NAME_MAX}from "@/db/limits"
import{Tables}from "@/supabase/types"
import{IconRobotFace}from "@tabler/icons-react"
import Image from "next/image"
import{FC,useContext,useEffect,useState}from "react"
import profile from "react-syntax-highlighter/dist/esm/languages/hljs/profile"
import{SidebarItem}from "../all/sidebar-display-item"
import{AssistantRetrievalSelect}from "./assistant-retrieval-select"
import{AssistantToolSelect}from "./assistant-tool-select"
interfaceAssistantItemProps {
assistant:Tables<"assistants">
}
export constAssistantItem:FC<AssistantItemProps> = ({assistant}) => {
const{selectedWorkspace,assistantImages} = useContext(ChatbotUIContext)
const[name,setName] = useState(assistant.name)
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState(assistant.description)
const[assistantChatSettings,setAssistantChatSettings] = useState({
model:assistant.model,
prompt:assistant.prompt,
temperature:assistant.temperature,
contextLength:assistant.context_length,
includeProfileContext:assistant.include_profile_context,
includeWorkspaceInstructions:assistant.include_workspace_instructions
})
const[selectedImage,setSelectedImage] = useState<File | null>(null)
const[imageLink,setImageLink] = useState("")
useEffect(() => {
constassistantImage =
assistantImages.find(image => image.path === assistant.image_path)
?.base64 || ""
setImageLink(assistantImage)
},[assistant,assistantImages])
consthandleFileSelect = (
file:Tables<"files">,
setSelectedAssistantFiles:React.Dispatch<
React.SetStateAction<Tables<"files">[]>
>
) => {
setSelectedAssistantFiles(prevState => {
constisFileAlreadySelected = prevState.find(
selectedFile => selectedFile.id === file.id
)
if (isFileAlreadySelected) {
return prevState.filter(selectedFile => selectedFile.id !== file.id)
} else {
return [...prevState,file]
}
})
}
consthandleCollectionSelect = (
collection:Tables<"collections">,
setSelectedAssistantCollections:React.Dispatch<
React.SetStateAction<Tables<"collections">[]>
>
) => {
setSelectedAssistantCollections(prevState => {
constisCollectionAlreadySelected = prevState.find(
selectedCollection => selectedCollection.id === collection.id
)
if (isCollectionAlreadySelected) {
return prevState.filter(
selectedCollection => selectedCollection.id !== collection.id
)
} else {
return [...prevState,collection]
}
})
}
consthandleToolSelect = (
tool:Tables<"tools">,
setSelectedAssistantTools:React.Dispatch<
React.SetStateAction<Tables<"tools">[]>
>
) => {
setSelectedAssistantTools(prevState => {
constisToolAlreadySelected = prevState.find(
selectedTool => selectedTool.id === tool.id
)
if (isToolAlreadySelected) {
return prevState.filter(selectedTool => selectedTool.id !== tool.id)
} else {
return [...prevState,tool]
}
})
}
if (!profile) return null
if (!selectedWorkspace) return null
return (
<SidebarItem
item={assistant}
contentType="assistants"
isTyping={isTyping}
icon={
imageLink ? (
<Image
style={{width:"30px",height:"30px"}}
className="rounded"
src={imageLink}
alt={assistant.name}
width={30}
height={30}
/>
) :(
<IconRobotFace
className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
size={30}
/>
)
}
updateState={{
image:selectedImage,
user_id:assistant.user_id,
name,
description,
include_profile_context:assistantChatSettings.includeProfileContext,
include_workspace_instructions:
assistantChatSettings.includeWorkspaceInstructions,
context_length:assistantChatSettings.contextLength,
model:assistantChatSettings.model,
image_path:assistant.image_path,
prompt:assistantChatSettings.prompt,
temperature:assistantChatSettings.temperature
}}
renderInputs={(renderState:{
startingAssistantFiles:Tables<"files">[]
setStartingAssistantFiles:React.Dispatch<
React.SetStateAction<Tables<"files">[]>
>
selectedAssistantFiles:Tables<"files">[]
setSelectedAssistantFiles:React.Dispatch<
React.SetStateAction<Tables<"files">[]>
>
startingAssistantCollections:Tables<"collections">[]
setStartingAssistantCollections:React.Dispatch<
React.SetStateAction<Tables<"collections">[]>
>
selectedAssistantCollections:Tables<"collections">[]
setSelectedAssistantCollections:React.Dispatch<
React.SetStateAction<Tables<"collections">[]>
>
startingAssistantTools:Tables<"tools">[]
setStartingAssistantTools:React.Dispatch<
React.SetStateAction<Tables<"tools">[]>
>
selectedAssistantTools:Tables<"tools">[]
setSelectedAssistantTools:React.Dispatch<
React.SetStateAction<Tables<"tools">[]>
>
}) => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Assistant name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={ASSISTANT_NAME_MAX}
/>
</div>
<div className="space-y-1 pt-2">
<Label>Description</Label>
<Input
placeholder="Assistant description..."
value={description}
onChange={e => setDescription(e.target.value)}
maxLength={ASSISTANT_DESCRIPTION_MAX}
/>
</div>
<div className="space-y-1">
<Label>Image</Label>
<ImagePicker
src={imageLink}
image={selectedImage}
onSrcChange={setImageLink}
onImageChange={setSelectedImage}
width={100}
height={100}
/>
</div>
<ChatSettingsForm
chatSettings={assistantChatSettings as any}
onChangeChatSettings={setAssistantChatSettings}
useAdvancedDropdown={true}
/>
<div className="space-y-1 pt-2">
<Label>Files & Collections</Label>
<AssistantRetrievalSelect
selectedAssistantRetrievalItems={
[
...renderState.selectedAssistantFiles,
...renderState.selectedAssistantCollections
].length === 0
? [
...renderState.startingAssistantFiles,
...renderState.startingAssistantCollections
]
:[
...renderState.startingAssistantFiles.filter(
startingFile =>
![
...renderState.selectedAssistantFiles,
...renderState.selectedAssistantCollections
].some(
selectedFile => selectedFile.id === startingFile.id
)
),
...renderState.selectedAssistantFiles.filter(
selectedFile =>
!renderState.startingAssistantFiles.some(
startingFile => startingFile.id === selectedFile.id
)
),
...renderState.startingAssistantCollections.filter(
startingCollection =>
![
...renderState.selectedAssistantFiles,
...renderState.selectedAssistantCollections
].some(
selectedCollection =>
selectedCollection.id === startingCollection.id
)
),
...renderState.selectedAssistantCollections.filter(
selectedCollection =>
!renderState.startingAssistantCollections.some(
startingCollection =>
startingCollection.id === selectedCollection.id
)
)
]
}
onAssistantRetrievalItemsSelect={item =>
"type" in item
? handleFileSelect(
item,
renderState.setSelectedAssistantFiles
)
:handleCollectionSelect(
item,
renderState.setSelectedAssistantCollections
)
}
/>
</div>
<div className="space-y-1">
<Label>Tools</Label>
<AssistantToolSelect
selectedAssistantTools={
renderState.selectedAssistantTools.length === 0
? renderState.startingAssistantTools
:[
...renderState.startingAssistantTools.filter(
startingTool =>
!renderState.selectedAssistantTools.some(
selectedTool => selectedTool.id === startingTool.id
)
),
...renderState.selectedAssistantTools.filter(
selectedTool =>
!renderState.startingAssistantTools.some(
startingTool => startingTool.id === selectedTool.id
)
)
]
}
onAssistantToolsSelect={tool =>
handleToolSelect(tool,renderState.setSelectedAssistantTools)
}
/>
</div>
</>
)}
/>
)
}

// File: components/sidebar/items/assistants/assistant-retrieval-select.tsx
import{Button}from "@/components/ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuTrigger
}from "@/components/ui/dropdown-menu"
import{Input}from "@/components/ui/input"
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{
IconBooks,
IconChevronDown,
IconCircleCheckFilled
}from "@tabler/icons-react"
import{FileIcon}from "lucide-react"
import{FC,useContext,useEffect,useRef,useState}from "react"
interfaceAssistantRetrievalSelectProps {
selectedAssistantRetrievalItems:Tables<"files">[] | Tables<"collections">[]
onAssistantRetrievalItemsSelect:(
item:Tables<"files"> | Tables<"collections">
) => void
}
export constAssistantRetrievalSelect:FC<AssistantRetrievalSelectProps> = ({
selectedAssistantRetrievalItems,
onAssistantRetrievalItemsSelect
}) => {
const{files,collections} = useContext(ChatbotUIContext)
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
consthandleItemSelect = (item:Tables<"files"> | Tables<"collections">) => {
onAssistantRetrievalItemsSelect(item)
}
if (!files || !collections) return null
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
{selectedAssistantRetrievalItems.length} files selected
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
placeholder="Search files..."
value={search}
onChange={e => setSearch(e.target.value)}
onKeyDown={e => e.stopPropagation()}
/>
{selectedAssistantRetrievalItems
.filter(item =>
item.name.toLowerCase().includes(search.toLowerCase())
)
.map(item => (
<AssistantRetrievalItemOption
key={item.id}
contentType={
item.hasOwnProperty("type") ? "files" :"collections"
}
item={item as Tables<"files"> | Tables<"collections">}
selected={selectedAssistantRetrievalItems.some(
selectedAssistantRetrieval =>
selectedAssistantRetrieval.id === item.id
)}
onSelect={handleItemSelect}
/>
))}
{files
.filter(
file =>
!selectedAssistantRetrievalItems.some(
selectedAssistantRetrieval =>
selectedAssistantRetrieval.id === file.id
) && file.name.toLowerCase().includes(search.toLowerCase())
)
.map(file => (
<AssistantRetrievalItemOption
key={file.id}
item={file}
contentType="files"
selected={selectedAssistantRetrievalItems.some(
selectedAssistantRetrieval =>
selectedAssistantRetrieval.id === file.id
)}
onSelect={handleItemSelect}
/>
))}
{collections
.filter(
collection =>
!selectedAssistantRetrievalItems.some(
selectedAssistantRetrieval =>
selectedAssistantRetrieval.id === collection.id
) && collection.name.toLowerCase().includes(search.toLowerCase())
)
.map(collection => (
<AssistantRetrievalItemOption
key={collection.id}
contentType="collections"
item={collection}
selected={selectedAssistantRetrievalItems.some(
selectedAssistantRetrieval =>
selectedAssistantRetrieval.id === collection.id
)}
onSelect={handleItemSelect}
/>
))}
</DropdownMenuContent>
</DropdownMenu>
)
}
interfaceAssistantRetrievalOptionItemProps {
contentType:"files" | "collections"
item:Tables<"files"> | Tables<"collections">
selected:boolean
onSelect:(item:Tables<"files"> | Tables<"collections">) => void
}
constAssistantRetrievalItemOption:FC<AssistantRetrievalOptionItemProps> = ({
contentType,
item,
selected,
onSelect
}) => {
consthandleSelect = () => {
onSelect(item)
}
return (
<div
className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
onClick={handleSelect}
>
<div className="flex grow items-center truncate">
{contentType === "files" ? (
<div className="mr-2 min-w-[24px]">
<FileIcon type={(item as Tables<"files">).type} size={24} />
</div>
) :(
<div className="mr-2 min-w-[24px]">
<IconBooks size={24} />
</div>
)}
<div className="truncate">{item.name}</div>
</div>
{selected && (
<IconCircleCheckFilled size={20} className="min-w-[30px] flex-none" />
)}
</div>
)
}

// File: components/sidebar/items/assistants/assistant-tool-select.tsx
import{Button}from "@/components/ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuTrigger
}from "@/components/ui/dropdown-menu"
import{Input}from "@/components/ui/input"
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{
IconBolt,
IconChevronDown,
IconCircleCheckFilled
}from "@tabler/icons-react"
import{FC,useContext,useEffect,useRef,useState}from "react"
interfaceAssistantToolSelectProps {
selectedAssistantTools:Tables<"tools">[]
onAssistantToolsSelect:(tool:Tables<"tools">) => void
}
export constAssistantToolSelect:FC<AssistantToolSelectProps> = ({
selectedAssistantTools,
onAssistantToolsSelect
}) => {
const{tools} = useContext(ChatbotUIContext)
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
consthandleToolSelect = (tool:Tables<"tools">) => {
onAssistantToolsSelect(tool)
}
if (!tools) return null
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
{selectedAssistantTools.length} tools selected
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
placeholder="Search tools..."
value={search}
onChange={e => setSearch(e.target.value)}
onKeyDown={e => e.stopPropagation()}
/>
{selectedAssistantTools
.filter(item =>
item.name.toLowerCase().includes(search.toLowerCase())
)
.map(tool => (
<AssistantToolItem
key={tool.id}
tool={tool}
selected={selectedAssistantTools.some(
selectedAssistantRetrieval =>
selectedAssistantRetrieval.id === tool.id
)}
onSelect={handleToolSelect}
/>
))}
{tools
.filter(
tool =>
!selectedAssistantTools.some(
selectedAssistantRetrieval =>
selectedAssistantRetrieval.id === tool.id
) && tool.name.toLowerCase().includes(search.toLowerCase())
)
.map(tool => (
<AssistantToolItem
key={tool.id}
tool={tool}
selected={selectedAssistantTools.some(
selectedAssistantRetrieval =>
selectedAssistantRetrieval.id === tool.id
)}
onSelect={handleToolSelect}
/>
))}
</DropdownMenuContent>
</DropdownMenu>
)
}
interfaceAssistantToolItemProps {
tool:Tables<"tools">
selected:boolean
onSelect:(tool:Tables<"tools">) => void
}
constAssistantToolItem:FC<AssistantToolItemProps> = ({
tool,
selected,
onSelect
}) => {
consthandleSelect = () => {
onSelect(tool)
}
return (
<div
className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
onClick={handleSelect}
>
<div className="flex grow items-center truncate">
<div className="mr-2 min-w-[24px]">
<IconBolt size={24} />
</div>
<div className="truncate">{tool.name}</div>
</div>
{selected && (
<IconCircleCheckFilled size={20} className="min-w-[30px] flex-none" />
)}
</div>
)
}

// File: components/sidebar/items/assistants/create-assistant.tsx
import{SidebarCreateItem}from "@/components/sidebar/items/all/sidebar-create-item"
import{ChatSettingsForm}from "@/components/ui/chat-settings-form"
import ImagePicker from "@/components/ui/image-picker"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{ChatbotUIContext}from "@/context/context"
import{ASSISTANT_DESCRIPTION_MAX,ASSISTANT_NAME_MAX}from "@/db/limits"
import{Tables,TablesInsert}from "@/supabase/types"
import{FC,useContext,useEffect,useState}from "react"
import{AssistantRetrievalSelect}from "./assistant-retrieval-select"
import{AssistantToolSelect}from "./assistant-tool-select"
interfaceCreateAssistantProps {
isOpen:boolean
onOpenChange:(isOpen:boolean) => void
}
export constCreateAssistant:FC<CreateAssistantProps> = ({
isOpen,
onOpenChange
}) => {
const{profile,selectedWorkspace} = useContext(ChatbotUIContext)
const[name,setName] = useState("")
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState("")
const[assistantChatSettings,setAssistantChatSettings] = useState({
model:selectedWorkspace?.default_model,
prompt:selectedWorkspace?.default_prompt,
temperature:selectedWorkspace?.default_temperature,
contextLength:selectedWorkspace?.default_context_length,
includeProfileContext:false,
includeWorkspaceInstructions:false,
embeddingsProvider:selectedWorkspace?.embeddings_provider
})
const[selectedImage,setSelectedImage] = useState<File | null>(null)
const[imageLink,setImageLink] = useState("")
const[selectedAssistantRetrievalItems,setSelectedAssistantRetrievalItems] =
useState<Tables<"files">[] | Tables<"collections">[]>([])
const[selectedAssistantToolItems,setSelectedAssistantToolItems] = useState<
Tables<"tools">[]
>([])
useEffect(() => {
setAssistantChatSettings(prevSettings => {
constpreviousPrompt = prevSettings.prompt || ""
constpreviousPromptParts = previousPrompt.split(". ")
previousPromptParts[0] = name ? `You are ${name}` :""
return {
...prevSettings,
prompt:previousPromptParts.join(". ")
}
})
},[name])
consthandleRetrievalItemSelect = (
item:Tables<"files"> | Tables<"collections">
) => {
setSelectedAssistantRetrievalItems(prevState => {
constisItemAlreadySelected = prevState.find(
selectedItem => selectedItem.id === item.id
)
if (isItemAlreadySelected) {
return prevState.filter(selectedItem => selectedItem.id !== item.id)
} else {
return [...prevState,item]
}
})
}
consthandleToolSelect = (item:Tables<"tools">) => {
setSelectedAssistantToolItems(prevState => {
constisItemAlreadySelected = prevState.find(
selectedItem => selectedItem.id === item.id
)
if (isItemAlreadySelected) {
return prevState.filter(selectedItem => selectedItem.id !== item.id)
} else {
return [...prevState,item]
}
})
}
constcheckIfModelIsToolCompatible = () => {
if (!assistantChatSettings.model) return false
constcompatibleModels = [
"gpt-4-turbo-preview",
"gpt-4-vision-preview",
"gpt-3.5-turbo-1106",
"gpt-4"
]
constisModelCompatible = compatibleModels.includes(
assistantChatSettings.model
)
return isModelCompatible
}
if (!profile) return null
if (!selectedWorkspace) return null
return (
<SidebarCreateItem
contentType="assistants"
createState={
{
image:selectedImage,
user_id:profile.user_id,
name,
description,
include_profile_context:assistantChatSettings.includeProfileContext,
include_workspace_instructions:
assistantChatSettings.includeWorkspaceInstructions,
context_length:assistantChatSettings.contextLength,
model:assistantChatSettings.model,
image_path:"",
prompt:assistantChatSettings.prompt,
temperature:assistantChatSettings.temperature,
embeddings_provider:assistantChatSettings.embeddingsProvider,
files:selectedAssistantRetrievalItems.filter(item =>
item.hasOwnProperty("type")
) as Tables<"files">[],
collections:selectedAssistantRetrievalItems.filter(
item => !item.hasOwnProperty("type")
) as Tables<"collections">[],
tools:selectedAssistantToolItems
} as TablesInsert<"assistants">
}
isOpen={isOpen}
isTyping={isTyping}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Assistant name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={ASSISTANT_NAME_MAX}
/>
</div>
<div className="space-y-1 pt-2">
<Label>Description</Label>
<Input
placeholder="Assistant description..."
value={description}
onChange={e => setDescription(e.target.value)}
maxLength={ASSISTANT_DESCRIPTION_MAX}
/>
</div>
<div className="space-y-1 pt-2">
<Label className="flex space-x-1">
<div>Image</div>
<div className="text-xs">(optional)</div>
</Label>
<ImagePicker
src={imageLink}
image={selectedImage}
onSrcChange={setImageLink}
onImageChange={setSelectedImage}
width={100}
height={100}
/>
</div>
<ChatSettingsForm
chatSettings={assistantChatSettings as any}
onChangeChatSettings={setAssistantChatSettings}
useAdvancedDropdown={true}
/>
<div className="space-y-1 pt-2">
<Label>Files & Collections</Label>
<AssistantRetrievalSelect
selectedAssistantRetrievalItems={selectedAssistantRetrievalItems}
onAssistantRetrievalItemsSelect={handleRetrievalItemSelect}
/>
</div>
{checkIfModelIsToolCompatible() ? (
<div className="space-y-1">
<Label>Tools</Label>
<AssistantToolSelect
selectedAssistantTools={selectedAssistantToolItems}
onAssistantToolsSelect={handleToolSelect}
/>
</div>
) :(
<div className="pt-1 font-semibold">
Model is not compatible with tools.
</div>
)}
</>
)}
onOpenChange={onOpenChange}
/>
)
}

// File: components/sidebar/items/chat/chat-item.tsx
import{ModelIcon}from "@/components/models/model-icon"
import{WithTooltip}from "@/components/ui/with-tooltip"
import{ChatbotUIContext}from "@/context/context"
import{LLM_LIST}from "@/lib/models/llm/llm-list"
import{cn}from "@/lib/utils"
import{Tables}from "@/supabase/types"
import{LLM}from "@/types"
import{IconRobotFace}from "@tabler/icons-react"
import Image from "next/image"
import{useParams,useRouter}from "next/navigation"
import{FC,useContext,useRef}from "react"
import{DeleteChat}from "./delete-chat"
import{UpdateChat}from "./update-chat"
interfaceChatItemProps {
chat:Tables<"chats">
}
export constChatItem:FC<ChatItemProps> = ({chat}) => {
const{
selectedWorkspace,
selectedChat,
availableLocalModels,
assistantImages,
availableOpenRouterModels
} = useContext(ChatbotUIContext)
constrouter = useRouter()
constparams = useParams()
constisActive = params.chatid === chat.id || selectedChat?.id === chat.id
constitemRef = useRef<HTMLDivElement>(null)
consthandleClick = () => {
if (!selectedWorkspace) return
return router.push(`/${selectedWorkspace.id}/chat/${chat.id}`)
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
e.stopPropagation()
itemRef.current?.click()
}
}
constMODEL_DATA = [
...LLM_LIST,
...availableLocalModels,
...availableOpenRouterModels
].find(llm => llm.modelId === chat.model) as LLM
constassistantImage = assistantImages.find(
image => image.assistantId === chat.assistant_id
)?.base64
return (
<div
ref={itemRef}
className={cn(
"hover:bg-accent focus:bg-accent group flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none",
isActive && "bg-accent"
)}
tabIndex={0}
onKeyDown={handleKeyDown}
onClick={handleClick}
>
{chat.assistant_id ? (
assistantImage ? (
<Image
style={{width:"30px",height:"30px"}}
className="rounded"
src={assistantImage}
alt="Assistant image"
width={30}
height={30}
/>
) :(
<IconRobotFace
className="bg-primary text-secondary border-primary rounded border-DEFAULT p-1"
size={30}
/>
)
) :(
<WithTooltip
delayDuration={200}
display={<div>{MODEL_DATA?.modelName}</div>}
trigger={
<ModelIcon provider={MODEL_DATA?.provider} height={30} width={30} />
}
/>
)}
<div className="ml-3 flex-1 truncate text-sm font-semibold">
{chat.name}
</div>
<div
onClick={e => {
e.stopPropagation()
e.preventDefault()
}}
className={`ml-2 flex space-x-2 ${!isActive && "w-11 opacity-0 group-hover:opacity-100"}`}
>
<UpdateChat chat={chat} />
<DeleteChat chat={chat} />
</div>
</div>
)
}

// File: components/sidebar/items/chat/delete-chat.tsx
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
import{deleteChat}from "@/db/chats"
import useHotkey from "@/lib/hooks/use-hotkey"
import{Tables}from "@/supabase/types"
import{IconTrash}from "@tabler/icons-react"
import{FC,useContext,useRef,useState}from "react"
interfaceDeleteChatProps {
chat:Tables<"chats">
}
export constDeleteChat:FC<DeleteChatProps> = ({chat}) => {
useHotkey("Backspace",() => setShowChatDialog(true))
const{setChats} = useContext(ChatbotUIContext)
const{handleNewChat} = useChatHandler()
constbuttonRef = useRef<HTMLButtonElement>(null)
const[showChatDialog,setShowChatDialog] = useState(false)
consthandleDeleteChat = async () => {
await deleteChat(chat.id)
setChats(prevState => prevState.filter(c => c.id !== chat.id))
setShowChatDialog(false)
handleNewChat()
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
buttonRef.current?.click()
}
}
return (
<Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
<DialogTrigger asChild>
<IconTrash className="hover:opacity-50" size={18} />
</DialogTrigger>
<DialogContent onKeyDown={handleKeyDown}>
<DialogHeader>
<DialogTitle>Delete {chat.name}</DialogTitle>
<DialogDescription>
Are you sure you want to delete this chat?
</DialogDescription>
</DialogHeader>
<DialogFooter>
<Button variant="ghost" onClick={() => setShowChatDialog(false)}>
Cancel
</Button>
<Button
ref={buttonRef}
variant="destructive"
onClick={handleDeleteChat}
>
Delete
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)
}

// File: components/sidebar/items/chat/update-chat.tsx
import{Button}from "@/components/ui/button"
import{
Dialog,
DialogContent,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger
}from "@/components/ui/dialog"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{ChatbotUIContext}from "@/context/context"
import{updateChat}from "@/db/chats"
import{Tables}from "@/supabase/types"
import{IconEdit}from "@tabler/icons-react"
import{FC,useContext,useRef,useState}from "react"
interfaceUpdateChatProps {
chat:Tables<"chats">
}
export constUpdateChat:FC<UpdateChatProps> = ({chat}) => {
const{setChats} = useContext(ChatbotUIContext)
constbuttonRef = useRef<HTMLButtonElement>(null)
const[showChatDialog,setShowChatDialog] = useState(false)
const[name,setName] = useState(chat.name)
consthandleUpdateChat = async (e:React.MouseEvent<HTMLButtonElement>) => {
constupdatedChat = await updateChat(chat.id,{
name
})
setChats(prevState =>
prevState.map(c => (c.id === chat.id ? updatedChat :c))
)
setShowChatDialog(false)
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
buttonRef.current?.click()
}
}
return (
<Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
<DialogTrigger asChild>
<IconEdit className="hover:opacity-50" size={18} />
</DialogTrigger>
<DialogContent onKeyDown={handleKeyDown}>
<DialogHeader>
<DialogTitle>Edit Chat</DialogTitle>
</DialogHeader>
<div className="space-y-1">
<Label>Name</Label>
<Input value={name} onChange={e => setName(e.target.value)} />
</div>
<DialogFooter>
<Button variant="ghost" onClick={() => setShowChatDialog(false)}>
Cancel
</Button>
<Button ref={buttonRef} onClick={handleUpdateChat}>
Save
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)
}

// File: components/sidebar/items/collections/collection-file-select.tsx
import{Button}from "@/components/ui/button"
import{
DropdownMenu,
DropdownMenuContent,
DropdownMenuTrigger
}from "@/components/ui/dropdown-menu"
import{FileIcon}from "@/components/ui/file-icon"
import{Input}from "@/components/ui/input"
import{ChatbotUIContext}from "@/context/context"
import{CollectionFile}from "@/types"
import{IconChevronDown,IconCircleCheckFilled}from "@tabler/icons-react"
import{FC,useContext,useEffect,useRef,useState}from "react"
interfaceCollectionFileSelectProps {
selectedCollectionFiles:CollectionFile[]
onCollectionFileSelect:(file:CollectionFile) => void
}
export constCollectionFileSelect:FC<CollectionFileSelectProps> = ({
selectedCollectionFiles,
onCollectionFileSelect
}) => {
const{files} = useContext(ChatbotUIContext)
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
consthandleFileSelect = (file:CollectionFile) => {
onCollectionFileSelect(file)
}
if (!files) return null
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
{selectedCollectionFiles.length} files selected
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
placeholder="Search files..."
value={search}
onChange={e => setSearch(e.target.value)}
onKeyDown={e => e.stopPropagation()}
/>
{selectedCollectionFiles
.filter(file =>
file.name.toLowerCase().includes(search.toLowerCase())
)
.map(file => (
<CollectionFileItem
key={file.id}
file={file}
selected={selectedCollectionFiles.some(
selectedCollectionFile => selectedCollectionFile.id === file.id
)}
onSelect={handleFileSelect}
/>
))}
{files
.filter(
file =>
!selectedCollectionFiles.some(
selectedCollectionFile => selectedCollectionFile.id === file.id
) && file.name.toLowerCase().includes(search.toLowerCase())
)
.map(file => (
<CollectionFileItem
key={file.id}
file={file}
selected={selectedCollectionFiles.some(
selectedCollectionFile => selectedCollectionFile.id === file.id
)}
onSelect={handleFileSelect}
/>
))}
</DropdownMenuContent>
</DropdownMenu>
)
}
interfaceCollectionFileItemProps {
file:CollectionFile
selected:boolean
onSelect:(file:CollectionFile) => void
}
constCollectionFileItem:FC<CollectionFileItemProps> = ({
file,
selected,
onSelect
}) => {
consthandleSelect = () => {
onSelect(file)
}
return (
<div
className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
onClick={handleSelect}
>
<div className="flex grow items-center truncate">
<div className="mr-2 min-w-[24px]">
<FileIcon type={file.type} size={24} />
</div>
<div className="truncate">{file.name}</div>
</div>
{selected && (
<IconCircleCheckFilled size={20} className="min-w-[30px] flex-none" />
)}
</div>
)
}

// File: components/sidebar/items/collections/collection-item.tsx
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{COLLECTION_DESCRIPTION_MAX,COLLECTION_NAME_MAX}from "@/db/limits"
import{Tables}from "@/supabase/types"
import{CollectionFile}from "@/types"
import{IconBooks}from "@tabler/icons-react"
import{FC,useState}from "react"
import{SidebarItem}from "../all/sidebar-display-item"
import{CollectionFileSelect}from "./collection-file-select"
interfaceCollectionItemProps {
collection:Tables<"collections">
}
export constCollectionItem:FC<CollectionItemProps> = ({collection}) => {
const[name,setName] = useState(collection.name)
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState(collection.description)
consthandleFileSelect = (
file:CollectionFile,
setSelectedCollectionFiles:React.Dispatch<
React.SetStateAction<CollectionFile[]>
>
) => {
setSelectedCollectionFiles(prevState => {
constisFileAlreadySelected = prevState.find(
selectedFile => selectedFile.id === file.id
)
if (isFileAlreadySelected) {
return prevState.filter(selectedFile => selectedFile.id !== file.id)
} else {
return [...prevState,file]
}
})
}
return (
<SidebarItem
item={collection}
isTyping={isTyping}
contentType="collections"
icon={<IconBooks size={30} />}
updateState={{
name,
description
}}
renderInputs={(renderState:{
startingCollectionFiles:CollectionFile[]
setStartingCollectionFiles:React.Dispatch<
React.SetStateAction<CollectionFile[]>
>
selectedCollectionFiles:CollectionFile[]
setSelectedCollectionFiles:React.Dispatch<
React.SetStateAction<CollectionFile[]>
>
}) => {
return (
<>
<div className="space-y-1">
<Label>Files</Label>
<CollectionFileSelect
selectedCollectionFiles={
renderState.selectedCollectionFiles.length === 0
? renderState.startingCollectionFiles
:[
...renderState.startingCollectionFiles.filter(
startingFile =>
!renderState.selectedCollectionFiles.some(
selectedFile =>
selectedFile.id === startingFile.id
)
),
...renderState.selectedCollectionFiles.filter(
selectedFile =>
!renderState.startingCollectionFiles.some(
startingFile =>
startingFile.id === selectedFile.id
)
)
]
}
onCollectionFileSelect={file =>
handleFileSelect(file,renderState.setSelectedCollectionFiles)
}
/>
</div>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Collection name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={COLLECTION_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Description</Label>
<Input
placeholder="Collection description..."
value={description}
onChange={e => setDescription(e.target.value)}
maxLength={COLLECTION_DESCRIPTION_MAX}
/>
</div>
</>
)
}}
/>
)
}

// File: components/sidebar/items/collections/create-collection.tsx
import{SidebarCreateItem}from "@/components/sidebar/items/all/sidebar-create-item"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{ChatbotUIContext}from "@/context/context"
import{COLLECTION_DESCRIPTION_MAX,COLLECTION_NAME_MAX}from "@/db/limits"
import{TablesInsert}from "@/supabase/types"
import{CollectionFile}from "@/types"
import{FC,useContext,useState}from "react"
import{CollectionFileSelect}from "./collection-file-select"
interfaceCreateCollectionProps {
isOpen:boolean
onOpenChange:(isOpen:boolean) => void
}
export constCreateCollection:FC<CreateCollectionProps> = ({
isOpen,
onOpenChange
}) => {
const{profile,selectedWorkspace} = useContext(ChatbotUIContext)
const[name,setName] = useState("")
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState("")
const[selectedCollectionFiles,setSelectedCollectionFiles] = useState<
CollectionFile[]
>([])
consthandleFileSelect = (file:CollectionFile) => {
setSelectedCollectionFiles(prevState => {
constisFileAlreadySelected = prevState.find(
selectedFile => selectedFile.id === file.id
)
if (isFileAlreadySelected) {
return prevState.filter(selectedFile => selectedFile.id !== file.id)
} else {
return [...prevState,file]
}
})
}
if (!profile) return null
if (!selectedWorkspace) return null
return (
<SidebarCreateItem
contentType="collections"
createState={
{
collectionFiles:selectedCollectionFiles.map(file => ({
user_id:profile.user_id,
collection_id:"",
file_id:file.id
})),
user_id:profile.user_id,
name,
description
} as TablesInsert<"collections">
}
isOpen={isOpen}
isTyping={isTyping}
onOpenChange={onOpenChange}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Files</Label>
<CollectionFileSelect
selectedCollectionFiles={selectedCollectionFiles}
onCollectionFileSelect={handleFileSelect}
/>
</div>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Collection name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={COLLECTION_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Description</Label>
<Input
placeholder="Collection description..."
value={description}
onChange={e => setDescription(e.target.value)}
maxLength={COLLECTION_DESCRIPTION_MAX}
/>
</div>
</>
)}
/>
)
}

// File: components/sidebar/items/files/create-file.tsx
import{ACCEPTED_FILE_TYPES}from "@/components/chat/chat-hooks/use-select-file-handler"
import{SidebarCreateItem}from "@/components/sidebar/items/all/sidebar-create-item"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{ChatbotUIContext}from "@/context/context"
import{FILE_DESCRIPTION_MAX,FILE_NAME_MAX}from "@/db/limits"
import{TablesInsert}from "@/supabase/types"
import{FC,useContext,useState}from "react"
interfaceCreateFileProps {
isOpen:boolean
onOpenChange:(isOpen:boolean) => void
}
export constCreateFile:FC<CreateFileProps> = ({isOpen,onOpenChange}) => {
const{profile,selectedWorkspace} = useContext(ChatbotUIContext)
const[name,setName] = useState("")
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState("")
const[selectedFile,setSelectedFile] = useState<File | null>(null)
consthandleSelectedFile = async (e:React.ChangeEvent<HTMLInputElement>) => {
if (!e.target.files) return
constfile = e.target.files[0]
if (!file) return
setSelectedFile(file)
constfileNameWithoutExtension = file.name.split(".").slice(0,-1).join(".")
setName(fileNameWithoutExtension)
}
if (!profile) return null
if (!selectedWorkspace) return null
return (
<SidebarCreateItem
contentType="files"
createState={
{
file:selectedFile,
user_id:profile.user_id,
name,
description,
file_path:"",
size:selectedFile?.size || 0,
tokens:0,
type:selectedFile?.type|| 0
} as TablesInsert<"files">
}
isOpen={isOpen}
isTyping={isTyping}
onOpenChange={onOpenChange}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>File</Label>
<Input
type="file"
onChange={handleSelectedFile}
accept={ACCEPTED_FILE_TYPES}
/>
</div>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="File name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={FILE_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Description</Label>
<Input
placeholder="File description..."
value={name}
onChange={e => setDescription(e.target.value)}
maxLength={FILE_DESCRIPTION_MAX}
/>
</div>
</>
)}
/>
)
}

// File: components/sidebar/items/files/file-item.tsx
import{FileIcon}from "@/components/ui/file-icon"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{FILE_DESCRIPTION_MAX,FILE_NAME_MAX}from "@/db/limits"
import{getFileFromStorage}from "@/db/storage/files"
import{Tables}from "@/supabase/types"
import{FC,useState}from "react"
import{SidebarItem}from "../all/sidebar-display-item"
interfaceFileItemProps {
file:Tables<"files">
}
export constFileItem:FC<FileItemProps> = ({file}) => {
const[name,setName] = useState(file.name)
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState(file.description)
constgetLinkAndView = async () => {
constlink = await getFileFromStorage(file.file_path)
window.open(link,"_blank")
}
return (
<SidebarItem
item={file}
isTyping={isTyping}
contentType="files"
icon={<FileIcon type={file.type} size={30} />}
updateState={{name,description}}
renderInputs={() => (
<>
<div
className="cursor-pointer underline hover:opacity-50"
onClick={getLinkAndView}
>
View {file.name}
</div>
<div className="flex flex-col justify-between">
<div>{file.type}</div>
<div>{formatFileSize(file.size)}</div>
<div>{file.tokens.toLocaleString()} tokens</div>
</div>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="File name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={FILE_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Description</Label>
<Input
placeholder="File description..."
value={description}
onChange={e => setDescription(e.target.value)}
maxLength={FILE_DESCRIPTION_MAX}
/>
</div>
</>
)}
/>
)
}
export constformatFileSize = (sizeInBytes:number):string => {
letsize = sizeInBytes
letunit = "bytes"
if (size >= 1024) {
size /= 1024
unit = "KB"
}
if (size >= 1024) {
size /= 1024
unit = "MB"
}
if (size >= 1024) {
size /= 1024
unit = "GB"
}
return `${size.toFixed(2)} ${unit}`
}

// File: components/sidebar/items/folders/delete-folder.tsx
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
import{deleteFolder}from "@/db/folders"
import{supabase}from "@/lib/supabase/browser-client"
import{Tables}from "@/supabase/types"
import{ContentType}from "@/types"
import{IconTrash}from "@tabler/icons-react"
import{FC,useContext,useRef,useState}from "react"
import{toast}from "sonner"
interfaceDeleteFolderProps {
folder:Tables<"folders">
contentType:ContentType
}
export constDeleteFolder:FC<DeleteFolderProps> = ({
folder,
contentType
}) => {
const{
setChats,
setFolders,
setPresets,
setPrompts,
setFiles,
setCollections,
setAssistants,
setTools,
setModels
} = useContext(ChatbotUIContext)
constbuttonRef = useRef<HTMLButtonElement>(null)
const[showFolderDialog,setShowFolderDialog] = useState(false)
conststateUpdateFunctions = {
chats:setChats,
presets:setPresets,
prompts:setPrompts,
files:setFiles,
collections:setCollections,
assistants:setAssistants,
tools:setTools,
models:setModels
}
consthandleDeleteFolderOnly = async () => {
await deleteFolder(folder.id)
setFolders(prevState => prevState.filter(c => c.id !== folder.id))
setShowFolderDialog(false)
constsetStateFunction = stateUpdateFunctions[contentType]
if (!setStateFunction) return
setStateFunction((prevItems:any) =>
prevItems.map((item:any) => {
if (item.folder_id === folder.id) {
return {
...item,
folder_id:null
}
}
return item
})
)
}
consthandleDeleteFolderAndItems = async () => {
constsetStateFunction = stateUpdateFunctions[contentType]
if (!setStateFunction) return
const{error} = await supabase
.from(contentType)
.delete()
.eq("folder_id",folder.id)
if (error) {
toast.error(error.message)
}
setStateFunction((prevItems:any) =>
prevItems.filter((item:any) => item.folder_id !== folder.id)
)
handleDeleteFolderOnly()
}
return (
<Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
<DialogTrigger asChild>
<IconTrash className="hover:opacity-50" size={18} />
</DialogTrigger>
<DialogContent className="min-w-[550px]">
<DialogHeader>
<DialogTitle>Delete {folder.name}</DialogTitle>
<DialogDescription>
Are you sure you want to delete this folder?
</DialogDescription>
</DialogHeader>
<DialogFooter>
<Button variant="ghost" onClick={() => setShowFolderDialog(false)}>
Cancel
</Button>
<Button
ref={buttonRef}
variant="destructive"
onClick={handleDeleteFolderAndItems}
>
Delete Folder & Included Items
</Button>
<Button
ref={buttonRef}
variant="destructive"
onClick={handleDeleteFolderOnly}
>
Delete Folder Only
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)
}

// File: components/sidebar/items/folders/folder-item.tsx
import{cn}from "@/lib/utils"
import{Tables}from "@/supabase/types"
import{ContentType}from "@/types"
import{IconChevronDown,IconChevronRight}from "@tabler/icons-react"
import{FC,useRef,useState}from "react"
import{DeleteFolder}from "./delete-folder"
import{UpdateFolder}from "./update-folder"
interfaceFolderProps {
folder:Tables<"folders">
contentType:ContentType
children:React.ReactNode
onUpdateFolder:(itemId:string,folderId:string | null) => void
}
export constFolder:FC<FolderProps> = ({
folder,
contentType,
children,
onUpdateFolder
}) => {
constitemRef = useRef<HTMLDivElement>(null)
const[isDragOver,setIsDragOver] = useState(false)
const[isExpanded,setIsExpanded] = useState(false)
const[isHovering,setIsHovering] = useState(false)
consthandleDragEnter = (e:React.DragEvent<HTMLDivElement>) => {
e.preventDefault()
setIsDragOver(true)
}
consthandleDragLeave = (e:React.DragEvent<HTMLDivElement>) => {
e.preventDefault()
setIsDragOver(false)
}
consthandleDragOver = (e:React.DragEvent<HTMLDivElement>) => {
e.preventDefault()
setIsDragOver(true)
}
consthandleDrop = (e:React.DragEvent<HTMLDivElement>) => {
e.preventDefault()
setIsDragOver(false)
constitemId = e.dataTransfer.getData("text/plain")
onUpdateFolder(itemId,folder.id)
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
e.stopPropagation()
itemRef.current?.click()
}
}
consthandleClick = (e:React.MouseEvent<HTMLDivElement>) => {
setIsExpanded(!isExpanded)
}
return (
<div
ref={itemRef}
id="folder"
className={cn("rounded focus:outline-none",isDragOver && "bg-accent")}
onDragEnter={handleDragEnter}
onDragLeave={handleDragLeave}
onDragOver={handleDragOver}
onDrop={handleDrop}
onKeyDown={handleKeyDown}
onMouseEnter={() => setIsHovering(true)}
onMouseLeave={() => setIsHovering(false)}
>
<div
tabIndex={0}
className={cn(
"hover:bg-accent focus:bg-accent flex w-full cursor-pointer items-center justify-between rounded p-2 hover:opacity-50 focus:outline-none"
)}
onClick={handleClick}
>
<div className="flex w-full items-center justify-between">
<div className="flex items-center space-x-2">
{isExpanded ? (
<IconChevronDown stroke={3} />
) :(
<IconChevronRight stroke={3} />
)}
<div>{folder.name}</div>
</div>
{isHovering && (
<div
onClick={e => {
e.stopPropagation()
e.preventDefault()
}}
className="ml-2 flex space-x-2"
>
<UpdateFolder folder={folder} />
<DeleteFolder folder={folder} contentType={contentType} />
</div>
)}
</div>
</div>
{isExpanded && (
<div className="ml-5 mt-2 space-y-2 border-l-2 pl-4">{children}</div>
)}
</div>
)
}

// File: components/sidebar/items/folders/update-folder.tsx
import{Button}from "@/components/ui/button"
import{
Dialog,
DialogContent,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger
}from "@/components/ui/dialog"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{ChatbotUIContext}from "@/context/context"
import{updateFolder}from "@/db/folders"
import{Tables}from "@/supabase/types"
import{IconEdit}from "@tabler/icons-react"
import{FC,useContext,useRef,useState}from "react"
interfaceUpdateFolderProps {
folder:Tables<"folders">
}
export constUpdateFolder:FC<UpdateFolderProps> = ({folder}) => {
const{setFolders} = useContext(ChatbotUIContext)
constbuttonRef = useRef<HTMLButtonElement>(null)
const[showFolderDialog,setShowFolderDialog] = useState(false)
const[name,setName] = useState(folder.name)
consthandleUpdateFolder = async (e:React.MouseEvent<HTMLButtonElement>) => {
constupdatedFolder = await updateFolder(folder.id,{
name
})
setFolders(prevState =>
prevState.map(c => (c.id === folder.id ? updatedFolder :c))
)
setShowFolderDialog(false)
}
consthandleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === "Enter") {
buttonRef.current?.click()
}
}
return (
<Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
<DialogTrigger asChild>
<IconEdit className="hover:opacity-50" size={18} />
</DialogTrigger>
<DialogContent onKeyDown={handleKeyDown}>
<DialogHeader>
<DialogTitle>Edit Folder</DialogTitle>
</DialogHeader>
<div className="space-y-1">
<Label>Name</Label>
<Input value={name} onChange={e => setName(e.target.value)} />
</div>
<DialogFooter>
<Button variant="ghost" onClick={() => setShowFolderDialog(false)}>
Cancel
</Button>
<Button ref={buttonRef} onClick={handleUpdateFolder}>
Save
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)
}

// File: components/sidebar/items/models/create-model.tsx
import{SidebarCreateItem}from "@/components/sidebar/items/all/sidebar-create-item"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{ChatbotUIContext}from "@/context/context"
import{MODEL_NAME_MAX}from "@/db/limits"
import{TablesInsert}from "@/supabase/types"
import{FC,useContext,useState}from "react"
interfaceCreateModelProps {
isOpen:boolean
onOpenChange:(isOpen:boolean) => void
}
export constCreateModel:FC<CreateModelProps> = ({isOpen,onOpenChange}) => {
const{profile,selectedWorkspace} = useContext(ChatbotUIContext)
const[isTyping,setIsTyping] = useState(false)
const[apiKey,setApiKey] = useState("")
const[baseUrl,setBaseUrl] = useState("")
const[description,setDescription] = useState("")
const[modelId,setModelId] = useState("")
const[name,setName] = useState("")
const[contextLength,setContextLength] = useState(4096)
if (!profile || !selectedWorkspace) return null
return (
<SidebarCreateItem
contentType="models"
isOpen={isOpen}
isTyping={isTyping}
onOpenChange={onOpenChange}
createState={
{
user_id:profile.user_id,
api_key:apiKey,
base_url:baseUrl,
description,
context_length:contextLength,
model_id:modelId,
name
} as TablesInsert<"models">
}
renderInputs={() => (
<>
<div className="space-y-1.5 text-sm">
<div>Create a custom model.</div>
<div>
Your API <span className="font-bold">*must*</span> be compatible
with the OpenAI SDK.
</div>
</div>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Model name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={MODEL_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Model ID</Label>
<Input
placeholder="Model ID..."
value={modelId}
onChange={e => setModelId(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Base URL</Label>
<Input
placeholder="Base URL..."
value={baseUrl}
onChange={e => setBaseUrl(e.target.value)}
/>
<div className="pt-1 text-xs italic">
Your API must be compatible with the OpenAI SDK.
</div>
</div>
<div className="space-y-1">
<Label>API Key</Label>
<Input
type="password"
placeholder="API Key..."
value={apiKey}
onChange={e => setApiKey(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Max Context Length</Label>
<Input
type="number"
placeholder="4096"
min={0}
value={contextLength}
onChange={e => setContextLength(parseInt(e.target.value))}
/>
</div>
</>
)}
/>
)
}

// File: components/sidebar/items/models/model-item.tsx
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{MODEL_NAME_MAX}from "@/db/limits"
import{Tables,TablesUpdate}from "@/supabase/types"
import{IconSparkles}from "@tabler/icons-react"
import{FC,useState}from "react"
import{SidebarItem}from "../all/sidebar-display-item"
interfaceModelItemProps {
model:Tables<"models">
}
export constModelItem:FC<ModelItemProps> = ({model}) => {
const[isTyping,setIsTyping] = useState(false)
const[apiKey,setApiKey] = useState(model.api_key)
const[baseUrl,setBaseUrl] = useState(model.base_url)
const[description,setDescription] = useState(model.description)
const[modelId,setModelId] = useState(model.model_id)
const[name,setName] = useState(model.name)
const[contextLength,setContextLength] = useState(model.context_length)
return (
<SidebarItem
item={model}
isTyping={isTyping}
contentType="models"
icon={<IconSparkles height={30} width={30} />}
updateState={
{
api_key:apiKey,
base_url:baseUrl,
description,
context_length:contextLength,
model_id:modelId,
name
} as TablesUpdate<"models">
}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Model name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={MODEL_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Model ID</Label>
<Input
placeholder="Model ID..."
value={modelId}
onChange={e => setModelId(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Base URL</Label>
<Input
placeholder="Base URL..."
value={baseUrl}
onChange={e => setBaseUrl(e.target.value)}
/>
<div className="pt-1 text-xs italic">
Your API must be compatible with the OpenAI SDK.
</div>
</div>
<div className="space-y-1">
<Label>API Key</Label>
<Input
type="password"
placeholder="API Key..."
value={apiKey}
onChange={e => setApiKey(e.target.value)}
/>
</div>
<div className="space-y-1">
<Label>Max Context Length</Label>
<Input
type="number"
placeholder="4096"
min={0}
value={contextLength}
onChange={e => setContextLength(parseInt(e.target.value))}
/>
</div>
</>
)}
/>
)
}

// File: components/sidebar/items/presets/create-preset.tsx
import{SidebarCreateItem}from "@/components/sidebar/items/all/sidebar-create-item"
import{ChatSettingsForm}from "@/components/ui/chat-settings-form"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{ChatbotUIContext}from "@/context/context"
import{PRESET_NAME_MAX}from "@/db/limits"
import{TablesInsert}from "@/supabase/types"
import{FC,useContext,useState}from "react"
interfaceCreatePresetProps {
isOpen:boolean
onOpenChange:(isOpen:boolean) => void
}
export constCreatePreset:FC<CreatePresetProps> = ({
isOpen,
onOpenChange
}) => {
const{profile,selectedWorkspace} = useContext(ChatbotUIContext)
const[name,setName] = useState("")
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState("")
const[presetChatSettings,setPresetChatSettings] = useState({
model:selectedWorkspace?.default_model,
prompt:selectedWorkspace?.default_prompt,
temperature:selectedWorkspace?.default_temperature,
contextLength:selectedWorkspace?.default_context_length,
includeProfileContext:selectedWorkspace?.include_profile_context,
includeWorkspaceInstructions:
selectedWorkspace?.include_workspace_instructions,
embeddingsProvider:selectedWorkspace?.embeddings_provider
})
if (!profile) return null
if (!selectedWorkspace) return null
return (
<SidebarCreateItem
contentType="presets"
isOpen={isOpen}
isTyping={isTyping}
onOpenChange={onOpenChange}
createState={
{
user_id:profile.user_id,
name,
description,
include_profile_context:presetChatSettings.includeProfileContext,
include_workspace_instructions:
presetChatSettings.includeWorkspaceInstructions,
context_length:presetChatSettings.contextLength,
model:presetChatSettings.model,
prompt:presetChatSettings.prompt,
temperature:presetChatSettings.temperature,
embeddings_provider:presetChatSettings.embeddingsProvider
} as TablesInsert<"presets">
}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Preset name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={PRESET_NAME_MAX}
/>
</div>
<ChatSettingsForm
chatSettings={presetChatSettings as any}
onChangeChatSettings={setPresetChatSettings}
useAdvancedDropdown={true}
/>
</>
)}
/>
)
}

// File: components/sidebar/items/presets/preset-item.tsx
import{ModelIcon}from "@/components/models/model-icon"
import{ChatSettingsForm}from "@/components/ui/chat-settings-form"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{PRESET_NAME_MAX}from "@/db/limits"
import{LLM_LIST}from "@/lib/models/llm/llm-list"
import{Tables}from "@/supabase/types"
import{FC,useState}from "react"
import{SidebarItem}from "../all/sidebar-display-item"
interfacePresetItemProps {
preset:Tables<"presets">
}
export constPresetItem:FC<PresetItemProps> = ({preset}) => {
const[name,setName] = useState(preset.name)
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState(preset.description)
const[presetChatSettings,setPresetChatSettings] = useState({
model:preset.model,
prompt:preset.prompt,
temperature:preset.temperature,
contextLength:preset.context_length,
includeProfileContext:preset.include_profile_context,
includeWorkspaceInstructions:preset.include_workspace_instructions
})
constmodelDetails = LLM_LIST.find(model => model.modelId === preset.model)
return (
<SidebarItem
item={preset}
isTyping={isTyping}
contentType="presets"
icon={
<ModelIcon
provider={modelDetails?.provider || "custom"}
height={30}
width={30}
/>
}
updateState={{
name,
description,
include_profile_context:presetChatSettings.includeProfileContext,
include_workspace_instructions:
presetChatSettings.includeWorkspaceInstructions,
context_length:presetChatSettings.contextLength,
model:presetChatSettings.model,
prompt:presetChatSettings.prompt,
temperature:presetChatSettings.temperature
}}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Preset name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={PRESET_NAME_MAX}
/>
</div>
<ChatSettingsForm
chatSettings={presetChatSettings as any}
onChangeChatSettings={setPresetChatSettings}
useAdvancedDropdown={true}
/>
</>
)}
/>
)
}

// File: components/sidebar/items/prompts/create-prompt.tsx
import{SidebarCreateItem}from "@/components/sidebar/items/all/sidebar-create-item"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{TextareaAutosize}from "@/components/ui/textarea-autosize"
import{ChatbotUIContext}from "@/context/context"
import{PROMPT_NAME_MAX}from "@/db/limits"
import{TablesInsert}from "@/supabase/types"
import{FC,useContext,useState}from "react"
interfaceCreatePromptProps {
isOpen:boolean
onOpenChange:(isOpen:boolean) => void
}
export constCreatePrompt:FC<CreatePromptProps> = ({
isOpen,
onOpenChange
}) => {
const{profile,selectedWorkspace} = useContext(ChatbotUIContext)
const[isTyping,setIsTyping] = useState(false)
const[name,setName] = useState("")
const[content,setContent] = useState("")
if (!profile) return null
if (!selectedWorkspace) return null
return (
<SidebarCreateItem
contentType="prompts"
isOpen={isOpen}
isTyping={isTyping}
onOpenChange={onOpenChange}
createState={
{
user_id:profile.user_id,
name,
content
} as TablesInsert<"prompts">
}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Prompt name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={PROMPT_NAME_MAX}
onCompositionStart={() => setIsTyping(true)}
onCompositionEnd={() => setIsTyping(false)}
/>
</div>
<div className="space-y-1">
<Label>Prompt</Label>
<TextareaAutosize
placeholder="Prompt content..."
value={content}
onValueChange={setContent}
minRows={6}
maxRows={20}
onCompositionStart={() => setIsTyping(true)}
onCompositionEnd={() => setIsTyping(false)}
/>
</div>
</>
)}
/>
)
}

// File: components/sidebar/items/prompts/prompt-item.tsx
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{TextareaAutosize}from "@/components/ui/textarea-autosize"
import{PROMPT_NAME_MAX}from "@/db/limits"
import{Tables}from "@/supabase/types"
import{IconPencil}from "@tabler/icons-react"
import{FC,useState}from "react"
import{SidebarItem}from "../all/sidebar-display-item"
interfacePromptItemProps {
prompt:Tables<"prompts">
}
export constPromptItem:FC<PromptItemProps> = ({prompt}) => {
const[name,setName] = useState(prompt.name)
const[content,setContent] = useState(prompt.content)
const[isTyping,setIsTyping] = useState(false)
return (
<SidebarItem
item={prompt}
isTyping={isTyping}
contentType="prompts"
icon={<IconPencil size={30} />}
updateState={{name,content}}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Prompt name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={PROMPT_NAME_MAX}
onCompositionStart={() => setIsTyping(true)}
onCompositionEnd={() => setIsTyping(false)}
/>
</div>
<div className="space-y-1">
<Label>Prompt</Label>
<TextareaAutosize
placeholder="Prompt..."
value={content}
onValueChange={setContent}
minRows={6}
maxRows={20}
onCompositionStart={() => setIsTyping(true)}
onCompositionEnd={() => setIsTyping(false)}
/>
</div>
</>
)}
/>
)
}

// File: components/sidebar/items/tools/create-tool.tsx
import{SidebarCreateItem}from "@/components/sidebar/items/all/sidebar-create-item"
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{TextareaAutosize}from "@/components/ui/textarea-autosize"
import{ChatbotUIContext}from "@/context/context"
import{TOOL_DESCRIPTION_MAX,TOOL_NAME_MAX}from "@/db/limits"
import{validateOpenAPI}from "@/lib/openapi-conversion"
import{TablesInsert}from "@/supabase/types"
import{FC,useContext,useState}from "react"
interfaceCreateToolProps {
isOpen:boolean
onOpenChange:(isOpen:boolean) => void
}
export constCreateTool:FC<CreateToolProps> = ({isOpen,onOpenChange}) => {
const{profile,selectedWorkspace} = useContext(ChatbotUIContext)
const[name,setName] = useState("")
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState("")
const[url,setUrl] = useState("")
const[customHeaders,setCustomHeaders] = useState("")
const[schema,setSchema] = useState("")
const[schemaError,setSchemaError] = useState("")
if (!profile || !selectedWorkspace) return null
return (
<SidebarCreateItem
contentType="tools"
createState={
{
user_id:profile.user_id,
name,
description,
url,
custom_headers:customHeaders,
schema
} as TablesInsert<"tools">
}
isOpen={isOpen}
isTyping={isTyping}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Tool name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={TOOL_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Description</Label>
<Input
placeholder="Tool description..."
value={description}
onChange={e => setDescription(e.target.value)}
maxLength={TOOL_DESCRIPTION_MAX}
/>
</div>
{/* <div className="space-y-1">
<Label>URL</Label>
<Input
placeholder="Tool url..."
value={url}
onChange={e => setUrl(e.target.value)}
/>
</div> */}
{/* <div className="space-y-3 pt-4 pb-3">
<div className="space-x-2 flex items-center">
<Checkbox />
<Label>Web Browsing</Label>
</div>
<div className="space-x-2 flex items-center">
<Checkbox />
<Label>Image Generation</Label>
</div>
<div className="space-x-2 flex items-center">
<Checkbox />
<Label>Code Interpreter</Label>
</div>
</div> */}
<div className="space-y-1">
<Label>Custom Headers</Label>
<TextareaAutosize
placeholder={`{"X-api-key":"1234567890"}`}
value={customHeaders}
onValueChange={setCustomHeaders}
minRows={1}
/>
</div>
<div className="space-y-1">
<Label>Schema</Label>
<TextareaAutosize
placeholder={`{
"openapi":"3.1.0",
"info":{
"title":"Get weather data",
"description":"Retrieves current weather data for a location.",
"version":"v1.0.0"
},
"servers":[
{
"url":"https:
}
],
"paths":{
"/location":{
"get":{
"description":"Get temperature for a specific location",
"operationId":"GetCurrentWeather",
"parameters":[
{
"name":"location",
"in":"query",
"description":"The city and state to retrieve the weather for",
"required":true,
"schema":{
"type":"string"
}
}
],
"deprecated":false
}
}
},
"components":{
"schemas":{}
}
}`}
value={schema}
onValueChange={value => {
setSchema(value)
try {
constparsedSchema = JSON.parse(value)
validateOpenAPI(parsedSchema)
.then(() => setSchemaError("")) 
.catch(error => setSchemaError(error.message)) 
} catch (error) {
setSchemaError("Invalid JSON format") 
}
}}
minRows={15}
/>
<div className="text-xs text-red-500">{schemaError}</div>
</div>
</>
)}
onOpenChange={onOpenChange}
/>
)
}

// File: components/sidebar/items/tools/tool-item.tsx
import{Input}from "@/components/ui/input"
import{Label}from "@/components/ui/label"
import{TextareaAutosize}from "@/components/ui/textarea-autosize"
import{TOOL_DESCRIPTION_MAX,TOOL_NAME_MAX}from "@/db/limits"
import{validateOpenAPI}from "@/lib/openapi-conversion"
import{Tables}from "@/supabase/types"
import{IconBolt}from "@tabler/icons-react"
import{FC,useState}from "react"
import{SidebarItem}from "../all/sidebar-display-item"
interfaceToolItemProps {
tool:Tables<"tools">
}
export constToolItem:FC<ToolItemProps> = ({tool}) => {
const[name,setName] = useState(tool.name)
const[isTyping,setIsTyping] = useState(false)
const[description,setDescription] = useState(tool.description)
const[url,setUrl] = useState(tool.url)
const[customHeaders,setCustomHeaders] = useState(
tool.custom_headers as string
)
const[schema,setSchema] = useState(tool.schema as string)
const[schemaError,setSchemaError] = useState("")
return (
<SidebarItem
item={tool}
isTyping={isTyping}
contentType="tools"
icon={<IconBolt size={30} />}
updateState={{
name,
description,
url,
custom_headers:customHeaders,
schema
}}
renderInputs={() => (
<>
<div className="space-y-1">
<Label>Name</Label>
<Input
placeholder="Tool name..."
value={name}
onChange={e => setName(e.target.value)}
maxLength={TOOL_NAME_MAX}
/>
</div>
<div className="space-y-1">
<Label>Description</Label>
<Input
placeholder="Tool description..."
value={description}
onChange={e => setDescription(e.target.value)}
maxLength={TOOL_DESCRIPTION_MAX}
/>
</div>
{/* <div className="space-y-1">
<Label>URL</Label>
<Input
placeholder="Tool url..."
value={url}
onChange={e => setUrl(e.target.value)}
/>
</div> */}
{/* <div className="space-y-3 pt-4 pb-3">
<div className="space-x-2 flex items-center">
<Checkbox />
<Label>Web Browsing</Label>
</div>
<div className="space-x-2 flex items-center">
<Checkbox />
<Label>Image Generation</Label>
</div>
<div className="space-x-2 flex items-center">
<Checkbox />
<Label>Code Interpreter</Label>
</div>
</div> */}
<div className="space-y-1">
<Label>Custom Headers</Label>
<TextareaAutosize
placeholder={`{"X-api-key":"1234567890"}`}
value={customHeaders}
onValueChange={setCustomHeaders}
minRows={1}
/>
</div>
<div className="space-y-1">
<Label>Schema</Label>
<TextareaAutosize
placeholder={`{
"openapi":"3.1.0",
"info":{
"title":"Get weather data",
"description":"Retrieves current weather data for a location.",
"version":"v1.0.0"
},
"servers":[
{
"url":"https:
}
],
"paths":{
"/location":{
"get":{
"description":"Get temperature for a specific location",
"operationId":"GetCurrentWeather",
"parameters":[
{
"name":"location",
"in":"query",
"description":"The city and state to retrieve the weather for",
"required":true,
"schema":{
"type":"string"
}
}
],
"deprecated":false
}
}
},
"components":{
"schemas":{}
}
}`}
value={schema}
onValueChange={value => {
setSchema(value)
try {
constparsedSchema = JSON.parse(value)
validateOpenAPI(parsedSchema)
.then(() => setSchemaError("")) 
.catch(error => setSchemaError(error.message)) 
} catch (error) {
setSchemaError("Invalid JSON format") 
}
}}
minRows={15}
/>
<div className="text-xs text-red-500">{schemaError}</div>
</div>
</>
)}
/>
)
}

// File: components/sidebar/sidebar-content.tsx
import{Tables}from "@/supabase/types"
import{ContentType,DataListType}from "@/types"
import{FC,useState}from "react"
import{SidebarCreateButtons}from "./sidebar-create-buttons"
import{SidebarDataList}from "./sidebar-data-list"
import{SidebarSearch}from "./sidebar-search"
interfaceSidebarContentProps {
contentType:ContentType
data:DataListType
folders:Tables<"folders">[]
}
export constSidebarContent:FC<SidebarContentProps> = ({
contentType,
data,
folders
}) => {
const[searchTerm,setSearchTerm] = useState("")
constfilteredData:any = data.filter(item =>
item.name.toLowerCase().includes(searchTerm.toLowerCase())
)
return (

<div className="flex max-h-[calc(100%-50px)] grow flex-col">
<div className="mt-2 flex items-center">
<SidebarCreateButtons
contentType={contentType}
hasData={data.length > 0}
/>
</div>
<div className="mt-2">
<SidebarSearch
contentType={contentType}
searchTerm={searchTerm}
setSearchTerm={setSearchTerm}
/>
</div>
<SidebarDataList
contentType={contentType}
data={filteredData}
folders={folders}
/>
</div>
)
}

// File: components/sidebar/sidebar-create-buttons.tsx
import{useChatHandler}from "@/components/chat/chat-hooks/use-chat-handler"
import{ChatbotUIContext}from "@/context/context"
import{createFolder}from "@/db/folders"
import{ContentType}from "@/types"
import{IconFolderPlus,IconPlus}from "@tabler/icons-react"
import{FC,useContext,useState}from "react"
import{Button}from "../ui/button"
import{CreateAssistant}from "./items/assistants/create-assistant"
import{CreateCollection}from "./items/collections/create-collection"
import{CreateFile}from "./items/files/create-file"
import{CreateModel}from "./items/models/create-model"
import{CreatePreset}from "./items/presets/create-preset"
import{CreatePrompt}from "./items/prompts/create-prompt"
import{CreateTool}from "./items/tools/create-tool"
interfaceSidebarCreateButtonsProps {
contentType:ContentType
hasData:boolean
}
export constSidebarCreateButtons:FC<SidebarCreateButtonsProps> = ({
contentType,
hasData
}) => {
const{profile,selectedWorkspace,folders,setFolders} =
useContext(ChatbotUIContext)
const{handleNewChat} = useChatHandler()
const[isCreatingPrompt,setIsCreatingPrompt] = useState(false)
const[isCreatingPreset,setIsCreatingPreset] = useState(false)
const[isCreatingFile,setIsCreatingFile] = useState(false)
const[isCreatingCollection,setIsCreatingCollection] = useState(false)
const[isCreatingAssistant,setIsCreatingAssistant] = useState(false)
const[isCreatingTool,setIsCreatingTool] = useState(false)
const[isCreatingModel,setIsCreatingModel] = useState(false)
consthandleCreateFolder = async () => {
if (!profile) return
if (!selectedWorkspace) return
constcreatedFolder = await createFolder({
user_id:profile.user_id,
workspace_id:selectedWorkspace.id,
name:"New Folder",
description:"",
type:contentType
})
setFolders([...folders,createdFolder])
}
constgetCreateFunction = () => {
switch (contentType) {
case "chats":
return async () => {
handleNewChat()
}
case "presets":
return async () => {
setIsCreatingPreset(true)
}
case "prompts":
return async () => {
setIsCreatingPrompt(true)
}
case "files":
return async () => {
setIsCreatingFile(true)
}
case "collections":
return async () => {
setIsCreatingCollection(true)
}
case "assistants":
return async () => {
setIsCreatingAssistant(true)
}
case "tools":
return async () => {
setIsCreatingTool(true)
}
case "models":
return async () => {
setIsCreatingModel(true)
}
default:
break
}
}
return (
<div className="flex w-full space-x-2">
<Button className="flex h-[36px] grow" onClick={getCreateFunction()}>
<IconPlus className="mr-1" size={20} />
New{" "}
{contentType.charAt(0).toUpperCase() +
contentType.slice(1,contentType.length - 1)}
</Button>
{hasData && (
<Button className="size-[36px] p-1" onClick={handleCreateFolder}>
<IconFolderPlus size={20} />
</Button>
)}
{isCreatingPrompt && (
<CreatePrompt
isOpen={isCreatingPrompt}
onOpenChange={setIsCreatingPrompt}
/>
)}
{isCreatingPreset && (
<CreatePreset
isOpen={isCreatingPreset}
onOpenChange={setIsCreatingPreset}
/>
)}
{isCreatingFile && (
<CreateFile isOpen={isCreatingFile} onOpenChange={setIsCreatingFile} />
)}
{isCreatingCollection && (
<CreateCollection
isOpen={isCreatingCollection}
onOpenChange={setIsCreatingCollection}
/>
)}
{isCreatingAssistant && (
<CreateAssistant
isOpen={isCreatingAssistant}
onOpenChange={setIsCreatingAssistant}
/>
)}
{isCreatingTool && (
<CreateTool isOpen={isCreatingTool} onOpenChange={setIsCreatingTool} />
)}
{isCreatingModel && (
<CreateModel
isOpen={isCreatingModel}
onOpenChange={setIsCreatingModel}
/>
)}
</div>
)
}

// File: components/sidebar/sidebar-data-list.tsx
import{ChatbotUIContext}from "@/context/context"
import{updateAssistant}from "@/db/assistants"
import{updateChat}from "@/db/chats"
import{updateCollection}from "@/db/collections"
import{updateFile}from "@/db/files"
import{updateModel}from "@/db/models"
import{updatePreset}from "@/db/presets"
import{updatePrompt}from "@/db/prompts"
import{updateTool}from "@/db/tools"
import{cn}from "@/lib/utils"
import{Tables}from "@/supabase/types"
import{ContentType,DataItemType,DataListType}from "@/types"
import{FC,useContext,useEffect,useRef,useState}from "react"
import{Separator}from "../ui/separator"
import{AssistantItem}from "./items/assistants/assistant-item"
import{ChatItem}from "./items/chat/chat-item"
import{CollectionItem}from "./items/collections/collection-item"
import{FileItem}from "./items/files/file-item"
import{Folder}from "./items/folders/folder-item"
import{ModelItem}from "./items/models/model-item"
import{PresetItem}from "./items/presets/preset-item"
import{PromptItem}from "./items/prompts/prompt-item"
import{ToolItem}from "./items/tools/tool-item"
interfaceSidebarDataListProps {
contentType:ContentType
data:DataListType
folders:Tables<"folders">[]
}
export constSidebarDataList:FC<SidebarDataListProps> = ({
contentType,
data,
folders
}) => {
const{
setChats,
setPresets,
setPrompts,
setFiles,
setCollections,
setAssistants,
setTools,
setModels
} = useContext(ChatbotUIContext)
constdivRef = useRef<HTMLDivElement>(null)
const[isOverflowing,setIsOverflowing] = useState(false)
const[isDragOver,setIsDragOver] = useState(false)
constgetDataListComponent = (
contentType:ContentType,
item:DataItemType
) => {
switch (contentType) {
case "chats":
return <ChatItem key={item.id} chat={item as Tables<"chats">} />
case "presets":
return <PresetItem key={item.id} preset={item as Tables<"presets">} />
case "prompts":
return <PromptItem key={item.id} prompt={item as Tables<"prompts">} />
case "files":
return <FileItem key={item.id} file={item as Tables<"files">} />
case "collections":
return (
<CollectionItem
key={item.id}
collection={item as Tables<"collections">}
/>
)
case "assistants":
return (
<AssistantItem
key={item.id}
assistant={item as Tables<"assistants">}
/>
)
case "tools":
return <ToolItem key={item.id} tool={item as Tables<"tools">} />
case "models":
return <ModelItem key={item.id} model={item as Tables<"models">} />
default:
return null
}
}
constgetSortedData = (
data:any,
dateCategory:"Today" | "Yesterday" | "Previous Week" | "Older"
) => {
constnow = new Date()
consttodayStart = new Date(now.setHours(0,0,0,0))
constyesterdayStart = new Date(
new Date().setDate(todayStart.getDate() - 1)
)
constoneWeekAgoStart = new Date(
new Date().setDate(todayStart.getDate() - 7)
)
return data
.filter((item:any) => {
constitemDate = new Date(item.updated_at || item.created_at)
switch (dateCategory) {
case "Today":
return itemDate >= todayStart
case "Yesterday":
return itemDate >= yesterdayStart && itemDate < todayStart
case "Previous Week":
return itemDate >= oneWeekAgoStart && itemDate < yesterdayStart
case "Older":
return itemDate < oneWeekAgoStart
default:
return true
}
})
.sort(
(
a:{updated_at:string;created_at:string},
b:{updated_at:string;created_at:string}
) =>
new Date(b.updated_at || b.created_at).getTime() -
new Date(a.updated_at || a.created_at).getTime()
)
}
constupdateFunctions = {
chats:updateChat,
presets:updatePreset,
prompts:updatePrompt,
files:updateFile,
collections:updateCollection,
assistants:updateAssistant,
tools:updateTool,
models:updateModel
}
conststateUpdateFunctions = {
chats:setChats,
presets:setPresets,
prompts:setPrompts,
files:setFiles,
collections:setCollections,
assistants:setAssistants,
tools:setTools,
models:setModels
}
constupdateFolder = async (itemId:string,folderId:string | null) => {
constitem:any = data.find(item => item.id === itemId)
if (!item) return null
constupdateFunction = updateFunctions[contentType]
constsetStateFunction = stateUpdateFunctions[contentType]
if (!updateFunction || !setStateFunction) return
constupdatedItem = await updateFunction(item.id,{
folder_id:folderId
})
setStateFunction((items:any) =>
items.map((item:any) =>
item.id === updatedItem.id ? updatedItem :item
)
)
}
consthandleDragEnter = (e:React.DragEvent<HTMLDivElement>) => {
e.preventDefault()
setIsDragOver(true)
}
consthandleDragLeave = (e:React.DragEvent<HTMLDivElement>) => {
e.preventDefault()
setIsDragOver(false)
}
consthandleDragStart = (e:React.DragEvent<HTMLDivElement>,id:string) => {
e.dataTransfer.setData("text/plain",id)
}
consthandleDragOver = (e:React.DragEvent<HTMLDivElement>) => {
e.preventDefault()
}
consthandleDrop = (e:React.DragEvent<HTMLDivElement>) => {
e.preventDefault()
consttarget = e.target as Element
if (!target.closest("#folder")) {
constitemId = e.dataTransfer.getData("text/plain")
updateFolder(itemId,null)
}
setIsDragOver(false)
}
useEffect(() => {
if (divRef.current) {
setIsOverflowing(
divRef.current.scrollHeight > divRef.current.clientHeight
)
}
},[data])
constdataWithFolders = data.filter(item => item.folder_id)
constdataWithoutFolders = data.filter(item => item.folder_id === null)
return (
<>
<div
ref={divRef}
className="mt-2 flex flex-col overflow-auto"
onDrop={handleDrop}
>
{data.length === 0 && (
<div className="flex grow flex-col items-center justify-center">
<div className=" text-centertext-muted-foreground p-8 text-lg italic">
No {contentType}.
</div>
</div>
)}
{(dataWithFolders.length > 0 || dataWithoutFolders.length > 0) && (
<div
className={`h-full ${
isOverflowing ? "w-[calc(100%-8px)]" :"w-full"
} space-y-2 pt-2 ${isOverflowing ? "mr-2" :""}`}
>
{folders.map(folder => (
<Folder
key={folder.id}
folder={folder}
onUpdateFolder={updateFolder}
contentType={contentType}
>
{dataWithFolders
.filter(item => item.folder_id === folder.id)
.map(item => (
<div
key={item.id}
draggable
onDragStart={e => handleDragStart(e,item.id)}
>
{getDataListComponent(contentType,item)}
</div>
))}
</Folder>
))}
{folders.length > 0 && <Separator />}
{contentType === "chats" ? (
<>
{["Today","Yesterday","Previous Week","Older"].map(
dateCategory => {
constsortedData = getSortedData(
dataWithoutFolders,
dateCategory as
| "Today"
| "Yesterday"
| "Previous Week"
| "Older"
)
return (
sortedData.length > 0 && (
<div key={dateCategory} className="pb-2">
<div className="text-muted-foreground mb-1 text-sm font-bold">
{dateCategory}
</div>
<div
className={cn(
"flex grow flex-col",
isDragOver && "bg-accent"
)}
onDrop={handleDrop}
onDragEnter={handleDragEnter}
onDragLeave={handleDragLeave}
onDragOver={handleDragOver}
>
{sortedData.map((item:any) => (
<div
key={item.id}
draggable
onDragStart={e => handleDragStart(e,item.id)}
>
{getDataListComponent(contentType,item)}
</div>
))}
</div>
</div>
)
)
}
)}
</>
) :(
<div
className={cn("flex grow flex-col",isDragOver && "bg-accent")}
onDrop={handleDrop}
onDragEnter={handleDragEnter}
onDragLeave={handleDragLeave}
onDragOver={handleDragOver}
>
{dataWithoutFolders.map(item => {
return (
<div
key={item.id}
draggable
onDragStart={e => handleDragStart(e,item.id)}
>
{getDataListComponent(contentType,item)}
</div>
)
})}
</div>
)}
</div>
)}
</div>
<div
className={cn("flex grow",isDragOver && "bg-accent")}
onDrop={handleDrop}
onDragEnter={handleDragEnter}
onDragLeave={handleDragLeave}
onDragOver={handleDragOver}
/>
</>
)
}

// File: components/sidebar/sidebar-search.tsx
import{ContentType}from "@/types"
import{FC}from "react"
import{Input}from "../ui/input"
interfaceSidebarSearchProps {
contentType:ContentType
searchTerm:string
setSearchTerm:Function
}
export constSidebarSearch:FC<SidebarSearchProps> = ({
contentType,
searchTerm,
setSearchTerm
}) => {
return (
<Input
placeholder={`Search ${contentType}...`}
value={searchTerm}
onChange={e => setSearchTerm(e.target.value)}
/>
)
}

// File: components/sidebar/sidebar-switch-item.tsx
import{ContentType}from "@/types"
import{FC}from "react"
import{TabsTrigger}from "../ui/tabs"
import{WithTooltip}from "../ui/with-tooltip"
interfaceSidebarSwitchItemProps {
contentType:ContentType
icon:React.ReactNode
onContentTypeChange:(contentType:ContentType) => void
}
export constSidebarSwitchItem:FC<SidebarSwitchItemProps> = ({
contentType,
icon,
onContentTypeChange
}) => {
return (
<WithTooltip
display={
<div>{contentType[0].toUpperCase() + contentType.substring(1)}</div>
}
trigger={
<TabsTrigger
className="hover:opacity-50"
value={contentType}
onClick={() => onContentTypeChange(contentType as ContentType)}
>
{icon}
</TabsTrigger>
}
/>
)
}

// File: components/sidebar/sidebar-switcher.tsx
import{ContentType}from "@/types"
import{
IconAdjustmentsHorizontal,
IconBolt,
IconBooks,
IconFile,
IconMessage,
IconPencil,
IconRobotFace,
IconSparkles
}from "@tabler/icons-react"
import{FC}from "react"
import{TabsList}from "../ui/tabs"
import{WithTooltip}from "../ui/with-tooltip"
import{ProfileSettings}from "../utility/profile-settings"
import{SidebarSwitchItem}from "./sidebar-switch-item"
export constSIDEBAR_ICON_SIZE = 28
interfaceSidebarSwitcherProps {
onContentTypeChange:(contentType:ContentType) => void
}
export constSidebarSwitcher:FC<SidebarSwitcherProps> = ({
onContentTypeChange
}) => {
return (
<div className="flex flex-col justify-between border-r-2 pb-5">
<TabsList className="bg-background grid h-[495px] grid-rows-8">
{" "}
{}
<SidebarSwitchItem
icon={<IconMessage size={SIDEBAR_ICON_SIZE} />}
contentType="chats"
onContentTypeChange={onContentTypeChange}
/>
<SidebarSwitchItem
icon={<IconAdjustmentsHorizontal size={SIDEBAR_ICON_SIZE} />}
contentType="presets"
onContentTypeChange={onContentTypeChange}
/>
<SidebarSwitchItem
icon={<IconPencil size={SIDEBAR_ICON_SIZE} />}
contentType="prompts"
onContentTypeChange={onContentTypeChange}
/>
<SidebarSwitchItem
icon={<IconSparkles size={SIDEBAR_ICON_SIZE} />}
contentType="models"
onContentTypeChange={onContentTypeChange}
/>
<SidebarSwitchItem
icon={<IconFile size={SIDEBAR_ICON_SIZE} />}
contentType="files"
onContentTypeChange={onContentTypeChange}
/>
<SidebarSwitchItem
icon={<IconBooks size={SIDEBAR_ICON_SIZE} />}
contentType="collections"
onContentTypeChange={onContentTypeChange}
/>
<SidebarSwitchItem
icon={<IconRobotFace size={SIDEBAR_ICON_SIZE} />}
contentType="assistants"
onContentTypeChange={onContentTypeChange}
/>
<SidebarSwitchItem
icon={<IconBolt size={SIDEBAR_ICON_SIZE} />}
contentType="tools"
onContentTypeChange={onContentTypeChange}
/>
</TabsList>
<div className="flex flex-col items-center space-y-4">
<WithTooltip
display={<div>Profile Settings</div>}
trigger={<ProfileSettings />}
/>
</div>
</div>
)
}

// File: components/sidebar/sidebar.tsx
import{ChatbotUIContext}from "@/context/context"
import{Tables}from "@/supabase/types"
import{ContentType}from "@/types"
import{FC,useContext}from "react"
import{SIDEBAR_WIDTH}from "../ui/dashboard"
import{TabsContent}from "../ui/tabs"
import{WorkspaceSwitcher}from "../utility/workspace-switcher"
import{WorkspaceSettings}from "../workspace/workspace-settings"
import{OAuthIntegrations}from "../workspace/oauth-integrations"
import{SidebarContent}from "./sidebar-content"
interfaceSidebarProps {
contentType:ContentType
showSidebar:boolean
}
export constSidebar:FC<SidebarProps> = ({contentType,showSidebar}) => {
const{
folders,
chats,
presets,
prompts,
files,
collections,
assistants,
tools,
models
} = useContext(ChatbotUIContext)
constchatFolders = folders.filter(folder => folder.type=== "chats")
constpresetFolders = folders.filter(folder => folder.type=== "presets")
constpromptFolders = folders.filter(folder => folder.type=== "prompts")
constfilesFolders = folders.filter(folder => folder.type=== "files")
constcollectionFolders = folders.filter(
folder => folder.type=== "collections"
)
constassistantFolders = folders.filter(
folder => folder.type=== "assistants"
)
consttoolFolders = folders.filter(folder => folder.type=== "tools")
constmodelFolders = folders.filter(folder => folder.type=== "models")
constrenderSidebarContent = (
contentType:ContentType,
data:any[],
folders:Tables<"folders">[]
) => {
return (
<SidebarContent contentType={contentType} data={data} folders={folders} />
)
}
return (
<TabsContent
className="m-0 w-full space-y-2"
style={{
minWidth:showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` :"0px",
maxWidth:showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` :"0px",
width:showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` :"0px"
}}
value={contentType}
>
<div className="flex h-full flex-col p-3">
<div className="flex items-center border-b-2 pb-2">
<WorkspaceSwitcher />
<WorkspaceSettings />
<OAuthIntegrations />
</div>
{(() => {
switch (contentType) {
case "chats":
return renderSidebarContent("chats",chats,chatFolders)
case "presets":
return renderSidebarContent("presets",presets,presetFolders)
case "prompts":
return renderSidebarContent("prompts",prompts,promptFolders)
case "files":
return renderSidebarContent("files",files,filesFolders)
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
return renderSidebarContent("tools",tools,toolFolders)
case "models":
return renderSidebarContent("models",models,modelFolders)
default:
}
})()}
</div>
</TabsContent>
)
}

// File: components/ui/accordion.tsx
"use client"
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import{ChevronDown}from "lucide-react"
import{cn}from "@/lib/utils"
constAccordion = AccordionPrimitive.Root
constAccordionItem = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({className,...props},ref) => (
<AccordionPrimitive.Item
ref={ref}
className={cn("border-b",className)}
{...props}
/>
))
AccordionItem.displayName = "AccordionItem"
constAccordionTrigger = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({className,children,...props},ref) => (
<AccordionPrimitive.Header className="flex">
<AccordionPrimitive.Trigger
ref={ref}
className={cn(
"flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
className
)}
{...props}
>
{children}
<ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName
constAccordionContent = React.forwardRef<
React.ElementRef<typeof AccordionPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({className,children,...props},ref) => (
<AccordionPrimitive.Content
ref={ref}
className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all"
{...props}
>
<div className={cn("pb-4 pt-0",className)}>{children}</div>
</AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName
export {Accordion,AccordionItem,AccordionTrigger,AccordionContent}

// File: components/ui/advanced-settings.tsx
import{
Collapsible,
CollapsibleContent,
CollapsibleTrigger
}from "@/components/ui/collapsible"
import{IconChevronDown,IconChevronRight}from "@tabler/icons-react"
import{FC,useState}from "react"
interfaceAdvancedSettingsProps {
children:React.ReactNode
}
export constAdvancedSettings:FC<AdvancedSettingsProps> = ({children}) => {
const[isOpen,setIsOpen] = useState(
false

)
consthandleOpenChange = (isOpen:boolean) => {
setIsOpen(isOpen)

}
return (
<Collapsible className="pt-2" open={isOpen} onOpenChange={handleOpenChange}>
<CollapsibleTrigger className="hover:opacity-50">
<div className="flex items-center font-bold">
<div className="mr-1">Advanced Settings</div>
{isOpen ? (
<IconChevronDown size={20} stroke={3} />
) :(
<IconChevronRight size={20} stroke={3} />
)}
</div>
</CollapsibleTrigger>
<CollapsibleContent className="mt-4">{children}</CollapsibleContent>
</Collapsible>
)
}

// File: components/ui/alert-dialog.tsx
"use client"
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import{cn}from "@/lib/utils"
import{buttonVariants}from "@/components/ui/button"
constAlertDialog = AlertDialogPrimitive.Root
constAlertDialogTrigger = AlertDialogPrimitive.Trigger
constAlertDialogPortal = AlertDialogPrimitive.Portal
constAlertDialogOverlay = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({className,...props},ref) => (
<AlertDialogPrimitive.Overlay
className={cn(
"bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm",
className
)}
{...props}
ref={ref}
/>
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName
constAlertDialogContent = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({className,...props},ref) => (
<AlertDialogPortal>
<AlertDialogOverlay />
<AlertDialogPrimitive.Content
ref={ref}
className={cn(
"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
className
)}
{...props}
/>
</AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName
constAlertDialogHeader = ({
className,
...props
}:React.HTMLAttributes<HTMLDivElement>) => (
<div
className={cn(
"flex flex-col space-y-2 text-center sm:text-left",
className
)}
{...props}
/>
)
AlertDialogHeader.displayName = "AlertDialogHeader"
constAlertDialogFooter = ({
className,
...props
}:React.HTMLAttributes<HTMLDivElement>) => (
<div
className={cn(
"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
className
)}
{...props}
/>
)
AlertDialogFooter.displayName = "AlertDialogFooter"
constAlertDialogTitle = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({className,...props},ref) => (
<AlertDialogPrimitive.Title
ref={ref}
className={cn("text-lg font-semibold",className)}
{...props}
/>
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName
constAlertDialogDescription = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({className,...props},ref) => (
<AlertDialogPrimitive.Description
ref={ref}
className={cn("text-muted-foreground text-sm",className)}
{...props}
/>
))
AlertDialogDescription.displayName =
AlertDialogPrimitive.Description.displayName
constAlertDialogAction = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Action>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({className,...props},ref) => (
<AlertDialogPrimitive.Action
ref={ref}
className={cn(buttonVariants(),className)}
{...props}
/>
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName
constAlertDialogCancel = React.forwardRef<
React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({className,...props},ref) => (
<AlertDialogPrimitive.Cancel
ref={ref}
className={cn(
buttonVariants({variant:"outline"}),
"mt-2 sm:mt-0",
className
)}
{...props}
/>
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName
export {
AlertDialog,
AlertDialogPortal,
AlertDialogOverlay,
AlertDialogTrigger,
AlertDialogContent,
AlertDialogHeader,
AlertDialogFooter,
AlertDialogTitle,
AlertDialogDescription,
AlertDialogAction,
AlertDialogCancel
}

// File: components/ui/alert.tsx
import * as React from "react"
import{cva,typeVariantProps}from "class-variance-authority"
import{cn}from "@/lib/utils"
constalertVariants = cva(
"[&>svg]:text-foreground relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
{
variants:{
variant:{
default:"bg-background text-foreground",
destructive:
"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
}
},
defaultVariants:{
variant:"default"
}
}
)
constAlert = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({className,variant,...props},ref) => (
<div
ref={ref}
role="alert"
className={cn(alertVariants({variant}),className)}
{...props}
/>
))
Alert.displayName = "Alert"
constAlertTitle = React.forwardRef<
HTMLParagraphElement,
React.HTMLAttributes<HTMLHeadingElement>
>(({className,...props},ref) => (
<h5
ref={ref}
className={cn("mb-1 font-medium leading-none tracking-tight",className)}
{...props}
/>
))
AlertTitle.displayName = "AlertTitle"
constAlertDescription = React.forwardRef<
HTMLParagraphElement,
React.HTMLAttributes<HTMLParagraphElement>
>(({className,...props},ref) => (
<div
ref={ref}
className={cn("text-sm [&_p]:leading-relaxed",className)}
{...props}
/>
))
AlertDescription.displayName = "AlertDescription"
export {Alert,AlertTitle,AlertDescription}

// File: components/ui/aspect-ratio.tsx
"use client"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
constAspectRatio = AspectRatioPrimitive.Root
export {AspectRatio}

// File: components/ui/avatar.tsx
"use client"
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import{cn}from "@/lib/utils"
constAvatar = React.forwardRef<
React.ElementRef<typeof AvatarPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({className,...props},ref) => (
<AvatarPrimitive.Root
ref={ref}
className={cn(
"relative flex size-10 shrink-0 overflow-hidden rounded-full",
className
)}
{...props}
/>
))
Avatar.displayName = AvatarPrimitive.Root.displayName
constAvatarImage = React.forwardRef<
React.ElementRef<typeof AvatarPrimitive.Image>,
React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({className,...props},ref) => (
<AvatarPrimitive.Image
ref={ref}
className={cn("aspect-square size-full",className)}
{...props}
/>
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName
constAvatarFallback = React.forwardRef<
React.ElementRef<typeof AvatarPrimitive.Fallback>,
React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({className,...props},ref) => (
<AvatarPrimitive.Fallback
ref={ref}
className={cn(
"bg-muted flex size-full items-center justify-center rounded-full",
className
)}
{...props}
/>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
export {Avatar,AvatarImage,AvatarFallback}

// File: components/ui/badge.tsx
import * as React from "react"
import{cva,typeVariantProps}from "class-variance-authority"
import{cn}from "@/lib/utils"
constbadgeVariants = cva(
"focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
{
variants:{
variant:{
default:
"bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
secondary:
"bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
destructive:
"bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
outline:"text-foreground"
}
},
defaultVariants:{
variant:"default"
}
}
)
export interfaceBadgeProps
extends React.HTMLAttributes<HTMLDivElement>,
VariantProps<typeof badgeVariants> {}
function Badge({className,variant,...props}:BadgeProps) {
return (
<div className={cn(badgeVariants({variant}),className)} {...props} />
)
}
export {Badge,badgeVariants}

// File: components/ui/brand.tsx
"use client"
import Link from "next/link"
import{FC}from "react"
import{ChatbotUISVG}from "../icons/chatbotui-svg"
interfaceBrandProps {
theme?:"dark" | "light"
}
export constBrand:FC<BrandProps> = ({theme = "dark"}) => {
return (
<Link
className="flex cursor-pointer flex-col items-center hover:opacity-50"
href="https:
target="_blank"
rel="noopener noreferrer"
>
<div className="mb-2">
<ChatbotUISVG theme={theme === "dark" ? "dark" :"light"} scale={0.3} />
</div>
<div className="text-4xl font-bold tracking-wide">Chatbot UI</div>
</Link>
)
}

// File: components/ui/button.tsx
import{Slot}from "@radix-ui/react-slot"
import{cva,typeVariantProps}from "class-variance-authority"
import * as React from "react"
import{cn}from "@/lib/utils"
constbuttonVariants = cva(
"ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
{
variants:{
variant:{
default:"bg-primary text-primary-foreground hover:bg-primary/90",
destructive:
"bg-destructive text-destructive-foreground hover:bg-destructive/90",
outline:
"border-input bg-background hover:bg-accent hover:text-accent-foreground border",
secondary:
"bg-secondary text-secondary-foreground hover:bg-secondary/80",
ghost:"hover:bg-accent hover:text-accent-foreground",
link:"text-primary underline-offset-4 hover:underline"
},
size:{
default:"h-10 px-4 py-2",
sm:"h-9 rounded-md px-3",
lg:"h-11 rounded-md px-8",
icon:"size-10"
}
},
defaultVariants:{
variant:"default",
size:"default"
}
}
)
export interfaceButtonProps
extends React.ButtonHTMLAttributes<HTMLButtonElement>,
VariantProps<typeof buttonVariants> {
asChild?:boolean
}
constButton = React.forwardRef<HTMLButtonElement,ButtonProps>(
({className,variant,size,asChild = false,...props},ref) => {
constComp = asChild ? Slot :"button"
return (
<Comp
className={cn(buttonVariants({variant,size,className}))}
ref={ref}
{...props}
/>
)
}
)
Button.displayName = "Button"
export {Button,buttonVariants}

// File: components/ui/calendar.tsx
"use client"
import * as React from "react"
import{ChevronLeft,ChevronRight}from "lucide-react"
import{DayPicker}from "react-day-picker"
import{cn}from "@/lib/utils"
import{buttonVariants}from "@/components/ui/button"
export typeCalendarProps = React.ComponentProps<typeof DayPicker>
function Calendar({
className,
classNames,
showOutsideDays = true,
...props
}:CalendarProps) {
return (
<DayPicker
showOutsideDays={showOutsideDays}
className={cn("p-3",className)}
classNames={{
months:"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
month:"space-y-4",
caption:"flex justify-center pt-1 relative items-center",
caption_label:"text-sm font-medium",
nav:"space-x-1 flex items-center",
nav_button:cn(
buttonVariants({variant:"outline"}),
"size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
),
nav_button_previous:"absolute left-1",
nav_button_next:"absolute right-1",
table:"w-full border-collapse space-y-1",
head_row:"flex",
head_cell:
"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
row:"flex w-full mt-2",
cell:"h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
day:cn(
buttonVariants({variant:"ghost"}),
"size-9 p-0 font-normal aria-selected:opacity-100"
),
day_range_end:"day-range-end",
day_selected:
"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
day_today:"bg-accent text-accent-foreground",
day_outside:
"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
day_disabled:"text-muted-foreground opacity-50",
day_range_middle:
"aria-selected:bg-accent aria-selected:text-accent-foreground",
day_hidden:"invisible",
...classNames
}}
components={{
IconLeft:({...props}) => <ChevronLeft className="size-4" />,
IconRight:({...props}) => <ChevronRight className="size-4" />
}}
{...props}
/>
)
}
Calendar.displayName = "Calendar"
export {Calendar}

// File: components/ui/card.tsx
import * as React from "react"
import{cn}from "@/lib/utils"
constCard = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement>
>(({className,...props},ref) => (
<div
ref={ref}
className={cn(
"bg-card text-card-foreground rounded-lg border shadow-sm",
className
)}
{...props}
/>
))
Card.displayName = "Card"
constCardHeader = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement>
>(({className,...props},ref) => (
<div
ref={ref}
className={cn("flex flex-col space-y-1.5 p-6",className)}
{...props}
/>
))
CardHeader.displayName = "CardHeader"
constCardTitle = React.forwardRef<
HTMLParagraphElement,
React.HTMLAttributes<HTMLHeadingElement>
>(({className,...props},ref) => (
<h3
ref={ref}
className={cn(
"text-2xl font-semibold leading-none tracking-tight",
className
)}
{...props}
/>
))
CardTitle.displayName = "CardTitle"
constCardDescription = React.forwardRef<
HTMLParagraphElement,
React.HTMLAttributes<HTMLParagraphElement>
>(({className,...props},ref) => (
<p
ref={ref}
className={cn("text-muted-foreground text-sm",className)}
{...props}
/>
))
CardDescription.displayName = "CardDescription"
constCardContent = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement>
>(({className,...props},ref) => (
<div ref={ref} className={cn("p-6 pt-0",className)} {...props} />
))
CardContent.displayName = "CardContent"
constCardFooter = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement>
>(({className,...props},ref) => (
<div
ref={ref}
className={cn("flex items-center p-6 pt-0",className)}
{...props}
/>
))
CardFooter.displayName = "CardFooter"
export {Card,CardHeader,CardFooter,CardTitle,CardDescription,CardContent}

// File: components/ui/chat-settings-form.tsx
"use client"
import{ChatbotUIContext}from "@/context/context"
import{CHAT_SETTING_LIMITS}from "@/lib/chat-setting-limits"
import{ChatSettings}from "@/types"
import{IconInfoCircle}from "@tabler/icons-react"
import{FC,useContext}from "react"
import{ModelSelect}from "../models/model-select"
import{AdvancedSettings}from "./advanced-settings"
import{Checkbox}from "./checkbox"
import{Label}from "./label"
import{
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue
}from "./select"
import{Slider}from "./slider"
import{TextareaAutosize}from "./textarea-autosize"
import{WithTooltip}from "./with-tooltip"
interfaceChatSettingsFormProps {
chatSettings:ChatSettings
onChangeChatSettings:(value:ChatSettings) => void
useAdvancedDropdown?:boolean
showTooltip?:boolean
}
export constChatSettingsForm:FC<ChatSettingsFormProps> = ({
chatSettings,
onChangeChatSettings,
useAdvancedDropdown = true,
showTooltip = true
}) => {
const{profile,models} = useContext(ChatbotUIContext)
if (!profile) return null
return (
<div className="space-y-3">
<div className="space-y-1">
<Label>Model</Label>
<ModelSelect
selectedModelId={chatSettings.model}
onSelectModel={model => {
onChangeChatSettings({...chatSettings,model})
}}
/>
</div>
<div className="space-y-1">
<Label>Prompt</Label>
<TextareaAutosize
className="bg-background border-input border-2"
placeholder="You are a helpful AI assistant."
onValueChange={prompt => {
onChangeChatSettings({...chatSettings,prompt})
}}
value={chatSettings.prompt}
minRows={3}
maxRows={6}
/>
</div>
{useAdvancedDropdown ? (
<AdvancedSettings>
<AdvancedContent
chatSettings={chatSettings}
onChangeChatSettings={onChangeChatSettings}
showTooltip={showTooltip}
/>
</AdvancedSettings>
) :(
<div>
<AdvancedContent
chatSettings={chatSettings}
onChangeChatSettings={onChangeChatSettings}
showTooltip={showTooltip}
/>
</div>
)}
</div>
)
}
interfaceAdvancedContentProps {
chatSettings:ChatSettings
onChangeChatSettings:(value:ChatSettings) => void
showTooltip:boolean
}
constAdvancedContent:FC<AdvancedContentProps> = ({
chatSettings,
onChangeChatSettings,
showTooltip
}) => {
const{profile,selectedWorkspace,availableOpenRouterModels,models} =
useContext(ChatbotUIContext)
constisCustomModel = models.some(
model => model.model_id === chatSettings.model
)
function findOpenRouterModel(modelId:string) {
return availableOpenRouterModels.find(model => model.modelId === modelId)
}
constMODEL_LIMITS = CHAT_SETTING_LIMITS[chatSettings.model] || {
MIN_TEMPERATURE:0,
MAX_TEMPERATURE:1,
MAX_CONTEXT_LENGTH:
findOpenRouterModel(chatSettings.model)?.maxContext || 4096
}
return (
<div className="mt-5">
<div className="space-y-3">
<Label className="flex items-center space-x-1">
<div>Temperature:</div>
<div>{chatSettings.temperature}</div>
</Label>
<Slider
value={[chatSettings.temperature]}
onValueChange={temperature => {
onChangeChatSettings({
...chatSettings,
temperature:temperature[0]
})
}}
min={MODEL_LIMITS.MIN_TEMPERATURE}
max={MODEL_LIMITS.MAX_TEMPERATURE}
step={0.01}
/>
</div>
<div className="mt-6 space-y-3">
<Label className="flex items-center space-x-1">
<div>Context Length:</div>
<div>{chatSettings.contextLength}</div>
</Label>
<Slider
value={[chatSettings.contextLength]}
onValueChange={contextLength => {
onChangeChatSettings({
...chatSettings,
contextLength:contextLength[0]
})
}}
min={0}
max={
isCustomModel
? models.find(model => model.model_id === chatSettings.model)
?.context_length
:MODEL_LIMITS.MAX_CONTEXT_LENGTH
}
step={1}
/>
</div>
<div className="mt-7 flex items-center space-x-2">
<Checkbox
checked={chatSettings.includeProfileContext}
onCheckedChange={(value:boolean) =>
onChangeChatSettings({
...chatSettings,
includeProfileContext:value
})
}
/>
<Label>Chats Include Profile Context</Label>
{showTooltip && (
<WithTooltip
delayDuration={0}
display={
<div className="w-[400px] p-3">
{profile?.profile_context || "No profile context."}
</div>
}
trigger={
<IconInfoCircle className="cursor-hover:opacity-50" size={16} />
}
/>
)}
</div>
<div className="mt-4 flex items-center space-x-2">
<Checkbox
checked={chatSettings.includeWorkspaceInstructions}
onCheckedChange={(value:boolean) =>
onChangeChatSettings({
...chatSettings,
includeWorkspaceInstructions:value
})
}
/>
<Label>Chats Include Workspace Instructions</Label>
{showTooltip && (
<WithTooltip
delayDuration={0}
display={
<div className="w-[400px] p-3">
{selectedWorkspace?.instructions ||
"No workspace instructions."}
</div>
}
trigger={
<IconInfoCircle className="cursor-hover:opacity-50" size={16} />
}
/>
)}
</div>
<div className="mt-5">
<Label>Embeddings Provider</Label>
<Select
value={chatSettings.embeddingsProvider}
onValueChange={(embeddingsProvider:"openai" | "local") => {
onChangeChatSettings({
...chatSettings,
embeddingsProvider
})
}}
>
<SelectTrigger>
<SelectValue defaultValue="openai" />
</SelectTrigger>
<SelectContent>
<SelectItem value="openai">
{profile?.use_azure_openai ? "Azure OpenAI" :"OpenAI"}
</SelectItem>
{window.location.hostname === "localhost" && (
<SelectItem value="local">Local</SelectItem>
)}
</SelectContent>
</Select>
</div>
</div>
)
}

// File: components/ui/checkbox.tsx
"use client"
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import{Check}from "lucide-react"
import{cn}from "@/lib/utils"
constCheckbox = React.forwardRef<
React.ElementRef<typeof CheckboxPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className,...props},ref) => (
<CheckboxPrimitive.Root
ref={ref}
className={cn(
"border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer size-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
className
)}
{...props}
>
<CheckboxPrimitive.Indicator
className={cn("flex items-center justify-center text-current")}
>
<Check className="size-4" />
</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName
export {Checkbox}

// File: components/ui/collapsible.tsx
"use client"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
constCollapsible = CollapsiblePrimitive.Root
constCollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger
constCollapsibleContent = CollapsiblePrimitive.CollapsibleContent
export {Collapsible,CollapsibleTrigger,CollapsibleContent}

// File: components/ui/command.tsx
"use client"
import * as React from "react"
import{typeDialogProps}from "@radix-ui/react-dialog"
import{Command as CommandPrimitive}from "cmdk"
import{Search}from "lucide-react"
import{cn}from "@/lib/utils"
import{Dialog,DialogContent}from "@/components/ui/dialog"
constCommand = React.forwardRef<
React.ElementRef<typeof CommandPrimitive>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({className,...props},ref) => (
<CommandPrimitive
ref={ref}
className={cn(
"bg-popover text-popover-foreground flex size-full flex-col overflow-hidden rounded-md",
className
)}
{...props}
/>
))
Command.displayName = CommandPrimitive.displayName
interfaceCommandDialogProps extends DialogProps {}
constCommandDialog = ({children,...props}:CommandDialogProps) => {
return (
<Dialog {...props}>
<DialogContent className="overflow-hidden p-0 shadow-lg">
<Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
{children}
</Command>
</DialogContent>
</Dialog>
)
}
constCommandInput = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Input>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({className,...props},ref) => (
<div className="flex items-center border-b px-3" cmdk-input-wrapper="">
<Search className="mr-2 size-4 shrink-0 opacity-50" />
<CommandPrimitive.Input
ref={ref}
className={cn(
"placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
className
)}
{...props}
/>
</div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName
constCommandList = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.List>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({className,...props},ref) => (
<CommandPrimitive.List
ref={ref}
className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden",className)}
{...props}
/>
))
CommandList.displayName = CommandPrimitive.List.displayName
constCommandEmpty = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Empty>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props,ref) => (
<CommandPrimitive.Empty
ref={ref}
className="py-6 text-center text-sm"
{...props}
/>
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName
constCommandGroup = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Group>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({className,...props},ref) => (
<CommandPrimitive.Group
ref={ref}
className={cn(
"text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
className
)}
{...props}
/>
))
CommandGroup.displayName = CommandPrimitive.Group.displayName
constCommandSeparator = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({className,...props},ref) => (
<CommandPrimitive.Separator
ref={ref}
className={cn("bg-border -mx-1 h-px",className)}
{...props}
/>
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName
constCommandItem = React.forwardRef<
React.ElementRef<typeof CommandPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({className,...props},ref) => (
<CommandPrimitive.Item
ref={ref}
className={cn(
"aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
className
)}
{...props}
/>
))
CommandItem.displayName = CommandPrimitive.Item.displayName
constCommandShortcut = ({
className,
...props
}:React.HTMLAttributes<HTMLSpanElement>) => {
return (
<span
className={cn(
"text-muted-foreground ml-auto text-xs tracking-widest",
className
)}
{...props}
/>
)
}
CommandShortcut.displayName = "CommandShortcut"
export {
Command,
CommandDialog,
CommandInput,
CommandList,
CommandEmpty,
CommandGroup,
CommandItem,
CommandShortcut,
CommandSeparator
}

// File: components/ui/context-menu.tsx
"use client"
import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import{Check,ChevronRight,Circle}from "lucide-react"
import{cn}from "@/lib/utils"
constContextMenu = ContextMenuPrimitive.Root
constContextMenuTrigger = ContextMenuPrimitive.Trigger
constContextMenuGroup = ContextMenuPrimitive.Group
constContextMenuPortal = ContextMenuPrimitive.Portal
constContextMenuSub = ContextMenuPrimitive.Sub
constContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup
constContextMenuSubTrigger = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
inset?:boolean
}
>(({className,inset,children,...props},ref) => (
<ContextMenuPrimitive.SubTrigger
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
inset && "pl-8",
className
)}
{...props}
>
{children}
<ChevronRight className="ml-auto size-4" />
</ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName
constContextMenuSubContent = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({className,...props},ref) => (
<ContextMenuPrimitive.SubContent
ref={ref}
className={cn(
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md",
className
)}
{...props}
/>
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName
constContextMenuContent = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({className,...props},ref) => (
<ContextMenuPrimitive.Portal>
<ContextMenuPrimitive.Content
ref={ref}
className={cn(
"bg-popover text-popover-foreground animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md",
className
)}
{...props}
/>
</ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName
constContextMenuItem = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
inset?:boolean
}
>(({className,inset,...props},ref) => (
<ContextMenuPrimitive.Item
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
inset && "pl-8",
className
)}
{...props}
/>
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName
constContextMenuCheckboxItem = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({className,children,checked,...props},ref) => (
<ContextMenuPrimitive.CheckboxItem
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
className
)}
checked={checked}
{...props}
>
<span className="absolute left-2 flex size-3.5 items-center justify-center">
<ContextMenuPrimitive.ItemIndicator>
<Check className="size-4" />
</ContextMenuPrimitive.ItemIndicator>
</span>
{children}
</ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
ContextMenuPrimitive.CheckboxItem.displayName
constContextMenuRadioItem = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({className,children,...props},ref) => (
<ContextMenuPrimitive.RadioItem
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
className
)}
{...props}
>
<span className="absolute left-2 flex size-3.5 items-center justify-center">
<ContextMenuPrimitive.ItemIndicator>
<Circle className="size-2 fill-current" />
</ContextMenuPrimitive.ItemIndicator>
</span>
{children}
</ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName
constContextMenuLabel = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
inset?:boolean
}
>(({className,inset,...props},ref) => (
<ContextMenuPrimitive.Label
ref={ref}
className={cn(
"text-foreground px-2 py-1.5 text-sm font-semibold",
inset && "pl-8",
className
)}
{...props}
/>
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName
constContextMenuSeparator = React.forwardRef<
React.ElementRef<typeof ContextMenuPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({className,...props},ref) => (
<ContextMenuPrimitive.Separator
ref={ref}
className={cn("bg-border -mx-1 my-1 h-px",className)}
{...props}
/>
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName
constContextMenuShortcut = ({
className,
...props
}:React.HTMLAttributes<HTMLSpanElement>) => {
return (
<span
className={cn(
"text-muted-foreground ml-auto text-xs tracking-widest",
className
)}
{...props}
/>
)
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"
export {
ContextMenu,
ContextMenuTrigger,
ContextMenuContent,
ContextMenuItem,
ContextMenuCheckboxItem,
ContextMenuRadioItem,
ContextMenuLabel,
ContextMenuSeparator,
ContextMenuShortcut,
ContextMenuGroup,
ContextMenuPortal,
ContextMenuSub,
ContextMenuSubContent,
ContextMenuSubTrigger,
ContextMenuRadioGroup
}

// File: components/ui/dashboard.tsx
"use client"
import{Sidebar}from "@/components/sidebar/sidebar"
import{SidebarSwitcher}from "@/components/sidebar/sidebar-switcher"
import{Button}from "@/components/ui/button"
import{Tabs}from "@/components/ui/tabs"
import useHotkey from "@/lib/hooks/use-hotkey"
import{cn}from "@/lib/utils"
import{ContentType}from "@/types"
import{IconChevronCompactRight,IconLock}from "@tabler/icons-react"
import{usePathname,useRouter,useSearchParams}from "next/navigation"
import Link from "next/link"
import{FC,useState}from "react"
import{useSelectFileHandler}from "../chat/chat-hooks/use-select-file-handler"
import{CommandK}from "../utility/command-k"
export constSIDEBAR_WIDTH = 350
interfaceDashboardProps {
children:React.ReactNode
}
export constDashboard:FC<DashboardProps> = ({children}) => {
useHotkey("s",() => setShowSidebar(prevState => !prevState))
constpathname = usePathname()
constrouter = useRouter()
constsearchParams = useSearchParams()
consttabValue = searchParams.get("tab") || "chats"
const{handleSelectDeviceFile} = useSelectFileHandler()
const[contentType,setContentType] = useState<ContentType>(
tabValue as ContentType
)
const[showSidebar,setShowSidebar] = useState(
localStorage.getItem("showSidebar") === "true"
)
const[isDragging,setIsDragging] = useState(false)
constonFileDrop = (event:React.DragEvent<HTMLDivElement>) => {
event.preventDefault()
constfiles = event.dataTransfer.files
constfile = files[0]
handleSelectDeviceFile(file)
setIsDragging(false)
}
consthandleDragEnter = (event:React.DragEvent<HTMLDivElement>) => {
event.preventDefault()
setIsDragging(true)
}
consthandleDragLeave = (event:React.DragEvent<HTMLDivElement>) => {
event.preventDefault()
setIsDragging(false)
}
constonDragOver = (event:React.DragEvent<HTMLDivElement>) => {
event.preventDefault()
}
consthandleToggleSidebar = () => {
setShowSidebar(prevState => !prevState)
localStorage.setItem("showSidebar",String(!showSidebar))
}

constlocale = pathname.split("/")[1]
return (
<div className="flex size-full">
<CommandK />
<div
className={cn(
"duration-200 dark:border-none",
showSidebar ? "border-r-2" :""
)}
style={{
minWidth:showSidebar ? `${SIDEBAR_WIDTH}px` :"0px",
maxWidth:showSidebar ? `${SIDEBAR_WIDTH}px` :"0px",
width:showSidebar ? `${SIDEBAR_WIDTH}px` :"0px"
}}
>
{showSidebar && (
<div className="flex h-full flex-col">
<Tabs
className="flex h-full grow"
value={contentType}
onValueChange={tabValue => {
setContentType(tabValue as ContentType)
router.replace(`${pathname}?tab=${tabValue}`)
}}
>
<SidebarSwitcher onContentTypeChange={setContentType} />
<Sidebar contentType={contentType} showSidebar={showSidebar} />
</Tabs>
<div className="p-4">
<Button asChild variant="outline" size="sm" className="w-full">
<Link href={`/protected`}>
<IconLock className="mr-2 size-4" />
Protected Area
</Link>
</Button>
</div>
</div>
)}
</div>
<div
className="bg-muted/50 relative flex w-screen min-w-[90%] grow flex-col sm:min-w-fit"
onDrop={onFileDrop}
onDragOver={onDragOver}
onDragEnter={handleDragEnter}
onDragLeave={handleDragLeave}
>
{isDragging ? (
<div className="flex h-full items-center justify-center bg-black/50 text-2xl text-white">
drop file here
</div>
) :(
children
)}
<Button
className={cn("absolute left-1 top-1/2 z-10 size-8 cursor-pointer")}
style={{
transform:showSidebar ? "rotate(180deg)" :"rotate(0deg)"
}}
variant="ghost"
size="icon"
onClick={handleToggleSidebar}
>
<IconChevronCompactRight size={24} />
</Button>
</div>
</div>
)
}

// File: components/ui/dialog.tsx
"use client"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as React from "react"
import{cn}from "@/lib/utils"
constDialog = DialogPrimitive.Root
constDialogTrigger = DialogPrimitive.Trigger
constDialogPortal = DialogPrimitive.Portal
constDialogClose = DialogPrimitive.Close
constDialogOverlay = React.forwardRef<
React.ElementRef<typeof DialogPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({className,...props},ref) => (
<DialogPrimitive.Overlay
ref={ref}
className={cn(
"bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm",
className
)}
{...props}
/>
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
constDialogContent = React.forwardRef<
React.ElementRef<typeof DialogPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({className,children,...props},ref) => (
<DialogPortal>
<DialogOverlay />
<DialogPrimitive.Content
ref={ref}
className={cn(
"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid max-h-[calc(100%-60px)] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
className
)}
{...props}
>
{children}
{/* <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
<X className="h-4 w-4" />
<span className="sr-only">Close</span>
</DialogPrimitive.Close> */}
</DialogPrimitive.Content>
</DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName
constDialogHeader = ({
className,
...props
}:React.HTMLAttributes<HTMLDivElement>) => (
<div
className={cn(
"flex flex-col space-y-1.5 text-center sm:text-left",
className
)}
{...props}
/>
)
DialogHeader.displayName = "DialogHeader"
constDialogFooter = ({
className,
...props
}:React.HTMLAttributes<HTMLDivElement>) => (
<div
className={cn(
"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
className
)}
{...props}
/>
)
DialogFooter.displayName = "DialogFooter"
constDialogTitle = React.forwardRef<
React.ElementRef<typeof DialogPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({className,...props},ref) => (
<DialogPrimitive.Title
ref={ref}
className={cn(
"text-lg font-semibold leading-none tracking-tight",
className
)}
{...props}
/>
))
DialogTitle.displayName = DialogPrimitive.Title.displayName
constDialogDescription = React.forwardRef<
React.ElementRef<typeof DialogPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({className,...props},ref) => (
<DialogPrimitive.Description
ref={ref}
className={cn("text-muted-foreground text-sm",className)}
{...props}
/>
))
DialogDescription.displayName = DialogPrimitive.Description.displayName
export {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogOverlay,
DialogPortal,
DialogTitle,
DialogTrigger
}

// File: components/ui/dropdown-menu.tsx
"use client"
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import{Check,ChevronRight,Circle}from "lucide-react"
import{cn}from "@/lib/utils"
constDropdownMenu = DropdownMenuPrimitive.Root
constDropdownMenuTrigger = DropdownMenuPrimitive.Trigger
constDropdownMenuGroup = DropdownMenuPrimitive.Group
constDropdownMenuPortal = DropdownMenuPrimitive.Portal
constDropdownMenuSub = DropdownMenuPrimitive.Sub
constDropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
constDropdownMenuSubTrigger = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
inset?:boolean
}
>(({className,inset,children,...props},ref) => (
<DropdownMenuPrimitive.SubTrigger
ref={ref}
className={cn(
"focus:bg-accent data-[state=open]:bg-accent flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
inset && "pl-8",
className
)}
{...props}
>
{children}
<ChevronRight className="ml-auto size-4" />
</DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
DropdownMenuPrimitive.SubTrigger.displayName
constDropdownMenuSubContent = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({className,...props},ref) => (
<DropdownMenuPrimitive.SubContent
ref={ref}
className={cn(
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-lg",
className
)}
{...props}
/>
))
DropdownMenuSubContent.displayName =
DropdownMenuPrimitive.SubContent.displayName
constDropdownMenuContent = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({className,sideOffset = 4,...props},ref) => (
<DropdownMenuPrimitive.Portal>
<DropdownMenuPrimitive.Content
ref={ref}
sideOffset={sideOffset}
className={cn(
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md",
className
)}
{...props}
/>
</DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName
constDropdownMenuItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
inset?:boolean
}
>(({className,inset,...props},ref) => (
<DropdownMenuPrimitive.Item
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
inset && "pl-8",
className
)}
{...props}
/>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName
constDropdownMenuCheckboxItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({className,children,checked,...props},ref) => (
<DropdownMenuPrimitive.CheckboxItem
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
className
)}
checked={checked}
{...props}
>
<span className="absolute left-2 flex size-3.5 items-center justify-center">
<DropdownMenuPrimitive.ItemIndicator>
<Check className="size-4" />
</DropdownMenuPrimitive.ItemIndicator>
</span>
{children}
</DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
DropdownMenuPrimitive.CheckboxItem.displayName
constDropdownMenuRadioItem = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({className,children,...props},ref) => (
<DropdownMenuPrimitive.RadioItem
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
className
)}
{...props}
>
<span className="absolute left-2 flex size-3.5 items-center justify-center">
<DropdownMenuPrimitive.ItemIndicator>
<Circle className="size-2 fill-current" />
</DropdownMenuPrimitive.ItemIndicator>
</span>
{children}
</DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName
constDropdownMenuLabel = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
inset?:boolean
}
>(({className,inset,...props},ref) => (
<DropdownMenuPrimitive.Label
ref={ref}
className={cn(
"px-2 py-1.5 text-sm font-semibold",
inset && "pl-8",
className
)}
{...props}
/>
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName
constDropdownMenuSeparator = React.forwardRef<
React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({className,...props},ref) => (
<DropdownMenuPrimitive.Separator
ref={ref}
className={cn("bg-muted -mx-1 my-1 h-px",className)}
{...props}
/>
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName
constDropdownMenuShortcut = ({
className,
...props
}:React.HTMLAttributes<HTMLSpanElement>) => {
return (
<span
className={cn("ml-auto text-xs tracking-widest opacity-60",className)}
{...props}
/>
)
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"
export {
DropdownMenu,
DropdownMenuTrigger,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuCheckboxItem,
DropdownMenuRadioItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuGroup,
DropdownMenuPortal,
DropdownMenuSub,
DropdownMenuSubContent,
DropdownMenuSubTrigger,
DropdownMenuRadioGroup
}

// File: components/ui/file-icon.tsx
import{
IconFile,
IconFileText,
IconFileTypeCsv,
IconFileTypeDocx,
IconFileTypePdf,
IconJson,
IconMarkdown,
IconPhoto
}from "@tabler/icons-react"
import{FC}from "react"
interfaceFileIconProps {
type:string
size?:number
}
export constFileIcon:FC<FileIconProps> = ({type,size = 32}) => {
if (type.includes("image")) {
return <IconPhoto size={size} />
} else if (type.includes("pdf")) {
return <IconFileTypePdf size={size} />
} else if (type.includes("csv")) {
return <IconFileTypeCsv size={size} />
} else if (type.includes("docx")) {
return <IconFileTypeDocx size={size} />
} else if (type.includes("plain")) {
return <IconFileText size={size} />
} else if (type.includes("json")) {
return <IconJson size={size} />
} else if (type.includes("markdown")) {
return <IconMarkdown size={size} />
} else {
return <IconFile size={size} />
}
}

// File: components/ui/file-preview.tsx
import{cn}from "@/lib/utils"
import{Tables}from "@/supabase/types"
import{ChatFile,MessageImage}from "@/types"
import{IconFileFilled}from "@tabler/icons-react"
import Image from "next/image"
import{FC}from "react"
import{DrawingCanvas}from "../utility/drawing-canvas"
import{Dialog,DialogContent}from "./dialog"
interfaceFilePreviewProps {
type:"image" | "file" | "file_item"
item:ChatFile | MessageImage | Tables<"file_items">
isOpen:boolean
onOpenChange:(isOpen:boolean) => void
}
export constFilePreview:FC<FilePreviewProps> = ({
type,
item,
isOpen,
onOpenChange
}) => {
return (
<Dialog open={isOpen} onOpenChange={onOpenChange}>
<DialogContent
className={cn(
"flex items-center justify-center outline-none",
"border-transparent bg-transparent"
)}
>
{(() => {
if (type=== "image") {
constimageItem = item as MessageImage
return imageItem.file ? (
<DrawingCanvas imageItem={imageItem} />
) :(
<Image
className="rounded"
src={imageItem.base64 || imageItem.url}
alt="File image"
width={2000}
height={2000}
style={{
maxHeight:"67vh",
maxWidth:"67vw"
}}
/>
)
} else if (type=== "file_item") {
constfileItem = item as Tables<"file_items">
return (
<div className="bg-background text-primary h-[50vh] min-w-[700px] overflow-auto whitespace-pre-wrap rounded-xl p-4">
<div>{fileItem.content}</div>
</div>
)
} else if (type=== "file") {
return (
<div className="rounded bg-blue-500 p-2">
<IconFileFilled />
</div>
)
}
})()}
</DialogContent>
</Dialog>
)
}

// File: components/ui/form.tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import{Slot}from "@radix-ui/react-slot"
import{
Controller,
ControllerProps,
FieldPath,
FieldValues,
FormProvider,
useFormContext
}from "react-hook-form"
import{cn}from "@/lib/utils"
import{Label}from "@/components/ui/label"
constForm = FormProvider
typeFormFieldContextValue<
TFieldValues extends FieldValues = FieldValues,
TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
name:TName
}
constFormFieldContext = React.createContext<FormFieldContextValue>(
{} as FormFieldContextValue
)
constFormField = <
TFieldValues extends FieldValues = FieldValues,
TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
...props
}:ControllerProps<TFieldValues,TName>) => {
return (
<FormFieldContext.Provider value={{name:props.name}}>
<Controller {...props} />
</FormFieldContext.Provider>
)
}
constuseFormField = () => {
constfieldContext = React.useContext(FormFieldContext)
constitemContext = React.useContext(FormItemContext)
const{getFieldState,formState} = useFormContext()
constfieldState = getFieldState(fieldContext.name,formState)
if (!fieldContext) {
throw new Error("useFormField should be used within <FormField>")
}
const{id} = itemContext
return {
id,
name:fieldContext.name,
formItemId:`${id}-form-item`,
formDescriptionId:`${id}-form-item-description`,
formMessageId:`${id}-form-item-message`,
...fieldState
}
}
typeFormItemContextValue = {
id:string
}
constFormItemContext = React.createContext<FormItemContextValue>(
{} as FormItemContextValue
)
constFormItem = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement>
>(({className,...props},ref) => {
constid = React.useId()
return (
<FormItemContext.Provider value={{id}}>
<div ref={ref} className={cn("space-y-2",className)} {...props} />
</FormItemContext.Provider>
)
})
FormItem.displayName = "FormItem"
constFormLabel = React.forwardRef<
React.ElementRef<typeof LabelPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({className,...props},ref) => {
const{error,formItemId} = useFormField()
return (
<Label
ref={ref}
className={cn(error && "text-destructive",className)}
htmlFor={formItemId}
{...props}
/>
)
})
FormLabel.displayName = "FormLabel"
constFormControl = React.forwardRef<
React.ElementRef<typeof Slot>,
React.ComponentPropsWithoutRef<typeof Slot>
>(({...props},ref) => {
const{error,formItemId,formDescriptionId,formMessageId} = useFormField()
return (
<Slot
ref={ref}
id={formItemId}
aria-describedby={
!error
? `${formDescriptionId}`
:`${formDescriptionId} ${formMessageId}`
}
aria-invalid={!!error}
{...props}
/>
)
})
FormControl.displayName = "FormControl"
constFormDescription = React.forwardRef<
HTMLParagraphElement,
React.HTMLAttributes<HTMLParagraphElement>
>(({className,...props},ref) => {
const{formDescriptionId} = useFormField()
return (
<p
ref={ref}
id={formDescriptionId}
className={cn("text-muted-foreground text-sm",className)}
{...props}
/>
)
})
FormDescription.displayName = "FormDescription"
constFormMessage = React.forwardRef<
HTMLParagraphElement,
React.HTMLAttributes<HTMLParagraphElement>
>(({className,children,...props},ref) => {
const{error,formMessageId} = useFormField()
constbody = error ? String(error?.message) :children
if (!body) {
return null
}
return (
<p
ref={ref}
id={formMessageId}
className={cn("text-destructive text-sm font-medium",className)}
{...props}
>
{body}
</p>
)
})
FormMessage.displayName = "FormMessage"
export {
useFormField,
Form,
FormItem,
FormLabel,
FormControl,
FormDescription,
FormMessage,
FormField
}

// File: components/ui/hover-card.tsx
"use client"
import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import{cn}from "@/lib/utils"
constHoverCard = HoverCardPrimitive.Root
constHoverCardTrigger = HoverCardPrimitive.Trigger
constHoverCardContent = React.forwardRef<
React.ElementRef<typeof HoverCardPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({className,align = "center",sideOffset = 4,...props},ref) => (
<HoverCardPrimitive.Content
ref={ref}
align={align}
sideOffset={sideOffset}
className={cn(
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 rounded-md border p-4 shadow-md outline-none",
className
)}
{...props}
/>
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName
export {HoverCard,HoverCardTrigger,HoverCardContent}

// File: components/ui/image-picker.tsx
import Image from "next/image"
import{ChangeEvent,FC,useState}from "react"
import{toast}from "sonner"
import{Input}from "./input"
interfaceImagePickerProps {
src:string
image:File | null
onSrcChange:(src:string) => void
onImageChange:(image:File) => void
width?:number
height?:number
}
constImagePicker:FC<ImagePickerProps> = ({
src,
image,
onSrcChange,
onImageChange,
width = 200,
height = 200
}) => {
const[previewSrc,setPreviewSrc] = useState<string>(src)
const[previewImage,setPreviewImage] = useState<File | null>(image)
consthandleImageSelect = (e:ChangeEvent<HTMLInputElement>) => {
if (e.target.files) {
constfile = e.target.files[0]
if (file.size > 6000000) {
toast.error("Image must be less than 6MB!")
return
}
consturl = URL.createObjectURL(file)
constimg = new window.Image()
img.src = url
img.onload = () => {
constcanvas = document.createElement("canvas")
constctx = canvas.getContext("2d")
if (!ctx) {
toast.error("Unable to create canvas context.")
return
}
constsize = Math.min(img.width,img.height)
canvas.width = size
canvas.height = size
ctx.drawImage(
img,
(img.width - size) / 2,
(img.height - size) / 2,
size,
size,
0,
0,
size,
size
)
constsquareUrl = canvas.toDataURL()
setPreviewSrc(squareUrl)
setPreviewImage(file)
onSrcChange(squareUrl)
onImageChange(file)
}
}
}
return (
<div>
{previewSrc && (
<Image
style={{width:`${width}px`,height:`${width}px`}}
className="rounded"
height={width}
width={width}
src={previewSrc}
alt={"Image"}
/>
)}
<Input
className="mt-1 cursor-pointer hover:opacity-50"
type="file"
accept="image/png,image/jpeg,image/jpg"
onChange={handleImageSelect}
/>
</div>
)
}
export default ImagePicker

// File: components/ui/input.tsx
import * as React from "react"
import{cn}from "@/lib/utils"
export interfaceInputProps
extends React.InputHTMLAttributes<HTMLInputElement> {}
constInput = React.forwardRef<HTMLInputElement,InputProps>(
({className,type,...props},ref) => {
return (
<input
type={type}
className={cn(
"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:none flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
className
)}
ref={ref}
{...props}
/>
)
}
)
Input.displayName = "Input"
export {Input}

// File: components/ui/label.tsx
"use client"
import * as LabelPrimitive from "@radix-ui/react-label"
import{cva,typeVariantProps}from "class-variance-authority"
import * as React from "react"
import{cn}from "@/lib/utils"
constlabelVariants = cva(
"text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)
constLabel = React.forwardRef<
React.ElementRef<typeof LabelPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
VariantProps<typeof labelVariants>
>(({className,...props},ref) => (
<LabelPrimitive.Root
ref={ref}
className={cn(labelVariants(),className)}
{...props}
/>
))
Label.displayName = LabelPrimitive.Root.displayName
export {Label}

// File: components/ui/limit-display.tsx
import{FC}from "react"
interfaceLimitDisplayProps {
used:number
limit:number
}
export constLimitDisplay:FC<LimitDisplayProps> = ({used,limit}) => {
return (
<div className="text-xs italic">
{used}/{limit}
</div>
)
}

// File: components/ui/menubar.tsx
"use client"
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import{Check,ChevronRight,Circle}from "lucide-react"
import{cn}from "@/lib/utils"
constMenubarMenu = MenubarPrimitive.Menu
constMenubarGroup = MenubarPrimitive.Group
constMenubarPortal = MenubarPrimitive.Portal
constMenubarSub = MenubarPrimitive.Sub
constMenubarRadioGroup = MenubarPrimitive.RadioGroup
constMenubar = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({className,...props},ref) => (
<MenubarPrimitive.Root
ref={ref}
className={cn(
"bg-background flex h-10 items-center space-x-1 rounded-md border p-1",
className
)}
{...props}
/>
))
Menubar.displayName = MenubarPrimitive.Root.displayName
constMenubarTrigger = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({className,...props},ref) => (
<MenubarPrimitive.Trigger
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none",
className
)}
{...props}
/>
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName
constMenubarSubTrigger = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
inset?:boolean
}
>(({className,inset,children,...props},ref) => (
<MenubarPrimitive.SubTrigger
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
inset && "pl-8",
className
)}
{...props}
>
{children}
<ChevronRight className="ml-auto size-4" />
</MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName
constMenubarSubContent = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.SubContent>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({className,...props},ref) => (
<MenubarPrimitive.SubContent
ref={ref}
className={cn(
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1",
className
)}
{...props}
/>
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName
constMenubarContent = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
(
{className,align = "start",alignOffset = -4,sideOffset = 8,...props},
ref
) => (
<MenubarPrimitive.Portal>
<MenubarPrimitive.Content
ref={ref}
align={align}
alignOffset={alignOffset}
sideOffset={sideOffset}
className={cn(
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-48 overflow-hidden rounded-md border p-1 shadow-md",
className
)}
{...props}
/>
</MenubarPrimitive.Portal>
)
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName
constMenubarItem = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
inset?:boolean
}
>(({className,inset,...props},ref) => (
<MenubarPrimitive.Item
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
inset && "pl-8",
className
)}
{...props}
/>
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName
constMenubarCheckboxItem = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({className,children,checked,...props},ref) => (
<MenubarPrimitive.CheckboxItem
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
className
)}
checked={checked}
{...props}
>
<span className="absolute left-2 flex size-3.5 items-center justify-center">
<MenubarPrimitive.ItemIndicator>
<Check className="size-4" />
</MenubarPrimitive.ItemIndicator>
</span>
{children}
</MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName
constMenubarRadioItem = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.RadioItem>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({className,children,...props},ref) => (
<MenubarPrimitive.RadioItem
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
className
)}
{...props}
>
<span className="absolute left-2 flex size-3.5 items-center justify-center">
<MenubarPrimitive.ItemIndicator>
<Circle className="size-2 fill-current" />
</MenubarPrimitive.ItemIndicator>
</span>
{children}
</MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName
constMenubarLabel = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
inset?:boolean
}
>(({className,inset,...props},ref) => (
<MenubarPrimitive.Label
ref={ref}
className={cn(
"px-2 py-1.5 text-sm font-semibold",
inset && "pl-8",
className
)}
{...props}
/>
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName
constMenubarSeparator = React.forwardRef<
React.ElementRef<typeof MenubarPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({className,...props},ref) => (
<MenubarPrimitive.Separator
ref={ref}
className={cn("bg-muted -mx-1 my-1 h-px",className)}
{...props}
/>
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName
constMenubarShortcut = ({
className,
...props
}:React.HTMLAttributes<HTMLSpanElement>) => {
return (
<span
className={cn(
"text-muted-foreground ml-auto text-xs tracking-widest",
className
)}
{...props}
/>
)
}
MenubarShortcut.displayname = "MenubarShortcut"
export {
Menubar,
MenubarMenu,
MenubarTrigger,
MenubarContent,
MenubarItem,
MenubarSeparator,
MenubarLabel,
MenubarCheckboxItem,
MenubarRadioGroup,
MenubarRadioItem,
MenubarPortal,
MenubarSubContent,
MenubarSubTrigger,
MenubarGroup,
MenubarSub,
MenubarShortcut
}

// File: components/ui/navigation-menu.tsx
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import{cva}from "class-variance-authority"
import{ChevronDown}from "lucide-react"
import{cn}from "@/lib/utils"
constNavigationMenu = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({className,children,...props},ref) => (
<NavigationMenuPrimitive.Root
ref={ref}
className={cn(
"relative z-10 flex max-w-max flex-1 items-center justify-center",
className
)}
{...props}
>
{children}
<NavigationMenuViewport />
</NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName
constNavigationMenuList = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.List>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({className,...props},ref) => (
<NavigationMenuPrimitive.List
ref={ref}
className={cn(
"group flex flex-1 list-none items-center justify-center space-x-1",
className
)}
{...props}
/>
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName
constNavigationMenuItem = NavigationMenuPrimitive.Item
constnavigationMenuTriggerStyle = cva(
"bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
)
constNavigationMenuTrigger = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({className,children,...props},ref) => (
<NavigationMenuPrimitive.Trigger
ref={ref}
className={cn(navigationMenuTriggerStyle(),"group",className)}
{...props}
>
{children}{" "}
<ChevronDown
className="relative top-px ml-1 size-3 transition duration-200 group-data-[state=open]:rotate-180"
aria-hidden="true"
/>
</NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName
constNavigationMenuContent = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({className,...props},ref) => (
<NavigationMenuPrimitive.Content
ref={ref}
className={cn(
"data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 left-0 top-0 w-full md:absolute md:w-auto ",
className
)}
{...props}
/>
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName
constNavigationMenuLink = NavigationMenuPrimitive.Link
constNavigationMenuViewport = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({className,...props},ref) => (
<div className={cn("absolute left-0 top-full flex justify-center")}>
<NavigationMenuPrimitive.Viewport
className={cn(
"origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow-lg md:w-[var(--radix-navigation-menu-viewport-width)]",
className
)}
ref={ref}
{...props}
/>
</div>
))
NavigationMenuViewport.displayName =
NavigationMenuPrimitive.Viewport.displayName
constNavigationMenuIndicator = React.forwardRef<
React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({className,...props},ref) => (
<NavigationMenuPrimitive.Indicator
ref={ref}
className={cn(
"data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
className
)}
{...props}
>
<div className="bg-border relative top-[60%] size-2 rotate-45 rounded-tl-sm shadow-md" />
</NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
NavigationMenuPrimitive.Indicator.displayName
export {
navigationMenuTriggerStyle,
NavigationMenu,
NavigationMenuList,
NavigationMenuItem,
NavigationMenuContent,
NavigationMenuTrigger,
NavigationMenuLink,
NavigationMenuIndicator,
NavigationMenuViewport
}

// File: components/ui/popover.tsx
"use client"
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import{cn}from "@/lib/utils"
constPopover = PopoverPrimitive.Root
constPopoverTrigger = PopoverPrimitive.Trigger
constPopoverContent = React.forwardRef<
React.ElementRef<typeof PopoverPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({className,align = "center",sideOffset = 4,...props},ref) => (
<PopoverPrimitive.Portal>
<PopoverPrimitive.Content
ref={ref}
align={align}
sideOffset={sideOffset}
className={cn(
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none",
className
)}
{...props}
/>
</PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName
export {Popover,PopoverTrigger,PopoverContent}

// File: components/ui/progress.tsx
"use client"
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import{cn}from "@/lib/utils"
constProgress = React.forwardRef<
React.ElementRef<typeof ProgressPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({className,value,...props},ref) => (
<ProgressPrimitive.Root
ref={ref}
className={cn(
"bg-secondary relative h-4 w-full overflow-hidden rounded-full",
className
)}
{...props}
>
<ProgressPrimitive.Indicator
className="bg-primary size-full flex-1 transition-all"
style={{transform:`translateX(-${100 - (value || 0)}%)`}}
/>
</ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName
export {Progress}

// File: components/ui/radio-group.tsx
"use client"
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import{Circle}from "lucide-react"
import{cn}from "@/lib/utils"
constRadioGroup = React.forwardRef<
React.ElementRef<typeof RadioGroupPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({className,...props},ref) => {
return (
<RadioGroupPrimitive.Root
className={cn("grid gap-2",className)}
{...props}
ref={ref}
/>
)
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName
constRadioGroupItem = React.forwardRef<
React.ElementRef<typeof RadioGroupPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({className,...props},ref) => {
return (
<RadioGroupPrimitive.Item
ref={ref}
className={cn(
"border-primary text-primary ring-offset-background focus-visible:ring-ring aspect-square size-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
className
)}
{...props}
>
<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
<Circle className="size-2.5 fill-current text-current" />
</RadioGroupPrimitive.Indicator>
</RadioGroupPrimitive.Item>
)
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
export {RadioGroup,RadioGroupItem}

// File: components/ui/screen-loader.tsx
import{IconLoader2}from "@tabler/icons-react"
import{FC}from "react"
interfaceScreenLoaderProps {}
export constScreenLoader:FC<ScreenLoaderProps> = () => {
return (
<div className="flex size-full flex-col items-center justify-center">
<IconLoader2 className="mt-4 size-12 animate-spin" />
</div>
)
}

// File: components/ui/scroll-area.tsx
"use client"
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import{cn}from "@/lib/utils"
constScrollArea = React.forwardRef<
React.ElementRef<typeof ScrollAreaPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({className,children,...props},ref) => (
<ScrollAreaPrimitive.Root
ref={ref}
className={cn("relative overflow-hidden",className)}
{...props}
>
<ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit]">
{children}
</ScrollAreaPrimitive.Viewport>
<ScrollBar />
<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName
constScrollBar = React.forwardRef<
React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({className,orientation = "vertical",...props},ref) => (
<ScrollAreaPrimitive.ScrollAreaScrollbar
ref={ref}
orientation={orientation}
className={cn(
"flex touch-none select-none transition-colors",
orientation === "vertical" &&
"h-full w-2.5 border-l border-l-transparent p-px",
orientation === "horizontal" &&
"h-2.5 flex-col border-t border-t-transparent p-px",
className
)}
{...props}
>
<ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
</ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName
export {ScrollArea,ScrollBar}

// File: components/ui/select.tsx
"use client"
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import{Check,ChevronDown,ChevronUp}from "lucide-react"
import{cn}from "@/lib/utils"
constSelect = SelectPrimitive.Root
constSelectGroup = SelectPrimitive.Group
constSelectValue = SelectPrimitive.Value
constSelectTrigger = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({className,children,...props},ref) => (
<SelectPrimitive.Trigger
ref={ref}
className={cn(
"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
className
)}
{...props}
>
{children}
<SelectPrimitive.Icon asChild>
<ChevronDown className="size-4 opacity-50" />
</SelectPrimitive.Icon>
</SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
constSelectScrollUpButton = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({className,...props},ref) => (
<SelectPrimitive.ScrollUpButton
ref={ref}
className={cn(
"flex cursor-default items-center justify-center py-1",
className
)}
{...props}
>
<ChevronUp className="size-4" />
</SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
constSelectScrollDownButton = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({className,...props},ref) => (
<SelectPrimitive.ScrollDownButton
ref={ref}
className={cn(
"flex cursor-default items-center justify-center py-1",
className
)}
{...props}
>
<ChevronDown className="size-4" />
</SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
SelectPrimitive.ScrollDownButton.displayName
constSelectContent = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({className,children,position = "popper",...props},ref) => (
<SelectPrimitive.Portal>
<SelectPrimitive.Content
ref={ref}
className={cn(
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md",
position === "popper" &&
"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
className
)}
position={position}
{...props}
>
<SelectScrollUpButton />
<SelectPrimitive.Viewport
className={cn(
"p-1",
position === "popper" &&
"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
)}
>
{children}
</SelectPrimitive.Viewport>
<SelectScrollDownButton />
</SelectPrimitive.Content>
</SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName
constSelectLabel = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({className,...props},ref) => (
<SelectPrimitive.Label
ref={ref}
className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold",className)}
{...props}
/>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName
constSelectItem = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({className,children,...props},ref) => (
<SelectPrimitive.Item
ref={ref}
className={cn(
"focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
className
)}
{...props}
>
<span className="absolute left-2 flex size-3.5 items-center justify-center">
<SelectPrimitive.ItemIndicator>
<Check className="size-4" />
</SelectPrimitive.ItemIndicator>
</span>
<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
</SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName
constSelectSeparator = React.forwardRef<
React.ElementRef<typeof SelectPrimitive.Separator>,
React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({className,...props},ref) => (
<SelectPrimitive.Separator
ref={ref}
className={cn("bg-muted -mx-1 my-1 h-px",className)}
{...props}
/>
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName
export {
Select,
SelectGroup,
SelectValue,
SelectTrigger,
SelectContent,
SelectLabel,
SelectItem,
SelectSeparator,
SelectScrollUpButton,
SelectScrollDownButton
}

// File: components/ui/separator.tsx
"use client"
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import{cn}from "@/lib/utils"
constSeparator = React.forwardRef<
React.ElementRef<typeof SeparatorPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
(
{className,orientation = "horizontal",decorative = true,...props},
ref
) => (
<SeparatorPrimitive.Root
ref={ref}
decorative={decorative}
orientation={orientation}
className={cn(
"bg-border shrink-0",
orientation === "horizontal" ? "h-px w-full" :"h-full w-px",
className
)}
{...props}
/>
)
)
Separator.displayName = SeparatorPrimitive.Root.displayName
export {Separator}

// File: components/ui/sheet.tsx
"use client"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import{cva,typeVariantProps}from "class-variance-authority"
import * as React from "react"
import{cn}from "@/lib/utils"
constSheet = SheetPrimitive.Root
constSheetTrigger = SheetPrimitive.Trigger
constSheetClose = SheetPrimitive.Close
constSheetPortal = SheetPrimitive.Portal
constSheetOverlay = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({className,...props},ref) => (
<SheetPrimitive.Overlay
className={cn(
"bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm",
className
)}
{...props}
ref={ref}
/>
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName
constsheetVariants = cva(
"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
{
variants:{
side:{
top:"data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b",
bottom:
"data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t",
left:"data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
right:
"data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0  h-full w-3/4 border-l sm:max-w-sm"
}
},
defaultVariants:{
side:"right"
}
}
)
interfaceSheetContentProps
extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
VariantProps<typeof sheetVariants> {}
constSheetContent = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Content>,
SheetContentProps
>(({side = "right",className,children,...props},ref) => (
<SheetPortal>
<SheetOverlay />
<SheetPrimitive.Content
ref={ref}
className={cn(sheetVariants({side}),className)}
{...props}
>
{children}
{/* <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
<X className="h-4 w-4" />
<span className="sr-only">Close</span>
</SheetPrimitive.Close> */}
</SheetPrimitive.Content>
</SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName
constSheetHeader = ({
className,
...props
}:React.HTMLAttributes<HTMLDivElement>) => (
<div
className={cn(
"flex flex-col space-y-2 text-center sm:text-left",
className
)}
{...props}
/>
)
SheetHeader.displayName = "SheetHeader"
constSheetFooter = ({
className,
...props
}:React.HTMLAttributes<HTMLDivElement>) => (
<div
className={cn(
"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
className
)}
{...props}
/>
)
SheetFooter.displayName = "SheetFooter"
constSheetTitle = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({className,...props},ref) => (
<SheetPrimitive.Title
ref={ref}
className={cn("text-foreground text-lg font-semibold",className)}
{...props}
/>
))
SheetTitle.displayName = SheetPrimitive.Title.displayName
constSheetDescription = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({className,...props},ref) => (
<SheetPrimitive.Description
ref={ref}
className={cn("text-muted-foreground text-sm",className)}
{...props}
/>
))
SheetDescription.displayName = SheetPrimitive.Description.displayName
export {
Sheet,
SheetClose,
SheetContent,
SheetDescription,
SheetFooter,
SheetHeader,
SheetOverlay,
SheetPortal,
SheetTitle,
SheetTrigger
}

// File: components/ui/skeleton.tsx
import{cn}from "@/lib/utils"
function Skeleton({
className,
...props
}:React.HTMLAttributes<HTMLDivElement>) {
return (
<div
className={cn("bg-muted animate-pulse rounded-md",className)}
{...props}
/>
)
}
export {Skeleton}

// File: components/ui/slider.tsx
"use client"
import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import{cn}from "@/lib/utils"
constSlider = React.forwardRef<
React.ElementRef<typeof SliderPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({className,...props},ref) => (
<SliderPrimitive.Root
ref={ref}
className={cn(
"relative flex w-full touch-none select-none items-center",
className
)}
{...props}
>
<SliderPrimitive.Track className="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full">
<SliderPrimitive.Range className="bg-primary absolute h-full" />
</SliderPrimitive.Track>
<SliderPrimitive.Thumb className="border-primary bg-background ring-offset-background focus-visible:ring-ring block size-5 cursor-grab rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
</SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName
export {Slider}

// File: components/ui/sonner.tsx
"use client"
import{useTheme}from "next-themes"
import{Toaster as Sonner}from "sonner"
typeToasterProps = React.ComponentProps<typeof Sonner>
constToaster = ({...props}:ToasterProps) => {
const{theme = "system"} = useTheme()
return (
<Sonner
theme={theme as ToasterProps["theme"]}
className="toaster group"
toastOptions={{
classNames:{
toast:
"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
description:"group-[.toast]:text-muted-foreground",
actionButton:
"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
cancelButton:
"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
}
}}
{...props}
/>
)
}
export {Toaster}

// File: components/ui/submit-button.tsx
"use client"
import React from "react"
import{useFormStatus}from "react-dom"
import{Button,ButtonProps}from "./button"
constSubmitButton = React.forwardRef<HTMLButtonElement,ButtonProps>(
(props,ref) => {
const{pending} = useFormStatus()
return <Button disabled={pending} ref={ref} {...props} />
}
)
SubmitButton.displayName = "SubmitButton"
export {SubmitButton}

// File: components/ui/switch.tsx
"use client"
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import{cn}from "@/lib/utils"
constSwitch = React.forwardRef<
React.ElementRef<typeof SwitchPrimitives.Root>,
React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({className,...props},ref) => (
<SwitchPrimitives.Root
className={cn(
"focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
className
)}
{...props}
ref={ref}
>
<SwitchPrimitives.Thumb
className={cn(
"bg-background pointer-events-none block size-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
)}
/>
</SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName
export {Switch}

// File: components/ui/table.tsx
import * as React from "react"
import{cn}from "@/lib/utils"
constTable = React.forwardRef<
HTMLTableElement,
React.HTMLAttributes<HTMLTableElement>
>(({className,...props},ref) => (
<div className="relative w-full overflow-auto">
<table
ref={ref}
className={cn("w-full caption-bottom text-sm",className)}
{...props}
/>
</div>
))
Table.displayName = "Table"
constTableHeader = React.forwardRef<
HTMLTableSectionElement,
React.HTMLAttributes<HTMLTableSectionElement>
>(({className,...props},ref) => (
<thead ref={ref} className={cn("[&_tr]:border-b",className)} {...props} />
))
TableHeader.displayName = "TableHeader"
constTableBody = React.forwardRef<
HTMLTableSectionElement,
React.HTMLAttributes<HTMLTableSectionElement>
>(({className,...props},ref) => (
<tbody
ref={ref}
className={cn("[&_tr:last-child]:border-0",className)}
{...props}
/>
))
TableBody.displayName = "TableBody"
constTableFooter = React.forwardRef<
HTMLTableSectionElement,
React.HTMLAttributes<HTMLTableSectionElement>
>(({className,...props},ref) => (
<tfoot
ref={ref}
className={cn(
"bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
className
)}
{...props}
/>
))
TableFooter.displayName = "TableFooter"
constTableRow = React.forwardRef<
HTMLTableRowElement,
React.HTMLAttributes<HTMLTableRowElement>
>(({className,...props},ref) => (
<tr
ref={ref}
className={cn(
"hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
className
)}
{...props}
/>
))
TableRow.displayName = "TableRow"
constTableHead = React.forwardRef<
HTMLTableCellElement,
React.ThHTMLAttributes<HTMLTableCellElement>
>(({className,...props},ref) => (
<th
ref={ref}
className={cn(
"text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
className
)}
{...props}
/>
))
TableHead.displayName = "TableHead"
constTableCell = React.forwardRef<
HTMLTableCellElement,
React.TdHTMLAttributes<HTMLTableCellElement>
>(({className,...props},ref) => (
<td
ref={ref}
className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0",className)}
{...props}
/>
))
TableCell.displayName = "TableCell"
constTableCaption = React.forwardRef<
HTMLTableCaptionElement,
React.HTMLAttributes<HTMLTableCaptionElement>
>(({className,...props},ref) => (
<caption
ref={ref}
className={cn("text-muted-foreground mt-4 text-sm",className)}
{...props}
/>
))
TableCaption.displayName = "TableCaption"
export {
Table,
TableHeader,
TableBody,
TableFooter,
TableHead,
TableRow,
TableCell,
TableCaption
}

// File: components/ui/tabs.tsx
"use client"
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import{cn}from "@/lib/utils"
constTabs = TabsPrimitive.Root
constTabsList = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.List>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({className,...props},ref) => (
<TabsPrimitive.List
ref={ref}
className={cn(
"bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1",
className
)}
{...props}
/>
))
TabsList.displayName = TabsPrimitive.List.displayName
constTabsTrigger = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({className,...props},ref) => (
<TabsPrimitive.Trigger
ref={ref}
className={cn(
"ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
className
)}
{...props}
/>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
constTabsContent = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({className,...props},ref) => (
<TabsPrimitive.Content
ref={ref}
className={cn(
"ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
className
)}
{...props}
/>
))
TabsContent.displayName = TabsPrimitive.Content.displayName
export {Tabs,TabsList,TabsTrigger,TabsContent}

// File: components/ui/textarea-autosize.tsx
import{cn}from "@/lib/utils"
import{FC}from "react"
import ReactTextareaAutosize from "react-textarea-autosize"
interfaceTextareaAutosizeProps {
value:string
onValueChange:(value:string) => void
textareaRef?:React.RefObject<HTMLTextAreaElement>
className?:string
placeholder?:string
minRows?:number
maxRows?:number
maxLength?:number
onKeyDown?:(event:React.KeyboardEvent) => void
onPaste?:(event:React.ClipboardEvent) => void
onCompositionStart?:(event:React.CompositionEvent) => void
onCompositionEnd?:(event:React.CompositionEvent) => void
}
export constTextareaAutosize:FC<TextareaAutosizeProps> = ({
value,
onValueChange,
textareaRef,
className,
placeholder = "",
minRows = 1,
maxRows = 6,
maxLength,
onKeyDown = () => {},
onPaste = () => {},
onCompositionStart = () => {},
onCompositionEnd = () => {}
}) => {
return (
<ReactTextareaAutosize
ref={textareaRef}
className={cn(
"bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border-2 px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
className
)}
minRows={minRows}
maxRows={minRows > maxRows ? minRows :maxRows}
placeholder={placeholder}
value={value}
maxLength={maxLength}
onChange={event => onValueChange(event.target.value)}
onKeyDown={onKeyDown}
onPaste={onPaste}
onCompositionStart={onCompositionStart}
onCompositionEnd={onCompositionEnd}
/>
)
}

// File: components/ui/textarea.tsx
import * as React from "react"
import{cn}from "@/lib/utils"
export interfaceTextareaProps
extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
constTextarea = React.forwardRef<HTMLTextAreaElement,TextareaProps>(
({className,...props},ref) => {
return (
<textarea
className={cn(
"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
className
)}
ref={ref}
{...props}
/>
)
}
)
Textarea.displayName = "Textarea"
export {Textarea}

// File: components/ui/toast.tsx
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import{cva,typeVariantProps}from "class-variance-authority"
import{X}from "lucide-react"
import{cn}from "@/lib/utils"
constToastProvider = ToastPrimitives.Provider
constToastViewport = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Viewport>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({className,...props},ref) => (
<ToastPrimitives.Viewport
ref={ref}
className={cn(
"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
className
)}
{...props}
/>
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName
consttoastVariants = cva(
"data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
{
variants:{
variant:{
default:"bg-background text-foreground border",
destructive:
"destructive border-destructive bg-destructive text-destructive-foreground group"
}
},
defaultVariants:{
variant:"default"
}
}
)
constToast = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Root>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
VariantProps<typeof toastVariants>
>(({className,variant,...props},ref) => {
return (
<ToastPrimitives.Root
ref={ref}
className={cn(toastVariants({variant}),className)}
{...props}
/>
)
})
Toast.displayName = ToastPrimitives.Root.displayName
constToastAction = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Action>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({className,...props},ref) => (
<ToastPrimitives.Action
ref={ref}
className={cn(
"ring-offset-background hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
className
)}
{...props}
/>
))
ToastAction.displayName = ToastPrimitives.Action.displayName
constToastClose = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Close>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({className,...props},ref) => (
<ToastPrimitives.Close
ref={ref}
className={cn(
"text-foreground/50 hover:text-foreground absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
className
)}
toast-close=""
{...props}
>
<X className="size-4" />
</ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName
constToastTitle = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Title>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({className,...props},ref) => (
<ToastPrimitives.Title
ref={ref}
className={cn("text-sm font-semibold",className)}
{...props}
/>
))
ToastTitle.displayName = ToastPrimitives.Title.displayName
constToastDescription = React.forwardRef<
React.ElementRef<typeof ToastPrimitives.Description>,
React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({className,...props},ref) => (
<ToastPrimitives.Description
ref={ref}
className={cn("text-sm opacity-90",className)}
{...props}
/>
))
ToastDescription.displayName = ToastPrimitives.Description.displayName
typeToastProps = React.ComponentPropsWithoutRef<typeof Toast>
typeToastActionElement = React.ReactElement<typeof ToastAction>
export {
typeToastProps,
typeToastActionElement,
ToastProvider,
ToastViewport,
Toast,
ToastTitle,
ToastDescription,
ToastClose,
ToastAction
}

// File: components/ui/toaster.tsx
"use client"
import{
Toast,
ToastClose,
ToastDescription,
ToastProvider,
ToastTitle,
ToastViewport
}from "@/components/ui/toast"
import{useToast}from "@/components/ui/use-toast"
export function Toaster() {
const{toasts} = useToast()
return (
<ToastProvider>
{toasts.map(function ({id,title,description,action,...props}) {
return (
<Toast key={id} {...props}>
<div className="grid gap-1">
{title && <ToastTitle>{title}</ToastTitle>}
{description && (
<ToastDescription>{description}</ToastDescription>
)}
</div>
{action}
<ToastClose />
</Toast>
)
})}
<ToastViewport />
</ToastProvider>
)
}

// File: components/ui/toggle-group.tsx
"use client"
import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import{VariantProps}from "class-variance-authority"
import{cn}from "@/lib/utils"
import{toggleVariants}from "@/components/ui/toggle"
constToggleGroupContext = React.createContext<
VariantProps<typeof toggleVariants>
>({
size:"default",
variant:"default"
})
constToggleGroup = React.forwardRef<
React.ElementRef<typeof ToggleGroupPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
VariantProps<typeof toggleVariants>
>(({className,variant,size,children,...props},ref) => (
<ToggleGroupPrimitive.Root
ref={ref}
className={cn("flex items-center justify-center gap-1",className)}
{...props}
>
<ToggleGroupContext.Provider value={{variant,size}}>
{children}
</ToggleGroupContext.Provider>
</ToggleGroupPrimitive.Root>
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName
constToggleGroupItem = React.forwardRef<
React.ElementRef<typeof ToggleGroupPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
VariantProps<typeof toggleVariants>
>(({className,children,variant,size,...props},ref) => {
constcontext = React.useContext(ToggleGroupContext)
return (
<ToggleGroupPrimitive.Item
ref={ref}
className={cn(
toggleVariants({
variant:context.variant || variant,
size:context.size || size
}),
className
)}
{...props}
>
{children}
</ToggleGroupPrimitive.Item>
)
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName
export {ToggleGroup,ToggleGroupItem}

// File: components/ui/toggle.tsx
"use client"
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import{cva,typeVariantProps}from "class-variance-authority"
import{cn}from "@/lib/utils"
consttoggleVariants = cva(
"ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:ring-ring data-[state=on]:bg-accent data-[state=on]:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
{
variants:{
variant:{
default:"bg-transparent",
outline:
"border-input hover:bg-accent hover:text-accent-foreground border bg-transparent"
},
size:{
default:"h-10 px-3",
sm:"h-9 px-2.5",
lg:"h-11 px-5"
}
},
defaultVariants:{
variant:"default",
size:"default"
}
}
)
constToggle = React.forwardRef<
React.ElementRef<typeof TogglePrimitive.Root>,
React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
VariantProps<typeof toggleVariants>
>(({className,variant,size,...props},ref) => (
<TogglePrimitive.Root
ref={ref}
className={cn(toggleVariants({variant,size,className}))}
{...props}
/>
))
Toggle.displayName = TogglePrimitive.Root.displayName
export {Toggle,toggleVariants}

// File: components/ui/tooltip.tsx
"use client"
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import{cn}from "@/lib/utils"
constTooltipProvider = TooltipPrimitive.Provider
constTooltip = TooltipPrimitive.Root
constTooltipTrigger = TooltipPrimitive.Trigger
constTooltipContent = React.forwardRef<
React.ElementRef<typeof TooltipPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({className,sideOffset = 4,...props},ref) => (
<TooltipPrimitive.Content
ref={ref}
sideOffset={sideOffset}
className={cn(
"bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md",
className
)}
{...props}
/>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName
export {Tooltip,TooltipTrigger,TooltipContent,TooltipProvider}

// File: components/ui/use-toast.ts

import * as React from "react"
import type{ToastActionElement,ToastProps}from "@/components/ui/toast"
constTOAST_LIMIT = 1
constTOAST_REMOVE_DELAY = 1000000
typeToasterToast = ToastProps & {
id:string
title?:React.ReactNode
description?:React.ReactNode
action?:ToastActionElement
}
constactionTypes = {
ADD_TOAST:"ADD_TOAST",
UPDATE_TOAST:"UPDATE_TOAST",
DISMISS_TOAST:"DISMISS_TOAST",
REMOVE_TOAST:"REMOVE_TOAST"
} as const
letcount = 0
function genId() {
count = (count + 1) % Number.MAX_VALUE
return count.toString()
}
typeActionType = typeof actionTypes
typeAction =
| {
type:ActionType["ADD_TOAST"]
toast:ToasterToast
}
| {
type:ActionType["UPDATE_TOAST"]
toast:Partial<ToasterToast>
}
| {
type:ActionType["DISMISS_TOAST"]
toastId?:ToasterToast["id"]
}
| {
type:ActionType["REMOVE_TOAST"]
toastId?:ToasterToast["id"]
}
interfaceState {
toasts:ToasterToast[]
}
consttoastTimeouts = new Map<string,ReturnType<typeof setTimeout>>()
constaddToRemoveQueue = (toastId:string) => {
if (toastTimeouts.has(toastId)) {
return
}
consttimeout = setTimeout(() => {
toastTimeouts.delete(toastId)
dispatch({
type:"REMOVE_TOAST",
toastId:toastId
})
},TOAST_REMOVE_DELAY)
toastTimeouts.set(toastId,timeout)
}
export constreducer = (state:State,action:Action):State => {
switch (action.type) {
case "ADD_TOAST":
return {
...state,
toasts:[action.toast,...state.toasts].slice(0,TOAST_LIMIT)
}
case "UPDATE_TOAST":
return {
...state,
toasts:state.toasts.map(t =>
t.id === action.toast.id ? {...t,...action.toast} :t
)
}
case "DISMISS_TOAST":{
const{toastId} = action


if (toastId) {
addToRemoveQueue(toastId)
} else {
state.toasts.forEach(toast => {
addToRemoveQueue(toast.id)
})
}
return {
...state,
toasts:state.toasts.map(t =>
t.id === toastId || toastId === undefined
? {
...t,
open:false
}
:t
)
}
}
case "REMOVE_TOAST":
if (action.toastId === undefined) {
return {
...state,
toasts:[]
}
}
return {
...state,
toasts:state.toasts.filter(t => t.id !== action.toastId)
}
}
}
constlisteners:Array<(state:State) => void> = []
letmemoryState:State = {toasts:[]}
function dispatch(action:Action) {
memoryState = reducer(memoryState,action)
listeners.forEach(listener => {
listener(memoryState)
})
}
typeToast = Omit<ToasterToast,"id">
function toast({...props}:Toast) {
constid = genId()
constupdate = (props:ToasterToast) =>
dispatch({
type:"UPDATE_TOAST",
toast:{...props,id}
})
constdismiss = () => dispatch({type:"DISMISS_TOAST",toastId:id})
dispatch({
type:"ADD_TOAST",
toast:{
...props,
id,
open:true,
onOpenChange:open => {
if (!open) dismiss()
}
}
})
return {
id:id,
dismiss,
update
}
}
function useToast() {
const[state,setState] = React.useState<State>(memoryState)
React.useEffect(() => {
listeners.push(setState)
return () => {
constindex = listeners.indexOf(setState)
if (index > -1) {
listeners.splice(index,1)
}
}
},[state])
return {
...state,
toast,
dismiss:(toastId?:string) => dispatch({type:"DISMISS_TOAST",toastId})
}
}
export {useToast,toast}

// File: components/ui/with-tooltip.tsx
import{FC}from "react"
import{
Tooltip,
TooltipContent,
TooltipProvider,
TooltipTrigger
}from "./tooltip"
interfaceWithTooltipProps {
display:React.ReactNode
trigger:React.ReactNode
delayDuration?:number
side?:"left" | "right" | "top" | "bottom"
}
export constWithTooltip:FC<WithTooltipProps> = ({
display,
trigger,
delayDuration = 500,
side = "right"
}) => {
return (
<TooltipProvider delayDuration={delayDuration}>
<Tooltip>
<TooltipTrigger>{trigger}</TooltipTrigger>
<TooltipContent side={side}>{display}</TooltipContent>
</Tooltip>
</TooltipProvider>
)
}

// File: components/utility/alerts.tsx
import{
Popover,
PopoverContent,
PopoverTrigger
}from "@/components/ui/popover"
import{IconBell}from "@tabler/icons-react"
import{FC}from "react"
import{SIDEBAR_ICON_SIZE}from "../sidebar/sidebar-switcher"
interfaceAlertsProps {}
export constAlerts:FC<AlertsProps> = () => {
return (
<Popover>
<PopoverTrigger asChild>
<div className="relative cursor-pointer hover:opacity-50">
<IconBell size={SIDEBAR_ICON_SIZE} />
{1 > 0 && (
<span className="notification-indicator absolute right-[-4px] top-[-4px] flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
1
</span>
)}
</div>
</PopoverTrigger>
<PopoverContent className="mb-2 w-80">
<div>placeholder</div>
</PopoverContent>
</Popover>
)
}

// File: components/utility/announcements.tsx
import{Button}from "@/components/ui/button"
import{
Popover,
PopoverContent,
PopoverTrigger
}from "@/components/ui/popover"
import{Announcement}from "@/types/announcement"
import{IconExternalLink,IconSpeakerphone}from "@tabler/icons-react"
import{FC,useEffect,useState}from "react"
import{SIDEBAR_ICON_SIZE}from "../sidebar/sidebar-switcher"
interfaceAnnouncementsProps {}
export constAnnouncements:FC<AnnouncementsProps> = () => {
const[announcements,setAnnouncements] = useState<Announcement[]>([])
useEffect(() => {

conststoredAnnouncements = localStorage.getItem("announcements")
letparsedAnnouncements:Announcement[] = []
if (storedAnnouncements) {
parsedAnnouncements = JSON.parse(storedAnnouncements)
}

constvalidAnnouncements = announcements.filter((a:Announcement) =>
parsedAnnouncements.find(storedA => storedA.id === a.id)
)

constnewAnnouncements = announcements.filter(
(a:Announcement) =>
!parsedAnnouncements.find(storedA => storedA.id === a.id)
)

constcombinedAnnouncements = [...validAnnouncements,...newAnnouncements]

constupdatedAnnouncements = combinedAnnouncements.map(
(a:Announcement) => {
conststoredAnnouncement = parsedAnnouncements.find(
(storedA:Announcement) => storedA.id === a.id
)
return storedAnnouncement?.read ? {...a,read:true} :a
}
)

setAnnouncements(updatedAnnouncements)
localStorage.setItem("announcements",JSON.stringify(updatedAnnouncements))
},[])
constunreadCount = announcements.filter(a => !a.read).length
constmarkAsRead = (id:string) => {

constupdatedAnnouncements = announcements.map(a =>
a.id === id ? {...a,read:true} :a
)
setAnnouncements(updatedAnnouncements)
localStorage.setItem("announcements",JSON.stringify(updatedAnnouncements))
}
constmarkAllAsRead = () => {

constupdatedAnnouncements = announcements.map(a => ({...a,read:true}))
setAnnouncements(updatedAnnouncements)
localStorage.setItem("announcements",JSON.stringify(updatedAnnouncements))
}
constmarkAllAsUnread = () => {

constupdatedAnnouncements = announcements.map(a => ({...a,read:false}))
setAnnouncements(updatedAnnouncements)
localStorage.setItem("announcements",JSON.stringify(updatedAnnouncements))
}
return (
<Popover>
<PopoverTrigger asChild>
<div className="relative cursor-pointer hover:opacity-50">
<IconSpeakerphone size={SIDEBAR_ICON_SIZE} />
{unreadCount > 0 && (
<div className="notification-indicator absolute right-[-4px] top-[-4px] flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
{unreadCount}
</div>
)}
</div>
</PopoverTrigger>
<PopoverContent className="mb-2 w-80" side="top">
<div className="grid gap-4">
<div>
<div className="mb-4 text-left text-xl font-bold leading-none">
Updates
</div>
<div className="grid space-y-4">
{announcements
.filter(a => !a.read)
.map((a:Announcement) => (
<div key={a.id}>
<div className="block select-none rounded-md border p-3">
<div className="flex items-center justify-between">
<div className="text-sm font-medium leading-none">
{a.title}
</div>
<div className="text-muted-foreground text-xs leading-snug">
{a.date}
</div>
</div>
<div className="text-muted-foreground mt-3 text-sm leading-snug">
{a.content}
</div>
<div className="mt-3 space-x-2">
<Button
className="h-[26px] text-xs"
size="sm"
onClick={() => markAsRead(a.id)}
>
Mark as Read
</Button>
{a.link && (
<a href={a.link} target="_blank" rel="noreferrer">
<Button className="h-[26px] text-xs" size="sm">
Demo{" "}
<IconExternalLink className="ml-1" size={14} />
</Button>
</a>
)}
</div>
</div>
</div>
))}
</div>
<div className="mt-1">
{unreadCount > 0 ? (
<Button
className="mt-2"
variant="outline"
onClick={markAllAsRead}
>
Mark All as Read
</Button>
) :(
<div className="text-muted-foreground text-sm leading-snug">
You are all caught up!
{announcements.length > 0 && (
<div
className="mt-6 cursor-pointer underline"
onClick={() => markAllAsUnread()}
>
Show recent updates
</div>
)}
</div>
)}
</div>
</div>
</div>
</PopoverContent>
</Popover>
)
}

// File: components/utility/change-password.tsx
"use client"
import{supabase}from "@/lib/supabase/browser-client"
import{useRouter}from "next/navigation"
import{FC,useState}from "react"
import{Button}from "../ui/button"
import{
Dialog,
DialogContent,
DialogFooter,
DialogHeader,
DialogTitle
}from "../ui/dialog"
import{Input}from "../ui/input"
import{toast}from "sonner"
interfaceChangePasswordProps {}
export constChangePassword:FC<ChangePasswordProps> = () => {
constrouter = useRouter()
const[newPassword,setNewPassword] = useState("")
const[confirmPassword,setConfirmPassword] = useState("")
consthandleResetPassword = async () => {
if (!newPassword) return toast.info("Please enter your new password.")
await supabase.auth.updateUser({password:newPassword})
toast.success("Password changed successfully.")
return router.push("/login")
}
return (
<Dialog open={true}>
<DialogContent className="h-[240px] w-[400px] p-4">
<DialogHeader>
<DialogTitle>Change Password</DialogTitle>
</DialogHeader>
<Input
id="password"
placeholder="New Password"
type="password"
value={newPassword}
onChange={e => setNewPassword(e.target.value)}
/>
<Input
id="confirmPassword"
placeholder="Confirm New Password"
type="password"
value={confirmPassword}
onChange={e => setConfirmPassword(e.target.value)}
/>
<DialogFooter>
<Button onClick={handleResetPassword}>Confirm Change</Button>
</DialogFooter>
</DialogContent>
</Dialog>
)
}

// File: components/utility/command-k.tsx
import{ChatbotUIContext}from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import{IconLoader2,IconSend}from "@tabler/icons-react"
import{FC,useContext,useState}from "react"
import{Dialog,DialogContent}from "../ui/dialog"
import{TextareaAutosize}from "../ui/textarea-autosize"
interfaceCommandKProps {}
export constCommandK:FC<CommandKProps> = ({}) => {
useHotkey("k",() => setIsOpen(prevState => !prevState))
const{profile} = useContext(ChatbotUIContext)
const[isOpen,setIsOpen] = useState(false)
const[value,setValue] = useState("")
const[loading,setLoading] = useState(false)
const[content,setContent] = useState("")
consthandleCommandK = async () => {
setLoading(true)
constresponse = await fetch("/api/command",{
method:"POST",
body:JSON.stringify({
input:value
})
})
constdata = await response.json()
setContent(data.content)
setLoading(false)
setValue("")
}
consthandleKeyDown = (e:React.KeyboardEvent) => {
if (e.key === "Enter" && !e.shiftKey) {
e.preventDefault()
handleCommandK()
}
}
if (!profile) return null
return (
isOpen && (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
<DialogContent onKeyDown={handleKeyDown}>
{profile.openai_api_key ? (
<div className="space-y-2">
<div>{content}</div>
<div>turn dark mode on.</div>
<div>find my sql chat</div>
<div>i need a new assistant</div>
<div>start a chat with my 2024 resolutions file</div>
<div className="border-input relative flex min-h-[50px] w-full items-center justify-center rounded-xl border-2">
<TextareaAutosize
className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-3 py-2 pr-14 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
placeholder="create a prompt for writing sql code"
value={value}
onValueChange={setValue}
/>
{loading ? (
<IconLoader2
className="absolute bottom-[8px] right-3 animate-spin cursor-pointer rounded p-1 hover:opacity-50"
size={30}
/>
) :(
<IconSend
className="bg-primary text-secondary absolute bottom-[8px] right-3 cursor-pointer rounded p-1 hover:opacity-50"
onClick={handleCommandK}
size={30}
/>
)}
</div>
</div>
) :(
<div>Add your OpenAI API key in the settings to unlock CMD+K.</div>
)}
</DialogContent>
</Dialog>
)
)
}

// File: components/utility/drawing-canvas.tsx
import{ChatbotUIContext}from "@/context/context"
import{MessageImage}from "@/types"
import{FC,MouseEvent,useContext,useEffect,useRef,useState}from "react"
interfaceDrawingCanvasProps {
imageItem:MessageImage
}
export constDrawingCanvas:FC<DrawingCanvasProps> = ({imageItem}) => {
const{setNewMessageImages} = useContext(ChatbotUIContext)
constcanvasRef = useRef<HTMLCanvasElement>(null)
const[isDrawing,setIsDrawing] = useState(false)
useEffect(() => {
constcanvas = canvasRef.current
constparentElement = canvas?.parentElement
if (canvas && parentElement) {
constcontext = canvas.getContext("2d")
constimage = new Image()
image.onload = () => {
constaspectRatio = image.width / image.height
letnewWidth = parentElement.clientWidth
letnewHeight = newWidth / aspectRatio
if (newHeight > parentElement.clientHeight) {
newHeight = parentElement.clientHeight
newWidth = newHeight * aspectRatio
}
canvas.width = newWidth
canvas.height = newHeight
context?.drawImage(image,0,0,newWidth,newHeight)
}
image.src = imageItem.url
}
},[imageItem.url])
conststartDrawing = ({nativeEvent}:MouseEvent) => {
const{offsetX,offsetY} = nativeEvent
constcontext = canvasRef.current?.getContext("2d")
if (context) {
context.strokeStyle = "red"
context.lineWidth = 2
}
context?.beginPath()
context?.moveTo(offsetX,offsetY)
setIsDrawing(true)
}
constdraw = ({nativeEvent}:MouseEvent) => {
if (!isDrawing) {
return
}
const{offsetX,offsetY} = nativeEvent
constcontext = canvasRef.current?.getContext("2d")
context?.lineTo(offsetX,offsetY)
context?.stroke()
}
constfinishDrawing = () => {
constcanvas = canvasRef.current
constcontext = canvas?.getContext("2d")
context?.closePath()
setIsDrawing(false)
if (canvas) {
constdataURL = canvas.toDataURL("image/png")
fetch(dataURL)
.then(res => res.blob())
.then(blob => {
constnewImageFile = new File([blob],"drawing.png",{
type:"image/png"
})
setNewMessageImages(prevImages => {
return prevImages.map(img => {
if (img.url === imageItem.url) {
return {...img,base64:dataURL,file:newImageFile}
}
return img
})
})
})
}
}
return (
<canvas
ref={canvasRef}
className="cursor-crosshair rounded"
width={2000}
height={2000}
onMouseDown={startDrawing}
onMouseUp={finishDrawing}
onMouseMove={draw}
onMouseLeave={finishDrawing}
style={{
maxHeight:"67vh",
maxWidth:"67vw"
}}
/>
)
}

// File: components/utility/global-state.tsx
"use client"
import{ChatbotUIContext}from "@/context/context"
import{getProfileByUserId}from "@/db/profile"
import{getWorkspaceImageFromStorage}from "@/db/storage/workspace-images"
import{getWorkspacesByUserId}from "@/db/workspaces"
import{convertBlobToBase64}from "@/lib/blob-to-b64"
import{
fetchHostedModels,
fetchOllamaModels,
fetchOpenRouterModels
}from "@/lib/models/fetch-models"
import{supabase}from "@/lib/supabase/browser-client"
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
import{useRouter}from "next/navigation"
import{FC,useEffect,useState}from "react"
interfaceGlobalStateProps {
children:React.ReactNode
}
export constGlobalState:FC<GlobalStateProps> = ({children}) => {
constrouter = useRouter()

const[profile,setProfile] = useState<Tables<"profiles"> | null>(null)

const[assistants,setAssistants] = useState<Tables<"assistants">[]>([])
const[collections,setCollections] = useState<Tables<"collections">[]>([])
const[chats,setChats] = useState<Tables<"chats">[]>([])
const[files,setFiles] = useState<Tables<"files">[]>([])
const[folders,setFolders] = useState<Tables<"folders">[]>([])
const[models,setModels] = useState<Tables<"models">[]>([])
const[presets,setPresets] = useState<Tables<"presets">[]>([])
const[prompts,setPrompts] = useState<Tables<"prompts">[]>([])
const[tools,setTools] = useState<Tables<"tools">[]>([])
const[workspaces,setWorkspaces] = useState<Tables<"workspaces">[]>([])

const[envKeyMap,setEnvKeyMap] = useState<Record<string,VALID_ENV_KEYS>>({})
const[availableHostedModels,setAvailableHostedModels] = useState<LLM[]>([])
const[availableLocalModels,setAvailableLocalModels] = useState<LLM[]>([])
const[availableOpenRouterModels,setAvailableOpenRouterModels] = useState<
OpenRouterLLM[]
>([])

const[selectedWorkspace,setSelectedWorkspace] =
useState<Tables<"workspaces"> | null>(null)
const[workspaceImages,setWorkspaceImages] = useState<WorkspaceImage[]>([])

const[selectedPreset,setSelectedPreset] =
useState<Tables<"presets"> | null>(null)

const[selectedAssistant,setSelectedAssistant] =
useState<Tables<"assistants"> | null>(null)
const[assistantImages,setAssistantImages] = useState<AssistantImage[]>([])
const[openaiAssistants,setOpenaiAssistants] = useState<any[]>([])

const[userInput,setUserInput] = useState<string>("")
const[chatMessages,setChatMessages] = useState<ChatMessage[]>([])
const[chatSettings,setChatSettings] = useState<ChatSettings>({
model:"gpt-4-turbo-preview",
prompt:"You are a helpful AI assistant.",
temperature:0.5,
contextLength:4000,
includeProfileContext:true,
includeWorkspaceInstructions:true,
embeddingsProvider:"openai"
})
const[selectedChat,setSelectedChat] = useState<Tables<"chats"> | null>(null)
const[chatFileItems,setChatFileItems] = useState<Tables<"file_items">[]>([])

const[isGenerating,setIsGenerating] = useState<boolean>(false)
const[firstTokenReceived,setFirstTokenReceived] = useState<boolean>(false)
const[abortController,setAbortController] =
useState<AbortController | null>(null)

const[isPromptPickerOpen,setIsPromptPickerOpen] = useState(false)
const[slashCommand,setSlashCommand] = useState("")
const[isFilePickerOpen,setIsFilePickerOpen] = useState(false)
const[hashtagCommand,setHashtagCommand] = useState("")
const[isToolPickerOpen,setIsToolPickerOpen] = useState(false)
const[toolCommand,setToolCommand] = useState("")
const[focusPrompt,setFocusPrompt] = useState(false)
const[focusFile,setFocusFile] = useState(false)
const[focusTool,setFocusTool] = useState(false)
const[focusAssistant,setFocusAssistant] = useState(false)
const[atCommand,setAtCommand] = useState("")
const[isAssistantPickerOpen,setIsAssistantPickerOpen] = useState(false)

const[chatFiles,setChatFiles] = useState<ChatFile[]>([])
const[chatImages,setChatImages] = useState<MessageImage[]>([])
const[newMessageFiles,setNewMessageFiles] = useState<ChatFile[]>([])
const[newMessageImages,setNewMessageImages] = useState<MessageImage[]>([])
const[showFilesDisplay,setShowFilesDisplay] = useState<boolean>(false)

const[useRetrieval,setUseRetrieval] = useState<boolean>(true)
const[sourceCount,setSourceCount] = useState<number>(4)

const[selectedTools,setSelectedTools] = useState<Tables<"tools">[]>([])
const[toolInUse,setToolInUse] = useState<string>("none")
useEffect(() => {
;(async () => {
constprofile = await fetchStartingData()
if (profile) {
consthostedModelRes = await fetchHostedModels(profile)
if (!hostedModelRes) return
setEnvKeyMap(hostedModelRes.envKeyMap)
setAvailableHostedModels(hostedModelRes.hostedModels)
if (
profile["openrouter_api_key"] ||
hostedModelRes.envKeyMap["openrouter"]
) {
constopenRouterModels = await fetchOpenRouterModels()
if (!openRouterModels) return
setAvailableOpenRouterModels(openRouterModels)
}
}
if (process.env.NEXT_PUBLIC_OLLAMA_URL) {
constlocalModels = await fetchOllamaModels()
if (!localModels) return
setAvailableLocalModels(localModels)
}
})()
},[])
constfetchStartingData = async () => {
constsession = (await supabase.auth.getSession()).data.session
if (session) {
constuser = session.user
constprofile = await getProfileByUserId(user.id)
setProfile(profile)
if (!profile.has_onboarded) {
return router.push("/setup")
}
constworkspaces = await getWorkspacesByUserId(user.id)
setWorkspaces(workspaces)
for (constworkspace of workspaces) {
letworkspaceImageUrl = ""
if (workspace.image_path) {
workspaceImageUrl =
(await getWorkspaceImageFromStorage(workspace.image_path)) || ""
}
if (workspaceImageUrl) {
constresponse = await fetch(workspaceImageUrl)
constblob = await response.blob()
constbase64 = await convertBlobToBase64(blob)
setWorkspaceImages(prev => [
...prev,
{
workspaceId:workspace.id,
path:workspace.image_path,
base64:base64,
url:workspaceImageUrl
}
])
}
}
return profile
}
}
return (
<ChatbotUIContext.Provider
value={{

profile,
setProfile,

assistants,
setAssistants,
collections,
setCollections,
chats,
setChats,
files,
setFiles,
folders,
setFolders,
models,
setModels,
presets,
setPresets,
prompts,
setPrompts,
tools,
setTools,
workspaces,
setWorkspaces,

envKeyMap,
setEnvKeyMap,
availableHostedModels,
setAvailableHostedModels,
availableLocalModels,
setAvailableLocalModels,
availableOpenRouterModels,
setAvailableOpenRouterModels,

selectedWorkspace,
setSelectedWorkspace,
workspaceImages,
setWorkspaceImages,

selectedPreset,
setSelectedPreset,

selectedAssistant,
setSelectedAssistant,
assistantImages,
setAssistantImages,
openaiAssistants,
setOpenaiAssistants,

userInput,
setUserInput,
chatMessages,
setChatMessages,
chatSettings,
setChatSettings,
selectedChat,
setSelectedChat,
chatFileItems,
setChatFileItems,

isGenerating,
setIsGenerating,
firstTokenReceived,
setFirstTokenReceived,
abortController,
setAbortController,

isPromptPickerOpen,
setIsPromptPickerOpen,
slashCommand,
setSlashCommand,
isFilePickerOpen,
setIsFilePickerOpen,
hashtagCommand,
setHashtagCommand,
isToolPickerOpen,
setIsToolPickerOpen,
toolCommand,
setToolCommand,
focusPrompt,
setFocusPrompt,
focusFile,
setFocusFile,
focusTool,
setFocusTool,
focusAssistant,
setFocusAssistant,
atCommand,
setAtCommand,
isAssistantPickerOpen,
setIsAssistantPickerOpen,

chatFiles,
setChatFiles,
chatImages,
setChatImages,
newMessageFiles,
setNewMessageFiles,
newMessageImages,
setNewMessageImages,
showFilesDisplay,
setShowFilesDisplay,

useRetrieval,
setUseRetrieval,
sourceCount,
setSourceCount,

selectedTools,
setSelectedTools,
toolInUse,
setToolInUse
}}
>
{children}
</ChatbotUIContext.Provider>
)
}

