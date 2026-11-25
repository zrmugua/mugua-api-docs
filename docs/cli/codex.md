---
description: 使用环境变量和自定义提供商，将 Codex CLI 与 IDE 扩展连接到木瓜 API 的 Responses 接口。
lastVerified: "2026-11-24"
---
# Codex 安装配置

Codex CLI 使用 Responses 协议接入木瓜 API。需要为它选择支持 Responses、流式输出和工具调用的模型，令牌应属于提供目标模型的分组或 `auto`，见[分组与令牌](/guide/groups)。

## 安装

::: code-group

```bash [macOS / Linux]
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

```bash [npm（Windows / 跨平台）]
npm install -g @openai/codex
```

:::

- Windows 原生使用 `npm` 安装需要先准备好 Node.js；如果使用 WSL，请在 WSL 终端内单独安装 Linux 版 Node.js 与 Codex，不要与 Windows 侧的 `npm` 混用。
- 安装后运行 `codex --version`。Homebrew 等其他安装方式见 [Codex 官方文档](https://learn.chatgpt.com/docs/codex/cli)。

## 设置凭据

Codex 从环境变量读取令牌。建议持久保存，这样从 IDE 或新终端启动时也能读到：

::: code-group

```bash [macOS / Linux]
echo 'export MUGUA_API_KEY="your-api-key"' >> ~/.zshrc
source ~/.zshrc
```

```powershell [Windows PowerShell]
[Environment]::SetEnvironmentVariable("MUGUA_API_KEY", "your-api-key", "User")
$env:MUGUA_API_KEY = "your-api-key"
```

:::

使用 Bash 时把 `~/.zshrc` 换成 `~/.bashrc`。Windows 第一行写入用户环境变量，第二行让当前终端立即生效；之后打开的终端和重新启动的 VS Code 都能读取。更多方式见[鉴权与安全](/guide/auth)。

## 配置提供商

用户配置文件位于 `~/.codex/config.toml`，Windows 对应 `%USERPROFILE%\.codex\config.toml`。如果设置了 `CODEX_HOME`，配置目录随之改变。首次使用若 `.codex` 目录尚不存在，先手动创建该目录。

<ConfigFill tool="codex" />

先备份现有文件，将以下字段合并进去；TOML 同名字段和表只能定义一次，顶层字段要写在所有 `[表]` 之前。将 `your-model-id` 替换为模型广场中的模型 ID。

```toml
model_provider = "mugua"
model = "your-model-id"

[model_providers.mugua]
name = "木瓜 API"
base_url = "https://api.mugua.link/v1"
env_key = "MUGUA_API_KEY"
wire_api = "responses"
```

- `env_key` 指定读取凭据的环境变量，这个提供商使用自己的令牌，已保存的 ChatGPT 登录可以继续保留；如果旧登录导致冲突，可运行 `codex logout` 清除后再试。
- `wire_api` 目前只支持 `responses`，省略时也默认使用它。
- 提供商 ID 不能使用保留名称 `openai`、`ollama`、`lmstudio`，这里使用 `mugua`。
- 提供商字段只能写在用户级配置中。项目里的 `.codex/config.toml` 设置 `model_provider`、`model_providers` 会被忽略，并在启动时提示警告。

### 可选设置

基础调用成功后，可以按需在顶层或提供商表中添加：

```toml
model_reasoning_effort = "medium"

[model_providers.mugua]
name = "木瓜 API"
base_url = "https://api.mugua.link/v1"
env_key = "MUGUA_API_KEY"
wire_api = "responses"
request_max_retries = 4
stream_max_retries = 5
stream_idle_timeout_ms = 300000
```

| 字段 | 说明 |
| --- | --- |
| `model_reasoning_effort` | 推理强度，如 `low`、`medium`、`high`、`xhigh`，可用档位取决于模型 |
| `request_max_retries` | 请求失败重试次数，默认 4 |
| `stream_max_retries` | 流中断后的重试次数，默认 5 |
| `stream_idle_timeout_ms` | 流空闲超时，默认 300000 毫秒；渠道响应慢时可适当调大 |

这段示例是合并后的完整样子，不要和上面的 `[model_providers.mugua]` 重复定义。

## 验证一次调用

在项目目录运行 `codex`，打开 `/status` 检查当前模型与提供商，再发送“请简短介绍自己”。

正常返回后，在木瓜控制台“使用日志”中核对本次调用。启动界面出现只说明程序运行成功；模型生成需要实际请求验证。

## IDE 扩展

VS Code 等编辑器中的 Codex 扩展与 CLI 共用 `~/.codex/config.toml`。修改配置或环境变量后，完全退出并重新打开编辑器，确保扩展进程读到 `MUGUA_API_KEY`。

## 常见问题

| 现象 | 检查 |
| --- | --- |
| 提示缺少 `MUGUA_API_KEY` | 变量是否已持久保存；IDE 是否在设置后重新启动 |
| 修改后仍走旧提供商或旧登录 | 检查用户配置、`--profile` / `-c` 覆盖项和配置管理工具；必要时运行 `codex logout` |
| 启动提示项目配置被忽略 | 提供商字段写在了项目级 `.codex/config.toml`，移到用户级配置 |
| `404` 或不支持接口 | 最终路径应为 `/v1/responses`，并确认模型支持 Responses |
| 无可用渠道 | 令牌分组不提供该模型，在令牌管理中切换支持该模型的分组或 `auto` |
| 当前分组偶发不可用 | 在令牌管理中切换其他分组，或使用 `auto` 并开启跨分组重试 |
| 长任务中途断流 | 调大 `stream_idle_timeout_ms`，或换用更稳定的分组 / 线路 |
| 模型已下线 | 查看控制台公告或 [QQ 用户群](https://qm.qq.com/q/Q90cLKHh2k)通知，替换 `model` 为在售的模型 ID |
| 参数不支持 | 先使用最小配置，再逐项添加 `model_reasoning_effort` 等选项 |

## 官方参考

- [Codex CLI 官方文档](https://learn.chatgpt.com/docs/codex/cli)
- [自定义模型提供商与配置层级](https://learn.chatgpt.com/docs/config-file/config-advanced)
- [配置字段参考](https://learn.chatgpt.com/docs/config-file/config-reference)
