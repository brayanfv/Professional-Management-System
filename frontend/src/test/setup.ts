import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

import { resetNavigationMocks } from "@/test/mocks/next-navigation"

afterEach(() => {
  cleanup()
  resetNavigationMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  document.cookie = "XSRF-TOKEN=; Max-Age=0; path=/"
})

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock)
