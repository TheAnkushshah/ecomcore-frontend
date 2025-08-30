import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

// Force dynamic rendering to handle dynamic data fetching
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
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
      } catch (error) {
        console.error(`Failed to fetch products for country ${country}:`, error)
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
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params
    const { handle } = params
    
    const [region, productData] = await Promise.allSettled([
      getRegion(params.countryCode),
      listProducts({
        countryCode: params.countryCode,
        queryParams: { q: handle },
      })
    ])

    if (region.status === 'rejected' || !region.value) {
      notFound()
    }

    if (productData.status === 'rejected') {
      notFound()
    }

    const product = productData.value.response.products.find((p) => p.handle === handle)

    if (!product) {
      notFound()
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
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Product | Lutyen's",
      description: "Product page",
    }
  }
}

export default async function ProductPage(props: Props) {
  try {
    const params = await props.params
    
    const [region, productData] = await Promise.allSettled([
      getRegion(params.countryCode),
      listProducts({
        countryCode: params.countryCode,
        queryParams: { q: params.handle },
      })
    ])

    if (region.status === 'rejected' || !region.value) {
      notFound()
    }

    if (productData.status === 'rejected') {
      notFound()
    }

    const pricedProduct = productData.value.response.products.find(
      (p) => p.handle === params.handle
    )

    if (!pricedProduct) {
      notFound()
    }

    return (
      <ProductTemplate
        product={pricedProduct}
        region={region.value}
        countryCode={params.countryCode}
      />
    )
  } catch (error) {
    console.error("Error rendering product page:", error)
    notFound()
  }
}