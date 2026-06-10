# OpenCode 配置指南

OpenCode 是一个开源 AI 编程助手，可以在终端里使用。配置木瓜 API 后，你可以通过 OpenAI 兼容接口调用控制台可用模型。

示例里的 `your-api-key` 和 `your-model-id` 是占位内容，复制后请换成控制台里的真实 API Key 和模型 ID。

## 安装

### macOS / Linux

推荐使用官方安装脚本：

```bash
curl -fsSL https://opencode.ai/install | bash
```

也可以使用包管理器安装：

```bash
npm install -g opencode-ai
```

```bash
brew install anomalyco/tap/opencode
```

Arch Linux 可以使用：

```bash
sudo pacman -S opencode
```

或安装 AUR 最新版：

```bash
paru -S opencode-bin
```

### Windows

Windows 推荐使用 WSL。如果你想在原生 Windows 下安装，可以选择下面任意一种方式。

Chocolatey：

```powershell
choco install opencode
```

Scoop：

```powershell
scoop install opencode
```

npm：

```powershell
npm install -g opencode-ai
```

Mise：

```powershell
mise use -g github:anomalyco/opencode
```

Docker：

```powershell
docker run -it --rm ghcr.io/anomalyco/opencode
```

安装完成后检查：

```bash
opencode --version
```

## 配置文件位置

OpenCode 的全局配置文件是：

```text
~/.config/opencode/opencode.json
```

Windows 对应路径是：

```text
%USERPROFILE%\.config\opencode\opencode.json
```

如果目录不存在，可以手动创建。

你也可以在项目根目录放置 `opencode.json` 作为项目级配置。项目级配置优先级更高，适合只想让某个项目使用特殊模型或特殊规则的场景。

## 手动配置

打开或创建 `opencode.json`，写入下面内容：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "mugua/your-model-id",
  "provider": {
    "mugua": {
      "npm": "@ai-sdk/openai",
      "name": "木瓜 API",
      "options": {
        "baseURL": "https://api.mugua.link/v1",
        "setCacheKey": true,
        "apiKey": "your-api-key"
      },
      "models": {
        "your-model-id": {
          "name": "your-model-id"
        }
      }
    }
  }
}
```

需要替换的地方：

- `your-api-key`：替换成木瓜 API 控制台创建的 API Key
- `your-model-id`：替换成控制台可用模型 ID

如果你有多个模型，可以继续在 `models` 里添加。

```json
"models": {
  "model-a": {
    "name": "model-a"
  },
  "model-b": {
    "name": "model-b"
  }
}
```

对应的默认模型也要同步修改：

```json
"model": "mugua/model-a"
```

## 启动使用

进入你的项目目录，然后运行：

```bash
opencode
```

如果配置正确，OpenCode 会使用木瓜 API 调用你设置的默认模型。

## 常见排查

### 配置后仍然走旧模型

检查当前项目目录下是否也有 `opencode.json`。项目级配置会覆盖全局配置。

### 提示 API Key 无效

检查 `apiKey` 是否复制完整，不要带入空格、换行或不可见字符。

### 提示模型不存在

回到木瓜 API 控制台确认模型 ID，并同步修改：

- 顶层 `model`
- `provider.mugua.models` 里的模型 ID

### 命令不存在

检查安装是否成功：

```bash
npm list -g opencode-ai
```

如果是 macOS / Linux，还要确认 npm 全局 bin 目录已经加入 `PATH`。

### Windows 体验不稳定

如果原生 Windows 下遇到终端兼容、权限或路径问题，建议改用 WSL。
