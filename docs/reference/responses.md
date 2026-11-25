---
description: Responses API 的输入、文本读取、状态及多轮上下文说明。
lastVerified: "2026-11-24"
---
# Responses API

Responses 使用 `input` 接收文本或输入项，是 Codex 等工具使用的协议。先确认模型和渠道支持 Responses。

## 请求地址

```http
POST https://api.mugua.link/v1/responses
Authorization: Bearer your-api-key
Content-Type: application/json
```

## 常用参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 原始模型 ID |
| `input` | string 或 array | 是 | 文本或协议规定的输入项 |
| `instructions` | string | 否 | 行为指令 |
| `max_output_tokens` | integer | 否 | 输出上限，可能包含推理 token |
| `stream` | boolean | 否 | 使用带类型的 SSE 事件 |

状态保存、内置工具、图片等能力需要分别确认，兼容此接口不等于支持上游 API 的全部字段。

## 请求示例

::: code-group

```bash [macOS / Linux]
curl --fail-with-body --silent --show-error \
  https://api.mugua.link/v1/responses \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "model": "$MUGUA_MODEL",
  "input": "你好，请简短介绍自己。"
}
EOF
```

```powershell [Windows PowerShell]
$headers = @{ Authorization = "Bearer $env:MUGUA_API_KEY" }
$body = @{
    model = $env:MUGUA_MODEL
    input = "你好，请简短介绍自己。"
} | ConvertTo-Json -Depth 10

$result = Invoke-RestMethod -Method Post `
    -Uri "https://api.mugua.link/v1/responses" `
    -Headers $headers `
    -ContentType "application/json; charset=utf-8" `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body))

$result.output | ForEach-Object {
    $_.content | Where-Object type -eq "output_text" | ForEach-Object { $_.text }
}
```

:::

环境变量设置见[快速开始](/guide/start#_2-设置环境变量)。

## 响应与文本读取

下面为简化的成功响应：

```json
{
  "id": "resp_example",
  "object": "response",
  "status": "completed",
  "model": "your-model-id",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        { "type": "output_text", "text": "你好，我可以帮助你解答问题。" }
      ]
    }
  ]
}
```

直接处理 HTTP JSON 时，遍历 `output` 中的消息及其 `content`，收集 `type === "output_text"` 的文本。其他输出项可能是推理信息或工具调用，数组首项不一定是文本消息。

官方 SDK 的 `response.output_text` 是聚合文本的便捷属性，见[SDK 示例](/guide/sdk#使用-responses)。

同时检查 `status`：`incomplete` 可能表示输出预算用尽，`failed` 需要查看错误信息。

## 多轮上下文

每次请求应携带当前任务所需的历史。使用 `input` 数组可以显式提交对话；工具调用场景需要保留相应的输出项、调用 ID 和工具结果。

`previous_response_id`、`store` 等服务端状态功能需要渠道单独支持，使用前先验证。应用可以通过自行维护历史控制上下文。

## 在 Codex 中使用

Codex 提供商设置 `wire_api = "responses"`。完整的 Base URL、凭据和模型配置见 [Codex 安装配置](/cli/codex)。

## 官方参考

- [OpenAI Responses 参数与返回结构](https://developers.openai.com/api/reference/resources/responses/methods/create)
- [Responses 流式事件](/reference/streaming#responses-api)
