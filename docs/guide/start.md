---
description: 创建 API Key、查询可用模型，并用 Bash 或 PowerShell 完成第一次调用。
lastVerified: "2026-11-24"
---
# 快速开始

准备好木瓜 API 账号后，按下面步骤完成一次文本调用。只想配置开发工具，可以直接查看[工具接入](/guide/tools)。

## 1. 准备令牌和模型

1. 在[木瓜 API 控制台](https://api.mugua.link)注册账号（邮箱验证或 GitHub 登录），在“钱包管理”中充值或先签到领取额度。
2. 进入“令牌管理”，点击“添加令牌”并保存，复制 `sk-` 开头的令牌。新建令牌默认使用 `auto` 分组，也可按需在控制台切换分组，详见[分组与令牌](/guide/groups)。
3. 在“模型广场”查看当前可用的模型 ID。

| 配置 | 示例 |
| --- | --- |
| OpenAI 兼容 Base URL | `https://api.mugua.link/v1` |
| API Key | `your-api-key`（即令牌） |
| 模型 ID | 从模型广场或模型列表复制 |

`your-api-key`、`your-model-id` 都是占位值。模型名称需要与控制台提供的 ID 完全一致。

想先不写代码试一下，可以在控制台侧边栏的“操练场”、“在线聊天”或“在线生图”中直接体验。

## 2. 设置环境变量

::: code-group

```bash [macOS / Linux]
export MUGUA_API_KEY="your-api-key"
export MUGUA_MODEL="your-model-id"
```

```powershell [Windows PowerShell]
$env:MUGUA_API_KEY = "your-api-key"
$env:MUGUA_MODEL = "your-model-id"
```

:::

变量仅对当前终端及其启动的程序生效。密钥保存和多环境管理见[鉴权与安全](/guide/auth)。

## 3. 查询可用模型

::: code-group

```bash [macOS / Linux]
curl --fail-with-body --silent --show-error \
  https://api.mugua.link/v1/models \
  -H "Authorization: Bearer $MUGUA_API_KEY"
```

```powershell [Windows PowerShell]
$headers = @{ Authorization = "Bearer $env:MUGUA_API_KEY" }
$models = Invoke-RestMethod -Uri "https://api.mugua.link/v1/models" -Headers $headers
$models.data | Select-Object id
```

:::

成功时会返回带有 `data` 数组的模型列表，内容取决于令牌所在分组。选择支持 Chat Completions 的模型，将其 `id` 写入 `MUGUA_MODEL`。模型能否用于其他协议，还需要确认控制台的能力说明。

## 4. 发送生成请求

::: code-group

```bash [macOS / Linux]
curl --fail-with-body --silent --show-error \
  https://api.mugua.link/v1/chat/completions \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "model": "$MUGUA_MODEL",
  "messages": [{ "role": "user", "content": "你好，请简短介绍自己。" }]
}
EOF
```

```powershell [Windows PowerShell]
$headers = @{ Authorization = "Bearer $env:MUGUA_API_KEY" }
$body = @{
    model = $env:MUGUA_MODEL
    messages = @(@{ role = "user"; content = "你好，请简短介绍自己。" })
} | ConvertTo-Json -Depth 10

$result = Invoke-RestMethod -Method Post `
    -Uri "https://api.mugua.link/v1/chat/completions" `
    -Headers $headers `
    -ContentType "application/json; charset=utf-8" `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body))

$result.choices[0].message.content
```

:::

两个示例都直接读取第 2 步设置的 `MUGUA_API_KEY` 与 `MUGUA_MODEL`。更多参数见[聊天补全](/reference/chat-completions)。

## 5. 确认结果

成功的 Chat Completions 响应包含 `choices`，文本通常位于 `choices[0].message.content`。在控制台“使用日志”中查看本次调用的模型、分组和扣费。

| 现象 | 下一步 |
| --- | --- |
| 返回 `401` | 检查 Key 和请求头 |
| 返回 `403` | 常见为账户余额不足、令牌额度用尽或模型受限，读取错误体核对 |
| 返回 `404` 或模型错误 | 检查路径、模型 ID 和模型支持的协议 |
| 返回 `503` 提示无可用渠道 | 令牌分组不提供该模型，见[分组与令牌](/guide/groups) |
| 返回 `429` | 频率、并发或上游限流，降低并发并有限退避重试 |
| 网络错误或超时 | 按[故障排查](/guide/troubleshooting)检查网络和线路 |

## 继续接入

- 在应用里调用：[Node.js 与 Python SDK](/guide/sdk)
- 在工具里使用：[选择接入方式](/guide/tools)
- 使用其他协议：[接口协议对照](/reference/protocols)
- 处理生成过程：[流式输出](/reference/streaming)
