const PRODUCT_CONFIGS = Object.freeze({
  iphone: {
    artboard: { width: 1320, height: 2868 },
    background: "#fdfdfc",
    screenshotAspectRatio: "1320 / 2868",
    geometry: {
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
    },
    frameGroups: [
      {
        label: "iPhone 17 Pro Max",
        model: "iphone-17-pro-max",
        folder: "iPhone 17 Pro Max",
        orientation: "Portrait",
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
        orientation: "Portrait",
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
        orientation: "Portrait",
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
        orientation: "Portrait",
        colors: [
          ["cloud-white", "云白色", "Cloud White"],
          ["light-gold", "浅金色", "Light Gold"],
          ["sky-blue", "天蓝色", "Sky Blue"],
          ["space-black", "深空黑色", "Space Black"],
        ],
      },
    ],
    defaults: {
      title: "不只是背单词，\n更要真正掌握语言",
      subtitle: "发音、释义、例句、备注，一张卡片完\n成一次有效学习。",
      frame: "iphone-17-black",
      screenshot: "./assets/sample-screenshot.png",
      screenshotName: "示例截图",
      fit: "cover",
      deviceWidth: 930,
      deviceTop: 730,
    },
    layout: {
      deviceWidth: { min: 760, max: 1120, step: 2 },
      deviceTop: { min: 500, max: 900, step: 2 },
    },
    copy: {
      top: 130,
      side: 82,
      gap: 60,
      title: {
        fontFamily: '"PingFang SC", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        fontSize: 112,
        fontWeight: 750,
        lineHeight: 1.04,
        letterSpacing: -5,
      },
      subtitle: {
        fontFamily: '"Songti SC", STSong, "Noto Serif CJK SC", "Times New Roman", serif',
        fontSize: 60,
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: 2,
      },
    },
    frameLoadLabel: "iPhone 机框",
    exportPrefix: "launchframe",
  },
  ipad: {
    artboard: { width: 2732, height: 2048 },
    background: "#f2f2f2",
    screenshotAspectRatio: "4 / 3",
    geometry: {
      "ipad-pro-m5-13": {
        frameWidth: 3000,
        frameHeight: 2300,
        screenX: 124,
        screenY: 118,
        screenWidth: 2752,
        screenHeight: 2064,
        screenRadius: 60,
      },
      "ipad-pro-m5-11": {
        frameWidth: 2640,
        frameHeight: 1880,
        screenX: 110,
        screenY: 106,
        screenWidth: 2420,
        screenHeight: 1668,
        screenRadius: 60,
      },
    },
    frameGroups: [
      {
        label: "iPad Pro (M5) 13″",
        assetName: 'iPad Pro (M5) 13"',
        model: "ipad-pro-m5-13",
        folder: "iPad Pro (M5)",
        orientation: "Landscape",
        colors: [
          ["space-black", "深空黑色", "Space Black"],
          ["silver", "银色", "Silver"],
        ],
      },
      {
        label: "iPad Pro (M5) 11″",
        assetName: 'iPad Pro (M5) 11"',
        model: "ipad-pro-m5-11",
        folder: "iPad Pro (M5)",
        orientation: "Landscape",
        colors: [
          ["space-black", "深空黑色", "Space Black"],
          ["silver", "银色", "Silver"],
        ],
      },
    ],
    defaults: {
      title: "海量词书，掌握你的英语",
      subtitle: "从入门到进阶，随时随地高效记忆单词",
      frame: "ipad-pro-m5-11-space-black",
      screenshot: "./assets/sample-ipad-screenshot.png",
      screenshotName: "iPad 示例截图",
      fit: "fill",
      deviceWidth: 1760,
      deviceTop: 536,
    },
    layout: {
      deviceWidth: { min: 1500, max: 2200, step: 4 },
      deviceTop: { min: 460, max: 720, step: 4 },
    },
    copy: {
      top: 215,
      side: 160,
      gap: 75,
      title: {
        fontFamily: '"PingFang SC", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        fontSize: 74,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: -5,
      },
      subtitle: {
        fontFamily: '"PingFang SC", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        fontSize: 56,
        fontWeight: 400,
        lineHeight: 1.35,
        letterSpacing: 2,
      },
    },
    frameLoadLabel: "iPad 机框",
    exportPrefix: "launchframe-ipad",
  },
});

const requestedProductKey = document.body.dataset.product;
const productKey = PRODUCT_CONFIGS[requestedProductKey] ? requestedProductKey : "iphone";
const PRODUCT = PRODUCT_CONFIGS[productKey];
document.body.dataset.product = productKey;
const ARTBOARD = Object.freeze(PRODUCT.artboard);
const MODEL_GEOMETRY = Object.freeze(PRODUCT.geometry);
const FRAME_GROUPS = PRODUCT.frameGroups;
const DEFAULTS = Object.freeze(PRODUCT.defaults);
const LAYOUT_ENGINE =
  productKey === "iphone" && window.LaunchFrameLayouts ? window.LaunchFrameLayouts : null;
const IPHONE_LAYOUTS_ENABLED = Boolean(LAYOUT_ENGINE);

const FRAMES = FRAME_GROUPS.flatMap((group) =>
  group.colors.map(([colorId, colorLabel, fileColor]) => ({
    id: `${group.model}-${colorId}`,
    groupLabel: group.label,
    label: `${group.label} · ${colorLabel}`,
    model: group.model,
    colorId,
    src: `./assets/frames/${group.folder}/${group.assetName ?? group.label} - ${fileColor} - ${group.orientation}.png`,
  })),
);

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
  compositionLayer: document.querySelector("#compositionLayer"),
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
  layoutGallery: document.querySelector("#layoutGallery"),
  themeOptions: document.querySelector("#themeOptions"),
  slotAssignmentPanel: document.querySelector("#slotAssignmentPanel"),
  slotAssignments: document.querySelector("#slotAssignments"),
  slotAssignmentHint: document.querySelector("#slotAssignmentHint"),
  annotationPanel: document.querySelector("#annotationPanel"),
  annotationsToggle: document.querySelector("#annotationsToggle"),
  annotationFields: document.querySelector("#annotationFields"),
  annotationStatus: document.querySelector("#annotationStatus"),
  layoutValidationStatus: document.querySelector("#layoutValidationStatus"),
  classicLayoutControls: document.querySelector("#classicLayoutControls"),
  presetLayoutControls: document.querySelector("#presetLayoutControls"),
  layoutScaleInput: document.querySelector("#layoutScaleInput"),
  layoutScaleOutput: document.querySelector("#layoutScaleOutput"),
  layoutYInput: document.querySelector("#layoutYInput"),
  layoutYOutput: document.querySelector("#layoutYOutput"),
  layoutSpreadInput: document.querySelector("#layoutSpreadInput"),
  layoutSpreadOutput: document.querySelector("#layoutSpreadOutput"),
  layoutTiltInput: document.querySelector("#layoutTiltInput"),
  layoutTiltOutput: document.querySelector("#layoutTiltOutput"),
  focusXInput: document.querySelector("#focusXInput"),
  focusXOutput: document.querySelector("#focusXOutput"),
  focusYInput: document.querySelector("#focusYInput"),
  focusYOutput: document.querySelector("#focusYOutput"),
  resetLayoutButton: document.querySelector("#resetLayoutButton"),
};

