"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

interface LocalCart {
  items: Array<{
    variant_id: string
    product_id: string
    quantity: number
    title: string
    price: number
    image?: string
    sku?: string
  }>
  total: number
}

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [localCart, setLocalCart] = useState<LocalCart | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const cart = localCart || cartState
  const totalItems = cart?.items?.reduce((acc, item) => {
    return acc + item.quantity
  }, 0) || 0

  const subtotal = cart?.total ?? 0

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const cartData = localStorage.getItem("medusa_cart")
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData)
        setLocalCart(parsed)
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e)
      }
    }

    // Listen for custom cart update events (same tab)
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const updatedCart = customEvent.detail
      setLocalCart(updatedCart)
    }

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      const updatedCartData = localStorage.getItem("medusa_cart")
      if (updatedCartData) {
        try {
          const parsed = JSON.parse(updatedCartData)
          setLocalCart(parsed)
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e)
        }
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  if (!isMounted) {
    return (
      <div className="h-full">
        <LocalizedClientLink
          className="hover:text-ui-fg-base"
          href="/cart"
          data-testid="nav-cart-link"
        >
          🛒
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="h-full">
      <LocalizedClientLink
        className="hover:text-ui-fg-base"
        href="/cart"
        data-testid="nav-cart-link"
      >
        <span className="flex items-center gap-2">
          <span>🛒</span>
          {totalItems > 0 && (
            <>
              <span>{totalItems}</span>
              <span>₹{Math.round(subtotal)}</span>
            </>
          )}
        </span>
      </LocalizedClientLink>
    </div>
  )
}

export default CartDropdown
