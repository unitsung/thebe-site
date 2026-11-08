import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parse } from "node-html-parser";

const releaseFile = (path) => new URL(`../dist/release/${path}`, import.meta.url);
const routes = ["", "app", "core", "privacy", "support", "security", "responsible-use"];

const pagePath = (route, locale) => {
  const parts = [locale === "en" ? "en" : "", route, "index.html"].filter(Boolean);
  return parts.join("/");
};

const readPage = async (route, locale) =>
  parse(await readFile(releaseFile(pagePath(route, locale)), "utf8"));

test("all required marketing routes are bilingual and declare reciprocal metadata", async () => {
  const titles = new Set();

  for (const route of routes) {
    for (const locale of ["zh", "en"]) {
      const root = await readPage(route, locale);
      const suffix = route ? `/${route}/` : "/";
      const canonical =
        locale === "zh"
          ? new URL(suffix, "https://thebe.cc/").href
          : new URL(`/en${suffix}`, "https://thebe.cc/").href;
      const counterpart =
        locale === "zh"
          ? new URL(`/en${suffix}`, "https://thebe.cc/").href
          : new URL(suffix, "https://thebe.cc/").href;

      assert.equal(root.querySelector("html")?.getAttribute("lang"), locale === "zh" ? "zh-Hans" : "en");

      const title = root.querySelector("title")?.textContent.trim();
      assert.ok(title, `${pagePath(route, locale)} has a title`);
      assert.equal(titles.has(title), false, `${pagePath(route, locale)} has a unique title`);
      titles.add(title);

      const canonicalLink = root.querySelector('link[rel="canonical"]');
      assert.equal(canonicalLink?.getAttribute("href"), canonical);

      const alternates = Object.fromEntries(
        root
          .querySelectorAll('link[rel="alternate"]')
          .map((link) => [link.getAttribute("hreflang"), link.getAttribute("href")]),
      );
      assert.equal(alternates[locale === "zh" ? "zh-Hans" : "en"], canonical);
      assert.equal(alternates[locale === "zh" ? "en" : "zh-Hans"], counterpart);
      assert.equal(alternates["x-default"], new URL(suffix, "https://thebe.cc/").href);

      const languageSwitch = root.querySelector(".locale-switch");
      assert.equal(languageSwitch?.getAttribute("href"), routeForSwitch(route, locale));
    }
  }
});

function routeForSwitch(route, locale) {
  const suffix = route ? `/${route}/` : "/";
  return locale === "zh" ? `/en${suffix}` : suffix;
}
