import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { getAuthHeaders } from "@lib/data/cookies"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, authHeaders] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getAuthHeaders(),
  ])

  const isLoggedIn = !!authHeaders.authorization

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative bg-white border-b duration-200 border-ui-border-base">
        <div className="content-container flex items-center gap-4 py-3">
          <LocalizedClientLink
            href="/"
            className="text-lg font-bold hover:text-ui-fg-base whitespace-nowrap"
            data-testid="nav-store-link"
          >
            Store
          </LocalizedClientLink>

          <div className="flex items-center gap-2 text-xs text-ui-fg-subtle hidden sm:flex">
            <span>📍</span>
            <span>Location</span>
          </div>

          <div className="flex-1 flex items-center gap-2 bg-ui-bg-subtle rounded-lg px-3 py-2">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent text-xs outline-none w-full placeholder-ui-fg-subtle"
            />
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <LocalizedClientLink
                className="hover:text-ui-fg-base text-xs hidden sm:block whitespace-nowrap"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            ) : (
              <LocalizedClientLink
                className="hover:text-ui-fg-base text-xs hidden sm:block whitespace-nowrap"
                href="/account"
                data-testid="nav-login-link"
              >
                Login
              </LocalizedClientLink>
            )}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-1 text-xs whitespace-nowrap"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </div>
      </header>
    </div>
  )
}
