---
description: 对照 Chat Completions、Responses API、Anthropic Messages 与 Images 接口的路径、鉴权、输入输出及流式事件差异。
lastVerified: "2026-11-24"
---
# 接口协议对照

木瓜 API 提供多种兼容接口。按工具所需协议选择接口和模型，再使用对应的请求体、鉴权与返回解析方式。

## 协议速查

| 协议 | 方法与路径 | 常见用途 |
| --- | --- | --- |
| 模型列表 | `GET /v1/models` | 查询当前 Key 可见的模型 ID |
| Chat Completions | `POST /v1/chat/completions` | 聊天应用、OpenAI 兼容客户端 |
| Responses API | `POST /v1/responses` | Codex、Responses 模式的工具 |
| Anthropic Messages | `POST /v1/messages` | Claude Code、Anthropic SDK |
| 图片生成 | `POST /v1/images/generations` | 图片生成模型，见[图片生成](/reference/images) |

主站域名为 `https://api.mugua.link`，备用线路见[线路选择](/guide/base-url#线路选择)。可用模型、协议、参数和扩展能力以控制台及实际响应为准。

## 请求与返回

| 对照项 | Chat Completions | Responses | Anthropic Messages |
| --- | --- | --- | --- |
| 主要输入 | `messages` | `input` | `messages` |
| 行为指令 | 消息中的 `system` 或 `developer`，按模型支持 | `instructions` | 顶层 `system` |
| 输出上限 | `max_completion_tokens` 或兼容的 `max_tokens` | `max_output_tokens` | 必填 `max_tokens` |
| HTTP 文本位置 | `choices[].message.content` | `output[].content[]` 中的 `output_text` | `content[]` 中的 `text` |
| 常见鉴权 | Bearer | Bearer | `x-api-key` + `anthropic-version` |
| 流式文本 | `choices[].delta.content` | `response.output_text.delta` | `content_block_delta` |

Messages 兼容入口也用于 Claude Code 的 Bearer 凭据调用。手动请求示例见[鉴权与安全](/guide/auth)和各接口专页。

## Base URL

| 客户端 | Base URL |
| --- | --- |
| OpenAI SDK、Codex、OpenCode | `https://api.mugua.link/v1` |
| Claude Code、Anthropic SDK | `https://api.mugua.link` |
| OpenClaw 的 OpenAI 兼容提供商 | `https://api.mugua.link/v1` |

SDK 和工具会追加自己的路径。自定义客户端的完整端点字段则填写完整 URL；见[接入地址](/guide/base-url)。

## 接口兼容与模型能力

同一模型是否支持多个协议、图片、工具调用、结构化输出或状态保存，需要单独确认。`GET /v1/models` 不保证提供完整能力元数据。

编程助手通常需要工具调用与流式输出。建议先验证最小生成请求，再验证实际工具流程。接口返回的完整内容也可能包含工具调用和拒绝结果，文本字段只是其中一部分。

## 完整示例

- [Chat Completions](/reference/chat-completions)
- [Responses API](/reference/responses)
- [Anthropic Messages](/reference/anthropic-messages)
- [流式输出与终止事件](/reference/streaming)
- [错误处理与重试](/reference/errors)
