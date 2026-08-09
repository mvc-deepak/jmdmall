'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@lib/hooks/useCart'
import Link from 'next/link'

interface CartItem {
  variant_id: string
  product_id: string
  quantity: number
  title: string
  price: number
  image?: string
  sku?: string
  variant_title?: string
}

interface SavedAddress {
  id: string
  first_name: string
  last_name: string
  phone: string
  address_1: string
  city: string
  postal_code: string
}

export default function LocalCartItems({ regionId }: { regionId: string }) {
  const { cart, updateQuantity, removeItem } = useCart(regionId)
  const [isMounted, setIsMounted] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'auth' | 'details'>('auth')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [useNewAddress, setUseNewAddress] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pin: '',
    paymentMethod: 'card',
  })

  useEffect(() => {
    setIsMounted(true)
    fetchSavedAddresses()
  }, [])

  const fetchSavedAddresses = async () => {
    try {
      // Use Medusa SDK endpoint directly: /store/customers/me/addresses
      const response = await fetch('/store/customers/me/addresses', {
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        const addresses = data.addresses || []

        if (addresses.length > 0) {
          setIsLoggedIn(true)
          setSavedAddresses(addresses)
          setSelectedAddressId(addresses[0].id)
          setUseNewAddress(false)
          setCheckoutStep('details')
        } else {
          setIsLoggedIn(false)
        }
      } else {
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
      setIsLoggedIn(false)
    }
  }

  if (!isMounted) {
    return <div className="text-center py-4"><h1 className="text-2xl font-bold">Shopping Cart</h1></div>
  }

  const items = cart?.items || []
  const total = cart?.total || 0

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const handleQuantityChange = async (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(variantId)
    } else {
      await updateQuantity(variantId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (!items || items.length === 0) {
      alert('Cart is empty')
      return
    }
    setShowCheckout(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pin) {
      alert('Please fill all fields')
      return
    }

    try {
      alert(`Order placed! Total: ₹${Math.round(total)}`)
      // Clear localStorage after successful order
      localStorage.removeItem('medusa_cart')
      setShowCheckout(false)
      setCheckoutStep('auth')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order')
    }
  }

  const handleContinueAsGuest = () => {
    setIsLoggedIn(false)
    setCheckoutStep('details')
  }

  const handleSignIn = () => {
    // Redirect to login - guest cart items cleared on login per Medusa flow
  }

  return (
    <div className="py-2 md:py-4 space-y-3">
      <h1 className="text-xl md:text-2xl font-bold">Shopping Cart ({items.length})</h1>

      {/* Cart Table */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        {/* Header - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-7 gap-2 px-3 py-2 border-b border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50">
          <div className="col-span-3">Product</div>
          <div className="text-center">Price</div>
          <div className="text-center">Qty</div>
          <div className="text-right">Total</div>
          <div></div>
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-200">
          {items.map((item, idx) => (
            <div key={item.variant_id || idx} className="px-2 md:px-3 py-2 flex md:grid md:grid-cols-7 gap-2 items-start md:items-center text-xs">
              {/* Product */}
              <div className="flex gap-2 md:col-span-3 w-full">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded bg-gray-100 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate text-xs leading-tight">{item.title}</h3>
                  {item.variant_title && <p className="text-gray-600 text-xs">{item.variant_title}</p>}
                  {item.sku && <p className="text-gray-500 text-xs">{item.sku}</p>}
                </div>
              </div>

              {/* Price */}
              <div className="hidden md:block text-center">
                <p className="text-gray-900 font-medium">₹{Math.round(item.price)}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={() => handleQuantityChange(item.variant_id, item.quantity - 1)}
                  className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-xs"
                >
                  −
                </button>
                <span className="w-4 text-center text-xs font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.variant_id, item.quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-xs"
                >
                  +
                </button>
              </div>

              {/* Total */}
              <div className="hidden md:block text-right">
                <p className="font-medium text-gray-900">₹{Math.round(item.price * item.quantity)}</p>
              </div>

              {/* Remove */}
              <div className="text-right">
                <button
                  onClick={() => removeItem(item.variant_id)}
                  className="text-red-600 hover:text-red-700 text-xs font-medium hover:underline"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Link href="/in/store" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
          ← Continue Shopping
        </Link>
      </div>

      {/* Summary & Checkout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2"></div>
        <div className="bg-white border border-gray-200 rounded p-3 space-y-2">
          <h2 className="text-sm font-bold">Order Total</h2>
          <div className="space-y-1 text-xs border-b border-gray-200 pb-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{Math.round(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-gray-500">TBD</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-sm">
            <span>Total</span>
            <span className="text-emerald-600">₹{Math.round(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={!isMounted || items.length === 0}
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:bg-gray-400 font-medium text-xs"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Checkout Panel */}
      {showCheckout && (
        <div className="bg-blue-50 border-2 border-emerald-600 rounded p-3 md:p-4 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm md:text-base font-bold text-gray-900">
              {checkoutStep === 'auth' ? 'Login or Continue as Guest' : 'Checkout Details'}
            </h2>
            <button
              onClick={() => setShowCheckout(false)}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Auth Step */}
          {checkoutStep === 'auth' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-600 mb-3">Sign in to access saved addresses and faster checkout</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Login Button */}
                <button
                  onClick={handleSignIn}
                  className="bg-emerald-600 text-white py-3 rounded text-xs md:text-sm font-bold hover:bg-emerald-700 transition"
                >
                  <a href="/in/account/login">Sign In</a>
                </button>

                {/* Guest Checkout Button */}
                <button
                  onClick={handleContinueAsGuest}
                  className="bg-gray-600 text-white py-3 rounded text-xs md:text-sm font-bold hover:bg-gray-700 transition"
                >
                  Continue as Guest
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Don't have an account?{' '}
                <Link href="/in/account/register" className="text-emerald-600 hover:underline font-medium">
                  Create one
                </Link>
              </p>

              <button
                onClick={() => setShowCheckout(false)}
                className="w-full border border-gray-300 text-gray-900 py-2 rounded text-xs font-medium hover:bg-gray-50"
              >
                Back to Cart
              </button>
            </div>
          )}

          {/* Checkout Details Step */}
          {checkoutStep === 'details' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Delivery Address */}
                <div className="space-y-2 md:col-span-2">
                  <h3 className="text-xs font-bold text-gray-900 uppercase">Delivery Address</h3>

                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="saved-address"
                          checked={!useNewAddress}
                          onChange={() => setUseNewAddress(false)}
                        />
                        <label htmlFor="saved-address" className="text-xs font-medium text-gray-900">
                          Use saved address
                        </label>
                      </div>

                      {!useNewAddress && (
                        <select
                          value={selectedAddressId}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          {savedAddresses.map((addr) => (
                            <option key={addr.id} value={addr.id}>
                              {addr.first_name} {addr.last_name} - {addr.address_1}, {addr.city} {addr.postal_code}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* New Address Option */}
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="new-address"
                      checked={useNewAddress}
                      onChange={() => setUseNewAddress(true)}
                    />
                    <label htmlFor="new-address" className="text-xs font-medium text-gray-900">
                      {savedAddresses.length > 0 ? 'Use different address' : 'Enter address'}
                    </label>
                  </div>

                  {/* Address Form */}
                  {useNewAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-2 rounded">
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleFormChange}
                        className="border border-gray-300 rounded px-2 py-1 text-xs md:col-span-2"
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleFormChange}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        name="pin"
                        placeholder="PIN Code"
                        value={formData.pin}
                        onChange={handleFormChange}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-2 md:col-span-2">
                  <h3 className="text-xs font-bold text-gray-900 uppercase">Payment Method</h3>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleFormChange}
                      />
                      <span>Card</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleFormChange}
                      />
                      <span>UPI</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleFormChange}
                      />
                      <span>COD</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-300">
                <button
                  onClick={() => setCheckoutStep('auth')}
                  className="flex-1 border border-gray-300 text-gray-900 py-2 rounded text-xs font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded text-xs font-medium hover:bg-emerald-700"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
