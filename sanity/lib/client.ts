import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// client used for preview, live content and updates draft content
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
