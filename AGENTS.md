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
- **Env vars**: `VITE_API_BASE_URL` (dev: `http://120.53.10.90:8963`, prod: `https://api.manpsychology.com`), `VITE_UPLOAD_BASE_URL` (both: `http://120.53.10.90:8963/api/common/upload`)

## Startup / DI Flow

Registration order in `main.js` (CRITICAL — wrong order breaks the app):

1. `uni.$zp.config['default-page-size'] = 12` — z-paging global page size
2. `app.use(uViewPro, { theme: { themes, defaultTheme: 'green', defaultDarkMode: 'light' } })` — UI framework + 9-theme config
3. `app.use(vk, config)` — vk-unicloud framework (config = whole app.config.js)
4. `app.use(store)` — Vuex store
5. `httpApi.install()` — register API definitions (must come AFTER interceptor)
6. `httpInterceptor.install()` — register request/response interceptors (called AFTER httpApi, but interceptors are installed onto the already-existent uni.$u.http instance)

Theme runtime: `App.ku.vue` wraps everything in `<u-config-provider :dark-mode="darkMode" :themes="themes" :current-theme="currentThemeName">`, which auto-injects CSS variables.

## Vite Build Pipeline

Plugins in order (vite.config.js):

| Plugin | Role | Platform |
|--------|------|----------|
| auto-pages-json | FS-watch `pages/` → auto-generates `pages.json` | All |
| code-inspector-plugin | Click-to-source in browser | All |
| weapp-tailwindcss (uvwt) | rem→rpx for mini-programs | **Only** mini-program (disabled for H5/App via `isH5 \|\| isApp`) |
| unplugin-auto-import | Auto-import `vue` + `uni-app` APIs → `typings/auto-imports.d.ts` | All |
| @uni-ku/root | Mini-program root view component | All |
| @dcloudio/vite-plugin-uni | uni-app compilation | All |

PostCSS (inline in vite.config.js, postcss.config.js is defunct): `tailwindcss → autoprefixer`

## Routing Convention

- **No manual pages.json editing**. `a-hua-auto-pages-json` plugin watches `pages/` file-system and auto-generates `pages.json`
- **Naming**: `pages/xxx/index.vue` → route `/pages/xxx/index`; `pages/xxx/yyy.vue` → route `/pages/xxx/yyy`
- **Global**: `navigationStyle: "custom"` (custom navbar), `disableScroll: true`, `enablePullDownRefresh: false`
- **~30 routes total**: 4 tabbar (index/tourGuide/consult/my) + ~24 sub-pages + 2 subpackage pages (pages_sub/)

## Architecture (Data Flow)

```
User action → vk.navigateTo (triggers checkTokenPages auth guard)
  → api.xxx(params) [globalThis.api]
    → http.interceptor.request (injects: Authorization, x-timestamp, x-client-platform)
      → server response
        → http.interceptor.response (code dispatch: 0→error, 1/200→success, 401→reauth, 403→forbidden, 500→server error)
          → showErrorAlert (isShowingAlert guard, ENABLE_COPY_ERROR clipboard)
          → Store action → auto-persist to uni.setStorageSync('lifeData') → UI update
```

## Theme System (Dual-Layer)

1. **uView Pro semantic colors** (9 themes × 20 color tokens each) — defined in `common/function/uview-pro.theme.js`. Runtime: `uni.$u.color.primary`. Activation: `useTheme()` in `App.ku.vue` → `<u-config-provider>` injects CSS variables.
2. **Light/Dark mode** (chrome colors) — `theme.json` defines navbar/tabbar/bg colors per mode. TailwindCSS `darkMode: 'class'`.
3. **CSS variable bridge** — TailwindCSS semantic classes map to CSS variables:
   - `text-primary` / `bg-primary` → `--color-primary`
   - `text-theme-text` / `bg-theme-text` → `--text-color`
   - `text-theme-bg` / `bg-theme-bg` → `--bg-color`
   - `text-theme-border` / `border-theme-border` → `--border-color`
4. **CRITICAL**: Never hardcode theme colors — always use `uni.$u.color.primary` or TailwindCSS variable classes.

## Config Center (app.config.js)

All runtime config in one file, injected into vk-unicloud via `app.use(vk, config)`:

