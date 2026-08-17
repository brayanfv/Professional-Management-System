export type ManagementEntityQueryParams = {
  page: number
  size: number
  search?: string
  sort: "name,asc"
}

export type ManagementEntityRequest = {
  name: string
  description: string | null
}
