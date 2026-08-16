"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { useCart } from '@lib/hooks/useCart'

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
  const [isMounted, setIsMounted] = useState(false)
  const { cart: storedCart } = useCart()

  const cart = storedCart || cartState
  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cart?.total ?? 0

  useEffect(() => {
    setIsMounted(true)
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
