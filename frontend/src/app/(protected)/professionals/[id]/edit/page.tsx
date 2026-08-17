import {
  EditProfessionalContent,
  InvalidEditProfessionalState,
} from "@/features/professionals/components/edit-professional-content"
import {
  getProfessionalDetailsHref,
  getProfessionalReturnHref,
} from "@/features/professionals/professional-navigation"

type EditProfessionalPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditProfessionalPage({
  params,
  searchParams,
}: EditProfessionalPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const professionalId = Number(id)
  const returnHref = getProfessionalReturnHref(query.from)

  if (!Number.isSafeInteger(professionalId) || professionalId <= 0) {
    return <InvalidEditProfessionalState returnHref={returnHref} />
  }

  return (
    <EditProfessionalContent
      professionalId={professionalId}
      returnHref={returnHref}
      cancelHref={getProfessionalDetailsHref(professionalId, returnHref)}
    />
  )
}
