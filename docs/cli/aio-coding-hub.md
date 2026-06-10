# AIO Coding Hub 配置指南

AIO Coding Hub 是一个本地 AI CLI 统一网关，可以让 Claude Code、Codex、Gemini CLI 等工具的请求走同一个本机入口。配置木瓜 API 后，可以把木瓜 API 作为上游供应商接入 AIO Coding Hub，再由 AIO 统一代理到各个 CLI 工具。

示例里的 `your-api-key` 和 `your-model-id` 是占位内容，复制后请换成木瓜 API 控制台里的真实 API Key 和模型 ID。

## 适合什么场景

如果你只使用一个 CLI 工具，直接看对应工具文档会更简单：

- [Claude Code 安装配置](/cli/claude-code)
- [Codex 安装配置](/cli/codex)
- [OpenCode 配置指南](/cli/opencode)

如果你同时使用多个 CLI，或者想统一管理上游、Failover、用量统计和请求日志，可以使用 AIO Coding Hub。

## 下载安装

项目地址：

```text
https://github.com/dyndynjyxa/aio-coding-hub
```

下载地址：

```text
https://github.com/dyndynjyxa/aio-coding-hub/releases
```

按系统选择安装包：

- Windows：`.msi` 或便携版压缩包
- macOS：按 Intel / Apple Silicon 选择对应压缩包
- Linux：`.deb`、AppImage 或 Wayland AppImage

Linux Arch 用户也可以使用 AUR：

```bash
paru -S aio-coding-hub-bin
```

## 添加木瓜 API 上游

启动 AIO Coding Hub 后，进入供应商页面，添加一个新的上游供应商。

推荐填写：

| 配置项 | 填写内容 |
| --- | --- |
| 名称 | `木瓜 API` |
| Base URL | `https://api.mugua.link/v1` |
| 鉴权方式 | API Key |
| API Key | `your-api-key` |

如果页面支持多个 Base URL，只填一个即可：

```text
https://api.mugua.link/v1
```

保存后启用该供应商。

## 配置模型映射

AIO Coding Hub 支持把 CLI 请求里的模型名称映射到上游模型。配置木瓜 API 时，建议把需要使用的模型槽位都映射到控制台可用模型。

示例：

| 模型槽位 | 填写内容 |
| --- | --- |
| Main Model | `your-model-id` |
| Reasoning Model | `your-model-id` |
| Haiku Model | `your-model-id` |
| Sonnet Model | `your-model-id` |
| Opus Model | `your-model-id` |

如果你只想先跑通，可以先把主模型填成 `your-model-id`。后续再根据控制台可用模型，分别配置快模型、推理模型或高能力模型。

## 打开 CLI 代理

回到首页，打开你要使用的 CLI 代理开关。

常见选择：

- 使用 Claude Code：打开 Claude Code 代理
- 使用 Codex：打开 Codex 代理
- 使用 Gemini CLI：打开 Gemini CLI 代理

AIO Coding Hub 会在本机启动网关。默认健康检查地址通常是：

```bash
curl http://127.0.0.1:37123/health
```

如果返回类似下面内容，说明本机网关已经运行：

```json
{
  "status": "ok"
}
```

## 验证调用

打开对应 CLI 工具，发送一条简单请求。

如果配置正确，你可以在 AIO Coding Hub 的控制台、请求日志或用量页面看到本次请求记录。

验证时建议同时检查：

- 请求是否命中 `木瓜 API` 供应商
- 模型是否被映射到 `your-model-id`
- 是否有 401、404、429、500 等错误
- 用量统计是否出现记录

## 常见排查

### 健康检查失败

确认 AIO Coding Hub 已经启动，并且对应 CLI 代理开关已经打开。

如果端口被占用，可以在 AIO 设置里查看实际监听端口，再用实际端口检查：

```bash
curl http://127.0.0.1:实际端口/health
```

### 提示鉴权失败

检查供应商里的 API Key 是否正确，尤其注意不要带入空格、换行或不可见字符。

### 提示模型不存在

检查模型映射是否填成了木瓜 API 控制台里的真实模型 ID。不要把 `your-model-id` 原样填进去。

### 请求没有进入 AIO

确认对应 CLI 的代理开关已经打开，并关闭可能冲突的旧环境变量或旧代理配置。

### 上游请求失败

先在 AIO 请求日志里查看错误码：

- `401`：API Key 错误或失效
- `404`：接口路径或模型不匹配
- `429`：请求过于频繁或额度不足
- `500`：稍后重试，必要时联系管理员

## 参考资料

- AIO Coding Hub GitHub：`https://github.com/dyndynjyxa/aio-coding-hub`
- AIO Coding Hub Releases：`https://github.com/dyndynjyxa/aio-coding-hub/releases`
