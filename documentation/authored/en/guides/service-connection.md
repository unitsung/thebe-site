---
title: Connect a service
description: Connect only the media, photo, music, file, download, and container services you control.
---

# Connect a service

Core registers a provider only when its required environment variables are complete and valid. If a required value is missing, the related capabilities do not appear in the tool list.

## Start with the boundary

Connect only services and accounts you control. Credentials stay inside the matching adapter and should never enter model arguments. Do not send host addresses, API keys, or session logs to a public issue.

## Start read-only

When connecting a service for the first time, expose read access first. Confirm the address, certificate, account, and response shape before enabling writes. An OpenAPI service can use `readOperations`, `excludeOperations`, and `excludeTags` to narrow its surface.

## Verify capability state

```bash
curl -s -H "X-Thebe-Token: $TOKEN" \
  http://127.0.0.1:8787/v1/capabilities
```

If a provider is absent, check the required environment variables first, then network access and credentials. See [configuration](/configuration) for exact names.

## Prefer a provider's MCP server

When a service already ships an MCP server, configure it instead of waiting for a new adapter. New servers start disabled; review their tools and permission before enabling one.

