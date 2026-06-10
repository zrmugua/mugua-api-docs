# OpenClaw 配置说明

OpenClaw 是一个可自托管的 AI 助手/代理工具。配置木瓜 API 后，可以让 OpenClaw 通过 OpenAI Responses 兼容格式调用可用模型。

示例里的 `your-api-key` 和 `your-model-id` 是占位内容，不是固定写法。复制配置后，请替换成控制台里的真实 API Key 和模型 ID。

## 安装前准备

OpenClaw 官方推荐 Node.js 24，也支持 Node.js 22.14+。Windows 用户可以使用原生 PowerShell 安装，也可以使用 WSL2。

检查 Node.js 版本：

```bash
node --version
```

## 安装

macOS / Linux / WSL2：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

Windows PowerShell：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

如果你已经自己管理 Node.js，也可以用 npm 安装：

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

## 安装后检查

安装完成后运行：

```bash
openclaw --version
openclaw doctor
openclaw gateway status
openclaw dashboard
```

常用检查命令说明：

- `openclaw --version`：确认命令可用
- `openclaw doctor`：检查配置问题
- `openclaw gateway status`：检查 Gateway 是否运行
- `openclaw dashboard`：打开控制台页面

## 配置文件位置

OpenClaw 的主要配置文件是：

```text
openclaw.json
```

推荐放在用户目录下：

```text
~/.openclaw/openclaw.json
```

Windows 原生环境可以放在：

```text
C:\Users\你的用户名\.openclaw\openclaw.json
```

如果你想强制指定配置文件路径，可以设置环境变量 `OPENCLAW_CONFIG_PATH`。

PowerShell 示例：

```powershell
$env:OPENCLAW_CONFIG_PATH="C:\path\to\openclaw.json"
openclaw doctor
```

macOS / Linux 示例：

```bash
export OPENCLAW_CONFIG_PATH="$HOME/.openclaw/openclaw.json"
openclaw doctor
```

## 木瓜 API 配置示例

木瓜 API 的 OpenAI 兼容接口地址：

```text
https://api.mugua.link/v1
```

OpenClaw 接入 OpenAI Responses 兼容接口时，配置里的 `api` 使用：

```json
"api": "openai-responses"
```

下面是最小配置示例。请把 `your-api-key` 和 `your-model-id` 替换成你在木瓜 API 控制台里的真实信息。

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "mugua": {
        "baseUrl": "https://api.mugua.link/v1",
        "apiKey": "your-api-key",
        "api": "openai-responses",
        "models": [
          {
            "id": "your-model-id",
            "name": "your-model-id"
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

## 必须修改的地方

你至少要改三处：

- 配置里的 `apiKey`：改成木瓜 API 控制台创建的 API Key
- 模型列表里的 `id` 和 `name`：改成控制台可用模型 ID
- 默认模型里的 `primary`：改成 `mugua/your-model-id`

如果你的完整配置里启用了 `gateway.auth.token`，也请换成自己的随机 token，不要使用示例值。

## 使用 Codex 辅助生成配置

如果你已经配置好了 Codex，也可以让 Codex 帮你把 `.codex` 里的木瓜 API 配置整理成 OpenClaw 配置。

打开 Codex 后，可以输入：

```text
请把用户目录下 .codex 的 API 配置写入 OpenClaw 的 openclaw.json，注意使用 openai-responses 格式，Base URL 使用 https://api.mugua.link/v1。
```

生成后仍然建议手动检查：

- API Key 是否正确
- 模型 ID 是否存在
- `api` 是否为 `openai-responses`
- `primary` 是否为 `mugua/your-model-id`

## 验证配置

保存 `openclaw.json` 后运行：

```bash
openclaw doctor
openclaw models status
openclaw models list --provider mugua
openclaw gateway restart
openclaw dashboard
```

如果 `models list` 能看到木瓜 API 配置的模型，并且 dashboard 能正常打开，就说明基础配置已经完成。

## 常见排查

### openclaw 命令不存在

检查 Node.js 和全局 npm bin 路径：

```bash
node --version
npm prefix -g
```

如果是 macOS / Linux，确认全局 bin 目录已经加入 `PATH`。

### 提示鉴权失败

检查 `apiKey` 是否复制完整，尤其注意不要带入空格、换行或不可见字符。

### 提示模型不存在

回到木瓜 API 控制台确认模型 ID，然后同步修改：

- 模型列表里的 `id`
- 模型列表里的 `name`
- 默认模型里的 `primary`

### Gateway 没有启动

可以尝试：

```bash
openclaw gateway restart
openclaw gateway status
```

如果仍然失败，先运行 `openclaw doctor` 看具体错误。