function applyProductConfiguration() {
  const rootStyle = document.documentElement.style;
  const copy = PRODUCT.copy;

  rootStyle.setProperty("--artboard-width", `${ARTBOARD.width}px`);
  rootStyle.setProperty("--artboard-height", `${ARTBOARD.height}px`);
  rootStyle.setProperty("--poster-background", PRODUCT.background);
  rootStyle.setProperty("--screenshot-aspect-ratio", PRODUCT.screenshotAspectRatio);
  rootStyle.setProperty("--copy-top", `${copy.top}px`);
  rootStyle.setProperty("--copy-side", `${copy.side}px`);
  rootStyle.setProperty("--copy-width", `${ARTBOARD.width - copy.side * 2}px`);
  rootStyle.setProperty("--copy-gap", `${copy.gap}px`);
  rootStyle.setProperty("--title-font-family", copy.title.fontFamily);
  rootStyle.setProperty("--title-font-size", `${copy.title.fontSize}px`);
  rootStyle.setProperty("--title-font-weight", String(copy.title.fontWeight));
  rootStyle.setProperty("--title-line-height", String(copy.title.lineHeight));
  rootStyle.setProperty("--title-letter-spacing", `${copy.title.letterSpacing}px`);
  rootStyle.setProperty("--subtitle-font-family", copy.subtitle.fontFamily);
  rootStyle.setProperty("--subtitle-font-size", `${copy.subtitle.fontSize}px`);
  rootStyle.setProperty("--subtitle-font-weight", String(copy.subtitle.fontWeight));
  rootStyle.setProperty("--subtitle-line-height", String(copy.subtitle.lineHeight));
  rootStyle.setProperty("--subtitle-letter-spacing", `${copy.subtitle.letterSpacing}px`);
  rootStyle.setProperty("--device-default-width", `${DEFAULTS.deviceWidth}px`);

  for (const [input, range] of [
    [elements.deviceWidthInput, PRODUCT.layout.deviceWidth],
    [elements.deviceTopInput, PRODUCT.layout.deviceTop],
  ]) {
    input.min = String(range.min);
    input.max = String(range.max);
    input.step = String(range.step);
  }
}

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
  imageWidth = null,
  imageHeight = null,
  autoMatchFrame = false,
  objectUrl = null,
  isSample = false,
  isAuxiliary = false,
  imageState = screenshot ? "loading" : "empty",
  layoutId = "classic",
  layoutTuning,
  slotOverrides,
  annotations,
}) {
  const layoutState = LAYOUT_ENGINE
    ? LAYOUT_ENGINE.createDefaultLayoutState({
        layoutId,
        layoutTuning,
        slotOverrides,
        annotations,
      })
    : {
        layoutId: "classic",
        layoutTuning: null,
        slotOverrides: {},
        annotations: { enabled: false, labels: ["", "", ""] },
      };

  return {
    id: `screenshot-${nextPageId++}`,
    title,
    subtitle,
    screenshot,
    screenshotName,
    fit,
    imageWidth,
    imageHeight,
    autoMatchFrame,
    objectUrl,
    isSample,
    isAuxiliary,
    imageState,
    annotationOverflow: false,
    ...layoutState,
  };
}

function createDefaultPage() {
  return createPage({
    title: DEFAULTS.title,
    subtitle: DEFAULTS.subtitle,
    screenshot: DEFAULTS.screenshot,
    screenshotName: DEFAULTS.screenshotName,
    fit: DEFAULTS.fit,
    isSample: true,
  });
}

const screenshotParam = params.get("screenshot");
const hasScreenshotParam = screenshotParam !== null && screenshotParam.trim() !== "";
const initialLayoutState = LAYOUT_ENGINE
  ? LAYOUT_ENGINE.createDefaultLayoutState({
      layoutId: params.get("layout") ?? "classic",
      layoutTuning: {
        scale: params.has("layoutScale") ? params.get("layoutScale") : undefined,
        y: params.has("layoutY") ? params.get("layoutY") : undefined,
        spread: params.has("layoutSpread") ? params.get("layoutSpread") : undefined,
        tilt: params.has("layoutTilt") ? params.get("layoutTilt") : undefined,
        focusX: params.has("focusX") ? params.get("focusX") : undefined,
        focusY: params.has("focusY") ? params.get("focusY") : undefined,
      },
      annotations: {
        enabled: params.get("annotations") === "1",
        labels: [
          params.get("annotation1") ?? "",
          params.get("annotation2") ?? "",
          params.get("annotation3") ?? "",
        ],
      },
    })
  : null;
const initialPage = createPage({
  title: params.get("title") ?? DEFAULTS.title,
  subtitle: params.get("subtitle") ?? DEFAULTS.subtitle,
  screenshot: hasScreenshotParam ? screenshotParam : DEFAULTS.screenshot,
  screenshotName: hasScreenshotParam ? "URL 截图" : DEFAULTS.screenshotName,
  fit: normalizeFitMode(params.get("fit") ?? DEFAULTS.fit),
  autoMatchFrame: productKey === "ipad" && hasScreenshotParam && !params.has("frame"),
  isSample: !hasScreenshotParam,
  ...(initialLayoutState ?? {}),
});

const initialPages = [initialPage];
if (LAYOUT_ENGINE && isRenderMode) {
  for (let slot = 1; slot <= 2; slot += 1) {
    const parameterIndex = slot + 1;
    const screenshot = params.get(`screenshot${parameterIndex}`);
    if (!screenshot?.trim()) continue;
    const auxiliaryPage = createPage({
      title: "",
      subtitle: "",
      screenshot,
      screenshotName: `URL 截图 ${parameterIndex}`,
      fit: normalizeFitMode(params.get(`fit${parameterIndex}`) ?? DEFAULTS.fit),
      isAuxiliary: true,
    });
    initialPages.push(auxiliaryPage);
    initialPage.slotOverrides[slot] = auxiliaryPage.id;
  }
}

