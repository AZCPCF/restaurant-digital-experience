export type MenuLayout = "list" | "grid" | "horizontal-scroll";

export type MenuCardVariant =
  "minimal" | "compact" | "classic" | "image" | "large-image" | "featured";

export type MenuPresentation = {
  layout: MenuLayout;

  card: MenuCardVariant;

  columns?: 1 | 2 | 3 | 4;

  showDescription?: boolean;
  showImage?: boolean;
  showPrice?: boolean;
};
