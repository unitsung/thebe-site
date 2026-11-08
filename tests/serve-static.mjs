import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const releaseDir = join(rootDir, "dist", "release");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split("?")[0].split("#")[0];
  const rawPath = join(releaseDir, urlPath);

  let target = null;
  if (existsSync(rawPath)) {
    const s = await stat(rawPath);
    if (s.isDirectory()) {
      const index = join(rawPath, "index.html");
      if (existsSync(index)) target = index;
    } else {
      target = rawPath;
    }
  } else {
    const htmlPath = `${rawPath}.html`;
    if (existsSync(htmlPath)) target = htmlPath;
  }

  if (target) {
    const ext = extname(target);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(await readFile(target));
    return;
  }

  // 404 fallback
  const notFound = join(releaseDir, "404.html");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(existsSync(notFound) ? await readFile(notFound) : "404 Not Found");
});

server.listen(4173, "127.0.0.1", () => {
  console.log("Static release server listening on http://127.0.0.1:4173");
});
