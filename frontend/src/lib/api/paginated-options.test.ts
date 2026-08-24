import { afterEach, describe, expect, it, vi } from "vitest"

const getMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: getMock,
  },
}))

import { getAllPaginatedOptions } from "@/lib/api/paginated-options"

type Option = {
  id: number
  name: string
}

type DeferredPage = {
  resolve: (value: { content: Option[]; totalPages: number }) => void
}

function getPageNumber(path: string) {
  return Number(new URL(path, "https://frontend.test").searchParams.get("page"))
}

function createPage(page: number, totalPages = 6) {
  return {
    content: [{ id: page, name: `Option ${page}` }],
    totalPages,
  }
}

async function flushPromises() {
  await Promise.resolve()
  await Promise.resolve()
}

describe("getAllPaginatedOptions", () => {
  afterEach(() => {
    getMock.mockReset()
  })

  it("loads remaining pages in batches of four", async () => {
    const deferredPages = new Map<number, DeferredPage>()

    getMock.mockImplementation((path: string) => {
      const page = getPageNumber(path)
      if (page === 0) {
        return Promise.resolve(createPage(page))
      }

      return new Promise((resolve) => {
        deferredPages.set(page, { resolve })
      })
    })

    const optionsPromise = getAllPaginatedOptions<Option>("/api/departments")
    await flushPromises()

    expect(getMock.mock.calls.map(([path]) => getPageNumber(path))).toEqual([
      0, 1, 2, 3, 4,
    ])

    for (const page of [1, 2, 3, 4]) {
      deferredPages.get(page)?.resolve(createPage(page))
    }
    await flushPromises()

    expect(getMock.mock.calls.map(([path]) => getPageNumber(path))).toEqual([
      0, 1, 2, 3, 4, 5,
    ])

    deferredPages.get(5)?.resolve(createPage(5))

    await expect(optionsPromise).resolves.toEqual([
      { id: 0, name: "Option 0" },
      { id: 1, name: "Option 1" },
      { id: 2, name: "Option 2" },
      { id: 3, name: "Option 3" },
      { id: 4, name: "Option 4" },
      { id: 5, name: "Option 5" },
    ])
  })

  it("forwards the query AbortSignal to every page request", async () => {
    const controller = new AbortController()
    getMock.mockResolvedValueOnce(createPage(0, 1))

    await getAllPaginatedOptions<Option>("/api/positions", {
      signal: controller.signal,
    })

    expect(getMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/positions?"),
      { signal: controller.signal },
    )
  })
})
