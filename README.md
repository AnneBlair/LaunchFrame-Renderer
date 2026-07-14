# LaunchFrame Renderer

简体中文 | [English](README_EN.md)

一个零依赖的 App Store 宣传图 HTML 渲染器。它把一组 iOS 截图、iPhone 原机框和可编辑营销文案组合成可预览、可导出 PNG、可自动化截图的 `1320 × 2868` 竖版画布；每张输入截图对应一张独立宣传图。

![LaunchFrame Renderer preview](docs/preview.jpg)

## 当前能力

- 一次选择或继续追加最多 10 张 PNG、JPEG 或 WebP 格式的 iOS 截图
- 每张截图独立编辑主标题、说明文案和填充方式，并支持调整顺序或删除
- 切换 15 款 iPhone 17、iPhone 17 Pro、iPhone 17 Pro Max 和 iPhone Air 竖版机框
- 调整手机宽度和垂直位置
- 把当前宣传图导出为本地 `1320 × 2868` PNG，或按页面顺序逐张导出全部 PNG
- 提供无编辑器的纯渲染模式，便于 Playwright、Puppeteer 或其他浏览器自动化工具截图
- 不依赖框架、构建工具或第三方 JavaScript 库

## App Store 截图尺寸

当前画布的 `1320 × 2868` 是 Apple 接受的 6.9 英寸 iPhone 竖版截图尺寸之一。`1242 × 2688` 也仍然有效，但对应 6.5 英寸档，并不是唯一的 iPhone 截图规格。完整规格请参阅 [Apple 官方截屏规范](https://developer.apple.com/cn/help/app-store-connect/reference/app-information/screenshot-specifications/)。

## 快速开始

```bash
python3 -m http.server 4173
```

然后访问：

```text
http://localhost:4173/
```

页面默认使用 `assets/sample-screenshot.png`。从 Xcode 或 Simulator 获取截图后，可以在编辑面板中一次选择一张或多张本地图片。首批截图会替换示例图；后续还可以继续追加，最多保留 10 张。

点击缩略图可切换当前宣传图。文案和截图填充方式按宣传图分别保存，机框与构图位置由整组共用。可以导出当前 PNG，也可以点击“导出全部”按当前顺序触发多个独立 PNG 下载；不生成 ZIP，浏览器首次批量导出时可能会询问是否允许下载多个文件。

## 自动化渲染

纯渲染入口：

```text
http://localhost:4173/?render=1
```

支持通过查询参数配置内容：

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `title` | 主标题，支持换行 | `title=Learn%20faster` |
| `subtitle` | 说明文案，支持换行 | `subtitle=One%20lesson%20at%20a%20time` |
| `frame` | 机框 ID | `frame=iphone-17-black` |
| `screenshot` | 可访问的截图 URL | `screenshot=./screens/home.png` |
| `fit` | `cover` 或 `contain` | `fit=cover` |
| `deviceWidth` | 手机在画布中的宽度 | `deviceWidth=930` |
| `deviceTop` | 手机距离画布顶部的位置 | `deviceTop=730` |

跨域 `screenshot` URL 需要由图片服务器返回允许当前页面读取的 CORS 响应头；同源图片和在编辑面板中上传的本地图片不受影响。

示例：

```text
http://localhost:4173/?render=1&frame=iphone-17-pro-max-deep-blue&deviceTop=730
```

在 `1320 × 2868` 浏览器视口下截取页面，即可得到完整画布。后续可以把模拟器截图路径和多语言文案直接注入这些参数。

## 项目结构

```text
.
├── index.html
├── styles.css
├── app.js
├── README.md
├── README_EN.md
├── THIRD_PARTY_ASSETS.md
├── LICENSE
├── assets/
│   ├── frames/
│   └── sample-screenshot.png
└── docs/
    └── preview.jpg
```

## 路线图

- 模拟器自动启动、导航与截图
- 多语言文案配置和批量渲染
- App Store Connect 尺寸预设

## 素材与商标

MIT License 只覆盖本仓库原创代码。`assets/frames`、示例截图及预览图中的第三方设备图像、商标和产品外观不包含在 MIT 授权范围内。使用或再分发前请阅读 [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md)，并自行确认对应权利方的使用条款。

本项目与 Apple Inc. 无隶属或背书关系。Apple、iPhone 和 App Store 是 Apple Inc. 的商标。

## License

原创代码基于 [MIT License](LICENSE) 开源。
