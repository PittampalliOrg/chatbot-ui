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
