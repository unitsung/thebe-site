import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
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

async function fixHtmlNavLinks(dir, locale) {
  try {
    const entries = await readdir(dir, { withFileTypes: true, recursive: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".html")) {
        const fullPath = join(entry.parentPath || dir, entry.name);
        let html = await readFile(fullPath, "utf8");
        if (locale === "zh") {
          html = html
            .replaceAll(`href="/core/docs/app/"`, `href="/app/"`)
            .replaceAll(`href="/core/docs/core/"`, `href="/core/"`)
            .replaceAll(`href="/core/docs/en/"`, `href="/en/"`)
            .replaceAll(`href="/core/docs/en/core/docs/"`, `href="/en/core/docs/"`)
            .replace(/(<a[^>]*class="[^"]*VPNavBarMenuLink[^"]*"[^>]*href=")\/core\/docs\/("[^>]*><span[^>]*>Thebe<\/span><\/a>)/g, `$1/$2`);
        } else {
          html = html
            .replaceAll(`href="/en/core/docs/en/app/"`, `href="/en/app/"`)
            .replaceAll(`href="/en/core/docs/app/"`, `href="/en/app/"`)
            .replaceAll(`href="/en/core/docs/en/core/"`, `href="/en/core/"`)
            .replaceAll(`href="/en/core/docs/core/"`, `href="/en/core/"`)
            .replaceAll(`href="/en/core/docs/en/"`, `href="/en/"`)
            .replaceAll(`href="/en/core/docs/core/docs/"`, `href="/core/docs/"`)
            .replace(/(<a[^>]*class="[^"]*VPNavBarMenuLink[^"]*"[^>]*href=")\/en\/core\/docs\/("[^>]*><span[^>]*>Thebe<\/span><\/a>)/g, `$1/en/$2`)
            .replace(/(<a[^>]*class="[^"]*VPNavBarMenuLink[^"]*"[^>]*href=")\/en\/core\/docs\/en\/("[^>]*><span[^>]*>Thebe<\/span><\/a>)/g, `$1/en/$2`);
        }
        await writeFile(fullPath, html, "utf8");
      }
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

if (docsZhPresent) {
  await fixHtmlNavLinks(fileURLToPath(targetZh), "zh");
}
if (docsEnPresent) {
  await fixHtmlNavLinks(fileURLToPath(targetEn), "en");
}

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${siteConfig.origin}/sitemap-0.xml</loc></sitemap>
  <sitemap><loc>${siteConfig.origin}/core/docs/sitemap.xml</loc></sitemap>
  <sitemap><loc>${siteConfig.origin}/en/core/docs/sitemap.xml</loc></sitemap>
</sitemapindex>
`;
await writeFile(new URL("sitemap-index.xml", release), sitemapIndex.trim() + "\n", "utf8");
