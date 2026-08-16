import { beforeEach, afterEach, vi } from "vitest"

beforeEach(() => {
  vi.resetAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})
