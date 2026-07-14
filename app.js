const ARTBOARD = Object.freeze({ width: 1320, height: 2868 });

const MODEL_GEOMETRY = Object.freeze({
  "iphone-17-pro-max": {
    frameWidth: 1470,
    frameHeight: 3000,
    screenX: 75,
    screenY: 66,
    screenWidth: 1320,
    screenHeight: 2868,
    screenRadius: 166,
  },
  "iphone-17-pro": {
    frameWidth: 1350,
    frameHeight: 2760,
    screenX: 72,
    screenY: 69,
    screenWidth: 1206,
    screenHeight: 2622,
    screenRadius: 152,
  },
  "iphone-17": {
    frameWidth: 1350,
    frameHeight: 2760,
    screenX: 72,
    screenY: 69,
    screenWidth: 1206,
    screenHeight: 2622,
    screenRadius: 152,
  },
  "iphone-air": {
    frameWidth: 1380,
    frameHeight: 2880,
    screenX: 60,
    screenY: 72,
    screenWidth: 1260,
    screenHeight: 2736,
    screenRadius: 158,
  },
});

const FRAME_GROUPS = [
  {
    label: "iPhone 17 Pro Max",
    model: "iphone-17-pro-max",
    folder: "iPhone 17 Pro Max",
    colors: [
      ["cosmic-orange", "星宇橙", "Cosmic Orange"],
      ["deep-blue", "深蓝色", "Deep Blue"],
      ["silver", "银色", "Silver"],
    ],
  },
  {
    label: "iPhone 17 Pro",
    model: "iphone-17-pro",
    folder: "iPhone 17 Pro",
    colors: [
      ["cosmic-orange", "星宇橙", "Cosmic Orange"],
      ["deep-blue", "深蓝色", "Deep Blue"],
      ["silver", "银色", "Silver"],
    ],
  },
  {
    label: "iPhone 17",
    model: "iphone-17",
    folder: "iPhone 17",
    colors: [
      ["black", "黑色", "Black"],
      ["lavender", "薰衣草紫", "Lavender"],
      ["mist-blue", "雾蓝色", "Mist Blue"],
      ["sage", "鼠尾草绿", "Sage"],
      ["white", "白色", "White"],
    ],
  },
  {
    label: "iPhone Air",
    model: "iphone-air",
    folder: "iPhone Air",
    colors: [
      ["cloud-white", "云白色", "Cloud White"],
      ["light-gold", "浅金色", "Light Gold"],
      ["sky-blue", "天蓝色", "Sky Blue"],
      ["space-black", "深空黑色", "Space Black"],
    ],
  },
];

const FRAMES = FRAME_GROUPS.flatMap((group) =>
  group.colors.map(([colorId, colorLabel, fileColor]) => ({
    id: `${group.model}-${colorId}`,
    groupLabel: group.label,
    label: `${group.label} · ${colorLabel}`,
    model: group.model,
    src: `./assets/frames/${group.folder}/${group.label} - ${fileColor} - Portrait.png`,
  })),
);

const DEFAULTS = Object.freeze({
  title: "不只是背单词，\n更要真正掌握语言",
  subtitle: "发音、释义、例句、备注，一张卡片完\n成一次有效学习。",
  frame: "iphone-17-black",
  screenshot: "./assets/sample-screenshot.png",
  fit: "cover",
  deviceWidth: 930,
  deviceTop: 730,
});

