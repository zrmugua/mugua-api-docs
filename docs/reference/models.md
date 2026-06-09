# 模型列表

模型列表接口用于查询当前 API Key 可访问的模型。模型 ID、上下文长度、价格和可用能力以控制台和接口返回为准。

## 查询模型

```http
GET https://api.mugua.link/v1/models
```

请求示例：

```bash
curl https://api.mugua.link/v1/models \
  -H "Authorization: Bearer $MUGUA_API_KEY"
```

## 响应示例

```json
{
  "object": "list",
  "data": [
    {
      "id": "<MODEL_ID>",
      "object": "model",
      "created": 1760000000,
      "owned_by": "mugua"
    }
  ]
}
```

## 使用模型

把接口返回的 `id` 填到请求里的 `model` 字段：

```json
{
  "model": "<MODEL_ID>",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ]
}
```

## 选择建议

选择模型时关注这些信息：

- 任务类型是否匹配
- 上下文长度是否足够
- 响应速度是否满足产品体验
- 成本是否适合业务规模
