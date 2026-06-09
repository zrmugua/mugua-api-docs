# 接入地址

木瓜 API 提供控制台入口和 OpenAI 兼容 API 入口。配置 SDK、CLI 工具或第三方客户端时，最常用的是 `/v1` 接口地址。

## 控制台

```text
https://api.mugua.link
```

控制台用于管理 API Key、查看可用模型、检查余额额度和处理账号相关操作。

## API Base URL

```text
https://api.mugua.link/v1
```

适用于：

- OpenAI SDK
- Codex
- OpenCode
- OpenClaw
- 其它 OpenAI 兼容客户端

## Claude Code Base URL

```text
https://api.mugua.link
```

Claude Code 通常使用不带 `/v1` 的地址。具体配置可查看 [Claude Code 安装配置](/cli/claude-code)。

## 常见路径

| 用途 | 地址 |
| --- | --- |
| 模型列表 | `GET /v1/models` |
| 聊天补全 | `POST /v1/chat/completions` |

完整请求示例：

```text
https://api.mugua.link/v1/chat/completions
```
