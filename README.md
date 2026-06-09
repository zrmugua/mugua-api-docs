# 木瓜 API 文档站

这是木瓜 API 的 VitePress 使用文档站。

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

## 常改的文件

- `docs/index.md`：首页
- `docs/guide/intro.md`：平台介绍
- `docs/guide/base-url.md`：接入地址
- `docs/guide/start.md`：快速开始
- `docs/guide/auth.md`：鉴权与安全
- `docs/guide/sdk.md`：SDK 配置
- `docs/guide/billing.md`：额度与计费
- `docs/guide/faq.md`：常见问题
- `docs/cli/*.md`：CLI 工具安装配置、CC Switch、OpenCode 和 OpenClaw 配置
- `docs/reference/*.md`：API 参考
- `docs/.vitepress/config.js`：网站标题、导航、侧边栏和搜索配置
- `docs/public/logo.svg`：网站 logo

## 打包

```bash
npm run docs:build
```

## 部署建议

推荐使用 Cloudflare Pages 部署。

部署参数：

```text
Build command: npm run docs:build
Build output directory: docs/.vitepress/dist
Node.js version: 20 或更高
```

部署流程：

1. 把项目推送到 GitHub。
2. 在 Cloudflare Pages 新建项目。
3. 连接 GitHub 仓库。
4. 按上面的部署参数填写构建设置。
5. 部署完成后绑定自己的文档域名。
