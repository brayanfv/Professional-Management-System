"use client"

import {
  CircleAlertIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import type { ReactNode } from "react"

import { Pagination } from "@/components/common/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { formatShortDate } from "@/lib/date"
import { cn } from "@/lib/utils"
import type { PageResponse } from "@/types/pagination"

export type ManagementEntity = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

function ListSkeleton() {
  return (
    <div className="divide-y divide-border" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex items-start gap-3 px-4 py-3 sm:px-5">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-44 max-w-full" />
            <Skeleton className="h-4 w-80 max-w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="size-9 shrink-0 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function ManagementEntityList({
  data,
  entityName,
  entityNamePlural,
  emptyDescription,
  filteredEmptyDescription,
  isPending,
  isError,
  isUpdating,
  hasSearch,
  toolbar,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: {
  data: PageResponse<ManagementEntity> | undefined
  entityName: string
  entityNamePlural: string
  emptyDescription: string
  filteredEmptyDescription: string
  isPending: boolean
  isError: boolean
  isUpdating: boolean
  hasSearch: boolean
  toolbar: ReactNode
  onRetry: () => void
  onCreate: () => void
  onEdit: (entity: ManagementEntity) => void
  onDelete: (entity: ManagementEntity) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}) {
  let content: ReactNode = null

  if (isPending) {
    content = <ListSkeleton />
  } else if (isError) {
    content = (
      <div
        className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 py-10 text-center"
        role="alert"
      >
        <CircleAlertIcon className="size-5 text-danger" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Unable to load {entityNamePlural}
          </p>
          <p className="text-sm text-muted-foreground">
            Something went wrong while loading this data.
          </p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  } else if (data?.totalElements === 0) {
    content = (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 py-10 text-center">
        <span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary">
          <PlusIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            {hasSearch
              ? `No ${entityNamePlural} found`
              : `No ${entityNamePlural} yet`}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasSearch ? filteredEmptyDescription : emptyDescription}
          </p>
        </div>
        {!hasSearch ? (
          <Button variant="outline" onClick={onCreate}>
            <PlusIcon aria-hidden="true" />
            New {entityName}
          </Button>
        ) : null}
      </div>
    )
  } else if (data) {
    content = (
      <>
        {isUpdating ? (
          <div className="border-b border-border bg-primary-soft px-4 py-1.5 text-xs font-medium text-primary sm:px-5">
            Updating results...
          </div>
        ) : null}
        <CardContent
          className={cn(
            "p-0 transition-opacity duration-150",
            isUpdating && "opacity-60",
          )}
        >
          <ul className="divide-y divide-border" aria-label={entityNamePlural}>
            {data.content.map((entity) => (
              <li
                key={entity.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface-secondary/70 focus-within:bg-surface-secondary/70 sm:px-5"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h2 className="text-sm leading-5 font-semibold text-foreground">
                    {entity.name}
                  </h2>
                  {entity.description ? (
                    <p className="text-sm leading-5 text-muted-foreground">
                      {entity.description}
                    </p>
                  ) : null}
                  <p className="pt-0.5 text-xs leading-4 text-muted-foreground">
                    Updated {formatShortDate(entity.updatedAt)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-10 shrink-0 rounded-md sm:size-9"
                        aria-label={`Actions for ${entity.name}`}
                      />
                    }
                  >
                    <EllipsisVerticalIcon aria-hidden="true" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit(entity)}>
                      <PencilIcon aria-hidden="true" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(entity)}
                    >
                      <Trash2Icon aria-hidden="true" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
          <Pagination
            idPrefix={entityNamePlural}
            page={data.page}
            size={data.size}
            totalElements={data.totalElements}
            totalPages={data.totalPages}
            disabled={isUpdating}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </CardContent>
      </>
    )
  }

  return (
    <Card
      className="gap-0 py-0 shadow-none"
      aria-busy={isPending || isUpdating}
      aria-label={`${entityNamePlural} list`}
    >
      <div className="border-b border-border px-4 py-3 sm:px-5">
        {toolbar}
      </div>
      {content}
    </Card>
  )
}
