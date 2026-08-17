import {
  ManagementEntityForm,
  type ManagementFeatureFormProps,
} from "@/features/management/components/management-entity-form"

export function PositionForm(props: ManagementFeatureFormProps) {
  return (
    <ManagementEntityForm
      {...props}
      entityName="position"
      duplicateCode="DUPLICATE_POSITION"
      notFoundCode="POSITION_NOT_FOUND"
      duplicateMessage="A position with this name already exists."
      unavailableMessage="This position is no longer available."
      createSuccessMessage="Position created successfully."
      updateSuccessMessage="Position updated successfully."
    />
  )
}
