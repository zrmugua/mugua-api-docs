# SDK 配置

木瓜 API 兼容常见 OpenAI SDK 的调用方式。你只需要把 `baseURL` 指向木瓜 API，并使用自己的 API Key。

## Node.js

安装 SDK：

```bash
npm install openai
```

调用示例：

```js
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.MUGUA_API_KEY,
  baseURL: 'https://api.mugua.link/v1'
})

const completion = await client.chat.completions.create({
  model: '<MODEL_ID>',
  messages: [
    { role: 'user', content: '你好，请介绍一下木瓜 API' }
  ]
})

console.log(completion.choices[0].message.content)
```

## Python

安装 SDK：

```bash
pip install openai
```

调用示例：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["MUGUA_API_KEY"],
    base_url="https://api.mugua.link/v1",
)

completion = client.chat.completions.create(
    model="<MODEL_ID>",
    messages=[
        {"role": "user", "content": "你好，请介绍一下木瓜 API"}
    ],
)

print(completion.choices[0].message.content)
```

## 流式输出

适合聊天页面、长文本生成和需要边生成边展示的场景。

```js
const stream = await client.chat.completions.create({
  model: '<MODEL_ID>',
  messages: [
    { role: 'user', content: '写一段简短欢迎语' }
  ],
  stream: true
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}