const state = {
  frame: params.get("frame") ?? DEFAULTS.frame,
  themeId: LAYOUT_ENGINE
    ? LAYOUT_ENGINE.normalizeThemeId(params.get("theme") ?? "porcelain")
    : null,
  deviceWidth: getNumericParam(
    "deviceWidth",
    DEFAULTS.deviceWidth,
    PRODUCT.layout.deviceWidth.min,
    PRODUCT.layout.deviceWidth.max,
  ),
  deviceTop: getNumericParam(
    "deviceTop",
    DEFAULTS.deviceTop,
    PRODUCT.layout.deviceTop.min,
    PRODUCT.layout.deviceTop.max,
  ),
  pages: initialPages,
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

function normalizeFitMode(fit) {
  const availableModes =
    productKey === "ipad" ? ["fill", "cover", "contain"] : ["cover", "contain"];
  return availableModes.includes(fit) ? fit : DEFAULTS.fit;
}

function getClosestFrameIdForImage(width, height, currentFrameId = state.frame) {
  if (productKey !== "ipad" || !width || !height) return currentFrameId;

  const screenshotRatio = width / height;
  const currentFrame = FRAMES.find((frame) => frame.id === currentFrameId) ?? FRAMES[0];
  const models = [...new Set(FRAMES.map((frame) => frame.model))];
  const closestModel = models.reduce((bestModel, model) => {
    const geometry = MODEL_GEOMETRY[model];
    const bestGeometry = MODEL_GEOMETRY[bestModel];
    const score = Math.abs(
      Math.log(geometry.screenWidth / geometry.screenHeight / screenshotRatio),
    );
    const bestScore = Math.abs(
      Math.log(bestGeometry.screenWidth / bestGeometry.screenHeight / screenshotRatio),
    );
    return score < bestScore ? model : bestModel;
  });

  return (
    FRAMES.find(
      (frame) => frame.model === closestModel && frame.colorId === currentFrame.colorId,
    )?.id ?? FRAMES.find((frame) => frame.model === closestModel)?.id ?? currentFrameId
  );
}

function getActivePage() {
  return state.pages.find((page) => page.id === state.activePageId) ?? state.pages[0];
}

function getOutputPages() {
  return state.pages.filter((page) => !page.isAuxiliary);
}

function getActivePageIndex() {
  return getOutputPages().findIndex((page) => page.id === state.activePageId);
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
  if (LAYOUT_ENGINE) {
    elements.frameImage.onload = () => {
      delete elements.frameImage.dataset.loadError;
      updateRenderState();
    };
    elements.frameImage.onerror = () => {
      elements.frameImage.dataset.loadError = "iPhone 机框无法读取";
      updateRenderState();
    };
  }
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

function getLayoutPreset(page = getActivePage()) {
  if (!LAYOUT_ENGINE) return null;
  return LAYOUT_ENGINE.LAYOUT_PRESETS[LAYOUT_ENGINE.normalizeLayoutId(page.layoutId)];
}

function resolvePageSlots(page = getActivePage()) {
  if (!LAYOUT_ENGINE) return [page];
  const preset = getLayoutPreset(page);
  return LAYOUT_ENGINE.resolveSlotPages(
    state.pages,
    page.id,
    page.slotOverrides,
    preset.slotCount,
  );
}

function getPageLayoutValidation(page = getActivePage()) {
  if (!LAYOUT_ENGINE) {
    return { valid: Boolean(page.screenshot), errors: page.screenshot ? [] : ["截图为空"] };
  }
  const preset = getLayoutPreset(page);
  const validation = LAYOUT_ENGINE.validateComposition({
    slots: resolvePageSlots(page),
    slotCount: preset.slotCount,
    annotationOverflow: page.annotationOverflow,
  });
  if (preset.id === "classic") return validation;

  const textLines = getPageTextLines(page);
  const scene = LAYOUT_ENGINE.resolveComposition({
    layoutId: page.layoutId,
    tuning: page.layoutTuning,
    classicDeviceWidth: state.deviceWidth,
    classicDeviceTop: state.deviceTop,
  });
  const titleSize = PRODUCT.copy.title.fontSize * scene.copy.titleScale;
  const subtitleSize = PRODUCT.copy.subtitle.fontSize * scene.copy.subtitleScale;
  const copyBottom =
    scene.copy.top +
    textLines.title.length * titleSize * PRODUCT.copy.title.lineHeight +
    (textLines.subtitle.length ? PRODUCT.copy.gap : 0) +
    textLines.subtitle.length * subtitleSize * PRODUCT.copy.subtitle.lineHeight;
  const firstVisualTop = Math.min(...scene.nodes.map((node) => node.top));
  const errors = [...validation.errors];
  const hasHorizontalOverflow = [
    elements.exportMeasureTitle,
    elements.exportMeasureSubtitle,
  ].some((element) => element.scrollWidth > element.clientWidth + 1);
  if (hasHorizontalOverflow) {
    errors.push("标题或说明文案超出安全宽度");
  }
  if (copyBottom > firstVisualTop - 48) {
    errors.push("标题或说明文案过长，已进入设备安全区");
  }
  return { valid: errors.length === 0, errors };
}

function applyTheme() {
  if (!LAYOUT_ENGINE) return;
  state.themeId = LAYOUT_ENGINE.normalizeThemeId(state.themeId);
  const theme = LAYOUT_ENGINE.THEMES[state.themeId];
  const rootStyle = document.documentElement.style;

  rootStyle.setProperty("--poster-background", LAYOUT_ENGINE.getBackgroundCss(state.themeId));
  rootStyle.setProperty("--poster-title-color", theme.titleColor);
  rootStyle.setProperty("--poster-subtitle-color", theme.subtitleColor);
  rootStyle.setProperty("--poster-accent-color", theme.accentColor);
  rootStyle.setProperty("--annotation-surface", theme.annotationSurface);
  rootStyle.setProperty("--annotation-text", theme.annotationText);
  rootStyle.setProperty("--composition-shadow-color", theme.shadowColor);
  rootStyle.setProperty("--lens-border-color", theme.lensBorder);
  elements.artboard.dataset.theme = state.themeId;

  elements.themeOptions?.querySelectorAll(".theme-option").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.themeId === state.themeId));
  });
}

function applyCopyLayout(page, scene) {
  if (!LAYOUT_ENGINE) return;
  const copyElement = elements.posterTitle.parentElement;
  const rootStyle = document.documentElement.style;
  const copy = scene.copy;

  rootStyle.setProperty("--copy-width", `${copy.width}px`);
  rootStyle.setProperty("--title-font-size", `${PRODUCT.copy.title.fontSize * copy.titleScale}px`);
  rootStyle.setProperty(
    "--subtitle-font-size",
    `${PRODUCT.copy.subtitle.fontSize * copy.subtitleScale}px`,
  );

  if (page.layoutId === "classic") {
    rootStyle.setProperty("--copy-top", `${PRODUCT.copy.top}px`);
    rootStyle.setProperty("--copy-side", `${PRODUCT.copy.side}px`);
    rootStyle.setProperty("--copy-width", `${ARTBOARD.width - PRODUCT.copy.side * 2}px`);
    rootStyle.setProperty("--title-font-size", `${PRODUCT.copy.title.fontSize}px`);
    rootStyle.setProperty("--subtitle-font-size", `${PRODUCT.copy.subtitle.fontSize}px`);
    copyElement.removeAttribute("style");
    return;
  }

  copyElement.style.top = `${copy.top}px`;
  copyElement.style.right = "auto";
  copyElement.style.left = `${copy.left}px`;
  copyElement.style.width = `${copy.width}px`;
  copyElement.style.textAlign = copy.align;
}

function createCompositionPlaceholder(message) {
  const placeholder = document.createElement("span");
  placeholder.className = "composition-placeholder";
  placeholder.textContent = message;
  return placeholder;
}

function trackCompositionImage(image, page, placeholder) {
  if (!page?.screenshot) return;
  page.imageState = page.imageState === "ready" ? "ready" : "loading";
  image.crossOrigin = "anonymous";
  image.alt = "";
  image.onload = () => {
    page.imageState = "ready";
    page.imageWidth ??= image.naturalWidth;
    page.imageHeight ??= image.naturalHeight;
    placeholder.hidden = true;
    updateRenderState();
    updatePageControls();
  };
  image.onerror = () => {
    page.imageState = "error";
    image.hidden = true;
    placeholder.hidden = false;
    placeholder.textContent = "截图无法读取";
    updateRenderState();
    updatePageControls();
  };
  image.src = page.screenshot;
}

function createDeviceNode(node, slotPage, frame, geometry) {
  const wrapper = document.createElement("div");
  wrapper.className = "composition-device";
  wrapper.style.left = `${node.cx}px`;
  wrapper.style.top = `${node.top}px`;
  wrapper.style.width = `${node.width}px`;
  wrapper.style.aspectRatio = `${geometry.frameWidth} / ${geometry.frameHeight}`;
  wrapper.style.zIndex = String(node.z);
  wrapper.style.transform = `translateX(-50%) rotate(${node.rotation}deg)`;

  const screen = document.createElement("div");
  screen.className = "composition-screen";
  screen.style.left = toPercent(geometry.screenX, geometry.frameWidth);
  screen.style.top = toPercent(geometry.screenY, geometry.frameHeight);
  screen.style.width = toPercent(geometry.screenWidth, geometry.frameWidth);
  screen.style.height = toPercent(geometry.screenHeight, geometry.frameHeight);
  screen.style.borderRadius = `${toPercent(
    geometry.screenRadius,
    geometry.screenWidth,
  )} / ${toPercent(geometry.screenRadius, geometry.screenHeight)}`;

  const screenshot = document.createElement("img");
  screenshot.style.objectFit = slotPage?.fit ?? DEFAULTS.fit;
  const placeholder = createCompositionPlaceholder(
    slotPage?.screenshot ? "正在读取截图" : `缺少第 ${node.slot + 1} 张截图`,
  );
  screen.append(screenshot, placeholder);
  if (slotPage?.screenshot) trackCompositionImage(screenshot, slotPage, placeholder);

  const frameImage = document.createElement("img");
  frameImage.className = "composition-frame";
  frameImage.alt = "";
  frameImage.onload = () => {
    delete frameImage.dataset.loadError;
    updateRenderState();
  };
  frameImage.onerror = () => {
    frameImage.dataset.loadError = "iPhone 机框无法读取";
    updateRenderState();
  };
  frameImage.src = frame.src;
  wrapper.append(screen, frameImage);
  return wrapper;
}

function createCardNode(node, slotPage) {
  const wrapper = document.createElement("div");
  wrapper.className = "composition-card";
  wrapper.style.left = `${node.cx}px`;
  wrapper.style.top = `${node.top}px`;
  wrapper.style.width = `${node.width}px`;
  wrapper.style.aspectRatio = PRODUCT.screenshotAspectRatio;
  wrapper.style.zIndex = String(node.z);
  wrapper.style.transform = `translateX(-50%) rotate(${node.rotation}deg)`;

  const screenshot = document.createElement("img");
  screenshot.style.objectFit = slotPage?.fit ?? DEFAULTS.fit;
  const placeholder = createCompositionPlaceholder(
    slotPage?.screenshot ? "正在读取截图" : `缺少第 ${node.slot + 1} 张截图`,
  );
  wrapper.append(screenshot, placeholder);
  if (slotPage?.screenshot) trackCompositionImage(screenshot, slotPage, placeholder);
  return wrapper;
}

