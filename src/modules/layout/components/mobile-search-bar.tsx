"use client"

import { useEffect, useState } from "react"
import SearchOverlay from "@modules/common/components/search/search-overlay"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"

export default function MobileSearchBar() {
  const suggestions = [
    "Straight Fit Jeans",
    "Oversized T-Shirts",
    "Sneakers",
    "Summer Dresses",
    "Formal Shirts",
    "Accessories",
  ]

  const [currentText, setCurrentText] = useState("")
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [regions, setRegions] = useState<StoreRegion[]>([])

  const handleOpenSearch = () => setShowSearch(true)
  const handleCloseSearch = () => setShowSearch(false)

  useEffect(() => {
    listRegions().then((res) => setRegions(res))
  }, [])

  useEffect(() => {
    if (isPaused) return

    const typingDelay = 100
    const holdDelay = 1500

    const type = () => {
      const currentSuggestion = suggestions[suggestionIndex]
      if (charIndex < currentSuggestion.length) {
        setCurrentText((prev) => prev + currentSuggestion[charIndex])
        setCharIndex((prev) => prev + 1)
      } else {
        setTimeout(() => {
          setCurrentText("")
          setCharIndex(0)
          setSuggestionIndex((prev) => (prev + 1) % suggestions.length)
        }, holdDelay)
      }
    }

    const timer = setTimeout(type, charIndex === 0 ? 0 : typingDelay)
    return () => clearTimeout(timer)
  }, [charIndex, suggestionIndex, isPaused, suggestions])

  return (
    <>
      <div className="block small:hidden w-full bg-white px-[12px] pt-[1px] pb-[12px] border-none font-teachers">
        <div className="w-full relative font-teachers">
          <input
            type="text"
            className="w-full rounded-full border font-teachers txt-compact-small focus:outline-none focus:ring-0"
            style={{
              borderColor: "#929292",
              color: isPaused ? "#000" : "#929292",
              padding: "1rem 4rem 1rem 1.5rem",
              height: "3rem",
              lineHeight: "3rem",
              borderWidth: "1px",
            }}
            autoComplete="off"
            placeholder=""
            readOnly
            onFocus={handleOpenSearch} // Trigger overlay when tapped
          />

          {!isPaused && (
            <span
              className="absolute pointer-events-none select-none txt-compact-small font-teachers"
              style={{
                top: "0",
                left: "1.5rem",
                height: "3rem",
                display: "flex",
                alignItems: "center",
                color: "#929292",
              }}
            >
              Search for&nbsp;
              {currentText}
              <span className="animate-blink font-teachers">|</span>
            </span>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {showSearch && regions.length > 0 && (
        <SearchOverlay
          onClose={handleCloseSearch}
          countryCode={regions[0].countries?.[0]?.iso_2 || "US"}
        />
      )}
    </>
  )
}