"use client"

import { DepartmentForm } from "@/features/departments/components/department-form"
import { useDepartmentList } from "@/features/departments/hooks/use-department-list"
import {
  useCreateDepartment,
  useDeleteDepartment,
  useUpdateDepartment,
} from "@/features/departments/hooks/use-department-mutations"
import { ManagementEntityPage } from "@/features/management/components/management-entity-page"
import { useManagementListState } from "@/features/management/hooks/use-management-list-state"

const config = {
  entityName: "department",
  entityNamePlural: "departments",
  pageTitle: "Departments",
  pageDescription: "Manage your organization's departments.",
  newLabel: "New department",
  searchPlaceholder: "Search departments...",
  createSheetTitle: "New department",
  createSheetDescription: "Create a department for your organization.",
  editSheetTitle: "Edit department",
  editSheetDescription: "Update this department's information.",
  emptyDescription: "Create your first department to organize professionals.",
  filteredEmptyDescription: "Try a different search.",
  deleteTitle: "Delete department?",
  deleteSuccessMessage: "Department deleted successfully.",
  notFoundCode: "DEPARTMENT_NOT_FOUND",
  notFoundMessage: "This department is no longer available.",
  inUseCode: "DEPARTMENT_IN_USE",
  inUseTitle: "Cannot delete department",
  inUseMessage:
    "This department is currently assigned to one or more professionals. Reassign those professionals before deleting it.",
}

export function DepartmentsPageContent() {
  const listState = useManagementListState()
  const listQuery = useDepartmentList(listState.params)
  const createMutation = useCreateDepartment()
  const updateMutation = useUpdateDepartment()
  const deleteMutation = useDeleteDepartment()

  return (
    <ManagementEntityPage
      config={config}
      FormComponent={DepartmentForm}
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
