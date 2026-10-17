import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { once } from "node:events";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve, sep } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPOSITORY_ROOT = resolve(fileURLToPath(new URL("../", import.meta.url)));
const FIXTURE_PATH = join(REPOSITORY_ROOT, "assets", "sample-ipad-screenshot.png");
const FIXTURE_NAME = basename(FIXTURE_PATH);
const PHONE_FIXTURE_PATH = join(REPOSITORY_ROOT, "assets", "sample-screenshot.png");
const CHROME_PATH = findChromeExecutable();
const CHROME_SKIP_REASON =
  "Chrome/Chromium 不可用，跳过需要真实 DataTransfer 命中的拖放回归测试";

const MIME_TYPES = Object.freeze({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
});

let staticServer = null;
let staticServerUrl = null;
let chromeProcess = null;
let chromeProfileDirectory = null;
let cdp = null;

function findChromeExecutable() {
  const directCandidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    process.env.PROGRAMFILES
      ? join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe")
      : null,
  ].filter(Boolean);

  const directMatch = directCandidates.find((candidate) => existsSync(candidate));
  if (directMatch) return directMatch;

  for (const command of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const result = spawnSync("which", [command], { encoding: "utf8" });
    const candidate = result.status === 0 ? result.stdout.trim() : "";
    if (candidate && existsSync(candidate)) return candidate;
  }
  return null;
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "") || "index.html";
      const filePath = resolve(REPOSITORY_ROOT, relativePath);
      const isInsideRepository =
        filePath === REPOSITORY_ROOT || filePath.startsWith(`${REPOSITORY_ROOT}${sep}`);
      if (!isInsideRepository) {
        response.writeHead(403).end("Forbidden");
        return;
      }

      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        response.writeHead(404).end("Not found");
        return;
      }

      const body = await readFile(filePath);
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-length": body.length,
        "content-type": MIME_TYPES[extname(filePath).toLowerCase()] ?? "application/octet-stream",
      });
      response.end(body);
    } catch (error) {
      response.writeHead(error?.code === "ENOENT" ? 404 : 500).end("Not found");
    }
  });

  await new Promise((resolveListening, rejectListening) => {
    server.once("error", rejectListening);
    server.listen(0, "127.0.0.1", resolveListening);
  });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return { server, url: `http://127.0.0.1:${address.port}` };
}

class CdpPipe {
  constructor(child) {
    this.child = child;
    this.reader = child.stdio[4];
    this.writer = child.stdio[3];
    this.buffer = "";
    this.closed = false;
    this.nextId = 0;
    this.pending = new Map();
    this.stderr = "";

    assert.ok(this.reader && this.writer, "Chrome 未建立远程调试管道");
    this.reader.setEncoding("utf8");
    this.reader.on("data", (chunk) => this.#consume(chunk));
    child.stderr?.setEncoding("utf8");
    child.stderr?.on("data", (chunk) => {
      this.stderr = `${this.stderr}${chunk}`.slice(-6000);
    });
    child.once("error", (error) => this.#close(error));
    child.once("exit", (code, signal) => {
      this.#close(
        new Error(
          `Chrome 意外退出（code=${String(code)}, signal=${String(signal)}）${
            this.stderr ? `\n${this.stderr}` : ""
          }`,
        ),
      );
    });
  }

  #consume(chunk) {
    this.buffer += chunk;
    let boundary = this.buffer.indexOf("\0");
    while (boundary >= 0) {
      const payload = this.buffer.slice(0, boundary);
      this.buffer = this.buffer.slice(boundary + 1);
      if (payload) this.#handleMessage(payload);
      boundary = this.buffer.indexOf("\0");
    }
  }

  #handleMessage(payload) {
    let message;
    try {
      message = JSON.parse(payload);
    } catch (error) {
      this.#close(new Error(`无法解析 Chrome DevTools 响应：${error.message}`));
      return;
    }

    if (!message.id) return;
    const request = this.pending.get(message.id);
    if (!request) return;
    this.pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) {
      request.reject(
        new Error(`${request.method} 失败：${message.error.message ?? JSON.stringify(message.error)}`),
      );
      return;
    }
    request.resolve(message.result ?? {});
  }

  #close(error) {
    if (this.closed) return;
    this.closed = true;
    for (const request of this.pending.values()) {
      clearTimeout(request.timer);
      request.reject(error);
    }
    this.pending.clear();
  }

  send(method, params = {}, sessionId = null) {
    if (this.closed) return Promise.reject(new Error("Chrome DevTools 管道已经关闭"));
    const id = ++this.nextId;
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;

    return new Promise((resolveRequest, rejectRequest) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        rejectRequest(
          new Error(`${method} 在 10 秒内没有响应${this.stderr ? `\n${this.stderr}` : ""}`),
        );
      }, 10_000);
      this.pending.set(id, {
        method,
        reject: rejectRequest,
        resolve: resolveRequest,
        timer,
      });
      this.writer.write(`${JSON.stringify(message)}\0`, (error) => {
        if (!error) return;
        const request = this.pending.get(id);
        if (!request) return;
        this.pending.delete(id);
        clearTimeout(request.timer);
        rejectRequest(error);
      });
    });
  }
}

