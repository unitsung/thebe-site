---
title: 服务商 MCP 参考
description: 使用各服务自带的 MCP 服务器或通过 Thebe Core 代理与调用工具。
---

# 服务商 MCP 参考

Thebe Core 的设计原则之一是**优先复用服务商官方或社区已有的标准 MCP 服务器**。对于自身提供 MCP 接口的服务，Core 可以直接作为客户端接入，避免重复开发专用适配器。

## 官方 MCP 支持现状

| 服务名称 | 官方 MCP 方案 | 传输方式 | 在 Core 中挂载命令示例 | 验证状态 |
| :--- | :--- | :--- | :--- | :--- |
| **Home Assistant** | 官方集成 (HA 2025.2+) | Streamable HTTP (`/api/mcp`) | `thebe mcp add homeassistant --url http://ha.local:8123/api/mcp --header "Authorization: Bearer <TOKEN>"` | 官方文档验证 |
| **Grafana** | `grafana/mcp-grafana` | stdio (`uvx mcp-grafana`) / Docker | `thebe mcp add grafana --command uvx --arg mcp-grafana --env GRAFANA_URL=...` | 仓库实测 |
| **Docker** | Docker MCP Toolkit | HTTP / Gateway | `thebe mcp add docker --url http://127.0.0.1:8080/mcp` | 官方文档验证 |
| **PostgreSQL** | `@modelcontextprotocol/server-postgres` | stdio (`npx`) | `thebe mcp add postgres --command npx --arg -y --arg @modelcontextprotocol/server-postgres --arg <CONNECTION_URL>` | SDK 验证 |
| **SQLite** | `mcp/sqlite` | stdio (`uvx`) | `thebe mcp add sqlite --command uvx --arg mcp-server-sqlite --arg --db-path --arg /data/db.sqlite` | 官方实测 |

## Core 内置集成（无原生 MCP 的服务）

对于未提供原生 MCP 的 homelab 服务，Thebe Core 提供经过安全隔离与审批包裹的内置集成：

- **影视媒体**：Emby、Jellyfin（按标题、演职员检索，读取资料库）
- **相册管理**：Immich（按画面自然语言语义搜索照片、人脸相册）
- **音乐服务**：Navidrome（专辑、艺术家检索与播放队列整理）
- **下载工具**：qBittorrent、aria2（状态监测、任务暂停/恢复）
- **索引聚合**：Prowlarr（搜索索引）

## 权限提示与执行安全

通过上游 MCP 引入的所有工具，Core 都会自动读取其附带的元数据提示：

- **`readOnlyHint: true`**：只读工具，Agent 可以直接调用并获取结果。
- **`destructiveHint: true`**：具有潜在风险的写操作，系统将自动挂起并向用户发起审批请求，获得许可后才允许实际执行。

所有通过 MCP 进行的操作均会被实时完整记录在追加式审计日志中。
