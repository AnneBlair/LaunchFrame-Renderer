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

const elements = {
  controls: document.querySelector(".controls"),
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
  screenshotImage: document.querySelector("#screenshotImage"),
  screenshotName: document.querySelector("#screenshotName"),
  screenPlaceholder: document.querySelector("#screenPlaceholder"),
  fitSelect: document.querySelector("#fitSelect"),
  deviceWidthInput: document.querySelector("#deviceWidthInput"),
  deviceWidthOutput: document.querySelector("#deviceWidthOutput"),
  deviceTopInput: document.querySelector("#deviceTopInput"),
  deviceTopOutput: document.querySelector("#deviceTopOutput"),
  resetButton: document.querySelector("#resetButton"),
  focusButton: document.querySelector("#focusButton"),
  exportButton: document.querySelector("#exportButton"),
  exportStatus: document.querySelector("#exportStatus"),
  zoomLabel: document.querySelector("#zoomLabel"),
};

const params = new URLSearchParams(window.location.search);
const isRenderMode = params.get("render") === "1";
let screenshotObjectUrl = null;
let isExporting = false;

const state = {
  title: params.get("title") ?? DEFAULTS.title,
  subtitle: params.get("subtitle") ?? DEFAULTS.subtitle,
  frame: params.get("frame") ?? DEFAULTS.frame,
  screenshot: params.get("screenshot") ?? DEFAULTS.screenshot,
  fit: params.get("fit") ?? DEFAULTS.fit,
  deviceWidth: getNumericParam("deviceWidth", DEFAULTS.deviceWidth, 760, 1120),
  deviceTop: getNumericParam("deviceTop", DEFAULTS.deviceTop, 500, 900),
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

function applyText() {
  elements.titleInput.value = state.title;
  elements.subtitleInput.value = state.subtitle;
  elements.posterTitle.textContent = state.title;
  elements.posterSubtitle.textContent = state.subtitle;
}

function applyScreenshot() {
  elements.screenshotImage.hidden = false;
  elements.screenPlaceholder.hidden = true;
  elements.screenshotImage.src = state.screenshot;
  elements.screenshotImage.style.objectFit = state.fit;
  elements.fitSelect.value = state.fit;
}

function applyLayout() {
  elements.device.style.width = `${state.deviceWidth}px`;
  elements.device.style.top = `${state.deviceTop}px`;
  elements.deviceWidthInput.value = String(state.deviceWidth);
  elements.deviceTopInput.value = String(state.deviceTop);
  elements.deviceWidthOutput.value = `${state.deviceWidth} px`;
  elements.deviceTopOutput.value = `${state.deviceTop} px`;
}

function applyState() {
  applyText();
  applyFrame(state.frame);
  applyScreenshot();
  applyLayout();
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

function drawPoster(context) {
  const frame = FRAMES.find((item) => item.id === state.frame) ?? FRAMES[0];
  const geometry = MODEL_GEOMETRY[frame.model];
  const deviceScale = state.deviceWidth / geometry.frameWidth;
  const deviceHeight = geometry.frameHeight * deviceScale;
  const deviceX = (ARTBOARD.width - state.deviceWidth) / 2;
  const screenX = deviceX + geometry.screenX * deviceScale;
  const screenY = state.deviceTop + geometry.screenY * deviceScale;
  const screenWidth = geometry.screenWidth * deviceScale;
  const screenHeight = geometry.screenHeight * deviceScale;

  context.fillStyle = "#fdfdfc";
  context.fillRect(0, 0, ARTBOARD.width, ARTBOARD.height);
  drawDeviceShadow(context, deviceX, state.deviceTop, state.deviceWidth, deviceHeight);

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
    elements.screenshotImage,
    screenX,
    screenY,
    screenWidth,
    screenHeight,
    state.fit,
  );
  context.restore();

  context.drawImage(
    elements.frameImage,
    deviceX,
    state.deviceTop,
    state.deviceWidth,
    deviceHeight,
  );

  const titleHeight = drawTextBlock(context, {
    lines: getRenderedTextLines(elements.posterTitle),
    top: 130,
    font: '750 112px "PingFang SC", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    fontSize: 112,
    lineHeight: 112 * 1.04,
    letterSpacing: -5,
    color: "#050505",
  });

  drawTextBlock(context, {
    lines: getRenderedTextLines(elements.posterSubtitle),
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

function downloadBlob(blob) {
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = `launchframe-${ARTBOARD.width}x${ARTBOARD.height}.png`;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

function setExportStatus(message, isError = false) {
  elements.exportStatus.textContent = message;
  elements.exportStatus.classList.toggle("is-error", isError);
}

async function exportPoster() {
  if (isExporting) return;

  isExporting = true;
  elements.exportButton.disabled = true;
  elements.exportButton.textContent = "正在生成 PNG…";
  setExportStatus("");

  try {
    await Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      decodeImage(elements.screenshotImage, "iOS 截图"),
      decodeImage(elements.frameImage, "iPhone 机框"),
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = ARTBOARD.width;
    canvas.height = ARTBOARD.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("当前浏览器不支持图片导出");

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    drawPoster(context);

    const blob = await canvasToPngBlob(canvas);
    downloadBlob(blob);
    setExportStatus(`已生成 ${ARTBOARD.width} × ${ARTBOARD.height} PNG`);
  } catch (error) {
    console.error("PNG export failed", error);
    setExportStatus("导出失败，请确认截图已加载且允许跨域读取。", true);
  } finally {
    isExporting = false;
    elements.exportButton.disabled = false;
    elements.exportButton.textContent = "导出 PNG 图片";
  }
}

function resetState() {
  if (screenshotObjectUrl) {
    URL.revokeObjectURL(screenshotObjectUrl);
    screenshotObjectUrl = null;
  }

  Object.assign(state, DEFAULTS);
  elements.screenshotInput.value = "";
  elements.screenshotName.textContent = "当前使用示例截图";
  setExportStatus("");
  applyState();
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
    state.title = event.target.value;
    elements.posterTitle.textContent = state.title;
  });

  elements.subtitleInput.addEventListener("input", (event) => {
    state.subtitle = event.target.value;
    elements.posterSubtitle.textContent = state.subtitle;
  });

  elements.frameSelect.addEventListener("change", (event) => {
    applyFrame(event.target.value);
  });

  elements.screenshotInput.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (!file) return;

    if (screenshotObjectUrl) URL.revokeObjectURL(screenshotObjectUrl);
    screenshotObjectUrl = URL.createObjectURL(file);
    state.screenshot = screenshotObjectUrl;
    elements.screenshotName.textContent = file.name;
    applyScreenshot();
  });

  elements.screenshotImage.addEventListener("load", () => {
    elements.screenshotImage.hidden = false;
    elements.screenPlaceholder.hidden = true;
  });

  elements.screenshotImage.addEventListener("error", () => {
    elements.screenshotImage.hidden = true;
    elements.screenPlaceholder.hidden = false;
  });

  elements.fitSelect.addEventListener("change", (event) => {
    state.fit = event.target.value;
    elements.screenshotImage.style.objectFit = state.fit;
  });

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
  elements.exportButton.addEventListener("click", exportPoster);

  window.addEventListener("resize", resizePreview);
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
