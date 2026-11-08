import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../site.config.mjs";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const docContentDir = join(rootDir, "documentation", "content");
const authoredDir = join(rootDir, "documentation", "authored");
const docPublicDir = join(rootDir, "documentation", "public");
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

// 2. Quick start
const quickStartZh = `# 快速开始

容器是 Thebe Core 受支持的运行方式。支持 \`linux/amd64\` 与 \`linux/arm64\`。

## 1. 使用发布镜像运行

推荐使用官方发布的多架构容器镜像：

\`\`\`bash
cd deploy
cp .env.example .env
docker compose up -d
\`\`\`

检查运行状态与健康检查：

\`\`\`bash
docker compose ps
TOKEN=$(sed -n 's/^THEBE_TOKEN=//p' .env)
curl -s -H "X-Thebe-Token: $TOKEN" http://127.0.0.1:8787/v1/health
\`\`\`

## 2. 目录挂载约定

容器默认只监听 \`127.0.0.1:8787\`，并挂载两处目录：

- \`deploy/data\` → \`/data\`：持久化保存 \`config.json\`、Pi agent 文件、会话元数据与输出。
- \`$THEBE_WORKSPACE\` → \`/workspace\`：Agent 唯一被允许读写的工作区目录。

所有持久状态均位于 \`/data\`，备份、升级与回滚均围绕该目录进行。

## 3. 从源码启动（开发环境）

如果不使用 Docker，可在 Node.js 24 LTS 环境下直接运行：

\`\`\`bash
npm install
cp .env.example .env
THEBE_WORKSPACE_DIR=/srv/thebe-workspace npm run start:build
\`\`\`

## 4. 后续配置

Core 启动后不自带模型：
- 在终端交互界面使用 \`/settings\` 登录模型服务商。
- 参见[配置指南](/configuration)连接 Emby、Jellyfin、Immich、Navidrome 等服务。
- 参见[部署与恢复](/deployment)了解生产环境 TLS 与备份策略。
`;

const quickStartEn = `# Quick start

The container is the supported runtime for Thebe Core. Both \`linux/amd64\` and \`linux/arm64\` architectures are supported.

## 1. Run using the published container image

We recommend using the official multi-architecture container image:

\`\`\`bash
cd deploy
cp .env.example .env
docker compose up -d
\`\`\`

Verify service status and health:

\`\`\`bash
docker compose ps
TOKEN=$(sed -n 's/^THEBE_TOKEN=//p' .env)
curl -s -H "X-Thebe-Token: $TOKEN" http://127.0.0.1:8787/v1/health
\`\`\`

## 2. Directory mount layout

The container publishes \`127.0.0.1:8787\` only and mounts two paths:

- \`deploy/data\` → \`/data\`: Persists \`config.json\`, Pi agent files, session metadata, and outputs.
- \`$THEBE_WORKSPACE\` → \`/workspace\`: The only directory tree the agent is allowed to access.

All durable state lives under \`/data\`. Backup, upgrade, and rollback all operate on this single directory.

## 3. Run from source (development)

To run outside Docker, use Node.js 24 LTS:

\`\`\`bash
npm install
cp .env.example .env
THEBE_WORKSPACE_DIR=/srv/thebe-workspace npm run start:build
\`\`\`

## 4. Next steps

Core does not bundle model credentials:
- Use \`/settings\` in the TUI to authenticate with a model provider.
- See the [Configuration guide](/configuration) to connect services like Emby, Jellyfin, Immich, or Navidrome.
- See [Deployment and recovery](/deployment) for production TLS and backup procedures.
`;

await writeDoc(
  "zh",
  "quick-start.md",
  {
    title: "快速开始",
    description: "使用 Docker 容器快速启动 Thebe Core。",
  },
  quickStartZh,
);

await writeDoc(
  "en",
  "quick-start.md",
  {
    title: "Quick start",
    description: "Get Thebe Core running quickly using Docker containers.",
  },
  quickStartEn,
);

// 3. Configuration
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
const securityZh = `# 安全策略

## 受支持版本

开发在 \`dev\` 分支进行，正式发布切自 \`main\`。\`v0.1.0\` 是首个发布版本；仅最新发布版本与 \`dev\` 分支接收安全修复。升级到新版本时保留 \`/data\` 目录。

## 报告安全漏洞

请**不要**通过公开 Issue 报告安全漏洞。

请使用 GitHub 仓库的私密安全漏洞报告功能：打开 Core 仓库的 **Security** 标签页并选择 **Report a vulnerability**。或者发送邮件至 \`${siteConfig.contacts.security}\`。请附带你正在运行的 commit、详细描述及最小复现步骤。

## 部署安全模型

Thebe Core 专为在自有硬件上运行而设计：

- **Token 门禁**：\`NODE_ENV=production\` 下未提供 \`THEBE_TOKEN\` 时拒绝启动，除 \`/docs\` 与 \`/openapi.json\` 外的所有路由均需要通过 \`X-Thebe-Token\` 或 \`Authorization: Bearer\` 携带有效 Token。
- **默认监听回环**：受支持的容器仅发布 \`127.0.0.1:8787\`。如需非本机访问，请放置在 TLS 之后（Tailscale Serve / Funnel 或终止 TLS 的反向代理），并将公开域名加入 \`THEBE_ALLOWED_HOSTS\`。
- **严格工作区限制**：Agent 仅被允许读写挂载到 \`/workspace\` 的目录，不可穿越至宿主机或 \`/data\` 其它私密文件。
- **审批与审计**：破坏性操作（如写入、删除、重启容器）默认需要审批，所有工具调用均实时写入不可篡改的只追加审计日志。
`;

await writeDoc(
  "zh",
  "security.md",
  {
    title: "安全",
    description: "Thebe Core 的安全模型、Token 权限范围、隔离边界与漏洞报告渠道。",
  },
  securityZh,
);

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
