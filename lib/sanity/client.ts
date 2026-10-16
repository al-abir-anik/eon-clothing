import { createClient } from "next-sanity";
import { env } from "@/lib/validation/env";

export const sanityClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.SANITY_API_VERSION,
  useCdn: true,
});