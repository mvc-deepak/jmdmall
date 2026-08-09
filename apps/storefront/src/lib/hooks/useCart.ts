'use client'

import { useState, useCallback, useEffect } from 'react'
import { HttpTypes } from '@medusajs/types'

export interface CartItem {
  variant_id: string
  product_id: string
  quantity: number
  title: string
  sku?: string
  price: number
  image?: string
  variant_title?: string
}

export interface Cart {
  cart_id: string
  customer_id?: string
  region_id: string
  items: CartItem[]
  total: number
  last_updated: number
  is_guest: boolean
  medusa_cart_id?: string // Track Medusa cart ID for logged-in users
}

const CART_STORAGE_KEY = 'medusa_cart'

export function useCart(regionId: string) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const initializeCart = () => {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        try {
          const parsedCart = JSON.parse(stored)
          // Verify region matches
          if (parsedCart.region_id === regionId) {
            setCart(parsedCart)
          } else {
            // Region changed, clear cart
            localStorage.removeItem(CART_STORAGE_KEY)
            setCart(null)
          }
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e)
          localStorage.removeItem(CART_STORAGE_KEY)
        }
      }
    }

    initializeCart()
  }, [regionId])

  // Save cart to localStorage and dispatch event
  const saveToLocalStorage = useCallback((updatedCart: Cart) => {
    updatedCart.last_updated = Date.now()
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart))
    setCart(updatedCart)

    // Dispatch custom event so other components know cart changed
    window.dispatchEvent(
      new CustomEvent('cartUpdated', { detail: updatedCart })
    )
  }, [])

  // Get cart from localStorage
  const getCart = useCallback(() => {
    return cart
  }, [cart])

  // Add item to cart
  const addItem = useCallback(
    async (
      productId: string,
      variantId: string,
      quantity: number = 1,
      itemData: Partial<CartItem> = {}
    ) => {
      setIsLoading(true)
      try {
        // Initialize cart if doesn't exist
        let updatedCart = cart || {
          cart_id: `guest_${Date.now()}`,
          region_id: regionId,
          items: [],
          total: 0,
          last_updated: Date.now(),
          is_guest: true,
        }

        // Check if item already exists
        const existingItemIndex = updatedCart.items.findIndex(
          (item) => item.variant_id === variantId
        )

        if (existingItemIndex > -1) {
          // Update quantity
          updatedCart.items[existingItemIndex].quantity += quantity
        } else {
          // Add new item
          updatedCart.items.push({
            variant_id: variantId,
            product_id: productId,
            quantity,
            title: itemData.title || 'Product',
            sku: itemData.sku,
            price: itemData.price || 0,
            image: itemData.image,
            variant_title: itemData.variant_title,
          })
        }

        // Recalculate total
        updatedCart.total = updatedCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )

        // Save to localStorage (immediate UI update)
        saveToLocalStorage(updatedCart)

        // Sync with Medusa backend if logged in (non-blocking)
        if (!updatedCart.is_guest && updatedCart.medusa_cart_id) {
          setIsSyncing(true)
          try {
            const response = await fetch('/store/carts/' + updatedCart.medusa_cart_id + '/line-items', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                variant_id: variantId,
                quantity,
              }),
            })
            if (!response.ok) {
              console.error('Failed to sync to Medusa cart')
            }
          } catch (error) {
            console.error('Medusa sync error:', error)
          } finally {
            setIsSyncing(false)
          }
        }

        return updatedCart
      } finally {
        setIsLoading(false)
      }
    },
    [cart, regionId, saveToLocalStorage]
  )

  // Update quantity
  const updateQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      if (!cart || quantity < 0) return

      setIsLoading(true)
      try {
        const updatedCart = { ...cart }

        if (quantity === 0) {
          // Remove item
          updatedCart.items = updatedCart.items.filter(
            (item) => item.variant_id !== variantId
          )
        } else {
          // Update quantity
          const item = updatedCart.items.find((i) => i.variant_id === variantId)
          if (item) {
            item.quantity = quantity
          }
        }

        // Recalculate total
        updatedCart.total = updatedCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )

        saveToLocalStorage(updatedCart)

        // Sync with Medusa backend if logged in (non-blocking)
        if (!updatedCart.is_guest && updatedCart.medusa_cart_id) {
          setIsSyncing(true)
          try {
            if (quantity === 0) {
              // Find line item ID and delete it
              const response = await fetch('/store/carts/' + updatedCart.medusa_cart_id + '/line-items', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              })
              if (response.ok) {
                const cart = await response.json()
                const lineItem = cart.items?.find((item: any) => item.variant_id === variantId)
                if (lineItem) {
                  await fetch('/store/carts/' + updatedCart.medusa_cart_id + '/line-items/' + lineItem.id, {
                    method: 'DELETE',
                  })
                }
              }
            } else {
              // Update quantity
              const response = await fetch('/store/carts/' + updatedCart.medusa_cart_id + '/line-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  variant_id: variantId,
                  quantity,
                }),
              })
              if (!response.ok) {
                console.error('Failed to sync quantity to Medusa cart')
              }
            }
          } catch (error) {
            console.error('Medusa sync error:', error)
          } finally {
            setIsSyncing(false)
          }
        }

        return updatedCart
      } finally {
        setIsLoading(false)
      }
    },
    [cart, saveToLocalStorage]
  )

  // Remove item from cart
  const removeItem = useCallback(
    async (variantId: string) => {
      return updateQuantity(variantId, 0)
    },
    [updateQuantity]
  )

  // Clear entire cart
  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY)
    setCart(null)
  }, [])


  // Set cart from server (after login)
  const setCartFromServer = useCallback(
    (serverCart: Cart) => {
      saveToLocalStorage(serverCart)
    },
    [saveToLocalStorage]
  )

  return {
    cart,
    isLoading,
    isSyncing,
    getCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setCartFromServer,
  }
}