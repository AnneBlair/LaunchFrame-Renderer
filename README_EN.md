# LaunchFrame Renderer

[简体中文](README.md) | English

LaunchFrame Renderer is a zero-dependency HTML tool for creating App Store promotional screenshots. It combines app screenshots, Apple device frames, and editable marketing copy into previewable and exportable iPhone or iPad artwork. Each input screenshot becomes a separate poster.

![LaunchFrame Renderer preview](docs/preview.jpg)

## Features

- Import or append up to 10 iPhone or iPad screenshots in PNG, JPEG, or WebP format
- Edit the headline, supporting copy, and screenshot fit mode independently for each poster
- Reorder or remove screenshots from the poster sequence
- Choose one of nine iPhone layouts per poster: Classic Hero, Editorial Shift, Focus Lens, Duo Flow, Duo Compare, Depth Stack, Arc Fan, Step Cascade, or Card Gallery
- Share one iPhone device frame and one of four curated themes—Porcelain, Midnight, Aurora, or Electric—across the set
- Automatically fill up to three screenshot slots from the poster order, with stable manual overrides
- Safely tune scale, vertical offset, spread, and tilt, and add optional one-line step annotations
- Choose from 15 portrait frames for iPhone 17, iPhone 17 Pro, iPhone 17 Pro Max, and iPhone Air
- Choose from four landscape Space Black or Silver frames for the 11-inch and 13-inch iPad Pro (M5)
- Start the iPad editor with a bundled `2360 × 1640` sample screenshot and the 11-inch frame
- Automatically match the closest 11-inch or 13-inch iPad frame from the first imported screenshot's aspect ratio
- Adjust the device width and vertical position
- Export an iPhone `1320 × 2868` or iPad `2732 × 2048` PNG
- Export every poster in sequence as separate PNG files
- Use a render-only mode with Playwright, Puppeteer, or other browser automation tools
- Run without frameworks, build tools, npm packages, or third-party JavaScript libraries

Batch export deliberately reuses the same PNG export path as single-poster export. It downloads individual PNG files and does not create a ZIP archive or require a ZIP library.

## App Store Screenshot Sizes

The iPhone renderer exports a `1320 × 2868` portrait canvas, which is one of Apple's accepted screenshot sizes for 6.9-inch iPhone displays.

`1242 × 2688` is also a valid portrait size, but it belongs to the 6.5-inch display category and is not the only accepted iPhone screenshot size.

The iPad renderer exports a `2732 × 2048` landscape canvas, which is an accepted screenshot size for 13-inch iPad displays.

See Apple's current [screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/) before submitting assets to App Store Connect.

## Quick Start

From the project directory, start a local static server:

```bash
python3 -m http.server 4173
```

Then open the renderer you need:

```text
iPhone: http://localhost:4173/
iPad:   http://localhost:4173/ipad.html
```

The iPhone editor initially displays `assets/sample-screenshot.png`. The iPad editor initially displays `assets/sample-ipad-screenshot.png` in the 11-inch Space Black frame. Both entries are ready to preview and export immediately.

After capturing screenshots from Xcode or Simulator, select one or more local images to replace the corresponding sample. You can append more screenshots later, up to a total of 10.

Click a thumbnail to edit that poster. The headline, supporting copy, screenshot fit mode, and iPhone layout are stored independently for each poster. The selected iPhone frame and theme are shared by the entire set.

For two- and three-screen layouts, secondary slots automatically use the next unique screenshots in sequence and wrap when necessary. You can override each secondary slot manually; the override remains stable after reordering and falls back automatically if the referenced screenshot is deleted. Export is disabled when a required slot is empty, an image cannot be read, copy enters the device safe area, or a step label overflows.

The Classic layout retains the existing device-width and vertical-position controls. New layouts expose bounded scale, vertical offset, spread, and tilt controls; Focus Lens also exposes horizontal and vertical focus controls. The iPad editor and its layout behavior are unchanged.

The iPad editor defaults to **Stretch to fit** so the screenshot is neither cropped nor letterboxed. A slight aspect-ratio adjustment may occur when the screenshot and frame do not match exactly; **Cover** and **Contain** remain available.

Use **Export Current PNG** to download the selected poster, or **Export All** to trigger one PNG download for each poster in the current order. Batch export does not create a ZIP file.

The browser may ask you to allow multiple downloads the first time you use **Export All**. If only some files are downloaded, allow multiple downloads for the local site and try again.

## Render-only Mode

