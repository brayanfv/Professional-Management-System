"use client"

import { ManagementEntityPage } from "@/features/management/components/management-entity-page"
import { useManagementListState } from "@/features/management/hooks/use-management-list-state"
import { PositionForm } from "@/features/positions/components/position-form"
import { usePositionList } from "@/features/positions/hooks/use-position-list"
import {
  useCreatePosition,
  useDeletePosition,
  useUpdatePosition,
} from "@/features/positions/hooks/use-position-mutations"

const config = {
  entityName: "position",
  entityNamePlural: "positions",
  pageTitle: "Positions",
  pageDescription: "Manage roles used across your organization.",
  newLabel: "New position",
  searchPlaceholder: "Search positions...",
  createSheetTitle: "New position",
  createSheetDescription: "Create a position for your organization.",
  editSheetTitle: "Edit position",
  editSheetDescription: "Update this position.",
  emptyDescription:
    "Create your first position to define roles in your organization.",
  filteredEmptyDescription: "Try a different search.",
  deleteTitle: "Delete position?",
  deleteSuccessMessage: "Position deleted successfully.",
  notFoundCode: "POSITION_NOT_FOUND",
  notFoundMessage: "This position is no longer available.",
  inUseCode: "POSITION_IN_USE",
  inUseTitle: "Cannot delete position",
  inUseMessage:
    "This position is currently assigned to one or more professionals. Reassign those professionals before deleting it.",
}

export function PositionsPageContent() {
  const listState = useManagementListState()
  const listQuery = usePositionList(listState.params)
  const createMutation = useCreatePosition()
  const updateMutation = useUpdatePosition()
  const deleteMutation = useDeletePosition()

  return (
    <ManagementEntityPage
      config={config}
      FormComponent={PositionForm}
      params={listState.params}
      searchInput={listState.searchInput}
      data={listQuery.data}
      isPending={listQuery.isPending}
      isError={listQuery.isError}
      isUpdating={listQuery.isPlaceholderData}
      createPending={createMutation.isPending}
      updatePending={updateMutation.isPending}
      deletePending={deleteMutation.isPending}
      onSearchChange={listState.setSearchInput}
      onPageChange={listState.setPage}
      onPageSizeChange={listState.setPageSize}
      onRetry={() => void listQuery.refetch()}
      onCreate={createMutation.mutateAsync}
      onUpdate={(id, payload) => updateMutation.mutateAsync({ id, payload })}
      onDelete={deleteMutation.mutateAsync}
    />
  )
}
