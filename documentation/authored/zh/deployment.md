---
title: 部署与恢复
description: Thebe Core 容器部署形态、持久化存储、HTTPS/Tailscale、健康检查与升级回滚手册。
---

# Core 部署与运维手册

受支持形态：**单容器运行**。Core 运行于容器内部，所有持久化状态挂载至宿主机的独立数据目录。

## 1. 快速启动（容器）

```bash
cd deploy
cp .env.example .env
# 编辑 .env 设置你的 THEBE_TOKEN，或留空由 Core 首次启动时自动生成
docker compose up -d --build
docker compose ps                                   # 观察健康状态：starting → healthy
TOKEN=$(sed -n 's/^THEBE_TOKEN=//p' .env)           # 若由 Core 生成，请在日志中查看
curl -s -H "X-Thebe-Token: $TOKEN" http://127.0.0.1:8787/v1/health
```

容器默认仅发布 `127.0.0.1:8787`，并挂载以下目录：

```text
deploy/data      → /data      配置、Pi agent 数据、会话元数据、输出物
$THEBE_WORKSPACE → /workspace Agent 唯一允许读写的文件树
```

所有持久化数据均位于 `/data`，备份、升级与回滚均围绕该目录进行。

### 1.1 使用官方发布镜像

CI 会自动构建多架构镜像（`linux/amd64` 与 `linux/arm64`）并发布至 GitHub Container Registry：

```bash
docker pull ghcr.io/unitsung/thebe-core:0.1.0
```

在 `deploy/.env` 中将 `THEBE_IMAGE` 指定为固定标签版本，**切勿在生产环境使用 `latest`**。

## 2. 生产环境变量

| 变量名 | 说明 | 默认值 / 示例 |
| :--- | :--- | :--- |
| `NODE_ENV` | 运行环境。设为 `production` 时未指定 token 将拒绝启动。 | `production` |
| `THEBE_TOKEN` | 核心访问凭据。未指定时将在启动日志中打印随机生成的 32 字节十六进制串。 | 随机值 |
| `THEBE_PORT` | 服务监听端口。 | `8787` |
| `THEBE_HOST` | 监听地址。容器内部绑定 `0.0.0.0`，宿主机发布绑定 `127.0.0.1`。 | `127.0.0.1` |
| `THEBE_ALLOWED_HOSTS` | 允许访问的 Host 标头白名单，以逗号分隔。localhost、局域网 IP 与 Tailscale 域名默认自动放行。 | `core.example.com` |
| `THEBE_WORKSPACE_DIR` | Agent 允许读写的工作区路径。 | 容器内 `/workspace` |
| `THEBE_MCP_WRITES` | 控制 `/mcp` 端点是否允许写操作。设为 `off` 时仅允许只读工具。 | `on` |

## 3. HTTPS 与网络拓扑

容器仅监听本地回环地址。跨设备访问必须经过 TLS 终止代理。

### 3.1 使用 Tailscale Serve（推荐）

如果你在 homelab 中运行 Tailscale，可通过 Tailscale 快速暴露安全的私有域名：

```bash
tailscale serve --bg 8787
```

Tailscale 会自动处理证书并分配 `https://<主机名>.<tailnet>.ts.net`。

### 3.2 使用 Nginx 反向代理

```nginx
server {
    listen 443 ssl http2;
    server_name core.yourdomain.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 600s;
    }
}
```

配置完成后，将你的域名（如 `core.yourdomain.com`）添加到 `.env` 的 `THEBE_ALLOWED_HOSTS` 中。

## 4. 升级与回滚

### 4.1 升级

1. 停止当前容器：
   ```bash
   docker compose down
   ```
2. 修改 `deploy/.env` 中的 `THEBE_IMAGE` 指向新的版本标签（如 `ghcr.io/unitsung/thebe-core:0.2.0`）。
3. 重新拉取并启动：
   ```bash
   docker compose pull
   docker compose up -d
   ```
4. 检查服务健康状态与日志：
   ```bash
   docker compose logs -f
   ```

### 4.2 回滚

升级失败时，直接将 `.env` 中的 `THEBE_IMAGE` 改回上一个可用的镜像版本标签并执行 `docker compose up -d`。由于 `/data` 目录的数据迁移具备向前兼容性，恢复上一版本即可重新投入运行。

## 5. 备份与恢复

### 备份

备份前建议暂停容器以保障数据一致性：

```bash
docker compose stop
tar -czvf thebe-backup-$(date +%Y%m%d).tar.gz deploy/data deploy/.env
docker compose start
```

### 恢复

在目标宿主机上解压备份包至原目录结构，并启动容器：

```bash
tar -xzvf thebe-backup-20261108.tar.gz
docker compose up -d
```
