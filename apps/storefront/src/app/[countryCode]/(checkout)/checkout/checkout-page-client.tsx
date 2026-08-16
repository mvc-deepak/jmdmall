'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@lib/hooks/useCart'

const mockAddresses = [
  { id: 'home', name: 'Rohit Sharma', phone: '+91 98765 43210', address: '22, Palm Heights', city: 'Bengaluru', state: 'Karnataka', pin: '560001', country: 'India' },
  { id: 'office', name: 'Rohit Sharma', phone: '+91 98765 43210', address: '31, MG Road', city: 'Bengaluru', state: 'Karnataka', pin: '560025', country: 'India' },
]

const paymentOptions = [
  { id: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay' },
  { id: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when delivered' },
]

export default function CheckoutPageClient() {
  const searchParams = useSearchParams()
  const { cart } = useCart()
  const stepParam = searchParams.get('step')
  const currentStep = ['address', 'payment', 'review'].includes(stepParam ?? '') ? stepParam : 'address'
  const [selectedAddressId, setSelectedAddressId] = useState(mockAddresses[0].id)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pin: '',
  })

  const cartItems = cart?.items ?? []
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  )
  const shipping = cartItems.length > 0 ? 99 : 0
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax
  const selectedAddress =
    mockAddresses.find((address) => address.id === selectedAddressId) ?? mockAddresses[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-3 py-4 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Checkout</p>
            <h1 className="text-2xl font-bold text-gray-900">Secure payment</h1>
          </div>
          <Link href="/cart" className="text-sm font-medium text-gray-600 hover:text-emerald-700">
            Back to cart
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 p-4">
              {[
                { id: 'address', label: 'Address' },
                { id: 'payment', label: 'Payment' },
                { id: 'review', label: 'Review' },
              ].map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (step.id === 'payment' || step.id === 'review') {
                      if (selectedAddress) {
                        window.history.replaceState({}, '', `?step=${step.id}`)
                      }
                    } else {
                      window.history.replaceState({}, '', '?step=address')
                    }
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    currentStep === step.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6">
              {currentStep === 'address' ? (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Delivery address</h2>
                    <p className="mt-1 text-sm text-gray-600">Choose a saved address or add a new one.</p>
                  </div>

                  <div className="space-y-3">
                    {mockAddresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                          selectedAddressId === address.id
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 h-4 w-4 accent-emerald-600"
                        />
                        <div className="flex-1 text-sm text-gray-700">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-gray-900">{address.name}</span>
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-600">
                              Home
                            </span>
                          </div>
                          <p className="mt-1">{address.address}</p>
                          <p>{address.city}, {address.state} - {address.pin}</p>
                          <p>{address.country}</p>
                          <p className="mt-1 text-gray-500">{address.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {showAddressForm ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          value={newAddress.name}
                          onChange={(e) => setNewAddress((prev) => ({ ...prev, name: e.target.value }))}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                          placeholder="Full name"
                        />
                        <input
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress((prev) => ({ ...prev, phone: e.target.value }))}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                          placeholder="Phone"
                        />
                        <input
                          value={newAddress.address}
                          onChange={(e) => setNewAddress((prev) => ({ ...prev, address: e.target.value }))}
                          className="md:col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                          placeholder="Street address"
                        />
                        <input
                          value={newAddress.city}
                          onChange={(e) => setNewAddress((prev) => ({ ...prev, city: e.target.value }))}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                          placeholder="City"
                        />
                        <input
                          value={newAddress.state}
                          onChange={(e) => setNewAddress((prev) => ({ ...prev, state: e.target.value }))}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                          placeholder="State"
                        />
                        <input
                          value={newAddress.pin}
                          onChange={(e) => setNewAddress((prev) => ({ ...prev, pin: e.target.value }))}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                          placeholder="PIN code"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm((prev) => !prev)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-emerald-600 hover:text-emerald-700"
                    >
                      {showAddressForm ? 'Close form' : 'Add new address'}
                    </button>

                    <button
                      type="button"
                      disabled={cartItems.length === 0}
                      onClick={() => window.history.replaceState({}, '', '?step=payment')}
                      className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      Continue to payment
                    </button>
                  </div>
                </div>
              ) : currentStep === 'payment' ? (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Payment method</h2>
                    <p className="mt-1 text-sm text-gray-600">Select your preferred payment option.</p>
                  </div>

                  <div className="space-y-3">
                    {paymentOptions.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                          selectedPayment === method.id
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                          className="mt-1 h-4 w-4 accent-emerald-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{method.label}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {selectedPayment === 'card' && (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                      <div className="space-y-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Name on card" />
                          <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Card number" />
                          <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="MM / YY" />
                          <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="CVV" />
                        </div>
                        <button type="button" className="rounded-lg border border-emerald-600 bg-white px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
                          Add new payment method
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
                    <button
                      type="button"
                      onClick={() => window.history.replaceState({}, '', '?step=address')}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-emerald-600 hover:text-emerald-700"
                    >
                      Back to address
                    </button>

                    <button
                      type="button"
                      disabled={cartItems.length === 0}
                      onClick={() => window.history.replaceState({}, '', '?step=review')}
                      className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      Review order
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Review and confirm</h2>
                    <p className="mt-1 text-sm text-gray-600">Please check your delivery and payment details before placing the order.</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Delivery address</div>
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="font-semibold text-gray-900">{selectedAddress.name}</div>
                        <div>{selectedAddress.address}</div>
                        <div>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin}</div>
                        <div>{selectedAddress.country}</div>
                        <div className="pt-2 text-gray-500">{selectedAddress.phone}</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Payment method</div>
                      <div className="text-sm text-gray-700">
                        <div className="font-semibold text-gray-900">
                          {paymentOptions.find((method) => method.id === selectedPayment)?.label ?? 'Payment method'}
                        </div>
                        <div className="mt-1 text-gray-600">
                          {paymentOptions.find((method) => method.id === selectedPayment)?.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-gray-700">
                    <input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-600" defaultChecked />
                    <span>I confirm the shipping address and payment method are correct, and I want to place this order.</span>
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
                    <button
                      type="button"
                      onClick={() => window.history.replaceState({}, '', '?step=payment')}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-emerald-600 hover:text-emerald-700"
                    >
                      Back to payment
                    </button>

                    <button
                      type="button"
                      disabled={cartItems.length === 0}
                      className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      Place order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:sticky md:top-20 md:self-start">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Order summary</h3>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                {cartItems.length} items
              </span>
            </div>

            <div className="space-y-3 border-b border-gray-200 pb-3">
              {cartItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-500">
                  Your cart is empty.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
                    <img src={item.image} alt={item.title} className="h-14 w-14 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.variant_title || 'Standard variant'}</div>
                      <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 pt-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-emerald-700">₹{total}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
              <div className="font-semibold">Delivery to</div>
              <div className="mt-1">{selectedAddress.name}</div>
              <div>{selectedAddress.address}, {selectedAddress.city}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
