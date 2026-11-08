---
title: 故障排查
description: 按可观察症状定位 Thebe Core 的启动、连接、provider 与权限问题。
---

# 故障排查

先从健康检查、日志和当前能力清单开始。修改配置前记录正在使用的镜像标签与数据目录。

## Core 无法启动

- 生产环境必须提供 `THEBE_TOKEN`。
- `THEBE_WORKSPACE_DIR` 必须存在，并且是可访问的绝对路径或可解析路径。
- 查看容器日志中的第一处错误，不要只看末尾的重启循环。

## 请求返回 401

除 `/docs`、`/swagger` 和 `/openapi.json` 外，所有路由都需要 `X-Thebe-Token`。确认客户端发送的是当前 token，而不是已经轮换的旧值。

## 外部反向代理写入返回 403

Core 会检查 Host。把公开反向代理主机名加入 `THEBE_ALLOWED_HOSTS`；不要用 `*` 代替明确的配置。

## provider 没有出现

检查该服务的必填环境变量、网络、证书和账号权限。能力目录只注册完整配置的 provider。运行：

```bash
curl -s -H "X-Thebe-Token: $TOKEN" \
  http://127.0.0.1:8787/v1/capabilities
```

## /mcp 写操作被拒绝

检查 `THEBE_MCP_WRITES`。设置为 `off` 时，服务商 MCP 写工具、容器重启和歌单写操作都会被拒绝。

## 升级后状态异常

停止写入，保留整个数据目录，切换回上一个镜像标签。不要把恢复过程建立在重新初始化配置上。

