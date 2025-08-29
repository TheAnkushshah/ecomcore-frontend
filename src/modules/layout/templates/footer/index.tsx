import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full font-teachers bg-black text-white overflow-x-hidden">
      <div className="content-container flex flex-col w-full font-teachers">
        {/* Top Center "Join Our VIP List" */}
        <div className="w-full flex flex-col justify-center items-center mt-16 mb-16">
          <span className="text-4xl font-teachers text-white text-center">
            Join Our VIP List
          </span>
          <span className="mt-6 text-base font-teachers text-white text-center max-w-2xl">
            Be the first to receive the latest news and offers from the Lutyen&apos;s, including exclusive online pre-launches and new collections.
          </span>
          <form className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-lg">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-6 py-3 text-white font-teachers text-lg bg-transparent border border-[#929292] focus:outline-none transition-colors duration-200 placeholder-[#929292] focus:border-white rounded-none"
              style={{ minWidth: 0 }}
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-3 font-teachers font-semibold text-lg hover:bg-gray-200 transition rounded-none"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <hr className="border-t border-[#232323]" />
        </div>
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-20 font-teachers">
          {/* Logo */}
          <div className="font-teachers">
            <LocalizedClientLink href="/" className="font-teachers">
              <img
                src="/whitelogo.png"
                alt="Lutyen's Logo"
                className="h-[1.125rem] small:h-6 w-auto object-contain"
                style={{ display: "block" }}
              />
            </LocalizedClientLink>
          </div>
          {/* Links Section */}
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3 font-teachers text-white">
            {/* Categories */}
            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-col gap-y-2 font-teachers">
                <span className="txt-small-plus txt-ui-fg-base font-teachers text-white">
                  Categories
                </span>
                <ul className="grid grid-cols-1 gap-2 font-teachers" data-testid="footer-categories">
                  {productCategories
                    ?.filter((c) => !c.parent_category)
                    .slice(0, 6)
                    .map((c) => {
                      const children =
                        c.category_children?.map((child) => ({
                          name: child.name,
                          handle: child.handle,
                          id: child.id,
                        })) || null

                      return (
                        <li className="flex flex-col gap-2 text-white txt-small font-teachers" key={c.id}>
                          <LocalizedClientLink
                            className={clx("hover:text-white font-teachers", children && "txt-small-plus")}
                            href={`/categories/${c.handle}`}
                            data-testid="category-link"
                          >
                            {c.name}
                          </LocalizedClientLink>
                          {children && (
                            <ul className="grid grid-cols-1 ml-3 gap-2 font-teachers">
                              {children.map((child) => (
                                <li key={child.id} className="font-teachers">
                                  <LocalizedClientLink
                                    className="hover:text-white font-teachers"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                </ul>
              </div>
            )}

            {/* Collections */}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2 font-teachers">
                <span className="txt-small-plus txt-ui-fg-base font-teachers text-white">
                  Collections
                </span>
                <ul
                  className={clx("grid grid-cols-1 gap-2 text-white txt-small font-teachers", {
                    "grid-cols-2": (collections?.length || 0) > 3,
                  })}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id} className="font-teachers">
                      <LocalizedClientLink className="hover:text-white font-teachers" href={`/collections/${c.handle}`}>
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Medusa Links */}
            <div className="flex flex-col gap-y-2 font-teachers">
              <span className="txt-small-plus txt-ui-fg-base font-teachers text-white">Medusa</span>
              <ul className="grid grid-cols-1 gap-y-2 text-white txt-small font-teachers">
                <li className="font-teachers">
                  <a
                    href="https://github.com/medusajs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white font-teachers"
                  >
                    GitHub
                  </a>
                </li>
                <li className="font-teachers">
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white font-teachers"
                  >
                    Documentation
                  </a>
                </li>
                <li className="font-teachers">
                  <a
                    href="https://github.com/medusajs/nextjs-starter-medusa"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white font-teachers"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="flex w-full mb-16 justify-between items-center text-white font-teachers">
          <Text className="txt-compact-small font-teachers text-white">
            © {new Date().getFullYear()} Lutyen&apos;s. All rights reserved.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}