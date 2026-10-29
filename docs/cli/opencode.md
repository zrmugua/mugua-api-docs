---
description: 配置 OpenCode 自定义提供商，并按模型选择 Chat Completions 或 Responses。
lastVerified: "2026-10-29"
---
# OpenCode 配置指南

OpenCode 支持通过不同 AI SDK 包接入模型。下面先使用 Chat Completions；需要 Responses 时按下文切换。

## 安装

::: code-group

```bash [安装脚本]
curl -fsSL https://opencode.ai/install | bash
```

```bash [npm]
npm install -g opencode-ai
```

:::

安装后运行 `opencode --version`。Windows 官方推荐在 WSL 中安装和运行，也可以用 `scoop install opencode` 或 `choco install opencode`。其他方式见 [OpenCode 官方文档](https://opencode.ai/docs/)。

## 准备凭据

二选一即可：

**方式一：环境变量**，配合下文配置中的 `{env:MUGUA_API_KEY}` 使用。

::: code-group

```bash [macOS / Linux]
export MUGUA_API_KEY="your-api-key"
```

```powershell [Windows PowerShell]
$env:MUGUA_API_KEY = "your-api-key"
```

:::

变量只对当前终端生效，需要从这个终端启动 OpenCode；持久保存见[鉴权与安全](/guide/auth)。

**方式二：`/connect` 保存令牌**。启动 `opencode`，运行 `/connect`，滚动到最后选择 **Other**，ID 填 `mugua`，再粘贴令牌。令牌保存在 `~/.local/share/opencode/auth.json`，此时配置中可以省略 `options.apiKey`。`/connect` 只保存凭据，仍需要按下文创建提供商配置。

## 创建配置

全局配置：`~/.config/opencode/opencode.json`。Windows 对应 `%USERPROFILE%\.config\opencode\opencode.json`。

也可以使用项目根目录的 `opencode.json`。配置会按层级合并，同一字段由更高优先级的配置覆盖。编辑前备份并合并已有内容。

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "mugua/your-model-id",
  "provider": {
    "mugua": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "木瓜 API",
      "options": {
        "baseURL": "https://api.mugua.link/v1",
        "apiKey": "{env:MUGUA_API_KEY}"
      },
      "models": {
        "your-model-id": {
          "name": "your-model-id",
          "limit": {
            "context": 200000,
            "output": 32000
          }
        }
      }
    }
  }
}
```

- 将所有 `your-model-id` 替换成真实模型 ID，多个模型就在 `models` 中添加多项。
- `{env:MUGUA_API_KEY}` 是 OpenCode 的变量引用语法，保持这一写法；使用 `/connect` 保存令牌时可以删除 `apiKey` 一行。
- `limit` 是自定义提供商需要手动填写的上下文和输出上限，OpenCode 据此判断何时压缩上下文。示例数值仅为占位，按模型实际能力填写。

## 按协议选择 SDK 包

| 目标协议 | `provider.mugua.npm` | 最终路径 |
| --- | --- | --- |
| Chat Completions | `@ai-sdk/openai-compatible` | `/v1/chat/completions` |
| Responses | `@ai-sdk/openai` | `/v1/responses` |
| Anthropic Messages | `@ai-sdk/anthropic` | `/v1/messages` |

三种包的 `baseURL` 都填 `https://api.mugua.link/v1`。GPT 系列建议使用 Responses，Claude 系列可以使用 Anthropic Messages。同时使用多种协议时，可以按包分别建立 `mugua-openai`、`mugua-claude` 等多个提供商。

切换协议时同时确认模型及渠道支持目标接口，令牌分组也要提供对应模型，见[分组与令牌](/guide/groups)。

编程流程还需要工具调用和流式输出支持。协议名称一致只是接入的第一步，建议通过一次实际任务验证完整交互。

## 验证配置

1. 在项目目录运行 `opencode`。
2. 使用 `/models` 查看并选择 `mugua` 下的模型。
3. 发送一条简短消息。
4. 在木瓜控制台确认模型和调用结果。

## 常见问题

| 现象 | 检查 |
| --- | --- |
| 仍使用旧模型 | 项目级配置、环境指定的配置文件、启动参数和已保存的模型选择 |
| 鉴权失败 | 启动进程能否读取 `MUGUA_API_KEY` |
| 接口不支持 | SDK 包、模型与协议是否匹配 |
| 模型不存在 | 顶层 `model` 和 `models` 的键是否使用同一个真实 ID |
| 无可用渠道 | 令牌分组是否提供该模型 |
| 长对话报上下文超限 | 按模型实际能力调小 `limit.context` |

## 官方参考

- [自定义提供商与 SDK 选择](https://opencode.ai/docs/providers/#custom-provider)
- [配置层级与环境变量](https://opencode.ai/docs/config/)
