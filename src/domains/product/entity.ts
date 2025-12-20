import { z } from 'zod';

export const Product = z.strictObject({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  created_at: z.string(),
});

export type Product = z.infer<typeof Product>;
