---
title: Deploy on a NAS
description: Deploy Thebe Core as one container on a NAS while preserving durable state.
---

# Deploy on a NAS

The supported release shape for Thebe Core v0.1.0 is one container. Keep durable state in one directory and limit the files the agent may touch to a separate workspace.

## What you need

- Docker Engine and Compose v2.
- One durable data directory for configuration, session metadata, output, and audit records.
- One separate workspace containing only files you permit the agent to read or edit.
- A protected management path, such as Tailscale, an SSH tunnel, or a TLS-terminating reverse proxy.

## Use the published image

```bash
docker pull ghcr.io/unitsung/thebe-core:0.1.0
```

Pin the same version tag in `deploy/.env`; `latest` is not a rollback reference. Keep the workspace and data directories on the same host.

## Ownership

The container runs as uid/gid `1000`. On a Linux NAS, give the workspace to that user. If the filesystem cannot preserve ownership, use a Docker named volume or run the container with an explicit host uid.

## Network

The default publishes `127.0.0.1:8787` only. Do not change that to public `0.0.0.0` just to get started. Use Tailscale, an SSH tunnel, or a reverse proxy for remote access and add the public hostname to `THEBE_ALLOWED_HOSTS`.

## Backup

Stop the container before a backup and copy the entire data directory. Restore with the same layout. If an upgrade fails, switch back to the previous image tag while keeping the same data directory.

See the complete [deployment and recovery runbook](/deployment).