async function launchChrome(executable) {
  const profileDirectory = await mkdtemp(join(tmpdir(), "launchframe-drag-test-"));
  const args = [
    "--headless=new",
    "--remote-debugging-pipe",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-gpu",
    "--force-device-scale-factor=1",
    "--window-size=1800,1200",
    `--user-data-dir=${profileDirectory}`,
    "about:blank",
  ];
  if (typeof process.getuid === "function" && process.getuid() === 0) args.unshift("--no-sandbox");

  const child = spawn(executable, args, {
    stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"],
  });
  const client = new CdpPipe(child);
  try {
    await client.send("Browser.getVersion");
    return { child, client, profileDirectory };
  } catch (error) {
    child.kill("SIGKILL");
    await rm(profileDirectory, { force: true, recursive: true });
    throw error;
  }
}

class BrowserPage {
  constructor(client, targetId, sessionId) {
    this.client = client;
    this.targetId = targetId;
    this.sessionId = sessionId;
  }

  async evaluate(expression) {
    const response = await this.client.send(
      "Runtime.evaluate",
      {
        awaitPromise: true,
        expression,
        returnByValue: true,
        userGesture: true,
      },
      this.sessionId,
    );
    if (response.exceptionDetails) {
      const description =
        response.exceptionDetails.exception?.description ??
        response.exceptionDetails.text ??
        "页面脚本执行失败";
      throw new Error(description);
    }
    return response.result?.value;
  }

  async waitFor(expression, label, timeoutMs = 8_000) {
    const deadline = Date.now() + timeoutMs;
    let lastError = null;
    while (Date.now() < deadline) {
      try {
        if (await this.evaluate(`Boolean(${expression})`)) return;
      } catch (error) {
        lastError = error;
      }
      await delay(50);
    }

    const diagnostics = await this.evaluate(`(() => ({
      layout: document.querySelector("#artboard")?.dataset.layout ?? null,
      pagePosition: document.querySelector("#pagePosition")?.value ?? null,
      screenshotName: document.querySelector("#screenshotName")?.textContent ?? null,
      screenshotStatus: document.querySelector("#screenshotStatus")?.textContent ?? null,
      dropStatus: document.querySelector("#dropStatus")?.textContent ?? null,
      href: location.href,
      readyState: document.readyState,
      previewOnly: document.body.classList.contains("preview-only"),
      screenshotCount: document.querySelectorAll(".screenshot-card").length
    }))()`);
    throw new Error(
      `${label}：等待 ${timeoutMs}ms 后仍未满足。页面状态：${JSON.stringify(diagnostics)}${
        lastError ? `；最后错误：${lastError.message}` : ""
      }`,
    );
  }

  async clickLayout(layoutId) {
    await this.evaluate(`(() => {
      const button = document.querySelector('[data-layout-id=${JSON.stringify(layoutId)}]');
      if (!button) throw new Error(${JSON.stringify(`找不到布局 ${layoutId}`)});
      button.click();
    })()`);
    await this.waitFor(
      `document.querySelector("#artboard")?.dataset.layout === ${JSON.stringify(layoutId)}`,
      `切换到 ${layoutId}`,
    );
  }

  async enterPreviewOnly() {
    await this.evaluate(`document.querySelector("#focusButton")?.click()`);
    await this.waitFor(
      `document.body.classList.contains("preview-only")`,
      "进入专注预览",
    );
  }

  async centerOf(selector, index = 0) {
    const point = await this.evaluate(`(() => {
      const element = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
      if (!element) throw new Error(${JSON.stringify(`找不到拖放目标：${selector}[${index}]`)});
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    })()`);
    assert.ok(point.width > 0 && point.height > 0, `拖放目标没有可见尺寸：${selector}[${index}]`);
    assert.ok(
      point.x >= 0 && point.x <= point.viewportWidth && point.y >= 0 && point.y <= point.viewportHeight,
      `拖放目标不在视口内：${selector}[${index}] ${JSON.stringify(point)}`,
    );
    return point;
  }

  async dropFile(selector, index = 0, filePath = FIXTURE_PATH) {
    await this.dropData(selector, index, {
      dragOperationsMask: 1,
      files: [filePath],
      items: [],
    });
  }

  async dropUrl(selector, url, index = 0) {
    await this.dropData(selector, index, {
      dragOperationsMask: 1,
      files: [],
      items: [{ data: url, mimeType: "text/uri-list" }],
    });
  }

  async dropData(selector, index, data) {
    await this.client.send("Page.bringToFront", {}, this.sessionId);
    const { x, y } = await this.centerOf(selector, index);
    for (const type of ["dragEnter", "dragOver"]) {
      await this.client.send(
        "Input.dispatchDragEvent",
        { data, type, x, y },
        this.sessionId,
      );
    }
    await delay(40);
    await this.client.send(
      "Input.dispatchDragEvent",
      { data, type: "drop", x, y },
      this.sessionId,
    );
  }

  async close() {
    await this.client.send("Target.closeTarget", { targetId: this.targetId });
  }
}

async function openEditorPage(pathname, label) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", {
    flatten: true,
    targetId,
  });
  const page = new BrowserPage(cdp, targetId, sessionId);
  await cdp.send("Runtime.enable", {}, sessionId);
  await cdp.send("Page.enable", {}, sessionId);
  await cdp.send(
    "Emulation.setDeviceMetricsOverride",
    { deviceScaleFactor: 1, height: 1200, mobile: false, width: 1800 },
    sessionId,
  );
  await cdp.send("Page.navigate", { url: `${staticServerUrl}/${pathname}` }, sessionId);
  await page.waitFor(
    `document.readyState === "complete" && document.querySelector("#artboard")?.dataset.layout === "classic"`,
    `加载 ${label} 编辑器`,
    12_000,
  );
  return page;
}

