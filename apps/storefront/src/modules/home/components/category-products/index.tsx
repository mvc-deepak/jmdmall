import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function CategoryProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const allCategories = await listCategories({ limit: 100 })
  const categories = (allCategories || []).filter(
    (category) => !category.parent_category
  )

  if (!categories || categories.length < 2) {
    return null
  }

  const targetCategories = categories.filter((cat) =>
    ["Rice & Grains", "Cooking Oils & Ghee"].includes(cat.name)
  )

  const categoryProducts = await Promise.all(
    targetCategories.map(async (category) => {
      try {
        const {
          response: { products: pricedProducts },
        } = await listProducts({
          regionId: region.id,
          queryParams: {
            category_id: category.id,
            fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
          },
        })

        console.log(`\n=== Category: ${category.name} ===`)
        console.log(`Region ID: ${region.id}`)
        console.log(`Products Count: ${pricedProducts?.length || 0}`)

        if (pricedProducts && pricedProducts.length > 0) {
          const firstProduct = pricedProducts[0]
          console.log(`First product: ${firstProduct.title}`)
          console.log(`First product variants:`, JSON.stringify(firstProduct.variants?.slice(0, 1), null, 2))
        }

        return {
          category,
          products: (pricedProducts || []).slice(0, 12),
        }
      } catch (error) {
        console.error(`Error fetching products for category ${category.name}:`, error)
        return {
          category,
          products: [],
        }
      }
    })
  )

  return (
    <div className="w-full">
      {categoryProducts.map(({ category, products }) => {
        if (!products || products.length === 0) {
          return null
        }

        return (
          <div key={category.id} className="py-8 border-b">
            <div className="content-container">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-ui-fg-base">
                  {category.name}
                </h2>
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className="text-sm text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
                >
                  View all →
                </LocalizedClientLink>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4" style={{ minWidth: "max-content" }}>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex-shrink-0"
                      style={{ width: "calc((100vw - 48px) / 6.5)" }}
                    >
                      <ProductPreview
                        product={product}
                        region={region}
                        isFeatured={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
