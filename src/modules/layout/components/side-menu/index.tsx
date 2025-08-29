"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import { Menu as MenuIcon, Heart, X as XIcon, RefreshCw } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full font-teachers">
      <div className="flex items-center h-full font-teachers">
        <Popover className="h-full flex font-teachers">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full items-center gap-x-2 font-teachers">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center gap-x-2 transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base font-teachers"
                >
                  <span className="small:hidden font-teachers">
                    {open ? <XIcon size={22} strokeWidth={1.2} /> : <MenuIcon size={22} strokeWidth={1.2} />}
                  </span>
                  <span className="hidden small:flex items-center gap-x-2 font-teachers">
                    <MenuIcon size={22} strokeWidth={1.2} />
                    <span className="font-teachers">Menu</span>
                  </span>
                </Popover.Button>
                <LocalizedClientLink
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="flex items-center small:hidden ml-2 hover:text-ui-fg-base font-teachers"
                >
                  <Heart size={22} strokeWidth={1.2} />
                </LocalizedClientLink>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <PopoverPanel
                  className="fixed z-30 font-teachers"
                  style={{
                    left: "0",
                    top: "5.7rem",
                    width: "100vw",
                    height: "calc(100vh - 5.7rem)",
                  }}
                >
                  <div
                    className="hidden small:block fixed inset-0 bg-black/30 z-[-1] cursor-pointer font-teachers"
                    onClick={close}
                  />
                  <div
                    className="block small:hidden h-full bg-white flex-col shadow-xl w-full border-t border-gray-200 font-teachers"
                    style={{
                      backgroundImage: "url('/MenuMobile.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: "white",
                    }}
                  >
                    <ul className="flex flex-col gap-2 items-start justify-start px-0 py-8 font-teachers">
                      {Object.entries(SideMenuItems).map(([name, href]) => (
                        <li key={name} className="w-full font-teachers">
                          <LocalizedClientLink
                            href={href}
                            className="block w-full text-xl font-semibold py-3 pl-6 pr-4 rounded-lg text-left text-white font-teachers"
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-y-6 px-6 pb-6 mt-auto font-teachers">
                      <div
                        className="flex justify-start font-teachers"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && <CountrySelect toggleState={toggleState} regions={regions} />}
                      </div>
                      <Text className="flex justify-start txt-compact-small text-white font-teachers">
                        © {new Date().getFullYear()} Lutyen's. All rights reserved.
                      </Text>
                    </div>
                  </div>

                  <div className="hidden small:flex fixed inset-0 items-center justify-center z-40 font-teachers" onClick={close}>
                    <div
                      className="bg-white shadow-2xl w-full max-w-6xl h-[40rem] mx-auto flex flex-col font-teachers"
                      style={{
                        backgroundImage: "url('/Menu.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "white",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end px-6 pt-6 pb-2 font-teachers" />
                      <ul className="flex flex-col gap-2 items-start justify-start px-0 py-4 font-teachers">
                        {Object.entries(SideMenuItems).map(([name, href]) => (
                          <li key={name} className="w-full font-teachers">
                            <LocalizedClientLink
                              href={href}
                              className="block w-full text-xl font-semibold py-3 pl-6 pr-4 rounded-lg text-left text-white font-teachers"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                      <div className="hidden small:flex flex-row items-center justify-between px-6 pb-6 mt-auto w-full font-teachers">
                        <div
                          className="flex items-center group font-teachers"
                          onMouseEnter={toggleState.open}
                          onMouseLeave={toggleState.close}
                        >
                          {regions && <CountrySelect toggleState={toggleState} regions={regions} />}
                          <RefreshCw
                            className={clx(
                              "ml-2 transition-transform duration-300 text-white font-teachers",
                              toggleState.state ? "rotate-[360deg]" : ""
                            )}
                            size={20}
                            strokeWidth={1.5}
                          />
                        </div>
                        <Text className="txt-compact-small text-white font-teachers">
                          © {new Date().getFullYear()} Lutyen's. All rights reserved.
                        </Text>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