async function openRenderPage(
  { height, parameters, pathname, screenshot, width },
  label,
) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", {
    flatten: true,
    targetId,
  });
  const page = new BrowserPage(cdp, targetId, sessionId);
  await cdp.send("Runtime.enable", {}, sessionId);
  await cdp.send("Page.enable", {}, sessionId);
  await cdp.send(
    "Emulation.setDeviceMetricsOverride",
    { deviceScaleFactor: 1, height, mobile: false, width },
    sessionId,
  );
  const query = new URLSearchParams({
    render: "1",
    screenshot,
    ...parameters,
  });
  await cdp.send(
    "Page.navigate",
    { url: `${staticServerUrl}/${pathname}?${query.toString()}` },
    sessionId,
  );
  await page.waitFor(
    `document.body.dataset.renderState === "ready" || document.body.dataset.renderState === "error"`,
    `加载 ${label} 纯渲染页`,
    12_000,
  );
  assert.equal(
    await page.evaluate(`document.body.dataset.renderState`),
    "ready",
    `${label} 纯渲染页应进入 ready`,
  );
  return page;
}

function openIpadRenderPage(parameters, label) {
  return openRenderPage(
    {
      height: 2048,
      parameters: {
        iphoneScreenshot: "./assets/sample-screenshot.png",
        ...parameters,
      },
      pathname: "ipad.html",
      screenshot: "./assets/sample-ipad-screenshot.png",
      width: 2732,
    },
    label,
  );
}

function openIphoneRenderPage(parameters, label) {
  return openRenderPage(
    {
      height: 2868,
      parameters,
      pathname: "index.html",
      screenshot: "./assets/sample-screenshot.png",
      width: 1320,
    },
    label,
  );
}

async function withIpadPage(run) {
  const page = await openEditorPage("ipad.html", "iPad");
  try {
    return await run(page);
  } finally {
    await page.close();
  }
}

async function withIphonePage(run) {
  const page = await openEditorPage("index.html", "iPhone");
  try {
    return await run(page);
  } finally {
    await page.close();
  }
}

const DUO_VIEWS = [
  { view: "inner-open-portrait", width: 2247, height: 3093, aperture: [120, 120, 2127, 2973] },
  { view: "inner-open-landscape", width: 3093, height: 2247, aperture: [120, 120, 2973, 2127] },
  { view: "outer-closed-portrait", width: 1574, height: 2194, aperture: [88, 80, 1486, 2114] },
  { view: "outer-closed-landscape", width: 2194, height: 1574, aperture: [80, 88, 2114, 1486] },
  { view: "outer-open", width: 3056, height: 2194, aperture: [1570, 80, 2968, 2114] },
];
const DUO_FRAMES = DUO_VIEWS.flatMap((view) =>
  ["night-sky", "star-white"].map((color) => ({
    ...view,
    id: `iphone-duo-${view.view}-${color}`,
  })),
);
const DUO_SCREEN_COLOR = [28, 212, 127, 255];