const MAX_SCREENSHOTS = 10;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const elements = {
  controls: document.querySelector(".controls"),
  controlsActions: document.querySelector("#controlsActions"),
  artboard: document.querySelector("#artboard"),
  canvasShell: document.querySelector("#canvasShell"),
  stage: document.querySelector("#stage"),
  titleInput: document.querySelector("#titleInput"),
  subtitleInput: document.querySelector("#subtitleInput"),
  posterTitle: document.querySelector("#posterTitle"),
  posterSubtitle: document.querySelector("#posterSubtitle"),
  frameSelect: document.querySelector("#frameSelect"),
  frameImage: document.querySelector("#frameImage"),
  device: document.querySelector("#device"),
  deviceScreen: document.querySelector("#deviceScreen"),
  screenshotInput: document.querySelector("#screenshotInput"),
  screenshotAddButton: document.querySelector("#screenshotAddButton"),
  screenshotList: document.querySelector("#screenshotList"),
  screenshotImage: document.querySelector("#screenshotImage"),
  screenshotName: document.querySelector("#screenshotName"),
  screenshotStatus: document.querySelector("#screenshotStatus"),
  pagePosition: document.querySelector("#pagePosition"),
  moveScreenshotPrevious: document.querySelector("#moveScreenshotPrevious"),
  moveScreenshotNext: document.querySelector("#moveScreenshotNext"),
  deleteScreenshot: document.querySelector("#deleteScreenshot"),
  screenPlaceholder: document.querySelector("#screenPlaceholder"),
  fitSelect: document.querySelector("#fitSelect"),
  deviceWidthInput: document.querySelector("#deviceWidthInput"),
  deviceWidthOutput: document.querySelector("#deviceWidthOutput"),
  deviceTopInput: document.querySelector("#deviceTopInput"),
  deviceTopOutput: document.querySelector("#deviceTopOutput"),
  resetButton: document.querySelector("#resetButton"),
  focusButton: document.querySelector("#focusButton"),
  exportButton: document.querySelector("#exportButton"),
  exportAllButton: document.querySelector("#exportAllButton"),
  exportStatus: document.querySelector("#exportStatus"),
  multiDownloadHint: document.querySelector("#multiDownloadHint"),
  exportMeasureTitle: document.querySelector("#exportMeasureTitle"),
  exportMeasureSubtitle: document.querySelector("#exportMeasureSubtitle"),
  zoomLabel: document.querySelector("#zoomLabel"),
};

const params = new URLSearchParams(window.location.search);
const isRenderMode = params.get("render") === "1";
let nextPageId = 1;
let isImporting = false;
let isExporting = false;

function createPage({
  title,
  subtitle,
  screenshot,
  screenshotName,
  fit,
  objectUrl = null,
  isSample = false,
}) {
  return {
    id: `screenshot-${nextPageId++}`,
    title,
    subtitle,
    screenshot,
    screenshotName,
    fit,
    objectUrl,
    isSample,
  };
}

function createDefaultPage() {
  return createPage({
    title: DEFAULTS.title,
    subtitle: DEFAULTS.subtitle,
    screenshot: DEFAULTS.screenshot,
    screenshotName: "示例截图",
    fit: DEFAULTS.fit,
    isSample: true,
  });
}

const initialPage = createPage({
  title: params.get("title") ?? DEFAULTS.title,
  subtitle: params.get("subtitle") ?? DEFAULTS.subtitle,
  screenshot: params.get("screenshot") ?? DEFAULTS.screenshot,
  screenshotName: params.has("screenshot") ? "URL 截图" : "示例截图",
  fit: params.get("fit") ?? DEFAULTS.fit,
  isSample: !params.has("screenshot"),
});

const state = {
  frame: params.get("frame") ?? DEFAULTS.frame,
  deviceWidth: getNumericParam("deviceWidth", DEFAULTS.deviceWidth, 760, 1120),
  deviceTop: getNumericParam("deviceTop", DEFAULTS.deviceTop, 500, 900),
  pages: [initialPage],
  activePageId: initialPage.id,
};

function getNumericParam(name, fallback, min, max) {
  const rawParam = params.get(name);
  if (rawParam === null || rawParam.trim() === "") return fallback;

  const rawValue = Number(rawParam);
  if (!Number.isFinite(rawValue)) return fallback;
  return Math.min(max, Math.max(min, rawValue));
}

function toPercent(value, whole) {
  return `${((value / whole) * 100).toFixed(6)}%`;
}

function getActivePage() {
  return state.pages.find((page) => page.id === state.activePageId) ?? state.pages[0];
}

function getActivePageIndex() {
  return state.pages.findIndex((page) => page.id === state.activePageId);
}

function releasePage(page) {
  if (page?.objectUrl) URL.revokeObjectURL(page.objectUrl);
}

function releaseAllPages() {
  state.pages.forEach(releasePage);
}

function setScreenshotStatus(message, isError = false) {
  elements.screenshotStatus.textContent = message;
  elements.screenshotStatus.classList.toggle("is-error", isError);
}

