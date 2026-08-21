import { vi } from "vitest"

type RouterMock = {
  back: ReturnType<typeof vi.fn>
  forward: ReturnType<typeof vi.fn>
  prefetch: ReturnType<typeof vi.fn>
  push: ReturnType<typeof vi.fn>
  refresh: ReturnType<typeof vi.fn>
  replace: ReturnType<typeof vi.fn>
}

const router: RouterMock = {
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
}

let pathname = "/"
let searchParams = new URLSearchParams()

export function useRouter() {
  return router
}

export function usePathname() {
  return pathname
}

export function useSearchParams() {
  return searchParams
}

export function useParams() {
  return {}
}

export function useSelectedLayoutSegment() {
  return null
}

export function useSelectedLayoutSegments() {
  return []
}

export function redirect(path: string): never {
  throw new Error(`NEXT_REDIRECT:${path}`)
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND")
}

export function getRouterMock() {
  return router
}

export function setNavigationMock(
  options: { pathname?: string; searchParams?: string } = {},
) {
  pathname = options.pathname ?? "/"
  searchParams = new URLSearchParams(options.searchParams)
}

export function resetNavigationMocks() {
  Object.values(router).forEach((mock) => mock.mockReset())
  pathname = "/"
  searchParams = new URLSearchParams()
}
