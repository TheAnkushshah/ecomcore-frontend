"use client"

import { useEffect, useState } from "react"
import CartDropdown from "../cart-dropdown"
import { retrieveCart } from "@lib/data/cart" // ensure this can be called client-side!

export default function CartButton() {
  const [cart, setCart] = useState(null)

  useEffect(() => {
    retrieveCart().then(setCart).catch(() => setCart(null))
  }, [])

  // Optionally handle loading / empty cart state in CartDropdown
  return <CartDropdown cart={cart} />
}
