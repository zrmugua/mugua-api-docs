# 快速开始

这篇文档带你完成第一次调用。木瓜 API 采用 OpenAI 兼容调用方式，通常只需要配置两项：

- `baseURL`：`https://api.mugua.link/v1`
- `apiKey`：在控制台创建的 API Key

文档里的 `your-api-key` 和 `your-model-id` 是示例占位内容，复制代码后请替换成控制台里的真实 API Key 和模型 ID。

## 1. 登录控制台

打开：

```text
https://api.mugua.link
```

登录后进入 API Key 管理页面，创建一个新的 API Key。

## 2. 保存 API Key

API Key 只会用于服务端调用，请不要放在浏览器前端代码、公开仓库或截图里。

推荐用环境变量保存：

```bash
export MUGUA_API_KEY="your-api-key"
```

PowerShell 可以这样写：

```powershell
$env:MUGUA_API_KEY="your-api-key"
```

## 3. 发送一次请求

下面用 `curl` 调用聊天补全接口：

```bash
curl https://api.mugua.link/v1/chat/completions \
  -H "Authorization: Bearer $MUGUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-id",
    "messages": [
      {
        "role": "user",
        "content": "你好，请用一句话介绍木瓜 API"
      }
    ]
  }'
```

## 4. 下一步

- [平台介绍](/guide/intro)
- [接入地址](/guide/base-url)
- [鉴权与安全](/guide/auth)
- [SDK 配置](/guide/sdk)
- [额度与计费](/guide/billing)
- [CC Switch 统一配置](/cli/cc-switch)
- [API 参考](/reference/models)
