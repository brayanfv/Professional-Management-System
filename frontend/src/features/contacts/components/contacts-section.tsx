"use client"

import {
  CircleAlertIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { useState } from "react"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { ContactForm } from "@/features/contacts/components/contact-form"
import { getContactTypeConfig } from "@/features/contacts/contact-utils"
import { useDeleteContact } from "@/features/contacts/hooks/use-contact-mutations"
import { useProfessionalContacts } from "@/features/contacts/hooks/use-professional-contacts"
import { hasApiErrorCode } from "@/lib/api/errors"
import { useAppToast } from "@/providers/toast-provider"
import type { Contact } from "@/types/contact"

type ContactEditor =
  | { mode: "create" }
  | { mode: "edit"; contact: Contact }
  | null

function ContactsSkeleton() {
  return (
    <div className="divide-y divide-border" aria-busy="true">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
          <Skeleton className="size-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>
          <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
          <Skeleton className="size-8" />
        </div>
      ))}
    </div>
  )
}

function ContactItem({
  contact,
  onEdit,
  onDelete,
}: {
  contact: Contact
  onEdit: () => void
  onDelete: () => void
}) {
  const config = getContactTypeConfig(contact.type)
  const Icon = config.icon

  return (
    <li className="flex items-start gap-3 py-4 first:pt-0 last:pb-0 sm:items-center sm:gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">
          {config.label}
        </p>
        <p className="break-words text-sm font-medium text-foreground">
          {contact.value}
        </p>
        {contact.label ? (
          <p className="mt-1 text-xs text-muted-foreground sm:hidden">
            {contact.label}
          </p>
        ) : null}
      </div>
      {contact.label ? (
        <span className="hidden max-w-48 truncate rounded-full bg-surface-secondary px-2 py-1 text-xs font-medium text-text-secondary sm:block">
          {contact.label}
        </span>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label={`Actions for ${config.label} contact`}
            />
          }
        >
          <EllipsisVerticalIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={onEdit}>
            <PencilIcon aria-hidden="true" />
            Edit contact
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2Icon aria-hidden="true" />
            Delete contact
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

export function ContactsSection({
  professionalId,
  professionalName,
}: {
  professionalId: number
  professionalName: string
}) {
  const toast = useAppToast()
  const contactsQuery = useProfessionalContacts(professionalId)
  const deleteContact = useDeleteContact(professionalId)
  const [editor, setEditor] = useState<ContactEditor>(null)
  const [editorPending, setEditorPending] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)

  function closeEditor() {
    setEditor(null)
    setEditorPending(false)
  }

  async function handleDeleteContact() {
    if (!contactToDelete) return

    try {
      await deleteContact.mutateAsync(contactToDelete.id)
      toast.success("Contact deleted successfully.")
      setContactToDelete(null)
    } catch (error) {
      if (hasApiErrorCode(error, "CONTACT_NOT_FOUND")) {
        toast.error("This contact is no longer available.")
        setContactToDelete(null)
        void contactsQuery.refetch()
        return
      }

      toast.error("Unable to delete this contact. Please try again.")
    }
  }

  function handleContactUnavailable() {
    closeEditor()
    void contactsQuery.refetch()
  }

  const editingContact = editor?.mode === "edit" ? editor.contact : undefined

  return (
    <>
      <Card>
        <CardHeader className="border-b border-border pb-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="space-y-1">
            <CardTitle>Contacts</CardTitle>
            <CardDescription>
              Manage contact methods for this professional.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="mt-3 w-fit sm:mt-0"
            onClick={() => setEditor({ mode: "create" })}
          >
            <PlusIcon aria-hidden="true" />
            Add contact
          </Button>
        </CardHeader>
        <CardContent>
          {contactsQuery.isPending ? <ContactsSkeleton /> : null}

          {contactsQuery.isError ? (
            <div
              className="flex min-h-48 flex-col items-center justify-center gap-3 text-center"
              role="alert"
            >
              <CircleAlertIcon
                className="size-5 text-danger"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-foreground">
                Unable to load contacts.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void contactsQuery.refetch()}
              >
                Try again
              </Button>
            </div>
          ) : null}

          {contactsQuery.data?.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No contacts yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Add a contact method to make this professional easier to reach.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setEditor({ mode: "create" })}
              >
                <PlusIcon aria-hidden="true" />
                Add contact
              </Button>
            </div>
          ) : null}

          {contactsQuery.data && contactsQuery.data.length > 0 ? (
            <ul className="divide-y divide-border">
              {contactsQuery.data.map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  onEdit={() => setEditor({ mode: "edit", contact })}
                  onDelete={() => setContactToDelete(contact)}
                />
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>

      <Sheet
        open={editor !== null}
        disablePointerDismissal={editorPending}
        onOpenChange={(open, eventDetails) => {
          if (!open && editorPending) {
            eventDetails.cancel()
            return
          }
          if (!open) closeEditor()
        }}
      >
        <SheetContent side="right" showCloseButton={!editorPending}>
          <SheetHeader>
            <SheetTitle>
              {editor?.mode === "edit" ? "Edit contact" : "Add contact"}
            </SheetTitle>
            <SheetDescription>
              {editor?.mode === "edit"
                ? `Update this contact method for ${professionalName}.`
                : `Add a contact method for ${professionalName}.`}
            </SheetDescription>
          </SheetHeader>
          {editor ? (
            <ContactForm
              key={editingContact?.id ?? "create"}
              mode={editor.mode}
              professionalId={professionalId}
              contact={editingContact}
              onSuccess={closeEditor}
              onCancel={closeEditor}
              onContactUnavailable={handleContactUnavailable}
              onPendingChange={setEditorPending}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={contactToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setContactToDelete(null)
        }}
        title="Delete contact?"
        description={`This contact will be permanently removed from ${professionalName}.`}
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        variant="destructive"
        loading={deleteContact.isPending}
        onConfirm={() => void handleDeleteContact()}
      />
    </>
  )
}
