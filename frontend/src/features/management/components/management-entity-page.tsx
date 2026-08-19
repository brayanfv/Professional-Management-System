"use client"

import { PlusIcon } from "lucide-react"
import type { ComponentType } from "react"
import { useEffect, useState } from "react"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { PageHeader } from "@/components/common/page-header"
import { SearchInput } from "@/components/common/search-input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  ManagementEntityList,
  type ManagementEntity,
} from "@/features/management/components/management-entity-list"
import type { ManagementFeatureFormProps } from "@/features/management/components/management-entity-form"
import { hasApiErrorCode } from "@/lib/api/errors"
import { useAppToast } from "@/providers/toast-provider"
import type {
  ManagementEntityQueryParams,
  ManagementEntityRequest,
} from "@/types/management"
import type { PageResponse } from "@/types/pagination"

type Editor = { mode: "create" } | { mode: "edit"; entity: ManagementEntity } | null

type ManagementEntityPageConfig = {
  entityName: string
  entityNamePlural: string
  pageTitle: string
  pageDescription: string
  newLabel: string
  searchPlaceholder: string
  createSheetTitle: string
  createSheetDescription: string
  editSheetTitle: string
  editSheetDescription: string
  emptyDescription: string
  filteredEmptyDescription: string
  deleteTitle: string
  deleteSuccessMessage: string
  notFoundCode: string
  notFoundMessage: string
  inUseCode: string
  inUseTitle: string
  inUseMessage: string
}

