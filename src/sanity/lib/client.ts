import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Read client used by server components.
// Anonymous API reads are NOT working in this project despite the dataset
// being labeled "Public" (both anon API + CDN return 0; tokened reads
// return 15). So we read via the authenticated API using a token.
// IMPORTANT: this uses the READ-ONLY (Viewer) token only — never the
// Editor write token — so a leak of the read path can't mutate content.
const readToken = process.env.SANITY_READ_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: readToken,
});
