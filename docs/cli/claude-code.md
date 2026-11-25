---
description: 通过 Anthropic Messages 协议配置 Claude Code CLI、VS Code 扩展与桌面应用。
lastVerified: "2026-11-24"
---
# Claude Code 安装配置

Claude Code 通过 Anthropic Messages 协议调用木瓜 API。令牌需要属于提供目标 Claude 模型的分组或 `auto`，见[分组与令牌](/guide/groups)。

## 安装

Windows 原生运行依赖 **Git for Windows（Git Bash）**，请先安装 [Git for Windows](https://git-scm.com/downloads/win)（保持默认选项即可），再运行官方原生安装器：

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://claude.ai/install.ps1 | iex
```

:::

安装完成后**重新打开一个终端窗口**，运行 `claude --version` 确认生效。系统要求、其他安装方式与更新说明见[官方安装文档](https://code.claude.com/docs/en/setup)。

## 1. 先验证令牌

在终端设置变量，用一条最小请求确认地址和令牌可用，再启动 Claude Code。这样出错时能分清是令牌问题还是工具配置问题。将示例中的 `your-api-key` 和 `your-model-id` 替换为你的真实令牌与模型广场中的 Claude 模型 ID：

::: code-group

```bash [macOS / Linux]
export ANTHROPIC_BASE_URL="https://api.mugua.link"
export ANTHROPIC_AUTH_TOKEN="your-api-key"

curl -sS -w '\n%{http_code}\n' -X POST "$ANTHROPIC_BASE_URL/v1/messages" \
  -H "Authorization: Bearer $ANTHROPIC_AUTH_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "your-model-id", "max_tokens": 1, "messages": [{"role": "user", "content": "."}]}'
```

```powershell [Windows PowerShell]
$env:ANTHROPIC_BASE_URL = "https://api.mugua.link"
$env:ANTHROPIC_AUTH_TOKEN = "your-api-key"

Invoke-RestMethod -Method Post -Uri "$env:ANTHROPIC_BASE_URL/v1/messages" `
    -Headers @{ "Authorization" = "Bearer $env:ANTHROPIC_AUTH_TOKEN"; "anthropic-version" = "2023-06-01" } `
    -ContentType "application/json" `
    -Body '{"model": "your-model-id", "max_tokens": 1, "messages": [{"role": "user", "content": "."}]}'
```

:::

返回以 `{"id":"msg_` 开头的 JSON 即为成功。返回“无可用渠道”说明令牌和地址正确，但分组不提供该模型；返回 `401` 则检查令牌。

`ANTHROPIC_AUTH_TOKEN` 以 `Authorization: Bearer` 发送凭据，木瓜 API 推荐使用它。Base URL 填站点根地址，Claude Code 会自动追加 `/v1/messages`，不要加 `/v1`。

## 2. 写入配置文件

在同一终端运行 `claude` 就能使用上面的变量。需要持久使用时，将配置合并到用户级 `~/.claude/settings.json`（Windows 为 `%USERPROFILE%\.claude\settings.json`，目录不存在时先新建 `.claude` 文件夹）。

<ConfigFill tool="claude-code" />

静态示例结构如下（请务必将所有占位值替换为真实令牌和模型广场中的真实模型 ID）：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.mugua.link",
    "ANTHROPIC_AUTH_TOKEN": "your-api-key",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "your-opus-model-id",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "your-sonnet-model-id",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "your-haiku-model-id"
  }
}
```

- 用户级配置对所有项目生效，也能被 VS Code 扩展和后台会话读取。配置文件与终端变量同时存在时，配置文件优先。
- 不要把令牌写进项目里的 `.claude/settings.json`，它通常会被提交到仓库。只对单个项目生效可用 `.claude/settings.local.json`，并确认它已被 git 忽略。
- 编辑已有文件时，保留其他设置并合并同名 `env` 对象。

### 模型槽位

Claude Code 按任务在 Opus、Sonnet、Haiku 三个槽位间选择模型，会话标题等后台小任务使用 Haiku 槽位。槽位的内置默认 ID 不一定在你的令牌分组中，建议像上面一样全部替换为模型广场里可用的真实模型 ID；只有一个可用模型时，三个槽位可以填同一个 ID，不要原样保留占位符。

只想固定当前会话使用的模型，也可以设置 `ANTHROPIC_MODEL`，或在会话里用 `/model` 切换。

## 3. 启动并确认

运行 `claude`，发送一条消息后执行 `/status`：

- `Anthropic base URL` 一行应显示 `https://api.mugua.link`；没有这一行说明变量没有生效。
- `Auth token` 一行应指向 `ANTHROPIC_AUTH_TOKEN`；如果显示的是 claude.ai 登录方式，说明令牌没有生效。

