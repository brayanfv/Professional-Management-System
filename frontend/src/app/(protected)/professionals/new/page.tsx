import { ProfessionalForm } from "@/features/professionals/components/professional-form"
import { getProfessionalReturnHref } from "@/features/professionals/professional-navigation"

type NewProfessionalPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewProfessionalPage({
  searchParams,
}: NewProfessionalPageProps) {
  const query = await searchParams
  const returnHref = getProfessionalReturnHref(query.from)

  return (
    <ProfessionalForm
      mode="create"
      returnHref={returnHref}
      cancelHref={returnHref}
    />
  )
}
