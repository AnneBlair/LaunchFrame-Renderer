# LaunchFrame Renderer

简体中文 | [English](README_EN.md)

一个零依赖的 App Store 宣传图 HTML 渲染器。它把一组应用截图、Apple 设备机框和可编辑营销文案组合成可预览、可导出 PNG、可自动化截图的 iPhone 或 iPad 画布；每张输入截图对应一张独立宣传图。

![LaunchFrame Renderer preview](docs/preview.jpg)

## 当前能力

- 一次选择或继续追加最多 10 张 PNG、JPEG 或 WebP 格式的 iPhone 或 iPad 截图
- 每张截图独立编辑主标题、说明文案和填充方式，并支持调整顺序或删除
- iPhone 每张宣传图可独立选择经典主视觉、编辑式偏移、细节聚焦、双屏流转、并列对照、纵深叠层、弧形扇面、三步阶梯或无框画廊，共 9 种排版
- iPhone 整组共享瓷白、午夜、极光或电光主题，支持最多 3 张截图自动选槽和手动替换
- 为新增排版安全调整整体缩放、垂直偏移、展开度和倾斜强度，并为流程排版添加可选步骤标注
- 切换 15 款 iPhone 17、iPhone 17 Pro、iPhone 17 Pro Max 和 iPhone Air 竖版机框
- 切换 4 款 iPad Pro (M5) 11/13 英寸深空黑色或银色横版机框
- iPad 入口默认加载 `2360 × 1640` 示例截图并预选 11 英寸机框
- iPad 首批导入时按第一张截图的比例自动匹配最接近的 11/13 英寸机框
- 调整设备宽度和垂直位置
- 导出 iPhone `1320 × 2868` 或 iPad `2732 × 2048` PNG，也可按页面顺序逐张导出全部 PNG
- 提供无编辑器的纯渲染模式，便于 Playwright、Puppeteer 或其他浏览器自动化工具截图
- 不依赖框架、构建工具或第三方 JavaScript 库

## App Store 截图尺寸

iPhone 画布的 `1320 × 2868` 是 Apple 接受的 6.9 英寸 iPhone 竖版截图尺寸之一。`1242 × 2688` 也仍然有效，但对应 6.5 英寸档，并不是唯一的 iPhone 截图规格。

