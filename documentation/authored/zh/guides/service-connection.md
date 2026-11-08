---
title: 连接服务
description: 只连接你控制的媒体、照片、音乐、文件、下载与容器服务。
---

# 连接服务

Core 只注册环境变量完整且有效的 provider。缺少必填项时，对应能力不会出现在工具目录里。

## 先确认边界

只连接你自己的服务与账号。凭据留在对应的 Adapter 中，不应进入模型参数。不要把主机地址、API 密钥或会话日志发送到公开 issue。

## 从只读开始

第一次连接服务时先只开放读权限，确认地址、证书、账号和返回结构正确，再考虑写操作。OpenAPI 服务可以通过 `readOperations`、`excludeOperations` 和 `excludeTags` 收窄暴露面。

## 验证状态

```bash
curl -s -H "X-Thebe-Token: $TOKEN" \
  http://127.0.0.1:8787/v1/capabilities
```

如果 provider 没有出现，先检查必填环境变量，再检查网络和凭据。具体变量见[配置](/configuration)。

## 使用 Provider 自带 MCP

已有 MCP 实现的服务优先配置 Provider MCP，而不是等待新 Adapter。新服务器默认禁用；审查工具和权限后再启用。

