import type { MenuId } from "../menu/types";
import type { MenuPresentation } from "../presentation/types";

export type HeroBlock = {
  type: "hero";

  props: {
    title: string;
    subtitle?: string;

    image?: {
      url: string;
      alt?: string;
    };
  };
};

export type MenuBlock = {
  type: "menu";

  props: {
    menuId: MenuId;
    presentation: MenuPresentation;
  };
};

export type PromoBlock = {
  type: "promo";

  props: {
    title: string;
    description?: string;

    image?: {
      url: string;
      alt?: string;
    };

    href?: string;
  };
};

export type RestaurantStoryBlock = {
  type: "restaurant-story";

  props: {
    title?: string;
    content: string;
    image?: {
      url: string;
      alt?: string;
    };
  };
};

export type GalleryBlock = {
  type: "gallery";

  props: {
    title?: string;

    images: Array<{
      url: string;
      alt?: string;
    }>;
  };
};

export type OpeningHoursBlock = {
  type: "opening-hours";

  props: {
    title?: string;
  };
};

export type SocialLinksBlock = {
  type: "social-links";

  props: {
    title?: string;

    links: Array<{
      platform: string;
      url: string;
    }>;
  };
};

export type PageBlock =
  | HeroBlock
  | MenuBlock
  | PromoBlock
  | RestaurantStoryBlock
  | GalleryBlock
  | OpeningHoursBlock
  | SocialLinksBlock;
