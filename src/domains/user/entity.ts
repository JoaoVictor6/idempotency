import z from "zod";

export const User = z.strictObject({
  id: z.number(),
  username: z.string()
})

export type User = z.infer<typeof User>;
