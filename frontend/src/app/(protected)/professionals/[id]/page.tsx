import {
  InvalidProfessionalState,
  ProfessionalDetailsContent,
} from "@/features/professionals/components/professional-details-content"
import { getProfessionalReturnHref } from "@/features/professionals/professional-navigation"

type ProfessionalDetailsPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProfessionalDetailsPage({
  params,
  searchParams,
}: ProfessionalDetailsPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const professionalId = Number(id)
  const returnHref = getProfessionalReturnHref(query.from)

  if (!Number.isSafeInteger(professionalId) || professionalId <= 0) {
    return <InvalidProfessionalState returnHref={returnHref} />
  }

  return (
    <ProfessionalDetailsContent
      professionalId={professionalId}
      returnHref={returnHref}
    />
  )
}