| Key | Description |
|-----|-------------|
| `checkTokenPages` | Auth guard mode: 0=auto, 1=list-needs-login, 2=list-needs-NO-login (current). Requires `vk.navigateTo`, not `uni.navigateTo`. |
| `checkSharePages` | Share control: 0=passthrough, 1=list-sharable, 2=list-NOT-sharable |
| `globalErrorCode` | Chinese error messages for timeout/system/network errors |
| `interceptor.login/fail` | Hooks for auth fail / request fail (overridable) |
| `service.cloudStorage` | 3 providers: unicloud default + qiniu + aliyun OSS |
| `myfn` | Injects `common/function/myPubFunction.js` → `vk.myfn.xxx()` |

## HTTP & API Layer

- **Env config**: `apis/http.api.js` — 3 envs (prod/pre/test), currently hardcoded to `'prod'`
- **API pattern**: `const req = (method, url) => params => uni.$u.http[method](url, params)` — call via `api.getOpenid({...})`
- **Request interceptor**: injects `Authorization` (from `uni_id_token` storage), `x-timestamp`, `x-client-platform`
- **Response interceptor**: `CODE_HANDLERS` map — 0=biz fail, 1/200=success, 401=reauth, 403=forbidden, 500=server error. Error dialog has "copy error" button (`ENABLE_COPY_ERROR` flag) that calls `vk.myfn.copyToClipboard(vk.myfn.buildErrorSummary(res))`
- **Also available**: `vk.api.xxx()` for vk-unicloud cloud function routes

## Store (Vuex)

3 namespaced modules (`store/modules/`):
- `$app` — app init state, config, theme color, location, network
- `$user` — userInfo, permission, inviteCode, positioning
- `$tabbar` — active tab index, tab list with icon paths

Universal mutation `updateStore(state, { name, value })` supports dot-path nested updates (e.g., `$user.userInfo.name`) and auto-persists to `uni.setStorageSync('lifeData')`. `$error` module excluded from persistence via `notSaveStateKeys`.

Usage: `vk.vuex.dispatch('$user/getUserInfo')` or `vk.vuex.set('$app.color', newVal)` or `vk.getVuex('$tabbar.list')`

## Project Structure (Key Paths)

| Path | Purpose |
|------|---------|
| `pages/` | All app pages (~30 routes, no `src/` dir) |
| `components/` | 14 custom yy-* components (easycom auto-registration: `^yy-(.*)` → `@/components/yy-$1.vue`) |
| `apis/` | HTTP env config + interceptors |
| `store/modules/` | Vuex ($app, $user, $tabbar) |
| `common/function/` | 6 utility functions + 9-theme color palette |
| `common/css/` | core.scss (page layout) + uni.scss (size/spacing vars) |
| `app.config.js` | Global config center (injected into vk-unicloud) |
| `App.ku.vue` | Theme runtime wrapper (useTheme, u-config-provider) |
| `uni_modules/` | Vendor: uview-pro, vk-unicloud, z-paging, uni-id, uni-config-center, liu-slide-img |
| `js_sdk/a-hua-auto-pages-json/` | FS-based auto routing Vite plugin |
| `static/` | Static assets (images, tabbar icons) |
| `uniCloud-aliyun/` | Cloud functions (router) |
| `theme.json` | Light/dark chrome color scheme |

## Component Quick Reference

### Custom yy-* Components

| Component | Role | Key Pattern |
|-----------|------|-------------|
| `yy-paging` | List pagination (wraps z-paging) | `v-model="list" @query="queryData"`, call `paging.value?.complete(data)` |
| `yy-refresher` | Custom pull-to-refresh (GIF + status text) | Used inside yy-paging slot |
| `yy-loading` | Loading spinner | Standalone, "努力加载中..." |
| `yy-empty` | Empty state (SVG + text, click-to-reload) | Standalone |
| `yy-nomore` | "没有更多数据" footer | Must show when list exhausted |
| `yy-upload` | Image/video grid upload | Upload URL from `VITE_UPLOAD_BASE_URL` env |
| `yy-icon` | Business icon (wraps u-image) | Remote/local image icons |
| `yy-tabbar` | Bottom tab nav (data from Vuex $tabbar) | Options API computed |
| `yy-picker-modal` | Bottom popup picker | Max-height 60vh |
| `yy-tip-modal` | Info tip dialog | List-style tips with decorative title |
| `yy-theme-picker` | Theme color selector | Uses `useTheme()` API |
| `yy-dark-mode-picker` | Dark mode toggle | Based on u-popup |
| `yy-edit-information` | Edit user info popup (nickname + chooseAvatar) | Button chooseAvatar API |
| `yy-noNetwork` | No-network fullscreen overlay | Retry button |

