"use client"

import { useState } from "react"
import { X } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function MobileAccountCartSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <span onClick={() => setOpen(true)}>
        {children}
      </span>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setOpen(false)}
          />
          {/* Bottom Sheet Sidebar */}
          <div
            className="fixed left-0 right-0 bottom-0 w-full bg-white shadow-2xl rounded-t-2xl p-6 pb-10 animate-slideup"
            style={{ minHeight: "200px" }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col gap-6 mt-10">
              <LocalizedClientLink
                href="/account"
                className="text-lg font-medium hover:text-ui-fg-base"
                onClick={() => setOpen(false)}
              >
                Account
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/cart"
                className="text-lg font-medium hover:text-ui-fg-base"
                onClick={() => setOpen(false)}
              >
                Cart
              </LocalizedClientLink>
            </div>
          </div>
          <style jsx global>{`
            @keyframes slideup {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
            .animate-slideup {
              animation: slideup 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}</style>
        </div>
      )}
    </>
  )
}
