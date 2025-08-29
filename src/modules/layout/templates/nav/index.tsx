"use client"

import { useState, useEffect } from "react"
import { Search, UserRound, Heart, ShoppingBag, CircleFadingPlus } from "lucide-react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import MobileSearchBar from "@modules/layout/components/mobile-search-bar"
import MobileAccountCartSidebar from "@modules/layout/components/mobile-account-cart-sidebar"
import SearchOverlay from "@modules/common/components/search/search-overlay"

export default function Nav() {
  const [showSearch, setShowSearch] = useState(false)
  const [regions, setRegions] = useState<StoreRegion[]>([])

  useEffect(() => {
    listRegions().then((res) => setRegions(res))
  }, [])

  // Multiple offers/notices
  const notices = [
    "Free shipping on orders over $50 🎉",
    "New arrivals just dropped!",
    "10% off on your first purchase ⚡",
    "24/7 customer support available",
    "Buy 1 Get 1 Free 💤",
  ]
  // Use a real dot and non-breaking spaces for visible gap
  const marqueeText = notices.join("\u00A0\u00A0\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0\u00A0\u00A0")

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Notice/Offer Bar with marquee effect */}
      <div className="w-full bg-black text-white text-center py-2 text-sm font-medium overflow-hidden relative">
        <div className="marquee">{marqueeText}</div>
      </div>

      <header
        className="relative h-14 small:h-20 mx-auto border-none duration-200 bg-white transition-shadow border-b border-gray-200"
        id="main-navbar"
      >
        <nav className="content-container px-[0.8rem] txt-xsmall-plus text-black flex items-center justify-between w-full h-full text-small-regular">
          {/* Left side - Side menu */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="hover:text-ui-fg-base uppercase font-libra text-2xl-regular"
              data-testid="nav-store-link"
            >
              <img
                src="/logo.png"
                alt="Lutyen's Logo"
                className="h-[1.125rem] small:h-6 w-auto object-contain"
                style={{ display: "block" }}
              />
            </LocalizedClientLink>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end font-teachers">

            {/* Search Icon */}
            <button
              className="hover:text-ui-fg-base items-center hidden small:flex"
              aria-label="Search"
              onClick={() => setShowSearch(true)}
            >
              <Search size={22} strokeWidth={1.2} />
            </button>

            {/* Account Icon */}
            <LocalizedClientLink
              className="hover:text-ui-fg-base items-center hidden small:flex"
              href="/account"
              aria-label="Account"
              data-testid="nav-account-link"
            >
              <UserRound size={22} strokeWidth={1.2} />
            </LocalizedClientLink>

            {/* Wishlist Icon */}
            <LocalizedClientLink
              className="hover:text-ui-fg-base items-center hidden small:flex"
              href="/wishlist"
              aria-label="Wishlist"
            >
              <Heart size={22} strokeWidth={1.2} />
            </LocalizedClientLink>

            {/* Cart Icon */}
            <span className="hidden small:flex">
              <CartButton />
            </span>

            {/* Mobile Sidebar Trigger */}
            <MobileAccountCartSidebar>
              <button
                type="button"
                className="flex items-center small:hidden hover:text-ui-fg-base"
                aria-label="Open account and cart sidebar"
              >
                <CircleFadingPlus size={22} strokeWidth={1.2} />
              </button>
            </MobileAccountCartSidebar>
          </div>
        </nav>
      </header>

      {/* Mobile search bar below navbar */}
      <MobileSearchBar />

      {/* Search Overlay Component */}
      {showSearch && regions.length > 0 && (
        <SearchOverlay
          onClose={() => setShowSearch(false)}
          countryCode={regions[0].countries?.[0]?.iso_2 || "us"}
        />
      )}
    </div>
  )
}
