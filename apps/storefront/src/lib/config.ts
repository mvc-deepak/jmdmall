import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = new Headers(init?.headers ?? {})

  try {
    const localeHeader = await getLocaleHeader()
    const locale = localeHeader?.["x-medusa-locale"]

    if (locale && !headers.has("x-medusa-locale")) {
      headers.set("x-medusa-locale", locale)
    }
  } catch {}

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (publishableKey && !headers.has("x-publishable-api-key")) {
    headers.set("x-publishable-api-key", publishableKey)
  }

  init = {
    ...init,
    headers,
  }

  return originalFetch(input, init)
}
