import { z } from "zod";

export const idSchema = z.string().min(1);

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export type Slug = z.infer<typeof slugSchema>;
