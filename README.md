# 木瓜 API 文档站

这是木瓜 API 的官方使用文档站，基于 VitePress 构建。

文档面向需要接入木瓜 API 的开发者，覆盖平台介绍、快速接入、鉴权安全、SDK 调用、CLI 工具配置、API 参考和常见问题。

## 文档内容

- 使用指南：平台介绍、接入地址、快速开始、鉴权与安全、SDK 配置、额度与计费
- CLI 工具配置：CC Switch、Claude Code、Codex、AIO Coding Hub、OpenCode、OpenClaw
- 客户端配置：Cherry Studio
- API 参考：模型列表、聊天补全、错误处理
- 帮助内容：常见问题和排查建议

## 本地启动

如果你的电脑已经安装了 Node.js 和 npm，可以运行：

```bash
npm install
npm run docs:dev
```

如果终端提示找不到 `npm`，请先安装 Node.js 20 或更高版本。

本地 Codex 环境也可以运行项目里的脚本：

```powershell
.\start-docs.ps1
```

启动后打开：

```text
http://localhost:5173/
```

## 项目结构

- `docs/index.md`：首页
- `docs/guide/*.md`：使用指南
- `docs/cli/*.md`：CLI 工具配置
- `docs/client/*.md`：客户端配置
- `docs/reference/*.md`：API 参考
- `docs/.vitepress/config.js`：网站标题、导航、侧边栏和搜索配置
- `docs/public/logo.svg`：站点 logo

## 构建

```bash
npm run docs:build
```
