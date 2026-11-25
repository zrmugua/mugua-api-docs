---
description: 使用 CC Switch 管理木瓜 API 在多个开发工具中的配置。
lastVerified: "2026-11-24"
---
# CC Switch 统一配置

CC Switch 是一个跨平台桌面配置管理工具，可集中管理 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 等十余种开发工具的供应商与模型设置，还内置 Apps 管理页（可直接检测、安装与更新常用 CLI）、本地路由和自动故障切换。具体支持范围以安装版本为准。

## 安装

Windows 可从 [CC Switch 官网](https://ccswitch.io) 或 [GitHub Releases](https://github.com/farion1231/cc-switch/releases) 下载 `CC-Switch-v版本号-Windows.msi` 安装包，或 `-Portable.zip` 免安装版；ARM 设备选择带 `arm64` 的文件。

macOS 可以使用：

```bash
brew install --cask cc-switch
```

Arch Linux 可以使用 AUR：

```bash
paru -S cc-switch-bin
```

其他 Linux 发行版按 Releases 中的包类型与系统依赖选择。安装方式见[项目说明](https://github.com/farion1231/cc-switch)。

## 添加木瓜 API

1. 在侧栏选择目标工具。
2. 添加供应商，选择自定义配置。
3. 填写木瓜 API 令牌、Base URL 和目标模型 ID。
4. 保存，并按当前工具的方式启用或添加配置。
5. 重启对应 CLI 或编辑器，发送测试消息。

不同工具的字段和启用方式可能不同。建议为每个工具使用单独的令牌，并选择提供目标模型的分组或 `auto`（见[分组与令牌](/guide/groups)）。

## 地址与协议

| 目标工具 | Base URL | 协议 |
| --- | --- | --- |
| Claude Code | `https://api.mugua.link` | Anthropic Messages |
| Codex | `https://api.mugua.link/v1` | Responses |
| OpenCode | `https://api.mugua.link/v1` | 按所选 SDK 包配置 |
| OpenClaw | `https://api.mugua.link/v1` | 按 `api` 字段配置 |

模型 ID 从模型广场复制。Claude Code 的 Opus / Sonnet / Haiku 模型槽位需要映射到令牌分组中可用的模型，见 [Claude Code 模型槽位](/cli/claude-code#模型槽位)。

## 用多条线路做故障切换

CC Switch 的本地路由支持供应商队列：当前供应商请求失败时，自动切换到队列中的下一个。可以用同一个令牌添加多个木瓜 API 供应商，分别使用不同线路：

| 供应商名称 | Claude Code Base URL | Codex Base URL |
| --- | --- | --- |
| 木瓜 API 主站 | `https://api.mugua.link` | `https://api.mugua.link/v1` |
| 木瓜 API CF 站 | `https://api.668851.xyz` | `https://api.668851.xyz/v1` |

线路切换只能解决网络问题；分组无可用渠道等错误换线路也不会恢复，应修改令牌分组或使用 `auto` 的跨分组重试。自动切换也会让失败的请求重试，留意重复消耗。

## 检查生效的配置

先确认使用的是直接配置还是本地代理。代理模式下，CLI 指向本机网关，网关中的上游地址才是木瓜 API。如果本机同时安装了 AIO Coding Hub，不要同时开启两者的本地代理模式，避免互相覆盖 CLI 配置。

启用后，在对应工具内查看提供商、模型与地址（Claude Code 用 `/status`），发送消息，再到木瓜控制台“使用日志”检查记录。

- 配置未生效：检查旧环境变量、启动参数和其他配置管理工具；终端中手动设置的 `ANTHROPIC_*` 变量可能覆盖 CC Switch 写入的配置。
- 鉴权失败：检查最终使用的令牌是否有效。
- `403`：先读取响应体，常见为余额不足或令牌模型限制。
- `503` 无可用渠道：令牌分组不提供该模型。
- 协议不匹配：参考[接口协议对照](/reference/protocols)核对请求格式。

单工具手动配置也可以直接使用：[Claude Code](/cli/claude-code) · [Codex](/cli/codex) · [OpenCode](/cli/opencode) · [OpenClaw](/cli/openclaw)。

## 官方参考

- [CC Switch 官网](https://ccswitch.io)
- [CC Switch 项目与安装说明](https://github.com/farion1231/cc-switch)
- [版本下载](https://github.com/farion1231/cc-switch/releases)