function appendCompositionAnnotations(scene, page) {
  if (!page.annotations.enabled || !scene.annotations) return;

  if (scene.annotations.connector) {
    const connector = scene.annotations.connector;
    const arrow = document.createElement("span");
    arrow.className = "composition-arrow";
    arrow.textContent = "→";
    arrow.style.left = `${connector.cx - connector.size / 2}px`;
    arrow.style.top = `${connector.cy - connector.size / 2}px`;
    arrow.style.width = `${connector.size}px`;
    arrow.style.height = `${connector.size}px`;
    elements.compositionLayer.append(arrow);
  }

  scene.annotations.labels.forEach((position, index) => {
    const annotation = document.createElement("div");
    annotation.className = "composition-annotation";
    annotation.style.left = `${position.cx - position.width / 2}px`;
    annotation.style.top = `${position.top}px`;
    annotation.style.width = `${position.width}px`;

    const number = document.createElement("span");
    number.className = "composition-annotation-index";
    number.textContent = String(index + 1).padStart(2, "0");
    const label = document.createElement("span");
    label.className = "composition-annotation-label";
    label.textContent = page.annotations.labels[index] ?? "";
    annotation.append(number, label);
    elements.compositionLayer.append(annotation);
  });
}

function measureAnnotationOverflow(page) {
  if (!LAYOUT_ENGINE || page !== getActivePage()) return;
  page.annotationOverflow = Array.from(
    elements.compositionLayer.querySelectorAll(".composition-annotation-label"),
  ).some((label) => Boolean(label.textContent) && label.scrollWidth > label.clientWidth + 1);
  if (elements.annotationStatus) {
    elements.annotationStatus.textContent = page.annotationOverflow
      ? "步骤标签过长，请缩短后再导出。"
      : "";
    elements.annotationStatus.classList.toggle("is-error", page.annotationOverflow);
  }
  updatePageControls();
  updateRenderState();
}

function applyComposition(page = getActivePage()) {
  if (!LAYOUT_ENGINE) return;
  page.layoutId = LAYOUT_ENGINE.normalizeLayoutId(page.layoutId);
  page.layoutTuning = LAYOUT_ENGINE.normalizeTuning(page.layoutTuning);
  const scene = LAYOUT_ENGINE.resolveComposition({
    layoutId: page.layoutId,
    tuning: page.layoutTuning,
    classicDeviceWidth: state.deviceWidth,
    classicDeviceTop: state.deviceTop,
  });

  applyTheme();
  applyCopyLayout(page, scene);
  elements.artboard.dataset.layout = page.layoutId;

  if (page.layoutId === "classic") {
    elements.compositionLayer.hidden = true;
    elements.compositionLayer.replaceChildren();
    elements.device.hidden = false;
    page.annotationOverflow = false;
    updateRenderState();
    return;
  }

  elements.device.hidden = true;
  elements.compositionLayer.hidden = false;
  elements.compositionLayer.replaceChildren();
  const slots = resolvePageSlots(page);
  const selectedFrame = FRAMES.find((item) => item.id === state.frame) ?? FRAMES[0];
  const geometry = MODEL_GEOMETRY[selectedFrame.model];

  scene.nodes.forEach((node) => {
    const slotPage = slots[node.slot];
    elements.compositionLayer.append(
      node.type === "card"
        ? createCardNode(node, slotPage)
        : createDeviceNode(node, slotPage, selectedFrame, geometry),
    );
  });

  if (scene.lens) {
    const lens = document.createElement("div");
    const sourcePage = slots[0];
    lens.className = "focus-lens";
    lens.style.left = `${scene.lens.cx - scene.lens.diameter / 2}px`;
    lens.style.top = `${scene.lens.cy - scene.lens.diameter / 2}px`;
    lens.style.width = `${scene.lens.diameter}px`;
    lens.style.height = `${scene.lens.diameter}px`;
    if (sourcePage?.screenshot) {
      const lensImage = document.createElement("img");
      lensImage.crossOrigin = "anonymous";
      lensImage.alt = "";
      lensImage.onload = () => {
        const cropSize =
          Math.min(lensImage.naturalWidth, lensImage.naturalHeight) / scene.lens.zoom;
        const sourceX = Math.min(
          Math.max(0, lensImage.naturalWidth - cropSize),
          Math.max(0, lensImage.naturalWidth * scene.lens.focusX - cropSize / 2),
        );
        const sourceY = Math.min(
          Math.max(0, lensImage.naturalHeight - cropSize),
          Math.max(0, lensImage.naturalHeight * scene.lens.focusY - cropSize / 2),
        );
        const displayScale = scene.lens.diameter / cropSize;
        lensImage.style.left = `${-sourceX * displayScale}px`;
        lensImage.style.top = `${-sourceY * displayScale}px`;
        lensImage.style.width = `${lensImage.naturalWidth * displayScale}px`;
        lensImage.style.height = `${lensImage.naturalHeight * displayScale}px`;
        updateRenderState();
      };
      lensImage.onerror = () => {
        sourcePage.imageState = "error";
        updateRenderState();
        updatePageControls();
      };
      lensImage.src = sourcePage.screenshot;
      lens.append(lensImage);
    }
    elements.compositionLayer.append(lens);
  }

  appendCompositionAnnotations(scene, page);
  window.requestAnimationFrame(() => measureAnnotationOverflow(page));
  updateRenderState();
}

