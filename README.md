# 木瓜 API 文档站

基于 VitePress 的中文开发者文档，覆盖首次 API 调用、SDK、开发工具、客户端、协议参考和故障排查。

线上文档站：[https://docs.668851.xyz](https://docs.668851.xyz) · 控制台：[https://api.mugua.link](https://api.mugua.link) · QQ 用户群：[加入交流群](https://qm.qq.com/q/Q90cLKHh2k)

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

## 验证、生成与构建

```bash
npm run docs:llms
npm run docs:check
npm run docs:verify
npm run docs:sync-check
npm run docs:preview
```

- `docs:llms`：按侧边栏顺序自动生成 `docs/public/llms.txt` 与 `docs/public/llms-full.txt`，供 AI 编程工具直接抓取阅读。
- `docs:check`：检查每页 SEO `description`、Markdown 与导航内部链接、锚点、禁用残留词，以及 JSON、TOML、JavaScript、PowerShell、Bash 内联 JSON（与可用环境下的 Python）示例。
- `docs:verify`：依次生成 `llms.txt`、检查源码、构建站点，并检查生成 HTML 中的内部链接、锚点、本地资源以及 `sitemap.xml` / `robots.txt` / `llms.txt`。
- `docs:sync-check`：拉取线上 `https://api.mugua.link/api/status`，核对文档里的线路、充值比例、文档站域名与 QQ 群链接是否与线上配置一致。
- `docs:preview`：预览 `docs/.vitepress/dist/` 构建产物，默认端口 4173。
- `docs:build`：生成 `llms.txt` 并构建静态站点（包含 `sitemap.xml`）。

`docs:check` 不检查外部链接的网络可用性，也不执行真实 API 调用。真实调用需使用测试账号手动验证。

## 目录

| 路径 | 用途 |
| --- | --- |
| `docs/index.md` | 首页入口与介绍 |
| `docs/guide/` | 快速开始、接入地址、分组机制、工具选择、SDK、计费和排查 |
| `docs/cli/` | CLI 与配置管理工具 |
| `docs/client/` | 桌面客户端 |
| `docs/reference/` | 协议、参数、返回结构、图片生成、流式和错误处理 |
| `docs/.vitepress/config.js` | 中文导航、侧边栏、SEO（sitemap / canonical / OG）与本地搜索 |
| `docs/.vitepress/theme/` | 首页组件、交互小工具（地址复制、计费换算、配置填充）、核对日期与样式 |
| `docs/public/` | Logo、图标、`robots.txt`、`llms.txt`、`llms-full.txt` 和应用更新清单 |
| `scripts/` | 文档校验、AI 索引生成与线上配置核对脚本 |

页面继续使用原有的 `.html` 路由。新增页面时同步更新导航或相关入口，并通过 `docs:verify` 检查实际生成结果。

## 内容维护

1. 产品域名、线路、分组、充值比例、模型、价格和账号权限以木瓜 API 控制台与平台规则为准。具体分组体系、倍率和模型变化频繁，文档中不写死清单，统一指向控制台；线路与基础配置可通过 `npm run docs:sync-check` 核对。
2. 工具安装、配置字段、协议结构以工具或协议提供方的官方资料为依据，在页面末尾链接来源。
3. 以占位 Key（`your-api-key`）和占位模型 ID（`your-model-id`）编写示例；支持环境引用的工具优先使用环境变量。
4. 配置示例应注明文件位置、合并方式、协议与验证步骤。工具启动、健康检查与真实模型调用分别确认。
5. 修改后读回页面，检查代码组、交互小工具、表格、链接、浅深色外观和移动端布局，再运行 `npm run docs:verify`。
6. 更新依赖时保留锁文件，运行 `npm audit` 并完成构建检查。

`lastVerified: "YYYY-MM-DD"` 表示该页上游资料的人工核对日期，由文档页头显示。更新内容与来源后再同步日期。

应用更新清单 `docs/public/app-update.json` 由应用版本发布维护，改动文档时不要随意覆盖远端发布版本。

## 发布

将 `docs/.vitepress/dist/` 部署到静态托管服务，保留页面、`sitemap.xml`、`robots.txt`、`llms.txt` 及静态资源的目录结构。
