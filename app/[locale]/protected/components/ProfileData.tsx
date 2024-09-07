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
