import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading, Text } from "@modules/common/components/ui"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

const getCategoryImage = (category: HttpTypes.StoreProductCategory) => {
  const categoryData = category as Record<string, unknown>
  const metadata = (categoryData.metadata as Record<string, unknown> | undefined) ?? {}

  const candidates = [
    categoryData.image,
    categoryData.image_url,
    categoryData.thumbnail,
    categoryData.category_image,
    metadata.image,
    metadata.image_url,
    metadata.thumbnail,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate) {
      return candidate
    }

    if (
      candidate &&
      typeof candidate === "object" &&
      "url" in candidate &&
      typeof (candidate as { url?: string }).url === "string"
    ) {
      return (candidate as { url: string }).url
    }
  }

  return undefined
}

export default function MainCategories({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  if (!categories.length) {
    return null
  }

  const topLevelCategories = categories.filter((category) => !category.parent_category)

  return (
    <section className="py-8">
      <Heading
        level="h2"
        className="text-[28px] font-semibold text-ui-fg-base mb-6"
      >
        Categories
      </Heading>

      <ul className="grid grid-cols-3 gap-x-1 gap-y-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
        {topLevelCategories.map((category) => {
          const image = getCategoryImage(category)

          return (
            <li key={category.id} className="list-none justify-self-center">
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="group flex flex-col items-center text-center gap-[5px] transition duration-200 hover:text-ui-fg-interactive"
              >
                <div className="relative aspect-[4/5] w-[64px] overflow-hidden rounded-[10px] border border-ui-border-base/10 bg-ui-bg-subtle transition-colors duration-200 group-hover:bg-ui-bg-muted">
                  {image ? (
                    <Image
                      src={image}
                      alt={category.name || "Category"}
                      fill
                      className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ui-fg-subtle">
                      <PlaceholderImage size={20} />
                    </div>
                  )}
                </div>

                <Text
                  as="span"
                  className="text-[12px] font-normal leading-[1.35] text-ui-fg-base max-w-[78px] break-normal overflow-visible hyphens-none"
                >
                  {category.name}
                </Text>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
