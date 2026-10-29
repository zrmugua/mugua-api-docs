---
description: 对照三种协议的 SSE 事件，正确读取文本增量、用量与终止状态。
lastVerified: "2026-10-28"
---
# 流式输出

设置 `stream: true` 后，服务端通过 Server-Sent Events（SSE）持续返回事件。客户端按协议处理文本、工具调用、错误和终止状态。

## Chat Completions

cURL 使用 `-N` 关闭客户端输出缓冲：

```bash
curl -N --fail-with-body --silent --show-error \
  https://api.mugua.link/v1/chat/completions \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "messages": [{ "role": "user", "content": "写一段简短欢迎语。" }],
    "stream": true
  }'
```

文本增量通常在 `choices[].delta.content`。数据块可能只有角色、停止原因、工具参数或用量，`choices` 也可能为空。`data: [DONE]` 是 Chat Completions 的常见流结束标记。

::: code-group

```js [Node.js]
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.MUGUA_API_KEY,
  baseURL: 'https://api.mugua.link/v1',
  timeout: 60_000,
  maxRetries: 1
})

const stream = await client.chat.completions.create({
  model: process.env.MUGUA_MODEL,
  messages: [{ role: 'user', content: '写一段简短欢迎语。' }],
  stream: true
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '')
}
process.stdout.write('\n')
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["MUGUA_API_KEY"],
    base_url="https://api.mugua.link/v1",
    timeout=60.0,
    max_retries=1,
)

stream = client.chat.completions.create(
    model=os.environ["MUGUA_MODEL"],
    messages=[{"role": "user", "content": "写一段简短欢迎语。"}],
    stream=True,
)

for chunk in stream:
    if chunk.choices:
        text = chunk.choices[0].delta.content or ""
        print(text, end="", flush=True)
print()
```

:::

支持 `stream_options.include_usage` 的模型可在流尾返回汇总用量。开启前确认渠道支持；最终用量块的 `choices` 可能为空，连接中断时也可能收不到该块。

## Responses API

请求体使用 `input`，事件带有明确类型：

| 事件 | 处理 |
| --- | --- |
| `response.created` | 初始化响应状态 |
| `response.output_text.delta` | 追加 `delta` 文本 |
| `response.completed` | 标记响应完成，核对最终状态与用量 |
| `response.incomplete` | 检查未完成原因，例如输出上限 |
| `response.failed` / `error` | 记录脱敏错误并结束当前生成 |

复用上面 Node.js 示例中的 `client`，替换请求和读取循环：

```js
const stream = await client.responses.create({
  model: process.env.MUGUA_MODEL,
  input: '写一段简短欢迎语。',
  stream: true
})

for await (const event of stream) {
  if (event.type === 'response.output_text.delta') {
    process.stdout.write(event.delta)
  } else if (event.type === 'response.completed') {
    process.stdout.write('\n')
  } else if (event.type === 'response.failed' || event.type === 'response.incomplete') {
    throw new Error('生成未完成，请检查最终响应状态')
  } else if (event.type === 'error') {
    throw new Error(event.message ?? '流式响应错误')
  }
}
```

流内还可能包含推理项、工具调用和内容块事件。纯文本展示可以筛选文本事件，代理程序则需要按完整协议处理相关输出项。

## Anthropic Messages

在 [Messages 请求](/reference/anthropic-messages)中加入 `"stream": true`。常见事件如下：

| 事件 | 处理 |
| --- | --- |
| `message_start` | 读取消息起始状态和初始用量 |
| `content_block_start` | 初始化对应索引的内容块 |
| `content_block_delta` | 按增量类型处理；文本读取 `delta.text` |
| `content_block_stop` | 完成该内容块 |
| `message_delta` | 更新停止原因与用量 |
| `message_stop` | 消息结束 |
| `ping` | 保活事件 |
| `error` | 处理流内错误 |

`content_block_delta` 也可能携带工具 JSON、思考内容等其他类型。按块索引与增量类型累积，不能把所有增量当成文本。

## 应用与代理配置

- 使用 SDK 的事件解析器，或实现完整 SSE 分帧；一个网络数据块可能包含半条事件或多条事件。
- 关闭应用服务器和反向代理对事件流的缓冲，设置合适的空闲超时。
- 正确处理 UTF-8 跨块边界和多行 `data:`。
- 用户取消时，通过客户端的取消机制同时停止读取与上游请求。
- 连接断开时保留已收到内容，并明确记录是否收到终止事件。

HTTP `200` 只说明流已建立，后续仍可能发生错误。失败与重试策略见[错误处理](/reference/errors)。

## 官方参考

- [OpenAI 流式输出](https://developers.openai.com/api/docs/guides/streaming-responses)
- [Anthropic Messages 流式输出](https://platform.claude.com/docs/en/build-with-claude/streaming)
