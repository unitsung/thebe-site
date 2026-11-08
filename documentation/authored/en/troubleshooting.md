---
title: Troubleshooting
description: Diagnose Thebe Core startup, connection, provider, and permission problems by symptom.
---

# Troubleshooting

Start with health, logs, and the current capability list. Before changing configuration, record the running image tag and data directory.

## Core will not start

- `THEBE_TOKEN` is required in production.
- `THEBE_WORKSPACE_DIR` must exist and resolve to an accessible path.
- Read the first error in the container log instead of only the final restart-loop message.

## A request returns 401

Every route except `/docs`, `/swagger`, and `/openapi.json` requires `X-Thebe-Token`. Confirm the client is sending the current token rather than a value from before a rotation.

## A write through an external reverse proxy returns 403

Core checks the Host header. Add the public reverse-proxy hostname to `THEBE_ALLOWED_HOSTS`; do not replace explicit configuration with `*`.

## A provider does not appear

Check that service's required environment variables, network, certificate, and account permissions. Core registers only complete provider configurations. Run:

```bash
curl -s -H "X-Thebe-Token: $TOKEN" \
  http://127.0.0.1:8787/v1/capabilities
```

## /mcp rejects a write

Check `THEBE_MCP_WRITES`. When it is `off`, provider MCP write tools, container restarts, and playlist writes are refused.

## State looks wrong after an upgrade

Stop writes, preserve the complete data directory, and switch back to the previous image tag. Do not make recovery depend on reinitializing configuration.

