export const routes = {
  dashboard: "/dashboard",
  login: "/login",
  professionals: {
    list: "/professionals",
    create: "/professionals/new",
    details: (id: string | number) => `/professionals/${id}`,
    edit: (id: string | number) => `/professionals/${id}/edit`,
  },
  departments: "/departments",
  positions: "/positions",
  profile: "/profile",
} as const;
