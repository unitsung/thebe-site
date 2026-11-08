---
title: Configure permissions
description: Core token, workspace, approval, permission-mode, and MCP write boundaries.
---

# Configure permissions

Thebe Core separates what can be accessed from whether this specific action should run. Set both boundaries before deployment.

## Workspace

`THEBE_WORKSPACE_DIR` is the root the agent may read and write without repeatedly asking. Core does not treat the startup directory as a workspace. Do not point it at the host root, an entire home directory, or unrelated credentials.

## Token

Give each client its own token so a lost device can be revoked independently. Tokens have full API access and no built-in scope: anyone holding one can read audit data, change settings, and invoke permitted tools.

## Approval

The default permission mode is `manual`. Free-form model text is not execution authorization. A risky action should appear as a concrete change and wait for confirmation.

`bypassPermissions` removes the command guard, sandbox, and approval for a session. Use it only for a short-lived session you explicitly control.

## MCP writes

An agent connected over `/mcp` is responsible for asking its own user. Core does not open an internal approval prompt on that path. Make it read-only when needed:

```bash
THEBE_MCP_WRITES=off
```

Every write is audited regardless of the switch.

