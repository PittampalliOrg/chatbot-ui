// File: components/chat/chat-input.tsx
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { cn } from "@/lib/utils"
import {
  IconBolt,
  IconCirclePlus,
  IconPlayerStopFilled,
  IconSend
} from "@tabler/icons-react"
import Image from "next/image"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { ChatCommandInput } from "./chat-command-input"
import { ChatFilesDisplay } from "./chat-files-display"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { useChatHistoryHandler } from "./chat-hooks/use-chat-history"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"
import { useSelectFileHandler } from "./chat-hooks/use-select-file-handler"

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = ({}) => {
  const { t } = useTranslation()

  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const [isTyping, setIsTyping] = useState<boolean>(false)

  const {
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

  const {
    chatInputRef,
    handleSendMessage,
    handleStopMessage,
    handleFocusChatInput
  } = useChatHandler()

  const { handleInputChange } = usePromptAndCommand()

  const { filesToAccept, handleSelectDeviceFile } = useSelectFileHandler()

  const {
    setNewMessageContentToNextUserMessage,
    setNewMessageContentToPreviousUserMessage
  } = useChatHistoryHandler()

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => {
      handleFocusChatInput()
    }, 200) // FIX: hacky
  }, [selectedPreset, selectedAssistant])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      setIsPromptPickerOpen(false)
      handleSendMessage(userInput, chatMessages, false)
    }

    // Consolidate conditions to avoid TypeScript error
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
        // Toggle focus based on picker type
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

    //use shift+ctrl+up and shift+ctrl+down to navigate through chat history
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

  const handlePaste = (event: React.ClipboardEvent) => {
    const imagesAllowed = LLM_LIST.find(
      llm => llm.modelId === chatSettings?.model
    )?.imageInput

    const items = event.clipboardData.items
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        if (!imagesAllowed) {
          toast.error(
            `Images are not supported for this model. Use models like GPT-4 Vision instead.`
          )
          return
        }
        const file = item.getAsFile()
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
          selectedTools.map((tool, index) => (
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

          {/* Hidden input to select files from device */}
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
            // `Ask anything. Type "@" for assistants, "/" for prompts, "#" for files, and "!" for tools.`
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
          ) : (
            <IconSend
              className={cn(
                "bg-primary text-secondary rounded p-1",
                !userInput && "cursor-not-allowed opacity-50"
              )}
              onClick={() => {
                if (!userInput) return

                handleSendMessage(userInput, chatMessages, false)
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
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { FC, useContext, useState } from "react"
import { Message } from "../messages/message"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { chatMessages, chatFileItems } = useContext(ChatbotUIContext)

  const { handleSendEdit } = useChatHandler()

  const [editingMessage, setEditingMessage] = useState<Tables<"messages">>()

  return chatMessages
    .sort((a, b) => a.message.sequence_number - b.message.sequence_number)
    .map((chatMessage, index, array) => {
      const messageFileItems = chatFileItems.filter(
        (chatFileItem, _, self) =>
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

// File: components/chat/chat-ui.tsx
import Loading from "@/app/[locale]/loading"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { getAssistantToolsByAssistantId } from "@/db/assistant-tools"
import { getChatFilesByChatId } from "@/db/chat-files"
import { getChatById } from "@/db/chats"
import { getMessageFileItemsByMessageId } from "@/db/message-file-items"
import { getMessagesByChatId } from "@/db/messages"
import { getMessageImageFromStorage } from "@/db/storage/message-images"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLMID, MessageImage } from "@/types"
import { useParams } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { ChatHelp } from "./chat-help"
import { useScroll } from "./chat-hooks/use-scroll"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { ChatScrollButtons } from "./chat-scroll-buttons"
import { ChatSecondaryButtons } from "./chat-secondary-buttons"

interface ChatUIProps {}

export const ChatUI: FC<ChatUIProps> = ({}) => {
  useHotkey("o", () => handleNewChat())

  const params = useParams()

  const {
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

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const {
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

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
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
  }, [])

  const fetchMessages = async () => {
    const fetchedMessages = await getMessagesByChatId(params.chatid as string)

    const imagePromises: Promise<MessageImage>[] = fetchedMessages.flatMap(
      message =>
        message.image_paths
          ? message.image_paths.map(async imagePath => {
              const url = await getMessageImageFromStorage(imagePath)

              if (url) {
                const response = await fetch(url)
                const blob = await response.blob()
                const base64 = await convertBlobToBase64(blob)

                return {
                  messageId: message.id,
                  path: imagePath,
                  base64,
                  url,
                  file: null
                }
              }

              return {
                messageId: message.id,
                path: imagePath,
                base64: "",
                url,
                file: null
              }
            })
          : []
    )

    const images: MessageImage[] = await Promise.all(imagePromises.flat())
    setChatImages(images)

    const messageFileItemPromises = fetchedMessages.map(
      async message => await getMessageFileItemsByMessageId(message.id)
    )

    const messageFileItems = await Promise.all(messageFileItemPromises)

    const uniqueFileItems = messageFileItems.flatMap(item => item.file_items)
    setChatFileItems(uniqueFileItems)

    const chatFiles = await getChatFilesByChatId(params.chatid as string)

    setChatFiles(
      chatFiles.files.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        file: null
      }))
    )

    setUseRetrieval(true)
    setShowFilesDisplay(true)

    const fetchedChatMessages = fetchedMessages.map(message => {
      return {
        message,
        fileItems: messageFileItems
          .filter(messageFileItem => messageFileItem.id === message.id)
          .flatMap(messageFileItem =>
            messageFileItem.file_items.map(fileItem => fileItem.id)
          )
      }
    })

    setChatMessages(fetchedChatMessages)
  }

  const fetchChat = async () => {
    const chat = await getChatById(params.chatid as string)
    if (!chat) return

    if (chat.assistant_id) {
      const assistant = assistants.find(
        assistant => assistant.id === chat.assistant_id
      )

      if (assistant) {
        setSelectedAssistant(assistant)

        const assistantTools = (
          await getAssistantToolsByAssistantId(assistant.id)
        ).tools
        setSelectedTools(assistantTools)
      }
    }

    setSelectedChat(chat)
    setChatSettings({
      model: chat.model as LLMID,
      prompt: chat.prompt,
      temperature: chat.temperature,
      contextLength: chat.context_length,
      includeProfileContext: chat.include_profile_context,
      includeWorkspaceInstructions: chat.include_workspace_instructions,
      embeddingsProvider: chat.embeddings_provider as "openai" | "local"
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

// File: app/actions.tsx
import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase
} from '@/components/stocks'

import { z } from 'zod'
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { Events } from '@/components/stocks/events'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { Stocks } from '@/components/stocks/stocks'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    initial: <SpinnerMessage />,
    system: `\
    You are a stock trading conversation bot and you can help users buy stocks, step by step.
    You and the user can discuss stock prices and the user can adjust the amount of stocks they want to buy, or place an order, in the UI.
    
    Messages inside [] means that it's a UI element or a user event. For example:
    - "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
    - "[User has changed the amount of AAPL to 10]" means that the user has changed the amount of AAPL to 10 in the UI.
    
    If the user requests purchasing a stock, call \`show_stock_purchase_ui\` to show the purchase UI.
    If the user just wants the price, call \`show_stock_price\` to show the price.
    If you want to show trending stocks, call \`list_stocks\`.
    If you want to show events, call \`get_events\`.
    If the user wants to sell stock, or complete another impossible task, respond that you are a demo and cannot do that.
    
    Besides that, you can also chat with users and do some calculations if needed.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    tools: {
      listStocks: {
        description: 'List three imaginary stocks that are trending.',
        parameters: z.object({
          stocks: z.array(
            z.object({
              symbol: z.string().describe('The symbol of the stock'),
              price: z.number().describe('The price of the stock'),
              delta: z.number().describe('The change in price of the stock')
            })
          )
        }),
        generate: async function* ({ stocks }) {
          yield (
            <BotCard>
              <StocksSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'listStocks',
                    toolCallId,
                    args: { stocks }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'listStocks',
                    toolCallId,
                    result: stocks
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Stocks props={stocks} />
            </BotCard>
          )
        }
      },
      showStockPrice: {
        description:
          'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
            ),
          price: z.number().describe('The price of the stock.'),
          delta: z.number().describe('The change in price of the stock')
        }),
        generate: async function* ({ symbol, price, delta }) {
          yield (
            <BotCard>
              <StockSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'showStockPrice',
                    toolCallId,
                    args: { symbol, price, delta }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'showStockPrice',
                    toolCallId,
                    result: { symbol, price, delta }
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Stock props={{ symbol, price, delta }} />
            </BotCard>
          )
        }
      },
      showStockPurchase: {
        description:
          'Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
            ),
          price: z.number().describe('The price of the stock.'),
          numberOfShares: z
            .number()
            .optional()
            .describe(
              'The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it.'
            )
        }),
        generate: async function* ({ symbol, price, numberOfShares = 100 }) {
          const toolCallId = nanoid()

          if (numberOfShares <= 0 || numberOfShares > 1000) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      args: { symbol, price, numberOfShares }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      result: {
                        symbol,
                        price,
                        numberOfShares,
                        status: 'expired'
                      }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'system',
                  content: `[User has selected an invalid amount]`
                }
              ]
            })

            return <BotMessage content={'Invalid amount'} />
          } else {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      args: { symbol, price, numberOfShares }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      result: {
                        symbol,
                        price,
                        numberOfShares
                      }
                    }
                  ]
                }
              ]
            })

            return (
              <BotCard>
                <Purchase
                  props={{
                    numberOfShares,
                    symbol,
                    price: +price,
                    status: 'requires_action'
                  }}
                />
              </BotCard>
            )
          }
        }
      },
      getEvents: {
        description:
          'List funny imaginary events between user highlighted dates that describe stock activity.',
        parameters: z.object({
          events: z.array(
            z.object({
              date: z
                .string()
                .describe('The date of the event, in ISO-8601 format'),
              headline: z.string().describe('The headline of the event'),
              description: z.string().describe('The description of the event')
            })
          )
        }),
        generate: async function* ({ events }) {
          yield (
            <BotCard>
              <EventsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getEvents',
                    toolCallId,
                    args: { events }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getEvents',
                    toolCallId,
                    result: events
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Events props={events} />
            </BotCard>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`

      const firstMessageContent = messages[0].content as string
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map(tool => {
            return tool.toolName === 'listStocks' ? (
              <BotCard>
                {/* TODO: Infer types based on the tool result*/}
                <Stocks props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPrice' ? (
              <BotCard>
                <Stock props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPurchase' ? (
              <BotCard>
                <Purchase props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'getEvents' ? (
              <BotCard>
                <Events props={tool.result} />
              </BotCard>
            ) : null
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}

// File: app/api/chat/mistral/route.ts
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.mistral_api_key, "Mistral")

    // Mistral is compatible the OpenAI SDK
    const mistral = new OpenAI({
      apiKey: profile.mistral_api_key || "",
      baseURL: "https://api.mistral.ai/v1"
    })

    const response = await mistral.chat.completions.create({
      model: chatSettings.model,
      messages,
      max_tokens:
        CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
      stream: true
    })

    // Convert the response into a friendly text-stream.
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Mistral API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Mistral API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/tools/route.ts
import { openapiToFunctions } from "@/lib/openapi-conversion"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Tables } from "@/supabase/types"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages, selectedTools } = json as {
    chatSettings: ChatSettings
    messages: any[]
    selectedTools: Tables<"tools">[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    let allTools: OpenAI.Chat.Completions.ChatCompletionTool[] = []
    let allRouteMaps = {}
    let schemaDetails = []

    for (const selectedTool of selectedTools) {
      try {
        const convertedSchema = await openapiToFunctions(
          JSON.parse(selectedTool.schema as string)
        )
        const tools = convertedSchema.functions || []
        allTools = allTools.concat(tools)

        const routeMap = convertedSchema.routes.reduce(
          (map: Record<string, string>, route) => {
            map[route.path.replace(/{(\w+)}/g, ":$1")] = route.operationId
            return map
          },
          {}
        )

        allRouteMaps = { ...allRouteMaps, ...routeMap }

        schemaDetails.push({
          title: convertedSchema.info.title,
          description: convertedSchema.info.description,
          url: convertedSchema.info.server,
          headers: selectedTool.custom_headers,
          routeMap,
          requestInBody: convertedSchema.routes[0].requestInBody
        })
      } catch (error: any) {
        console.error("Error converting schema", error)
      }
    }

    const firstResponse = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages,
      tools: allTools.length > 0 ? allTools : undefined
    })

    const message = firstResponse.choices[0].message
    messages.push(message)
    const toolCalls = message.tool_calls || []

    if (toolCalls.length === 0) {
      return new Response(message.content, {
        headers: {
          "Content-Type": "application/json"
        }
      })
    }

    if (toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        const functionCall = toolCall.function
        const functionName = functionCall.name
        const argumentsString = toolCall.function.arguments.trim()
        const parsedArgs = JSON.parse(argumentsString)

        // Find the schema detail that contains the function name
        const schemaDetail = schemaDetails.find(detail =>
          Object.values(detail.routeMap).includes(functionName)
        )

        if (!schemaDetail) {
          throw new Error(`Function ${functionName} not found in any schema`)
        }

        const pathTemplate = Object.keys(schemaDetail.routeMap).find(
          key => schemaDetail.routeMap[key] === functionName
        )

        if (!pathTemplate) {
          throw new Error(`Path for function ${functionName} not found`)
        }

        const path = pathTemplate.replace(/:(\w+)/g, (_, paramName) => {
          const value = parsedArgs.parameters[paramName]
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

        // Determine if the request should be in the body or as a query
        const isRequestInBody = schemaDetail.requestInBody
        let data = {}

        if (isRequestInBody) {
          // If the type is set to body
          let headers = {
            "Content-Type": "application/json"
          }

          // Check if custom headers are set
          const customHeaders = schemaDetail.headers // Moved this line up to the loop
          // Check if custom headers are set and are of type string
          if (customHeaders && typeof customHeaders === "string") {
            let parsedCustomHeaders = JSON.parse(customHeaders) as Record<
              string,
              string
            >

            headers = {
              ...headers,
              ...parsedCustomHeaders
            }
          }

          const fullUrl = schemaDetail.url + path

          const bodyContent = parsedArgs.requestBody || parsedArgs

          const requestInit = {
            method: "POST",
            headers,
            body: JSON.stringify(bodyContent) // Use the extracted requestBody or the entire parsedArgs
          }

          const response = await fetch(fullUrl, requestInit)

          if (!response.ok) {
            data = {
              error: response.statusText
            }
          } else {
            data = await response.json()
          }
        } else {
          // If the type is set to query
          const queryParams = new URLSearchParams(
            parsedArgs.parameters
          ).toString()
          const fullUrl =
            schemaDetail.url + path + (queryParams ? "?" + queryParams : "")

          let headers = {}

          // Check if custom headers are set
          const customHeaders = schemaDetail.headers
          if (customHeaders && typeof customHeaders === "string") {
            headers = JSON.parse(customHeaders)
          }

          const response = await fetch(fullUrl, {
            method: "GET",
            headers: headers
          })

          if (!response.ok) {
            data = {
              error: response.statusText
            }
          } else {
            data = await response.json()
          }
        }

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(data)
        })
      }
    }

    const secondResponse = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages,
      stream: true
    })

    const stream = OpenAIStream(secondResponse)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error(error)
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/custom/route.ts
import { Database } from "@/supabase/types"
import { ChatSettings } from "@/types"
import { createClient } from "@supabase/supabase-js"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages, customModelId } = json as {
    chatSettings: ChatSettings
    messages: any[]
    customModelId: string
  }

  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: customModel, error } = await supabaseAdmin
      .from("models")
      .select("*")
      .eq("id", customModelId)
      .single()

    if (!customModel) {
      throw new Error(error.message)
    }

    const custom = new OpenAI({
      apiKey: customModel.api_key || "",
      baseURL: customModel.base_url
    })

    const response = await custom.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Custom API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "Custom API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/groq/route.ts
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "edge"
export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.groq_api_key, "G")

    // Groq is compatible with the OpenAI SDK
    const groq = new OpenAI({
      apiKey: profile.groq_api_key || "",
      baseURL: "https://api.groq.com/openai/v1"
    })

    const response = await groq.chat.completions.create({
      model: chatSettings.model,
      messages,
      max_tokens:
        CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
      stream: true
    })

    // Convert the response into a friendly text-stream.
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Groq API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Groq API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/structured_outputs/route.ts
import { schemas, SchemaType } from "@/types/response-schemas"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { NextResponse } from "next/server"

// Define the types for the new parameter structure
type Parameter = {
  name: string
  in: string
  type: "string" | "number" | "boolean" | "integer" | "array" | "enum" | "anyOf"
  description: string
  required: boolean
  enum?: string[] | null // Optional, but required if type is "enum"
}

type ToolCallDefinition = {
  type: "function"
  function: {
    name: string
    description: string
    parameters: {
      type: "object"
      properties: Record<
        string,
        {
          type: string
          description: string
          enum?: string[] | null
        }
      >
      required: string[]
      additionalProperties: false
    }
  }
}

// Function to create a tool call definition
function createToolCallDefinition(
  functionName: string,
  functionDescription: string,
  parameters: Parameter[]
): ToolCallDefinition {
  const properties: Record<
    string,
    { type: string; description: string; enum?: string[] | null }
  > = {}
  const required: string[] = []

  parameters.forEach(param => {
    const paramDefinition: {
      type: string
      description: string
      enum?: string[] | null
    } = {
      type: param.type,
      description: param.description,
      enum: param.type === "enum" ? (param.enum ?? null) : null // Set enum to null if not relevant
    }

    properties[param.name] = paramDefinition
    required.push(param.name)
  })

  return {
    type: "function",
    function: {
      name: functionName,
      description: functionDescription,
      parameters: {
        type: "object",
        properties: properties,
        required: required,
        additionalProperties: false
      }
    }
  }
}

