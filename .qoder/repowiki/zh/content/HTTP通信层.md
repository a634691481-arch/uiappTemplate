# HTTP 通信层

## 架构概述

HTTP 通信层位于 apis/ 目录，由三部分组成：

1. **环境配置** — 三套环境 URL 映射
2. **API 定义** — req() 工厂方法集中管理接口
3. **拦截器** — 统一请求增强 + 响应处理

## 环境配置

定义于 `apis/http.api.js`：

| 环境 | 基础 URL |
|------|---------|
| prod | `https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_prod` |
| pre | `https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_pre` |
| test | `https://travel.tasiai.cn/h5/api/tasi_travel_manage_system_test` |

当前硬编码为 `'prod'` 环境。

## API 定义模式

采用柯里化工厂函数：

```javascript
const req = (method, url) => (params) => uni.$u.http[method](url, params)
```

调用方式： `api.getOpenid({ code: 'xxx' })`

当前已定义 3 个 API：
- `getOpenid` — `POST /userEntity/wxLogins`
- `getPhoneNumber` — `POST /loginWx`
- `getUserInfo` — `GET /getSysUserInfo`

API 对象挂载到 `globalThis.api`，所有页面均可直接访问。

## 请求拦截器

定义于 `apis/http.interceptor.js`，向每个请求注入：

| 头部 | 值 |
|------|-----|
| `Authorization` | `uni.getStorageSync('uni_id_token')` 中的 token |
| `x-timestamp` | 当前时间戳 |
| `x-client-platform` | 设备平台标识 |

## 响应拦截器

统一处理响应状态码：

| 状态码 | 含义 | 行为 |
|--------|------|------|
| 0 | 业务失败 | 弹错误提示框 |
| 1 | 业务成功 | 返回 `businessData` |
| 200 | HTTP 成功兼容 | 返回 `businessData` |
| 401 | 登录过期 | 弹提示框（当前统一走 `showErrorAlert`） |
| 403 | 无权限 | 弹提示框 |
| 500 | 服务器错误 | 弹提示框 |

## 错误处理特性

- **防重复弹框**：`isShowingAlert` 标记防止多次弹框
- **可复制错误**：通过 `ENABLE_COPY_ERROR` 标志控制，弹框显示 `[错误码] 错误信息` 格式
- **错误摘要**：调用 `myfn.buildErrorSummary` 构建包含 URL / Method / Params / Response 的完整错误信息
- **复制到剪贴板**：调用 `myfn.copyToClipboard`（兼容 H5 和微信小程序）

## 安装顺序

HTTP 层在 `main.js` 中的注册顺序必须为：

1. 先安装拦截器：`app.use(httpInterceptor)`
2. 再注册 API：`app.use(httpApi)`

此顺序确保拦截器管道优先于 API 调用。
