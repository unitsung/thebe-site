import http from "node:http";
import { execSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const releaseDir = join(rootDir, "dist", "release");

if (!existsSync(releaseDir) || !existsSync(join(releaseDir, "index.html"))) {
  console.log("Release artifact not found. Building release first...");
  execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
}

const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split("?")[0].split("#")[0];
  const cleanPath = urlPath.replace(/\/+$/, "");
  const rawPath = join(releaseDir, urlPath);
  const strippedPath = join(releaseDir, cleanPath);

  let target = null;
  if (existsSync(rawPath)) {
    const s = await stat(rawPath);
    if (s.isDirectory()) {
      const index = join(rawPath, "index.html");
      if (existsSync(index)) target = index;
    } else {
      target = rawPath;
    }
  }

  if (!target && existsSync(`${rawPath}.html`)) {
    target = `${rawPath}.html`;
  }
  if (!target && existsSync(`${strippedPath}.html`)) {
    target = `${strippedPath}.html`;
  }
  if (!target && existsSync(join(strippedPath, "index.html"))) {
    target = join(strippedPath, "index.html");
  }

  if (target) {
    const ext = extname(target);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(await readFile(target));
    return;
  }

  const notFound = join(releaseDir, "404.html");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(existsSync(notFound) ? await readFile(notFound) : "404 Not Found");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`
=== Thebe Bilingual Portal Preview Server ===

Listening at:
  Local:   http://localhost:${port}/
  Network: http://127.0.0.1:${port}/

Available routes:
  - 首页 (中文):        http://localhost:${port}/
  - Home (English):     http://localhost:${port}/en/
  - Thebe App (中文):   http://localhost:${port}/app/
  - Thebe App (English): http://localhost:${port}/en/app/
  - Thebe Core (中文):  http://localhost:${port}/core/
  - Thebe Core (English):http://localhost:${port}/en/core/
  - Core 文档 (中文):   http://localhost:${port}/core/docs/
  - Core Docs (English):http://localhost:${port}/en/core/docs/
  - 隐私政策:           http://localhost:${port}/privacy/
  - 支持与帮助:         http://localhost:${port}/support/
  - 404 测试页面:       http://localhost:${port}/not-found

Press Ctrl+C to stop.
`);
});
