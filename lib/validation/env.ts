import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  SANITY_API_VERSION: z.string().min(1),
  SANITY_API_TOKEN: z.string().min(1),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SANITY_PROJECT_ID:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,

  NEXT_PUBLIC_SANITY_DATASET:
    process.env.NEXT_PUBLIC_SANITY_DATASET,

  SANITY_API_VERSION:
    process.env.SANITY_API_VERSION,

  SANITY_API_TOKEN:
    process.env.SANITY_API_TOKEN,
});