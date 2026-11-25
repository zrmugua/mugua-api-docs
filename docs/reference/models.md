---
description: 使用 GET /v1/models 查询当前木瓜 API 令牌可用的模型 ID，以及在工具中选择与填写模型的方法。
---
# 模型列表

查询当前 API Key 可见的模型 ID。返回结果由令牌所属[分组](/guide/groups)决定。具体价格、计费方式和所属分组可在控制台“模型广场”（需登录）查看。

## 请求

```http
GET https://api.mugua.link/v1/models
Authorization: Bearer your-api-key
```

::: code-group

```bash [macOS / Linux]
curl --fail-with-body --silent --show-error \
  https://api.mugua.link/v1/models \
  -H "Authorization: Bearer $MUGUA_API_KEY"
```

```powershell [Windows PowerShell]
$headers = @{ Authorization = "Bearer $env:MUGUA_API_KEY" }
$result = Invoke-RestMethod -Uri "https://api.mugua.link/v1/models" -Headers $headers
$result.data | Select-Object id
```

:::

## 响应结构

下面是用于说明结构的简化示例，`your-model-id` 为占位值：

```json
{
  "object": "list",
  "data": [
    {
      "id": "your-model-id",
      "object": "model"
    }
  ]
}
```

读取 `data[].id` 并原样填入生成请求的 `model` 字段。接口可能返回其他字段，客户端应保留向前兼容性。

## 选择模型

| 检查项 | 确认方式 |
| --- | --- |
| 当前 Key 是否有权限 | 模型列表、令牌的分组与模型限制 |
| 价格与计费方式 | 模型广场，按量或按次 |
| 是否支持目标协议 | 控制台能力说明、目标协议最小请求 |
| 工具调用和流式输出 | 使用对应功能的小请求验证 |
| 图片等多模态输入 | 查看模型与渠道能力 |
| 上下文、速度和价格 | 控制台说明与实际任务评估 |

模型 ID 可能包含版本或渠道后缀，请完整复制。列表为空时，先检查令牌的分组和模型限制。模型上线与下线会在控制台公告中通知，下线的模型 ID 需要及时从工具配置中替换。

## 在工具中填写

部分工具使用 `提供商ID/模型ID` 表示默认模型，例如 `mugua/your-model-id`。这里的 `mugua/` 是工具配置中的提供商前缀，HTTP 请求体的 `model` 通常使用原始模型 ID。具体格式见[工具接入](/guide/tools)。
