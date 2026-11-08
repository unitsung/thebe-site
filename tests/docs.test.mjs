import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { parse } from "node-html-parser";

const releaseRoot = new URL("../dist/release/", import.meta.url);

const docsPage = async (route, locale) => {
  const base = locale === "zh" ? "core/docs" : "en/core/docs";
  const relative = route.replace(/^\/+|\/+$/g, "");
  const directory = new URL(`${base}/${relative ? `${relative}/` : ""}`, releaseRoot);
  const fileCandidates = [
    new URL("index.html", directory),
    relative ? new URL(`${relative}.html`, new URL(`${base}/`, releaseRoot)) : null,
  ].filter(Boolean);

  for (const candidate of fileCandidates) {
    try {
      await access(candidate);
      return { html: await readFile(candidate, "utf8"), path: candidate.pathname };
    } catch {
      // Try the next VitePress clean-URL output shape.
    }
  }

  assert.fail(`Missing ${locale} documentation page: ${route}`);
};

test("Core documentation is paired under the required locale roots", async () => {
  for (const route of ["", "quick-start", "configuration", "deployment", "security", "troubleshooting"]) {
    const chinese = await docsPage(route, "zh");
    const english = await docsPage(route, "en");
    const zhRoot = parse(chinese.html);
    const enRoot = parse(english.html);

    assert.equal(zhRoot.querySelector("html")?.getAttribute("lang"), "zh-CN");
    assert.equal(enRoot.querySelector("html")?.getAttribute("lang"), "en-US");
    assert.match(zhRoot.textContent, /Thebe Core/);
    assert.match(enRoot.textContent, /Thebe Core/);

    const canonical = enRoot.querySelector('link[rel="canonical"]')?.getAttribute("href");
    assert.ok(canonical?.startsWith("https://thebe.cc/en/core/docs/"));
    assert.equal(canonical?.endsWith(".html"), false);
  }
});
