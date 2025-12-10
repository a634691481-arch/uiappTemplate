# 项目说明（promoter-）

基于 Uni-App 的多端项目（支持 Vue2/Vue3），使用 HBuilderX 作为主要开发运行环境，并集成 TailwindCSS 与 weapp-tailwindcss 适配。

## 技术栈

- Uni-App（HBuilderX）
- Vue 2/3（项目兼容两者）
- Vite（部分平台）
- TailwindCSS + weapp-tailwindcss
- uniCloud（阿里云）

## 快速开始

1. 安装依赖（建议使用 Node.js 16+）：

   ```bash
   npm install
   ```

   安装后会自动执行 `weapp-tw patch` 以适配小程序端样式。

2. HBuilderX 运行：

   - 打开 HBuilderX，选择“文件 -> 导入 -> 从本地目录导入”，导入本项目根目录。
   - 在 HBuilderX 中选择需要运行的平台（如：H5、小程序、App），点击“运行”即可预览。

3. 目录结构简述：
   - `pages/` 页面目录（如：`index/index.vue`、`login/index.vue`）
   - `components/` 通用组件（如：`tasi-*` 系列、`z-paging` 等）
   - `store/` Vuex 模块（`modules/$app.js`、`modules/$user.js`）
   - `uni_modules/` 各第三方/业务模块（如：`vk-uview-ui`、`z-paging`、`rt-uni-update`）
   - `uniCloud-aliyun/` 云函数与数据库配置
   - `common/` 公共样式与工具方法

## 开发说明

- TailwindCSS：已配置 `tailwind.config.js`，样式通过 weapp-tailwindcss 适配到小程序端。
- 组件动画：可使用 `@formkit/auto-animate`（例如在 `pages/index/index.vue` 里通过 `v-auto-animate` 指令）。
- 代码风格：项目包含 `.prettierrc`，可使用 Prettier 格式化。

## 构建与发布

- 推荐使用 HBuilderX 的打包流程（根据目标平台选择打包选项）。
- 如果需要 CLI 方式，请参考 Uni-App 官方文档配置对应平台的构建命令（本项目 `package.json` 未提供统一的构建脚本）。

## Git 工作流（推送到 dev 分支）

仓库的 `main` 分支为受保护分支，不能直接推送。请使用 `dev` 分支。

- 创建并切换到本地 `dev` 分支：

  ```bash
  git checkout -b dev
  ```

- 提交并推送：
  ```bash
  git add .
  git commit -m "feat: 更新页面与动画效果"
  git push -u origin dev
  ```

如果当前不想切分支，也可将当前分支的提交直接推送到远程 `dev`：

```bash
git push -u origin HEAD:dev
```

如遇认证问题，建议启用凭据管理器：

```bash
git config --global credential.helper manager-core
```

## 许可

本项目使用 MIT 许可（详见 `LICENSE.md`）。
