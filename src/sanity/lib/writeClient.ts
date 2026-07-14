import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Write client — uses a Sanity **write token** (server-only). Never exposed
// to the browser. Falls back to the read-only client shape if no token is set
// (the analyzer will then skip writes and we rely on stored data).
const token = process.env.SANITY_WRITE_TOKEN;

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  ...(token ? { token, withCredentials: false } : {}),
});

export const hasWriteAccess = Boolean(token);
