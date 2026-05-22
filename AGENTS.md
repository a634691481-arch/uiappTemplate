# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Communication Style

All replies must follow **Caveman 极简模式**. Strictly organize into four sections:

1. **结果** — directly state the final answer
2. **原因** — brief explanation of rationale  
3. **代码** — if any, only essential code blocks
4. **步骤** — if any, only key execution steps

No pleasantries, filler words, or extra explanations.

## Build & Dev Commands

This is a **uni-app (Vue 3)** project built with **HBuilderX IDE** — not CLI-based. There is no `npm run dev` or `npm run build`. Package.json only has a placeholder test script.

- **Build/Run**: Open in HBuilderX, select target platform (H5 / WeChat Mini Program / App), click "Run" or "Build"
- **Lint**: None (No ESLint). Only Prettier formatting is configured.
- **Test**: None (`npm test` is a placeholder)
- **Format**: Prettier via editor extension (config in `.prettierrc`: singleQuote, noSemi, trailingComma all, printWidth 122, arrowParens avoid)
- **postinstall**: `weapp-tw patch` — required after `pnpm install` to patch TailwindCSS for mini-program compatibility
- **Package manager**: pnpm preferred (has pnpm-lock.yaml); fallback npm (has package-lock.json)

## Project Structure (Notable)

| Path | Purpose |
|---|---|
| `pages/` | All app pages (flat directory, no `src/`) |
| `components/` | Custom business components (yy-* prefix) |
| `apis/` | HTTP API definitions + request/response interceptors |
| `store/modules/` | Vuex state modules (`$app`, `$user`, `$tabbar`) |
| `common/function/` | Utility functions + uview-pro theme config |
| `uni_modules/` | Vendor packages: uview-pro, vk-unicloud, z-paging |
| `static/` | Static assets, tabbar icons |

**28 pages registered** in `pages.json` (4 tabbar pages + 24 sub-pages). Tabbar: index, tourGuide, consult, my.

## Tech Stack

- **Framework**: uni-app (Vue 3) — cross-platform (H5, WeChat/ali/baidu/toutiao/QQ mini-programs, App)
- **UI Library**: uView Pro (u-* components via easycom auto-import)
- **Backend**: vk-unicloud (uniCloud full-stack framework, cloud functions in `uniCloud-aliyun/`)
- **State**: Vuex (3 modules, auto-persists to `uni.getStorageSync('lifeData')`)
- **HTTP**: Built-in `uni.$u.http` from uView Pro (configured in `apis/`)
- **CSS**: TailwindCSS v3.4 + SCSS (via `weapp-tailwindcss` for mini-program rem2rpx)
- **Icons**: `zero-icon` component for business icons (based on Iconify), `u-icon` for arrow-right
- **Pagination**: z-paging (`<z-paging>` or custom wrapper `<yy-paging>`)

## Theme System

Dual-layer theme architecture:

1. **uView Pro theme colors** (business accent color): 9 themes defined in `common/function/uview-pro.theme.js` (purple, green/orange, dark, pink, blue, teal, coral, amber). Initialized in `main.js` with `app.use(uViewPro, { theme: { themes, defaultTheme: 'green' } })`. Runtime access: `uni.$u.color.primary`.

2. **Light/Dark mode** (page chrome colors): Defined in `theme.json`. Controls bgColor, navBar, tabBar colors. CSS variables in `pages.json` global style.

3. **TailwindCSS integration**: `tailwind.config.js` maps CSS variables to semantic colors:
   - `text-primary` / `bg-primary` → `var(--color-primary)`
   - `text-theme-text` / `bg-theme-bg` / `border-theme-border`

**Critical rule**: Theme color must **never** be hardcoded — always use `uni.$u.color.primary` or Tailwind CSS variable classes.

## Code Conventions (from `.qoder/rules/project-rules.md`)

- Functions must use `function` keyword (not arrow functions) + inline comment above each
- `const`/`let` only (no `var`), async/await for async, single-responsibility (<=50 lines per function)
- Single-file Vue components, PascalCase for component files, kebab-case for page files
- Custom components: `yy-` prefix; Third-party uView: `u-` prefix
- All public utility functions in `common/function/myPubFunction.js`, called via `vk.myfn.xxx()`
- API calls: `api.xxx(params)` defined in `apis/http.api.js`

## Page Layout Patterns (TailwindCSS)

