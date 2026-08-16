import type { Metadata } from "next"
import LocalCartItems from "@modules/cart/components/local-cart-items"

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart",
}

export default async function CartPage() {
  return (
    <div className="content-container py-8">
      <LocalCartItems />
    </div>
  )
}