Open either renderer with the `render=1` query parameter to hide the editor and display only the poster:

```text
iPhone: http://localhost:4173/?render=1
iPad:   http://localhost:4173/ipad.html?render=1
```

The render-only view supports the following query parameters:

| Parameter | Description | Example |
| --- | --- | --- |
| `title` | Headline; line breaks are supported | `title=Learn%20faster` |
| `subtitle` | Supporting copy; line breaks are supported | `subtitle=One%20lesson%20at%20a%20time` |
| `frame` | Device frame ID | `frame=iphone-17-black` |
| `screenshot` | URL of an accessible screenshot | `screenshot=./screens/home.png` |
| `fit` | Screenshot fit mode: `fill`, `cover`, or `contain`; `fill` is iPad-only | `fit=fill` |
| `deviceWidth` | Device width on the poster canvas | `deviceWidth=930` |
| `deviceTop` | Distance from the top of the canvas to the device | `deviceTop=730` |
| `layout` | iPhone layout ID; omitted or invalid values fall back to `classic` | `layout=duo-flow` |
| `theme` | iPhone theme: `porcelain`, `midnight`, `aurora`, or `electric` | `theme=midnight` |
| `screenshot2` / `screenshot3` | Accessible URLs for secondary layout slots | `screenshot2=./screens/result.png` |
| `fit2` / `fit3` | `cover` or `contain` for secondary screenshots | `fit2=contain` |
| `layoutScale` | New-layout scale in the `0.92–1.06` range | `layoutScale=1.02` |
| `layoutY` | New-layout vertical offset in the `-120–120` range | `layoutY=40` |
| `layoutSpread` | Multi-screen spread in the `0.85–1.15` range | `layoutSpread=1.08` |
| `layoutTilt` | Tilt strength in the `0–1` range | `layoutTilt=0.8` |
| `annotations` | Set to `1` to show the supported connector, numbers, and labels | `annotations=1` |
| `annotation1`…`annotation3` | Up to three single-line step labels | `annotation1=Choose%20a%20source` |
| `focusX` / `focusY` | Focus Lens position in the `0.2–0.8` range | `focusX=0.62` |

A cross-origin `screenshot` URL must return CORS response headers that allow the renderer's origin to read the image. Same-origin images and local images selected through the editor are unaffected. When an iPad `frame` is omitted, the renderer matches one from the screenshot aspect ratio; an explicit `frame` parameter takes priority.

Example:

```text
http://localhost:4173/?render=1&frame=iphone-17-pro-max-deep-blue&deviceTop=730
http://localhost:4173/?render=1&layout=duo-flow&theme=midnight&screenshot=./screens/input.png&screenshot2=./screens/result.png&annotations=1&annotation1=Choose%20a%20source&annotation2=Ready%20to%20learn
http://localhost:4173/ipad.html?render=1&frame=ipad-pro-m5-13-space-black&screenshot=./screens/ipad-home.png
```

Supported `layout` values are `classic`, `editorial-shift`, `focus-lens`, `duo-flow`, `duo-compare`, `depth-stack`, `arc-fan`, `step-cascade`, and `card-gallery`. These new parameters affect iPhone only; iPad ignores them and preserves its existing behavior.

Render-only mode exposes `data-render-state="loading"`, `ready`, or `error` on `<body>`. Missing slots, unreadable images, copy entering the device safe area, and overflowing labels set `error` and provide a reason in `data-render-error`. Browser automation should wait for `ready` instead of silently capturing an invalid poster.

Capture the page with the viewport that matches the selected renderer—`1320 × 2868` for iPhone or `2732 × 2048` for iPad—to obtain the complete poster canvas. Simulator screenshot paths and localized copy can be injected through the query parameters for automated rendering.

## Project Structure

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

## Roadmap

- Automated simulator launch, navigation, and screenshot capture
- Localized copy configuration and batch rendering
- Additional App Store Connect size presets

## Assets and Trademarks

The MIT License covers only the original code and documentation in this repository. Third-party device artwork, trademarks, product designs, the sample screenshot, and the preview image are not included under the MIT License.

Before using or redistributing files under `assets/frames`, `assets/sample-screenshot.png`, `assets/sample-ipad-screenshot.png`, or `docs/preview.jpg`, read [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md) and confirm that your intended use complies with the relevant rights holders' terms.

This project is not affiliated with or endorsed by Apple Inc. Apple, iPhone, iPad, and App Store are trademarks of Apple Inc.

## License

Original code and documentation are available under the [MIT License](LICENSE).
