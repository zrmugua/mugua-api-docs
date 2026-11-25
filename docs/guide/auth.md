---
description: 木瓜 API 的请求头鉴权方式、环境变量保存、个人工具与服务端密钥安全规范。
---
# 鉴权与安全

在控制台“令牌管理”中创建令牌（即 API Key，以 `sk-` 开头）后，通过请求头传递凭据。不同协议与工具使用的字段略有区别。创建时需要选择分组，见[分组与令牌](/guide/groups)。

## 请求头

| 调用方式 | 凭据配置 |
| --- | --- |
| OpenAI 兼容 HTTP 接口 | `Authorization: Bearer your-api-key` |
| Anthropic Messages 兼容调用 | `x-api-key: your-api-key`，同时发送 `anthropic-version` |
| Claude Code | `ANTHROPIC_AUTH_TOKEN`，由工具发送 Bearer 请求头 |
| Codex 自定义提供商 | `env_key = "MUGUA_API_KEY"`，从环境变量取值 |

JSON 请求同时发送 `Content-Type: application/json`。[Messages 示例](/reference/anthropic-messages)和[工具专页](/guide/tools)提供完整配置。

## 保存环境变量

::: code-group

```bash [macOS / Linux]
export MUGUA_API_KEY="your-api-key"
```

```powershell [Windows PowerShell]
$env:MUGUA_API_KEY = "your-api-key"
```

:::

这些命令只影响当前终端及其子进程。持久配置可以使用系统的环境变量管理、部署平台的密钥配置或权限受控的本地配置文件。保存后重新启动需要使用变量的程序。

`.env` 文件需要由运行时或应用显式加载。将它加入 `.gitignore`，并提供只含占位值的 `.env.example`。

## 应用和个人工具

应用应在自己的后端保存密钥：

```text
用户界面 → 应用后端（用户鉴权、限流）→ 木瓜 API
```

浏览器、小程序和分发给用户的 App 无法安全保存开发者的共享 Key。不要在这些产物中嵌入 Key。

个人使用的 CLI 或桌面客户端，可以在受信任设备上保存自己的 Key。配置文件、客户端导出、备份和截图都需要按凭据保护。

## 多环境与日志

- 为开发和生产分别创建令牌，并设置额度上限、过期时间和模型限制。
- 服务端固定出口时，可以为令牌设置 IP 白名单。
- 日志记录时间、模型、接口、HTTP 状态码和请求 ID，隐藏鉴权头。
- 排查时只共享脱敏后的配置，移除 Key、Cookie、登录令牌和私密提示词。
- 团队成员使用独立凭据，便于撤销和追踪调用。

## 密钥泄露后

立即在控制台“令牌管理”中禁用或删除泄露的令牌，生成并部署新令牌，再在“使用日志”中检查调用和消耗。删除公开文本后，旧 Key 仍然需要撤销；仓库历史、日志与备份可能保留副本。
