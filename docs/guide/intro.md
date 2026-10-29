# 平台介绍

木瓜 API 是一个模型中转平台，为应用和开发工具提供统一的模型接入入口。你可以用一个令牌（API Key），通过 OpenAI 兼容和 Anthropic 兼容协议调用 GPT、Claude、Gemini、Grok 和国产模型，并在控制台管理令牌、查看余额和使用日志。

## 入口

| 入口 | 地址 | 用途 |
| --- | --- | --- |
| 控制台 | [api.mugua.link](https://api.mugua.link) | 账号、令牌、充值、模型广场和使用日志 |
| OpenAI 兼容 Base URL | `https://api.mugua.link/v1` | OpenAI SDK、Chat Completions、Responses、图片生成 |
| Claude Code Base URL | `https://api.mugua.link` | 由工具拼接 `/v1/messages` |

另有 CF 站和加速站两条备用线路，见[线路选择](/guide/base-url#线路选择)。

## 几个基本概念

| 概念 | 说明 |
| --- | --- |
| 令牌 | 调用接口使用的 API Key，以 `sk-` 开头 |
| 分组 | 每个令牌属于一个分组，决定可用模型、渠道和倍率，见[分组与令牌](/guide/groups) |
| 额度 | 账户余额以美元额度显示，0.5 元充值 1 美元额度，见[额度与计费](/guide/billing) |
| 模型广场 | 登录后查看模型 ID、所属分组和价格 |
| 使用日志 | 每次请求的模型、分组、token 与扣费记录 |

模型、价格和账号权限以控制台为准。使用某个兼容接口时，也需要选择支持该协议的模型；兼容协议的名称并不代表上游平台的全部功能都可用。上新、调价和渠道变化会在控制台公告和[用户群](https://qm.qq.com/q/Q90cLKHh2k)中通知。

## 从你的使用场景开始

| 你想做什么 | 推荐阅读 |
| --- | --- |
| 第一次调用 API | [快速开始](/guide/start) |
| 给应用或脚本接入模型 | [SDK 配置](/guide/sdk) |
| 使用编程助手、代理工具或聊天客户端 | [工具接入](/guide/tools) |
| 查请求字段与返回结构 | [接口协议对照](/reference/protocols) |
| 定位失败的请求 | [故障排查](/guide/troubleshooting) |
| 管理密钥和调用成本 | [鉴权与安全](/guide/auth)、[额度与计费](/guide/billing) |

## 一次接入的基本流程

1. 在控制台创建令牌，并选择合适的分组。
2. 在模型广场确认可用模型 ID，以及模型支持的接口协议。
3. 按 SDK 或工具的要求填写 Base URL 和凭据。
4. 发送一条简短请求，并在使用日志中核对结果。

同一个 Key 在不同客户端中的字段名可能不同。请结合[接入地址与协议](/guide/base-url)和工具专页配置。
