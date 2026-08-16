import { Metadata } from "next"

import HomeBanner from "@modules/home/components/home-banner"
import FeaturedProducts from "@modules/home/components/featured-products"
import MainCategories from "@modules/home/components/main-categories"
import CategoryProducts from "@modules/home/components/category-products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  const allCategories = await listCategories({
    limit: 100,
  })

  const categories = (allCategories || []).filter(
    (category) => !category.parent_category
  )

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <HomeBanner />
      <MainCategories categories={categories || []} />
      <CategoryProducts region={region} />
      <div className="content-container py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