function updateRenderState() {
  if (!isRenderMode || !LAYOUT_ENGINE) return;
  const page = getActivePage();
  const validation = getPageLayoutValidation(page);
  if (!validation.valid) {
    document.body.dataset.renderState = "error";
    document.body.dataset.renderError = validation.errors.join("；");
    return;
  }

  const images =
    page.layoutId === "classic"
      ? [elements.screenshotImage, elements.frameImage]
      : Array.from(elements.compositionLayer.querySelectorAll("img"));
  const failedImage = images.find((image) => image.dataset.loadError);
  if (failedImage) {
    document.body.dataset.renderState = "error";
    document.body.dataset.renderError = failedImage.dataset.loadError;
    return;
  }
  const hasPendingImage = images.some(
    (image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0,
  );
  document.body.dataset.renderState = hasPendingImage ? "loading" : "ready";
  if (!hasPendingImage) delete document.body.dataset.renderError;
}

function applyText(page = getActivePage()) {
  elements.titleInput.value = page.title;
  elements.subtitleInput.value = page.subtitle;
  elements.posterTitle.textContent = page.title;
  elements.posterSubtitle.textContent = page.subtitle;
}

function applyScreenshot(page = getActivePage()) {
  const pageId = page.id;

  elements.screenshotImage.onload = null;
  elements.screenshotImage.onerror = null;
  elements.screenshotImage.removeAttribute("src");
  elements.screenshotImage.hidden = true;
  elements.screenPlaceholder.hidden = false;
  elements.screenshotImage.style.objectFit = page.fit;
  elements.fitSelect.value = page.fit;
  elements.screenshotName.textContent = `当前：${page.screenshotName}`;

  if (!page.screenshot) {
    page.imageState = "empty";
    updateRenderState();
    return;
  }

  page.imageState = "loading";

  elements.screenshotImage.onload = () => {
    if (getActivePage().id !== pageId) return;
    page.imageState = "ready";
    page.imageWidth = elements.screenshotImage.naturalWidth;
    page.imageHeight = elements.screenshotImage.naturalHeight;

    if (page.autoMatchFrame) {
      page.autoMatchFrame = false;
      applyFrame(getClosestFrameIdForImage(page.imageWidth, page.imageHeight));
    }

    elements.screenshotImage.hidden = false;
    elements.screenPlaceholder.hidden = true;
    updateRenderState();
    updatePageControls();
  };

  elements.screenshotImage.onerror = () => {
    if (getActivePage().id !== pageId) return;
    page.imageState = "error";
    elements.screenshotImage.hidden = true;
    elements.screenPlaceholder.hidden = false;
    updateRenderState();
    updatePageControls();
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

function createLayoutThumbnail(preset) {
  const thumbnail = document.createElement("span");
  thumbnail.className = "layout-thumbnail";
  thumbnail.setAttribute("aria-hidden", "true");
  const scene = LAYOUT_ENGINE.resolveComposition({
    layoutId: preset.id,
    tuning: {},
    classicDeviceWidth: DEFAULTS.deviceWidth,
    classicDeviceTop: DEFAULTS.deviceTop,
  });
  const scaleX = 32 / LAYOUT_ENGINE.ARTBOARD.width;
  const scaleY = 52 / LAYOUT_ENGINE.ARTBOARD.height;

  scene.nodes.forEach((node) => {
    const miniature = document.createElement("i");
    miniature.className = `layout-thumbnail-device${node.type === "card" ? " is-card" : ""}`;
    miniature.style.left = `${node.cx * scaleX}px`;
    miniature.style.top = `${node.top * scaleY}px`;
    miniature.style.width = `${Math.max(4, node.width * scaleX)}px`;
    miniature.style.height = `${Math.max(9, node.width * 2.04 * scaleY)}px`;
    miniature.style.zIndex = String(node.z);
    miniature.style.transform = `translateX(-50%) rotate(${node.rotation}deg)`;
    thumbnail.append(miniature);
  });

  const slotCount = document.createElement("span");
  slotCount.className = "layout-card-slot-count";
  slotCount.textContent = `${preset.slotCount}图`;
  thumbnail.append(slotCount);
  return thumbnail;
}

function populateLayoutGallery() {
  if (!LAYOUT_ENGINE || !elements.layoutGallery) return;
  const fragment = document.createDocumentFragment();
  Object.values(LAYOUT_ENGINE.LAYOUT_PRESETS).forEach((preset) => {
    const button = document.createElement("button");
    button.className = "layout-card";
    button.type = "button";
    button.dataset.layoutId = preset.id;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");

    const copy = document.createElement("span");
    copy.className = "layout-card-copy";
    const title = document.createElement("strong");
    title.textContent = preset.label;
    const description = document.createElement("small");
    description.textContent = preset.description;
    copy.append(title, description);
    button.append(createLayoutThumbnail(preset), copy);
    fragment.append(button);
  });
  elements.layoutGallery.replaceChildren(fragment);
}

function populateThemeOptions() {
  if (!LAYOUT_ENGINE || !elements.themeOptions) return;
  const fragment = document.createDocumentFragment();
  Object.values(LAYOUT_ENGINE.THEMES).forEach((theme) => {
    const button = document.createElement("button");
    button.className = "theme-option";
    button.type = "button";
    button.dataset.themeId = theme.id;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.title = theme.description;

    const swatch = document.createElement("span");
    swatch.className = "theme-swatch";
    swatch.style.background = LAYOUT_ENGINE.getBackgroundCss(theme.id);
    const label = document.createElement("span");
    label.textContent = theme.label;
    button.append(swatch, label);
    fragment.append(button);
  });
  elements.themeOptions.replaceChildren(fragment);
}

function renderSlotAssignments(page, preset, slots) {
  if (!elements.slotAssignmentPanel) return;
  elements.slotAssignmentPanel.hidden = preset.slotCount <= 1;
  elements.slotAssignments.replaceChildren();
  if (preset.slotCount <= 1) return;

  const existingIds = new Set(state.pages.map((item) => item.id));
  Object.keys(page.slotOverrides).forEach((slot) => {
    if (!existingIds.has(page.slotOverrides[slot])) delete page.slotOverrides[slot];
  });

  for (let slot = 1; slot < preset.slotCount; slot += 1) {
    const field = document.createElement("label");
    field.className = "slot-field";
    field.textContent = `第 ${slot + 1} 屏`;
    const select = document.createElement("select");
    select.dataset.slotIndex = String(slot);

    const automatic = document.createElement("option");
    automatic.value = "";
    automatic.textContent = slots[slot]
      ? `自动 · ${slots[slot].screenshotName}`
      : "自动 · 暂无可用截图";
    select.append(automatic);

    const usedByOtherSlots = new Set(
      Object.entries(page.slotOverrides)
        .filter(([index]) => Number(index) !== slot)
        .map(([, pageId]) => pageId),
    );
    state.pages.forEach((candidate) => {
      if (candidate.id === page.id || candidate.isAuxiliary) return;
      const option = document.createElement("option");
      option.value = candidate.id;
      option.textContent = candidate.screenshotName;
      option.disabled = usedByOtherSlots.has(candidate.id);
      select.append(option);
    });
    select.value = page.slotOverrides[slot] ?? "";
    field.append(select);
    elements.slotAssignments.append(field);
  }

  const validation = getPageLayoutValidation(page);
  const missingError = validation.errors.find((error) => error.includes("槽位为空"));
  elements.slotAssignmentHint.textContent = missingError
    ? `${missingError}；添加截图或手动选择后才能导出。`
    : "默认按当前顺序自动取后续截图；手动选择会在重新排序后保留。";
  elements.slotAssignmentHint.classList.toggle("is-error", Boolean(missingError));
}

function renderAnnotationFields(page, preset) {
  if (!elements.annotationPanel) return;
  elements.annotationPanel.hidden = !preset.annotations;
  elements.annotationFields.replaceChildren();
  if (!preset.annotations) return;

  elements.annotationsToggle.checked = page.annotations.enabled;
  elements.annotationFields.hidden = !page.annotations.enabled;
  if (page.annotations.enabled) {
    for (let index = 0; index < preset.slotCount; index += 1) {
      const field = document.createElement("label");
      field.className = "annotation-field";
      field.textContent = `步骤 ${String(index + 1).padStart(2, "0")}`;
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 80;
      input.dataset.annotationIndex = String(index);
      input.value = page.annotations.labels[index] ?? "";
      input.placeholder = "可选单行短标签";
      field.append(input);
      elements.annotationFields.append(field);
    }
  }

  elements.annotationStatus.textContent = page.annotationOverflow
    ? "步骤标签过长，请缩短后再导出。"
    : "";
  elements.annotationStatus.classList.toggle("is-error", page.annotationOverflow);
}

function setTuningControl(input, output, value, format) {
  if (!input || !output) return;
  input.value = String(value);
  output.value = format(value);
}

function renderTuningControls(page, preset) {
  if (!elements.classicLayoutControls) return;
  const isClassic = preset.id === "classic";
  elements.classicLayoutControls.hidden = !isClassic;
  elements.presetLayoutControls.hidden = isClassic;
  if (isClassic) return;

  const availableControls = new Set(preset.controls);
  document.querySelectorAll(".layout-tuning-control").forEach((control) => {
    control.hidden = !availableControls.has(control.dataset.tuningControl);
  });

  setTuningControl(
    elements.layoutScaleInput,
    elements.layoutScaleOutput,
    page.layoutTuning.scale,
    (value) => `${Math.round(value * 100)}%`,
  );
  setTuningControl(
    elements.layoutYInput,
    elements.layoutYOutput,
    page.layoutTuning.y,
    (value) => `${value > 0 ? "+" : ""}${Math.round(value)} px`,
  );
  setTuningControl(
    elements.layoutSpreadInput,
    elements.layoutSpreadOutput,
    page.layoutTuning.spread,
    (value) => `${Math.round(value * 100)}%`,
  );
  setTuningControl(
    elements.layoutTiltInput,
    elements.layoutTiltOutput,
    page.layoutTuning.tilt,
    (value) => `${Math.round(value * 100)}%`,
  );
  setTuningControl(
    elements.focusXInput,
    elements.focusXOutput,
    page.layoutTuning.focusX,
    (value) => `${Math.round(value * 100)}%`,
  );
  setTuningControl(
    elements.focusYInput,
    elements.focusYOutput,
    page.layoutTuning.focusY,
    (value) => `${Math.round(value * 100)}%`,
  );
}

function renderLayoutEditor(page = getActivePage()) {
  if (!LAYOUT_ENGINE) return;
  const preset = getLayoutPreset(page);
  const slots = resolvePageSlots(page);

  elements.layoutGallery.querySelectorAll(".layout-card").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.layoutId === preset.id));
  });
  applyTheme();
  renderSlotAssignments(page, preset, slots);
  renderAnnotationFields(page, preset);
  renderTuningControls(page, preset);
}

