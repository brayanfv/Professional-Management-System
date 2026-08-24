import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const authEvents = vi.hoisted(() => ({ notifyUnauthorized: vi.fn() }))

vi.mock("@/features/auth/auth-events", () => authEvents)

import { apiClient } from "@/lib/api/client"

const fetchMock = vi.fn()

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

describe("apiClient", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.example.test/")
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    fetchMock.mockReset()
    authEvents.notifyUnauthorized.mockReset()
  })

  it("sends credentialed GET requests without a CSRF or bearer header", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }))

    await expect(apiClient.get<{ id: number }>("api/auth/me")).resolves.toEqual({
      id: 1,
    })

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = new Headers(options.headers)
    expect(url).toBe("http://api.example.test/api/auth/me")
    expect(options.credentials).toBe("include")
    expect(headers.get("X-XSRF-TOKEN")).toBeNull()
    expect(headers.get("Authorization")).toBeNull()
  })

  it("forwards an AbortSignal to fetch", async () => {
    const controller = new AbortController()
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }))

    await apiClient.get<{ id: number }>("/api/professionals", {
      signal: controller.signal,
    })

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(options.signal).toBe(controller.signal)
  })

  it("serializes mutation data and mirrors the readable CSRF cookie", async () => {
    document.cookie = "XSRF-TOKEN=csrf%20value; path=/"
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 2 }, 201))

    await apiClient.post("/api/departments", { name: "Technology" })

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = new Headers(options.headers)
    expect(options.credentials).toBe("include")
    expect(options.body).toBe(JSON.stringify({ name: "Technology" }))
    expect(headers.get("Content-Type")).toBe("application/json")
    expect(headers.get("X-XSRF-TOKEN")).toBe("csrf value")
  })

  it("handles a successful empty response", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))

    await expect(apiClient.delete("/api/auth/logout")).resolves.toBeUndefined()
  })

  it("maps API errors and dispatches the centralized unauthorized event", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        { status: 401, code: "UNAUTHORIZED", message: "Session expired" },
        401,
      ),
    )

    await expect(apiClient.get("/api/professionals")).rejects.toMatchObject({
      name: "ApiClientError",
      details: { status: 401, code: "UNAUTHORIZED" },
    })
    expect(authEvents.notifyUnauthorized).toHaveBeenCalledOnce()
  })

  it("uses a safe fallback for non-conforming error responses", async () => {
    fetchMock.mockResolvedValueOnce(new Response("Unavailable", { status: 503 }))

    await expect(apiClient.get("/api/dashboard")).rejects.toMatchObject({
      details: {
        status: 503,
        code: "HTTP_ERROR",
        message: "Request failed",
      },
    })
  })
})