function populateFrameSelect() {
  for (const group of FRAME_GROUPS) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.label;

    for (const frame of FRAMES.filter((item) => item.groupLabel === group.label)) {
      const option = document.createElement("option");
      option.value = frame.id;
      option.textContent = frame.label;
      optgroup.append(option);
    }

    elements.frameSelect.append(optgroup);
  }
}

function applyFrame(frameId) {
  const frame = FRAMES.find((item) => item.id === frameId) ?? FRAMES[0];
  const geometry = MODEL_GEOMETRY[frame.model];

  state.frame = frame.id;
  elements.frameSelect.value = frame.id;
  elements.frameImage.src = frame.src;
  elements.frameImage.alt = `${frame.label} 原机框`;
  elements.device.style.aspectRatio = `${geometry.frameWidth} / ${geometry.frameHeight}`;

  elements.deviceScreen.style.left = toPercent(geometry.screenX, geometry.frameWidth);
  elements.deviceScreen.style.top = toPercent(geometry.screenY, geometry.frameHeight);
  elements.deviceScreen.style.width = toPercent(geometry.screenWidth, geometry.frameWidth);
  elements.deviceScreen.style.height = toPercent(geometry.screenHeight, geometry.frameHeight);
  elements.deviceScreen.style.borderRadius = `${toPercent(
    geometry.screenRadius,
    geometry.screenWidth,
  )} / ${toPercent(geometry.screenRadius, geometry.screenHeight)}`;
}

function applyText(page = getActivePage()) {
  elements.titleInput.value = page.title;
  elements.subtitleInput.value = page.subtitle;
  elements.posterTitle.textContent = page.title;
  elements.posterSubtitle.textContent = page.subtitle;
}

function applyScreenshot(page = getActivePage()) {
  const pageId = page.id;

  elements.screenshotImage.hidden = true;
  elements.screenPlaceholder.hidden = false;
  elements.screenshotImage.style.objectFit = page.fit;
  elements.fitSelect.value = page.fit;
  elements.screenshotName.textContent = `当前：${page.screenshotName}`;

  elements.screenshotImage.onload = () => {
    if (getActivePage().id !== pageId) return;
    elements.screenshotImage.hidden = false;
    elements.screenPlaceholder.hidden = true;
  };

  elements.screenshotImage.onerror = () => {
    if (getActivePage().id !== pageId) return;
    elements.screenshotImage.hidden = true;
    elements.screenPlaceholder.hidden = false;
  };

  elements.screenshotImage.src = page.screenshot;
}

function applyLayout() {
  elements.device.style.width = `${state.deviceWidth}px`;
  elements.device.style.top = `${state.deviceTop}px`;
  elements.deviceWidthInput.value = String(state.deviceWidth);
  elements.deviceTopInput.value = String(state.deviceTop);
  elements.deviceWidthOutput.value = `${state.deviceWidth} px`;
  elements.deviceTopOutput.value = `${state.deviceTop} px`;
}

function renderScreenshotList() {
  const fragment = document.createDocumentFragment();

  state.pages.forEach((page, index) => {
    const listItem = document.createElement("li");
    listItem.className = "screenshot-item";

    const button = document.createElement("button");
    const isActive = page.id === state.activePageId;
    button.className = "screenshot-card";
    button.type = "button";
    button.dataset.pageId = page.id;
    button.disabled = isImporting || isExporting;
    button.setAttribute("aria-current", String(isActive));
    button.setAttribute(
      "aria-label",
      `第 ${index + 1} 张，${page.screenshotName}${isActive ? "，当前宣传图" : ""}`,
    );

    const thumbnail = document.createElement("img");
    thumbnail.alt = "";
    thumbnail.crossOrigin = "anonymous";
    thumbnail.src = page.screenshot;

    const pageNumber = document.createElement("span");
    pageNumber.className = "screenshot-card-index";
    pageNumber.textContent = String(index + 1).padStart(2, "0");

    const currentBadge = document.createElement("span");
    currentBadge.className = "screenshot-current-badge";
    currentBadge.setAttribute("aria-hidden", "true");
    currentBadge.textContent = "当前";

    button.append(thumbnail, pageNumber, currentBadge);
    listItem.append(button);
    fragment.append(listItem);
  });

  elements.screenshotList.replaceChildren(fragment);
}

