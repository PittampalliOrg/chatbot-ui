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
