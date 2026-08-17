import type { ProfessionalsQueryParams } from "@/types/professional"

export const professionalKeys = {
  all: ["professionals"] as const,
  lists: () => [...professionalKeys.all, "list"] as const,
  list: (params: ProfessionalsQueryParams) =>
    [...professionalKeys.lists(), params] as const,
  details: () => [...professionalKeys.all, "detail"] as const,
  detail: (id: number) => [...professionalKeys.details(), id] as const,
  contacts: (id: number) => [...professionalKeys.detail(id), "contacts"] as const,
}
