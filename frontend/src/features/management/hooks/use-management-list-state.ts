"use client"

import { useEffect, useState } from "react"

import type { ManagementEntityQueryParams } from "@/types/management"

const defaultParams: ManagementEntityQueryParams = {
  page: 0,
  size: 10,
  sort: "name,asc",
}

export function useManagementListState() {
  const [params, setParams] = useState(defaultParams)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const search = searchInput.trim() || undefined
      setParams((current) => {
        if (current.search === search && current.page === 0) return current
        return { ...current, page: 0, search }
      })
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  return {
    params,
    searchInput,
    setSearchInput,
    setPage: (page: number) =>
      setParams((current) => ({ ...current, page })),
    setPageSize: (size: number) =>
      setParams((current) => ({ ...current, page: 0, size })),
  }
}