async function selectFrame(page, frameId, companion = false) {
  const selector = companion ? "#iphoneFrameSelect" : "#frameSelect";
  await page.evaluate(`(() => {
    const select = document.querySelector(${JSON.stringify(selector)});
    select.value = ${JSON.stringify(frameId)};
    select.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
}

async function assertDuoScreenPixels(page, frameCase, companion) {
  const result = await page.evaluate(`(async () => {
    const expected = ${JSON.stringify(frameCase)};
    const snapshot = createRenderSnapshot(getActivePage());
    const image = document.querySelector(${JSON.stringify(
      companion ? '.composition-device[data-product="iphone"] .composition-frame' : "#frameImage",
    )});
    const scene = LAYOUT_ENGINE.resolveComposition({
      layoutId: snapshot.layoutId,
      tuning: snapshot.layoutTuning,
      classicDeviceWidth: snapshot.deviceWidth,
      classicDeviceTop: snapshot.deviceTop,
    });
    const node = ${companion ? 'scene.nodes.find((item) => item.product === "iphone")' : "scene.nodes[0]"};
    const scale = node.width / expected.width;
    const radians = node.rotation * Math.PI / 180;
    const [left, top, right, bottom] = expected.aperture;
    const points = [0.2, 0.5, 0.8].flatMap((fy) => [0.2, 0.5, 0.8].map((fx) => {
      const x = (left + (right - left) * fx) * scale - node.width / 2;
      const y = (top + (bottom - top) * fy) * scale;
      return {
        x: Math.round(node.cx + x * Math.cos(radians) - y * Math.sin(radians)),
        y: Math.round(node.top + x * Math.sin(radians) + y * Math.cos(radians)),
      };
    }));
    const { canvas, context } = createExportCanvas();
    const blob = await renderSnapshotToBlob(snapshot, canvas, context, new Map());
    const bitmap = await createImageBitmap(blob);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0);
    const colors = points.map(({ x, y }) => [...context.getImageData(x, y, 1, 1).data]);
    return {
      colors,
      dimensions: [image.naturalWidth, image.naturalHeight],
      exportDimensions: [bitmap.width, bitmap.height],
      mimeType: blob.type,
      points,
    };
  })()`);
  assert.deepEqual(result.dimensions, [frameCase.width, frameCase.height], frameCase.id);
  assert.deepEqual(result.exportDimensions, companion ? [2732, 2048] : [1320, 2868]);
  assert.equal(result.mimeType, "image/png");
  for (const color of result.colors) {
    assert.deepEqual(color, DUO_SCREEN_COLOR, `${frameCase.id} Canvas 屏幕应完整填充`);
  }

  const screenshot = await page.client.send(
    "Page.captureScreenshot",
    { format: "png", captureBeyondViewport: false },
    page.sessionId,
  );
  const domColors = await page.evaluate(`(async () => {
    const image = await loadImage(${JSON.stringify(`data:image/png;base64,${screenshot.data}`)}, "DOM 预览");
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return ${JSON.stringify(result.points)}.map(({ x, y }) => [...context.getImageData(x, y, 1, 1).data]);
  })()`);
  for (const color of domColors) {
    assert.deepEqual(color, DUO_SCREEN_COLOR, `${frameCase.id} DOM 屏幕应完整填充`);
  }
}

test.before(async () => {
  if (!CHROME_PATH) return;
  assert.ok(existsSync(FIXTURE_PATH), `缺少拖放测试图片：${FIXTURE_PATH}`);
  assert.ok(existsSync(PHONE_FIXTURE_PATH), `缺少拖放测试图片：${PHONE_FIXTURE_PATH}`);
  const serverResult = await startStaticServer();
  staticServer = serverResult.server;
  staticServerUrl = serverResult.url;
  const chromeResult = await launchChrome(CHROME_PATH);
  chromeProcess = chromeResult.child;
  chromeProfileDirectory = chromeResult.profileDirectory;
  cdp = chromeResult.client;
});

test.after(async () => {
  if (!CHROME_PATH) return;
  if (cdp && !cdp.closed) {
    try {
      await cdp.send("Browser.close");
    } catch {
      chromeProcess?.kill("SIGKILL");
    }
  }
  if (chromeProcess?.exitCode === null) {
    await Promise.race([once(chromeProcess, "exit"), delay(2_000)]);
  }
  if (chromeProcess?.exitCode === null) {
    chromeProcess.kill("SIGKILL");
    await once(chromeProcess, "exit");
  }
  if (staticServer) {
    await new Promise((resolveClose) => staticServer.close(resolveClose));
  }
  if (chromeProfileDirectory?.startsWith(join(tmpdir(), "launchframe-drag-test-"))) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await rm(chromeProfileDirectory, { force: true, recursive: true });
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        await delay(100);
      }
    }
  }
});

test(
  "FreeLingo 推荐入口只存在于编辑器界面并适配窄屏",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () => {
    for (const productCase of [
      {
        label: "iPhone",
        openEditor: withIphonePage,
        openRender: openIphoneRenderPage,
      },
      {
        label: "iPad",
        openEditor: withIpadPage,
        openRender: openIpadRenderPage,
      },
    ]) {
      await productCase.openEditor(async (page) => {
        await page.client.send(
          "Emulation.setDeviceMetricsOverride",
          { deviceScaleFactor: 1, height: 900, mobile: false, width: 800 },
          page.sessionId,
        );
        await delay(50);
        const editorState = await page.evaluate(`(() => {
          const controls = document.querySelector(".controls");
          const promo = document.querySelector(".app-promo");
          const controlsRect = controls?.getBoundingClientRect();
          const promoRect = promo?.getBoundingClientRect();
          return {
            artboardContainsPromo: document.querySelector("#artboard")?.contains(promo) ?? true,
            controlsContainPromo: controls?.contains(promo) ?? false,
            href: promo?.href ?? null,
            relTokens: promo ? [...promo.relList] : [],
            snapshotContainsPromo: JSON.stringify(createRenderSnapshot(getActivePage())).includes("freelingo.ai"),
            target: promo?.target ?? null,
            visibleInViewport: Boolean(
              promoRect?.width && promoRect?.height &&
              promoRect.top >= 0 && promoRect.bottom <= innerHeight
            ),
            withinSidebar: Boolean(
              controlsRect && promoRect &&
              promoRect.left >= controlsRect.left && promoRect.right <= controlsRect.right
            )
          };
        })()`);
        assert.equal(editorState.artboardContainsPromo, false);
        assert.equal(editorState.controlsContainPromo, true);
        assert.equal(editorState.href, "https://freelingo.ai/");
        assert.ok(editorState.relTokens.includes("noopener"));
        assert.ok(editorState.relTokens.includes("noreferrer"));
        assert.equal(editorState.snapshotContainsPromo, false);
        assert.equal(editorState.target, "_blank");
        assert.equal(editorState.visibleInViewport, true);
        assert.equal(editorState.withinSidebar, true);

        await page.enterPreviewOnly();
        assert.equal(
          await page.evaluate(`document.querySelector(".app-promo")?.getClientRects().length`),
          0,
        );
      });

      const renderPage = await productCase.openRender({}, `${productCase.label} FreeLingo 推荐隔离`);
      try {
        assert.equal(
          await renderPage.evaluate(`document.querySelector(".app-promo")?.getClientRects().length`),
          0,
        );
        assert.equal(
          await renderPage.evaluate(
            `document.querySelector("#artboard")?.querySelector(".app-promo") === null`,
          ),
          true,
        );
        assert.equal(
          await renderPage.evaluate(
            `JSON.stringify(createRenderSnapshot(getActivePage())).includes("freelingo.ai")`,
          ),
          false,
        );
      } finally {
        await renderPage.close();
      }
    }
  },
);

test(
  "classic 的原机框是真实外部文件拖放目标",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () =>
    withIpadPage(async (page) => {
      assert.equal(await page.evaluate(`document.querySelector("#artboard")?.dataset.layout`), "classic");
      await page.dropFile("#device");
      await page.waitFor(
        `document.querySelector("#screenshotName")?.textContent.includes(${JSON.stringify(FIXTURE_NAME)})`,
        "classic 拖入图片并选中新宣传图",
      );

      const state = await page.evaluate(`(() => {
        const activeCard = document.querySelector('.screenshot-card[aria-current="true"]');
        return {
          activeLabel: activeCard?.getAttribute("aria-label") ?? null,
          layout: document.querySelector("#artboard")?.dataset.layout ?? null,
          pagePosition: document.querySelector("#pagePosition")?.value ?? null,
          screenshotSource: document.querySelector("#screenshotImage")?.src ?? null,
          status: document.querySelector("#screenshotStatus")?.textContent ?? null
        };
      })()`);
      assert.equal(state.layout, "classic");
      assert.equal(state.pagePosition, "2 / 2");
      assert.match(state.activeLabel, new RegExp(FIXTURE_NAME.replaceAll(".", "\\.")));
      assert.match(state.screenshotSource, /^blob:/);
      assert.match(state.status, /新增为当前宣传图/);
    }),
);

test(
  "iPhone classic 拖入图片会新增并选中正常输出页",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () =>
    withIphonePage(async (page) => {
      await page.dropFile("#device", 0, PHONE_FIXTURE_PATH);
      await page.waitFor(
        `document.querySelector("#pagePosition")?.value === "2 / 2"`,
        "iPhone classic 拖入图片",
      );

      const state = await page.evaluate(`(() => ({
        activeLabel: document.querySelector('.screenshot-card[aria-current="true"]')?.getAttribute("aria-label") ?? null,
        layout: document.querySelector("#artboard")?.dataset.layout ?? null,
        screenshotSource: document.querySelector("#screenshotImage")?.src ?? null,
        status: document.querySelector("#screenshotStatus")?.textContent ?? null
      }))()`);
      assert.equal(state.layout, "classic");
      assert.match(state.activeLabel, /sample-screenshot\.png/);
      assert.match(state.screenshotSource, /^blob:/);
      assert.match(state.status, /新增为当前宣传图/);
    }),
);

test(
  "iPhone 多图槽位拖入图片会加入输出页而非辅助素材池",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () =>
    withIphonePage(async (page) => {
      await page.clickLayout("duo-flow");
      const activeId = await page.evaluate(
        `document.querySelector('.screenshot-card[aria-current="true"]')?.dataset.pageId`,
      );
      await page.dropFile('.composition-slot[data-slot-index="1"]', 0, PHONE_FIXTURE_PATH);
      await page.waitFor(
        `document.querySelectorAll(".screenshot-card").length === 2`,
        "iPhone 双屏辅助槽新增输出页",
      );

      const state = await page.evaluate(`(() => {
        const secondary = document.querySelector('.composition-slot[data-slot-index="1"]');
        return {
          activeId: document.querySelector('.screenshot-card[aria-current="true"]')?.dataset.pageId ?? null,
          layout: document.querySelector("#artboard")?.dataset.layout ?? null,
          pagePosition: document.querySelector("#pagePosition")?.value ?? null,
          secondaryPageId: secondary?.dataset.pageId ?? null,
          secondarySource: secondary?.querySelector(".composition-screen img")?.src ?? null,
          status: document.querySelector("#screenshotStatus")?.textContent ?? null
        };
      })()`);
      assert.equal(state.activeId, activeId);
      assert.notEqual(state.secondaryPageId, activeId);
      assert.equal(state.layout, "duo-flow");
      assert.equal(state.pagePosition, "1 / 2");
      assert.match(state.secondarySource, /^blob:/);
      assert.match(state.status, /填入图 2/);
    }),
);

test(
  "网页 URL 拖入会阻止导航并显示保存到本地提示",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () =>
    withIpadPage(async (page) => {
      await page.dropUrl("#device", "https://example.com/screenshot.png");
      await page.waitFor(
        `document.querySelector("#dropStatus")?.textContent.includes("网页图片链接")`,
        "URL-only 拖入显示明确提示",
      );

      const state = await page.evaluate(`(() => ({
        dropStatus: document.querySelector("#dropStatus")?.textContent ?? null,
        location: location.href,
        pagePosition: document.querySelector("#pagePosition")?.value ?? null,
        screenshotCount: document.querySelectorAll(".screenshot-card").length
      }))()`);
      assert.match(state.dropStatus, /先保存到本地/);
      assert.match(state.location, /\/ipad\.html$/);
      assert.equal(state.pagePosition, "1 / 1");
      assert.equal(state.screenshotCount, 1);
    }),
);

test(
  "文件或链接落在画布外会阻止浏览器导航",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () =>
    withIpadPage(async (page) => {
      await page.dropUrl(".controls", "https://example.com/outside.png");
      await page.waitFor(
        `document.querySelector("#dropStatus")?.textContent.includes("宣传图画布内")`,
        "画布外拖放显示位置提示",
      );

      const state = await page.evaluate(`(() => ({
        location: location.href,
        pagePosition: document.querySelector("#pagePosition")?.value ?? null,
        screenshotCount: document.querySelectorAll(".screenshot-card").length
      }))()`);
      assert.match(state.location, /\/ipad\.html$/);
      assert.equal(state.pagePosition, "1 / 1");
      assert.equal(state.screenshotCount, 1);
    }),
);

test(
  "专注预览保持真实拖放命中和可见反馈",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () =>
    withIpadPage(async (page) => {
      await page.clickLayout("ecosystem-hero");
      await page.enterPreviewOnly();

      const previewState = await page.evaluate(`(() => {
        const slot = document.querySelector('.composition-slot[data-slot-index="0"][data-product="ipad"]');
        return {
          controlsDisplay: getComputedStyle(document.querySelector(".controls")).display,
          pointerEvents: slot ? getComputedStyle(slot).pointerEvents : null,
          previewOnly: document.body.classList.contains("preview-only")
        };
      })()`);
      assert.equal(previewState.previewOnly, true);
      assert.equal(previewState.controlsDisplay, "none");
      assert.notEqual(previewState.pointerEvents, "none");

      await page.dropFile('.composition-slot[data-slot-index="0"][data-product="ipad"]');
      await page.waitFor(
        `document.querySelector("#pagePosition")?.value === "2 / 2"`,
        "专注预览拖入图片",
      );
      const result = await page.evaluate(`(() => ({
        dropStatus: document.querySelector("#dropStatus")?.textContent ?? null,
        dropStatusHidden: document.querySelector("#dropStatus")?.hidden ?? true,
        previewOnly: document.body.classList.contains("preview-only"),
        screenshotName: document.querySelector("#screenshotName")?.textContent ?? null
      }))()`);
      assert.equal(result.previewOnly, true);
      assert.equal(result.dropStatusHidden, false);
      assert.match(result.dropStatus, /新增为当前宣传图/);
      assert.match(result.screenshotName, new RegExp(FIXTURE_NAME.replaceAll(".", "\\.")));
    }),
);

test(
  "detail-callout 的两个细节窗都向主截图槽转发且每次只导入一张",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 30_000 },
  async () =>
    withIpadPage(async (page) => {
      await page.clickLayout("detail-callout");
      const targets = await page.evaluate(`[...document.querySelectorAll(".composition-detail")].map((element) => ({
        pointerEvents: getComputedStyle(element).pointerEvents,
        slotIndex: element.dataset.slotIndex ?? null
      }))`);
      assert.deepEqual(
        targets,
        [
          { pointerEvents: "auto", slotIndex: "0" },
          { pointerEvents: "auto", slotIndex: "0" },
        ],
      );

      let previousSource = null;
      for (let detailIndex = 0; detailIndex < 2; detailIndex += 1) {
        const expectedCount = detailIndex + 2;
        await page.dropFile(".composition-detail", detailIndex);
        await page.waitFor(
          `document.querySelectorAll(".screenshot-card").length === ${expectedCount}`,
          `第 ${detailIndex + 1} 个细节窗转发拖放`,
        );
        await page.waitFor(
          `(() => {
            const sources = [
              document.querySelector('.composition-device[data-slot-index="0"] .composition-screen img')?.src,
              ...[...document.querySelectorAll(".composition-detail img")].map((image) => image.src)
            ];
            return sources.length === 3 && sources.every((source) => source?.startsWith("blob:")) && new Set(sources).size === 1;
          })()`,
          `第 ${detailIndex + 1} 次拖放同步主屏与细节窗`,
        );

        const state = await page.evaluate(`(() => {
          const activeCard = document.querySelector('.screenshot-card[aria-current="true"]');
          const mainSource = document.querySelector('.composition-device[data-slot-index="0"] .composition-screen img')?.src ?? null;
          const primarySlot = document.querySelector('.composition-slot[data-slot-index="0"]');
          return {
            activeId: activeCard?.dataset.pageId ?? null,
            activeLabel: activeCard?.getAttribute("aria-label") ?? null,
            detailSources: [...document.querySelectorAll(".composition-detail img")].map((image) => image.src),
            layout: document.querySelector("#artboard")?.dataset.layout ?? null,
            mainSource,
            pagePosition: document.querySelector("#pagePosition")?.value ?? null,
            primaryPageId: primarySlot?.dataset.pageId ?? null,
            screenshotCount: document.querySelectorAll(".screenshot-card").length
          };
        })()`);
        assert.equal(state.layout, "detail-callout");
        assert.equal(state.pagePosition, `${expectedCount} / ${expectedCount}`);
        assert.equal(state.primaryPageId, state.activeId);
        assert.equal(state.screenshotCount, expectedCount);
        assert.match(state.activeLabel, new RegExp(FIXTURE_NAME.replaceAll(".", "\\.")));
        assert.ok(state.detailSources.every((source) => source === state.mainSource));
        if (previousSource) assert.notEqual(state.mainSource, previousSource);
        previousSource = state.mainSource;
      }
    }),
);

test(
  "单图主槽拖入不会继承旧布局的 primary override",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 30_000 },
  async () =>
    withIpadPage(async (page) => {
      await page.clickLayout("duo-flow");
      await page.dropFile('.composition-slot[data-slot-index="0"]');
      await page.waitFor(
        `document.querySelectorAll(".screenshot-card").length === 2`,
        "建立旧的 primary override",
      );
      const overriddenSource = await page.evaluate(
        `document.querySelector('.composition-slot[data-slot-index="0"] .composition-screen img')?.src`,
      );
      assert.match(overriddenSource, /^blob:/);

      await page.clickLayout("detail-callout");
      await page.dropFile(".composition-detail", 0);
      await page.waitFor(
        `document.querySelector("#pagePosition")?.value === "3 / 3"`,
        "单图主槽选中新页面",
      );

      const state = await page.evaluate(`(() => {
        const activeCard = document.querySelector('.screenshot-card[aria-current="true"]');
        const primary = document.querySelector('.composition-slot[data-slot-index="0"]');
        return {
          activeId: activeCard?.dataset.pageId ?? null,
          layout: document.querySelector("#artboard")?.dataset.layout ?? null,
          primaryPageId: primary?.dataset.pageId ?? null,
          primarySource: primary?.querySelector(".composition-screen img")?.src ?? null
        };
      })()`);
      assert.equal(state.layout, "detail-callout");
      assert.equal(state.primaryPageId, state.activeId);
      assert.match(state.primarySource, /^blob:/);
      assert.notEqual(state.primarySource, overriddenSource);
    }),
);

test(
  "跨设备模板拖入 iPad primary 后选中新页并保持模板",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () =>
    withIpadPage(async (page) => {
      await page.clickLayout("ecosystem-hero");
      await page.dropFile(
        '.composition-slot[data-slot-index="1"][data-product="iphone"]',
        0,
        PHONE_FIXTURE_PATH,
      );
      await page.waitFor(
        `Boolean(document.querySelector('.composition-slot[data-slot-index="1"][data-product="iphone"]')?.dataset.pageId)`,
        "跨设备模板填入 iPhone 辅助素材",
      );
      const companionPageId = await page.evaluate(
        `document.querySelector('.composition-slot[data-slot-index="1"][data-product="iphone"]')?.dataset.pageId`,
      );
      const previousActiveId = await page.evaluate(
        `document.querySelector('.screenshot-card[aria-current="true"]')?.dataset.pageId`,
      );
      await page.dropFile('.composition-slot[data-slot-index="0"][data-product="ipad"]');
      await page.waitFor(
        `document.querySelector("#pagePosition")?.value === "2 / 2"`,
        "跨设备主槽选中新页",
      );

      const state = await page.evaluate(`(() => {
        const activeCard = document.querySelector('.screenshot-card[aria-current="true"]');
        const primarySlot = document.querySelector('.composition-slot[data-slot-index="0"][data-product="ipad"]');
        return {
          activeId: activeCard?.dataset.pageId ?? null,
          activeLabel: activeCard?.getAttribute("aria-label") ?? null,
          companionPageId: document.querySelector('.composition-slot[data-slot-index="1"][data-product="iphone"]')?.dataset.pageId ?? null,
          layout: document.querySelector("#artboard")?.dataset.layout ?? null,
          pagePosition: document.querySelector("#pagePosition")?.value ?? null,
          primaryPageId: primarySlot?.dataset.pageId ?? null,
          screenshotCount: document.querySelectorAll(".screenshot-card").length,
          status: document.querySelector("#screenshotStatus")?.textContent ?? null
        };
      })()`);
      assert.notEqual(state.activeId, previousActiveId);
      assert.equal(state.companionPageId, companionPageId);
      assert.equal(state.primaryPageId, state.activeId);
      assert.equal(state.layout, "ecosystem-hero");
      assert.equal(state.pagePosition, "2 / 2");
      assert.equal(state.screenshotCount, 2);
      assert.match(state.activeLabel, new RegExp(FIXTURE_NAME.replaceAll(".", "\\.")));
      assert.match(state.status, /新增为当前宣传图/);
    }),
);

test(
  "iPhone Duo 的十款机框可用于主屏与辅助屏且 DOM 和 PNG 屏幕完整填充",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 90_000 },
  async () => {
    for (const companion of [false, true]) {
      const page = companion
        ? await openIpadRenderPage({ layout: "ecosystem-hero", title: "", subtitle: "" }, "Duo 辅助机框")
        : await openIphoneRenderPage({ title: "", subtitle: "" }, "Duo 主机框");
      try {
        const optionIds = await page.evaluate(
          `[...document.querySelector(${JSON.stringify(companion ? "#iphoneFrameSelect" : "#frameSelect")}).options].map((option) => option.value).filter((id) => id.startsWith("iphone-duo-"))`,
        );
        assert.deepEqual(optionIds.sort(), DUO_FRAMES.map((frame) => frame.id).sort());
        await page.evaluate(`(() => {
          const canvas = document.createElement("canvas");
          canvas.width = 800;
          canvas.height = 1200;
          const context = canvas.getContext("2d");
          context.fillStyle = "rgb(28, 212, 127)";
          context.fillRect(0, 0, canvas.width, canvas.height);
          const asset = ${companion ? "state.companionAssets[0]" : "getActivePage()"};
          asset.screenshot = canvas.toDataURL("image/png");
          asset.imageWidth = canvas.width;
          asset.imageHeight = canvas.height;
          asset.imageState = "loading";
          asset.validationError = null;
          ${companion ? "" : "applyScreenshot();"}
          applyComposition();
        })()`);
        for (const frameCase of DUO_FRAMES) {
          await selectFrame(page, frameCase.id, companion);
          await page.waitFor(
            `document.body.dataset.renderState === "ready" && ${companion ? "state.companionFrame" : "state.frame"} === ${JSON.stringify(frameCase.id)}`,
            `${frameCase.id} 读取完成`,
          );
          await assertDuoScreenPixels(page, frameCase, companion);
        }
      } finally {
        await page.close();
      }
    }
  },
);

test(
  "Duo 横屏允许 iPhone 多屏横版截图且切回竖屏会恢复方向校验",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () => {
    const page = await openIphoneRenderPage({
      frame: "iphone-duo-inner-open-landscape-night-sky",
      layout: "duo-flow",
      screenshot2: "./assets/sample-ipad-screenshot.png",
      title: "",
      subtitle: "",
    }, "Duo 横版多屏截图");
    try {
      for (const frameId of ["iphone-air-cloud-white", "iphone-duo-outer-open-night-sky"]) {
        await selectFrame(page, frameId);
        await page.waitFor(
          `document.body.dataset.renderState === "error"`,
          `${frameId} 应拒绝横版截图`,
        );
        assert.match(await page.evaluate(`document.body.dataset.renderError`), /竖版/);
      }
      await selectFrame(page, "iphone-duo-outer-closed-landscape-star-white");
      await page.waitFor(
        `document.body.dataset.renderState === "ready"`,
        "切回 Duo 横屏后清除旧的方向错误",
      );
    } finally {
      await page.close();
    }
  },
);

test(
  "Duo 横屏辅助机框允许横版截图且外屏展开仍按实际竖屏校验",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () => {
    const page = await openIpadRenderPage({
      iphoneFrame: "iphone-duo-outer-closed-landscape-night-sky",
      iphoneScreenshot: "./assets/sample-ipad-screenshot.png",
      layout: "ecosystem-hero",
      title: "",
      subtitle: "",
    }, "Duo 横版辅助截图");
    try {
      for (const frameId of ["iphone-air-cloud-white", "iphone-duo-outer-open-star-white"]) {
        await selectFrame(page, frameId, true);
        await page.waitFor(
          `document.body.dataset.renderState === "error"`,
          `${frameId} 辅助屏应拒绝横版截图`,
        );
        assert.match(await page.evaluate(`document.body.dataset.renderError`), /竖版/);
      }
      await selectFrame(page, "iphone-duo-inner-open-landscape-star-white", true);
      await page.waitFor(
        `document.body.dataset.renderState === "ready"`,
        "切回 Duo 横屏辅助机框后清除旧的方向错误",
      );
    } finally {
      await page.close();
    }
  },
);

test(
  "切回 Duo 横屏会清除未显示宣传图的方向错误并恢复整组导出",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () => {
    const page = await openIphoneRenderPage({
      frame: "iphone-duo-inner-open-landscape-night-sky",
      title: "",
      subtitle: "",
    }, "Duo 多页方向校验");
    try {
      await page.evaluate(`(() => {
        state.pages = [0, 1, 2, 3].map((index) => createPage({
          title: "",
          subtitle: "",
          screenshot: "./assets/sample-ipad-screenshot.png",
          screenshotName: "横版截图 " + (index + 1),
          fit: "cover",
          imageWidth: 2360,
          imageHeight: 1640,
          imageState: "ready",
          layoutId: "duo-flow",
        }));
        state.activePageId = state.pages[0].id;
        applyState();
      })()`);
      await page.waitFor(`document.body.dataset.renderState === "ready"`, "读取第一组双屏");
      await selectFrame(page, "iphone-air-cloud-white");
      await page.waitFor(
        `state.pages[0].validationError && state.pages[1].validationError`,
        "竖版机框标记第一组方向错误",
      );
      await page.evaluate(`selectPage(state.pages[2].id)`);
      await page.waitFor(
        `state.pages[2].validationError && state.pages[3].validationError`,
        "竖版机框标记另一组方向错误",
      );
      await selectFrame(page, "iphone-duo-inner-open-landscape-star-white");
      await page.waitFor(`document.body.dataset.renderState === "ready"`, "恢复横屏机框");
      const result = await page.evaluate(`({
        errors: state.pages.map((item) => getPageLayoutValidation(item).errors),
        exportAllDisabled: document.querySelector("#exportAllButton").disabled,
      })`);
      assert.deepEqual(result.errors, [[], [], [], []]);
      assert.equal(result.exportAllDisabled, false);
    } finally {
      await page.close();
    }
  },
);

test(
  "切回 Duo 横屏辅助机框会重新校验其他宣传图引用的辅助素材",
  { skip: CHROME_PATH ? false : CHROME_SKIP_REASON, timeout: 25_000 },
  async () => {
    const page = await openIpadRenderPage({
      iphoneFrame: "iphone-duo-inner-open-landscape-night-sky",
      layout: "ecosystem-hero",
      title: "",
      subtitle: "",
    }, "Duo 多页辅助素材校验");
    try {
      await page.evaluate(`(() => {
        state.companionAssets = [0, 1].map((index) => createCompanionAsset({
          screenshot: "./assets/sample-ipad-screenshot.png",
          screenshotName: "横版辅助截图 " + (index + 1),
          imageWidth: 2360,
          imageHeight: 1640,
          imageState: "ready",
        }));
        state.pages = state.companionAssets.map((asset) => createPage({
          title: "",
          subtitle: "",
          screenshot: "./assets/sample-ipad-screenshot.png",
          screenshotName: "iPad 主截图",
          fit: "fill",
          imageWidth: 2360,
          imageHeight: 1640,
          imageState: "ready",
          layoutId: "ecosystem-hero",
          companionAssetId: asset.id,
        }));
        state.activePageId = state.pages[0].id;
        applyState();
      })()`);
      await page.waitFor(`document.body.dataset.renderState === "ready"`, "读取第一张辅助素材");
      await selectFrame(page, "iphone-air-cloud-white", true);
      await page.waitFor(
        `Boolean(state.companionAssets[0].validationError)`,
        "标记第一张辅助素材方向错误",
      );
      await page.evaluate(`selectPage(state.pages[1].id)`);
      await page.waitFor(
        `Boolean(state.companionAssets[1].validationError)`,
        "标记另一张辅助素材方向错误",
      );
      await selectFrame(page, "iphone-duo-inner-open-landscape-star-white", true);
      await page.waitFor(`document.body.dataset.renderState === "ready"`, "恢复横屏辅助机框");
      const result = await page.evaluate(`({
        errors: state.pages.map((item) => getPageLayoutValidation(item).errors),
        exportAllDisabled: document.querySelector("#exportAllButton").disabled,
      })`);
      assert.deepEqual(result.errors, [[], []]);
      assert.equal(result.exportAllDisabled, false);
    } finally {
      await page.close();
    }
  },
);