function renderScreenshotList() {
  const fragment = document.createDocumentFragment();

  getOutputPages().forEach((page, index) => {
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

    const thumbnail = page.screenshot
      ? document.createElement("img")
      : document.createElement("span");
    thumbnail.setAttribute("aria-hidden", "true");

    if (page.screenshot) {
      thumbnail.alt = "";
      thumbnail.crossOrigin = "anonymous";
      thumbnail.src = page.screenshot;
    } else {
      thumbnail.className = "screenshot-card-placeholder";
    }

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
  const outputPages = getOutputPages();
  const pageCount = outputPages.length;
  const isLocked = isImporting || isExporting;
  const hasMultiplePages = pageCount > 1;
  const isDefaultOnly = pageCount === 1 && outputPages[0].isSample;
  const activeValidation = getPageLayoutValidation(getActivePage());
  const hasActiveScreenshot = activeValidation.valid;
  const hasCompleteScreenshotSet = outputPages.every(
    (page) => getPageLayoutValidation(page).valid,
  );

  if (elements.layoutValidationStatus) {
    elements.layoutValidationStatus.textContent = activeValidation.valid
      ? ""
      : activeValidation.errors.join("；");
    elements.layoutValidationStatus.classList.toggle("is-error", !activeValidation.valid);
  }

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
  elements.layoutGallery?.querySelectorAll("button").forEach((button) => {
    button.disabled = isLocked;
  });
  elements.themeOptions?.querySelectorAll("button").forEach((button) => {
    button.disabled = isLocked;
  });
  elements.slotAssignments?.querySelectorAll("select").forEach((select) => {
    select.disabled = isLocked;
  });
  elements.annotationsToggle && (elements.annotationsToggle.disabled = isLocked);
  elements.annotationFields?.querySelectorAll("input").forEach((input) => {
    input.disabled = isLocked;
  });
  elements.presetLayoutControls?.querySelectorAll("input, button").forEach((control) => {
    control.disabled = isLocked;
  });
  elements.resetButton.disabled = isLocked;
  elements.focusButton.disabled = isLocked;
  elements.exportButton.disabled = isLocked || !hasActiveScreenshot;
  elements.exportAllButton.disabled = isLocked || !hasCompleteScreenshotSet;

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
  applyComposition();
  renderLayoutEditor();
  renderScreenshotList();
  updatePageControls();
}

function selectPage(pageId, { focus = false } = {}) {
  if (isImporting || isExporting || !state.pages.some((page) => page.id === pageId)) return;

  state.activePageId = pageId;
  applyText();
  applyScreenshot();
  applyComposition();
  renderLayoutEditor();
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
  if (fit === "fill") {
    context.drawImage(image, x, y, width, height);
    return;
  }

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
  if (LAYOUT_ENGINE) {
    const preset = getLayoutPreset(page);
    const copy = preset.copy;
    const measure = elements.exportMeasureTitle.parentElement;
    measure.style.width = `${copy.width}px`;
    measure.style.textAlign = copy.align;
    elements.exportMeasureTitle.style.fontSize = `${
      PRODUCT.copy.title.fontSize * copy.titleScale
    }px`;
    elements.exportMeasureSubtitle.style.fontSize = `${
      PRODUCT.copy.subtitle.fontSize * copy.subtitleScale
    }px`;
  }
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
  const copy = PRODUCT.copy;
  const deviceScale = snapshot.deviceWidth / geometry.frameWidth;
  const deviceHeight = geometry.frameHeight * deviceScale;
  const deviceX = (ARTBOARD.width - snapshot.deviceWidth) / 2;
  const screenX = deviceX + geometry.screenX * deviceScale;
  const screenY = snapshot.deviceTop + geometry.screenY * deviceScale;
  const screenWidth = geometry.screenWidth * deviceScale;
  const screenHeight = geometry.screenHeight * deviceScale;

  context.fillStyle = PRODUCT.background;
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
    top: copy.top,
    font: `${copy.title.fontWeight} ${copy.title.fontSize}px ${copy.title.fontFamily}`,
    fontSize: copy.title.fontSize,
    lineHeight: copy.title.fontSize * copy.title.lineHeight,
    letterSpacing: copy.title.letterSpacing,
    color: "#050505",
  });

  drawTextBlock(context, {
    lines: snapshot.subtitleLines,
    top: copy.top + titleHeight + copy.gap,
    font: `${copy.subtitle.fontWeight} ${copy.subtitle.fontSize}px ${copy.subtitle.fontFamily}`,
    fontSize: copy.subtitle.fontSize,
    lineHeight: copy.subtitle.fontSize * copy.subtitle.lineHeight,
    letterSpacing: copy.subtitle.letterSpacing,
    color: "#1b1b1a",
  });
}

function fillCompositionBackground(context, theme) {
  if (theme.background.type === "solid") {
    context.fillStyle = theme.background.color;
  } else {
    const gradient = context.createLinearGradient(0, 0, ARTBOARD.width, ARTBOARD.height);
    theme.background.stops.forEach(([position, color]) => gradient.addColorStop(position, color));
    context.fillStyle = gradient;
  }
  context.fillRect(0, 0, ARTBOARD.width, ARTBOARD.height);
}

function drawCompositionShadow(context, x, y, width, height, radius, color) {
  context.save();
  context.fillStyle = color;
  context.globalAlpha = 0.72;
  context.shadowColor = color;
  context.shadowBlur = 64;
  context.shadowOffsetY = 42;
  roundedRectPath(context, x, y, width, height, radius);
  context.fill();
  context.restore();
}

function drawCompositionDevice(
  context,
  node,
  screenshotImage,
  frameImage,
  geometry,
  fit,
  theme,
) {
  const deviceScale = node.width / geometry.frameWidth;
  const deviceHeight = geometry.frameHeight * deviceScale;
  const deviceX = -node.width / 2;
  const screenX = deviceX + geometry.screenX * deviceScale;
  const screenY = geometry.screenY * deviceScale;
  const screenWidth = geometry.screenWidth * deviceScale;
  const screenHeight = geometry.screenHeight * deviceScale;

  context.save();
  context.translate(node.cx, node.top);
  context.rotate((node.rotation * Math.PI) / 180);
  drawCompositionShadow(
    context,
    deviceX + node.width * 0.05,
    deviceHeight * 0.03,
    node.width * 0.9,
    deviceHeight * 0.95,
    node.width * 0.12,
    theme.shadowColor,
  );

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
    fit,
  );
  context.restore();
  context.drawImage(frameImage, deviceX, 0, node.width, deviceHeight);
  context.restore();
}

function drawCompositionCard(context, node, screenshotImage, fit, theme) {
  const width = node.width;
  const height = width * (ARTBOARD.height / ARTBOARD.width);
  const x = -width / 2;
  const radius = Math.max(36, width * 0.105);

  context.save();
  context.translate(node.cx, node.top);
  context.rotate((node.rotation * Math.PI) / 180);
  drawCompositionShadow(context, x, 0, width, height, radius, theme.shadowColor);
  context.save();
  roundedRectPath(context, x, 0, width, height, radius);
  context.clip();
  context.fillStyle = "#f2f4f5";
  context.fillRect(x, 0, width, height);
  drawImageWithFit(context, screenshotImage, x, 0, width, height, fit);
  context.restore();
  context.lineWidth = 3;
  context.strokeStyle = "rgba(255, 255, 255, 0.68)";
  roundedRectPath(context, x, 0, width, height, radius);
  context.stroke();
  context.restore();
}

