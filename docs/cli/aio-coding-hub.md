---
description: 将木瓜 API 配置为 AIO Coding Hub 上游，并验证本机网关和实际调用。
lastVerified: "2026-10-29"
---
# AIO Coding Hub 配置指南

AIO Coding Hub 在本机运行网关，让 Claude Code、Codex 和 Gemini CLI 的请求走同一个入口，并管理上游、请求路由和调用记录。接入链路如下：

```text
开发工具 → AIO 本机网关 → 木瓜 API → 目标模型
```

## 下载安装

| 系统 | 安装方式 |
| --- | --- |
| Windows | [Releases](https://github.com/dyndynjyxa/aio-coding-hub/releases) 中的 `.msi`（支持自动更新）或 `-portable.zip` |
| macOS | Homebrew，或 Releases 中的 `.zip` |
| Linux | Releases 中的 `.deb`、`.AppImage`，或 AUR 包 `aio-coding-hub-bin` |

macOS 使用 Homebrew：

```bash
brew tap dyndynjyxa/aio-coding-hub
brew install --cask aio-coding-hub
```

当前支持范围和安装要求见[项目 README](https://github.com/dyndynjyxa/aio-coding-hub)。

## 添加上游

在供应商页面创建木瓜 API 上游。字段名称和可选协议可能随版本变化，按目标 CLI 和供应商类型填写：

| 配置 | 内容 |
| --- | --- |
| 名称 | `木瓜 API` |
| API Key | 控制台创建的令牌，分组需提供目标模型（见[分组与令牌](/guide/groups)） |
| OpenAI 兼容 Base URL | `https://api.mugua.link/v1` |
| Anthropic Base URL | `https://api.mugua.link` |
| 模型 | 支持目标协议的模型 ID |

最终请求应落到 `/v1/chat/completions`、`/v1/responses` 或 `/v1/messages`。网关可能自动拼接路径，保存后需要通过日志确认实际地址。

需要备用线路时，可以用同一个令牌再添加 CF 站 `https://api.668851.xyz` 或加速站 `https://api-fast.668851.xyz` 作为上游，见[线路选择](/guide/base-url#线路选择)。

## 配置模型映射

为准备使用的 CLI 配置模型映射：例如主模型、快速模型、推理模型，或者 Claude 的模型槽位。每个槽位都应对应当前账号实际可用、且与目标协议匹配的模型。

使用预设时也要核对模型 ID、接口类型和权限。模型映射是否成功，以真实请求命中的模型为准。

## 启用本机代理

在 AIO 首页启用目标 CLI 的代理开关，确认该 CLI 已指向 AIO 提供的本机入口，再重新启动 CLI。

默认网关的健康检查：

::: code-group

```bash [macOS / Linux]
curl http://127.0.0.1:37123/health
```

```powershell [Windows PowerShell]
Invoke-RestMethod -Uri "http://127.0.0.1:37123/health"
```

:::

默认地址以当前版本设置为准。返回 `{"status":"ok"}` 说明本机网关可达。

## 验证上游调用

在 CLI 中发送一条简短消息，同时核对：

1. AIO 日志中的目标供应商为木瓜 API。
2. 实际模型 ID、协议和完整请求地址正确。
3. CLI 正常返回消息，木瓜控制台出现对应调用记录。

本机健康检查和上游模型调用是两个验证步骤。排查时分别查看本机代理与上游错误。

## 常见问题

| 现象 | 检查 |
| --- | --- |
| 健康检查失败 | AIO 是否运行、实际监听端口是否正确 |
| 请求未进入 AIO | CLI 的生效地址、代理开关、旧环境变量 |
| `401` | 上游 Key、鉴权方式和 Key 状态 |
| `404` | 自动拼接后的路径，以及模型映射 |
| `503` 无可用渠道 | 令牌分组是否提供映射的模型 |
| `429` 或 `5xx` | 上游错误体；限流、配额和重试策略 |

多层网关或 SDK 都可能自动重试，请限制总重试次数并核对平台消耗。更多方法见[故障排查](/guide/troubleshooting)。

## 官方参考

- [AIO Coding Hub 项目说明](https://github.com/dyndynjyxa/aio-coding-hub)
- [安装包与版本记录](https://github.com/dyndynjyxa/aio-coding-hub/releases)
