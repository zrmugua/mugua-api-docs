# Claude Code 安装配置

Claude Code 是 Anthropic 提供的命令行开发工具。配置完成后，可以在终端里通过木瓜 API 使用 Claude Code。

## 安装

使用 npm 安装：

```bash
npm install -g @anthropic-ai/claude-code
```

也可以使用 pnpm：

```bash
pnpm add -g @anthropic-ai/claude-code
```

## 配置方式一：配置文件

推荐使用配置文件，配置一次后长期生效。

### 打开配置目录

Windows：

```text
%userprofile%\.claude
```

macOS / Linux：

```text
~/.claude
```

如果目录不存在，可以手动创建。

### 创建 settings.json

在 `.claude` 目录下创建 `settings.json`：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<API_KEY>",
    "ANTHROPIC_BASE_URL": "https://api.mugua.link",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "permissions": {
    "allow": [],
    "deny": []
  },
  "apiKeyHelper": "echo '<API_KEY>'"
}
```

请把 `<API_KEY>` 替换成你在木瓜 API 控制台创建的 API Key。

## 配置方式二：终端临时配置

临时配置只对当前终端窗口有效，关闭终端后需要重新设置。

PowerShell：

```powershell
$env:ANTHROPIC_BASE_URL="https://api.mugua.link"
$env:ANTHROPIC_AUTH_TOKEN="<API_KEY>"
claude
```

macOS / Linux：

```bash
export ANTHROPIC_BASE_URL="https://api.mugua.link"
export ANTHROPIC_AUTH_TOKEN="<API_KEY>"
claude
```

## VS Code 插件要求登录

如果 VS Code 里的 Claude Code 插件一直要求登录，可以在 `.claude` 目录下创建 `config.json`：

```json
{
  "primaryApiKey": "mugua"
}
```

保存后重启 VS Code，再重新打开 Claude Code。

## 验证配置

在终端运行：

```bash
claude
```

如果能正常进入 Claude Code，就说明安装和配置已经生效。
