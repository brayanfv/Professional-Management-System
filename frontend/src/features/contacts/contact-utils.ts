import {
  ContactRoundIcon,
  MailIcon,
  PhoneIcon,
  SmartphoneIcon,
  type LucideIcon,
} from "lucide-react"

import type { ContactType } from "@/types/contact"

const contactTypeConfig: Record<
  ContactType,
  { label: string; placeholder: string; icon: LucideIcon }
> = {
  EMAIL: {
    label: "Email",
    placeholder: "name@example.com",
    icon: MailIcon,
  },
  PHONE: {
    label: "Phone",
    placeholder: "+1 555 123 4567",
    icon: PhoneIcon,
  },
  MOBILE: {
    label: "Mobile",
    placeholder: "+1 555 123 4567",
    icon: SmartphoneIcon,
  },
  OTHER: {
    label: "Other",
    placeholder: "Enter contact value",
    icon: ContactRoundIcon,
  },
}

export function getContactTypeConfig(type: ContactType) {
  return contactTypeConfig[type]
}
