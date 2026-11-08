---
title: 变更记录
description: Thebe Core 发布版本与更新日志。
---

# 变更记录

本页面记录 Thebe Core 各版本的更新与主要特性。

## [0.1.0] - 2026-11-06

这是 Thebe Core 的首个公开发布版本（Preview）。

### 新特性与核心能力

- **单容器部署形态**：支持 `linux/amd64` 与 `linux/arm64`，持久化数据与工作区严格隔离挂载。
- **MCP 服务器能力**：提供无状态 `/mcp` 端点，支持 Claude Code、Codex、OpenCode 等主流 Agent 客户端连接调用。
- **上游 MCP 扩展**：支持动态挂载第三方官方 MCP 服务器（如 Home Assistant、Docker、Grafana 等）。
- **内置服务适配器**：
  - 影视：Emby、Jellyfin 资料检索。
  - 照片：Immich 自然语言画面搜索。
  - 音乐：Navidrome 资料库与播放列表整理。
  - 下载：qBittorrent、aria2 状态监控。
  - 聚合：Prowlarr 搜索整合。
- **审批与安全防线**：
  - 破坏性写操作默认审批门禁机制。
  - 只追加结构化审计日志 (`audit.jsonl`)。
  - 本地回环绑定与 Host 标头安全白名单。
  - 敏感 Token 与凭据脱敏防护。
- **交互界面与 CLI**：
  - 内嵌基于 Pi 运行时的终端 TUI 界面。
  - 提供命令行单次任务执行支持 (`thebe -p`)。
  - Swagger UI 交互式 API 文档位于 `/docs`。
