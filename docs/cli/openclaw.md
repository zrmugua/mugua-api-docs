---
description: 配置 OpenClaw 自定义模型提供商、凭据环境变量与默认模型。
lastVerified: "2026-11-24"
---
# OpenClaw 配置说明

OpenClaw 是一个可自托管的 AI 助手。下面通过自定义提供商接入木瓜 API 的 Responses 接口。

## 安装环境

OpenClaw 更新较快，请先按[官方安装页](https://docs.openclaw.ai/install)确认当前版本的 Node.js 要求。核对时，官方要求 Node.js 24.16.0+（24.x）或 26.1.0+，出于安全考虑建议 24.22.1+ 或 26.12.1+，并优先推荐 Node 26。安装脚本会自动处理 Node.js 依赖。

推荐使用官方安装脚本：

::: code-group

```bash [macOS / Linux / WSL2]
curl -fsSL https://openclaw.ai/install.sh | bash
```

```powershell [Windows PowerShell]
iwr -useb https://openclaw.ai/install.ps1 | iex
```

```bash [npm]
npm install -g openclaw@latest --allow-scripts=openclaw
```

:::

`--allow-scripts=openclaw` 适用于 npm 11.16 及以上版本，npm 11.15 及更早版本去掉该参数。安装后运行初始化并安装后台服务：

```bash
openclaw onboard --install-daemon
```

已有安装先备份配置，并查看上游更新说明。

## 设置凭据

OpenClaw 的后台 Gateway 守护进程不会自动继承临时终端里的环境变量。官方推荐将凭据写入全局环境文件 `~/.openclaw/.env`（Windows 为 `%USERPROFILE%\.openclaw\.env`），Gateway 启动时会自动加载：

```text
MUGUA_API_KEY="your-api-key"
```

将 `your-api-key` 替换为你的木瓜 API 令牌。如果同时希望在命令行里使用，也可以按[鉴权与安全](/guide/auth)设置系统持久环境变量。更多凭据引用方式见官方[环境变量说明](https://docs.openclaw.ai/gateway/configuration/environment-variables)。

## 合并模型配置

默认配置文件为 `~/.openclaw/openclaw.json`，Windows 对应 `%USERPROFILE%\.openclaw\openclaw.json`。自定义路径可使用 `OPENCLAW_CONFIG_PATH`。

<ConfigFill tool="openclaw" />

备份已有配置，将以下模型和默认选择合并进去：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "mugua": {
        "baseUrl": "https://api.mugua.link/v1",
        "apiKey": "${MUGUA_API_KEY}",
        "api": "openai-responses",
        "models": [
          {
            "id": "your-model-id",
            "name": "your-model-id",
            "reasoning": false,
            "input": ["text", "image"],
            "contextWindow": 200000,
            "maxTokens": 32000
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "mugua/your-model-id"
      }
    }
  }
}
```

替换所有 `your-model-id`。OpenClaw 推荐使用 GPT 系列模型，速度和稳定性较好；令牌分组需要提供所选模型，见[分组与令牌](/guide/groups)。`${MUGUA_API_KEY}` 是 OpenClaw 的环境变量引用语法，应保留。

模型条目中只有 `id` 必填：

| 字段 | 说明 |
| --- | --- |
| `reasoning` | 是否为推理模型，默认为 `false`；仅当所选模型支持推理参数时设为 `true` |
| `input` | 支持的输入类型，纯文本模型填 `["text"]`，省略时为 `["text"]` |
| `contextWindow` / `maxTokens` | 上下文与输出上限，示例数值仅为占位，按模型实际能力填写 |

`models.mode` 为 `merge`（默认）时，这些配置与 OpenClaw 内置的模型目录合并；设为 `replace` 则只使用配置中列出的模型。

## 选择协议

| 模型支持的接口 | `api` 字段 |
| --- | --- |
| Responses | `openai-responses` |
| Chat Completions | `openai-completions` |
| Anthropic Messages | `anthropic-messages` |

省略 `api` 时默认使用 `openai-completions`。只有模型支持 `/v1/responses` 时才设置 `openai-responses`，GPT 系列建议使用它；使用 Claude 原生协议时可按官方文档选用 `anthropic-messages`（并按文档确认 `baseUrl` 格式）。模型与渠道还需要支持助手所需的工具调用和流式能力。

## 验证完整链路

```bash
openclaw doctor
openclaw models list
openclaw models status
```

`doctor` 检查配置，`models list` 确认 `mugua/your-model-id` 出现在模型清单中，`models status` 显示当前默认模型与凭据概况。`models status` 本身不会调用模型。

需要真正测试一次上游调用时，先停止 Gateway 再探测：

```bash
openclaw gateway stop
openclaw models status --probe --probe-provider mugua
openclaw gateway restart
openclaw gateway status
openclaw dashboard
```

`--probe` 会发送真实请求并产生少量消耗。最后在 Dashboard 发送测试消息，并在木瓜控制台“使用日志”中核对本次调用。

切换默认模型也可以用命令完成：`openclaw models set mugua/your-model-id`。

## 常见问题

- 缺少凭据：确认已写入 `~/.openclaw/.env` 并重启 Gateway，不要只靠临时终端变量。
- 模型不可用：同步检查提供商模型列表中的 `id` 和默认模型中的 `mugua/模型ID`。
- 参数报错：非推理模型不要将 `reasoning` 设为 `true`。
- 修改无效：确认实际配置文件路径，检查已有认证配置和模型覆盖，重启 Gateway。
- 提示无可用渠道：令牌分组不提供该模型，修改分组或改用 `auto`。
- Gateway 运行但生成失败：查看错误体，按[故障排查](/guide/troubleshooting)检查上游。
- 配置字段报错：运行 `openclaw config schema` 查看当前版本支持的完整字段。

## 官方参考

- [自定义模型提供商](https://docs.openclaw.ai/gateway/config-tools/custom-providers)
- [models 命令](https://docs.openclaw.ai/cli/models)
- [环境变量与凭据引用](https://docs.openclaw.ai/gateway/configuration/environment-variables)
