'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@lib/hooks/useCart'
import { HttpTypes } from '@medusajs/types'

interface AddToCartProps {
  product: HttpTypes.StoreProduct
  regionId: string
  onAddSuccess?: () => void
}

interface CartItem {
  variant_id: string
  quantity: number
}

export default function AddToCart({
  product,
  regionId,
  onAddSuccess,
}: AddToCartProps) {
  const { cart, addItem, updateQuantity, isLoading } = useCart(regionId)
  const [quantity, setQuantity] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const variant = product.variants?.[0]
  if (!variant) return null

  // Initialize quantity from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const cartData = localStorage.getItem('medusa_cart')
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData)
        const cartItem = parsed.items?.find(
          (item: CartItem) => item.variant_id === variant.id
        )
        if (cartItem) {
          setQuantity(cartItem.quantity)
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
      }
    }

    // Listen for cart updates
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const updatedCart = customEvent.detail
      const cartItem = updatedCart.items?.find(
        (item: CartItem) => item.variant_id === variant.id
      )
      setQuantity(cartItem?.quantity || 0)
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [variant.id])

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!variant) return

    await addItem(
      product.id,
      variant.id,
      1,
      {
        title: product.title,
        sku: variant.sku,
        price: variant.calculated_price?.calculated_amount || 0,
        image: product.thumbnail,
        variant_title: variant.title && variant.title !== "Default Title" ? variant.title : undefined,
      }
    )

    onAddSuccess?.()
  }

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await updateQuantity(variant.id, quantity + 1)
  }

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 0) {
      await updateQuantity(variant.id, quantity - 1)
    }
  }

  if (!isMounted) {
    return (
      <button
        disabled
        className="inline-flex h-[38px] min-w-[86px] items-center justify-center rounded-[8px] border border-emerald-500 bg-white px-3 text-[13px] font-medium text-emerald-700"
      >
        ADD
      </button>
    )
  }

  if (quantity > 0) {
    return (
      <div className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-emerald-500 bg-white px-2">
        <button
          onClick={handleDecrement}
          disabled={isLoading}
          className="flex items-center justify-center w-6 h-6 text-emerald-700 hover:bg-emerald-50 rounded disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-6 text-center font-medium text-emerald-700 text-sm">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={isLoading}
          className="flex items-center justify-center w-6 h-6 text-emerald-700 hover:bg-emerald-50 rounded disabled:opacity-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="inline-flex h-[38px] min-w-[86px] items-center justify-center rounded-[8px] border border-emerald-500 bg-white px-3 text-[13px] font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
    >
      {isLoading ? 'Adding...' : 'ADD'}
    </button>
  )
}
