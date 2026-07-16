# Responses API

Responses API 使用 `input` 接收输入，适合 Codex、代理工具和需要统一消息输出格式的应用。

示例里的 `your-model-id` 是占位内容，请替换成木瓜 API 控制台中的可用模型 ID。

## 请求地址

```http
POST https://api.mugua.link/v1/responses
```

## 常用参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 控制台中的模型 ID |
| `input` | string 或 array | 是 | 文本或消息列表 |
| `instructions` | string | 否 | 本次请求的系统级说明 |
| `max_output_tokens` | number | 否 | 最多生成的输出 token 数 |
| `stream` | boolean | 否 | 是否使用流式输出 |

不同模型支持的参数可能不同，调用前请确认模型能力。

## cURL 示例

macOS / Linux：

```bash
curl https://api.mugua.link/v1/responses \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "input": "请用一句话介绍木瓜 API"
  }'
```

Windows PowerShell：

```powershell
curl.exe https://api.mugua.link/v1/responses `
  -H "Authorization: Bearer $env:MUGUA_API_KEY" `
  -H "Content-Type: application/json" `
  -d '{
    "model": "your-model-id",
    "input": "请用一句话介绍木瓜 API"
  }'
```

## 响应示例

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
        {
          "type": "output_text",
          "text": "木瓜 API 提供多种兼容接口，方便应用和开发工具接入。"
        }
      ]
    }
  ]
}
```

Responses API 的返回结构不是 Chat Completions 的 `choices`。直接处理 HTTP 响应时，应从 `output` 数组中的 `output_text` 内容读取文本。

## 在 Codex 中使用

Codex 的自定义提供商需要使用 Responses 协议：

```toml
[model_providers.mugua]
base_url = "https://api.mugua.link/v1"
wire_api = "responses"
requires_openai_auth = true
```

完整配置请查看 [Codex 安装配置](/cli/codex)。流式事件处理请查看 [流式输出](/reference/streaming)。
