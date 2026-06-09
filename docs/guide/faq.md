# 常见问题

## Base URL 应该填哪个

OpenAI 兼容客户端、SDK、Codex、OpenCode、OpenClaw 通常填写：

```text
https://api.mugua.link/v1
```

Claude Code 通常填写：

```text
https://api.mugua.link
```

## API Key 可以放在前端吗

不可以。API Key 应放在服务端环境变量或安全配置中，前端页面、小程序、App 客户端和公开仓库都不应直接保存 API Key。

## 为什么提示 401

常见原因：

- API Key 填错
- 请求头没有使用 `Bearer`
- API Key 已失效
- 复制时带入了空格、换行或不可见字符

正确格式：

```http
Authorization: Bearer <API_KEY>
```

## 为什么提示模型不存在

请到控制台复制准确的模型 ID。模型 ID 需要和控制台展示完全一致。

## 为什么请求超时

可以依次检查：

- 网络是否能访问 `api.mugua.link`
- 请求内容是否过长
- 当前模型是否响应较慢
- 客户端或服务端超时时间是否太短

## CLI 工具优先看哪篇

如果同时使用多个工具，优先看 [CC Switch 统一配置](/cli/cc-switch)。

如果只使用单个工具，可以直接看对应页面：

- [Claude Code 安装配置](/cli/claude-code)
- [Codex 安装配置](/cli/codex)
- [OpenCode 配置指南](/cli/opencode)
- [OpenClaw 配置说明](/cli/openclaw)
