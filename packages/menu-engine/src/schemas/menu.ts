import { z } from "zod";
import { imageReferenceSchema, moneySchema } from "./common";

const modifierChoiceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  priceDelta: moneySchema.optional(),
});

const modifierGroupSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),

    required: z.boolean(),

    minSelections: z.number().int().min(0),
    maxSelections: z.number().int().min(0),

    defaultSelectionIds: z.array(z.string()),

    choices: z.array(modifierChoiceSchema),
  })
  .superRefine((group, ctx) => {
    if (group.maxSelections < group.minSelections) {
      ctx.addIssue({
        code: "custom",
        path: ["maxSelections"],
        message: "maxSelections must be >= minSelections",
      });
    }

    if (group.maxSelections > group.choices.length) {
      ctx.addIssue({
        code: "custom",
        path: ["maxSelections"],
        message: "maxSelections cannot exceed choices count",
      });
    }

    const choiceIds = new Set(group.choices.map((choice) => choice.id));

    for (const id of group.defaultSelectionIds) {
      if (!choiceIds.has(id)) {
        ctx.addIssue({
          code: "custom",
          path: ["defaultSelectionIds"],
          message: `Unknown default selection: ${id}`,
        });
      }
    }

    if (group.defaultSelectionIds.length > group.maxSelections) {
      ctx.addIssue({
        code: "custom",
        path: ["defaultSelectionIds"],
        message: "Too many default selections",
      });
    }

    if (
      group.required &&
      group.defaultSelectionIds.length < group.minSelections
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["defaultSelectionIds"],
        message: "Required modifier group does not have enough defaults",
      });
    }
  });

export const menuItemSchema = z.object({
  id: z.string().min(1),

  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),

  price: moneySchema,

  image: imageReferenceSchema.optional(),

  available: z.boolean(),

  tags: z.array(z.string().min(1)),

  modifierGroups: z.array(modifierGroupSchema),
});

export const menuPresentationSchema = z.object({
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
});

export const menuCategorySchema = z.object({
  id: z.string().min(1),

  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),

  image: imageReferenceSchema.optional(),

  items: z.array(menuItemSchema),

  presentation: menuPresentationSchema.optional(),
});

export const menuSchema = z.object({
  id: z.string().min(1),

  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),

  categories: z.array(menuCategorySchema),

  status: z.enum(["draft", "published"]),
});

export type MenuSchema = z.infer<typeof menuSchema>;
export type MenuItemSchema = z.infer<typeof menuItemSchema>;
