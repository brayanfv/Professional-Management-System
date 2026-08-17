"use client"

import {
  CircleAlertIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

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
    <Card aria-busy="true">
      <CardContent className="divide-y divide-border">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44 max-w-full" />
              <Skeleton className="h-4 w-80 max-w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="size-8" />
          </div>
        ))}
      </CardContent>
    </Card>
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
  onRetry: () => void
  onCreate: () => void
  onEdit: (entity: ManagementEntity) => void
  onDelete: (entity: ManagementEntity) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}) {
  if (isPending) return <ListSkeleton />

  if (isError) {
    return (
      <Card>
        <CardContent
          className="flex min-h-72 flex-col items-center justify-center gap-3 text-center"
          role="alert"
        >
          <CircleAlertIcon className="size-6 text-danger" aria-hidden="true" />
          <p className="font-semibold text-foreground">
            Unable to load {entityNamePlural}
          </p>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (data?.totalElements === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
          <span className="flex size-11 items-center justify-center rounded-md bg-primary-soft text-primary">
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
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card
      className="gap-0 py-0"
      aria-busy={isUpdating}
      aria-label={`${entityNamePlural} list`}
    >
      {isUpdating ? (
        <div className="border-b border-border bg-primary-soft px-5 py-2 text-xs font-medium text-primary">
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
              className="flex items-start gap-4 px-5 py-5 sm:px-6"
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <h2 className="font-semibold text-foreground">{entity.name}</h2>
                {entity.description ? (
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {entity.description}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  Updated {formatShortDate(entity.updatedAt)}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
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
    </Card>
  )
}
