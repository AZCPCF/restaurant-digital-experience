export type MenuItemId = string;
export type MenuCategoryId = string;
export type MenuId = string;

export type PublicationStatus = "draft" | "published";

export type Money = {
  amount: number;
  currency: string;
};

export type ImageReference = {
  url: string;
  alt?: string;
};

export type MenuItemModifierChoice = {
  id: string;
  name: string;
  priceDelta?: Money;
};

export type MenuItemModifierGroup = {
  id: string;
  name: string;

  required: boolean;

  minSelections: number;
  maxSelections: number;

  defaultSelectionIds: string[];

  choices: MenuItemModifierChoice[];
};

export type MenuItem = {
  id: MenuItemId;

  name: string;
  description?: string;

  price: Money;

  image?: ImageReference;

  available: boolean;

  tags: string[];

  modifierGroups: MenuItemModifierGroup[];
};

export type MenuCategory = {
  id: MenuCategoryId;

  name: string;
  description?: string;

  image?: ImageReference;

  items: MenuItem[];

  presentation?: {
    layout: "list" | "grid" | "horizontal-scroll";
    card:
      "minimal" | "compact" | "classic" | "image" | "large-image" | "featured";
    columns?: 1 | 2 | 3 | 4;
    showDescription?: boolean;
    showImage?: boolean;
    showPrice?: boolean;
  };
};

export type Menu = {
  id: MenuId;

  name: string;
  description?: string;

  categories: MenuCategory[];

  status: PublicationStatus;
};
