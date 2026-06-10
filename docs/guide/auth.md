# 鉴权与安全

木瓜 API 使用 Bearer Token 进行鉴权。每次请求都需要在请求头里带上 API Key。

## 请求头

```http
Authorization: Bearer your-api-key
Content-Type: application/json
```

## API Key 放在哪里

推荐放在服务端环境变量里：

```bash
MUGUA_API_KEY=你的 API Key
```

不要把 API Key 写在：

- 前端页面源码
- 小程序端代码
- App 客户端代码
- 公开 Git 仓库
- 可被他人看到的截图或日志

## 多环境管理

正式项目建议至少区分两个 Key：

- 开发环境 Key：用于本地调试
- 生产环境 Key：用于线上服务

如果 Key 泄露，请立即在控制台删除或重置。

## 服务端转发

浏览器前端不要直接请求木瓜 API。推荐流程是：

```text
浏览器前端 -> 你的后端服务 -> 木瓜 API
```

这样可以避免 API Key 暴露，也方便你做用户鉴权、限流、日志和费用控制。
