import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"
import type { MedusaContainer } from "@medusajs/framework/types"

type Category = {
  name: string
  handle: string
  children?: Category[]
}

const categories: Category[] = [
  {
    name: "Grocery",
    handle: "grocery",
    children: [
      {
        name: "Fruits & Vegetables",
        handle: "fruits-vegetables",
      },
      {
        name: "Dairy & Eggs",
        handle: "dairy-eggs",
      },
      {
        name: "Rice, Atta & Grains",
        handle: "rice-atta-grains",
        children: [
          {
            name: "Rice",
            handle: "rice",
            children: [
              {
                name: "Basmati Rice",
                handle: "basmati-rice",
              },
              {
                name: "Katarni Rice",
                handle: "katarni-rice",
              },
              {
                name: "Jeera Rice",
                handle: "jeera-rice",
              },
              {
                name: "Biryani Rice",
                handle: "biryani-rice",
              },
              {
                name: "Sonam Rice",
                handle: "sonam-rice",
              },
              {
                name: "Sona Mansuli Rice",
                handle: "sona-mansuli-rice",
              },
            ],
          },
          {
            name: "Atta",
            handle: "atta",
          },
          {
            name: "Maida",
            handle: "maida",
          },
          {
            name: "Suji",
            handle: "suji",
          },
          {
            name: "Besan",
            handle: "besan",
          },
          {
            name: "Multigrain Flour",
            handle: "multigrain-flour",
          },
          {
            name: "Millets",
            handle: "millets",
          },
        ],
      },
      {
        name: "Dal, Pulses & Beans",
        handle: "dal-pulses-beans",
      },
      {
        name: "Oil & Ghee",
        handle: "oil-ghee",
      },
      {
        name: "Spices & Masala",
        handle: "spices-masala",
      },
      {
        name: "Salt & Sugar",
        handle: "salt-sugar",
      },
      {
        name: "Dry Fruits & Nuts",
        handle: "dry-fruits-nuts",
      },
      {
        name: "Snacks",
        handle: "snacks",
      },
      {
        name: "Biscuits & Cookies",
        handle: "biscuits-cookies",
      },
      {
        name: "Bakery",
        handle: "bakery",
      },
      {
        name: "Beverages",
        handle: "beverages",
      },
      {
        name: "Tea & Coffee",
        handle: "tea-coffee",
      },
      {
        name: "Packaged Food",
        handle: "packaged-food",
      },
      {
        name: "Instant & Ready-to-Eat",
        handle: "instant-ready-to-eat",
      },
      {
        name: "Sauces, Pickles & Spreads",
        handle: "sauces-pickles-spreads",
      },
      {
        name: "Frozen Food",
        handle: "frozen-food",
      },
      {
        name: "Meat & Seafood",
        handle: "meat-seafood",
      },
      {
        name: "Baby Food",
        handle: "baby-food",
      },
      {
        name: "Personal Care",
        handle: "personal-care",
      },
      {
        name: "Household Cleaning",
        handle: "household-cleaning",
      },
      {
        name: "Laundry",
        handle: "laundry",
      },
      {
        name: "Kitchen & Home",
        handle: "kitchen-home",
      },
    ],
  },
]

async function createCategories(
  container: MedusaContainer,
  categoryList: Category[],
  parentCategoryId?: string
) {
  for (const category of categoryList) {
    console.log(`Creating: ${category.name}`)

    const { result } =
      await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [
            {
              name: category.name,
              handle: category.handle,
              is_active: true,
              is_internal: false,
              ...(parentCategoryId
                ? {
                    parent_category_id: parentCategoryId,
                  }
                : {}),
            },
          ],
        },
      })

    const createdCategory = result[0]

    console.log(
      `  ✓ ${createdCategory.name} (${createdCategory.id})`
    )

    if (category.children?.length) {
      await createCategories(
        container,
        category.children,
        createdCategory.id
      )
    }
  }
}

export default async function importCategories(
  container: MedusaContainer
) {
  console.log("")
  console.log("==============================================")
  console.log("       JMD MALL CATEGORY IMPORT")
  console.log("==============================================")
  console.log("")

  await createCategories(container, categories)

  console.log("")
  console.log("==============================================")
  console.log("       CATEGORY IMPORT COMPLETED")
  console.log("==============================================")
  console.log("")
}