function updatePageControls() {
  const activeIndex = getActivePageIndex();
  const pageCount = state.pages.length;
  const isLocked = isImporting || isExporting;
  const hasMultiplePages = pageCount > 1;
  const isDefaultOnly = pageCount === 1 && state.pages[0].isSample;

  elements.pagePosition.value = `${activeIndex + 1} / ${pageCount}`;
  elements.moveScreenshotPrevious.disabled = isLocked || activeIndex <= 0;
  elements.moveScreenshotNext.disabled = isLocked || activeIndex >= pageCount - 1;
  elements.deleteScreenshot.disabled = isLocked || isDefaultOnly;
  elements.screenshotInput.disabled = isLocked || pageCount >= MAX_SCREENSHOTS;
  elements.screenshotAddButton.setAttribute(
    "aria-disabled",
    String(isLocked || pageCount >= MAX_SCREENSHOTS),
  );

  elements.titleInput.disabled = isLocked;
  elements.subtitleInput.disabled = isLocked;
  elements.frameSelect.disabled = isLocked;
  elements.fitSelect.disabled = isLocked;
  elements.deviceWidthInput.disabled = isLocked;
  elements.deviceTopInput.disabled = isLocked;
  elements.resetButton.disabled = isLocked;
  elements.focusButton.disabled = isLocked;
  elements.exportButton.disabled = isLocked;
  elements.exportAllButton.disabled = isLocked;

  elements.exportAllButton.hidden = !hasMultiplePages;
  elements.multiDownloadHint.hidden = !hasMultiplePages;
  elements.exportAllButton.textContent = `导出全部（${pageCount}）`;
  elements.controlsActions.classList.toggle("has-multiple", hasMultiplePages);
}

function applyState() {
  applyText();
  applyFrame(state.frame);
  applyScreenshot();
  applyLayout();
  renderScreenshotList();
  updatePageControls();
}

function selectPage(pageId, { focus = false } = {}) {
  if (isImporting || isExporting || !state.pages.some((page) => page.id === pageId)) return;

  state.activePageId = pageId;
  applyText();
  applyScreenshot();
  renderScreenshotList();
  updatePageControls();
  setExportStatus("");

  if (focus) {
    elements.screenshotList
      .querySelector(`[data-page-id="${pageId}"]`)
      ?.focus({ preventScroll: true });
  }
}

function resizePreview() {
  if (isRenderMode) {
    elements.canvasShell.style.width = `${ARTBOARD.width}px`;
    elements.canvasShell.style.height = `${ARTBOARD.height}px`;
    elements.artboard.style.transform = "none";
    return;
  }

  const stageBounds = elements.stage.getBoundingClientRect();
  const horizontalPadding = window.innerWidth < 820 ? 48 : 84;
  const verticalPadding = window.innerWidth < 820 ? 48 : 84;
  const scale = Math.max(
    0.12,
    Math.min(
      (stageBounds.width - horizontalPadding) / ARTBOARD.width,
      (stageBounds.height - verticalPadding) / ARTBOARD.height,
    ),
  );

  elements.canvasShell.style.width = `${ARTBOARD.width * scale}px`;
  elements.canvasShell.style.height = `${ARTBOARD.height * scale}px`;
  elements.artboard.style.transform = `scale(${scale})`;
  elements.zoomLabel.textContent = `${Math.round(scale * 100)}%`;
}

async function decodeImage(image, label) {
  if (typeof image.decode === "function") {
    try {
      await image.decode();
    } catch {
      // Some browsers reject decode() for an image that has already loaded.
    }
  }

  if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
    throw new Error(`${label}尚未加载完成`);
  }
}

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function drawImageWithFit(context, image, x, y, width, height, fit) {
  const scale =
    fit === "contain"
      ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
      : Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const imageWidth = image.naturalWidth * scale;
  const imageHeight = image.naturalHeight * scale;

  context.drawImage(
    image,
    x + (width - imageWidth) / 2,
    y + (height - imageHeight) / 2,
    imageWidth,
    imageHeight,
  );
}

function measureSpacedText(context, characters, letterSpacing) {
  return (
    characters.reduce((width, character) => width + context.measureText(character).width, 0) +
    Math.max(0, characters.length - 1) * letterSpacing
  );
}