### Third-party Components

- `u-*` — uView Pro (via easycom `^u-(.*)` → `@/uni_modules/uview-pro/components/u-$1/u-$1.vue`)
- `z-paging` — Pagination library (used through yy-paging wrapper)
- `zero-icon` — Iconify-based icons (names must include `ri:` prefix, e.g. `name="ri:user"`)
- `u-icon` — uView Pro icon (used for arrow-right: `<u-icon name="arrow-right" size="22" color="#ccc">`)

## Page Layout Patterns (TailwindCSS)

Standard root: `<view class="flex flex-col gap-3 p-3">`

- **Card**: `flex flex-col overflow-hidden bg-white rounded-lg shadow-sm`
- **Card header**: `flex items-center justify-between p-3 border-b border-gray-100`
- **Card title**: `text-sm font-medium text-gray-900`
- **List item**: `last:border-b-0 active:bg-gray-50 flex items-center justify-between px-3 py-3 transition-colors border-b border-gray-100`
- **Grid (4-col)**: `grid grid-cols-4 py-3`
- **User info row**: `flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm`
- **Text hierarchy**: title→`text-gray-900`, name→`text-gray-700`, hint→`text-gray-600`, minor→`text-gray-400`
- **Icons**: `zero-icon size="24" :color="uni.$u.color.primary"`
- **Spacing**: Always `p-3`/`gap-3`/`px-3`, prefer `gap-*` over `m-*`, use `size-*` for equal width/height

## Code Conventions

- Functions must use `function` keyword (not arrow functions) + inline comment above each
- `const`/`let` only (no `var`), async/await for async, single-responsibility (<=50 lines per function)
- Single-file Vue components, PascalCase for component files, kebab-case for page files
- Component prefixes: `yy-` (custom), `u-` (uView Pro), `vk-` (vk-unicloud), `z-` (z-paging)
- All public utility functions in `common/function/myPubFunction.js`, called via `vk.myfn.xxx()`
- API calls: `api.xxx(params)` defined in `apis/http.api.js`
- Vue and uni-app APIs are auto-imported (no need to `import { ref } from 'vue'`)

## Common Pitfalls

- **Theme must be explicitly activated**: Changing theme requires calling uView Pro's theme API — simply updating CSS variables won't work for uView components
- **zero-icon naming**: Icon names must include the `ri:` prefix (e.g., `name="ri:user"`)
- **HTTP access**: Must use `uni.$u.http`, not `uni.$http` — the uView Pro instance is the only HTTP client configured
- **H5 vs Mini-program**: TailwindCSS's `weapp-tailwindcss` plugin auto-disables for H5/App builds. Some CSS features only work on H5 (e.g., certain CSS variables in `uni.scss`)
- **z-paging**: Always use `@query` callback for data loading, call `paging.value?.complete(data)` to finish, show `yy-nomore` when no more data
- **No `src/` directory**: Pages live at project root (`pages/index/index.vue` not `src/pages/...`)
- **Auth guard**: Must use `vk.navigateTo`, not `uni.navigateTo`, for checkTokenPages to work
- **Error reproduction**: HTTP errors can be copied to clipboard via the modal's "copy error" button (controlled by `ENABLE_COPY_ERROR` flag in http.interceptor.js)
- **postcss.config.js** is defunct — PostCSS config lives in vite.config.js
- **pnpm postinstall** (`weapp-tw patch`) required after `pnpm install` for mini-program builds

## Knowledge Bases

This project has two knowledge stores (created/updated via the `/knowledge` command):

1. **Wiki Articles** (project-level, cross-module docs): 9 articles covering project overview, architecture, HTTP layer, theme system, config center, component system, build & styling, page system, third-party dependencies.
2. **Knowledge Cards** (per-module technical notes): 11 module nodes with 5 categories each (overview / architecture_design / tech_stack / coding_conventions / unique_setup_and_commands) — apis, store, common_function, app_config, components_yy_paging, components_yy_others, common_css, build_config, pages, auto_pages_json, uni_modules.

Before making significant changes, consult these stores via `list_wiki("/")` / `list_knowledge("/")` to ground your decisions in project-specific conventions and architecture decisions.
