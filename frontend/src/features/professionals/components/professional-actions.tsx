"use client"

import { EllipsisVerticalIcon, EyeIcon, PencilIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getProfessionalDetailsHref,
  getProfessionalEditHref,
} from "@/features/professionals/professional-navigation"

export function ProfessionalActions({
  professionalId,
  returnHref,
}: {
  professionalId: number
  returnHref?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Open professional actions"
          />
        }
      >
        <EllipsisVerticalIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          render={
            <Link
              href={getProfessionalDetailsHref(professionalId, returnHref)}
            />
          }
        >
          <EyeIcon aria-hidden="true" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem
          render={
            <Link href={getProfessionalEditHref(professionalId, returnHref)} />
          }
        >
          <PencilIcon aria-hidden="true" />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
