---
title: Quick start
description: Get Thebe Core running quickly using Docker containers.
---

# Quick start

The container is the supported runtime for Thebe Core. Both `linux/amd64` and `linux/arm64` architectures are supported.

## 1. Run using the published container image

We recommend using the official multi-architecture container image:

```bash
cd deploy
cp .env.example .env
docker compose up -d
```

Verify service status and health:

```bash
docker compose ps
TOKEN=$(sed -n 's/^THEBE_TOKEN=//p' .env)
curl -s -H "X-Thebe-Token: $TOKEN" http://127.0.0.1:8787/v1/health
```

## 2. Directory mount layout

The container publishes `127.0.0.1:8787` only and mounts two paths:

- `deploy/data` → `/data`: Persists `config.json`, Pi agent files, session metadata, and outputs.
- `$THEBE_WORKSPACE` → `/workspace`: The only directory tree the agent is allowed to access.

All durable state lives under `/data`. Backup, upgrade, and rollback all operate on this single directory.

## 3. Run from source (development)

To run outside Docker, use Node.js 24 LTS:

```bash
npm install
cp .env.example .env
THEBE_WORKSPACE_DIR=/srv/thebe-workspace npm run start:build
```

## 4. Next steps

Core does not bundle model credentials:
- Use `/settings` in the TUI to authenticate with a model provider.
- See the [Configuration guide](/configuration) to connect services like Emby, Jellyfin, Immich, or Navidrome.
- See [Deployment and recovery](/deployment) for production TLS and backup procedures.
