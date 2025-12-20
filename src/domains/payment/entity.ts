import z from "zod";

export const Payment = z.strictObject({
    id: z.number(),
    status: z.string(),
    userId: z.number(),
    productId: z.number(),
    created_at: z.string(),
});

export type Payment = z.infer<typeof Payment>;
