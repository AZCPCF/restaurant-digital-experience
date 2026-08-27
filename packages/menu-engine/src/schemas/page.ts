import { z } from "zod";

const imageSchema = z.object({
  url: z.url(),
  alt: z.string().optional(),
});

const heroBlockSchema = z.object({
  type: z.literal("hero"),

  props: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    image: imageSchema.optional(),
  }),
});

const menuBlockSchema = z.object({
  type: z.literal("menu"),

  props: z.object({
    menuId: z.string().min(1),

    presentation: z.object({
      layout: z.enum(["list", "grid", "horizontal-scroll"]),

      card: z.enum([
        "minimal",
        "compact",
        "classic",
        "image",
        "large-image",
        "featured",
      ]),

      columns: z
        .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
        .optional(),

      showDescription: z.boolean().optional(),
      showImage: z.boolean().optional(),
      showPrice: z.boolean().optional(),
    }),
  }),
});

const promoBlockSchema = z.object({
  type: z.literal("promo"),

  props: z.object({
    title: z.string().min(1),
    description: z.string().optional(),

    image: imageSchema.optional(),

    href: z.url().optional(),
  }),
});

const restaurantStoryBlockSchema = z.object({
  type: z.literal("restaurant-story"),

  props: z.object({
    title: z.string().optional(),
    content: z.string().min(1),
    image: imageSchema.optional(),
  }),
});

const galleryBlockSchema = z.object({
  type: z.literal("gallery"),

  props: z.object({
    title: z.string().optional(),

    images: z.array(imageSchema),
  }),
});

const openingHoursBlockSchema = z.object({
  type: z.literal("opening-hours"),

  props: z.object({
    title: z.string().optional(),
  }),
});

const socialLinksBlockSchema = z.object({
  type: z.literal("social-links"),

  props: z.object({
    title: z.string().optional(),

    links: z.array(
      z.object({
        platform: z.string().min(1),
        url: z.url(),
      }),
    ),
  }),
});

export const pageBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  menuBlockSchema,
  promoBlockSchema,
  restaurantStoryBlockSchema,
  galleryBlockSchema,
  openingHoursBlockSchema,
  socialLinksBlockSchema,
]);

export const pageSchema = z.object({
  id: z.string().min(1),

  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  title: z.string().min(1).max(200),

  blocks: z.array(pageBlockSchema),

  status: z.enum(["draft", "published"]),
});

export type PageSchema = z.infer<typeof pageSchema>;
export type PageBlockSchema = z.infer<typeof pageBlockSchema>;
