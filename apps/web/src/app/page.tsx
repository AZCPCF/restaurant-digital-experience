import type { Menu, MenuPresentation, Page } from "@rde/menu-engine";

const menuPresentation: MenuPresentation = {
  layout: "grid",
  card: "large-image",
  columns: 2,
  showDescription: true,
  showImage: true,
  showPrice: true,
};

const menu: Menu = {
  id: "menu-1",
  name: "Dinner",
  description: "Our dinner menu",
  status: "published",

  categories: [
    {
      id: "category-1",
      name: "Pizza",
      description: "Freshly baked pizzas",

      items: [
        {
          id: "item-1",
          name: "Margherita",
          description: "Tomato, mozzarella and fresh basil",

          price: {
            amount: 14,
            currency: "EUR",
          },

          image: {
            url: "https://example.com/margherita.jpg",
            alt: "Margherita Pizza",
          },

          available: true,

          tags: ["vegetarian"],

          modifierGroups: [
            {
              id: "modifier-size",
              name: "Size",

              required: true,

              minSelections: 1,
              maxSelections: 1,

              defaultSelectionIds: ["size-medium"],

              choices: [
                {
                  id: "size-small",
                  name: "Small",
                  priceDelta: {
                    amount: 0,
                    currency: "EUR",
                  },
                },
                {
                  id: "size-medium",
                  name: "Medium",
                  priceDelta: {
                    amount: 3,
                    currency: "EUR",
                  },
                },
                {
                  id: "size-large",
                  name: "Large",
                  priceDelta: {
                    amount: 5,
                    currency: "EUR",
                  },
                },
              ],
            },

            {
              id: "modifier-extras",
              name: "Extra Toppings",

              required: false,

              minSelections: 0,
              maxSelections: 3,

              defaultSelectionIds: [],

              choices: [
                {
                  id: "extra-cheese",
                  name: "Extra Cheese",
                  priceDelta: {
                    amount: 2,
                    currency: "EUR",
                  },
                },
                {
                  id: "extra-mushroom",
                  name: "Mushrooms",
                  priceDelta: {
                    amount: 1.5,
                    currency: "EUR",
                  },
                },
                {
                  id: "extra-olive",
                  name: "Olives",
                  priceDelta: {
                    amount: 1,
                    currency: "EUR",
                  },
                },
              ],
            },
          ],

          // اگر presentation مخصوص این category داشته باشیم
          // category آن را override می‌کند
        },
      ],

      presentation: menuPresentation,
    },
  ],
};

const page: Page = {
  id: "page-1",

  slug: "home",

  title: "Restaurant",

  status: "published",

  blocks: [
    {
      type: "hero",
      props: {
        title: "Welcome to our restaurant",

        subtitle: "Fresh food, made with love",
      },
    },

    {
      type: "menu",
      props: {
        menuId: menu.id,

        presentation: menuPresentation,
      },
    },

    {
      type: "promo",
      props: {
        title: "Today's Special",
        description: "Margherita Pizza + Drink for €16",
      },
    },

    {
      type: "restaurant-story",
      props: {
        title: "Our Story",
        content:
          "We started this restaurant with one goal: serving simple and delicious food.",
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Restaurant Digital Experience</h1>

      <pre className="overflow-auto rounded-lg bg-gray-100 p-6 text-sm">
        {JSON.stringify({ menu, page }, null, 2)}
      </pre>
    </main>
  );
}
