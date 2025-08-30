import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

// Force dynamic rendering to handle dynamic data fetching
export const dynamic = 'force-dynamic'

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  try {
    const regions = await listRegions()
    const countryCodes = regions?.map((r) =>
      r.countries?.map((c) => c.iso_2)
    ).flat().filter(Boolean)

    if (!countryCodes || countryCodes.length === 0) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      try {
        const { response } = await listProducts({
          countryCode: country,
          queryParams: { limit: 100, fields: "handle" },
        })

        return {
          country,
          products: response.products,
        }
      } catch {
        // ...skip logging...
        return { country, products: [] }
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch {
    // ...skip logging...
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const { countryCode, handle } = props.params

    const region = await getRegion(countryCode)
    if (!region) {
      return {
        title: "Product Not Found | Lutyen's",
        description: "This product could not be found.",
      }
    }

    const { response } = await listProducts({
      countryCode,
      queryParams: { q: handle },
    })
    const product = response.products.find((p) => p.handle === handle)

    if (!product) {
      return {
        title: "Product Not Found | Lutyen's",
        description: "This product could not be found.",
      }
    }

    return {
      title: `${product.title} | Lutyen's`,
      description: `${product.title}`,
      openGraph: {
        title: `${product.title} | Lutyen's`,
        description: `${product.title}`,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    }
  } catch {
    return {
      title: "Product | Lutyen's",
      description: "Product page",
    }
  }
}

export default async function ProductPage(props: Props) {
  try {
    const { countryCode, handle } = props.params

    const region = await getRegion(countryCode)
    // TEMP DEBUG: log region result
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("Region for", countryCode, ":", region)
    }
    if (!region) {
      notFound()
    }

    const { response } = await listProducts({
      countryCode,
      queryParams: { q: handle },
    })
    // TEMP DEBUG: log products result
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("Products for", countryCode, handle, ":", response.products)
    }
    const pricedProduct = response.products.find(
      (p) => p.handle === handle
    )

    if (!pricedProduct) {
      notFound()
    }

    return (
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={countryCode}
      />
    )
  } catch (err) {
    // TEMP DEBUG: log error
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("Error in ProductPage:", err)
    }
    notFound()
  }
}