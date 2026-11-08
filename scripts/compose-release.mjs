import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../site.config.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const release = new URL("../dist/release/", import.meta.url);
const marketing = new URL("../marketing/dist/", import.meta.url);
const docsZh = new URL("../documentation/dist/zh/", import.meta.url);
const docsEn = new URL("../documentation/dist/en/", import.meta.url);

await rm(release, { recursive: true, force: true });
await mkdir(release, { recursive: true });
await cp(marketing, release, { recursive: true });

const targetZh = new URL("core/docs/", release);
const targetEn = new URL("en/core/docs/", release);

let docsZhPresent = false;
let docsEnPresent = false;

try {
  await cp(docsZh, targetZh, { recursive: true, force: true, errorOnExist: false });
  docsZhPresent = true;
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

try {
  await cp(docsEn, targetEn, { recursive: true, force: true, errorOnExist: false });
  docsEnPresent = true;
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

if (!docsZhPresent || !docsEnPresent) {
  // The first vertical slice only requires the marketing artifact.
  console.warn(`Release composed without complete documentation output in ${root}.`);
}

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${siteConfig.origin}/sitemap-0.xml</loc></sitemap>
  <sitemap><loc>${siteConfig.origin}/core/docs/sitemap.xml</loc></sitemap>
  <sitemap><loc>${siteConfig.origin}/en/core/docs/sitemap.xml</loc></sitemap>
</sitemapindex>
`;
await writeFile(new URL("sitemap-index.xml", release), sitemapIndex.trim() + "\n", "utf8");
