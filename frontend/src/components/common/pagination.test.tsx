import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Pagination } from "@/components/common/pagination"
import { renderWithQueryClient } from "@/test/render"

describe("Pagination", () => {
  it("communicates the current page and supports next page navigation", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()

    renderWithQueryClient(
      <Pagination
        page={0}
        size={10}
        totalElements={25}
        totalPages={3}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />,
    )

    expect(screen.getByText(/Showing 1.*10 of 25/)).toBeVisible()
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByLabelText("Results per page")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })
})
