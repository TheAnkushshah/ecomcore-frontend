"use client"

import { useState, useEffect } from "react"
import { listProducts } from "@lib/data/products"
import { useRouter } from "next/navigation"
import { getProductPrice } from "@lib/util/get-product-price"

type SearchOverlayProps = {
  countryCode: string
  onClose: () => void
}

export default function SearchOverlay({ countryCode, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [closing, setClosing] = useState(false)

  const [newThisSeason, setNewThisSeason] = useState<any[]>([])
  const [trendingNow, setTrendingNow] = useState<any[]>([])

  const router = useRouter()

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 600)
  }

  const NEW_THIS_SEASON_ID = "pcol_01K3DJRM6XHRY6GVA8WNBXJ79N"
  const TRENDING_NOW_ID = "pcol_01K2M5T73C62T95F8BZMXK25RW"

  // Fetch "New This Season" and "Trending Now"
  useEffect(() => {
    async function fetchSections() {
      try {
        const { response: newSeasonRes } = await listProducts({
          countryCode,
          queryParams: {
            collection_id: [NEW_THIS_SEASON_ID],
            fields: "*variants.calculated_price",
            limit: 6,
          },
        })
        setNewThisSeason(newSeasonRes.products)

        const { response: trendingRes } = await listProducts({
          countryCode,
          queryParams: {
            collection_id: [TRENDING_NOW_ID],
            fields: "*variants.calculated_price",
            limit: 6,
          },
        })
        setTrendingNow(trendingRes.products)
      } catch (err) {
        console.error("Error fetching collections:", err)
      }
    }
    fetchSections()
  }, [countryCode])

  // Handle search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const delay = setTimeout(async () => {
      setLoading(true)
      try {
        const { response } = await listProducts({
          countryCode,
          queryParams: {
            q: query,
            fields: "*variants.calculated_price",
            limit: 8,
          },
        })
        setResults(response.products)
      } catch (err) {
        console.error("Search error:", err)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(delay)
  }, [query, countryCode])

  const handleSelect = (handle: string) => {
    router.push(`/products/${handle}`)
    handleClose()
  }

  const formatPrice = (product: any) => {
    const { cheapestPrice } = getProductPrice({ product })
    return cheapestPrice
      ? `${cheapestPrice.calculated_price}` // already formatted with currency
      : "Price unavailable"
  }

  const renderProductList = (products: any[]) => (
    <ul className="grid grid-cols-2 mt-4 gap-0">
      {products.map((product) => (
        <li
          key={product.id}
          className="cursor-pointer p-0 font-teachers flex flex-col items-center"
          onClick={() => handleSelect(product.handle)}
        >
          <img
            src={product.thumbnail || "/placeholder.png"}
            alt={product.title}
            className="mb-2"
            style={{ maxWidth: "320px", maxHeight: "398px", objectFit: "cover" }}
          />
          <div className="w-full flex flex-row items-center justify-between px-4">
            <span className="text-sm text-left truncate">{product.title}</span>
            <span className="text-xs text-gray-600 whitespace-nowrap">{formatPrice(product)}</span>
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col items-center justify-start p-0 overflow-y-auto overscroll-contain ${closing ? "animate-slide-up" : "animate-slide-down"
          }`}
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="w-full relative mt-0 flex flex-col items-center">
          {/* Logo */}
          <div className="w-full flex justify-center items-center py-8 relative">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-[1.125rem] small:h-6 w-auto object-contain cursor-pointer"
              onClick={handleClose}
            />
          </div>

          {/* Search Input */}
          <div className="w-full flex justify-center px-4">
            <div className="relative font-teachers w-full" style={{ maxWidth: "1280px" }}>
              <input
                type="text"
                className="w-full rounded-full border txt-compact-small font-teachers focus:outline-none focus:ring-0"
                style={{
                  borderColor: "#929292",
                  color: "#000",
                  padding: "0 4rem 0 1.5rem",
                  height: "3rem",
                  borderWidth: "1px",
                  background: "white",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  letterSpacing: "0.063rem",
                  lineHeight: "normal",
                }}
                placeholder='Search for "Men Sneakers"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                onFocus={(e) => (e.target.style.borderColor = "#000")}
                onBlur={(e) => (e.target.style.borderColor = "#929292")}
              />
            </div>
          </div>

          {/* Trending Searches */}
          <div className="w-full flex justify-center mt-3 px-4 mb-8">
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-wrap gap-2 items-center justify-center font-teachers text-xs pt-4" style={{ rowGap: "0.5rem" }}>
                <span className="font-semibold text-[#212121]">TRENDING SEARCHES:</span>
                {["Straight Fit Jeans", "Oversized T-Shirts", "Sneakers", "Summer Dresses", "Formal Shirts", "Accessories"].map((term) => (
                  <button key={term} type="button" className="mx-2" onClick={() => setQuery(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* New This Season */}
          {!query && newThisSeason.length > 0 && (
            <div className="w-full mt-2 px-0">
              <h3 className="mb-0 text-sm text-left pl-16">New This Season</h3>
              <div className="w-full flex justify-start mt-2">
                {renderProductList(newThisSeason)}
              </div>
            </div>
          )}

          {/* Trending Now */}
          {!query && trendingNow.length > 0 && (
            <div className="w-full mt-8 px-0 mb-6">
              <h3 className="mb-0 text-sm text-left pl-16">Trending Now</h3>
              <div className="w-full flex justify-start mt-2">
                {renderProductList(trendingNow)}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="w-full max-w-xl mt-2 px-4 sm:px-6 md:px-8">
            {loading && <p className="text-[#929292] text-sm font-teachers">Searching...</p>}
            {!loading && results.length > 0 && (
              <ul>
                {results.map((product) => (
                  <li
                    key={product.id}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded font-teachers flex items-center gap-3"
                    style={{ color: "#212121", fontSize: "1rem", fontWeight: 400, letterSpacing: "0.063rem" }}
                    onClick={() => handleSelect(product.handle)}
                  >
                    <img
                      src={product.thumbnail || "/placeholder.png"}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex flex-row items-center justify-between w-full px-2">
                      <span className="truncate">{product.title}</span>
                      <span className="text-xs text-gray-600 whitespace-nowrap ml-4">{formatPrice(product)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!loading && query && results.length === 0 && (
              <p className="text-[#929292] text-sm font-teachers">No results found</p>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          overflow: hidden !important;
        }
        @keyframes slide-down { from {transform: translateY(-100%);} to {transform: translateY(0);} }
        @keyframes slide-up { from {transform: translateY(0);} to {transform: translateY(-100%);} }
        .animate-slide-down { animation: slide-down 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        input::placeholder { color: #929292 !important; opacity: 1; }
      `}</style>
    </div>
  )
}