function drawCenteredText(context, text, centerX, baseline, letterSpacing) {
  if ("letterSpacing" in context) {
    context.letterSpacing = `${letterSpacing}px`;
    context.textAlign = "center";
    context.fillText(text, centerX, baseline);
    context.letterSpacing = "0px";
    return;
  }

  const characters = Array.from(text);
  let cursorX = centerX - measureSpacedText(context, characters, letterSpacing) / 2;

  context.textAlign = "left";
  for (const character of characters) {
    context.fillText(character, cursorX, baseline);
    cursorX += context.measureText(character).width + letterSpacing;
  }
}

function getRenderedTextLines(element) {
  const textNode = element.firstChild;
  const text = textNode?.textContent ?? "";
  if (!text) return [];

  const lines = [];
  let currentLine = "";
  let currentTop = null;
  let offset = 0;

  for (const character of Array.from(text)) {
    const nextOffset = offset + character.length;

    if (character === "\n") {
      lines.push(currentLine.trimEnd());
      currentLine = "";
      currentTop = null;
      offset = nextOffset;
      continue;
    }

    const range = document.createRange();
    range.setStart(textNode, offset);
    range.setEnd(textNode, nextOffset);
    const rect = range.getClientRects()[0];
    const isCollapsibleSpace = /[\t\f ]/.test(character);

    if (rect?.width) {
      if (currentTop !== null && Math.abs(rect.top - currentTop) > 2) {
        lines.push(currentLine.trimEnd());
        currentLine = "";
      }

      if (isCollapsibleSpace) {
        if (currentLine && !currentLine.endsWith(" ")) currentLine += " ";
      } else {
        currentLine += character;
      }
      currentTop = rect.top;
    }

    offset = nextOffset;
  }

  if (currentLine || text[text.length - 1] !== "\n") lines.push(currentLine.trimEnd());
  return lines;
}

function getPageTextLines(page) {
  elements.exportMeasureTitle.textContent = page.title;
  elements.exportMeasureSubtitle.textContent = page.subtitle;

  return {
    title: getRenderedTextLines(elements.exportMeasureTitle),
    subtitle: getRenderedTextLines(elements.exportMeasureSubtitle),
  };
}

function drawTextBlock(
  context,
  { lines, top, font, fontSize, lineHeight, letterSpacing, color },
) {
  if (lines.length === 0) return 0;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "alphabetic";

  const metrics = context.measureText("国Ag");
  const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
  const baselineOffset = (lineHeight - ascent - descent) / 2 + ascent;

  lines.forEach((line, index) => {
    drawCenteredText(
      context,
      line,
      ARTBOARD.width / 2,
      top + index * lineHeight + baselineOffset,
      letterSpacing,
    );
  });

  return lines.length * lineHeight;
}

function drawDeviceShadow(context, x, y, width, height) {
  const shadowX = x + width * 0.05;
  const shadowY = y + height * 0.03;
  const shadowWidth = width * 0.9;
  const shadowHeight = height * 0.95;

  context.save();
  context.fillStyle = "rgba(0, 0, 0, 0.18)";
  context.shadowColor = "rgba(0, 0, 0, 0.25)";
  context.shadowBlur = 64;
  context.shadowOffsetY = 42;
  roundedRectPath(context, shadowX, shadowY, shadowWidth, shadowHeight, width * 0.12);
  context.fill();
  context.restore();
}

