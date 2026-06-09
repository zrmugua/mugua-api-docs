# 聊天补全

聊天补全接口用于多轮对话、文本生成、内容改写、信息抽取等场景。

## 请求地址

```http
POST https://api.mugua.link/v1/chat/completions
```

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 模型 ID，可从模型列表或控制台获取 |
| `messages` | array | 是 | 对话消息列表 |
| `temperature` | number | 否 | 采样温度，值越高越发散 |
| `max_tokens` | number | 否 | 最多生成 token 数 |
| `stream` | boolean | 否 | 是否使用流式输出 |

## messages 格式

```json
[
  {
    "role": "system",
    "content": "你是一个简洁可靠的助手。"
  },
  {
    "role": "user",
    "content": "请解释什么是 API。"
  }
]
```

常见角色：

- `system`：设定助手行为
- `user`：用户输入
- `assistant`：模型历史回复

## 请求示例

```bash
curl https://api.mugua.link/v1/chat/completions \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<MODEL_ID>",
    "messages": [
      {
        "role": "user",
        "content": "用三句话介绍木瓜 API"
      }
    ],
    "temperature": 0.7
  }'
```

## 响应示例

```json
{
  "id": "chatcmpl-example",
  "object": "chat.completion",
  "created": 1760000000,
  "model": "<MODEL_ID>",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "这里是模型返回的内容。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 12,
    "total_tokens": 32
  }
}
```

## 流式请求

把 `stream` 设置为 `true`：

```json
{
  "model": "<MODEL_ID>",
  "messages": [
    {
      "role": "user",
      "content": "写一段欢迎语"
    }
  ],
  "stream": true
}
