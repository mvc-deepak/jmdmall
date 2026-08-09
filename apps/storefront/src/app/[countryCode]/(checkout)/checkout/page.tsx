'use client'

import { useState } from 'react'
import { retrieveCart } from '@lib/data/cart'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState('cart')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 py-2 md:py-3">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="flex gap-4 mt-2 text-xs md:text-sm">
            <button
              onClick={() => setActiveStep('cart')}
              className={`pb-1 border-b-2 font-medium ${
                activeStep === 'cart'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Cart
            </button>
            <button
              onClick={() => setActiveStep('address')}
              className={`pb-1 border-b-2 font-medium ${
                activeStep === 'address'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Address
            </button>
            <button
              onClick={() => setActiveStep('payment')}
              className={`pb-1 border-b-2 font-medium ${
                activeStep === 'payment'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Payment
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 py-3 md:py-4">
        <CheckoutContent activeStep={activeStep} setActiveStep={setActiveStep} />
      </div>
    </div>
  )
}

function CheckoutContent({
  activeStep,
  setActiveStep,
}: {
  activeStep: string
  setActiveStep: (step: string) => void
}) {
  const [cartData, setCartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {activeStep === 'cart' && <CartStep onNext={() => setActiveStep('address')} />}
        {activeStep === 'address' && <AddressStep onNext={() => setActiveStep('payment')} onBack={() => setActiveStep('cart')} />}
        {activeStep === 'payment' && <PaymentStep onBack={() => setActiveStep('address')} />}
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <OrderSummary />
      </div>
    </div>
  )
}

function CartStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
      <div className="bg-white border border-gray-200 rounded p-3">
        <p className="text-sm text-gray-600">Cart items will be displayed here</p>
      </div>
      <button
        onClick={onNext}
        className="w-full bg-emerald-600 text-white py-2 rounded font-medium hover:bg-emerald-700"
      >
        Continue to Address
      </button>
    </div>
  )
}

function AddressStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
      <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="Enter your name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="Enter your phone" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
          <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="Enter your address" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="City" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">PIN</label>
            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="PIN Code" />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 bg-white border border-gray-300 text-gray-900 py-2 rounded font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-emerald-600 text-white py-2 rounded font-medium hover:bg-emerald-700"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}

function PaymentStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
      <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
        <div className="flex gap-2">
          <input type="radio" id="card" name="payment" defaultChecked />
          <label htmlFor="card" className="text-sm text-gray-900 font-medium">
            Credit/Debit Card
          </label>
        </div>
        <div className="flex gap-2">
          <input type="radio" id="upi" name="payment" />
          <label htmlFor="upi" className="text-sm text-gray-900 font-medium">
            UPI
          </label>
        </div>
        <div className="flex gap-2">
          <input type="radio" id="cod" name="payment" />
          <label htmlFor="cod" className="text-sm text-gray-900 font-medium">
            Cash on Delivery
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 bg-white border border-gray-300 text-gray-900 py-2 rounded font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <button className="flex-1 bg-emerald-600 text-white py-2 rounded font-medium hover:bg-emerald-700">
          Place Order
        </button>
      </div>
    </div>
  )
}

function OrderSummary() {
  // Mock data - will be replaced with real cart data
  const items = [
    { id: 1, title: 'Basmati Rice', variant: '1 kg', price: 230, qty: 1, image: 'https://via.placeholder.com/100' },
    { id: 2, title: 'Cooking Oil', variant: '500 ml', price: 450, qty: 2, image: 'https://via.placeholder.com/100' },
    { id: 3, title: 'Sweatshirt', variant: 'M', price: 599, qty: 1, image: 'https://via.placeholder.com/100' },
  ]

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = 99
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  return (
    <div className="sticky top-24 bg-white border border-gray-200 rounded p-3 space-y-3">
      <h3 className="text-sm font-bold text-gray-900">Order Summary</h3>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pb-3 border-b border-gray-200">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded p-2 bg-gray-50 hover:shadow-sm transition">
            {/* Image */}
            <div className="w-full aspect-square bg-gray-100 rounded overflow-hidden mb-1">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.title}</p>
            <p className="text-xs text-gray-600 line-clamp-1">{item.variant}</p>

            {/* Price & Qty */}
            <div className="flex justify-between items-center mt-1 text-xs">
              <span className="font-semibold text-emerald-600">₹{item.price}</span>
              <span className="bg-emerald-100 text-emerald-700 px-1.5 rounded font-semibold">x{item.qty}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="space-y-1 text-xs pb-3 border-b border-gray-200">
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
      </div>

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-900">Total</span>
        <span className="text-xl font-bold text-emerald-600">₹{total}</span>
      </div>

      <p className="text-xs text-gray-500 text-center">{items.length} items</p>
    </div>
  )
}