function drawPoster(context, snapshot, screenshotImage, frameImage) {
  const frame = FRAMES.find((item) => item.id === snapshot.frame) ?? FRAMES[0];
  const geometry = MODEL_GEOMETRY[frame.model];
  const deviceScale = snapshot.deviceWidth / geometry.frameWidth;
  const deviceHeight = geometry.frameHeight * deviceScale;
  const deviceX = (ARTBOARD.width - snapshot.deviceWidth) / 2;
  const screenX = deviceX + geometry.screenX * deviceScale;
  const screenY = snapshot.deviceTop + geometry.screenY * deviceScale;
  const screenWidth = geometry.screenWidth * deviceScale;
  const screenHeight = geometry.screenHeight * deviceScale;

  context.fillStyle = "#fdfdfc";
  context.fillRect(0, 0, ARTBOARD.width, ARTBOARD.height);
  drawDeviceShadow(context, deviceX, snapshot.deviceTop, snapshot.deviceWidth, deviceHeight);

  context.save();
  roundedRectPath(
    context,
    screenX,
    screenY,
    screenWidth,
    screenHeight,
    geometry.screenRadius * deviceScale,
  );
  context.clip();
  context.fillStyle = "#f2f4f5";
  context.fillRect(screenX, screenY, screenWidth, screenHeight);
  drawImageWithFit(
    context,
    screenshotImage,
    screenX,
    screenY,
    screenWidth,
    screenHeight,
    snapshot.fit,
  );
  context.restore();

  context.drawImage(
    frameImage,
    deviceX,
    snapshot.deviceTop,
    snapshot.deviceWidth,
    deviceHeight,
  );

  const titleHeight = drawTextBlock(context, {
    lines: snapshot.titleLines,
    top: 130,
    font: '750 112px "PingFang SC", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    fontSize: 112,
    lineHeight: 112 * 1.04,
    letterSpacing: -5,
    color: "#050505",
  });

  drawTextBlock(context, {
    lines: snapshot.subtitleLines,
    top: 130 + titleHeight + 60,
    font: '400 60px "Songti SC", STSong, "Noto Serif CJK SC", "Times New Roman", serif',
    fontSize: 60,
    lineHeight: 60 * 1.4,
    letterSpacing: 2,
    color: "#1b1b1a",
  });
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("浏览器未能生成 PNG 文件"));
        }
      }, "image/png");
    } catch (error) {
      reject(error);
    }
  });
}

async function loadImage(src, label) {
  const image = new Image();
  image.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error(`${label}无法读取`));
    image.src = src;
  });

  await decodeImage(image, label);
  return image;
}

function sanitizeFileName(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  return (
    baseName
      .normalize("NFKC")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "")
      .slice(0, 48) || "screenshot"
  );
}

function getExportFileName(snapshot) {
  const pageNumber = String(snapshot.pageIndex + 1).padStart(2, "0");
  return `launchframe-${pageNumber}-${sanitizeFileName(snapshot.screenshotName)}-${ARTBOARD.width}x${ARTBOARD.height}.png`;
}

function downloadBlob(blob, fileName) {
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}

function setExportStatus(message, isError = false) {
  elements.exportStatus.textContent = message;
  elements.exportStatus.classList.toggle("is-error", isError);
}

function createRenderSnapshot(page) {
  const textLines = getPageTextLines(page);

  return Object.freeze({
    id: page.id,
    pageIndex: state.pages.findIndex((item) => item.id === page.id),
    screenshot: page.screenshot,
    screenshotName: page.screenshotName,
    fit: page.fit,
    frame: state.frame,
    deviceWidth: state.deviceWidth,
    deviceTop: state.deviceTop,
    titleLines: textLines.title,
    subtitleLines: textLines.subtitle,
  });
}

function createExportCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = ARTBOARD.width;
  canvas.height = ARTBOARD.height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("当前浏览器不支持图片导出");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  return { canvas, context };
}

async function renderSnapshotToBlob(snapshot, canvas, context, frameImage) {
  const screenshotImage = await loadImage(snapshot.screenshot, snapshot.screenshotName);
  context.clearRect(0, 0, ARTBOARD.width, ARTBOARD.height);
  drawPoster(context, snapshot, screenshotImage, frameImage);
  return canvasToPngBlob(canvas);
}

