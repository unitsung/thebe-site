import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(new URL("../marketing/package.json", import.meta.url));
const sharp = require("sharp");

const iconPath = fileURLToPath(new URL("../marketing/public/assets/thebe-app-icon.png", import.meta.url));
const outputPath = fileURLToPath(new URL("../marketing/public/assets/social-card.png", import.meta.url));

const iconBuffer = await readFile(iconPath);
const resizedIcon = await sharp(iconBuffer)
  .resize(160, 160)
  .toBuffer();

const svgOverlay = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a101d"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#070c16"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.05"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="200" cy="315" r="280" fill="url(#glow)"/>

  <text x="320" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="700" fill="#ffffff">Thebe</text>
  <text x="320" y="295" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', sans-serif" font-size="28" font-weight="500" fill="#e2e8f0">把分散的 NAS 与 homelab，变成一个可理解、可操作的系统。</text>
  <text x="320" y="345" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94a3b8">Native macOS App · Open Source Homelab Agent &amp; MCP Server</text>

  <rect x="320" y="390" width="140" height="34" rx="17" fill="#1e293b"/>
  <text x="390" y="413" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#38bdf8">APP &amp; CORE</text>

  <text x="1100" y="580" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="500" fill="#475569">thebe.cc</text>
</svg>
`;

await sharp(Buffer.from(svgOverlay))
  .composite([
    {
      input: resizedIcon,
      top: 235,
      left: 120,
    },
  ])
  .png()
  .toFile(outputPath);

console.log("Generated 1200x630 social card at", outputPath);
