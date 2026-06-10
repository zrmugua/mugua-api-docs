# Cherry Studio 配置指南

Cherry Studio 是一个跨平台 AI 桌面客户端，支持接入多个模型服务商。配置木瓜 API 后，可以在 Cherry Studio 里通过 OpenAI 兼容接口使用控制台可用模型。

示例里的 `your-api-key` 和 `your-model-id` 是占位内容，复制后请换成木瓜 API 控制台里的真实 API Key 和模型 ID。

## 准备信息

配置前先准备三项信息：

| 配置项 | 填写内容 |
| --- | --- |
| Provider Type | `OpenAI` |
| API Key | `your-api-key` |
| Base URL | `https://api.mugua.link/v1` |
| Model ID | `your-model-id` |

模型 ID 请从木瓜 API 控制台复制。不要把 API Key 发给他人，也不要放进公开截图或公开仓库。

## 下载安装

打开 Cherry Studio 官方下载页：

```text
https://docs.cherry-ai.com/docs/en-us/cherry-studio/download
```

按自己的系统选择安装包：

- Windows：选择安装版或便携版
- macOS：按 Intel / Apple Silicon 选择对应版本
- Linux：选择 AppImage、deb 或对应发行版支持的安装包

安装完成后启动 Cherry Studio。

## 添加木瓜 API 服务商

在 Cherry Studio 中按下面步骤添加自定义服务商：

1. 打开左侧的设置入口
2. 进入“模型服务”或“Model Services”
3. 点击“添加”或“+ Add”
4. 服务商名称填写 `木瓜 API`
5. 服务商类型选择 `OpenAI`
6. 保存后，在服务商列表中找到 `木瓜 API`
7. 打开启用开关

## 填写 API 配置

在 `木瓜 API` 服务商详情里填写：

```text
API Key: your-api-key
Base URL: https://api.mugua.link/v1
```

填写完成后，可以点击检查或验证按钮。如果验证失败，先检查 API Key 是否复制完整，再确认 Base URL 是否带了 `/v1`。

## 添加模型

在模型管理中点击“添加”或“+ Add”，把木瓜 API 控制台里的模型 ID 填进去。

示例：

```text
your-model-id
```

如果你有多个可用模型，可以逐个添加。模型名称建议和模型 ID 保持一致，后续排查会更清楚。

## 开始使用

回到聊天页面，选择：

```text
服务商：木瓜 API
模型：your-model-id
```

发送一条测试消息。如果能正常返回内容，说明配置已经完成。

## 常见排查

### 检查失败

优先确认：

- API Key 是否复制完整
- Base URL 是否填写为 `https://api.mugua.link/v1`
- 当前网络是否能访问 `api.mugua.link`

### 找不到模型

检查模型是否已经在 Cherry Studio 的模型管理里手动添加。模型 ID 需要和木瓜 API 控制台展示完全一致。

### 提示 401 或鉴权失败

重新复制 API Key，注意不要带入空格、换行或不可见字符。

### 提示模型不存在

回到控制台确认模型 ID，然后在 Cherry Studio 里删除旧模型并重新添加。

## 参考资料

- Cherry Studio 官方下载页：`https://docs.cherry-ai.com/docs/en-us/cherry-studio/download`
- Cherry Studio 自定义服务商文档：`https://docs.cherry-ai.com/docs/en-us/pre-basic/providers/zi-ding-yi-fu-wu-shang`
