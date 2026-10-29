---
description: 使用官方 OpenAI SDK 在 Node.js 和 Python 中调用木瓜 API，覆盖聊天补全、Responses 和流式输出。
lastVerified: "2026-10-28"
---
# SDK 配置

OpenAI SDK 可以通过自定义 Base URL 调用木瓜 API。先按[快速开始](/guide/start#_2-设置环境变量)设置 `MUGUA_API_KEY` 和 `MUGUA_MODEL`，并确认模型支持准备使用的协议。

## Node.js

安装 SDK：

```bash
npm install openai
```

保存为 `example.mjs`，然后运行 `node example.mjs`：

```js
import OpenAI from 'openai'

const model = process.env.MUGUA_MODEL
if (!process.env.MUGUA_API_KEY || !model) {
  throw new Error('请先设置 MUGUA_API_KEY 和 MUGUA_MODEL')
}

const client = new OpenAI({
  apiKey: process.env.MUGUA_API_KEY,
  baseURL: 'https://api.mugua.link/v1',
  timeout: 60_000,
  maxRetries: 1
})

const completion = await client.chat.completions.create({
  model,
  messages: [{ role: 'user', content: '你好，请简短介绍自己。' }]
})

console.log(completion.choices[0]?.message.content ?? '')
```

## Python

安装 SDK：

```bash
python -m pip install openai
```

保存为 `example.py`，运行 `python example.py`（部分系统使用 `python3`）：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["MUGUA_API_KEY"],
    base_url="https://api.mugua.link/v1",
    timeout=60.0,
    max_retries=1,
)

completion = client.chat.completions.create(
    model=os.environ["MUGUA_MODEL"],
    messages=[{"role": "user", "content": "你好，请简短介绍自己。"}],
)

if completion.choices:
    print(completion.choices[0].message.content or "")
```

## 使用 Responses

确认模型支持 Responses 后，复用上面示例的 `client`：

::: code-group

```js [Node.js]
const response = await client.responses.create({
  model: process.env.MUGUA_MODEL,
  input: '你好，请简短介绍自己。'
})

console.log(response.output_text)
```

```python [Python]
response = client.responses.create(
    model=os.environ["MUGUA_MODEL"],
    input="你好，请简短介绍自己。",
)

print(response.output_text)
```

:::

`output_text` 是官方 SDK 汇总文本的便捷属性。直接通过 HTTP 请求时，应遍历响应的 `output` 和 `content`，读取 `output_text` 内容块；见 [Responses API](/reference/responses)。

## 流式输出

复用 Node.js 的 `client`：

```js
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

不同协议有不同的事件结构。Python 和 Responses 的完整流式示例见[流式输出](/reference/streaming)。

## 错误与重试

上面的客户端显式设置了超时和一次自动重试。实际项目按请求时长调整，避免 SDK、业务层和网关各自叠加重试。

捕获 SDK 异常时，记录状态码、脱敏错误体和请求 ID；Key 和请求正文中的私密内容不应写入公开日志。`401`、参数错误和配额耗尽通常需要先修复配置，见[错误处理](/reference/errors)。

## 协议兼容范围

官方 SDK 的方法代表上游 API 的能力。木瓜 API 中实际可用的模型、参数、工具、状态保存和多模态能力，需要按控制台和实际响应确认。

Anthropic SDK 使用独立协议与鉴权方式，配置示例见 [Anthropic Messages](/reference/anthropic-messages)。

## 官方参考

- [OpenAI SDK](https://developers.openai.com/api/docs/libraries)
- [Chat Completions](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)
- [Responses](https://developers.openai.com/api/reference/resources/responses/methods/create)
