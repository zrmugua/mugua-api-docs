# 流式输出

流式输出会在模型生成内容时持续返回数据，适合聊天界面、长文本生成和需要及时显示结果的程序。

使用时把请求体中的 `stream` 设置为 `true`。服务端会通过 Server-Sent Events（SSE）分段返回内容，因此不能把整个响应当成一次性 JSON 解析。

## Chat Completions

请求示例：

```bash
curl -N https://api.mugua.link/v1/chat/completions \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "messages": [
      {
        "role": "user",
        "content": "写一段简短欢迎语"
      }
    ],
    "stream": true
  }'
```

文本通常位于每个数据块的 `choices[0].delta.content`。收到 `data: [DONE]` 表示本次输出结束。

Node.js：

```js
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.MUGUA_API_KEY,
  baseURL: 'https://api.mugua.link/v1'
})

const stream = await client.chat.completions.create({
  model: 'your-model-id',
  messages: [{ role: 'user', content: '写一段简短欢迎语' }],
  stream: true
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}
```

Python：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["MUGUA_API_KEY"],
    base_url="https://api.mugua.link/v1",
)

stream = client.chat.completions.create(
    model="your-model-id",
    messages=[{"role": "user", "content": "写一段简短欢迎语"}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content or ""
    print(text, end="", flush=True)
```

## Responses API

请求体写法：

```json
{
  "model": "your-model-id",
  "input": "写一段简短欢迎语",
  "stream": true
}
```

Responses API 会返回带类型的 SSE 事件。处理文本时主要关注：

| 事件 | 说明 |
| --- | --- |
| `response.created` | 请求已创建 |
| `response.output_text.delta` | 新生成的一段文本，读取 `delta` |
| `response.completed` | 响应完成 |
| `error` | 流式请求发生错误 |

不要使用 Chat Completions 的 `choices[0].delta.content` 去解析 Responses 事件。

## Anthropic Messages

在 `/v1/messages` 请求体中加入：

```json
{
  "model": "your-model-id",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "写一段简短欢迎语"
    }
  ],
  "stream": true
}
```

Messages 流式输出常见事件包括：

| 事件 | 说明 |
| --- | --- |
| `message_start` | 消息开始 |
| `content_block_delta` | 内容增量，文本通常在 `delta.text` |
| `message_delta` | 消息状态或用量更新 |
| `message_stop` | 消息结束 |

## 使用注意

- 流式连接可能因为网络或代理超时而中断，客户端应正确处理断开和错误事件。
- 不要把每个数据块都当作完整回复；应按协议读取增量文本并依次拼接。
- 用户主动停止生成时，应同时关闭前端读取和服务端请求。
- 模型是否支持流式输出，以控制台显示的能力为准。
