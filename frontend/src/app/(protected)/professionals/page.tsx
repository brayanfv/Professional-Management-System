import { ProfessionalsPageContent } from "@/features/professionals/components/professionals-page-content"
import { parseProfessionalListParams } from "@/features/professionals/professional-list-params"

export default async function ProfessionalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = parseProfessionalListParams(await searchParams)

  return <ProfessionalsPageContent params={params} />
}
