# 接口协议对照

木瓜 API 提供多种兼容接口。不同 SDK 和工具使用的请求格式不同，不能只替换请求路径后继续沿用原来的请求体。

## 协议与地址

| 协议 | 完整请求地址 | 常见用途 |
| --- | --- | --- |
| 模型列表 | `GET https://api.mugua.link/v1/models` | 查询当前 Key 可用的模型 ID |
| Chat Completions | `POST https://api.mugua.link/v1/chat/completions` | OpenAI 兼容 SDK、聊天客户端和普通对话程序 |
| Responses API | `POST https://api.mugua.link/v1/responses` | Codex、OpenClaw，以及配置为 Responses 模式的工具 |
| Anthropic Messages | `POST https://api.mugua.link/v1/messages` | Claude Code 和 Anthropic Messages 兼容客户端 |

模型是否支持某种协议，以木瓜 API 控制台中显示的模型能力为准。

## Base URL 怎么填

OpenAI 兼容 SDK 和使用 Responses API 的工具通常填写：

```text
https://api.mugua.link/v1
```

Claude Code 填写不带 `/v1` 的地址：

```text
https://api.mugua.link
```

这是因为 Claude Code 会在 Base URL 后自动请求 `/v1/messages`。

## 请求体区别

三种生成接口的主要输入字段不同：

| 协议 | 主要输入字段 | 返回文本位置 |
| --- | --- | --- |
| Chat Completions | `messages` | `choices[0].message.content` |
| Responses API | `input` | `output` 中的 `output_text` 内容 |
| Anthropic Messages | `messages`，并且需要 `max_tokens` | `content` 中的 `text` 内容 |

对应的完整示例：

- [聊天补全](/reference/chat-completions)
- [Responses API](/reference/responses)
- [Anthropic Messages](/reference/anthropic-messages)
- [流式输出](/reference/streaming)