async function exportPages(pageIds, mode) {
  if (isExporting) return;

  const pages = pageIds
    .map((pageId) => state.pages.find((page) => page.id === pageId))
    .filter(Boolean);
  if (pages.length === 0) return;

  const snapshots = pages.map(createRenderSnapshot);
  isExporting = true;
  setExportStatus("");
  renderScreenshotList();
  updatePageControls();
  elements.exportButton.textContent = mode === "all" ? "请稍候…" : "正在生成…";
  elements.exportAllButton.textContent = "正在生成…";

  try {
    await (document.fonts?.ready ?? Promise.resolve());

    const selectedFrame = FRAMES.find((item) => item.id === snapshots[0].frame) ?? FRAMES[0];
    const frameImage = await loadImage(selectedFrame.src, "iPhone 机框");
    const { canvas, context } = createExportCanvas();
    const downloads = [];

    for (const [index, snapshot] of snapshots.entries()) {
      setExportStatus(`正在生成 ${index + 1} / ${snapshots.length}…`);
      const blob = await renderSnapshotToBlob(snapshot, canvas, context, frameImage);
      downloads.push({ blob, fileName: getExportFileName(snapshot) });
    }

    downloads.forEach(({ blob, fileName }) => downloadBlob(blob, fileName));

    if (downloads.length === 1) {
      setExportStatus(`已生成 ${ARTBOARD.width} × ${ARTBOARD.height} PNG`);
    } else {
      setExportStatus(
        `已触发 ${downloads.length} 个 PNG 下载；如未全部下载，请允许浏览器下载多个文件。`,
      );
    }
  } catch (error) {
    console.error("PNG export failed", error);
    setExportStatus(`导出失败：${error.message}`, true);
  } finally {
    isExporting = false;
    elements.exportButton.textContent = "导出当前 PNG";
    elements.exportAllButton.textContent = `导出全部（${state.pages.length}）`;
    renderScreenshotList();
    updatePageControls();
  }
}

function exportCurrentPoster() {
  return exportPages([state.activePageId], "current");
}

function exportAllPosters() {
  return exportPages(
    state.pages.map((page) => page.id),
    "all",
  );
}

function isSupportedImageFile(file) {
  return ALLOWED_IMAGE_TYPES.has(file.type) || /\.(?:png|jpe?g|webp)$/i.test(file.name);
}

async function createUploadedPage(file, templatePage) {
  const objectUrl = URL.createObjectURL(file);

  try {
    await loadImage(objectUrl, file.name);
    return createPage({
      title: templatePage.title,
      subtitle: templatePage.subtitle,
      screenshot: objectUrl,
      screenshotName: file.name,
      fit: templatePage.fit,
      objectUrl,
    });
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw new Error(`${file.name} 无法读取`);
  }
}

async function importScreenshots(fileList) {
  const files = Array.from(fileList);
  if (files.length === 0 || isImporting || isExporting) return;

  const unsupportedFile = files.find((file) => !isSupportedImageFile(file));
  if (unsupportedFile) {
    setScreenshotStatus(`未添加：${unsupportedFile.name} 不是支持的图片格式。`, true);
    return;
  }

  const isReplacingSample = state.pages.length === 1 && state.pages[0].isSample;
  const existingCount = isReplacingSample ? 0 : state.pages.length;
  if (existingCount + files.length > MAX_SCREENSHOTS) {
    setScreenshotStatus(`未添加：截图组最多 ${MAX_SCREENSHOTS} 张。`, true);
    return;
  }

  isImporting = true;
  setScreenshotStatus(`正在读取 ${files.length} 张截图…`);
  renderScreenshotList();
  updatePageControls();

  const templatePage = { ...getActivePage() };
  const importedPages = [];

  try {
    for (const file of files) {
      importedPages.push(await createUploadedPage(file, templatePage));
    }

    if (isReplacingSample) {
      releaseAllPages();
      state.pages = importedPages;
    } else {
      state.pages.push(...importedPages);
    }

    state.activePageId = importedPages[0].id;
    applyState();
    setScreenshotStatus(`已添加 ${importedPages.length} 张截图。`);
  } catch (error) {
    importedPages.forEach(releasePage);
    setScreenshotStatus(`未添加：${error.message}`, true);
  } finally {
    isImporting = false;
    renderScreenshotList();
    updatePageControls();
  }
}

function resetState() {
  const hasUserScreenshots = state.pages.some((page) => !page.isSample);
  if (
    hasUserScreenshots &&
    !window.confirm("恢复默认会移除已添加的全部截图和文案，是否继续？")
  ) {
    return;
  }

  releaseAllPages();
  const defaultPage = createDefaultPage();
  state.frame = DEFAULTS.frame;
  state.deviceWidth = DEFAULTS.deviceWidth;
  state.deviceTop = DEFAULTS.deviceTop;
  state.pages = [defaultPage];
  state.activePageId = defaultPage.id;
  elements.screenshotInput.value = "";
  setExportStatus("");
  setScreenshotStatus("");
  applyState();
}