// Define the expected response format for the structured output
type ParameterResponse = {
  parameters: Parameter[]
}

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages, schemaType } = json as {
    chatSettings: ChatSettings
    messages: any[]
    schemaType: SchemaType
  }

  try {
    const profile = await getServerProfile()
    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      max_tokens: chatSettings.model === "gpt-4-vision-preview" ? 4096 : null, // TODO: Fix
      stream: false,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "parameters_response",
          schema: {
            type: "object",
            properties: {
              parameters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the parameter"
                    },
                    in: {
                      type: "string",
                      description:
                        "The location of the parameter, e.g., query, header, path",
                      enum: ["query", "header", "path", "cookie"]
                    },
                    type: {
                      type: "string",
                      description: "The data type of the parameter",
                      enum: [
                        "string",
                        "number",
                        "boolean",
                        "integer",
                        "array",
                        "enum",
                        "anyOf"
                      ]
                    },
                    description: {
                      type: "string",
                      description: "A brief description of the parameter"
                    },
                    required: {
                      type: "boolean",
                      description:
                        "Indicates whether this parameter is required"
                    },
                    enum: {
                      type: ["array", "null"],
                      items: {
                        type: "string"
                      },
                      description:
                        "An array of possible values if the type is 'enum', or null otherwise"
                    }
                  },
                  required: [
                    "name",
                    "in",
                    "type",
                    "description",
                    "required",
                    "enum"
                  ], // enum is required now
                  additionalProperties: false
                },
                description: "An array containing one or more parameter objects"
              }
            },
            required: ["parameters"],
            additionalProperties: false
          },
          strict: true
        }
      }
    })

    // Step 3: Handle edge cases like incomplete responses or refusals
    const completion = response.choices[0]
    if (completion.finish_reason === "length") {
      throw new Error("Incomplete response")
    }

    if (completion.message?.refusal) {
      throw new Error(`Model refusal: ${completion.message.refusal}`)
    }

    if (!completion.message?.content) {
      throw new Error("No response content")
    }

    // Step 4: Type-safe parsing of the response
    const parsedResponse = JSON.parse(
      completion.message.content
    ) as ParameterResponse

    // Check if parameters exist
    if (!parsedResponse || !parsedResponse.parameters) {
      throw new Error("Invalid response format")
    }

    // Use the parsed response to create a tool call definition
    const toolDefinition = createToolCallDefinition(
      "api_tool_function",
      "Generated API tool function based on parameters",
      parsedResponse.parameters
    )

    // Return the generated tool call definition to the user
    return new Response(JSON.stringify(toolDefinition), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error: any) {
    // Handle edge cases and errors
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/openai/route.ts
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      max_tokens:
        chatSettings.model === "gpt-4-vision-preview" ||
        chatSettings.model === "gpt-4o-2024-08-06"
          ? 4096
          : null, // TODO: Fix
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/openrouter/route.ts
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openrouter_api_key, "OpenRouter")

    const openai = new OpenAI({
      apiKey: profile.openrouter_api_key || "",
      baseURL: "https://openrouter.ai/api/v1"
    })

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      max_tokens: undefined,
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenRouter API Key not found. Please set it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/perplexity/route.ts
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.perplexity_api_key, "Perplexity")

    // Perplexity is compatible the OpenAI SDK
    const perplexity = new OpenAI({
      apiKey: profile.perplexity_api_key || "",
      baseURL: "https://api.perplexity.ai/"
    })

    const response = await perplexity.chat.completions.create({
      model: chatSettings.model,
      messages,
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Perplexity API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Perplexity API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/google/route.ts
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.google_gemini_api_key, "Google")

    const genAI = new GoogleGenerativeAI(profile.google_gemini_api_key || "")
    const googleModel = genAI.getGenerativeModel({ model: chatSettings.model })

    const lastMessage = messages.pop()

    const chat = googleModel.startChat({
      history: messages,
      generationConfig: {
        temperature: chatSettings.temperature
      }
    })

    const response = await chat.sendMessageStream(lastMessage.parts)

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response.stream) {
          const chunkText = chunk.text()
          controller.enqueue(encoder.encode(chunkText))
        }
        controller.close()
      }
    })

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Google Gemini API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("api key not valid")) {
      errorMessage =
        "Google Gemini API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/azure/route.ts
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatAPIPayload } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as ChatAPIPayload

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")

    const ENDPOINT = profile.azure_openai_endpoint
    const KEY = profile.azure_openai_api_key

    let DEPLOYMENT_ID = ""
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
        return new Response(JSON.stringify({ message: "Model not found" }), {
          status: 400
        })
    }

    if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
      return new Response(
        JSON.stringify({ message: "Azure resources not found" }),
        {
          status: 400
        }
      )
    }

    const azureOpenai = new OpenAI({
      apiKey: KEY,
      baseURL: `${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}`,
      defaultQuery: { "api-version": "2023-12-01-preview" },
      defaultHeaders: { "api-key": KEY }
    })

    const response = await azureOpenai.chat.completions.create({
      model: DEPLOYMENT_ID as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      max_tokens: chatSettings.model === "gpt-4-vision-preview" ? 4096 : null, // TODO: Fix
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/chat/anthropic/route.ts
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { getBase64FromDataURL, getMediaTypeFromDataURL } from "@/lib/utils"
import { ChatSettings } from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import { AnthropicStream, StreamingTextResponse } from "ai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.anthropic_api_key, "Anthropic")

    let ANTHROPIC_FORMATTED_MESSAGES: any = messages.slice(1)

    ANTHROPIC_FORMATTED_MESSAGES = ANTHROPIC_FORMATTED_MESSAGES?.map(
      (message: any) => {
        const messageContent =
          typeof message?.content === "string"
            ? [message.content]
            : message?.content

        return {
          ...message,
          content: messageContent.map((content: any) => {
            if (typeof content === "string") {
              // Handle the case where content is a string
              return { type: "text", text: content }
            } else if (
              content?.type === "image_url" &&
              content?.image_url?.url?.length
            ) {
              return {
                type: "image",
                source: {
                  type: "base64",
                  media_type: getMediaTypeFromDataURL(content.image_url.url),
                  data: getBase64FromDataURL(content.image_url.url)
                }
              }
            } else {
              return content
            }
          })
        }
      }
    )

    const anthropic = new Anthropic({
      apiKey: profile.anthropic_api_key || ""
    })

    try {
      const response = await anthropic.messages.create({
        model: chatSettings.model,
        messages: ANTHROPIC_FORMATTED_MESSAGES,
        temperature: chatSettings.temperature,
        system: messages[0].content,
        max_tokens:
          CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
        stream: true
      })

      try {
        const stream = AnthropicStream(response)
        return new StreamingTextResponse(stream)
      } catch (error: any) {
        console.error("Error parsing Anthropic API response:", error)
        return new NextResponse(
          JSON.stringify({
            message:
              "An error occurred while parsing the Anthropic API response"
          }),
          { status: 500 }
        )
      }
    } catch (error: any) {
      console.error("Error calling Anthropic API:", error)
      return new NextResponse(
        JSON.stringify({
          message: "An error occurred while calling the Anthropic API"
        }),
        { status: 500 }
      )
    }
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Anthropic API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Anthropic API Key is incorrect. Please fix it in your profile settings."
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/retrieval/process/route.ts
import { generateLocalEmbedding } from "@/lib/generate-local-embedding"
import {
  processCSV,
  processJSON,
  processMarkdown,
  processPdf,
  processTxt
} from "@/lib/retrieval/processing"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Database } from "@/supabase/types"
import { FileItemChunk } from "@/types"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const profile = await getServerProfile()

    const formData = await req.formData()

    const file_id = formData.get("file_id") as string
    const embeddingsProvider = formData.get("embeddingsProvider") as string

    const { data: fileMetadata, error: metadataError } = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("id", file_id)
      .single()

    if (metadataError) {
      throw new Error(
        `Failed to retrieve file metadata: ${metadataError.message}`
      )
    }

    if (!fileMetadata) {
      throw new Error("File not found")
    }

    if (fileMetadata.user_id !== profile.user_id) {
      throw new Error("Unauthorized")
    }

    const { data: file, error: fileError } = await supabaseAdmin.storage
      .from("files")
      .download(fileMetadata.file_path)

    if (fileError)
      throw new Error(`Failed to retrieve file: ${fileError.message}`)

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const blob = new Blob([fileBuffer])
    const fileExtension = fileMetadata.name.split(".").pop()?.toLowerCase()

    if (embeddingsProvider === "openai") {
      try {
        if (profile.use_azure_openai) {
          checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")
        } else {
          checkApiKey(profile.openai_api_key, "OpenAI")
        }
      } catch (error: any) {
        error.message =
          error.message +
          ", make sure it is configured or else use local embeddings"
        throw error
      }
    }

    let chunks: FileItemChunk[] = []

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
        return new NextResponse("Unsupported file type", {
          status: 400
        })
    }

    let embeddings: any = []

    let openai
    if (profile.use_azure_openai) {
      openai = new OpenAI({
        apiKey: profile.azure_openai_api_key || "",
        baseURL: `${profile.azure_openai_endpoint}/openai/deployments/${profile.azure_openai_embeddings_id}`,
        defaultQuery: { "api-version": "2023-12-01-preview" },
        defaultHeaders: { "api-key": profile.azure_openai_api_key }
      })
    } else {
      openai = new OpenAI({
        apiKey: profile.openai_api_key || "",
        organization: profile.openai_organization_id
      })
    }

    if (embeddingsProvider === "openai") {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks.map(chunk => chunk.content)
      })

      embeddings = response.data.map((item: any) => {
        return item.embedding
      })
    } else if (embeddingsProvider === "local") {
      const embeddingPromises = chunks.map(async chunk => {
        try {
          return await generateLocalEmbedding(chunk.content)
        } catch (error) {
          console.error(`Error generating embedding for chunk: ${chunk}`, error)

          return null
        }
      })

      embeddings = await Promise.all(embeddingPromises)
    }

    const file_items = chunks.map((chunk, index) => ({
      file_id,
      user_id: profile.user_id,
      content: chunk.content,
      tokens: chunk.tokens,
      openai_embedding:
        embeddingsProvider === "openai"
          ? ((embeddings[index] || null) as any)
          : null,
      local_embedding:
        embeddingsProvider === "local"
          ? ((embeddings[index] || null) as any)
          : null
    }))

    await supabaseAdmin.from("file_items").upsert(file_items)

    const totalTokens = file_items.reduce((acc, item) => acc + item.tokens, 0)

    await supabaseAdmin
      .from("files")
      .update({ tokens: totalTokens })
      .eq("id", file_id)

    return new NextResponse("Embed Successful", {
      status: 200
    })
  } catch (error: any) {
    console.log(`Error in retrieval/process: ${error.stack}`)
    const errorMessage = error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/retrieval/process/docx/route.ts
import { generateLocalEmbedding } from "@/lib/generate-local-embedding"
import { processDocX } from "@/lib/retrieval/processing"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Database } from "@/supabase/types"
import { FileItemChunk } from "@/types"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(req: Request) {
  const json = await req.json()
  const { text, fileId, embeddingsProvider, fileExtension } = json as {
    text: string
    fileId: string
    embeddingsProvider: "openai" | "local"
    fileExtension: string
  }

  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const profile = await getServerProfile()

    if (embeddingsProvider === "openai") {
      if (profile.use_azure_openai) {
        checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")
      } else {
        checkApiKey(profile.openai_api_key, "OpenAI")
      }
    }

    let chunks: FileItemChunk[] = []

    switch (fileExtension) {
      case "docx":
        chunks = await processDocX(text)
        break
      default:
        return new NextResponse("Unsupported file type", {
          status: 400
        })
    }

    let embeddings: any = []

    let openai
    if (profile.use_azure_openai) {
      openai = new OpenAI({
        apiKey: profile.azure_openai_api_key || "",
        baseURL: `${profile.azure_openai_endpoint}/openai/deployments/${profile.azure_openai_embeddings_id}`,
        defaultQuery: { "api-version": "2023-12-01-preview" },
        defaultHeaders: { "api-key": profile.azure_openai_api_key }
      })
    } else {
      openai = new OpenAI({
        apiKey: profile.openai_api_key || "",
        organization: profile.openai_organization_id
      })
    }

    if (embeddingsProvider === "openai") {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks.map(chunk => chunk.content)
      })

      embeddings = response.data.map((item: any) => {
        return item.embedding
      })
    } else if (embeddingsProvider === "local") {
      const embeddingPromises = chunks.map(async chunk => {
        try {
          return await generateLocalEmbedding(chunk.content)
        } catch (error) {
          console.error(`Error generating embedding for chunk: ${chunk}`, error)
          return null
        }
      })

      embeddings = await Promise.all(embeddingPromises)
    }

    const file_items = chunks.map((chunk, index) => ({
      file_id: fileId,
      user_id: profile.user_id,
      content: chunk.content,
      tokens: chunk.tokens,
      openai_embedding:
        embeddingsProvider === "openai"
          ? ((embeddings[index] || null) as any)
          : null,
      local_embedding:
        embeddingsProvider === "local"
          ? ((embeddings[index] || null) as any)
          : null
    }))

    await supabaseAdmin.from("file_items").upsert(file_items)

    const totalTokens = file_items.reduce((acc, item) => acc + item.tokens, 0)

    await supabaseAdmin
      .from("files")
      .update({ tokens: totalTokens })
      .eq("id", fileId)

    return new NextResponse("Embed Successful", {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/retrieval/retrieve/route.ts
import { generateLocalEmbedding } from "@/lib/generate-local-embedding"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

export async function POST(request: Request) {
  const json = await request.json()
  const { userInput, fileIds, embeddingsProvider, sourceCount } = json as {
    userInput: string
    fileIds: string[]
    embeddingsProvider: "openai" | "local"
    sourceCount: number
  }

  const uniqueFileIds = [...new Set(fileIds)]

  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const profile = await getServerProfile()

    if (embeddingsProvider === "openai") {
      if (profile.use_azure_openai) {
        checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")
      } else {
        checkApiKey(profile.openai_api_key, "OpenAI")
      }
    }

    let chunks: any[] = []

    let openai
    if (profile.use_azure_openai) {
      openai = new OpenAI({
        apiKey: profile.azure_openai_api_key || "",
        baseURL: `${profile.azure_openai_endpoint}/openai/deployments/${profile.azure_openai_embeddings_id}`,
        defaultQuery: { "api-version": "2023-12-01-preview" },
        defaultHeaders: { "api-key": profile.azure_openai_api_key }
      })
    } else {
      openai = new OpenAI({
        apiKey: profile.openai_api_key || "",
        organization: profile.openai_organization_id
      })
    }

    if (embeddingsProvider === "openai") {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: userInput
      })

      const openaiEmbedding = response.data.map(item => item.embedding)[0]

      const { data: openaiFileItems, error: openaiError } =
        await supabaseAdmin.rpc("match_file_items_openai", {
          query_embedding: openaiEmbedding as any,
          match_count: sourceCount,
          file_ids: uniqueFileIds
        })

      if (openaiError) {
        throw openaiError
      }

      chunks = openaiFileItems
    } else if (embeddingsProvider === "local") {
      const localEmbedding = await generateLocalEmbedding(userInput)

      const { data: localFileItems, error: localFileItemsError } =
        await supabaseAdmin.rpc("match_file_items_local", {
          query_embedding: localEmbedding as any,
          match_count: sourceCount,
          file_ids: uniqueFileIds
        })

      if (localFileItemsError) {
        throw localFileItemsError
      }

      chunks = localFileItems
    }

    const mostSimilarChunks = chunks?.sort(
      (a, b) => b.similarity - a.similarity
    )

    return new Response(JSON.stringify({ results: mostSimilarChunks }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/assistants/openai/route.ts
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ServerRuntime } from "next"
import OpenAI from "openai"

export const runtime: ServerRuntime = "edge"

export async function GET() {
  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const myAssistants = await openai.beta.assistants.list({
      limit: 100
    })

    return new Response(JSON.stringify({ assistants: myAssistants.data }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/protected/account-status/route.ts
import { NextResponse } from "next/server"
import { authProvider } from "@/app/[locale]/protected/services/auth"

export async function GET() {
  try {
    const account = await authProvider.getAccount()
    return NextResponse.json({ isSignedIn: !!account })
  } catch (error) {
    console.error("Error checking account status:", error)
    return NextResponse.json({ isSignedIn: false }, { status: 500 })
  }
}

// File: app/api/protected/eventConsent/route.ts
import { NextRequest, NextResponse } from "next/server"
import { calendarRequest } from "@/app/[locale]/protected/serverConfig"
import { authProvider } from "@/app/[locale]/protected/services/auth"

export async function POST(request: NextRequest) {
  const returnTo = new URL("/api/protected/event", request.url).toString()

  return NextResponse.redirect(
    await authProvider.getAuthCodeUrl(calendarRequest, returnTo),
    {
      status: 303
    }
  )
}

// File: app/api/protected/embed/route.ts
// app/api/getEmbedLink/route.ts
import { NextRequest, NextResponse } from "next/server"
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary"
import { createBeta } from "@/Beta/beta"
import { CustomKiotaAuthenticationProvider } from "@/app/[locale]/protected/kiota/CustomKiotaAuthenticationProvider" // Adjust the import path
import {
  JsonParseNodeFactory,
  JsonSerializationWriterFactory
} from "@microsoft/kiota-serialization-json"
import {
  ParseNodeFactoryRegistry,
  SerializationWriterFactoryRegistry
} from "@microsoft/kiota-abstractions"
import { authProvider as myAuthProvider } from "@/app/[locale]/protected/services/auth" // Adjust the import path

// Create and register the JSON factories
const parseNodeFactoryRegistry = new ParseNodeFactoryRegistry()
parseNodeFactoryRegistry.contentTypeAssociatedFactories.set(
  "application/json",
  new JsonParseNodeFactory()
)

const serializationWriterFactoryRegistry =
  new SerializationWriterFactoryRegistry()
serializationWriterFactoryRegistry.contentTypeAssociatedFactories.set(
  "application/json",
  new JsonSerializationWriterFactory()
)

// Define the scopes required by your API
const scopes = [
  "Bookmark.Read.All",
  "Calendars.Read",
  "ExternalItem.Read.All",
  "Files.Read",
  "Files.Read.All",
  "Files.ReadWrite.All",
  "Group.Read.All",
  "Group.ReadWrite.All",
  "Mail.Read",
  "Mail.ReadBasic",
  "People.Read",
  "People.Read.All",
  "Presence.Read.All",
  "User.Read",
  "Sites.Read.All",
  "Sites.ReadWrite.All",
  "Tasks.Read",
  "Tasks.ReadWrite",
  "Team.ReadBasic.All",
  "User.ReadBasic.All",
  "User.Read.All"
]

// Instantiate the custom Kiota AuthenticationProvider
const authProvider = new CustomKiotaAuthenticationProvider(
  myAuthProvider,
  scopes
)

// Create request adapter using the fetch-based implementation
const adapter = new FetchRequestAdapter(
  authProvider,
  parseNodeFactoryRegistry,
  serializationWriterFactoryRegistry
)

// Create the API client
const beta = createBeta(adapter)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { driveId, driveItemId, mimeType } = body

  if (!driveId || !driveItemId) {
    return NextResponse.json(
      { error: "driveId and driveItemId are required" },
      { status: 400 }
    )
  }
  const options = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
    "text/csv",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.template",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
    "application/msonenote",
    "application/vnd.ms-visio.drawing"
  ]

  const previewOptions = options.includes(mimeType)
    ? { allowEdit: true, viewer: "office" }
    : {}

  try {
    const response = await beta.drives
      .byDriveId(driveId)
      .items.byDriveItemId(driveItemId)
      .preview.post(previewOptions)
    console.log(response)
    const embedLink = response?.getUrl || ""

    return NextResponse.json({ embedLink })
  } catch (error) {
    console.error("Error fetching embed link:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// File: app/api/protected/callback/route.ts
import { NextRequest, NextResponse } from "next/server"
import { authProvider } from "@/app/[locale]/protected/services/auth"
import {
  commitSession,
  getSession
} from "@/app/[locale]/protected/services/session"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { account, returnTo } = await authProvider.handleAuthCodeCallback(
      await request.formData()
    )

    if (!account) {
      throw new Error("No account found")
    }

    const session = await getSession(request.headers.get("Cookie"))

    session.set("homeAccountId", account.homeAccountId)

    // Get the locale from the request URL
    const locale = request.nextUrl.pathname.split("/")[1]

    // Set a default returnTo URL if it's not provided
    const defaultReturnTo = new URL(
      `/${locale}/protected`,
      request.url
    ).toString()
    const safeReturnTo =
      returnTo && returnTo !== "" ? returnTo : defaultReturnTo

    // Ensure the returnTo URL is absolute
    const redirectUrl = new URL(safeReturnTo, request.url).toString()

    return NextResponse.redirect(redirectUrl, {
      status: 303,
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    })
  } catch (error) {
    console.error(error)
    // Handle the error case
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}

// File: app/api/protected/proxy/[...mgt]/route.ts
// /app/api/protected/proxy/[...mgt]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { authProvider } from "@/app/[locale]/protected/services/auth" // Adjust the import path

// Supported HTTP methods
export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const DELETE = handleProxy
export const PATCH = handleProxy

async function handleProxy(
  request: NextRequest,
  { params }: { params: { mgt?: string[] } }
) {
  // Authenticate the user using your existing AuthProvider
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return NextResponse.json(
      { error: "User is not authenticated" },
      { status: 401 }
    )
  }

  // Prepare the token request
  const tokenRequest = {
    scopes: [
      "Bookmark.Read.All",
      "Calendars.Read",
      "ExternalItem.Read.All",
      "Files.Read",
      "Files.Read.All",
      "Files.ReadWrite.All",
      "Group.Read.All",
      "Group.ReadWrite.All",
      "Mail.Read",
      "Mail.ReadBasic",
      "People.Read",
      "People.Read.All",
      "Presence.Read.All",
      "User.Read",
      "Sites.Read.All",
      "Sites.ReadWrite.All",
      "Tasks.Read",
      "Tasks.ReadWrite",
      "Team.ReadBasic.All",
      "User.ReadBasic.All",
      "User.Read.All"
    ],
    account: account
  }

  // Acquire token silently
  let authResult
  try {
    authResult = await instance.acquireTokenSilent(tokenRequest)
  } catch (error) {
    console.error("Error acquiring token silently:", error)
    return NextResponse.json(
      { error: "Failed to acquire access token" },
      { status: 500 }
    )
  }

  if (!authResult || !authResult.accessToken) {
    return NextResponse.json(
      { error: "Failed to acquire access token" },
      { status: 500 }
    )
  }

  // Extract the path from the params
  const mgtPath = params.mgt ? params.mgt.join("/") : ""
  // Construct the URL to Microsoft Graph API
  const graphUrl = `https://graph.microsoft.com/${mgtPath}${request.nextUrl.search}`

  // Prepare the headers
  const headers = new Headers()
  // Copy request headers, excluding host and other forbidden headers
  request.headers.forEach((value, key) => {
    if (
      !["host", "connection", "content-length", "accept-encoding"].includes(
        key.toLowerCase()
      )
    ) {
      headers.set(key, value)
    }
  })
  // Set the Authorization header
  headers.set("Authorization", `Bearer ${authResult.accessToken}`)
  // Set 'Accept-Encoding' to 'identity' to prevent compression
  headers.set("Accept-Encoding", "identity")

  // Prepare the request options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers
  }

  // Handle the request body for methods that have one
  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("content-type") || ""
    let body: any

    if (contentType.includes("application/json")) {
      body = JSON.stringify(await request.json())
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      body = await request.text()
    } else if (contentType.includes("multipart/form-data")) {
      body = request.body
    } else {
      body = await request.arrayBuffer()
    }

    fetchOptions.body = body
  }

  try {
    // Make the request to Microsoft Graph API
    const response = await fetch(graphUrl, fetchOptions)

    // Remove 'content-encoding' header from the response
    const responseHeaders = new Headers(response.headers)
    responseHeaders.delete("content-encoding")
    responseHeaders.delete("transfer-encoding")

    // Return the response with adjusted headers
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders
    })
  } catch (error) {
    console.error("Error proxying request:", error)
    return NextResponse.json(
      { error: "Error proxying request" },
      { status: 500 }
    )
  }
}

