---
description: 木瓜 API 的 Base URL、主站与 CF 站线路切换、三种协议路径以及避免重复 /v1 拼接说明。
lastVerified: "2026-11-24"
---
# 接入地址与协议

填写地址前，先确认工具需要的是 **Base URL** 还是**完整接口地址**。SDK 通常会在 Base URL 后追加路径。

<EndpointCopy />

## 地址速查

| 使用场景 | 填写内容 | 最终请求 |
| --- | --- | --- |
| 控制台 | `https://api.mugua.link` | 网页 |
| OpenAI SDK：Chat Completions | `https://api.mugua.link/v1` | `POST /v1/chat/completions` |
| OpenAI SDK：Responses、Codex | `https://api.mugua.link/v1` | `POST /v1/responses` |
| Claude Code | `https://api.mugua.link` | `POST /v1/messages` |
| Anthropic Python / TypeScript SDK | `https://api.mugua.link` | `POST /v1/messages` |
| OpenCode | `https://api.mugua.link/v1` | 由 AI SDK 包决定协议 |
| OpenClaw | `https://api.mugua.link/v1` | 由 `api` 字段决定协议 |

第三方客户端可能提供“完整端点”或自动补全版本路径的选项。检查客户端展示的最终请求地址，以工具专页和实际请求日志为准。

## 线路选择

木瓜 API 提供主站与备用线路，使用同一套账号和令牌。替换文中示例的域名即可切换：

| 线路 | 域名 | 说明 |
| --- | --- | --- |
| 主站 | `https://api.mugua.link` | 境内境外独立加速，默认推荐 |
| CF 站 | `https://api.668851.xyz` | Cloudflare 全球加速 |

切换线路时只替换域名，路径规则不变：OpenAI 兼容工具仍填写 `https://域名/v1`，Claude Code 和 Anthropic SDK 仍填写站点根地址。主站连接不稳定时，可以切到 CF 站再试。线路列表以控制台展示为准。

## 三种生成协议

| 协议 | 完整地址 | 主要输入 |
| --- | --- | --- |
| Chat Completions | `https://api.mugua.link/v1/chat/completions` | `messages` |
| Responses API | `https://api.mugua.link/v1/responses` | `input` |
| Anthropic Messages | `https://api.mugua.link/v1/messages` | `messages`、`max_tokens` |

模型列表使用 `GET https://api.mugua.link/v1/models`。图片生成使用 `POST /v1/images/generations`，见[图片生成](/reference/images)。

## 检查路径拼接

正确的完整地址应只有一层 `/v1`。出现 `/v1/v1/messages`，通常是工具自动追加版本前缀后又重复填写了 `/v1`。

把完整的 `/chat/completions` 或 `/responses` 地址填进 SDK 的 Base URL，也会产生重复路径。优先复制上表中对应工具的 Base URL。

## 确认模型能力

接口地址、模型 ID 和令牌分组需要一起匹配。模型列表返回某个 ID，说明当前 Key 所在分组能看到该模型（见[分组与令牌](/guide/groups)）；上下文长度、工具调用、图片输入及协议权限还需查看控制台或通过目标功能的小请求验证。

下一步：[接口协议对照](/reference/protocols) · [工具接入](/guide/tools) · [404 排查](/guide/troubleshooting#路径与协议)