function focusActiveScreenshot() {
  requestAnimationFrame(() => {
    elements.screenshotList
      .querySelector(`[data-page-id="${state.activePageId}"]`)
      ?.focus({ preventScroll: true });
  });
}

function moveActivePage(offset) {
  if (isImporting || isExporting) return;

  const currentIndex = getActivePageIndex();
  const targetIndex = currentIndex + offset;
  if (targetIndex < 0 || targetIndex >= state.pages.length) return;

  const [page] = state.pages.splice(currentIndex, 1);
  state.pages.splice(targetIndex, 0, page);
  renderScreenshotList();
  updatePageControls();
  setScreenshotStatus(`已将当前截图移至第 ${targetIndex + 1} 张。`);
  setExportStatus("");
  focusActiveScreenshot();
}

function deleteActivePage() {
  if (isImporting || isExporting) return;

  const currentIndex = getActivePageIndex();
  const [deletedPage] = state.pages.splice(currentIndex, 1);
  if (!deletedPage || (deletedPage.isSample && state.pages.length === 0)) {
    if (deletedPage) state.pages.splice(currentIndex, 0, deletedPage);
    return;
  }

  releasePage(deletedPage);

  if (state.pages.length === 0) state.pages.push(createDefaultPage());
  state.activePageId = state.pages[Math.min(currentIndex, state.pages.length - 1)].id;
  applyState();
  setScreenshotStatus(`已删除 ${deletedPage.screenshotName}。`);
  setExportStatus("");
  focusActiveScreenshot();
}

function toggleFocusMode(force) {
  const shouldFocus = force ?? !document.body.classList.contains("preview-only");
  document.body.classList.toggle("preview-only", shouldFocus);
  elements.focusButton.textContent = shouldFocus ? "返回编辑" : "专注预览";
  requestAnimationFrame(resizePreview);
}

function bindEvents() {
  elements.controls.addEventListener("input", () => setExportStatus(""));
  elements.controls.addEventListener("change", () => setExportStatus(""));

  elements.titleInput.addEventListener("input", (event) => {
    const page = getActivePage();
    page.title = event.target.value;
    elements.posterTitle.textContent = page.title;
  });

  elements.subtitleInput.addEventListener("input", (event) => {
    const page = getActivePage();
    page.subtitle = event.target.value;
    elements.posterSubtitle.textContent = page.subtitle;
  });

  elements.frameSelect.addEventListener("change", (event) => {
    applyFrame(event.target.value);
  });

  elements.screenshotInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    event.target.value = "";
    importScreenshots(files);
  });

  elements.fitSelect.addEventListener("change", (event) => {
    const page = getActivePage();
    page.fit = event.target.value;
    elements.screenshotImage.style.objectFit = page.fit;
  });

  elements.screenshotList.addEventListener("click", (event) => {
    const button = event.target.closest(".screenshot-card");
    if (!button) return;
    selectPage(button.dataset.pageId, { focus: true });
  });

  elements.moveScreenshotPrevious.addEventListener("click", () => moveActivePage(-1));
  elements.moveScreenshotNext.addEventListener("click", () => moveActivePage(1));
  elements.deleteScreenshot.addEventListener("click", deleteActivePage);

  elements.deviceWidthInput.addEventListener("input", (event) => {
    state.deviceWidth = Number(event.target.value);
    applyLayout();
  });

  elements.deviceTopInput.addEventListener("input", (event) => {
    state.deviceTop = Number(event.target.value);
    applyLayout();
  });

  elements.resetButton.addEventListener("click", resetState);
  elements.focusButton.addEventListener("click", () => toggleFocusMode());
  elements.exportButton.addEventListener("click", exportCurrentPoster);
  elements.exportAllButton.addEventListener("click", exportAllPosters);

  window.addEventListener("resize", resizePreview);
  window.addEventListener("beforeunload", releaseAllPages);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("preview-only")) {
      toggleFocusMode(false);
    }
  });
}

function initialize() {
  if (isRenderMode) document.body.classList.add("render-mode");
  populateFrameSelect();
  applyState();
  bindEvents();
  resizePreview();

  if ("ResizeObserver" in window && !isRenderMode) {
    const resizeObserver = new ResizeObserver(resizePreview);
    resizeObserver.observe(elements.stage);
  }
}

initialize();