// File: app/api/username/available/route.ts
import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { username } = json as {
    username: string
  }

  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: usernames, error } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("username", username)

    if (!usernames) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ isAvailable: !usernames.length }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/username/get/route.ts
import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { userId } = json as {
    userId: string
  }

  try {
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("user_id", userId)
      .single()

    if (!data) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ username: data.username }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/command/route.ts
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import OpenAI from "openai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { input } = json as {
    input: string
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "Respond to the user."
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0,
      max_tokens:
        CHAT_SETTING_LIMITS["gpt-4-turbo-preview"].MAX_TOKEN_OUTPUT_LENGTH
      //   response_format: { type: "json_object" }
      //   stream: true
    })

    const content = response.choices[0].message.content

    return new Response(JSON.stringify({ content }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// File: app/api/keys/route.ts
import { isUsingEnvironmentKey } from "@/lib/envs"
import { createResponse } from "@/lib/server/server-utils"
import { EnvKey } from "@/types/key-type"
import { VALID_ENV_KEYS } from "@/types/valid-keys"

export async function GET() {
  const envKeyMap: Record<string, VALID_ENV_KEYS> = {
    azure: VALID_ENV_KEYS.AZURE_OPENAI_API_KEY,
    openai: VALID_ENV_KEYS.OPENAI_API_KEY,
    google: VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY,
    anthropic: VALID_ENV_KEYS.ANTHROPIC_API_KEY,
    mistral: VALID_ENV_KEYS.MISTRAL_API_KEY,
    groq: VALID_ENV_KEYS.GROQ_API_KEY,
    perplexity: VALID_ENV_KEYS.PERPLEXITY_API_KEY,
    openrouter: VALID_ENV_KEYS.OPENROUTER_API_KEY,

    openai_organization_id: VALID_ENV_KEYS.OPENAI_ORGANIZATION_ID,

    azure_openai_endpoint: VALID_ENV_KEYS.AZURE_OPENAI_ENDPOINT,
    azure_gpt_35_turbo_name: VALID_ENV_KEYS.AZURE_GPT_35_TURBO_NAME,
    azure_gpt_45_vision_name: VALID_ENV_KEYS.AZURE_GPT_45_VISION_NAME,
    azure_gpt_45_turbo_name: VALID_ENV_KEYS.AZURE_GPT_45_TURBO_NAME,
    azure_embeddings_name: VALID_ENV_KEYS.AZURE_EMBEDDINGS_NAME
  }

  const isUsingEnvKeyMap = Object.keys(envKeyMap).reduce<
    Record<string, boolean>
  >((acc, provider) => {
    const key = envKeyMap[provider]

    if (key) {
      acc[provider] = isUsingEnvironmentKey(key as EnvKey)
    }
    return acc
  }, {})

  return createResponse({ isUsingEnvKeyMap }, 200)
}

// File: app/[locale]/login/page.tsx
import { Brand } from "@/components/ui/brand"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login"
}

export default async function Login({
  searchParams
}: {
  searchParams: { message: string }
}) {
  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      throw new Error(
        homeWorkspaceError?.message || "An unexpected error occurred"
      )
    }

    return redirect(`/${homeWorkspace.id}/chat`)
  }

  const getEnvVarOrEdgeConfigValue = async (name: string) => {
    "use server"
    if (process.env.EDGE_CONFIG) {
      return await get<string>(name)
    }

    return process.env[name]
  }

  const signUp = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
      "EMAIL_DOMAIN_WHITELIST"
    )
    const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
      ? emailDomainWhitelistPatternsString?.split(",")
      : []
    const emailWhitelistPatternsString =
      await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
    const emailWhitelist = emailWhitelistPatternsString?.trim()
      ? emailWhitelistPatternsString?.split(",")
      : []

    if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
      const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1])
      const emailMatch = emailWhitelist?.includes(email)
      if (!domainMatch && !emailMatch) {
        return redirect(
          `/login?message=Email ${email} is not allowed to sign up.`
        )
      }
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: `${origin}/auth/callback`
      }
    })

    if (error) {
      console.error(error)
      return redirect(`/login?message=${error.message}`)
    }

    return redirect("/setup")

    // return redirect("/login?message=Check email to continue sign in process")
  }

  const handleResetPassword = async (formData: FormData) => {
    "use server"

    const origin = headers().get("origin")
    const email = formData.get("email") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/login/password`
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

import { ChangePassword } from "@/components/utility/change-password"
import { supabase } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return null
  }

  return <ChangePassword />
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
import { Toaster } from "@/components/ui/sonner"
import { GlobalState } from "@/components/utility/global-state"
import { Providers } from "@/components/utility/providers"
import TranslationsProvider from "@/components/utility/translations-provider"
import initTranslations from "@/lib/i18n"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { ReactNode } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const APP_NAME = "Chatbot UI"
const APP_DEFAULT_TITLE = "Chatbot UI"
const APP_TITLE_TEMPLATE = "%s - Chatbot UI"
const APP_DESCRIPTION = "Chabot UI PWA!"

interface RootLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: APP_DEFAULT_TITLE
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
}

export const viewport: Viewport = {
  themeColor: "#000000"
}

const i18nNamespaces = ["translation"]

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const session = (await supabase.auth.getSession()).data.session

  const { t, resources } = await initTranslations(locale, i18nNamespaces)

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
            <div className="bg-background text-foreground flex h-dvh w-full flex-col items-center overflow-x-auto">
              {session ? <GlobalState>{children}</GlobalState> : children}
            </div>
          </TranslationsProvider>
        </Providers>
      </body>
    </html>
  )
}

// File: app/[locale]/page.tsx
"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { IconArrowRight } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function HomePage() {
  const { theme } = useTheme()

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
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

// File: app/[locale]/setup/page.tsx
"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId, updateProfile } from "@/db/profile"
import {
  getHomeWorkspaceByUserId,
  getWorkspacesByUserId
} from "@/db/workspaces"
import {
  fetchHostedModels,
  fetchOpenRouterModels
} from "@/lib/models/fetch-models"
import { supabase } from "@/lib/supabase/browser-client"
import { TablesUpdate } from "@/supabase/types"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { APIStep } from "../../../components/setup/api-step"
import { FinishStep } from "../../../components/setup/finish-step"
import { ProfileStep } from "../../../components/setup/profile-step"
import {
  SETUP_STEP_COUNT,
  StepContainer
} from "../../../components/setup/step-container"

export default function SetupPage() {
  const {
    profile,
    setProfile,
    setWorkspaces,
    setSelectedWorkspace,
    setEnvKeyMap,
    setAvailableHostedModels,
    setAvailableOpenRouterModels
  } = useContext(ChatbotUIContext)

  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [currentStep, setCurrentStep] = useState(1)

  // Profile Step
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState(profile?.username || "")
  const [usernameAvailable, setUsernameAvailable] = useState(true)

  // API Step
  const [useAzureOpenai, setUseAzureOpenai] = useState(false)
  const [openaiAPIKey, setOpenaiAPIKey] = useState("")
  const [openaiOrgID, setOpenaiOrgID] = useState("")
  const [azureOpenaiAPIKey, setAzureOpenaiAPIKey] = useState("")
  const [azureOpenaiEndpoint, setAzureOpenaiEndpoint] = useState("")
  const [azureOpenai35TurboID, setAzureOpenai35TurboID] = useState("")
  const [azureOpenai45TurboID, setAzureOpenai45TurboID] = useState("")
  const [azureOpenai45VisionID, setAzureOpenai45VisionID] = useState("")
  const [azureOpenaiEmbeddingsID, setAzureOpenaiEmbeddingsID] = useState("")
  const [anthropicAPIKey, setAnthropicAPIKey] = useState("")
  const [googleGeminiAPIKey, setGoogleGeminiAPIKey] = useState("")
  const [mistralAPIKey, setMistralAPIKey] = useState("")
  const [groqAPIKey, setGroqAPIKey] = useState("")
  const [perplexityAPIKey, setPerplexityAPIKey] = useState("")
  const [openrouterAPIKey, setOpenrouterAPIKey] = useState("")

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        return router.push("/login")
      } else {
        const user = session.user

        const profile = await getProfileByUserId(user.id)
        setProfile(profile)
        setUsername(profile.username)

        if (!profile.has_onboarded) {
          setLoading(false)
        } else {
          const data = await fetchHostedModels(profile)

          if (!data) return

          setEnvKeyMap(data.envKeyMap)
          setAvailableHostedModels(data.hostedModels)

          if (profile["openrouter_api_key"] || data.envKeyMap["openrouter"]) {
            const openRouterModels = await fetchOpenRouterModels()
            if (!openRouterModels) return
            setAvailableOpenRouterModels(openRouterModels)
          }

          const homeWorkspaceId = await getHomeWorkspaceByUserId(
            session.user.id
          )
          return router.push(`/${homeWorkspaceId}/chat`)
        }
      }
    })()
  }, [])

  const handleShouldProceed = (proceed: boolean) => {
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

  const handleSaveSetupSetting = async () => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session) {
      return router.push("/login")
    }

    const user = session.user
    const profile = await getProfileByUserId(user.id)

    const updateProfilePayload: TablesUpdate<"profiles"> = {
      ...profile,
      has_onboarded: true,
      display_name: displayName,
      username,
      openai_api_key: openaiAPIKey,
      openai_organization_id: openaiOrgID,
      anthropic_api_key: anthropicAPIKey,
      google_gemini_api_key: googleGeminiAPIKey,
      mistral_api_key: mistralAPIKey,
      groq_api_key: groqAPIKey,
      perplexity_api_key: perplexityAPIKey,
      openrouter_api_key: openrouterAPIKey,
      use_azure_openai: useAzureOpenai,
      azure_openai_api_key: azureOpenaiAPIKey,
      azure_openai_endpoint: azureOpenaiEndpoint,
      azure_openai_35_turbo_id: azureOpenai35TurboID,
      azure_openai_45_turbo_id: azureOpenai45TurboID,
      azure_openai_45_vision_id: azureOpenai45VisionID,
      azure_openai_embeddings_id: azureOpenaiEmbeddingsID
    }

    const updatedProfile = await updateProfile(profile.id, updateProfilePayload)
    setProfile(updatedProfile)

    const workspaces = await getWorkspacesByUserId(profile.user_id)
    const homeWorkspace = workspaces.find(w => w.is_home)

    // There will always be a home workspace
    setSelectedWorkspace(homeWorkspace!)
    setWorkspaces(workspaces)

    return router.push(`/${homeWorkspace?.id}/chat`)
  }

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      // Profile Step
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

      // API Step
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

      // Finish Step
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

// File: app/[locale]/loading.tsx
import { IconLoader2 } from "@tabler/icons-react"

export default function Loading() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <IconLoader2 className="mt-4 size-12 animate-spin" />
    </div>
  )
}

// File: app/[locale]/protected/event/error.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { acquireCalendarTokenInteractive } from "../actions/auth"

export default function Error({
  error
}: {
  error: Error & { digest?: string }
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
import { InteractionRequiredAuthError } from "@azure/msal-node"
import { CalendarEvent, GraphCalendarEvent } from "../components/CalendarEvent"
import { graphConfig } from "../serverConfig"
import { authProvider } from "../services/auth"

async function getEvent() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    throw new Error("No Account logged in")
  }

  try {
    const token = await instance.acquireTokenSilent({
      account,
      scopes: ["Calendars.Read"]
    })

    if (!token) {
      throw new Error("Token null")
    }

    const response = await fetch(graphConfig.eventEndpoint, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    })

    const data: { value: GraphCalendarEvent[] } = await response.json()

    return data.value[0]
  } catch (error: unknown) {
    // rethrow with a message that can be serialized and read by a client component
    // https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-server-errors
    if (error instanceof InteractionRequiredAuthError) {
      throw new Error("InteractionRequiredAuthError")
    }
    throw error
  }
}

export default async function EventPage() {
  const event = await getEvent()

  return <CalendarEvent event={event} />
}

// File: app/[locale]/protected/profile/page.tsx
import { redirect } from "next/navigation"
import { GraphProfile, ProfileData } from "../components/ProfileData"
import { graphConfig } from "../serverConfig"
import { authProvider } from "../services/auth"

async function getUserInfo() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return null
  }

  const token = await instance.acquireTokenSilent({
    account,
    scopes: ["User.Read"]
  })

  if (!token) {
    return null
  }

  const response = await fetch(graphConfig.meEndpoint, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`
    }
  })

  return (await response.json()) as GraphProfile
}

export default async function ProfilePage() {
  const profile = await getUserInfo()

  if (!profile) {
    return redirect("/")
  }

  return <ProfileData graphData={profile} />
}

// File: app/[locale]/protected/profile/picture/route.tsx
import { graphConfig } from "../../serverConfig"
import { authProvider } from "../../services/auth"

