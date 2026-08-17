import { apiClient } from "@/lib/api/client"
import type { PageResponse } from "@/types/pagination"

const filterPageSize = 100

export async function getAllPaginatedOptions<T>(path: string) {
  const getPage = (page: number) => {
    const searchParams = new URLSearchParams({
      page: String(page),
      size: String(filterPageSize),
      sort: "name,asc",
    })

    return apiClient.get<PageResponse<T>>(`${path}?${searchParams.toString()}`)
  }

  const firstPage = await getPage(0)
  if (firstPage.totalPages <= 1) {
    return firstPage.content
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      getPage(index + 1),
    ),
  )

  return [
    ...firstPage.content,
    ...remainingPages.flatMap((page) => page.content),
  ]
}
