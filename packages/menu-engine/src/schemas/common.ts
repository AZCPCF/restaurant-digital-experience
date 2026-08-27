import { z } from "zod";

export const moneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
});

export const imageReferenceSchema = z.object({
  url: z.url(),
  alt: z.string().optional(),
});

export const publicationStatusSchema = z.enum(["draft", "published"]);
