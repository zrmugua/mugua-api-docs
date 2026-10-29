---
description: 使用 gpt-image-2 等模型通过 Images API 生成图片，含推荐线路、计费方式与保存示例。
lastVerified: "2026-10-29"
---
# 图片生成

图片模型（如 `gpt-image-2`）使用 OpenAI 兼容的 Images 接口，按次计费。不想写代码时，可以直接使用控制台侧边栏“聊天”中的在线生图入口，它已内置推荐线路。

## 请求地址

生图耗时较长，推荐使用加速站，稳定性更好：

```http
POST https://api-fast.668851.xyz/v1/images/generations
Authorization: Bearer your-api-key
Content-Type: application/json
```

主站 `https://api.mugua.link` 使用同一套令牌，也可以调用。各线路说明见[接入地址](/guide/base-url#线路选择)。令牌所属分组需要提供该图片模型，见[分组与令牌](/guide/groups)。

## 常用参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `model` | string | 是 | 图片模型 ID，例如 `gpt-image-2` |
| `prompt` | string | 是 | 图片描述 |
| `n` | integer | 否 | 生成数量，按张计费 |
| `size` | string | 否 | 默认 `auto`；常用 `1024x1024`、`1536x1024`、`1024x1536`。`gpt-image-2` 还支持边长为 16 倍数的自定义尺寸 |
| `quality` | string | 否 | 默认 `auto`；可选 `low`、`medium`、`high`，档位越高越慢，按次价格也可能不同 |

`gpt-image` 系列不支持 `response_format`，始终以 Base64 返回图片。

## 请求示例

::: code-group

```bash [macOS / Linux]
curl --fail-with-body --silent --show-error \
  https://api-fast.668851.xyz/v1/images/generations \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "一只坐在窗台上的橘猫，水彩风格",
    "size": "1024x1024"
  }' \
  -o result.json
```

```powershell [Windows PowerShell]
$headers = @{ Authorization = "Bearer $env:MUGUA_API_KEY" }
$body = @{
    model = "gpt-image-2"
    prompt = "一只坐在窗台上的橘猫，水彩风格"
    size = "1024x1024"
} | ConvertTo-Json -Depth 10

$result = Invoke-RestMethod -Method Post `
    -Uri "https://api-fast.668851.xyz/v1/images/generations" `
    -Headers $headers `
    -ContentType "application/json; charset=utf-8" `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
    -TimeoutSec 300

[IO.File]::WriteAllBytes("$PWD\image.png", [Convert]::FromBase64String($result.data[0].b64_json))
```

:::

生图通常需要几十秒，客户端超时应设置得比文本请求更长。

## 响应与保存

下面为结构节选：

```json
{
  "created": 1767225600,
  "data": [
    { "b64_json": "iVBORw0KGgo..." }
  ]
}
```

`gpt-image` 系列以 Base64 返回图片，解码后保存为文件。其他图片模型可能返回 `url`，通用客户端读取时两种字段都要兼容。

Bash 中可以用 Python 解码上面保存的 `result.json`：

```bash
python3 -c "import json,base64;d=json.load(open('result.json'))['data'][0];open('image.png','wb').write(base64.b64decode(d['b64_json']))"
```

## Python SDK

复用 [SDK 配置](/guide/sdk)中的 OpenAI SDK，将 Base URL 换成加速站：

```python
import base64
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["MUGUA_API_KEY"],
    base_url="https://api-fast.668851.xyz/v1",
    timeout=300.0,
    max_retries=0,
)

result = client.images.generate(
    model="gpt-image-2",
    prompt="一只坐在窗台上的橘猫，水彩风格",
    size="1024x1024",
)

with open("image.png", "wb") as file:
    file.write(base64.b64decode(result.data[0].b64_json))
```

图片按次扣费，自动重试可能重复计费，示例因此关闭了 SDK 重试。

## 常见问题

- 超时：使用加速站，调大客户端超时；超时后先查看使用日志，确认是否已经扣费再重试。
- 无可用渠道：令牌分组不提供该图片模型，切换分组或使用 `auto`。
- 参数不支持：先只保留 `model` 和 `prompt`，再逐项添加尺寸和质量。

## 官方参考

- [OpenAI Images API](https://developers.openai.com/api/reference/resources/images/methods/generate)
