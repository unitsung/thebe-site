---
title: 产品 HTTP API
description: Thebe Core 的 REST API 端点、会话、审批、审计与流式协议参考。
---

# Core 产品 HTTP API

Thebe Core 提供一套结构化的 HTTP REST API，用于管理会话、调度目标、审批敏感操作以及查询审计日志。

所有 `/v1` 路由均受 Token 保护；交互式 OpenAPI 文档可在运行实例的 `/docs` 查看，原始规范位于 `/openapi.json`。

## 鉴权与安全标头

除健康检查及文档规范外，所有请求必须携带有效访问凭据：

```http
X-Thebe-Token: <THEBE_TOKEN>
```

或使用标准的 Bearer 格式：

```http
Authorization: Bearer <THEBE_TOKEN>
```

## 端点概览

### 1. 系统与能力

| 方法与路径 | 说明 | 鉴权要求 |
| :--- | :--- | :--- |
| `GET /v1/health` | 检查进程运行状态与基础健康指标。 | 需要 Token |
| `GET /v1/capabilities` | 获取当前已连接的服务清单、已注册工具与集成健康状态。 | 需要 Token |
| `GET /docs` | Swagger UI 交互式 API 文档。 | 无需鉴权 |
| `GET /openapi.json` | 原始 OpenAPI 3.1 格式规范。 | 无需鉴权 |

### 2. 会话管理 (`/v1/sessions`)

- **`POST /v1/sessions`**：创建一个新的 Agent 会话，可指定工作区、角色预设与模型配置。
- **`GET /v1/sessions`**：列出活跃及归档的会话元数据。
- **`GET /v1/sessions/:id`**：获取指定会话的详情及当前状态。
- **`DELETE /v1/sessions/:id`**：销毁会话并清理临时执行状态。
- **`POST /v1/sessions/:id/messages`**：向会话发送用户消息。支持 Server-Sent Events (SSE) 流式返回 Agent 的思考过程与工具调用事件。

### 3. 权限与审批 (`/v1/approvals`)

Core 的核心原则是**敏感写操作必须人工确认**：

- **`GET /v1/approvals`**：查询当前等待用户批准的高风险操作（例如：重启 Docker 容器、修改重要文件、下载媒体资源等）。
- **`POST /v1/approvals/:id/approve`**：批准指定操作，解除挂起并由 Agent 继续执行。
- **`POST /v1/approvals/:id/reject`**：拒绝操作并向 Agent 返回原因说明。

### 4. 目标与计划 (`/v1/goals` & `/v1/schedules`)

- **`POST /v1/goals`**：提交长时间运行的自主任务（例如全库媒体元数据刮削、下载队列自动分拣等）。
- **`GET /v1/goals/:id`**：轮询目标完成进度与子任务执行树。
- **`POST /v1/schedules`**：创建周期性定时任务。

### 5. 审计日志 (`/v1/audit`)

- **`GET /v1/audit`**：查询结构化的只追加审计记录。包含每次工具调用的时间戳、执行方、入参摘要、审批记录及执行结果哈希。

### 6. MCP 端点 (`/mcp`)

Core 同时作为标准的 MCP（Model Context Protocol）服务器：

- **`POST /mcp`**：无状态 JSON-RPC 2.0 端点。支持 `tools/list` 与 `tools/call`，允许 Claude Code、Codex 或任何 MCP 客户端直接挂载 Core 的能力。
