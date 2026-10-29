# 木瓜 API 文档站

基于 VitePress 的中文开发者文档，覆盖首次 API 调用、SDK、开发工具、客户端、协议参考和故障排查。

## 本地开发

使用 Node.js 24 LTS（项目要求 22.12.0 及以上），在项目目录运行：

```bash
npm ci
npm run docs:dev
```

默认访问 [http://localhost:5173](http://localhost:5173)。Windows 也可运行：

```powershell
.\start-docs.ps1
```

启动脚本优先使用系统 Node.js，并支持 `work/node/` 中的便携运行时。首次使用仍需安装依赖。

## 验证与构建

```bash
npm run docs:check
npm run docs:verify
npm run docs:preview
```

- `docs:check`：检查 Markdown 与导航内部链接、锚点、JSON、TOML 和 JavaScript 示例；Windows 下还会用 PowerShell 语法解析器检查对应示例。检查不会执行 API 调用。
- `docs:verify`：依次检查源码、构建站点、检查生成 HTML 中的内部链接、锚点和本地资源，包含首页组件生成的链接。
- `docs:preview`：预览 `docs/.vitepress/dist/` 构建产物，默认端口 4173。
- `docs:build`：仅构建静态站点，保留 VitePress 的断链检查。

`docs:check` 不检查所有外部链接的网络可用性，也不验证模型、Key 权限或上游请求能否成功。真实调用需使用测试账号手动验证。

## 目录

| 路径 | 用途 |
| --- | --- |
| `docs/index.md` | 首页入口与介绍 |
| `docs/guide/` | 快速开始、接入地址、工具选择、SDK、计费和排查 |
| `docs/cli/` | CLI 与配置管理工具 |
| `docs/client/` | 桌面客户端 |
| `docs/reference/` | 协议、参数、返回结构、流式和错误处理 |
| `docs/.vitepress/config.js` | 中文导航、侧边栏与本地搜索 |
| `docs/.vitepress/theme/` | 首页组件、资料核对日期与主题样式 |
| `docs/public/` | Logo、图标和应用更新清单 |
| `scripts/check-docs.mjs` | 文档验证脚本 |

页面继续使用原有的 `.html` 路由。新增页面时同步更新导航或相关入口，并通过 `docs:verify` 检查实际生成结果。

## 内容维护

1. 产品域名、线路、分组、充值比例、模型、价格和账号权限以木瓜 API 控制台与平台规则为准。控制台为 New API，公开配置可从 `https://api.mugua.link/api/status`（线路、公告、FAQ、充值比例）和 `/api/user/groups`（分组列表）核对。分组倍率和具体模型变化频繁，文档中不写死数值。
2. 工具安装、配置字段、协议结构以工具或协议提供方的官方资料为依据，在页面末尾链接来源。
3. 以占位 Key 和模型 ID 编写示例；支持环境引用的工具优先使用环境变量。
4. 配置示例应注明文件位置、合并方式、协议与验证步骤。工具启动、健康检查与真实模型调用分别确认。
5. 修改后读回页面，检查代码组、表格、链接、浅深色外观和移动端目录，再运行验证命令。
6. 更新依赖时保留锁文件，运行 `npm audit` 并完成构建检查。

`lastVerified: "YYYY-MM-DD"` 表示该页上游资料的人工核对日期，由文档页头显示。它不代表木瓜 API 的全部功能在当天经过真实账号测试。更新内容与来源后再同步日期。

已核对的工具页覆盖 Codex、Claude Code、OpenCode、OpenClaw、CC Switch、AIO Coding Hub 和 Cherry Studio；协议页提供相应官方参考。具体版本要求在各专页说明。

应用更新清单 `docs/public/app-update.json` 由应用版本发布维护，字段应与实际包和更新地址一致。

## 发布

将 `docs/.vitepress/dist/` 部署到静态托管服务，保留页面与资源的目录结构。生产文档站域名确认后，可在 VitePress 配置中补充 `hostname` 对应的 sitemap 配置。
