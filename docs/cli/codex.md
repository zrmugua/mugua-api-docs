# Codex 安装配置

Codex 是 OpenAI 提供的命令行开发工具。配置木瓜 API 后，可以让 Codex 通过你的木瓜 API Key 调用可用模型。

::: tip
模型 ID 请从木瓜 API 控制台或模型列表接口复制。下面配置里的 `model` 需要替换成你账号可用的模型。
:::

示例里的 `your-api-key` 和 `your-model-id` 是占位内容，复制后请换成自己的真实值。

## 安装

使用 npm 安装：

```bash
npm install -g @openai/codex
```

安装完成后，可以先检查命令是否可用：

```bash
codex --version
```

## 配置

### 打开配置目录

Windows：

```text
C:\Users\你的用户名\.codex
```

macOS / Linux：

```text
~/.codex
```

如果没有 `.codex` 文件夹，可以手动创建。

### 创建 config.toml

在 `.codex` 目录下创建 `config.toml`：

```toml
model_provider = "mugua"
model = "your-model-id"
model_reasoning_effort = "high"
disable_response_storage = true

[model_providers.mugua]
name = "mugua"
base_url = "https://api.mugua.link/v1"
wire_api = "responses"
requires_openai_auth = true
```

如果你的账号只开放了部分模型，请把 `model` 改成控制台里可用的模型 ID。

### 创建 auth.json

在 `.codex` 目录下创建 `auth.json`：

```json
{
  "OPENAI_API_KEY": "echo your-api-key"
}
```

请把 `your-api-key` 替换成你在木瓜 API 控制台创建的 API Key。

## 验证配置

在终端运行：

```bash
codex
```

如果 Codex 能正常启动并调用模型，说明配置已经生效。

## 常见排查

如果提示鉴权失败，请检查：

- `auth.json` 里的 API Key 是否正确
- `OPENAI_API_KEY` 前后是否有多余空格
- API Key 是否仍然有效

如果提示模型不可用，请回到木瓜 API 控制台确认模型 ID。

如果提示接口不支持，请联系管理员确认当前账号是否支持 Codex 所需的接口能力。