最后在木瓜控制台“使用日志”中核对模型、分组和扣费。

### 已登录过官方账号

设置令牌后，它会优先于已保存的 claude.ai 登录。启动时提示两个凭据来源冲突，可以运行 `/logout` 清除旧登录，只保留木瓜 API 令牌。

### 仍然要求登录

`curl` 验证成功但 Claude Code 仍显示登录界面，通常是令牌没有在首次启动前被读取：把 `ANTHROPIC_AUTH_TOKEN` 写进终端变量或用户级 `~/.claude/settings.json`，不要只写在项目级配置里。

## VS Code 扩展

扩展会读取用户级 `~/.claude/settings.json`，修改后重新加载 VS Code 窗口。第三方服务场景还需要关闭扩展的登录提示：在 VS Code 设置中搜索 “Claude Code login”，勾选 **Disable Login Prompt**，或合并以下字段到 VS Code 用户 `settings.json`：

```json
{
  "claudeCode.disableLoginPrompt": true
}
```

如果扩展仍要求登录，可以把变量直接写进 VS Code 用户设置（命令面板 → **Preferences: Open User Settings (JSON)**）：

```json
{
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_BASE_URL", "value": "https://api.mugua.link" },
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "your-api-key" }
  ]
}
```

终端里临时设置的变量，不会被从开始菜单或程序坞启动的 VS Code 读取。

## 桌面应用

Claude 桌面应用不读取 `ANTHROPIC_BASE_URL` 或 `settings.json`。需要在应用中打开 Help → Troubleshooting → Enable Developer Mode，重启后在 Developer → Configure Third-Party Inference 中填写网关地址 `https://api.mugua.link` 和令牌（字段以界面为准）。使用第三方服务时，Remote Control 等依赖 claude.ai 账号的功能不可用。

## 可选设置

以下变量都写进 `settings.json` 的 `env` 中，按需添加：

| 变量 | 作用 |
| --- | --- |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` | 设为 `1` 时不发送实验性字段，解决部分渠道报 `Extra inputs are not permitted` 等 `400` 错误 |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | 渠道上下文较小时，设为对应 token 数，让 Claude Code 提前自动压缩上下文 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 设为 `1` 时关闭遥测、版本检查等非必要请求；也会关闭自动更新，需要自行更新 |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | 设为 `1` 时尝试从网关读取模型列表，加入 `/model` 选择器 |

## 常见问题

| 现象 | 检查 |
| --- | --- |
| Windows 提示缺少 Git / 找不到 `bash.exe` | 安装 Git for Windows；若自定义了安装路径，设置系统环境变量 `CLAUDE_CODE_GIT_BASH_PATH` 指向 `bash.exe` |
| 安装后提示 `claude` 不是内部或外部命令 | 关闭并重新打开终端；确认 `%USERPROFILE%\.local\bin` 在 PATH 中 |
| `401` | 令牌是否完整有效；是否误用 `ANTHROPIC_API_KEY` 或被其他配置覆盖 |
| `404` | 实际地址是否重复出现 `/v1` |
| 无可用渠道 / 子任务失败 | 模型槽位映射的 ID 是否都已替换且在令牌分组中 |
| `400` 提示未知字段或 `Extra inputs are not permitted` | 设置 `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` |
| `400` 提示 `thinking` 或 `adaptive` | 当前渠道不支持该模型的自适应推理，换用其他分组，或联系管理员 |
| `400` 提示上下文或 token 超限 | 运行 `/compact`，并按需设置 `CLAUDE_CODE_AUTO_COMPACT_WINDOW` |
| 可以启动但消息失败 | 按[故障排查](/guide/troubleshooting)检查真实请求 |

## 官方参考

- [安装与系统要求](https://code.claude.com/docs/en/setup)
- [连接第三方网关](https://code.claude.com/docs/en/llm-gateway-connect)
- [VS Code 扩展与第三方提供商](https://code.claude.com/docs/en/vs-code)
- [环境变量参考](https://code.claude.com/docs/en/env-vars)
