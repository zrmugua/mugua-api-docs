---
description: Anthropic Messages 的鉴权、请求参数、SDK 与响应解析示例。
lastVerified: "2026-10-28"
---
# Anthropic Messages

Messages 兼容接口用于 Claude Code 与 Anthropic SDK。模型及渠道需要支持该协议。

## 请求地址与鉴权

```http
POST https://api.mugua.link/v1/messages
x-api-key: your-api-key
anthropic-version: 2023-06-01
Content-Type: application/json
```

Anthropic SDK 使用 `api_key` / `apiKey` 生成 `x-api-key` 请求头。Claude Code 的 `ANTHROPIC_AUTH_TOKEN` 则使用 Bearer 凭据，配置方式见 [Claude Code](/cli/claude-code)。

## 常用参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 目标模型 ID |
| `max_tokens` | integer | 是 | 生成 token 上限，需符合模型要求 |
| `messages` | array | 是 | `user`、`assistant` 消息 |
| `system` | string 或 array | 否 | 顶层行为指令 |
| `stream` | boolean | 否 | SSE 流式输出 |

Messages 的系统指令放在顶层 `system`。消息内容可以是文本或内容块，多模态和工具能力按模型确认。

## HTTP 示例

::: code-group

```bash [macOS / Linux]
curl --fail-with-body --silent --show-error \
  https://api.mugua.link/v1/messages \
  -H "x-api-key: $MUGUA_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "max_tokens": 1024,
    "messages": [{ "role": "user", "content": "你好，请简短介绍自己。" }]
  }'
```

```powershell [Windows PowerShell]
$headers = @{
    "x-api-key" = $env:MUGUA_API_KEY
    "anthropic-version" = "2023-06-01"
}
$body = @{
    model = $env:MUGUA_MODEL
    max_tokens = 1024
    messages = @(@{ role = "user"; content = "你好，请简短介绍自己。" })
} | ConvertTo-Json -Depth 10

$result = Invoke-RestMethod -Method Post `
    -Uri "https://api.mugua.link/v1/messages" `
    -Headers $headers `
    -ContentType "application/json; charset=utf-8" `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body))

$result.content | Where-Object type -eq "text" | ForEach-Object { $_.text }
```

:::

## Python SDK

安装 `python -m pip install anthropic` 后，使用环境变量调用：

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["MUGUA_API_KEY"],
    base_url="https://api.mugua.link",
    timeout=60.0,
    max_retries=1,
)

message = client.messages.create(
    model=os.environ["MUGUA_MODEL"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "你好，请简短介绍自己。"}],
)

for block in message.content:
    if block.type == "text":
        print(block.text)
```

## 响应示例

下面为结构节选：

```json
{
  "id": "msg_example",
  "type": "message",
  "role": "assistant",
  "model": "your-model-id",
  "content": [
    { "type": "text", "text": "你好，有什么可以帮助你的？" }
  ],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 10, "output_tokens": 12 }
}
```

遍历 `content` 中的文本块。`stop_reason` 为 `max_tokens` 时可能达到上限，为 `tool_use` 时需要执行对应工具并提交 `tool_result`。流式事件见[流式输出](/reference/streaming#anthropic-messages)。

## 官方参考

- [Anthropic Messages API](https://platform.claude.com/docs/en/api/messages)
- [Claude Code 网关凭据](https://code.claude.com/docs/en/llm-gateway-connect)
