import { metadata, viewport } from "next-sanity/studio";
import Studio from "./studio";

export { metadata, viewport };
export const dynamic = "force-static";

export default function StudioPage() {
  return <Studio />;
}
