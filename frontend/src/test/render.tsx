import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query"
import { render, type RenderOptions } from "@testing-library/react"
import type { ReactElement, ReactNode } from "react"

export function createTestQueryClient(config: QueryClientConfig = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
    ...config,
  })
}

export function renderWithQueryClient(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...options
  }: RenderOptions & { queryClient?: QueryClient } = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...options }),
  }
}
