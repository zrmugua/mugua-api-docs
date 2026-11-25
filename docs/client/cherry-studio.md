---
description: 在 Cherry Studio 中添加木瓜 API 服务商，选择端点并配置模型。
lastVerified: "2026-11-24"
---
# Cherry Studio 配置指南

Cherry Studio 是桌面 AI 客户端。新版本提供自定义端点，旧版本常见界面则是服务商类型与 API 地址。按当前界面配置，并确认最终请求协议。

## 安装

从 [Cherry Studio 官网](https://cherryai.com) 或 [GitHub Releases](https://github.com/CherryHQ/cherry-studio/releases) 下载适合自己系统和处理器架构的安装包。

## 添加服务商

1. 打开设置，进入“模型服务”，点击“+ 添加”。
2. 名称填写 `木瓜 API`，填写自己的令牌。
3. 按模型协议配置端点，点击“添加”保存，并启用服务商。
4. 点击 API Key 旁的“检查”，确认令牌有效。

## 选择端点

| 协议 | Base URL | 完整请求地址 |
| --- | --- | --- |
| OpenAI / Chat Completions | `https://api.mugua.link/v1` | `https://api.mugua.link/v1/chat/completions` |
| OpenAI Responses | `https://api.mugua.link/v1` | `https://api.mugua.link/v1/responses` |
| Anthropic Messages | `https://api.mugua.link` | `https://api.mugua.link/v1/messages` |

- 如果字段要求**完整端点**，复制上表第三列；如果字段要求 **API 地址 / Base URL**，按上表第二列填写（不要把 `/chat/completions` 等后缀粘贴进 Base URL 框）。
- Cherry Studio 会在输入框下方实时预览最终请求地址：确认最终预览路径**只有一层 `/v1`**（例如 `.../v1/chat/completions` 或 `.../v1/messages`）即可。
- 新版默认可添加 OpenAI 和 Anthropic 端点，“更多设置”中还可以添加 OpenAI Responses、Gemini、图片生成和图片编辑端点；旧版界面以服务商类型选择协议。

生图时，图片生成端点同样使用主站 `https://api.mugua.link`（主站不稳定时可换 CF 站 `https://api.668851.xyz`），并核对预览路径落到 `/v1/images/generations`，见[图片生成](/reference/images)。

目标模型和渠道需要支持所选协议。

## 添加模型并测试

在服务商页面点击“获取模型列表”，从令牌分组可用的模型中选择添加；也可以点击“+”手动填写模型广场中的 ID。显示名称可以自定义，提交请求的模型 ID 必须与控制台一致。获取的列表取决于令牌分组，列表为空或缺少模型时先检查分组。

返回聊天页面，选中木瓜 API 及该模型，发送一条简短消息。随后在木瓜控制台核对模型和调用记录。客户端的连接检查与真实生成请求可能使用不同接口，建议两者都确认。

## 常见问题

- 找不到模型：检查是否手动添加，并确认当前聊天窗口选择了对应服务商。
- `401`：重新核对服务商使用的 Key。
- `404`：核对输入框下方预览的完整路径，确认没有重复 `/v1/v1` 且模型 ID 拼写正确。
- 聊天或工具能力失败：确认模型的协议、图片、流式或工具调用支持。

个人 Key 可以保存在自己的受信任客户端中；导出配置、同步、备份和截图时仍需保护凭据。

## 官方参考

- [Cherry Studio 官网](https://cherryai.com)
- [自定义服务商与端点](https://docs.cherryai.com.cn/docs/en-us/pre-basic/providers/zi-ding-yi-fu-wu-shang)
- [故障排查](/guide/troubleshooting)