function drawFocusLens(context, lens, screenshotImage, theme) {
  const radius = lens.diameter / 2;
  const cropSize = Math.min(screenshotImage.naturalWidth, screenshotImage.naturalHeight) / lens.zoom;
  const maxSourceX = Math.max(0, screenshotImage.naturalWidth - cropSize);
  const maxSourceY = Math.max(0, screenshotImage.naturalHeight - cropSize);
  const sourceX = Math.min(
    maxSourceX,
    Math.max(0, screenshotImage.naturalWidth * lens.focusX - cropSize / 2),
  );
  const sourceY = Math.min(
    maxSourceY,
    Math.max(0, screenshotImage.naturalHeight * lens.focusY - cropSize / 2),
  );

  context.save();
  context.fillStyle = theme.shadowColor;
  context.shadowColor = theme.shadowColor;
  context.shadowBlur = 72;
  context.shadowOffsetY = 34;
  context.beginPath();
  context.arc(lens.cx, lens.cy, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.beginPath();
  context.arc(lens.cx, lens.cy, radius, 0, Math.PI * 2);
  context.clip();
  context.drawImage(
    screenshotImage,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    lens.cx - radius,
    lens.cy - radius,
    lens.diameter,
    lens.diameter,
  );
  context.restore();
  context.lineWidth = 10;
  context.strokeStyle = theme.lensBorder;
  context.beginPath();
  context.arc(lens.cx, lens.cy, radius - 5, 0, Math.PI * 2);
  context.stroke();
}

function drawAlignedSpacedText(context, text, x, baseline, letterSpacing, align) {
  if (align === "center") {
    drawCenteredText(context, text, x, baseline, letterSpacing);
    return;
  }

  if ("letterSpacing" in context) {
    context.letterSpacing = `${letterSpacing}px`;
    context.textAlign = align;
    context.fillText(text, x, baseline);
    context.letterSpacing = "0px";
    return;
  }

  context.textAlign = "left";
  let cursorX = x;
  for (const character of Array.from(text)) {
    context.fillText(character, cursorX, baseline);
    cursorX += context.measureText(character).width + letterSpacing;
  }
}

function drawCompositionTextBlock(
  context,
  { lines, top, left, width, align, font, fontSize, lineHeight, letterSpacing, color },
) {
  if (lines.length === 0) return 0;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "alphabetic";
  const metrics = context.measureText("国Ag");
  const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
  const baselineOffset = (lineHeight - ascent - descent) / 2 + ascent;
  const x = align === "center" ? left + width / 2 : left;

  lines.forEach((line, index) => {
    drawAlignedSpacedText(
      context,
      line,
      x,
      top + index * lineHeight + baselineOffset,
      letterSpacing,
      align,
    );
  });
  return lines.length * lineHeight;
}

function drawCompositionAnnotations(context, snapshot, scene, theme) {
  if (!snapshot.annotations.enabled || !scene.annotations) return;
  const fontFamily = '"PingFang SC", "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

  if (scene.annotations.connector) {
    const connector = scene.annotations.connector;
    context.save();
    context.fillStyle = theme.accentColor;
    context.shadowColor = theme.accentColor;
    context.shadowBlur = 42;
    context.globalAlpha = 0.96;
    context.beginPath();
    context.arc(connector.cx, connector.cy, connector.size / 2, 0, Math.PI * 2);
    context.fill();
    context.restore();
    context.fillStyle = "#ffffff";
    context.font = `500 ${connector.size * 0.56}px ${fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("→", connector.cx, connector.cy + connector.size * 0.015);
  }

  scene.annotations.labels.forEach((position, index) => {
    const label = snapshot.annotations.labels[index] ?? "";
    const availableWidth = Math.max(0, position.width - 80);
    context.font = `640 38px ${fontFamily}`;
    if (label && context.measureText(label).width > availableWidth) {
      throw new Error(`步骤 ${index + 1} 标签过长，请缩短后再导出`);
    }
    const left = position.cx - position.width / 2;
    const circleX = left + 32;
    const circleY = position.top + 32;
    context.fillStyle = theme.annotationSurface;
    context.beginPath();
    context.arc(circleX, circleY, 32, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = theme.annotationText;
    context.font = `600 28px ${fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(String(index + 1).padStart(2, "0"), circleX, circleY + 1);
    if (label) {
      context.fillStyle = theme.subtitleColor;
      context.font = `640 38px ${fontFamily}`;
      context.textAlign = "left";
      context.fillText(label, left + 80, circleY + 1);
    }
  });
}

function drawCompositionPoster(context, snapshot, screenshotImages, frameImage) {
  const theme = LAYOUT_ENGINE.THEMES[snapshot.themeId];
  const scene = LAYOUT_ENGINE.resolveComposition({
    layoutId: snapshot.layoutId,
    tuning: snapshot.layoutTuning,
    classicDeviceWidth: snapshot.deviceWidth,
    classicDeviceTop: snapshot.deviceTop,
  });
  const frame = FRAMES.find((item) => item.id === snapshot.frame) ?? FRAMES[0];
  const geometry = MODEL_GEOMETRY[frame.model];
  fillCompositionBackground(context, theme);

  scene.nodes.forEach((node) => {
    const screenshotImage = screenshotImages[node.slot];
    const slot = snapshot.slots[node.slot];
    if (node.type === "card") {
      drawCompositionCard(context, node, screenshotImage, slot.fit, theme);
    } else {
      drawCompositionDevice(
        context,
        node,
        screenshotImage,
        frameImage,
        geometry,
        slot.fit,
        theme,
      );
    }
  });

  if (scene.lens) drawFocusLens(context, scene.lens, screenshotImages[0], theme);
  drawCompositionAnnotations(context, snapshot, scene, theme);

  const copy = scene.copy;
  const titleSize = PRODUCT.copy.title.fontSize * copy.titleScale;
  const subtitleSize = PRODUCT.copy.subtitle.fontSize * copy.subtitleScale;
  const titleHeight = drawCompositionTextBlock(context, {
    lines: snapshot.titleLines,
    top: copy.top,
    left: copy.left,
    width: copy.width,
    align: copy.align,
    font: `${PRODUCT.copy.title.fontWeight} ${titleSize}px ${PRODUCT.copy.title.fontFamily}`,
    fontSize: titleSize,
    lineHeight: titleSize * PRODUCT.copy.title.lineHeight,
    letterSpacing: PRODUCT.copy.title.letterSpacing,
    color: theme.titleColor,
  });
  drawCompositionTextBlock(context, {
    lines: snapshot.subtitleLines,
    top: copy.top + titleHeight + PRODUCT.copy.gap,
    left: copy.left,
    width: copy.width,
    align: copy.align,
    font: `${PRODUCT.copy.subtitle.fontWeight} ${subtitleSize}px ${PRODUCT.copy.subtitle.fontFamily}`,
    fontSize: subtitleSize,
    lineHeight: subtitleSize * PRODUCT.copy.subtitle.lineHeight,
    letterSpacing: PRODUCT.copy.subtitle.letterSpacing,
    color: theme.subtitleColor,
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
  return `${PRODUCT.exportPrefix}-${pageNumber}-${sanitizeFileName(snapshot.screenshotName)}-${ARTBOARD.width}x${ARTBOARD.height}.png`;
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
  const slots = resolvePageSlots(page);

  return Object.freeze({
    id: page.id,
    pageIndex: getOutputPages().findIndex((item) => item.id === page.id),
    screenshot: page.screenshot,
    screenshotName: page.screenshotName,
    fit: page.fit,
    frame: state.frame,
    deviceWidth: state.deviceWidth,
    deviceTop: state.deviceTop,
    titleLines: textLines.title,
    subtitleLines: textLines.subtitle,
    layoutId: LAYOUT_ENGINE ? LAYOUT_ENGINE.normalizeLayoutId(page.layoutId) : "classic",
    themeId: LAYOUT_ENGINE ? LAYOUT_ENGINE.normalizeThemeId(state.themeId) : null,
    layoutTuning: LAYOUT_ENGINE ? LAYOUT_ENGINE.normalizeTuning(page.layoutTuning) : null,
    annotations: LAYOUT_ENGINE
      ? {
          enabled: page.annotations.enabled,
          labels: [...page.annotations.labels],
        }
      : { enabled: false, labels: [] },
    slots: slots.map((slot) => ({
      screenshot: slot?.screenshot ?? null,
      screenshotName: slot?.screenshotName ?? "截图",
      fit: slot?.fit ?? DEFAULTS.fit,
    })),
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

async function renderSnapshotToBlob(snapshot, canvas, context, frameImage, imageCache) {
  const loadCachedImage = (source, label) => {
    if (!imageCache.has(source)) imageCache.set(source, loadImage(source, label));
    return imageCache.get(source);
  };
  context.clearRect(0, 0, ARTBOARD.width, ARTBOARD.height);
  if (!LAYOUT_ENGINE || (snapshot.layoutId === "classic" && snapshot.themeId === "porcelain")) {
    const screenshotImage = await loadCachedImage(snapshot.screenshot, snapshot.screenshotName);
    drawPoster(context, snapshot, screenshotImage, frameImage);
  } else {
    const screenshotImages = await Promise.all(
      snapshot.slots.map((slot) => loadCachedImage(slot.screenshot, slot.screenshotName)),
    );
    drawCompositionPoster(context, snapshot, screenshotImages, frameImage);
  }
  return canvasToPngBlob(canvas);
}

async function exportPages(pageIds, mode) {
  if (isExporting) return;

  const pages = pageIds
    .map((pageId) => state.pages.find((page) => page.id === pageId))
    .filter(Boolean);
  if (pages.length === 0) return;
  const invalidPage = pages.find((page) => !getPageLayoutValidation(page).valid);
  if (invalidPage) {
    const validation = getPageLayoutValidation(invalidPage);
    setExportStatus(`无法导出：${validation.errors.join("；")}`, true);
    return;
  }

  isExporting = true;
  setExportStatus("");
  renderScreenshotList();
  updatePageControls();
  elements.exportButton.textContent = mode === "all" ? "请稍候…" : "正在生成…";
  elements.exportAllButton.textContent = "正在生成…";

  try {
    await (document.fonts?.ready ?? Promise.resolve());

    const snapshots = pages.map(createRenderSnapshot);
    const selectedFrame = FRAMES.find((item) => item.id === snapshots[0].frame) ?? FRAMES[0];
    const frameImage = await loadImage(selectedFrame.src, PRODUCT.frameLoadLabel);
    const { canvas, context } = createExportCanvas();
    const imageCache = new Map();
    const downloads = [];

    for (const [index, snapshot] of snapshots.entries()) {
      setExportStatus(`正在生成 ${index + 1} / ${snapshots.length}…`);
      const blob = await renderSnapshotToBlob(snapshot, canvas, context, frameImage, imageCache);
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
    getOutputPages().map((page) => page.id),
    "all",
  );
}

function isSupportedImageFile(file) {
  return ALLOWED_IMAGE_TYPES.has(file.type) || /\.(?:png|jpe?g|webp)$/i.test(file.name);
}

async function createUploadedPage(file, templatePage) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl, file.name);
    return createPage({
      title: templatePage.title,
      subtitle: templatePage.subtitle,
      screenshot: objectUrl,
      screenshotName: file.name,
      fit: templatePage.fit,
      imageWidth: image.naturalWidth,
      imageHeight: image.naturalHeight,
      objectUrl,
      imageState: "ready",
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
  let didAutoMatchFrame = false;

  try {
    for (const file of files) {
      importedPages.push(await createUploadedPage(file, templatePage));
    }

    if (isReplacingSample) {
      releaseAllPages();
      state.pages = importedPages;

      if (productKey === "ipad" && !params.has("frame")) {
        state.frame = getClosestFrameIdForImage(
          importedPages[0].imageWidth,
          importedPages[0].imageHeight,
        );
        didAutoMatchFrame = true;
      }
    } else {
      state.pages.push(...importedPages);
    }

    state.activePageId = importedPages[0].id;
    applyState();
    const matchedFrame = FRAMES.find((frame) => frame.id === state.frame);
    const frameHint = didAutoMatchFrame ? `，已匹配 ${matchedFrame?.label ?? "iPad 机框"}` : "";
    setScreenshotStatus(`已添加 ${importedPages.length} 张截图${frameHint}。`);
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
  if (LAYOUT_ENGINE) state.themeId = "porcelain";
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
  applyComposition();
  renderLayoutEditor();
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
    updatePageControls();
    updateRenderState();
  });

  elements.subtitleInput.addEventListener("input", (event) => {
    const page = getActivePage();
    page.subtitle = event.target.value;
    elements.posterSubtitle.textContent = page.subtitle;
    updatePageControls();
    updateRenderState();
  });

  elements.frameSelect.addEventListener("change", (event) => {
    applyFrame(event.target.value);
    applyComposition();
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
    applyComposition();
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

  elements.layoutGallery?.addEventListener("click", (event) => {
    const button = event.target.closest(".layout-card");
    if (!button || isImporting || isExporting) return;
    const page = getActivePage();
    page.layoutId = LAYOUT_ENGINE.normalizeLayoutId(button.dataset.layoutId);
    page.layoutTuning = LAYOUT_ENGINE.normalizeTuning();
    page.annotationOverflow = false;
    applyComposition(page);
    renderLayoutEditor(page);
    updatePageControls();
    setExportStatus("");
  });

  elements.themeOptions?.addEventListener("click", (event) => {
    const button = event.target.closest(".theme-option");
    if (!button || isImporting || isExporting) return;
    state.themeId = LAYOUT_ENGINE.normalizeThemeId(button.dataset.themeId);
    applyTheme();
    applyComposition();
    renderLayoutEditor();
    setExportStatus("");
  });

  elements.slotAssignments?.addEventListener("change", (event) => {
    const select = event.target.closest("select[data-slot-index]");
    if (!select) return;
    const page = getActivePage();
    const slot = Number(select.dataset.slotIndex);
    if (select.value) page.slotOverrides[slot] = select.value;
    else delete page.slotOverrides[slot];
    applyComposition(page);
    renderLayoutEditor(page);
    updatePageControls();
    setExportStatus("");
  });

  elements.annotationsToggle?.addEventListener("change", (event) => {
    const page = getActivePage();
    page.annotations.enabled = event.target.checked;
    page.annotationOverflow = false;
    applyComposition(page);
    renderLayoutEditor(page);
    updatePageControls();
  });

  elements.annotationFields?.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-annotation-index]");
    if (!input) return;
    const page = getActivePage();
    page.annotations.labels[Number(input.dataset.annotationIndex)] = input.value.replace(
      /[\r\n]+/g,
      " ",
    );
    applyComposition(page);
    updatePageControls();
  });

  const tuningBindings = [
    [elements.layoutScaleInput, "scale"],
    [elements.layoutYInput, "y"],
    [elements.layoutSpreadInput, "spread"],
    [elements.layoutTiltInput, "tilt"],
    [elements.focusXInput, "focusX"],
    [elements.focusYInput, "focusY"],
  ];
  tuningBindings.forEach(([input, key]) => {
    input?.addEventListener("input", (event) => {
      const page = getActivePage();
      page.layoutTuning = LAYOUT_ENGINE.normalizeTuning({
        ...page.layoutTuning,
        [key]: Number(event.target.value),
      });
      applyComposition(page);
      renderTuningControls(page, getLayoutPreset(page));
      updatePageControls();
    });
  });

  elements.resetLayoutButton?.addEventListener("click", () => {
    const page = getActivePage();
    page.layoutTuning = LAYOUT_ENGINE.normalizeTuning();
    page.annotationOverflow = false;
    applyComposition(page);
    renderLayoutEditor(page);
    updatePageControls();
    setExportStatus("");
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
  if (isRenderMode) {
    document.body.classList.add("render-mode");
    if (LAYOUT_ENGINE) document.body.dataset.renderState = "loading";
  }
  applyProductConfiguration();
  populateFrameSelect();
  populateLayoutGallery();
  populateThemeOptions();
  applyState();
  bindEvents();
  resizePreview();

  if ("ResizeObserver" in window && !isRenderMode) {
    const resizeObserver = new ResizeObserver(resizePreview);
    resizeObserver.observe(elements.stage);
  }
}

initialize();
