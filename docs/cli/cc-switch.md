# CC Switch 统一配置

CC Switch 是一个跨平台的 CLI 配置管理工具，可以集中管理 Claude Code、Codex、OpenClaw、Gemini CLI 等工具的 API 配置。

如果你同时使用多个命令行工具，推荐优先用 CC Switch 管理配置。这样不用分别编辑每个工具的配置文件，切换 API Key、模型和接口地址也更方便。

## 安装

项目地址：

```text
https://github.com/farion1231/cc-switch
```

下载地址：

```text
https://github.com/farion1231/cc-switch/releases
```

### Windows

打开 Releases 页面，下载 Windows 安装版或便携版。

下载后按提示安装，或直接运行便携版程序。

### macOS

如果你使用 Homebrew，可以运行：

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

### Linux

Linux 可以使用 Linuxbrew 安装：

```bash
brew tap farion1231/ccswitch
brew install cc-switch
```

也可以在 Releases 页面下载对应发行版的安装包，例如 AppImage、deb 或 rpm。

## 通用配置流程

打开 CC Switch 后，按下面流程添加木瓜 API 配置。

1. 点击“添加配置”
2. 选择要配置的工具，例如 Claude Code 或 Codex
3. 供应商选择“木瓜 API”；如果列表里没有木瓜 API，就选择自定义供应商
4. 填写 API Key
5. 填写 Base URL
6. 按控制台可用模型填写 `model`
7. 点击“添加”或“保存”
8. 重启终端或对应客户端

## Base URL 填写

不同工具的 Base URL 可能不一样。

Claude Code：

```text
https://api.mugua.link
```

Codex / OpenAI 兼容工具：

```text
https://api.mugua.link/v1
```

如果 CC Switch 里的木瓜 API 预设已经自动填好了 Base URL，一般不用手动修改。

## API Key 填写

API Key 请填写你在木瓜 API 控制台创建的令牌。

控制台地址：

```text
https://api.mugua.link
```

填写前建议确认：

- API Key 没有复制多余空格
- API Key 仍然有效
- 当前 Key 有对应模型或工具的调用权限

## 模型填写

模型 ID 请从木瓜 API 控制台复制。

常见填写方式：

- Claude Code：填写 Claude 系列模型，或按控制台说明留空
- Codex：填写 OpenAI / GPT 系列模型
- 其它外接客户端：按客户端类型和控制台模型 ID 填写

如果不确定模型名，先到控制台确认可用模型，再复制模型 ID。

## 外接调用说明

外接客户端调用时，除了 Base URL、API Key 和模型名，还可能需要补充客户端识别信息，例如 `User-Agent`。

如果出现下面问题，可以优先检查外接客户端配置：

- `403 Forbidden`
- `403 block`
- `Connection blocked`
- 请求能发出但客户端无法正常识别返回内容

## 什么时候不用 CC Switch

如果你只使用一个工具，也可以直接看对应的手动配置页：

- [Claude Code 安装配置](/cli/claude-code)
- [Codex 安装配置](/cli/codex)

需要频繁切换工具、Key 或模型时，使用 CC Switch 会更省心。

## 常见排查

### 保存配置后没有生效

先关闭并重新打开终端，再启动对应工具。

如果还不生效，检查是否有旧环境变量覆盖了 CC Switch 写入的配置。

### 提示鉴权失败

检查 API Key 是否填写正确，尤其是复制时是否带入空格、换行或不可见字符。

### 提示模型不存在

回到木瓜 API 控制台确认模型 ID，复制完整内容后重新填写。