export async function GET() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return new Response(null, { status: 401 })
  }

  const token = await instance.acquireTokenSilent({
    account,
    scopes: ["User.Read"]
  })

  if (!token) {
    return new Response(null, { status: 403 })
  }

  return await fetch(graphConfig.profilePhotoEndpoint, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`
    }
  })
}

// File: app/[locale]/protected/components/ProfilePicture.tsx
import { authProvider } from "../services/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export default async function ProfilePicture() {
  const account = await authProvider.getAccount()

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

// File: app/[locale]/protected/components/NavBar.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import WelcomeName from "./WelcomeName"
import ProfilePicture from "./ProfilePicture"
import { logout } from "../actions/auth"
import { login } from "../actions/auth" // Make sure to import the login action
import HomeButton from "./HomeButton"
import { LayoutDashboard } from "lucide-react"
import { authProvider } from "../services/auth"

export default async function NavBar() {
  const account = await authProvider.getAccount()

  const navLinks = [
    { name: "MGT", path: "/protected/mgt" },
    { name: "Dashboard", path: "/protected/mgt/pages/DashboardPage" },
    { name: "Profile", path: "/protected/profile" },
    { name: "Graph Request", path: "/protected/graph-request" },
    { name: "Events", path: "/protected/event" },
    { name: "Tasks", path: "/protected/tasks" },
    { name: "Token Information", path: "/protected/token-info" },
    { name: "Kiota", path: "/protected/kiota" },
    { name: "Files", path: "/protected/files" },
    { name: "Search", path: "/protected/search" }
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
            <form action={account ? "logout" : "login"}>
              <Button type="submit" variant="outline" size="sm">
                {account ? "Logout" : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}

// File: app/[locale]/protected/components/LogoutButton.tsx
import { logout } from "../actions/auth"

export default function LogoutButton() {
  const handleLogout = (formData: FormData) => {
    // handle logout logic here
  }

  return (
    //    <form action={() => handleLogout}>
    <button color="primary" type="submit">
      Logout
    </button>
    //    </form>
  )
}

// File: app/[locale]/protected/components/LoginButton.tsx
import { login } from "../actions/auth"

export default function LoginButton() {
  return (
    //    <form action={login}>
    <button color="primary" type="submit">
      Login
    </button>
    //    </form>
  )
}

// File: app/[locale]/protected/components/ErrorComponent.tsx
import { AuthError } from "@azure/msal-node"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function ErrorComponent({ error }: { error: AuthError }) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>An error occurred: {error.errorCode}</AlertDescription>
    </Alert>
  )
}

// File: app/[locale]/protected/components/ProfileData.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Briefcase, Mail, Phone, MapPin } from "lucide-react"

export type GraphProfile = {
  displayName: string
  jobTitle: string
  mail: string
  businessPhones: string[]
  officeLocation: string
}

export const ProfileData = ({ graphData }: { graphData: GraphProfile }) => {
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

const ProfileItem = ({
  icon,
  primary,
  secondary
}: {
  icon: React.ReactNode
  primary: string
  secondary: string
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

// File: app/[locale]/protected/components/CopyButton.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"

interface CopyButtonProps {
  value: string
}

export function CopyButton({ value }: CopyButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => copyToClipboard(value)}
      className="size-6 p-0"
    >
      {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  )
}

// File: app/[locale]/protected/components/HomeButton.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { redirectToHome } from "../actions/home-redirect"
import { useState } from "react"
import { Home as HomeIcon } from "lucide-react"

export default function HomeButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleHomeClick = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const redirectUrl = await redirectToHome()
      router.push(redirectUrl)
    } catch (error) {
      console.error("Error redirecting to home:", error)
      router.push("/chat") // Fallback to default chat page
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
        {isLoading ? "Redirecting..." : "Home"}
      </Button>
    </form>
  )
}

// File: app/[locale]/protected/components/CalendarEvent.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"

export type GraphCalendarEvent = {
  subject: string
  start: {
    dateTime: string
    timezone: string
  }
}

export const CalendarEvent = ({ event }: { event: GraphCalendarEvent }) => {
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

const EventItem = ({
  icon,
  primary,
  secondary
}: {
  icon: React.ReactNode
  primary: string
  secondary: string
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

// File: app/[locale]/protected/components/graph-request-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GraphRequestForm() {
  const router = useRouter()
  const [endpoint, setEndpoint] = useState(
    "https://graph.microsoft.com/v1.0/me"
  )
  const [scopes, setScopes] = useState(["User.Read"])
  const [requestBody, setRequestBody] = useState("")
  const [method, setMethod] = useState("GET")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams({
      endpoint,
      method,
      scopes: scopes.join(",")
    })
    if (method !== "GET" && requestBody) {
      searchParams.append("body", requestBody)
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
              placeholder="https://graph.microsoft.com/v1.0/me"
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

// File: app/[locale]/protected/components/WelcomeName.tsx
import { authProvider } from "../services/auth"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default async function WelcomeName() {
  try {
    const account = await authProvider.getAccount()

    if (account?.name) {
      return (
        <p className="text-lg font-semibold">
          Welcome, {account.name.split(" ")[0]}
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

// File: app/[locale]/protected/components/ConsentButton.tsx
import { acquireCalendarTokenInteractive } from "../actions/auth"
import { Button } from "@/components/ui/button"

export default function ConsentButton() {
  return (
    <form action={acquireCalendarTokenInteractive}>
      <Button className="w-full" type="submit">
        Consent calendar permissions
      </Button>
    </form>
  )
}

// File: app/[locale]/protected/services/session.ts
import { createCookieSessionStorage } from "@remix-run/node"
import { sessionSecret } from "../serverConfig"
import "server-only"

export type SessionData = {
  homeAccountId: string
}

// https://remix.run/docs/en/1.16.1/utils/sessions#createcookiesessionstorage

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }
  })

// File: app/[locale]/protected/services/auth.ts
import { SessionPartitionManager } from "../utils/SessionPartitionManager"
import RedisCacheClient from "../utils/RedisCacheClient"
import { redisClient } from "./redis"
import { AuthProvider } from "../utils/AuthProvider"
import { getSession } from "./session"
import { cookies } from "next/headers"
import { authCallbackUri, msalConfig } from "../serverConfig"
import "server-only"

async function partitionManagerFactory() {
  const cookie = cookies().get("__session")

  const session = await getSession(`__session=${cookie?.value}`)

  return new SessionPartitionManager(session)
}

export const authProvider = new AuthProvider(
  msalConfig,
  authCallbackUri,
  new RedisCacheClient(redisClient),
  partitionManagerFactory
)

// File: app/[locale]/protected/services/redis.ts
import { createClient } from "redis"
import "server-only"
import { redisUrl } from "../serverConfig"

export const redisClient = createClient(
  redisUrl ? { url: redisUrl } : undefined
)

redisClient.on("error", err => console.log("Redis Client Error", err))

// File: app/[locale]/protected/layout.tsx
// app/layout.tsx
import "../globals.css"
import { Inter } from "next/font/google"
import MgtProvider from "./actions/mgt-provider"
import Navbar from "../protected/components/NavBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "My App",
  description: "My App description"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex size-full flex-col">
      <Navbar />
      <div className="grow overflow-auto">{children}</div>
    </div>
  )
}

// File: app/[locale]/protected/files/page.tsx
"use client"

import { FileList, ThemeToggle } from "@microsoft/mgt-react"
import * as React from "react"
import MgtProvider from "../../protected/actions/mgt-provider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FileItem {
  driveId: string
  driveItemId: string
  webUrl: string
  name: string
  mimeType: string
}

type InsightType = "used" | "shared" | "trending"

export default function FilesPage() {
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null)
  const [embedLink, setEmbedLink] = React.useState<string>("")
  const [insightType, setInsightType] = React.useState<InsightType>("used")
  const fileListRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const fileListElement = fileListRef.current
    if (fileListElement) {
      const handleItemClick = (e: Event) => {
        const customEvent = e as CustomEvent
        const driveItem = customEvent.detail
        console.log(driveItem)
        const file: FileItem = {
          driveId: driveItem.parentReference.driveId,
          driveItemId: driveItem.id,
          name: driveItem.name,
          webUrl: driveItem.webUrl,
          mimeType: driveItem.file.mimeType
        }
        setSelectedFile(file)
      }

      fileListElement.addEventListener("itemClick", handleItemClick)

      return () => {
        fileListElement.removeEventListener("itemClick", handleItemClick)
      }
    }
  }, [insightType]) // Add insightType as a dependency

  React.useEffect(() => {
    const fetchEmbedLink = async () => {
      if (selectedFile) {
        try {
          const response = await fetch(`/api/protected/embed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              driveId: selectedFile.driveId,
              driveItemId: selectedFile.driveItemId,
              mimeType: selectedFile.mimeType
            })
          })

          const data = await response.json()

          if (response.ok) {
            setEmbedLink(data.embedLink)
          } else {
            console.error("Error fetching embed link:", data.error)
            setEmbedLink("")
          }
        } catch (error) {
          console.error("Error fetching embed link:", error)
          setEmbedLink("")
        }
      } else {
        setEmbedLink("")
      }
    }

    fetchEmbedLink()
  }, [selectedFile])

  const handleInsightTypeChange = (value: string) => {
    setInsightType(value as InsightType)
    setSelectedFile(null)
    setEmbedLink("")
  }

  return (
    <MgtProvider>
      <div className="flex h-screen flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <ThemeToggle />
        </div>
        <Tabs
          value={insightType}
          onValueChange={handleInsightTypeChange}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="used">Recently Used</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex grow flex-col space-y-4 overflow-hidden lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="w-full overflow-auto lg:w-1/3 xl:w-1/4">
            <FileList
              key={insightType}
              ref={fileListRef}
              insightType={insightType}
              enableFileUpload={false}
              pageSize={25}
              disableOpenOnClick={true}
            />
          </div>
          <div className="flex w-full flex-col lg:w-2/3 xl:w-3/4">
            {selectedFile ? (
              <div className="flex h-full flex-col rounded-lg border p-4">
                {embedLink ? (
                  <iframe
                    src={embedLink}
                    title={selectedFile.name}
                    className="w-full grow"
                    style={{ minHeight: "500px" }}
                    frameBorder="0"
                  />
                ) : (
                  <p className="py-4 text-center">Loading embed link...</p>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border p-4 text-gray-500">
                Select a file to view its contents
              </div>
            )}
          </div>
        </div>
      </div>
    </MgtProvider>
  )
}

// File: app/[locale]/protected/files/tabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"

const TabsComponent: React.FC = () => (
  <Tabs defaultValue="account" className="w-[400px]">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      Make changes to your account here.
    </TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
  </Tabs>
)

export default TabsComponent

// File: app/[locale]/protected/page.tsx
import { authProvider } from "./services/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "./components/CopyButton"

interface TokenClaim {
  claim: string
  value: string
  description: string
}

function createClaimsTable(claims: Record<string, any>): TokenClaim[] {
  const claimsArray: TokenClaim[] = []

  const populateClaim = (claim: string, value: string, description: string) => {
    claimsArray.push({ claim, value, description })
  }

  const changeDateFormat = (date: number): string => {
    const dateObj = new Date(date * 1000)
    return `${date} - [${dateObj.toString()}]`
  }

  Object.entries(claims).forEach(([key, value]) => {
    if (typeof value !== "string" && typeof value !== "number") return

    switch (key) {
      case "aud":
        populateClaim(
          key,
          String(value),
          "Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Azure portal."
        )
        break
      case "iss":
        populateClaim(
          key,
          String(value),
          "Identifies the issuer, or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated."
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
          "The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format."
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
        populateClaim(key, String(value), "")
    }
  })

  return claimsArray
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const secondsAgo = Math.floor((now - timestamp * 1000) / 1000)

  if (secondsAgo < 60) return `${secondsAgo} seconds ago`
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`
  return `${Math.floor(secondsAgo / 86400)} days ago`
}

function formatTimeUntil(timestamp: number): string {
  const now = Date.now()
  const secondsUntil = Math.floor((timestamp * 1000 - now) / 1000)

  if (secondsUntil < 60) return `in ${secondsUntil} seconds`
  if (secondsUntil < 3600) return `in ${Math.floor(secondsUntil / 60)} minutes`
  if (secondsUntil < 86400) return `in ${Math.floor(secondsUntil / 3600)} hours`
  return `in ${Math.floor(secondsUntil / 86400)} days`
}

async function getTokenInfo() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return null
  }

  const tokenClaims = createClaimsTable(account.idTokenClaims || {})

  const graphToken = await instance.acquireTokenSilent({
    account,
    scopes: [
      "Bookmark.Read.All",
      "Calendars.Read",
      "ExternalItem.Read.All",
      "Files.Read",
      "Files.Read.All",
      "Files.ReadWrite.All",
      "Group.Read.All",
      "Group.ReadWrite.All",
      "Mail.Read",
      "Mail.ReadBasic",
      "People.Read",
      "People.Read.All",
      "Presence.Read.All",
      "User.Read",
      "Sites.Read.All",
      "Sites.ReadWrite.All",
      "Tasks.Read",
      "Tasks.ReadWrite",
      "Team.ReadBasic.All",
      "User.ReadBasic.All",
      "User.Read.All"
    ]
  })

  return {
    tokenClaims,
    graphToken,
    issuedAt: account.idTokenClaims?.iat as number
  }
}

export default async function TokenInfoPage() {
  const tokenInfo = await getTokenInfo()

  if (!tokenInfo) {
    return <div>No account information available.</div>
  }

  const expiresOn = tokenInfo.graphToken.expiresOn
    ? new Date(tokenInfo.graphToken.expiresOn).toLocaleString()
    : "Not available"

  const expiresInFormatted = tokenInfo.graphToken.expiresOn
    ? formatTimeUntil(Math.floor(Number(tokenInfo.graphToken.expiresOn) / 1000))
    : "Unknown"

  const issuedAtFormatted = tokenInfo.issuedAt
    ? new Date(tokenInfo.issuedAt * 1000).toLocaleString()
    : "Not available"

  const timeAgo = tokenInfo.issuedAt
    ? formatTimeAgo(tokenInfo.issuedAt)
    : "Unknown"

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
            Claims in your ID token. For more information, visit:{" "}
            <a
              href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token"
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
                {tokenInfo.tokenClaims.map((claim, index) => (
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

// File: app/[locale]/protected/actions/mgt-provider.tsx
// components/MgtProvider.tsx
"use client"

import React, { useEffect } from "react"
import { Providers } from "@microsoft/mgt-element"
import { ProxyProvider } from "@microsoft/mgt-proxy-provider"

type MgtProviderProps = {
  children: React.ReactNode
}

// Define the API URL based on the environment (production or local)
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://chatbot-ui-livid-mu.vercel.app' 
  : 'http://localhost:3000';

const MgtProvider: React.FC<MgtProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize the Proxy Provider if not already initialized
    if (!(Providers.globalProvider instanceof ProxyProvider)) {
      Providers.globalProvider = new ProxyProvider(
        `${apiUrl}/api/protected/proxy` // Use backticks for proper interpolation
      )
    }
  }, [])

  return <>{children}</>
}

export default MgtProvider

// File: app/[locale]/protected/actions/home-redirect.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function redirectToHome(): Promise<string> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (session) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_home", true)
        .single()

      if (error) throw error

      if (homeWorkspace) {
        return `/${homeWorkspace.id}/chat`
      }
    }

    // If no session or no home workspace, return default chat page
    return "/chat"
  } catch (error) {
    console.error("Error in home redirect:", error)
    return "/chat" // Fallback to default chat page on error
  }
}

// File: app/[locale]/protected/actions/auth.ts
"use server"

import { AuthorizationUrlRequest } from "@azure/msal-node"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { calendarRequest, loginRequest, tasksRequest } from "../serverConfig"
import { authProvider } from "../services/auth"
import { getCurrentUrl } from "../utils/url"
import { createClient } from "@/lib/supabase/server"

async function acquireToken(
  request: Omit<AuthorizationUrlRequest, "redirectUri">,
  redirectPath: string
) {
  const currentUrl = new URL(getCurrentUrl())
  currentUrl.pathname = redirectPath.split("?")[0]
  currentUrl.search = redirectPath.split("?")[1] || ""
  const redirectUrl = currentUrl.toString()

  console.log("request", request)
  console.log("redirectUrl", redirectUrl)
  redirect(await authProvider.getAuthCodeUrl(request, redirectUrl))
}

export async function acquireCalendarTokenInteractive() {
  await acquireToken(calendarRequest, "/protected/event")
}

export async function acquireTasksTokenInteractive() {
  await acquireToken(tasksRequest, "/protected/tasks")
}

async function redirectToHome(): Promise<string> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (session) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_home", true)
        .single()

      if (error) throw error

      if (homeWorkspace) {
        return `/${homeWorkspace.id}/chat`
      }
    }

    // If no session or no home workspace, return default chat page
    return "/chat"
  } catch (error) {
    console.error("Error in home redirect:", error)
    return "/chat" // Fallback to default chat page on error
  }
}

export async function login(prevState: any, formData: FormData) {
  const origin = formData.get("origin") as string
  await acquireToken(loginRequest, origin)
  console.log("loginRequest", loginRequest)
  redirect(origin)
}

export async function logout(prevState: any, formData: FormData) {
  const origin = formData.get("origin") as string
  const { instance, account } = await authProvider.authenticate()

  if (account) {
    await instance.getTokenCache().removeAccount(account)
  }

  cookies().delete("__session")
  redirect(origin)
}

// File: app/[locale]/protected/kiota/CustomKiotaAuthenticationProvider.ts
import {
  AuthenticationProvider,
  RequestInformation
} from "@microsoft/kiota-abstractions"
import { AuthProvider as MyAuthProvider } from "../utils/AuthProvider"
import { ConfidentialClientApplication } from "@azure/msal-node"

export class CustomKiotaAuthenticationProvider
  implements AuthenticationProvider
{
  private authProvider: MyAuthProvider
  private scopes: string[]

  constructor(authProvider: MyAuthProvider, scopes: string[]) {
    this.authProvider = authProvider
    this.scopes = scopes
  }

  public async authenticateRequest(request: RequestInformation): Promise<void> {
    // Use your AuthProvider to get the authenticated instance and account
    const { account, instance } = await this.authProvider.authenticate()

    if (!account) {
      throw new Error("No account is currently authenticated.")
    }

    // Prepare the token request
    const tokenRequest = {
      scopes: this.scopes,
      account: account
    }

    // Acquire token silently
    const authResult = await instance.acquireTokenSilent(tokenRequest)

    if (!authResult || !authResult.accessToken) {
      throw new Error("Failed to acquire access token silently.")
    }

    // Add the Authorization header to the request using addRequestHeaders
    request.addRequestHeaders({
      Authorization: `Bearer ${authResult.accessToken}`
    })
  }
}

// File: app/[locale]/protected/kiota/page.tsx
import { getMessages } from "./actions"
import { Message } from "@/Graph/models"

type PartialMessage = Pick<
  Message,
  "toRecipients" | "from" | "subject" | "bodyPreview"
>

export default async function MessagesPage() {
  let messages: PartialMessage[] = []

  try {
    // Fetch the messages directly in the server component
    messages = await getMessages()
  } catch (error) {
    console.error("Error fetching messages:", error)
    return <div>Error: Failed to load messages.</div>
  }

  return (
    <div>
      <h1>Your Recent Messages</h1>
      {messages.length === 0 ? (
        <div>No messages found.</div>
      ) : (
        <ul>
          {messages.map((message, index) => (
            <li key={index} className="message">
              <div>
                <strong>From:</strong>{" "}
                {message.from?.emailAddress?.name || "Unknown"}
              </div>
              <div>
                <strong>To:</strong>{" "}
                {message.toRecipients
                  ?.map(recipient => recipient.emailAddress?.name)
                  .join(", ") || "Unknown"}
              </div>
              <div>
                <strong>Subject:</strong> {message.subject || "No subject"}
              </div>
              <div>
                <strong>Body Preview:</strong>{" "}
                {message.bodyPreview || "No preview available"}
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// File: app/[locale]/protected/kiota/actions.ts
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary"
import { createGraphClient } from "@/Graph/graphClient" // Adjust the import path
import { CustomKiotaAuthenticationProvider } from "./CustomKiotaAuthenticationProvider" // Adjust the import path
import {
  JsonParseNodeFactory,
  JsonSerializationWriterFactory
} from "@microsoft/kiota-serialization-json"
import {
  ParseNodeFactoryRegistry,
  SerializationWriterFactoryRegistry
} from "@microsoft/kiota-abstractions"
import { Message } from "@/Graph/models" // Adjust the import path
import { authProvider as myAuthProvider } from "@/app/[locale]/protected/services/auth" // Adjust the import path
import { PreviewPostRequestBody } from "@/Graph/drives/item/items/item/preview/index"

// Create and register the JSON factories
const parseNodeFactoryRegistry = new ParseNodeFactoryRegistry()
parseNodeFactoryRegistry.contentTypeAssociatedFactories.set(
  "application/json",
  new JsonParseNodeFactory()
)

const serializationWriterFactoryRegistry =
  new SerializationWriterFactoryRegistry()
serializationWriterFactoryRegistry.contentTypeAssociatedFactories.set(
  "application/json",
  new JsonSerializationWriterFactory()
)

// Define the scopes required by your API
const scopes = [
  "Bookmark.Read.All",
  "Calendars.Read",
  "ExternalItem.Read.All",
  "Files.Read",
  "Files.Read.All",
  "Files.ReadWrite.All",
  "Group.Read.All",
  "Group.ReadWrite.All",
  "Mail.Read",
  "Mail.ReadBasic",
  "People.Read",
  "People.Read.All",
  "Presence.Read.All",
  "User.Read",
  "Sites.Read.All",
  "Sites.ReadWrite.All",
  "Tasks.Read",
  "Tasks.ReadWrite",
  "Team.ReadBasic.All",
  "User.ReadBasic.All",
  "User.Read.All"
]

// Instantiate the custom Kiota AuthenticationProvider
const authProvider = new CustomKiotaAuthenticationProvider(
  myAuthProvider,
  scopes
)

// Create request adapter using the fetch-based implementation
const adapter = new FetchRequestAdapter(
  authProvider,
  parseNodeFactoryRegistry,
  serializationWriterFactoryRegistry
)

// Create the API client
export const client = createGraphClient(adapter)

export async function getMessages(): Promise<Partial<Message>[]> {
  try {
    // GET /me/messages?$top=5&$select=toRecipients,from,subject,bodyPreview&$orderby=receivedDateTime desc
    const messagesResponse = await client.me.messages.get({
      queryParameters: {
        top: 10,
        select: ["toRecipients", "from", "subject", "bodyPreview"], // Select specific fields
        orderby: ["receivedDateTime desc"] // Order by the most recent
      }
    })

    // Access the 'value' property to get the array of messages
    const messages = messagesResponse?.value || []

    // Return only the relevant fields from each message
    return messages.map(message => ({
      toRecipients: message.toRecipients,
      from: message.from,
      subject: message.subject,
      bodyPreview: message.bodyPreview
    }))
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export function sendMail(message: Message): void {
  // POST /me/sendMail
  // client.me.sendMail.post({ message, saveToSentItems: true })
}

export async function getEmbedLink(
  driveId: string,
  driveItemId: string
): Promise<string> {
  const client = createGraphClient(adapter)

  const response = await client.drives
    .byDriveId(driveId)
    .items.byDriveItemId(driveItemId)
    .preview.post({})

  return response?.getUrl || ""
}

// File: app/[locale]/protected/utils/RedisCacheClient.ts
import type { ICacheClient } from "@azure/msal-node"
import type { RedisClientType } from "redis"

export default class RedisCacheClient<
  RedisClient extends RedisClientType<any, any, any>
> implements ICacheClient
{
  client: RedisClient

  constructor(client: RedisClient) {
    this.client = client
  }

  async get(key: string) {
    if (!key) {
      return ""
    }

    await this.ensureConnected()

    const value = await this.client.get(key)

    return value ?? ""
  }

  async set(key: string, value: string) {
    if (!key) {
      return value
    }

    await this.ensureConnected()

    const cacheValue = await this.client.set(key, value)

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

// File: app/[locale]/protected/utils/url.ts
import { headers } from "next/headers"

// https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664

export function getCurrentUrl() {
  const headersList = headers()

  // read the custom x-url header
  const url = headersList.get("x-url")

  // If x-url is not set, fall back to a default URL
  return (
    url ||
    `${headersList.get("x-forwarded-proto") || "http"}://${headersList.get("host")}`
  )
}

// File: app/[locale]/protected/utils/SessionPartitionManager.ts
import type { AccountEntity } from "@azure/msal-common"
import type { IPartitionManager } from "@azure/msal-node"
import type { Session } from "@remix-run/node"

export class SessionPartitionManager implements IPartitionManager {
  session: Session

  constructor(session: Session) {
    this.session = session
  }

  async getKey() {
    const homeAccountId = this.session.get("homeAccountId") || ""

    return homeAccountId
  }

  async extractKey(accountEntity: AccountEntity) {
    if (!accountEntity.homeAccountId) {
      throw new Error("No homeAccountId found in accountEntity")
    }

    return accountEntity.homeAccountId
  }
}

// File: app/[locale]/protected/utils/AuthProvider.ts
import {
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
} from "@azure/msal-node"
import { cache } from "react"

export type PartitionManagerFactory = () => Promise<IPartitionManager>

type AuthCodeRequestState = {
  returnTo: string
  request: Pick<
    AuthorizationCodeRequest,
    "correlationId" | "scopes" | "claims" | "azureCloudOptions"
  >
}

/**
 * Light wrapper for msal-node's ConfidentialClientApplication.
 */
export class AuthProvider {
  configuration: Configuration
  cacheClient: ICacheClient
  partitionManagerFactory: PartitionManagerFactory
  cryptoProvider: CryptoProvider
  redirectUri: string

  /**
   * Initialize the AuthProvider.
   * @param configuration The msal configuration object
   * @param redirectUri Uri that authentication requests will redirect back to
   * @param cacheClient The cache client used to store the token cache
   * @param partitionManagerFactory Factory that returns a PartitionManager for the current executing context
   */
  constructor(
    configuration: Configuration,
    redirectUri: string,
    cacheClient: ICacheClient,
    partitionManagerFactory: PartitionManagerFactory
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
    request: Omit<AuthorizationUrlRequest, "redirectUri" | "responseMode">,
    returnTo: string
  ) {
    const instance = await this.getInstance()

    const state: AuthCodeRequestState = {
      request: {
        correlationId: request.correlationId,
        scopes: request.scopes,
        claims: request.claims,
        azureCloudOptions: request.azureCloudOptions
      },
      returnTo
    }

    const encodedState = this.cryptoProvider.base64Encode(JSON.stringify(state))

    return await instance.getAuthCodeUrl({
      ...request,
      responseMode: ResponseMode.FORM_POST,
      redirectUri: this.redirectUri,
      state: encodedState
    })
  }

  /**
   * Handles token acquisition based on the url that the user was sent to from Azure.
   * @param url The return url from Azure
   * @returns An object containing the logged in account, and where the user should be redirected to.
   */
  async handleAuthCodeCallback(formData: FormData) {
    const payload = this.getAuthorizationCodePayload(formData)

    const instance = await this.getInstance()

    const state: AuthCodeRequestState = JSON.parse(
      this.cryptoProvider.base64Decode(payload.state)
    )

    const authResult = await instance.acquireTokenByCode(
      {
        ...state.request,
        redirectUri: this.redirectUri,
        code: payload.code
      },
      payload
    )

    return {
      account: authResult.account,
      returnTo: state.returnTo
    }
  }

  /**
   * Authenticate a user.
   * @returns The logged in account along with an instance that is configured with a partitioned cache.
   * @remarks Can safely be called in multiple server components.
   */
  authenticate = cache(async () => {
    const partitionManager = await this.partitionManagerFactory()
    const homeAccountId = await partitionManager.getKey()

    const instance = await this.getInstance()

    const account = homeAccountId
      ? await instance.getTokenCache().getAccountByHomeId(homeAccountId)
      : null

    return { account, instance }
  })

  /**
   * Get the current logged in account.
   * @returns An account object if a user is logged in, or null if no user is logged in.
   * @remarks Can safely be called in multiple server components.
   * @remarks Prefer authenticate() in Server Actions and Route Handlers
   */
  getAccount = cache(async () => {
    const partitionManager = await this.partitionManagerFactory()
    const homeAccountId = await partitionManager.getKey()

    if (!homeAccountId) {
      return null
    }

    const instance = await this.getInstance()

    return await instance.getTokenCache().getAccountByHomeId(homeAccountId)
  })

  /**
   * Get an instance configured with a partitioned cache to the current logged in user.
   * @returns A ConfidentialClientApplication instance
   * @remarks Can safely be called in multiple server components.
   * @remarks Prefer authenticate() in Server Actions and Route Handlers
   */
  getInstance = cache(async () => {
    const cachePlugin = new DistributedCachePlugin(
      this.cacheClient,
      await this.partitionManagerFactory()
    )

    const config = {
      ...this.configuration,
      cache: {
        cachePlugin
      }
    }

    /**
     * If the current msal configuration does not have cloudDiscoveryMetadata or authorityMetadata, we will
     * make a request to the relevant endpoints to retrieve the metadata. This allows MSAL to avoid making
     * metadata discovery calls, thereby improving performance of token acquisition process. For more, see:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/performance.md
     */
    if (!config.auth.cloudDiscoveryMetadata || !config.auth.authorityMetadata) {
      const metadata = await this.getMetadata(
        config.auth.clientId,
        config.auth.authority ?? "https://login.microsoftonline.com/common"
      )

      if (metadata) {
        config.auth.cloudDiscoveryMetadata = metadata.cloudDiscoveryMetadata
        config.auth.authorityMetadata = metadata.authorityMetadata
      }
    }

    return new ConfidentialClientApplication(config)
  })

  // validate that the payload includes required fields
  private getAuthorizationCodePayload(formData: FormData) {
    // validate that we only get string entries
    const stringEntries = Array.from(formData.entries()).filter(
      ([, value]) => typeof value === "string"
    )

    const data = Object.fromEntries(stringEntries)

    if (!("state" in data)) {
      throw new Error("No state found in payload.")
    }

    if (!("code" in data)) {
      throw new Error("No code found in payload.")
    }

    return data as Omit<AuthorizationCodePayload, "state"> &
      Required<Pick<AuthorizationCodePayload, "state">>
  }

  /**
   * Gets the cloud discovery metadata and authority metadata for the given authority
   * @param clientId Application Client ID
   * @param authority The authority configured for the application
   * @returns The cloud discovery metadata and authority metadata
   */
  private async getMetadata(clientId: string, authority: string) {
    const tenantId = authority!.split("/").pop()!

    try {
      let [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
        this.cacheClient.get(`${clientId}.${tenantId}.discovery-metadata`),
        this.cacheClient.get(`${clientId}.${tenantId}.authority-metadata`)
      ])

      if (cloudDiscoveryMetadata && authorityMetadata) {
        return {
          cloudDiscoveryMetadata,
          authorityMetadata
        }
      }

      ;[cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
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
  private static async fetchCloudDiscoveryMetadata(tenantId: string) {
    const endpoint = new URL(
      "https://login.microsoftonline.com/common/discovery/instance"
    )

    endpoint.searchParams.set("api-version", "1.1")
    endpoint.searchParams.set(
      "authorization_endpoint",
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
    )

    const response = await fetch(endpoint)

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
  private static async fetchOIDCMetadata(tenantId: string) {
    const endpoint = `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`

    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error("Could not fetch OIDC metadata from endpoint")
    }

    return await response.text()
  }
}

// File: app/[locale]/protected/serverConfig.ts
// https://nextjs.org/docs/getting-started/react-essentials#the-server-only-package
// importing server-only as this module contains secrets that should not be exposed to the client
import { Configuration, LogLevel } from "@azure/msal-node"
import "server-only"


// Define the API URL based on the environment (production or local)
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://chatbot-ui-livid-mu.vercel.app' 
  : 'http://localhost:3000';

export const graphConfig = {
  graphEndpoint: "https://graph.microsoft.com/v1.0",
  meEndpoint: "https://graph.microsoft.com/v1.0/me",
  eventEndpoint: "https://graph.microsoft.com/v1.0/me/calendar/events?$top=1",
  profilePhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
  mailEndpoint: "https://graph.microsoft.com/v1.0/me/messages?$top=5"
}

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID!,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    authority:
      process.env.AZURE_AD_AUTHORITY ??
      "https://login.microsoftonline.com/common"
  },
  system: {
    loggerOptions: {
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
      loggerCallback(logLevel, message) {
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

export const loginRequest = {
  scopes: ["User.Read"]
}

export const calendarRequest = {
  scopes: ["Calendars.Read"]
}

export const tasksRequest = {
  scopes: ["Tasks.Read"]
}

export const authCallbackUri =
  process.env.AUTH_CALLBACK_URI ?? `${apiUrl}/api/protected/proxy`

export const sessionSecret = process.env.SESSION_SECRET!

// redis[s]://[[username][:password]@][host][:port][/db-number]
// if undefined it will connect to a local redis server
export const redisUrl = process.env.REDIS_REDIS_URL

// File: app/[locale]/protected/search/page.tsx
import { Suspense } from "react"
import SearchComponent from "./searchbox"
import MgtProvider from "../../protected/actions/mgt-provider"
import TabsComponent from "./tabs"

export default function FilesPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const searchTerm = searchParams.q || ""

  return (
    <MgtProvider>
      <TabsComponent />
      <Suspense fallback={<div>Loading...</div>}>
        <SearchComponent initialQuery={searchTerm} />
      </Suspense>
    </MgtProvider>
  )
}

// File: app/[locale]/protected/search/tabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"

const TabsComponent: React.FC = () => (
  <Tabs defaultValue="account" className="w-[400px]">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      Make changes to your account here.
    </TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
  </Tabs>
)

export default TabsComponent

// File: app/[locale]/protected/search/searchbox.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchResults, ThemeToggle } from "@microsoft/mgt-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchResult {
  webUrl: string
  name: string
  id: string
}

export default function SearchComponent({ initialQuery = "" }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [selectedFile, setSelectedFile] = useState<SearchResult | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchResultsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setSearchTerm(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const handleItemClick = (e: Event) => {
      console.log(e)
      const customEvent = e as CustomEvent
      const clickedFile = customEvent.detail as SearchResult
      setSelectedFile(clickedFile)
      updateUrlWithFileId(clickedFile.id)
    }

    const searchResultsElement = searchResultsRef.current
    if (searchResultsElement) {
      searchResultsElement.addEventListener("itemClick", handleItemClick)
    }

    return () => {
      if (searchResultsElement) {
        searchResultsElement.removeEventListener("itemClick", handleItemClick)
      }
    }
  }, [])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateSearchParams()
  }

  const updateSearchParams = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (searchTerm) {
      current.set("q", searchTerm)
    } else {
      current.delete("q")
    }
    current.delete("fileId") // Remove fileId when performing a new search
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`/protected/search${query}`)
  }

  const updateUrlWithFileId = (fileId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("fileId", fileId)
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`/protected/search${query}`, { scroll: false })
  }

  return (
    <>
      <ThemeToggle />
      <div className="flex h-[calc(100vh-100px)]">
        <div className="w-1/2 space-y-4 overflow-y-auto p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Search files..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="grow"
            />
            <Button type="submit">
              <Search className="mr-2 size-4" />
              Search
            </Button>
          </form>
          <SearchResults
            ref={searchResultsRef}
            entityTypes={["driveItem", "listItem", "site"]}
            queryString={searchTerm}
            scopes={["Files.Read.All", "Sites.Read.All"]}
            fetchThumbnail={true}
          />
        </div>
        <div className="w-1/2 border-l p-4">
          {selectedFile ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{selectedFile.name}</h2>
              <iframe
                src={selectedFile.webUrl}
                title={selectedFile.name}
                className="h-[calc(100vh-200px)] w-full"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// File: app/[locale]/protected/forced/layout.tsx
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"
import { loginRequest } from "../serverConfig"
import { authProvider } from "../services/auth"
import { getCurrentUrl } from "../utils/url"

export default async function ForcedLayout({ children }: PropsWithChildren) {
  const { account } = await authProvider.authenticate()

  if (!account) {
    redirect(await authProvider.getAuthCodeUrl(loginRequest, getCurrentUrl()))
  }

  return <>{children}</>
}

// File: app/[locale]/protected/forced/page.tsx
import { authProvider } from "../services/auth"

export default async function ForcedPage() {
  const account = await authProvider.getAccount()

  if (!account) {
    throw new Error("How did this happen?")
  }

  return <div>Hello {account.name}</div>
}

// File: app/[locale]/protected/token-info/page.tsx
import { authProvider } from "../services/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "../components/CopyButton"

interface TokenClaim {
  claim: string
  value: string
  description: string
}

function createClaimsTable(claims: Record<string, any>): TokenClaim[] {
  const claimsArray: TokenClaim[] = []

  const populateClaim = (claim: string, value: string, description: string) => {
    claimsArray.push({ claim, value, description })
  }

  const changeDateFormat = (date: number): string => {
    const dateObj = new Date(date * 1000)
    return `${date} - [${dateObj.toString()}]`
  }

  Object.entries(claims).forEach(([key, value]) => {
    if (typeof value !== "string" && typeof value !== "number") return

    switch (key) {
      case "aud":
        populateClaim(
          key,
          String(value),
          "Identifies the intended recipient of the token. In ID tokens, the audience is your app's Application ID, assigned to your app in the Azure portal."
        )
        break
      case "iss":
        populateClaim(
          key,
          String(value),
          "Identifies the issuer, or authorization server that constructs and returns the token. It also identifies the Azure AD tenant for which the user was authenticated."
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
          "The primary username that represents the user. It could be an email address, phone number, or a generic username without a specified format."
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
        populateClaim(key, String(value), "")
    }
  })

  return claimsArray
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const secondsAgo = Math.floor((now - timestamp * 1000) / 1000)

  if (secondsAgo < 60) return `${secondsAgo} seconds ago`
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`
  return `${Math.floor(secondsAgo / 86400)} days ago`
}

function formatTimeUntil(timestamp: number): string {
  const now = Date.now()
  const secondsUntil = Math.floor((timestamp * 1000 - now) / 1000)

  if (secondsUntil < 60) return `in ${secondsUntil} seconds`
  if (secondsUntil < 3600) return `in ${Math.floor(secondsUntil / 60)} minutes`
  if (secondsUntil < 86400) return `in ${Math.floor(secondsUntil / 3600)} hours`
  return `in ${Math.floor(secondsUntil / 86400)} days`
}

async function getTokenInfo() {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return null
  }

  const tokenClaims = createClaimsTable(account.idTokenClaims || {})

  const graphToken = await instance.acquireTokenSilent({
    account,
    scopes: ["User.Read"]
  })

  return {
    tokenClaims,
    graphToken,
    issuedAt: account.idTokenClaims?.iat as number
  }
}

export default async function TokenInfoPage() {
  const tokenInfo = await getTokenInfo()

  if (!tokenInfo) {
    return <div>No account information available.</div>
  }

  const expiresOn = tokenInfo.graphToken.expiresOn
    ? new Date(tokenInfo.graphToken.expiresOn).toLocaleString()
    : "Not available"

  const expiresInFormatted = tokenInfo.graphToken.expiresOn
    ? formatTimeUntil(Math.floor(Number(tokenInfo.graphToken.expiresOn) / 1000))
    : "Unknown"

  const issuedAtFormatted = tokenInfo.issuedAt
    ? new Date(tokenInfo.issuedAt * 1000).toLocaleString()
    : "Not available"

  const timeAgo = tokenInfo.issuedAt
    ? formatTimeAgo(tokenInfo.issuedAt)
    : "Unknown"

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
            Claims in your ID token. For more information, visit:{" "}
            <a
              href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token"
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
                {tokenInfo.tokenClaims.map((claim, index) => (
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

// File: app/[locale]/protected/actions.ts
"use server"

import { prepScopes, Providers } from "@microsoft/mgt-element"

export async function sendMailAction() {
  let provider = Providers.globalProvider
  if (provider) {
    let graphClient = provider.graph.client
    await graphClient
      .api("https://localhost:3000/api/protected/callback")
      .middlewareOptions(
        prepScopes([
          "api://68865588-d66d-4db6-8680-0ad4369fdf5b/access_as_user"
        ])
      )
      .post({
        message: {
          subject: "Email from a protected API",
          body: {
            contentType: "Text",
            content:
              "This is a demo email from a protected API sent on-behalf-of a user."
          },
          toRecipients: [
            {
              emailAddress: {
                address: "vinod@pittampalli.com"
              }
            }
          ]
        }
      })
  }
}

// File: app/[locale]/protected/graph-request/page.tsx
"use client"
// app/[locale]/protected/mgt/page.tsx

import React from "react"
import MgtProvider from "../../protected/actions/mgt-provider"
import { Todo, FileList } from "@microsoft/mgt-react"

export default function MgtSamplePage() {
  return (
    <MgtProvider>
      <div>
        <h1>Microsoft Graph Toolkit Sample</h1>
        <FileList />
      </div>
    </MgtProvider>
  )
}

// File: app/[locale]/protected/graph-request/_page.tsx
import { redirect } from "next/navigation"
import { authProvider } from "../services/auth"
import { GraphRequestForm } from "../components/graph-request-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GraphRequestResult {
  request: string
  response: string
}

async function makeGraphRequest(
  endpoint: string,
  method: string,
  scopes: string[],
  body?: string
) {
  const { account, instance } = await authProvider.authenticate()

  if (!account) {
    return null
  }

  const token = await instance.acquireTokenSilent({
    account,
    scopes
  })

  if (!token) {
    return null
  }

  const headers = new Headers({
    Authorization: `Bearer ${token.accessToken}`,
    "Content-Type": "application/json"
  })

  const requestOptions: RequestInit = {
    method,
    headers,
    body: method !== "GET" ? body : undefined
  }

  const request = JSON.stringify(
    { endpoint, method, headers: Object.fromEntries(headers), body },
    null,
    2
  )

  const response = await fetch(endpoint, requestOptions)
  const data = await response.json()

  return {
    request,
    response: JSON.stringify(data, null, 2)
  } as GraphRequestResult
}

export default async function GraphRequestPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  let result: GraphRequestResult | null = null

  if (searchParams.endpoint && searchParams.method && searchParams.scopes) {
    const endpoint = searchParams.endpoint as string
    const method = searchParams.method as string
    const scopes = (searchParams.scopes as string).split(",")
    const body = searchParams.body as string | undefined

    result = await makeGraphRequest(endpoint, method, scopes, body)
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

// File: app/[locale]/protected/graph-request/customProvider.ts
import { Providers } from "@microsoft/mgt-element"
import { ProxyProvider } from "@microsoft/mgt-proxy-provider"

// Define the API URL based on the environment (production or local)
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://chatbot-ui-livid-mu.vercel.app' 
  : 'http://localhost:3000';


// Set up the ProxyProvider to point to the custom GraphProxy API
export const setupProxyProvider = () => {
  Providers.globalProvider = new ProxyProvider(
    `${apiUrl}/api/protected/proxy` // Replace with your actual domain
  )
}

// File: app/[locale]/[workspaceid]/chat/page.tsx
"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { QuickSettings } from "@/components/chat/quick-settings"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext } from "react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
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
      ) : (
        <ChatUI />
      )}
    </>
  )
}

// File: app/[locale]/[workspaceid]/chat/[chatid]/page.tsx
"use client"

import { ChatUI } from "@/components/chat/chat-ui"
import { AI } from '@/lib/chat/actions'

export default function ChatIDPage() {
  return <ChatUI />
}

// File: app/[locale]/[workspaceid]/layout.tsx
"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { getAssistantWorkspacesByWorkspaceId } from "@/db/assistants"
import { getChatsByWorkspaceId } from "@/db/chats"
import { getCollectionWorkspacesByWorkspaceId } from "@/db/collections"
import { getFileWorkspacesByWorkspaceId } from "@/db/files"
import { getFoldersByWorkspaceId } from "@/db/folders"
import { getModelWorkspacesByWorkspaceId } from "@/db/models"
import { getPresetWorkspacesByWorkspaceId } from "@/db/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/db/prompts"
import { getAssistantImageFromStorage } from "@/db/storage/assistant-images"
import { getToolWorkspacesByWorkspaceId } from "@/db/tools"
import { getWorkspaceById } from "@/db/workspaces"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import { supabase } from "@/lib/supabase/browser-client"
import { LLMID } from "@/types"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Loading from "../loading"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter()

  const params = useParams()
  const searchParams = useSearchParams()
  const workspaceId = params.workspaceid as string

  const {
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

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const session = (await supabase.auth.getSession()).data.session

      if (!session) {
        return router.push("/login")
      } else {
        await fetchWorkspaceData(workspaceId)
      }
    })()
  }, [])

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
  }, [workspaceId])

  const fetchWorkspaceData = async (workspaceId: string) => {
    setLoading(true)

    const workspace = await getWorkspaceById(workspaceId)
    setSelectedWorkspace(workspace)

    const assistantData = await getAssistantWorkspacesByWorkspaceId(workspaceId)
    setAssistants(assistantData.assistants)

    for (const assistant of assistantData.assistants) {
      let url = ""

      if (assistant.image_path) {
        url = (await getAssistantImageFromStorage(assistant.image_path)) || ""
      }

      if (url) {
        const response = await fetch(url)
        const blob = await response.blob()
        const base64 = await convertBlobToBase64(blob)

        setAssistantImages(prev => [
          ...prev,
          {
            assistantId: assistant.id,
            path: assistant.image_path,
            base64,
            url
          }
        ])
      } else {
        setAssistantImages(prev => [
          ...prev,
          {
            assistantId: assistant.id,
            path: assistant.image_path,
            base64: "",
            url
          }
        ])
      }
    }

    const chats = await getChatsByWorkspaceId(workspaceId)
    setChats(chats)

    const collectionData =
      await getCollectionWorkspacesByWorkspaceId(workspaceId)
    setCollections(collectionData.collections)

    const folders = await getFoldersByWorkspaceId(workspaceId)
    setFolders(folders)

    const fileData = await getFileWorkspacesByWorkspaceId(workspaceId)
    setFiles(fileData.files)

    const presetData = await getPresetWorkspacesByWorkspaceId(workspaceId)
    setPresets(presetData.presets)

    const promptData = await getPromptWorkspacesByWorkspaceId(workspaceId)
    setPrompts(promptData.prompts)

    const toolData = await getToolWorkspacesByWorkspaceId(workspaceId)
    setTools(toolData.tools)

    const modelData = await getModelWorkspacesByWorkspaceId(workspaceId)
    setModels(modelData.models)

    setChatSettings({
      model: (searchParams.get("model") ||
        workspace?.default_model ||
        "gpt-4-1106-preview") as LLMID,
      prompt:
        workspace?.default_prompt ||
        "You are a friendly, helpful AI assistant.",
      temperature: workspace?.default_temperature || 0.5,
      contextLength: workspace?.default_context_length || 4096,
      includeProfileContext: workspace?.include_profile_context || true,
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

  return (
    <>
      <Dashboard>{children}</Dashboard>
    </>
  )
}

// File: app/[locale]/[workspaceid]/page.tsx
"use client"

import { ChatbotUIContext } from "@/context/context"
import { useContext } from "react"

export default function WorkspacePage() {
  const { selectedWorkspace } = useContext(ChatbotUIContext)

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-4xl">{selectedWorkspace?.name}</div>
    </div>
  )
}

// File: app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  } else {
    return NextResponse.redirect(requestUrl.origin)
  }
}

// File: components/chat/chat-helpers/index.ts
// Only used in use-chat-handler.tsx to keep it clean

import { createChatFiles } from "@/db/chat-files"
import { createChat } from "@/db/chats"
import { createMessageFileItems } from "@/db/message-file-items"
import { createMessages, updateMessage } from "@/db/messages"
import { uploadMessageImage } from "@/db/storage/message-images"
import {
  buildFinalMessages,
  adaptMessagesForGoogleGemini
} from "@/lib/build-prompt"
import { consumeReadableStream } from "@/lib/consume-stream"
import { Tables, TablesInsert } from "@/supabase/types"
import {
  ChatFile,
  ChatMessage,
  ChatPayload,
  ChatSettings,
  LLM,
  MessageImage
} from "@/types"
import React from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

export const validateChatSettings = (
  chatSettings: ChatSettings | null,
  modelData: LLM | undefined,
  profile: Tables<"profiles"> | null,
  selectedWorkspace: Tables<"workspaces"> | null,
  messageContent: string
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

export const handleRetrieval = async (
  userInput: string,
  newMessageFiles: ChatFile[],
  chatFiles: ChatFile[],
  embeddingsProvider: "openai" | "local",
  sourceCount: number
) => {
  const response = await fetch("/api/retrieval/retrieve", {
    method: "POST",
    body: JSON.stringify({
      userInput,
      fileIds: [...newMessageFiles, ...chatFiles].map(file => file.id),
      embeddingsProvider,
      sourceCount
    })
  })

  if (!response.ok) {
    console.error("Error retrieving:", response)
  }

  const { results } = (await response.json()) as {
    results: Tables<"file_items">[]
  }

  return results
}

export const createTempMessages = (
  messageContent: string,
  chatMessages: ChatMessage[],
  chatSettings: ChatSettings,
  b64Images: string[],
  isRegeneration: boolean,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  selectedAssistant: Tables<"assistants"> | null
) => {
  let tempUserChatMessage: ChatMessage = {
    message: {
      chat_id: "",
      assistant_id: null,
      content: messageContent,
      created_at: "",
      id: uuidv4(),
      image_paths: b64Images,
      model: chatSettings.model,
      role: "user",
      sequence_number: chatMessages.length,
      updated_at: "",
      user_id: ""
    },
    fileItems: []
  }

  let tempAssistantChatMessage: ChatMessage = {
    message: {
      chat_id: "",
      assistant_id: selectedAssistant?.id || null,
      content: "",
      created_at: "",
      id: uuidv4(),
      image_paths: [],
      model: chatSettings.model,
      role: "assistant",
      sequence_number: chatMessages.length + 1,
      updated_at: "",
      user_id: ""
    },
    fileItems: []
  }

  let newMessages = []

  if (isRegeneration) {
    const lastMessageIndex = chatMessages.length - 1
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

export const handleLocalChat = async (
  payload: ChatPayload,
  profile: Tables<"profiles">,
  chatSettings: ChatSettings,
  tempAssistantMessage: ChatMessage,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  const formattedMessages = await buildFinalMessages(payload, profile, [])

  // Ollama API: https://github.com/jmorganca/ollama/blob/main/docs/api.md
  const response = await fetchChatResponse(
    process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/chat",
    {
      model: chatSettings.model,
      messages: formattedMessages,
      options: {
        temperature: payload.chatSettings.temperature
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
      : tempAssistantMessage,
    false,
    newAbortController,
    setFirstTokenReceived,
    setChatMessages,
    setToolInUse
  )
}

export const handleHostedChat = async (
  payload: ChatPayload,
  profile: Tables<"profiles">,
  modelData: LLM,
  tempAssistantChatMessage: ChatMessage,
  isRegeneration: boolean,
  newAbortController: AbortController,
  newMessageImages: MessageImage[],
  chatImages: MessageImage[],
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  const provider =
    modelData.provider === "openai" && profile.use_azure_openai
      ? "azure"
      : modelData.provider

  let draftMessages = await buildFinalMessages(payload, profile, chatImages)

  let formattedMessages: any[] = []
  if (provider === "google") {
    formattedMessages = await adaptMessagesForGoogleGemini(
      payload,
      draftMessages
    )
  } else {
    formattedMessages = draftMessages
  }

  const apiEndpoint =
    provider === "custom" ? "/api/chat/custom" : `/api/chat/${provider}`

  const requestBody = {
    chatSettings: payload.chatSettings,
    messages: formattedMessages,
    customModelId: provider === "custom" ? modelData.hostedId : ""
  }

  const response = await fetchChatResponse(
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
      : tempAssistantChatMessage,
    true,
    newAbortController,
    setFirstTokenReceived,
    setChatMessages,
    setToolInUse
  )
}

export const fetchChatResponse = async (
  url: string,
  body: object,
  isHosted: boolean,
  controller: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: controller.signal
  })

  if (!response.ok) {
    if (response.status === 404 && !isHosted) {
      toast.error(
        "Model not found. Make sure you have it downloaded via Ollama."
      )
    }

    const errorData = await response.json()

    toast.error(errorData.message)

    setIsGenerating(false)
    setChatMessages(prevMessages => prevMessages.slice(0, -2))
  }

  return response
}

export const processResponse = async (
  response: Response,
  lastChatMessage: ChatMessage,
  isHosted: boolean,
  controller: AbortController,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setToolInUse: React.Dispatch<React.SetStateAction<string>>
) => {
  let fullText = ""
  let contentToAdd = ""

  if (response.body) {
    await consumeReadableStream(
      response.body,
      chunk => {
        setFirstTokenReceived(true)
        setToolInUse("none")

        try {
          contentToAdd = isHosted
            ? chunk
            : // Ollama's streaming endpoint returns new-line separated JSON
              // objects. A chunk may have more than one of these objects, so we
              // need to split the chunk by new-lines and handle each one
              // separately.
              chunk
                .trimEnd()
                .split("\n")
                .reduce(
                  (acc, line) => acc + JSON.parse(line).message.content,
                  ""
                )
          fullText += contentToAdd
        } catch (error) {
          console.error("Error parsing JSON:", error)
        }

        setChatMessages(prev =>
          prev.map(chatMessage => {
            if (chatMessage.message.id === lastChatMessage.message.id) {
              const updatedChatMessage: ChatMessage = {
                message: {
                  ...chatMessage.message,
                  content: fullText
                },
                fileItems: chatMessage.fileItems
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

export const handleCreateChat = async (
  chatSettings: ChatSettings,
  profile: Tables<"profiles">,
  selectedWorkspace: Tables<"workspaces">,
  messageContent: string,
  selectedAssistant: Tables<"assistants">,
  newMessageFiles: ChatFile[],
  setSelectedChat: React.Dispatch<React.SetStateAction<Tables<"chats"> | null>>,
  setChats: React.Dispatch<React.SetStateAction<Tables<"chats">[]>>,
  setChatFiles: React.Dispatch<React.SetStateAction<ChatFile[]>>
) => {
  const createdChat = await createChat({
    user_id: profile.user_id,
    workspace_id: selectedWorkspace.id,
    assistant_id: selectedAssistant?.id || null,
    context_length: chatSettings.contextLength,
    include_profile_context: chatSettings.includeProfileContext,
    include_workspace_instructions: chatSettings.includeWorkspaceInstructions,
    model: chatSettings.model,
    name: messageContent.substring(0, 100),
    prompt: chatSettings.prompt,
    temperature: chatSettings.temperature,
    embeddings_provider: chatSettings.embeddingsProvider
  })

  setSelectedChat(createdChat)
  setChats(chats => [createdChat, ...chats])

  await createChatFiles(
    newMessageFiles.map(file => ({
      user_id: profile.user_id,
      chat_id: createdChat.id,
      file_id: file.id
    }))
  )

  setChatFiles(prev => [...prev, ...newMessageFiles])

  return createdChat
}

export const handleCreateMessages = async (
  chatMessages: ChatMessage[],
  currentChat: Tables<"chats">,
  profile: Tables<"profiles">,
  modelData: LLM,
  messageContent: string,
  generatedText: string,
  newMessageImages: MessageImage[],
  isRegeneration: boolean,
  retrievedFileItems: Tables<"file_items">[],
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setChatFileItems: React.Dispatch<
    React.SetStateAction<Tables<"file_items">[]>
  >,
  setChatImages: React.Dispatch<React.SetStateAction<MessageImage[]>>,
  selectedAssistant: Tables<"assistants"> | null
) => {
  const finalUserMessage: TablesInsert<"messages"> = {
    chat_id: currentChat.id,
    assistant_id: null,
    user_id: profile.user_id,
    content: messageContent,
    model: modelData.modelId,
    role: "user",
    sequence_number: chatMessages.length,
    image_paths: []
  }

  const finalAssistantMessage: TablesInsert<"messages"> = {
    chat_id: currentChat.id,
    assistant_id: selectedAssistant?.id || null,
    user_id: profile.user_id,
    content: generatedText,
    model: modelData.modelId,
    role: "assistant",
    sequence_number: chatMessages.length + 1,
    image_paths: []
  }

  let finalChatMessages: ChatMessage[] = []

  if (isRegeneration) {
    const lastStartingMessage = chatMessages[chatMessages.length - 1].message

    const updatedMessage = await updateMessage(lastStartingMessage.id, {
      ...lastStartingMessage,
      content: generatedText
    })

    chatMessages[chatMessages.length - 1].message = updatedMessage

    finalChatMessages = [...chatMessages]

    setChatMessages(finalChatMessages)
  } else {
    const createdMessages = await createMessages([
      finalUserMessage,
      finalAssistantMessage
    ])

    // Upload each image (stored in newMessageImages) for the user message to message_images bucket
    const uploadPromises = newMessageImages
      .filter(obj => obj.file !== null)
      .map(obj => {
        let filePath = `${profile.user_id}/${currentChat.id}/${
          createdMessages[0].id
        }/${uuidv4()}`

        return uploadMessageImage(filePath, obj.file as File).catch(error => {
          console.error(`Failed to upload image at ${filePath}:`, error)
          return null
        })
      })

    const paths = (await Promise.all(uploadPromises)).filter(
      Boolean
    ) as string[]

    setChatImages(prevImages => [
      ...prevImages,
      ...newMessageImages.map((obj, index) => ({
        ...obj,
        messageId: createdMessages[0].id,
        path: paths[index]
      }))
    ])

    const updatedMessage = await updateMessage(createdMessages[0].id, {
      ...createdMessages[0],
      image_paths: paths
    })

    const createdMessageFileItems = await createMessageFileItems(
      retrievedFileItems.map(fileItem => {
        return {
          user_id: profile.user_id,
          message_id: createdMessages[1].id,
          file_item_id: fileItem.id
        }
      })
    )

    finalChatMessages = [
      ...chatMessages,
      {
        message: updatedMessage,
        fileItems: []
      },
      {
        message: createdMessages[1],
        fileItems: retrievedFileItems.map(fileItem => fileItem.id)
      }
    ]

    setChatFileItems(prevFileItems => {
      const newFileItems = retrievedFileItems.filter(
        fileItem => !prevFileItems.some(prevItem => prevItem.id === fileItem.id)
      )

      return [...prevFileItems, ...newFileItems]
    })

    setChatMessages(finalChatMessages)
  }
}

// File: components/chat/chat-hooks/use-select-file-handler.tsx
import { ChatbotUIContext } from "@/context/context"
import { createDocXFile, createFile } from "@/db/files"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import mammoth from "mammoth"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"

export const ACCEPTED_FILE_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/json",
  "text/markdown",
  "application/pdf",
  "text/plain"
].join(",")

export const useSelectFileHandler = () => {
  const {
    selectedWorkspace,
    profile,
    chatSettings,
    setNewMessageImages,
    setNewMessageFiles,
    setShowFilesDisplay,
    setFiles,
    setUseRetrieval
  } = useContext(ChatbotUIContext)

  const [filesToAccept, setFilesToAccept] = useState(ACCEPTED_FILE_TYPES)

  useEffect(() => {
    handleFilesToAccept()
  }, [chatSettings?.model])

  const handleFilesToAccept = () => {
    const model = chatSettings?.model
    const FULL_MODEL = LLM_LIST.find(llm => llm.modelId === model)

    if (!FULL_MODEL) return

    setFilesToAccept(
      FULL_MODEL.imageInput
        ? `${ACCEPTED_FILE_TYPES},image/*`
        : ACCEPTED_FILE_TYPES
    )
  }

  const handleSelectDeviceFile = async (file: File) => {
    if (!profile || !selectedWorkspace || !chatSettings) return

    setShowFilesDisplay(true)
    setUseRetrieval(true)

    if (file) {
      let simplifiedFileType = file.type.split("/")[1]

      let reader = new FileReader()

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
            id: "loading",
            name: file.name,
            type: simplifiedFileType,
            file: file
          }
        ])

        // Handle docx files
        if (
          file.type.includes(
            "vnd.openxmlformats-officedocument.wordprocessingml.document" ||
              "docx"
          )
        ) {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.extractRawText({
            arrayBuffer
          })

          const createdFile = await createDocXFile(
            result.value,
            file,
            {
              user_id: profile.user_id,
              description: "",
              file_path: "",
              name: file.name,
              size: file.size,
              tokens: 0,
              type: simplifiedFileType
            },
            selectedWorkspace.id,
            chatSettings.embeddingsProvider
          )

          setFiles(prev => [...prev, createdFile])

          setNewMessageFiles(prev =>
            prev.map(item =>
              item.id === "loading"
                ? {
                    id: createdFile.id,
                    name: createdFile.name,
                    type: createdFile.type,
                    file: file
                  }
                : item
            )
          )

          reader.onloadend = null

          return
        } else {
          // Use readAsArrayBuffer for PDFs and readAsText for other types
          file.type.includes("pdf")
            ? reader.readAsArrayBuffer(file)
            : reader.readAsText(file)
        }
      } else {
        throw new Error("Unsupported file type")
      }

      reader.onloadend = async function () {
        try {
          if (file.type.includes("image")) {
            // Create a temp url for the image file
            const imageUrl = URL.createObjectURL(file)

            // This is a temporary image for display purposes in the chat input
            setNewMessageImages(prev => [
              ...prev,
              {
                messageId: "temp",
                path: "",
                base64: reader.result, // base64 image
                url: imageUrl,
                file
              }
            ])
          } else {
            const createdFile = await createFile(
              file,
              {
                user_id: profile.user_id,
                description: "",
                file_path: "",
                name: file.name,
                size: file.size,
                tokens: 0,
                type: simplifiedFileType
              },
              selectedWorkspace.id,
              chatSettings.embeddingsProvider
            )

            setFiles(prev => [...prev, createdFile])

            setNewMessageFiles(prev =>
              prev.map(item =>
                item.id === "loading"
                  ? {
                      id: createdFile.id,
                      name: createdFile.name,
                      type: createdFile.type,
                      file: file
                    }
                  : item
              )
            )
          }
        } catch (error: any) {
          toast.error("Failed to upload. " + error?.message, {
            duration: 10000
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

// File: components/chat/chat-hooks/use-chat-history.tsx
import { ChatbotUIContext } from "@/context/context"
import { useContext, useEffect, useState } from "react"

/**
 * Custom hook for handling chat history in the chat component.
 * It provides functions to set the new message content to the previous or next user message in the chat history.
 *
 * @returns An object containing the following functions:
 *   - setNewMessageContentToPreviousUserMessage: Sets the new message content to the previous user message.
 *   - setNewMessageContentToNextUserMessage: Sets the new message content to the next user message in the chat history.
 */
export const useChatHistoryHandler = () => {
  const { setUserInput, chatMessages, isGenerating } =
    useContext(ChatbotUIContext)
  const userRoleString = "user"

  const [messageHistoryIndex, setMessageHistoryIndex] = useState<number>(
    chatMessages.length
  )

  useEffect(() => {
    // If messages get deleted the history index pointed could be out of bounds
    if (!isGenerating && messageHistoryIndex > chatMessages.length)
      setMessageHistoryIndex(chatMessages.length)
  }, [chatMessages, isGenerating, messageHistoryIndex])

  /**
   * Sets the new message content to the previous user message.
   */
  const setNewMessageContentToPreviousUserMessage = () => {
    let tempIndex = messageHistoryIndex
    while (
      tempIndex > 0 &&
      chatMessages[tempIndex - 1].message.role !== userRoleString
    ) {
      tempIndex--
    }

    const previousUserMessage =
      chatMessages.length > 0 && tempIndex > 0
        ? chatMessages[tempIndex - 1]
        : null
    if (previousUserMessage) {
      setUserInput(previousUserMessage.message.content)
      setMessageHistoryIndex(tempIndex - 1)
    }
  }

  /**
   * Sets the new message content to the next user message in the chat history.
   * If there is a next user message, it updates the user input and message history index accordingly.
   * If there is no next user message, it resets the user input and sets the message history index to the end of the chat history.
   */
  const setNewMessageContentToNextUserMessage = () => {
    let tempIndex = messageHistoryIndex
    while (
      tempIndex < chatMessages.length - 1 &&
      chatMessages[tempIndex + 1].message.role !== userRoleString
    ) {
      tempIndex++
    }

    const nextUserMessage =
      chatMessages.length > 0 && tempIndex < chatMessages.length - 1
        ? chatMessages[tempIndex + 1]
        : null
    setUserInput(nextUserMessage?.message.content || "")
    setMessageHistoryIndex(
      nextUserMessage ? tempIndex + 1 : chatMessages.length
    )
  }

  return {
    setNewMessageContentToPreviousUserMessage,
    setNewMessageContentToNextUserMessage
  }
}

// File: components/chat/chat-hooks/use-chat-handler.tsx
import { ChatbotUIContext } from "@/context/context"
import { getAssistantCollectionsByAssistantId } from "@/db/assistant-collections"
import { getAssistantFilesByAssistantId } from "@/db/assistant-files"
import { getAssistantToolsByAssistantId } from "@/db/assistant-tools"
import { updateChat } from "@/db/chats"
import { getCollectionFilesByCollectionId } from "@/db/collection-files"
import { deleteMessagesIncludingAndAfter } from "@/db/messages"
import { buildFinalMessages } from "@/lib/build-prompt"
import { Tables } from "@/supabase/types"
import { ChatMessage, ChatPayload, LLMID, ModelProvider } from "@/types"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useRef } from "react"
import { LLM_LIST } from "../../../lib/models/llm/llm-list"
import {
  createTempMessages,
  handleCreateChat,
  handleCreateMessages,
  handleHostedChat,
  handleLocalChat,
  handleRetrieval,
  processResponse,
  validateChatSettings
} from "../chat-helpers"

export const useChatHandler = () => {
  const router = useRouter()

  const {
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

  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isPromptPickerOpen || !isFilePickerOpen || !isToolPickerOpen) {
      chatInputRef.current?.focus()
    }
  }, [isPromptPickerOpen, isFilePickerOpen, isToolPickerOpen])

  const handleNewChat = async () => {
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
        model: selectedAssistant.model as LLMID,
        prompt: selectedAssistant.prompt,
        temperature: selectedAssistant.temperature,
        contextLength: selectedAssistant.context_length,
        includeProfileContext: selectedAssistant.include_profile_context,
        includeWorkspaceInstructions:
          selectedAssistant.include_workspace_instructions,
        embeddingsProvider: selectedAssistant.embeddings_provider as
          | "openai"
          | "local"
      })

      let allFiles = []

      const assistantFiles = (
        await getAssistantFilesByAssistantId(selectedAssistant.id)
      ).files
      allFiles = [...assistantFiles]
      const assistantCollections = (
        await getAssistantCollectionsByAssistantId(selectedAssistant.id)
      ).collections
      for (const collection of assistantCollections) {
        const collectionFiles = (
          await getCollectionFilesByCollectionId(collection.id)
        ).files
        allFiles = [...allFiles, ...collectionFiles]
      }
      const assistantTools = (
        await getAssistantToolsByAssistantId(selectedAssistant.id)
      ).tools

      setSelectedTools(assistantTools)
      setChatFiles(
        allFiles.map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          file: null
        }))
      )

      if (allFiles.length > 0) setShowFilesDisplay(true)
    } else if (selectedPreset) {
      setChatSettings({
        model: selectedPreset.model as LLMID,
        prompt: selectedPreset.prompt,
        temperature: selectedPreset.temperature,
        contextLength: selectedPreset.context_length,
        includeProfileContext: selectedPreset.include_profile_context,
        includeWorkspaceInstructions:
          selectedPreset.include_workspace_instructions,
        embeddingsProvider: selectedPreset.embeddings_provider as
          | "openai"
          | "local"
      })
    } else if (selectedWorkspace) {
      // setChatSettings({
      //   model: (selectedWorkspace.default_model ||
      //     "gpt-4-1106-preview") as LLMID,
      //   prompt:
      //     selectedWorkspace.default_prompt ||
      //     "You are a friendly, helpful AI assistant.",
      //   temperature: selectedWorkspace.default_temperature || 0.5,
      //   contextLength: selectedWorkspace.default_context_length || 4096,
      //   includeProfileContext:
      //     selectedWorkspace.include_profile_context || true,
      //   includeWorkspaceInstructions:
      //     selectedWorkspace.include_workspace_instructions || true,
      //   embeddingsProvider:
      //     (selectedWorkspace.embeddings_provider as "openai" | "local") ||
      //     "openai"
      // })
    }

    return router.push(`/${selectedWorkspace.id}/chat`)
  }

  const handleFocusChatInput = () => {
    chatInputRef.current?.focus()
  }

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean
  ) => {
    const startingInput = messageContent

    try {
      setUserInput("")
      setIsGenerating(true)
      setIsPromptPickerOpen(false)
      setIsFilePickerOpen(false)
      setNewMessageImages([])

      const newAbortController = new AbortController()
      setAbortController(newAbortController)

      const modelData = [
        ...models.map(model => ({
          modelId: model.model_id as LLMID,
          modelName: model.name,
          provider: "custom" as ModelProvider,
          hostedId: model.id,
          platformLink: "",
          imageInput: false
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

      let currentChat = selectedChat ? { ...selectedChat } : null

      const b64Images = newMessageImages.map(image => image.base64)

      let retrievedFileItems: Tables<"file_items">[] = []

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

      const { tempUserChatMessage, tempAssistantChatMessage } =
        createTempMessages(
          messageContent,
          chatMessages,
          chatSettings!,
          b64Images,
          isRegeneration,
          setChatMessages,
          selectedAssistant
        )

      let payload: ChatPayload = {
        chatSettings: chatSettings!,
        workspaceInstructions: selectedWorkspace!.instructions || "",
        chatMessages: isRegeneration
          ? [...chatMessages]
          : [...chatMessages, tempUserChatMessage],
        assistant: selectedChat?.assistant_id ? selectedAssistant : null,
        messageFileItems: retrievedFileItems,
        chatFileItems: chatFileItems
      }

      let generatedText = ""

      if (selectedTools.length > 0) {
        setToolInUse("Tools")

        const formattedMessages = await buildFinalMessages(
          payload,
          profile!,
          chatImages
        )

        const response = await fetch("/api/chat/tools", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chatSettings: payload.chatSettings,
            messages: formattedMessages,
            selectedTools
          })
        })

        setToolInUse("none")

        generatedText = await processResponse(
          response,
          isRegeneration
            ? payload.chatMessages[payload.chatMessages.length - 1]
            : tempAssistantChatMessage,
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
        const updatedChat = await updateChat(currentChat.id, {
          updated_at: new Date().toISOString()
        })

        setChats(prevChats => {
          const updatedChats = prevChats.map(prevChat =>
            prevChat.id === updatedChat.id ? updatedChat : prevChat
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

  const handleSendEdit = async (
    editedContent: string,
    sequenceNumber: number
  ) => {
    if (!selectedChat) return

    await deleteMessagesIncludingAndAfter(
      selectedChat.user_id,
      selectedChat.id,
      sequenceNumber
    )

    const filteredMessages = chatMessages.filter(
      chatMessage => chatMessage.message.sequence_number < sequenceNumber
    )

    setChatMessages(filteredMessages)

    handleSendMessage(editedContent, filteredMessages, false)
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

// File: components/chat/chat-hooks/use-prompt-and-command.tsx
import { ChatbotUIContext } from "@/context/context"
import { getAssistantCollectionsByAssistantId } from "@/db/assistant-collections"
import { getAssistantFilesByAssistantId } from "@/db/assistant-files"
import { getAssistantToolsByAssistantId } from "@/db/assistant-tools"
import { getCollectionFilesByCollectionId } from "@/db/collection-files"
import { Tables } from "@/supabase/types"
import { LLMID } from "@/types"
import { useContext } from "react"

export const usePromptAndCommand = () => {
  const {
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

  const handleInputChange = (value: string) => {
    const atTextRegex = /@([^ ]*)$/
    const slashTextRegex = /\/([^ ]*)$/
    const hashtagTextRegex = /#([^ ]*)$/
    const toolTextRegex = /!([^ ]*)$/
    const atMatch = value.match(atTextRegex)
    const slashMatch = value.match(slashTextRegex)
    const hashtagMatch = value.match(hashtagTextRegex)
    const toolMatch = value.match(toolTextRegex)

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

  const handleSelectPrompt = (prompt: Tables<"prompts">) => {
    setIsPromptPickerOpen(false)
    setUserInput(userInput.replace(/\/[^ ]*$/, "") + prompt.content)
  }

  const handleSelectUserFile = async (file: Tables<"files">) => {
    setShowFilesDisplay(true)
    setIsFilePickerOpen(false)
    setUseRetrieval(true)

    setNewMessageFiles(prev => {
      const fileAlreadySelected =
        prev.some(prevFile => prevFile.id === file.id) ||
        chatFiles.some(chatFile => chatFile.id === file.id)

      if (!fileAlreadySelected) {
        return [
          ...prev,
          {
            id: file.id,
            name: file.name,
            type: file.type,
            file: null
          }
        ]
      }
      return prev
    })

    setUserInput(userInput.replace(/#[^ ]*$/, ""))
  }

  const handleSelectUserCollection = async (
    collection: Tables<"collections">
  ) => {
    setShowFilesDisplay(true)
    setIsFilePickerOpen(false)
    setUseRetrieval(true)

    const collectionFiles = await getCollectionFilesByCollectionId(
      collection.id
    )

    setNewMessageFiles(prev => {
      const newFiles = collectionFiles.files
        .filter(
          file =>
            !prev.some(prevFile => prevFile.id === file.id) &&
            !chatFiles.some(chatFile => chatFile.id === file.id)
        )
        .map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          file: null
        }))

      return [...prev, ...newFiles]
    })

    setUserInput(userInput.replace(/#[^ ]*$/, ""))
  }

  const handleSelectTool = (tool: Tables<"tools">) => {
    setIsToolPickerOpen(false)
    setUserInput(userInput.replace(/![^ ]*$/, ""))
    setSelectedTools(prev => [...prev, tool])
  }

  const handleSelectAssistant = async (assistant: Tables<"assistants">) => {
    setIsAssistantPickerOpen(false)
    setUserInput(userInput.replace(/@[^ ]*$/, ""))
    setSelectedAssistant(assistant)

    setChatSettings({
      model: assistant.model as LLMID,
      prompt: assistant.prompt,
      temperature: assistant.temperature,
      contextLength: assistant.context_length,
      includeProfileContext: assistant.include_profile_context,
      includeWorkspaceInstructions: assistant.include_workspace_instructions,
      embeddingsProvider: assistant.embeddings_provider as "openai" | "local"
    })

    let allFiles = []

    const assistantFiles = (await getAssistantFilesByAssistantId(assistant.id))
      .files
    allFiles = [...assistantFiles]
    const assistantCollections = (
      await getAssistantCollectionsByAssistantId(assistant.id)
    ).collections
    for (const collection of assistantCollections) {
      const collectionFiles = (
        await getCollectionFilesByCollectionId(collection.id)
      ).files
      allFiles = [...allFiles, ...collectionFiles]
    }
    const assistantTools = (await getAssistantToolsByAssistantId(assistant.id))
      .tools

    setSelectedTools(assistantTools)
    setChatFiles(
      allFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        file: null
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
import { ChatbotUIContext } from "@/context/context"
import {
  type UIEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"

export const useScroll = () => {
  const { isGenerating, chatMessages } = useContext(ChatbotUIContext)

  const messagesStartRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isAutoScrolling = useRef(false)

  const [isAtTop, setIsAtTop] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [userScrolled, setUserScrolled] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    setUserScrolled(false)

    if (!isGenerating && userScrolled) {
      setUserScrolled(false)
    }
  }, [isGenerating])

  useEffect(() => {
    if (isGenerating && !userScrolled) {
      scrollToBottom()
    }
  }, [chatMessages])

  const handleScroll: UIEventHandler<HTMLDivElement> = useCallback(e => {
    const target = e.target as HTMLDivElement
    const bottom =
      Math.round(target.scrollHeight) - Math.round(target.scrollTop) ===
      Math.round(target.clientHeight)
    setIsAtBottom(bottom)

    const top = target.scrollTop === 0
    setIsAtTop(top)

    if (!bottom && !isAutoScrolling.current) {
      setUserScrolled(true)
    } else {
      setUserScrolled(false)
    }

    const isOverflow = target.scrollHeight > target.clientHeight
    setIsOverflowing(isOverflow)
  }, [])

  const scrollToTop = useCallback(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollIntoView({ behavior: "instant" })
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    isAutoScrolling.current = true

    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" })
      }

      isAutoScrolling.current = false
    }, 100)
  }, [])

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

// File: components/messages/message-markdown.tsx
import React, { FC } from "react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { MessageCodeBlock } from "./message-codeblock"
import { MessageMarkdownMemoized } from "./message-markdown-memoized"

interface MessageMarkdownProps {
  content: string
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
  return (
    <MessageMarkdownMemoized
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>
        },
        img({ node, ...props }) {
          return <img className="max-w-[67%]" {...props} />
        },
        code({ node, className, children, ...props }) {
          const childArray = React.Children.toArray(children)
          const firstChild = childArray[0] as React.ReactElement
          const firstChildAsString = React.isValidElement(firstChild)
            ? (firstChild as React.ReactElement).props.children
            : firstChild

          if (firstChildAsString === "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>
          }

          if (typeof firstChildAsString === "string") {
            childArray[0] = firstChildAsString.replace("`▍`", "▍")
          }

          const match = /language-(\w+)/.exec(className || "")

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
              value={String(childArray).replace(/\n$/, "")}
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
import { IconMessage } from "@tabler/icons-react"
import { FC, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet"
import { WithTooltip } from "../ui/with-tooltip"
import { MESSAGE_ICON_SIZE } from "./message-actions"

interface MessageRepliesProps {}

export const MessageReplies: FC<MessageRepliesProps> = ({}) => {
  const [isOpen, setIsOpen] = useState(false)

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

// File: components/messages/message-actions.tsx
import { ChatbotUIContext } from "@/context/context"
import { IconCheck, IconCopy, IconEdit, IconRepeat } from "@tabler/icons-react"
import { FC, useContext, useEffect, useState } from "react"
import { WithTooltip } from "../ui/with-tooltip"

export const MESSAGE_ICON_SIZE = 18

interface MessageActionsProps {
  isAssistant: boolean
  isLast: boolean
  isEditing: boolean
  isHovering: boolean
  onCopy: () => void
  onEdit: () => void
  onRegenerate: () => void
}

export const MessageActions: FC<MessageActionsProps> = ({
  isAssistant,
  isLast,
  isEditing,
  isHovering,
  onCopy,
  onEdit,
  onRegenerate
}) => {
  const { isGenerating } = useContext(ChatbotUIContext)

  const [showCheckmark, setShowCheckmark] = useState(false)

  const handleCopy = () => {
    onCopy()
    setShowCheckmark(true)
  }

  const handleForkChat = async () => {}

  useEffect(() => {
    if (showCheckmark) {
      const timer = setTimeout(() => {
        setShowCheckmark(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showCheckmark])

  return (isLast && isGenerating) || isEditing ? null : (
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
            ) : (
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

      {/* {1 > 0 && isAssistant && <MessageReplies />} */}
    </div>
  )
}

// File: components/messages/message-markdown-memoized.tsx
import { FC, memo } from "react"
import ReactMarkdown, { Options } from "react-markdown"

export const MessageMarkdownMemoized: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)

// File: components/messages/message-codeblock.tsx
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { IconCheck, IconCopy, IconDownload } from "@tabler/icons-react"
import { FC, memo } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface MessageCodeBlockProps {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css"
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789" // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = memo(
  ({ language, value }) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

    const downloadAsFile = () => {
      if (typeof window === "undefined") {
        return
      }
      const fileExtension = programmingLanguages[language] || ".file"
      const suggestedFileName = `file-${generateRandomString(
        3,
        true
      )}${fileExtension}`
      const fileName = window.prompt("Enter file name" || "", suggestedFileName)

      if (!fileName) {
        return
      }

      const blob = new Blob([value], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = fileName
      link.href = url
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    const onCopy = () => {
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
              {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </Button>
          </div>
        </div>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          // showLineNumbers
          customStyle={{
            margin: 0,
            width: "100%",
            background: "transparent"
          }}
          codeTagProps={{
            style: {
              fontSize: "14px",
              fontFamily: "var(--font-mono)"
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

// File: components/messages/message.tsx
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { LLM, LLMID, MessageImage, ModelProvider } from "@/types"
import {
  IconBolt,
  IconCaretDownFilled,
  IconCaretRightFilled,
  IconCircleFilled,
  IconFileText,
  IconMoodSmile,
  IconPencil
} from "@tabler/icons-react"
import Image from "next/image"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { ModelIcon } from "../models/model-icon"
import { Button } from "../ui/button"
import { FileIcon } from "../ui/file-icon"
import { FilePreview } from "../ui/file-preview"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { WithTooltip } from "../ui/with-tooltip"
import { MessageActions } from "./message-actions"
import { MessageMarkdown } from "./message-markdown"

const ICON_SIZE = 32

interface MessageProps {
  message: Tables<"messages">
  fileItems: Tables<"file_items">[]
  isEditing: boolean
  isLast: boolean
  onStartEdit: (message: Tables<"messages">) => void
  onCancelEdit: () => void
  onSubmitEdit: (value: string, sequenceNumber: number) => void
}

export const Message: FC<MessageProps> = ({
  message,
  fileItems,
  isEditing,
  isLast,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit
}) => {
  const {
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

  const { handleSendMessage } = useChatHandler()

  const editInputRef = useRef<HTMLTextAreaElement>(null)

  const [isHovering, setIsHovering] = useState(false)
  const [editedMessage, setEditedMessage] = useState(message.content)

  const [showImagePreview, setShowImagePreview] = useState(false)
  const [selectedImage, setSelectedImage] = useState<MessageImage | null>(null)

  const [showFileItemPreview, setShowFileItemPreview] = useState(false)
  const [selectedFileItem, setSelectedFileItem] =
    useState<Tables<"file_items"> | null>(null)

  const [viewSources, setViewSources] = useState(false)

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.content)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = message.content
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
  }

  const handleSendEdit = () => {
    onSubmitEdit(editedMessage, message.sequence_number)
    onCancelEdit()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEditing && event.key === "Enter" && event.metaKey) {
      handleSendEdit()
    }
  }

  const handleRegenerate = async () => {
    setIsGenerating(true)
    await handleSendMessage(
      editedMessage || chatMessages[chatMessages.length - 2].message.content,
      chatMessages,
      true
    )
  }

  const handleStartEdit = () => {
    onStartEdit(message)
  }

  useEffect(() => {
    setEditedMessage(message.content)

    if (isEditing && editInputRef.current) {
      const input = editInputRef.current
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [isEditing])

  const MODEL_DATA = [
    ...models.map(model => ({
      modelId: model.model_id as LLMID,
      modelName: model.name,
      provider: "custom" as ModelProvider,
      hostedId: model.id,
      platformLink: "",
      imageInput: false
    })),
    ...LLM_LIST,
    ...availableLocalModels,
    ...availableOpenRouterModels
  ].find(llm => llm.modelId === message.model) as LLM

  const messageAssistantImage = assistantImages.find(
    image => image.assistantId === message.assistant_id
  )?.base64

  const selectedAssistantImage = assistantImages.find(
    image => image.path === selectedAssistant?.image_path
  )?.base64

  const modelDetails = LLM_LIST.find(model => model.modelId === message.model)

  const fileAccumulator: Record<
    string,
    {
      id: string
      name: string
      count: number
      type: string
      description: string
    }
  > = {}

  const fileSummary = fileItems.reduce((acc, fileItem) => {
    const parentFile = files.find(file => file.id === fileItem.file_id)
    if (parentFile) {
      if (!acc[parentFile.id]) {
        acc[parentFile.id] = {
          id: parentFile.id,
          name: parentFile.name,
          count: 1,
          type: parentFile.type,
          description: parentFile.description
        }
      } else {
        acc[parentFile.id].count += 1
      }
    }
    return acc
  }, fileAccumulator)

  return (
    <div
      className={cn(
        "flex w-full justify-center",
        message.role === "user" ? "" : "bg-secondary"
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
          ) : (
            <div className="flex items-center space-x-3">
              {message.role === "assistant" ? (
                messageAssistantImage ? (
                  <Image
                    style={{
                      width: `${ICON_SIZE}px`,
                      height: `${ICON_SIZE}px`
                    }}
                    className="rounded"
                    src={messageAssistantImage}
                    alt="assistant image"
                    height={ICON_SIZE}
                    width={ICON_SIZE}
                  />
                ) : (
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
              ) : profile?.image_url ? (
                <Image
                  className={`size-[32px] rounded`}
                  src={profile?.image_url}
                  height={32}
                  width={32}
                  alt="user image"
                />
              ) : (
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
                    : selectedAssistant
                      ? selectedAssistant?.name
                      : MODEL_DATA?.modelName
                  : (profile?.display_name ?? profile?.username)}
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
          ) : isEditing ? (
            <TextareaAutosize
              textareaRef={editInputRef}
              className="text-md"
              value={editedMessage}
              onValueChange={setEditedMessage}
              maxRows={20}
            />
          ) : (
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
                {fileItems.length > 1 ? " Sources " : " Source "}
                from {Object.keys(fileSummary).length}{" "}
                {Object.keys(fileSummary).length > 1 ? "Files" : "File"}{" "}
                <IconCaretRightFilled className="ml-1" />
              </div>
            ) : (
              <>
                <div
                  className="flex cursor-pointer items-center text-lg hover:opacity-50"
                  onClick={() => setViewSources(false)}
                >
                  {fileItems.length}
                  {fileItems.length > 1 ? " Sources " : " Source "}
                  from {Object.keys(fileSummary).length}{" "}
                  {Object.keys(fileSummary).length > 1 ? "Files" : "File"}{" "}
                  <IconCaretDownFilled className="ml-1" />
                </div>

                <div className="mt-3 space-y-4">
                  {Object.values(fileSummary).map((file, index) => (
                    <div key={index}>
                      <div className="flex items-center space-x-2">
                        <div>
                          <FileIcon type={file.type} />
                        </div>

                        <div className="truncate">{file.name}</div>
                      </div>

                      {fileItems
                        .filter(fileItem => {
                          const parentFile = files.find(
                            parentFile => parentFile.id === fileItem.file_id
                          )
                          return parentFile?.id === file.id
                        })
                        .map((fileItem, index) => (
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
                              {fileItem.content.substring(0, 200)}...
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
          {message.image_paths.map((path, index) => {
            const item = chatImages.find(image => image.path === path)

            return (
              <Image
                key={index}
                className="cursor-pointer rounded hover:opacity-50"
                src={path.startsWith("data") ? path : item?.base64}
                alt="message image"
                width={300}
                height={300}
                onClick={() => {
                  setSelectedImage({
                    messageId: message.id,
                    path,
                    base64: path.startsWith("data") ? path : item?.base64 || "",
                    url: path.startsWith("data") ? "" : item?.url || "",
                    file: null
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
          onOpenChange={(isOpen: boolean) => {
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
          onOpenChange={(isOpen: boolean) => {
            setShowFileItemPreview(isOpen)
            setSelectedFileItem(null)
          }}
        />
      )}
    </div>
  )
}

// File: context/context.tsx
import { Tables } from "@/supabase/types"
import {
  ChatFile,
  ChatMessage,
  ChatSettings,
  LLM,
  MessageImage,
  OpenRouterLLM,
  WorkspaceImage
} from "@/types"
import { AssistantImage } from "@/types/images/assistant-image"
import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { Dispatch, SetStateAction, createContext } from "react"

interface ChatbotUIContext {
  // PROFILE STORE
  profile: Tables<"profiles"> | null
  setProfile: Dispatch<SetStateAction<Tables<"profiles"> | null>>

  // ITEMS STORE
  assistants: Tables<"assistants">[]
  setAssistants: Dispatch<SetStateAction<Tables<"assistants">[]>>
  collections: Tables<"collections">[]
  setCollections: Dispatch<SetStateAction<Tables<"collections">[]>>
  chats: Tables<"chats">[]
  setChats: Dispatch<SetStateAction<Tables<"chats">[]>>
  files: Tables<"files">[]
  setFiles: Dispatch<SetStateAction<Tables<"files">[]>>
  folders: Tables<"folders">[]
  setFolders: Dispatch<SetStateAction<Tables<"folders">[]>>
  models: Tables<"models">[]
  setModels: Dispatch<SetStateAction<Tables<"models">[]>>
  presets: Tables<"presets">[]
  setPresets: Dispatch<SetStateAction<Tables<"presets">[]>>
  prompts: Tables<"prompts">[]
  setPrompts: Dispatch<SetStateAction<Tables<"prompts">[]>>
  tools: Tables<"tools">[]
  setTools: Dispatch<SetStateAction<Tables<"tools">[]>>
  workspaces: Tables<"workspaces">[]
  setWorkspaces: Dispatch<SetStateAction<Tables<"workspaces">[]>>

  // MODELS STORE
  envKeyMap: Record<string, VALID_ENV_KEYS>
  setEnvKeyMap: Dispatch<SetStateAction<Record<string, VALID_ENV_KEYS>>>
  availableHostedModels: LLM[]
  setAvailableHostedModels: Dispatch<SetStateAction<LLM[]>>
  availableLocalModels: LLM[]
  setAvailableLocalModels: Dispatch<SetStateAction<LLM[]>>
  availableOpenRouterModels: OpenRouterLLM[]
  setAvailableOpenRouterModels: Dispatch<SetStateAction<OpenRouterLLM[]>>

  // WORKSPACE STORE
  selectedWorkspace: Tables<"workspaces"> | null
  setSelectedWorkspace: Dispatch<SetStateAction<Tables<"workspaces"> | null>>
  workspaceImages: WorkspaceImage[]
  setWorkspaceImages: Dispatch<SetStateAction<WorkspaceImage[]>>

  // PRESET STORE
  selectedPreset: Tables<"presets"> | null
  setSelectedPreset: Dispatch<SetStateAction<Tables<"presets"> | null>>

  // ASSISTANT STORE
  selectedAssistant: Tables<"assistants"> | null
  setSelectedAssistant: Dispatch<SetStateAction<Tables<"assistants"> | null>>
  assistantImages: AssistantImage[]
  setAssistantImages: Dispatch<SetStateAction<AssistantImage[]>>
  openaiAssistants: any[]
  setOpenaiAssistants: Dispatch<SetStateAction<any[]>>

  // PASSIVE CHAT STORE
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
  chatMessages: ChatMessage[]
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
  chatSettings: ChatSettings | null
  setChatSettings: Dispatch<SetStateAction<ChatSettings>>
  selectedChat: Tables<"chats"> | null
  setSelectedChat: Dispatch<SetStateAction<Tables<"chats"> | null>>
  chatFileItems: Tables<"file_items">[]
  setChatFileItems: Dispatch<SetStateAction<Tables<"file_items">[]>>

  // ACTIVE CHAT STORE
  abortController: AbortController | null
  setAbortController: Dispatch<SetStateAction<AbortController | null>>
  firstTokenReceived: boolean
  setFirstTokenReceived: Dispatch<SetStateAction<boolean>>
  isGenerating: boolean
  setIsGenerating: Dispatch<SetStateAction<boolean>>

  // CHAT INPUT COMMAND STORE
  isPromptPickerOpen: boolean
  setIsPromptPickerOpen: Dispatch<SetStateAction<boolean>>
  slashCommand: string
  setSlashCommand: Dispatch<SetStateAction<string>>
  isFilePickerOpen: boolean
  setIsFilePickerOpen: Dispatch<SetStateAction<boolean>>
  hashtagCommand: string
  setHashtagCommand: Dispatch<SetStateAction<string>>
  isToolPickerOpen: boolean
  setIsToolPickerOpen: Dispatch<SetStateAction<boolean>>
  toolCommand: string
  setToolCommand: Dispatch<SetStateAction<string>>
  focusPrompt: boolean
  setFocusPrompt: Dispatch<SetStateAction<boolean>>
  focusFile: boolean
  setFocusFile: Dispatch<SetStateAction<boolean>>
  focusTool: boolean
  setFocusTool: Dispatch<SetStateAction<boolean>>
  focusAssistant: boolean
  setFocusAssistant: Dispatch<SetStateAction<boolean>>
  atCommand: string
  setAtCommand: Dispatch<SetStateAction<string>>
  isAssistantPickerOpen: boolean
  setIsAssistantPickerOpen: Dispatch<SetStateAction<boolean>>

  // ATTACHMENTS STORE
  chatFiles: ChatFile[]
  setChatFiles: Dispatch<SetStateAction<ChatFile[]>>
  chatImages: MessageImage[]
  setChatImages: Dispatch<SetStateAction<MessageImage[]>>
  newMessageFiles: ChatFile[]
  setNewMessageFiles: Dispatch<SetStateAction<ChatFile[]>>
  newMessageImages: MessageImage[]
  setNewMessageImages: Dispatch<SetStateAction<MessageImage[]>>
  showFilesDisplay: boolean
  setShowFilesDisplay: Dispatch<SetStateAction<boolean>>

  // RETRIEVAL STORE
  useRetrieval: boolean
  setUseRetrieval: Dispatch<SetStateAction<boolean>>
  sourceCount: number
  setSourceCount: Dispatch<SetStateAction<number>>

  // TOOL STORE
  selectedTools: Tables<"tools">[]
  setSelectedTools: Dispatch<SetStateAction<Tables<"tools">[]>>
  toolInUse: string
  setToolInUse: Dispatch<SetStateAction<string>>
}

export const ChatbotUIContext = createContext<ChatbotUIContext>({
  // PROFILE STORE
  profile: null,
  setProfile: () => {},

  // ITEMS STORE
  assistants: [],
  setAssistants: () => {},
  collections: [],
  setCollections: () => {},
  chats: [],
  setChats: () => {},
  files: [],
  setFiles: () => {},
  folders: [],
  setFolders: () => {},
  models: [],
  setModels: () => {},
  presets: [],
  setPresets: () => {},
  prompts: [],
  setPrompts: () => {},
  tools: [],
  setTools: () => {},
  workspaces: [],
  setWorkspaces: () => {},

  // MODELS STORE
  envKeyMap: {},
  setEnvKeyMap: () => {},
  availableHostedModels: [],
  setAvailableHostedModels: () => {},
  availableLocalModels: [],
  setAvailableLocalModels: () => {},
  availableOpenRouterModels: [],
  setAvailableOpenRouterModels: () => {},

  // WORKSPACE STORE
  selectedWorkspace: null,
  setSelectedWorkspace: () => {},
  workspaceImages: [],
  setWorkspaceImages: () => {},

  // PRESET STORE
  selectedPreset: null,
  setSelectedPreset: () => {},

  // ASSISTANT STORE
  selectedAssistant: null,
  setSelectedAssistant: () => {},
  assistantImages: [],
  setAssistantImages: () => {},
  openaiAssistants: [],
  setOpenaiAssistants: () => {},

  // PASSIVE CHAT STORE
  userInput: "",
  setUserInput: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  chatMessages: [],
  setChatMessages: () => {},
  chatSettings: null,
  setChatSettings: () => {},
  chatFileItems: [],
  setChatFileItems: () => {},

  // ACTIVE CHAT STORE
  isGenerating: false,
  setIsGenerating: () => {},
  firstTokenReceived: false,
  setFirstTokenReceived: () => {},
  abortController: null,
  setAbortController: () => {},

  // CHAT INPUT COMMAND STORE
  isPromptPickerOpen: false,
  setIsPromptPickerOpen: () => {},
  slashCommand: "",
  setSlashCommand: () => {},
  isFilePickerOpen: false,
  setIsFilePickerOpen: () => {},
  hashtagCommand: "",
  setHashtagCommand: () => {},
  isToolPickerOpen: false,
  setIsToolPickerOpen: () => {},
  toolCommand: "",
  setToolCommand: () => {},
  focusPrompt: false,
  setFocusPrompt: () => {},
  focusFile: false,
  setFocusFile: () => {},
  focusTool: false,
  setFocusTool: () => {},
  focusAssistant: false,
  setFocusAssistant: () => {},
  atCommand: "",
  setAtCommand: () => {},
  isAssistantPickerOpen: false,
  setIsAssistantPickerOpen: () => {},

  // ATTACHMENTS STORE
  chatFiles: [],
  setChatFiles: () => {},
  chatImages: [],
  setChatImages: () => {},
  newMessageFiles: [],
  setNewMessageFiles: () => {},
  newMessageImages: [],
  setNewMessageImages: () => {},
  showFilesDisplay: false,
  setShowFilesDisplay: () => {},

  // RETRIEVAL STORE
  useRetrieval: false,
  setUseRetrieval: () => {},
  sourceCount: 4,
  setSourceCount: () => {},

  // TOOL STORE
  selectedTools: [],
  setSelectedTools: () => {},
  toolInUse: "none",
  setToolInUse: () => {}
})

// File: lib/envs.ts
import { EnvKey } from "@/types/key-type"

// returns true if the key is found in the environment variables
export function isUsingEnvironmentKey(type: EnvKey) {
  return Boolean(process.env[type])
}

// File: lib/retrieval/processing/csv.ts
import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { CSVLoader } from "langchain/document_loaders/fs/csv"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."

export const processCSV = async (csv: Blob): Promise<FileItemChunk[]> => {
  const loader = new CSVLoader(csv)
  const docs = await loader.load()
  let completeText = docs.map(doc => doc.pageContent).join("\n\n")

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    separators: ["\n\n"]
  })
  const splitDocs = await splitter.createDocuments([completeText])

  let chunks: FileItemChunk[] = []

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i]

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
    })
  }

  return chunks
}

// File: lib/retrieval/processing/md.ts
import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."

export const processMarkdown = async (
  markdown: Blob
): Promise<FileItemChunk[]> => {
  const fileBuffer = Buffer.from(await markdown.arrayBuffer())
  const textDecoder = new TextDecoder("utf-8")
  const textContent = textDecoder.decode(fileBuffer)

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })

  const splitDocs = await splitter.createDocuments([textContent])

  let chunks: FileItemChunk[] = []

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i]

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
    })
  }

  return chunks
}

// File: lib/retrieval/processing/pdf.ts
import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."

export const processPdf = async (pdf: Blob): Promise<FileItemChunk[]> => {
  const loader = new PDFLoader(pdf)
  const docs = await loader.load()
  let completeText = docs.map(doc => doc.pageContent).join(" ")

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })
  const splitDocs = await splitter.createDocuments([completeText])

  let chunks: FileItemChunk[] = []

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i]

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
    })
  }

  return chunks
}

// File: lib/retrieval/processing/json.ts
import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { JSONLoader } from "langchain/document_loaders/fs/json"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."

export const processJSON = async (json: Blob): Promise<FileItemChunk[]> => {
  const loader = new JSONLoader(json)
  const docs = await loader.load()
  let completeText = docs.map(doc => doc.pageContent).join(" ")

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })
  const splitDocs = await splitter.createDocuments([completeText])

  let chunks: FileItemChunk[] = []

  splitDocs.forEach(doc => {
    const docTokens = encode(doc.pageContent).length
  })

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i]

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
    })
  }

  return chunks
}

// File: lib/retrieval/processing/txt.ts
import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."

export const processTxt = async (txt: Blob): Promise<FileItemChunk[]> => {
  const fileBuffer = Buffer.from(await txt.arrayBuffer())
  const textDecoder = new TextDecoder("utf-8")
  const textContent = textDecoder.decode(fileBuffer)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })
  const splitDocs = await splitter.createDocuments([textContent])

  let chunks: FileItemChunk[] = []

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i]

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
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

export const CHUNK_SIZE = 4000
export const CHUNK_OVERLAP = 200

// File: lib/retrieval/processing/docx.ts
import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."

export const processDocX = async (text: string): Promise<FileItemChunk[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })
  const splitDocs = await splitter.createDocuments([text])

  let chunks: FileItemChunk[] = []

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i]

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length
    })
  }

  return chunks
}

// File: lib/consume-stream.ts
export async function consumeReadableStream(
  stream: ReadableStream<Uint8Array>,
  callback: (chunk: string) => void,
  signal: AbortSignal
): Promise<void> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  signal.addEventListener("abort", () => reader.cancel(), { once: true })

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      if (value) {
        callback(decoder.decode(value, { stream: true }))
      }
    }
  } catch (error) {
    if (signal.aborted) {
      console.error("Stream reading was aborted:", error)
    } else {
      console.error("Error consuming stream:", error)
    }
  } finally {
    reader.releaseLock()
  }
}

// File: lib/types.ts
import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

// File: lib/server/server-utils.ts
export function createResponse(data: object, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  })
}

// File: lib/server/server-chat-helpers.ts
import { Database, Tables } from "@/supabase/types"
import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getServerProfile() {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    throw new Error("User not found")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!profile) {
    throw new Error("Profile not found")
  }

  const profileWithKeys = addApiKeysToProfile(profile)

  return profileWithKeys
}

function addApiKeysToProfile(profile: Tables<"profiles">) {
  const apiKeys = {
    [VALID_ENV_KEYS.OPENAI_API_KEY]: "openai_api_key",
    [VALID_ENV_KEYS.ANTHROPIC_API_KEY]: "anthropic_api_key",
    [VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY]: "google_gemini_api_key",
    [VALID_ENV_KEYS.MISTRAL_API_KEY]: "mistral_api_key",
    [VALID_ENV_KEYS.GROQ_API_KEY]: "groq_api_key",
    [VALID_ENV_KEYS.PERPLEXITY_API_KEY]: "perplexity_api_key",
    [VALID_ENV_KEYS.AZURE_OPENAI_API_KEY]: "azure_openai_api_key",
    [VALID_ENV_KEYS.OPENROUTER_API_KEY]: "openrouter_api_key",

    [VALID_ENV_KEYS.OPENAI_ORGANIZATION_ID]: "openai_organization_id",

    [VALID_ENV_KEYS.AZURE_OPENAI_ENDPOINT]: "azure_openai_endpoint",
    [VALID_ENV_KEYS.AZURE_GPT_35_TURBO_NAME]: "azure_openai_35_turbo_id",
    [VALID_ENV_KEYS.AZURE_GPT_45_VISION_NAME]: "azure_openai_45_vision_id",
    [VALID_ENV_KEYS.AZURE_GPT_45_TURBO_NAME]: "azure_openai_45_turbo_id",
    [VALID_ENV_KEYS.AZURE_EMBEDDINGS_NAME]: "azure_openai_embeddings_id"
  }

  for (const [envKey, profileKey] of Object.entries(apiKeys)) {
    if (process.env[envKey]) {
      ;(profile as any)[profileKey] = process.env[envKey]
    }
  }

  return profile
}

export function checkApiKey(apiKey: string | null, keyName: string) {
  if (apiKey === null || apiKey === "") {
    throw new Error(`${keyName} API Key not found`)
  }
}

// File: lib/export-old-data.ts
export function exportLocalStorageAsJSON() {
  const data: { [key: string]: string | null } = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key !== null) {
      data[key] = localStorage.getItem(key)
    }
  }

  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "chatbot-ui-data.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// File: lib/models/llm/groq-llm-list.ts
import { LLM } from "@/types"

const GROQ_PLATORM_LINK = "https://groq.com/"

const LLaMA3_8B: LLM = {
  modelId: "llama3-8b-8192",
  modelName: "LLaMA3-8b-chat",
  provider: "groq",
  hostedId: "llama3-8b-8192",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.05,
    outputCost: 0.1
  }
}

const LLaMA3_70B: LLM = {
  modelId: "llama3-70b-8192",
  modelName: "LLaMA3-70b-chat",
  provider: "groq",
  hostedId: "llama3-70b-4096",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.59,
    outputCost: 0.79
  }
}

const MIXTRAL_8X7B: LLM = {
  modelId: "mixtral-8x7b-32768",
  modelName: "Mixtral-8x7b-Instruct-v0.1",
  provider: "groq",
  hostedId: "mixtral-8x7b-32768",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.27,
    outputCost: 0.27
  }
}

const GEMMA_7B_IT: LLM = {
  modelId: "gemma-7b-it",
  modelName: "Gemma-7b-It",
  provider: "groq",
  hostedId: "gemma-7b-it",
  platformLink: GROQ_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.15,
    outputCost: 0.15
  }
}

export const GROQ_LLM_LIST: LLM[] = [
  LLaMA3_8B,
  LLaMA3_70B,
  MIXTRAL_8X7B,
  GEMMA_7B_IT
]

// File: lib/models/llm/llm-list.ts
import { LLM } from "@/types"
import { ANTHROPIC_LLM_LIST } from "./anthropic-llm-list"
import { GOOGLE_LLM_LIST } from "./google-llm-list"
import { MISTRAL_LLM_LIST } from "./mistral-llm-list"
import { GROQ_LLM_LIST } from "./groq-llm-list"
import { OPENAI_LLM_LIST } from "./openai-llm-list"
import { PERPLEXITY_LLM_LIST } from "./perplexity-llm-list"

export const LLM_LIST: LLM[] = [
  ...OPENAI_LLM_LIST,
  ...GOOGLE_LLM_LIST,
  ...MISTRAL_LLM_LIST,
  ...GROQ_LLM_LIST,
  ...PERPLEXITY_LLM_LIST,
  ...ANTHROPIC_LLM_LIST
]

export const LLM_LIST_MAP: Record<string, LLM[]> = {
  openai: OPENAI_LLM_LIST,
  azure: OPENAI_LLM_LIST,
  google: GOOGLE_LLM_LIST,
  mistral: MISTRAL_LLM_LIST,
  groq: GROQ_LLM_LIST,
  perplexity: PERPLEXITY_LLM_LIST,
  anthropic: ANTHROPIC_LLM_LIST
}

// File: lib/models/llm/anthropic-llm-list.ts
import { LLM } from "@/types"

const ANTHROPIC_PLATFORM_LINK =
  "https://docs.anthropic.com/claude/reference/getting-started-with-the-api"

// Anthropic Models (UPDATED 06/20/24) -----------------------------

// Claude 2 (UPDATED 12/21/23)
const CLAUDE_2: LLM = {
  modelId: "claude-2.1",
  modelName: "Claude 2",
  provider: "anthropic",
  hostedId: "claude-2.1",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 8,
    outputCost: 24
  }
}

