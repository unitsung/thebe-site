---
title: 安全
description: Thebe Core 的安全模型、Token 权限范围、隔离边界与漏洞报告渠道。
---

# 安全策略

## 受支持版本

开发在 `dev` 分支进行，正式发布切自 `main`。`v0.1.0` 是首个发布版本；仅最新发布版本与 `dev` 分支接收安全修复。升级到新版本时保留 `/data` 目录。

## 报告安全漏洞

请**不要**通过公开 Issue 报告安全漏洞。

请使用 GitHub 仓库的私密安全漏洞报告功能：打开 Core 仓库的 **Security** 标签页并选择 **Report a vulnerability**。或者发送邮件至 security@thebe.cc。请附带你正在运行的 commit、详细描述及最小复现步骤。

## 部署安全模型

Thebe Core 专为在自有硬件上运行而设计：

- **Token 门禁**：`NODE_ENV=production` 下未提供 `THEBE_TOKEN` 时拒绝启动，除 `/docs` 与 `/openapi.json` 外的所有路由均需要通过 `X-Thebe-Token` 或 `Authorization: Bearer` 携带有效 Token。
- **默认监听回环**：受支持的容器仅发布 `127.0.0.1:8787`。如需非本机访问，请放置在 TLS 之后（Tailscale Serve / Funnel 或终止 TLS 的反向代理），并将公开域名加入 `THEBE_ALLOWED_HOSTS`。
- **严格工作区限制**：Agent 仅被允许读写挂载到 `/workspace` 的目录，不可穿越至宿主机或 `/data` 其它私密文件。
- **审批与审计**：破坏性操作（如写入、删除、重启容器）默认需要审批，所有工具调用均实时写入不可篡改的只追加审计日志。
