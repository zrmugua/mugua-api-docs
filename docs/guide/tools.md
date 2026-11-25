---
description: 按使用场景选择合适的木瓜 API 接入方式，涵盖 SDK、命令行编程工具、桌面客户端与多工具管理。
lastVerified: "2026-11-24"
---
# 选择接入方式

先确定使用场景，再选择工具和协议。每个工具页面都包含配置位置、示例与调用验证步骤。

## 应用与脚本

| 场景 | 入口 |
| --- | --- |
| 用命令行验证一次调用 | [快速开始](/guide/start) |
| Node.js 或 Python 服务 | [SDK 配置](/guide/sdk) |
| 查看三种协议的差异 | [接口协议对照](/reference/protocols) |
| 生成图片 | [图片生成](/reference/images) |

## 开发工具与客户端

| 工具 | 主要用途 | 本文档采用的协议 | 令牌分组 | 配置指南 |
| --- | --- | --- | --- | --- |
| Claude Code | 终端编程助手 | Anthropic Messages | 支持目标模型的分组或 `auto` | [安装与配置](/cli/claude-code) |
| Codex | 终端编程助手 | Responses | 支持目标模型的分组或 `auto` | [安装与配置](/cli/codex) |
| OpenCode | 终端编程助手 | Chat Completions，可切换 Responses | 支持目标模型的分组或 `auto` | [配置指南](/cli/opencode) |
| OpenClaw | 自托管助手 | Responses，可按模型切换 | 支持目标模型的分组或 `auto` | [配置说明](/cli/openclaw) |
| Cherry Studio | 桌面聊天客户端 | OpenAI 兼容或对应的自定义端点 | 支持目标模型的分组或 `auto` | [配置指南](/client/cherry-studio) |

令牌分组决定工具能调用哪些模型，机制说明见[分组与令牌](/guide/groups)，具体分组与模型对应关系以控制台为准。

编程助手除了文本生成，通常还需要模型与渠道支持工具调用和流式输出。普通文本调用成功后，再在工具中验证一次完整交互。

## 多工具配置管理

| 工具 | 工作方式 | 配置指南 |
| --- | --- | --- |
| CC Switch | 管理、切换各开发工具的供应商配置，也提供本地代理能力 | [CC Switch](/cli/cc-switch) |
| AIO Coding Hub | 本机网关统一转发请求，管理上游与调用记录 | [AIO Coding Hub](/cli/aio-coding-hub) |

直接接入时，开发工具指向木瓜 API；使用本地网关时，开发工具指向本机地址，网关上游再指向木瓜 API。排查时需要确认当前生效的链路。

## 配置前准备

1. 从控制台复制令牌和目标模型 ID，确认令牌分组提供该模型。
2. 确认目标模型支持工具所需的协议。
3. 按专页填写 Base URL，合并已有配置并保留备份。
4. 重启工具后发送实际消息，再检查平台调用记录。

模型、价格和权限以控制台为准。安装环境要求以各工具的官方文档为准，配置遇到问题时查看[故障排查](/guide/troubleshooting)。
