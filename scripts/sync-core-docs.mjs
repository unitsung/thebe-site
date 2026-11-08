import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../site.config.mjs";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const docContentDir = join(rootDir, "documentation", "content");
const authoredDir = join(rootDir, "documentation", "authored");
const marketingPublicDir = join(rootDir, "marketing", "public");
const localCoreDir = fileURLToPath(new URL("../../core", import.meta.url));

const hasLocalCore = existsSync(localCoreDir) && existsSync(join(localCoreDir, "README.md"));

async function readCoreFile(relativePath) {
  if (hasLocalCore) {
    const localPath = join(localCoreDir, relativePath);
    if (existsSync(localPath)) {
      return await readFile(localPath, "utf8");
    }
  }

  const tag = siteConfig.coreDocsTag || "v0.1.0";
  const url = `https://raw.githubusercontent.com/unitsung/thebe-core/${tag}/${relativePath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}

function cleanMarkdown(content) {
  return content
    // Remove language switch lines at top
    .replace(/^\[English\]\([^)]+\)\s*(\|?\s*简体中文)?\n+/m, "")
    .replace(/^English\s*\|\s*\[简体中文\]\([^)]+\)\n+/m, "")
    .replace(/^\[简体中文\]\([^)]+\)\n+/m, "")
    // Rewrite internal doc links to VitePress routes
    .replaceAll("docs/DEPLOYMENT.md", "/deployment")
    .replaceAll("DEPLOYMENT.md", "/deployment")
    .replaceAll("docs/configuration.en.md", "/configuration")
    .replaceAll("docs/configuration.md", "/configuration")
    .replaceAll("configuration.en.md", "/configuration")
    .replaceAll("configuration.md", "/configuration")
    .replaceAll("docs/CORE-PRODUCT-HTTP.md", "/reference/http")
    .replaceAll("CORE-PRODUCT-HTTP.md", "/reference/http")
    .replaceAll("docs/PROVIDER-MCP.md", "/reference/provider-mcp")
    .replaceAll("PROVIDER-MCP.md", "/reference/provider-mcp")
    .replaceAll("SECURITY.md", "/security")
    .replaceAll("CHANGELOG.md", "/changelog")
    .replaceAll("README.zh-CN.md", "/")
    .replaceAll("README.md", "/");
}

async function writeDoc(locale, relativePath, frontmatter, body) {
  const targetPath = join(docContentDir, locale, relativePath);
  await mkdir(dirname(targetPath), { recursive: true });
  const header = [
    "---",
    `title: ${frontmatter.title}`,
    `description: ${frontmatter.description}`,
    "---",
    "",
  ].join("\n");
  await writeFile(targetPath, `${header}${cleanMarkdown(body).trim()}\n`, "utf8");
}

// Reset documentation content directories
await rm(docContentDir, { recursive: true, force: true });
await mkdir(join(docContentDir, "zh"), { recursive: true });
await mkdir(join(docContentDir, "en"), { recursive: true });

// Copy shared public assets to each documentation source directory
if (existsSync(join(marketingPublicDir, "assets"))) {
  for (const loc of ["zh", "en"]) {
    const targetPublic = join(docContentDir, loc, "public", "assets");
    await mkdir(targetPublic, { recursive: true });
    await cp(join(marketingPublicDir, "assets"), targetPublic, { recursive: true });
  }
}

// Copy authored guides & pages
if (existsSync(join(authoredDir, "zh"))) {
  await cp(join(authoredDir, "zh"), join(docContentDir, "zh"), { recursive: true });
}
if (existsSync(join(authoredDir, "en"))) {
  await cp(join(authoredDir, "en"), join(docContentDir, "en"), { recursive: true });
}

// Read Core documentation sources
const [
  readmeZh,
  readmeEn,
  configZh,
  configEn,
  deployment,
  security,
  httpRef,
  mcpRef,
  changelog,
] = await Promise.all([
  readCoreFile("README.zh-CN.md"),
  readCoreFile("README.md"),
  readCoreFile("docs/configuration.md"),
  readCoreFile("docs/configuration.en.md"),
  readCoreFile("docs/DEPLOYMENT.md"),
  readCoreFile("SECURITY.md"),
  readCoreFile("docs/CORE-PRODUCT-HTTP.md"),
  readCoreFile("docs/PROVIDER-MCP.md"),
  readCoreFile("CHANGELOG.md"),
]);

// 1. Root overview (index.md)
await writeDoc(
  "zh",
  "index.md",
  {
    title: "Core 概览",
    description: "带审批和审计日志的 homelab agent 服务端。",
  },
  readmeZh,
);

await writeDoc(
  "en",
  "index.md",
  {
    title: "Core overview",
    description: "A homelab agent server with approvals and an audit log.",
  },
  readmeEn,
);

// 2. Configuration
await writeDoc(
  "zh",
  "configuration.md",
  {
    title: "配置",
    description: "Thebe Core 的配置文件结构、模型连接、服务集成与权限控制。",
  },
  configZh,
);

await writeDoc(
  "en",
  "configuration.md",
  {
    title: "Configuration",
    description: "Thebe Core configuration structure, models, service integrations, and permissions.",
  },
  configEn,
);

// 4. Deployment
await writeDoc(
  "zh",
  "deployment.md",
  {
    title: "部署与恢复",
    description: "Thebe Core 容器部署形态、持久化存储、HTTPS/Tailscale、健康检查与升级回滚手册。",
  },
  deployment,
);

await writeDoc(
  "en",
  "deployment.md",
  {
    title: "Deployment and recovery",
    description: "Thebe Core container deployment, persistent data, HTTPS/Tailscale, health checks, and upgrade/rollback runbook.",
  },
  deployment,
);

// 5. Security
await writeDoc(
  "en",
  "security.md",
  {
    title: "Security",
    description: "Thebe Core security model, token scopes, isolation boundaries, and vulnerability reporting.",
  },
  security,
);

// 6. Reference: HTTP API
await writeDoc(
  "zh",
  "reference/http.md",
  {
    title: "产品 HTTP API",
    description: "Thebe Core 的 REST API 端点、会话、审批、审计与流式协议参考。",
  },
  httpRef,
);

await writeDoc(
  "en",
  "reference/http.md",
  {
    title: "Product HTTP API",
    description: "Thebe Core REST API endpoints, sessions, approvals, audit log, and stream protocols.",
  },
  httpRef,
);

// 7. Reference: Provider MCP
await writeDoc(
  "zh",
  "reference/provider-mcp.md",
  {
    title: "服务商 MCP 参考",
    description: "使用各服务自带的 MCP 服务器或通过 Thebe Core 代理与调用工具。",
  },
  mcpRef,
);

await writeDoc(
  "en",
  "reference/provider-mcp.md",
  {
    title: "Provider MCP reference",
    description: "Using upstream MCP servers or proxying through Thebe Core tools.",
  },
  mcpRef,
);

// 8. Changelog
await writeDoc(
  "zh",
  "changelog.md",
  {
    title: "变更记录",
    description: "Thebe Core 发布版本与更新日志。",
  },
  changelog,
);

await writeDoc(
  "en",
  "changelog.md",
  {
    title: "Changelog",
    description: "Release notes and version history for Thebe Core.",
  },
  changelog,
);

console.log("Core documentation synchronized successfully.");
