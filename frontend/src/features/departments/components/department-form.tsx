import {
  ManagementEntityForm,
  type ManagementFeatureFormProps,
} from "@/features/management/components/management-entity-form"

export function DepartmentForm(props: ManagementFeatureFormProps) {
  return (
    <ManagementEntityForm
      {...props}
      entityName="department"
      duplicateCode="DUPLICATE_DEPARTMENT"
      notFoundCode="DEPARTMENT_NOT_FOUND"
      duplicateMessage="A department with this name already exists."
      unavailableMessage="This department is no longer available."
      createSuccessMessage="Department created successfully."
      updateSuccessMessage="Department updated successfully."
    />
  )
}
