import { Metadata } from "next";
import { notFound } from "next/navigation";
import { listProducts } from "@lib/data/products";
import { listRegions } from "@lib/data/regions";
import ProductTemplate from "@modules/products/templates";

type Props = {
  params: { countryCode: string; handle: string };
};

// ✅ Generate static paths for all products at build time
export async function generateStaticParams() {
  const regions = await listRegions();
  if (!regions) return [];

  const countryCodes = regions
    .map((r) => r.countries?.map((c) => c.iso_2))
    .flat()
    .filter(Boolean) as string[];

  const promises = countryCodes.map(async (country) => {
    const { response } = await listProducts({
      countryCode: country,
      queryParams: { limit: 100, fields: "handle,title,thumbnail" },
    });

    return response.products.map((product) => ({
      countryCode: country,
      handle: product.handle,
      title: product.title,
      thumbnail: product.thumbnail,
    }));
  });

  const productsByCountry = await Promise.all(promises);

  return productsByCountry.flat().map((p) => ({
    countryCode: p.countryCode,
    handle: p.handle,
  }));
}

// ✅ Generate metadata at build time
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryCode, handle } = params;

  const { response } = await listProducts({
    countryCode,
    queryParams: { q: handle },
  });

  const product = response.products.find((p) => p.handle === handle);
  if (!product) notFound();

  return {
    title: `${product.title} | Lutyen's`,
    description: product.title,
    openGraph: {
      title: `${product.title} | Lutyen's`,
      description: product.title,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

// ✅ Static product page
export default async function ProductPage({ params }: Props) {
  const { countryCode, handle } = params;

  const { response } = await listProducts({
    countryCode,
    queryParams: { q: handle },
  });

  const product = response.products.find((p) => p.handle === handle);
  if (!product) notFound();

  // Fetch the region object for the given countryCode
  const regions = await listRegions();
  const region =
    regions
      ?.find((r) => r.countries?.some((c) => c.iso_2 === countryCode));

  if (!region) notFound();

  return (
    <ProductTemplate
      product={product}
      region={region}
      countryCode={countryCode}
    />
  );
}
