---
title: 快速开始
description: 使用 Docker 容器快速启动 Thebe Core。
---

# 快速开始

容器是 Thebe Core 受支持的运行方式。支持 `linux/amd64` 与 `linux/arm64`。

## 1. 使用发布镜像运行

推荐使用官方发布的多架构容器镜像：

```bash
cd deploy
cp .env.example .env
docker compose up -d
```

检查运行状态与健康检查：

```bash
docker compose ps
TOKEN=$(sed -n 's/^THEBE_TOKEN=//p' .env)
curl -s -H "X-Thebe-Token: $TOKEN" http://127.0.0.1:8787/v1/health
```

## 2. 目录挂载约定

容器默认只监听 `127.0.0.1:8787`，并挂载两处目录：

- `deploy/data` → `/data`：持久化保存 `config.json`、Pi agent 文件、会话元数据与输出。
- `$THEBE_WORKSPACE` → `/workspace`：Agent 唯一被允许读写的工作区目录。

所有持久状态均位于 `/data`，备份、升级与回滚均围绕该目录进行。

## 3. 从源码启动（开发环境）

如果不使用 Docker，可在 Node.js 24 LTS 环境下直接运行：

```bash
npm install
cp .env.example .env
THEBE_WORKSPACE_DIR=/srv/thebe-workspace npm run start:build
```

## 4. 后续配置

Core 启动后不自带模型：
- 在终端交互界面使用 `/settings` 登录模型服务商。
- 参见[配置指南](/configuration)连接 Emby、Jellyfin、Immich、Navidrome 等服务。
- 参见[部署与恢复](/deployment)了解生产环境 TLS 与备份策略。