Standard page structure: root `<view class="flex flex-col gap-3 p-3">`

Common patterns:
- **Card**: `flex flex-col overflow-hidden bg-white rounded-lg shadow-sm`
- **Card header**: `flex items-center justify-between p-3 border-b border-gray-100`
- **Card title**: `text-sm font-medium text-gray-900`
- **List item**: `last:border-b-0 active:bg-gray-50 flex items-center justify-between px-3 py-3 transition-colors border-b border-gray-100`
- **Grid (4-col)**: `grid grid-cols-4 py-3`
- **User info row**: `flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm`
- **Text hierarchy**: title→`text-gray-900`, name→`text-gray-700`, hint→`text-gray-600`, minor→`text-gray-400`
- **Icons**: `zero-icon size="24" :color="uni.$u.color.primary"`, arrow→`<u-icon name="arrow-right" size="22" color="#ccc">`
- **Spacing**: Always `p-3`/`gap-3`/`px-3`, prefer `gap-*` over `m-*`, use `size-*` for equal width/height

## HTTP & API Layer

- **Base URL**: Configured in `apis/http.api.js` (3 environments: prod/pre/test, currently `prod`)
- **API call pattern**: `req(method, url)` returns `(params) => uni.$u.http[method](url, params)` — call as `api.getOpenid({...})`
- **Request interceptor** (`apis/http.interceptor.js`): Auto-injects `Authorization` header (token from `uni.getStorageSync('uni_id_token')`), `x-timestamp`, `x-client-platform`
- **Response interceptor**: Unified error handling with modal dialog + "copy error" to clipboard. Response codes: 1/200=success, 0=biz error, 401=reauth, 403=forbidden, 500=server error
- Also available: `vk.api.xxx()` pattern for vk-unicloud cloud function routes

## Store (Vuex)

3 namespaced modules (`store/modules/`):
- `$app` — app init state, config, theme color, location
- `$user` — userInfo, permission, inviteCode, positioning
- `$tabbar` — active tab index, tab list with icons/paths

Universal mutation `updateStore(state, { name, value })` supports dot-path nested updates (e.g., `$user.userInfo`) and auto-persists to `uni.setStorageSync('lifeData')`.

Usage: `uni.vk.vuex.dispatch('$user/getUserInfo')` or `store.commit('updateStore', { name: '$user.userInfo', value: {...} })`

## Component Quick Reference

| Component | Package | Usage |
|---|---|---|
| `yy-paging` | custom (wraps z-paging) | List pages with pagination, call `paging.value?.complete(data)` in `@query` |
| `yy-empty` | custom | Empty state placeholder |
| `yy-loading` | custom | Loading spinner |
| `yy-nomore` | custom | "No more data" indicator (must show when list exhausted) |
| `yy-tip-modal` | custom | Prompt/tip modal dialog |
| `yy-theme-picker` | custom | Theme color selector UI |
| `yy-dark-mode-picker` | custom | Dark/light mode toggle |
| `yy-picker-modal` | custom | Generic picker/popup selector |
| `yy-icon` | custom (wraps zero-icon) | Business icons |
| `yy-upload` | custom | File upload with preview |
| `z-paging` | uni_modules | Underlying pagination component, used via `yy-paging` wrapper |

## Common Pitfalls

- **Theme must be explicitly activated**: Changing theme requires calling uView Pro's theme API — simply updating CSS variables won't work for uView components
- **zero-icon naming**: Icon names must include the `ri:` prefix (e.g., `name="ri:user"`)
- **HTTP access**: Must use `uni.$u.http`, not `uni.$http` — the uView Pro instance is the only HTTP client configured
- **H5 vs Mini-program**: TailwindCSS's `weapp-tailwindcss` plugin auto-disables for H5/App builds. Some CSS features only work on H5 (e.g., certain CSS variables in `uni.scss`)
- **z-paging**: Always use `@query` callback for data loading, call `paging.value?.complete(data)` to finish, show `yy-nomore` when no more data
- **No `src/` directory**: Pages live at project root (`pages/index/index.vue` not `src/pages/...`)
- **Auto-imports**: Vue and uni-app APIs are auto-imported (no need to `import { ref } from 'vue'`)
- **Error reproduction**: HTTP errors can be copied to clipboard via the modal's "copy error" button (controlled by `ENABLE_COPY_ERROR` flag in http.interceptor.js)
