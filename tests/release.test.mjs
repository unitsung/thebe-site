import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const releaseFile = (path) => new URL(`../dist/release/${path}`, import.meta.url);

test("release exposes paired Chinese and English home pages", async () => {
  const chinese = await readFile(releaseFile("index.html"), "utf8");
  const english = await readFile(releaseFile("en/index.html"), "utf8");

  assert.match(chinese, /<html[^>]+lang="zh-Hans"/);
  assert.match(chinese, /把分散的 NAS 与 homelab，变成一个可理解、可操作的系统。/);
  assert.match(english, /<html[^>]+lang="en"/);
  assert.match(english, /Turn a scattered NAS and homelab into one understandable, operable system\./);
});