iPad 画布使用 `2732 × 2048` 横版尺寸，属于 Apple 接受的 13 英寸 iPad 截图尺寸。完整规格请参阅 [Apple 官方截屏规范](https://developer.apple.com/cn/help/app-store-connect/reference/app-information/screenshot-specifications/)。

## 快速开始

```bash
python3 -m http.server 4173
```

然后访问对应入口：

```text
iPhone: http://localhost:4173/
iPad:   http://localhost:4173/ipad.html
```

iPhone 页面默认使用 `assets/sample-screenshot.png`；iPad 页面默认使用 `assets/sample-ipad-screenshot.png`，并以 11 英寸深空黑色机框展示。两个入口打开后都可以直接预览和导出。从 Xcode 或 Simulator 获取截图后，可以在编辑面板中一次选择一张或多张本地图片；首批截图会替换对应示例图，后续还可以继续追加，最多保留 10 张。

点击缩略图可切换当前宣传图。文案、截图填充方式和 iPhone 排版按宣传图分别保存，机框与 iPhone 主题由整组共用。选择双屏或三屏排版时，辅助槽位默认按当前顺序循环使用后续且不重复的截图，也可以手动指定；引用截图删除后会自动回退。截图不足、图片读取失败、文案进入设备安全区或步骤标签溢出时，导出按钮会保持禁用并显示原因。

经典排版继续使用原有手机宽度和上边距控制；新增排版使用受限的整体缩放、垂直偏移、展开度和倾斜强度。细节聚焦排版另外提供水平、垂直焦点控制。iPad 的界面和构图行为保持不变，默认使用“拉伸贴合”以保证截图不裁剪、不留边；当截图与机框比例不完全相同时会有轻微比例调整，也可以手动切换为“铺满屏幕”或“完整显示”。

可以导出当前 PNG，也可以点击“导出全部”按当前顺序触发多个独立 PNG 下载；不生成 ZIP，浏览器首次批量导出时可能会询问是否允许下载多个文件。

## 自动化渲染

纯渲染入口：

```text
iPhone: http://localhost:4173/?render=1
iPad:   http://localhost:4173/ipad.html?render=1
```

支持通过查询参数配置内容：

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `title` | 主标题，支持换行 | `title=Learn%20faster` |
| `subtitle` | 说明文案，支持换行 | `subtitle=One%20lesson%20at%20a%20time` |
| `frame` | 机框 ID | `frame=iphone-17-black` |
| `screenshot` | 可访问的截图 URL | `screenshot=./screens/home.png` |
| `fit` | `fill`、`cover` 或 `contain`；`fill` 仅用于 iPad | `fit=fill` |
| `deviceWidth` | 设备在画布中的宽度 | `deviceWidth=930` |
| `deviceTop` | 设备距离画布顶部的位置 | `deviceTop=730` |
| `layout` | iPhone 排版 ID；省略或无效时使用 `classic` | `layout=duo-flow` |
| `theme` | iPhone 主题：`porcelain`、`midnight`、`aurora` 或 `electric` | `theme=midnight` |
| `screenshot2` / `screenshot3` | 多图排版的第 2、3 张可访问截图 URL | `screenshot2=./screens/result.png` |
| `fit2` / `fit3` | 第 2、3 张截图的 `cover` 或 `contain` 填充方式 | `fit2=contain` |
| `layoutScale` | 新排版整体缩放，范围 `0.92–1.06` | `layoutScale=1.02` |
| `layoutY` | 新排版垂直偏移，范围 `-120–120` | `layoutY=40` |
| `layoutSpread` | 多图展开度，范围 `0.85–1.15` | `layoutSpread=1.08` |
| `layoutTilt` | 倾斜强度，范围 `0–1` | `layoutTilt=0.8` |
| `annotations` | `1` 时显示当前排版支持的箭头、编号和标签 | `annotations=1` |
| `annotation1`…`annotation3` | 最多 3 个单行步骤标签 | `annotation1=选择资料` |
| `focusX` / `focusY` | `focus-lens` 的聚焦位置，范围 `0.2–0.8` | `focusX=0.62` |

跨域 `screenshot` URL 需要由图片服务器返回允许当前页面读取的 CORS 响应头；同源图片和在编辑面板中上传的本地图片不受影响。iPad 未指定 `frame` 时会按截图比例自动选择机框；显式传入 `frame` 时以该参数为准。

示例：

```text
http://localhost:4173/?render=1&frame=iphone-17-pro-max-deep-blue&deviceTop=730
http://localhost:4173/?render=1&layout=duo-flow&theme=midnight&screenshot=./screens/input.png&screenshot2=./screens/result.png&annotations=1&annotation1=选择资料&annotation2=单词本就绪
http://localhost:4173/ipad.html?render=1&frame=ipad-pro-m5-13-space-black&screenshot=./screens/ipad-home.png
```

`layout` 支持：`classic`、`editorial-shift`、`focus-lens`、`duo-flow`、`duo-compare`、`depth-stack`、`arc-fan`、`step-cascade` 和 `card-gallery`。这些新增参数仅作用于 iPhone；iPad 会忽略它们并维持现有行为。

纯渲染模式会在 `<body>` 上设置 `data-render-state="loading"`、`ready` 或 `error`。多图槽位缺失、截图无法读取、文案进入设备安全区或标签溢出时状态为 `error`，并通过 `data-render-error` 给出原因。自动化截图应等待 `ready`，不要静默截取错误画面。

使用与入口对应的 `1320 × 2868` 或 `2732 × 2048` 浏览器视口截取页面，即可得到完整画布。后续可以把模拟器截图路径和多语言文案直接注入这些参数。

## 项目结构

```text
.
├── index.html
├── ipad.html
├── styles.css
├── layouts.js
├── app.js
├── README.md
├── README_EN.md
├── THIRD_PARTY_ASSETS.md
├── LICENSE
├── assets/
│   ├── frames/
│   │   └── iPad Pro (M5)/
│   ├── sample-screenshot.png
│   └── sample-ipad-screenshot.png
├── docs/
│   └── preview.jpg
└── tests/
    └── layouts.test.cjs
```

## 路线图

- 模拟器自动启动、导航与截图
- 多语言文案配置和批量渲染
- App Store Connect 尺寸预设

## 素材与商标

MIT License 只覆盖本仓库原创代码。`assets/frames`、`assets/sample-screenshot.png`、`assets/sample-ipad-screenshot.png` 及预览图中的第三方设备图像、商标和产品外观不包含在 MIT 授权范围内。使用或再分发前请阅读 [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md)，并自行确认对应权利方的使用条款。

本项目与 Apple Inc. 无隶属或背书关系。Apple、iPhone、iPad 和 App Store 是 Apple Inc. 的商标。

## License

原创代码基于 [MIT License](LICENSE) 开源。