// Claude Instant (UPDATED 12/21/23)
const CLAUDE_INSTANT: LLM = {
  modelId: "claude-instant-1.2",
  modelName: "Claude Instant",
  provider: "anthropic",
  hostedId: "claude-instant-1.2",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.8,
    outputCost: 2.4
  }
}

// Claude 3 Haiku (UPDATED 03/13/24)
const CLAUDE_3_HAIKU: LLM = {
  modelId: "claude-3-haiku-20240307",
  modelName: "Claude 3 Haiku",
  provider: "anthropic",
  hostedId: "claude-3-haiku-20240307",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.25,
    outputCost: 1.25
  }
}

// Claude 3 Sonnet (UPDATED 03/04/24)
const CLAUDE_3_SONNET: LLM = {
  modelId: "claude-3-sonnet-20240229",
  modelName: "Claude 3 Sonnet",
  provider: "anthropic",
  hostedId: "claude-3-sonnet-20240229",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
}

// Claude 3 Opus (UPDATED 03/04/24)
const CLAUDE_3_OPUS: LLM = {
  modelId: "claude-3-opus-20240229",
  modelName: "Claude 3 Opus",
  provider: "anthropic",
  hostedId: "claude-3-opus-20240229",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 15,
    outputCost: 75
  }
}

// Claude 3.5 Sonnet (UPDATED 06/20/24)
const CLAUDE_3_5_SONNET: LLM = {
  modelId: "claude-3-5-sonnet-20240620",
  modelName: "Claude 3.5 Sonnet",
  provider: "anthropic",
  hostedId: "claude-3-5-sonnet-20240620",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
}

export const ANTHROPIC_LLM_LIST: LLM[] = [
  CLAUDE_2,
  CLAUDE_INSTANT,
  CLAUDE_3_HAIKU,
  CLAUDE_3_SONNET,
  CLAUDE_3_OPUS,
  CLAUDE_3_5_SONNET
]

