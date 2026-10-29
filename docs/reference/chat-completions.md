---
description: Chat Completions 的请求字段、响应结构与模型参数兼容说明。
lastVerified: "2026-10-28"
---
# 聊天补全

Chat Completions 接口适合多轮对话与文本生成。请求中提供消息历史，响应包含模型的消息和用量。

## 请求地址

```http
POST https://api.mugua.link/v1/chat/completions
Authorization: Bearer your-api-key
Content-Type: application/json
```

## 常用参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 控制台或模型列表中的原始模型 ID |
| `messages` | array | 是 | 当前输入及所需的对话历史 |
| `stream` | boolean | 否 | 开启 SSE 流式输出 |
| `max_completion_tokens` | integer | 否 | 支持该字段的模型的输出上限，可能含推理 token |
| `max_tokens` | integer | 否 | 部分兼容模型使用的输出上限字段 |
| `temperature` | number | 否 | 采样温度，支持范围依模型而定 |

上游 OpenAI 已推荐 `max_completion_tokens` 替代 `max_tokens`；部分兼容模型仍使用后者。按目标模型能力选择一个字段。推理模型也可能限制温度、角色等参数，首次调用先使用最小请求体。

## 请求示例

将 `your-model-id` 替换为真实模型 ID，并先设置 `MUGUA_API_KEY`：

```bash
curl --fail-with-body --silent --show-error \
  https://api.mugua.link/v1/chat/completions \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "messages": [
      { "role": "user", "content": "你好，请简短介绍自己。" }
    ]
  }'
```

PowerShell 原生请求示例见[快速开始](/guide/start#_4-发送生成请求)，SDK 示例见[SDK 配置](/guide/sdk)。

## 消息与多轮对话

```json
[
  { "role": "user", "content": "什么是 API？" },
  { "role": "assistant", "content": "API 是程序之间约定的调用接口。" },
  { "role": "user", "content": "请举一个简单例子。" }
]
```

继续对话时，提交需要保留的历史。`system` 或 `developer` 可用于行为指令，按模型支持选择。`tool` 消息和工具调用结果也有独立结构，需要与上一轮的调用 ID 对应。

## 响应示例

下面为结构节选：

```json
{
  "id": "chatcmpl-example",
  "object": "chat.completion",
  "model": "your-model-id",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好，我可以帮助你解答问题。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 16,
    "completion_tokens": 12,
    "total_tokens": 28
  }
}
```

文本通常在 `choices[0].message.content`。`finish_reason` 为 `length` 时可能达到输出上限；为 `tool_calls` 时应处理工具调用。返回消息也可能没有文本，需要结合工具调用、拒绝与停止原因处理。

## 流式请求

在请求中添加 `"stream": true`，按 `choices[].delta` 读取增量。完整示例与空 `choices` 处理见[流式输出](/reference/streaming)。

## 官方参考

- [OpenAI Chat Completions 参数与结构](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)

该来源用于核对协议格式，木瓜 API 实际能力以模型和渠道为准。