export function ManagementEntityPage({
  config,
  FormComponent,
  params,
  searchInput,
  data,
  isPending,
  isError,
  isUpdating,
  createPending,
  updatePending,
  deletePending,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onRetry,
  onCreate,
  onUpdate,
  onDelete,
}: {
  config: ManagementEntityPageConfig
  FormComponent: ComponentType<ManagementFeatureFormProps>
  params: ManagementEntityQueryParams
  searchInput: string
  data: PageResponse<ManagementEntity> | undefined
  isPending: boolean
  isError: boolean
  isUpdating: boolean
  createPending: boolean
  updatePending: boolean
  deletePending: boolean
  onSearchChange: (value: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRetry: () => void
  onCreate: (payload: ManagementEntityRequest) => Promise<ManagementEntity>
  onUpdate: (
    id: number,
    payload: ManagementEntityRequest,
  ) => Promise<ManagementEntity>
  onDelete: (id: number) => Promise<void>
}) {
  const toast = useAppToast()
  const [editor, setEditor] = useState<Editor>(null)
  const [formDirty, setFormDirty] = useState(false)
  const [formPending, setFormPending] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [entityToDelete, setEntityToDelete] = useState<ManagementEntity | null>(
    null,
  )
  const [deleteError, setDeleteError] = useState<{
    title?: string
    message: string
  } | null>(null)

  useEffect(() => {
    if (!data) return
    const lastPage = Math.max(data.totalPages - 1, 0)
    if (params.page > lastPage) onPageChange(lastPage)
  }, [data, onPageChange, params.page])

  function closeEditor() {
    setEditor(null)
    setFormDirty(false)
    setFormPending(false)
    setDiscardOpen(false)
  }

  function requestEditorClose() {
    if (formPending) return
    if (formDirty) {
      setDiscardOpen(true)
      return
    }
    closeEditor()
  }

  async function handleDelete() {
    if (!entityToDelete) return
    setDeleteError(null)

    try {
      await onDelete(entityToDelete.id)
      toast.success(config.deleteSuccessMessage)
      setEntityToDelete(null)
    } catch (error) {
      if (hasApiErrorCode(error, config.inUseCode)) {
        setDeleteError({
          title: config.inUseTitle,
          message: config.inUseMessage,
        })
        toast.error(config.inUseMessage, config.inUseTitle)
        return
      }

      if (hasApiErrorCode(error, config.notFoundCode)) {
        toast.error(config.notFoundMessage)
        setEntityToDelete(null)
        onRetry()
        return
      }

      setDeleteError({
        message: `Unable to delete this ${config.entityName}. Please try again.`,
      })
    }
  }

  const editingEntity = editor?.mode === "edit" ? editor.entity : undefined
  const editorPending = editor?.mode === "edit" ? updatePending : createPending

  return (
    <section className="space-y-5 sm:space-y-6">
      <PageHeader
        title={config.pageTitle}
        description={config.pageDescription}
        actions={
          <Button
            className="w-full sm:w-auto"
            onClick={() => setEditor({ mode: "create" })}
          >
            <PlusIcon aria-hidden="true" />
            {config.newLabel}
          </Button>
        }
      />

      <ManagementEntityList
        data={data}
        entityName={config.entityName}
        entityNamePlural={config.entityNamePlural}
        emptyDescription={config.emptyDescription}
        filteredEmptyDescription={config.filteredEmptyDescription}
        isPending={isPending}
        isError={isError}
        isUpdating={isUpdating}
        hasSearch={Boolean(params.search)}
        toolbar={
          <SearchInput
            id={`${config.entityNamePlural}-search`}
            label={`Search ${config.entityNamePlural}`}
            placeholder={config.searchPlaceholder}
            value={searchInput}
            onChange={onSearchChange}
          />
        }
        onRetry={onRetry}
        onCreate={() => setEditor({ mode: "create" })}
        onEdit={(entity) => setEditor({ mode: "edit", entity })}
        onDelete={(entity) => {
          setDeleteError(null)
          setEntityToDelete(entity)
        }}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      <Sheet
        open={editor !== null}
        disablePointerDismissal={formPending}
        onOpenChange={(open, eventDetails) => {
          if (open) return

          eventDetails.cancel()
          requestEditorClose()
        }}
      >
        <SheetContent
          side="right"
          showCloseButton={!formPending}
          className="sm:data-[side=right]:max-w-[29rem]"
        >
          <SheetHeader className="gap-1 px-5 py-4 pr-13 sm:px-6 sm:py-5 sm:pr-14">
            <SheetTitle>
              {editor?.mode === "edit"
                ? config.editSheetTitle
                : config.createSheetTitle}
            </SheetTitle>
            <SheetDescription>
              {editor?.mode === "edit"
                ? config.editSheetDescription
                : config.createSheetDescription}
            </SheetDescription>
          </SheetHeader>
          {editor ? (
            <FormComponent
              key={editingEntity?.id ?? "create"}
              mode={editor.mode}
              entity={editingEntity}
              onSave={(payload) =>
                editor.mode === "edit"
                  ? onUpdate(editor.entity.id, payload)
                  : onCreate(payload)
              }
              isPending={editorPending}
              onSuccess={closeEditor}
              onUnavailable={() => {
                closeEditor()
                onRetry()
              }}
              onRequestClose={requestEditorClose}
              onDirtyChange={setFormDirty}
              onPendingChange={setFormPending}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        title="Discard changes?"
        description="You have unsaved changes. If you close this form, your changes will be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        variant="destructive"
        onConfirm={closeEditor}
      />

      <ConfirmDialog
        open={entityToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEntityToDelete(null)
            setDeleteError(null)
          }
        }}
        title={config.deleteTitle}
        description={
          <span className="space-y-3">
            <span className="block">
              {entityToDelete?.name} will be permanently deleted. This action
              cannot be undone.
            </span>
            {deleteError ? (
              <span
                className="block rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-danger-foreground"
                role="alert"
              >
                {deleteError.title ? (
                  <span className="mb-1 block font-medium">
                    {deleteError.title}
                  </span>
                ) : null}
                <span className="block">{deleteError.message}</span>
              </span>
            ) : null}
          </span>
        }
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        variant="destructive"
        loading={deletePending}
        onConfirm={() => void handleDelete()}
      />
    </section>
  )
}
