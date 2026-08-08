import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const deliveryLabel = (() => {
    const metadata = product.metadata as Record<string, unknown> | undefined

    if (typeof metadata?.delivery_time === "string") {
      return metadata.delivery_time
    }

    if (typeof metadata?.deliveryEstimate === "string") {
      return metadata.deliveryEstimate
    }

    return "Fast delivery"
  })()

  const variantLabel = (() => {
    if (product.options?.length) {
      const optionValues = product.options
        .map((option) => option.values?.[0]?.value)
        .filter((value): value is string => !!value)

      if (optionValues.length) {
        return optionValues.join(" / ")
      }
    }

    const firstVariant = product.variants?.[0]

    if (firstVariant) {
      const optionValues = firstVariant.options
        ?.map((option) => option.value)
        .filter((value): value is string => !!value)

      if (optionValues?.length) {
        return optionValues.join(" / ")
      }

      if (firstVariant.title && firstVariant.title !== "Default Title") {
        return firstVariant.title
      }
    }

    return undefined
  })()

  const variantCountLabel =
    product.variants && product.variants.length > 1
      ? `${product.variants.length} options`
      : undefined

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block w-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[12px] border border-ui-border-base bg-white shadow-sm transition duration-150 ease-out hover:shadow-sm">
        <div className="overflow-hidden bg-[#faf8ef]">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="bg-[#faf8ef] !h-[180px] !p-1"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 px-3 py-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f7f0e2] px-3 py-[5px] text-[11px] font-medium text-[#5f4d28] max-w-max">
            <span aria-hidden="true">🕐</span>
            <span>{deliveryLabel}</span>
          </span>

          <Text
            className="line-clamp-2 text-[15px] leading-5 text-ui-fg-base"
            data-testid="product-title"
          >
            {product.title}
          </Text>

          {variantLabel && (
            <Text className="text-[14px] leading-5 text-ui-fg-muted">
              {variantLabel}
            </Text>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <Text className="text-[15px] font-medium text-ui-fg-base">
              {cheapestPrice?.calculated_price}
            </Text>
            <div className="flex flex-col items-end gap-1">
              <span className="inline-flex h-[38px] min-w-[86px] items-center justify-center rounded-[8px] border border-emerald-500 bg-white px-3 text-[13px] font-medium text-emerald-700">
                ADD
              </span>
              {variantCountLabel && (
                <Text className="text-[11px] text-ui-fg-muted">
                  {variantCountLabel}
                </Text>
              )}
            </div>
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
