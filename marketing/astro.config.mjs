import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { siteConfig } from "../site.config.mjs";

export default defineConfig({
  site: siteConfig.origin,
  trailingSlash: "always",
  output: "static",
  build: {
    format: "directory",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404/"),
    }),
  ],
});

