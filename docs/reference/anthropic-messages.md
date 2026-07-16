# Anthropic Messages

Anthropic Messages 兼容接口主要用于 Claude Code 和使用 Anthropic 消息格式的客户端。

示例里的 `your-model-id` 是占位内容，请替换成木瓜 API 控制台中的可用模型 ID。

## 请求地址

```http
POST https://api.mugua.link/v1/messages
```

## 常用参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 控制台中的模型 ID |
| `max_tokens` | number | 是 | 最多生成的输出 token 数 |
| `messages` | array | 是 | `user` 和 `assistant` 消息列表 |
| `system` | string 或 array | 否 | 系统提示词，放在请求体顶层 |
| `stream` | boolean | 否 | 是否使用流式输出 |

Messages 格式没有 `system` 角色。需要系统提示词时，请使用请求体顶层的 `system` 字段。

## cURL 示例

```bash
curl https://api.mugua.link/v1/messages \
  -H "x-api-key: $MUGUA_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "max_tokens": 1024,
    "system": "你是一个简洁可靠的助手。",
    "messages": [
      {
        "role": "user",
        "content": "请用一句话介绍木瓜 API"
      }
    ]
  }'
```

Windows PowerShell：

```powershell
curl.exe https://api.mugua.link/v1/messages `
  -H "x-api-key: $env:MUGUA_API_KEY" `
  -H "anthropic-version: 2023-06-01" `
  -H "Content-Type: application/json" `
  -d '{
    "model": "your-model-id",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "你好"
      }
    ]
  }'
```

## 响应示例

```json
{
  "id": "msg_example",
  "type": "message",
  "role": "assistant",
  "model": "your-model-id",
  "content": [
    {
      "type": "text",
      "text": "你好，有什么可以帮助你的？"
    }
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 8,
    "output_tokens": 12
  }
}
```

返回文本位于 `content` 数组中 `type` 为 `text` 的内容块。

Claude Code 的 Base URL 应填写 `https://api.mugua.link`，完整步骤请查看 [Claude Code 安装配置](/cli/claude-code)。流式事件请查看 [流式输出](/reference/streaming)。
