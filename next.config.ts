import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// The playground is fully interactive and reads the query string on most routes, so pages
// render on request rather than through Cache Components prerendering.
const nextConfig: NextConfig = {
  turbopack: {
    // kitgrid is linked from ../kitgridpackage, so the root must include that sibling folder.
    root: fileURLToPath(new URL("..", import.meta.url)),
  },
};

export default nextConfig;
