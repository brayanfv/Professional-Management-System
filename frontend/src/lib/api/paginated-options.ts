import { apiClient, type ApiReadOptions } from "@/lib/api/client"
import type { PageResponse } from "@/types/pagination"

const filterPageSize = 100
const maxConcurrentPageRequests = 4

export async function getAllPaginatedOptions<T>(
  path: string,
  options?: ApiReadOptions,
) {
  const getPage = (page: number) => {
    const searchParams = new URLSearchParams({
      page: String(page),
      size: String(filterPageSize),
      sort: "name,asc",
    })

    return apiClient.get<PageResponse<T>>(
      `${path}?${searchParams.toString()}`,
      options,
    )
  }

  const firstPage = await getPage(0)
  if (firstPage.totalPages <= 1) {
    return firstPage.content
  }

  const remainingPageNumbers = Array.from(
    { length: firstPage.totalPages - 1 },
    (_, index) => index + 1,
  )
  const remainingPages = [] as PageResponse<T>[]

  for (
    let startIndex = 0;
    startIndex < remainingPageNumbers.length;
    startIndex += maxConcurrentPageRequests
  ) {
    const pageBatch = remainingPageNumbers.slice(
      startIndex,
      startIndex + maxConcurrentPageRequests,
    )
    const batchResults = await Promise.all(pageBatch.map(getPage))
    remainingPages.push(...batchResults)
  }

  return [
    ...firstPage.content,
    ...remainingPages.flatMap((page) => page.content),
  ]
}
