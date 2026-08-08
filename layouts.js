(function initializeLaunchFrameLayouts(globalScope) {
  "use strict";

  const ARTBOARD = Object.freeze({ width: 1320, height: 2868 });
  const TUNING_RANGES = Object.freeze({
    scale: Object.freeze({ min: 0.92, max: 1.06, default: 1 }),
    y: Object.freeze({ min: -120, max: 120, default: 0 }),
    spread: Object.freeze({ min: 0.85, max: 1.15, default: 1 }),
    tilt: Object.freeze({ min: 0, max: 1, default: 1 }),
    focusX: Object.freeze({ min: 0.2, max: 0.8, default: 0.5 }),
    focusY: Object.freeze({ min: 0.2, max: 0.8, default: 0.5 }),
  });

  const THEMES = Object.freeze({
    porcelain: Object.freeze({
      id: "porcelain",
      label: "瓷白",
      description: "原版浅色",
      background: Object.freeze({
        type: "solid",
        color: "#fdfdfc",
        stops: Object.freeze([[0, "#fdfdfc"]]),
      }),
      titleColor: "#050505",
      subtitleColor: "#1b1b1a",
      accentColor: "#3b82f6",
      annotationSurface: "rgba(18, 21, 27, 0.92)",
      annotationText: "#f7f9fc",
      shadowColor: "rgba(0, 0, 0, 0.25)",
      lensBorder: "rgba(255, 255, 255, 0.92)",
    }),
    midnight: Object.freeze({
      id: "midnight",
      label: "午夜",
      description: "深色聚焦",
      background: Object.freeze({
        type: "linear",
        stops: Object.freeze([
          [0, "#050914"],
          [1, "#0b1426"],
        ]),
      }),
      titleColor: "#f7f9fc",
      subtitleColor: "#c4ccda",
      accentColor: "#4c8dff",
      annotationSurface: "rgba(244, 248, 255, 0.93)",
      annotationText: "#111827",
      shadowColor: "rgba(0, 0, 0, 0.48)",
      lensBorder: "rgba(226, 235, 255, 0.88)",
    }),
    aurora: Object.freeze({
      id: "aurora",
      label: "极光",
      description: "柔和渐变",
      background: Object.freeze({
        type: "linear",
        stops: Object.freeze([
          [0, "#eaf4ff"],
          [0.52, "#f3edff"],
          [1, "#fff1e8"],
        ]),
      }),
      titleColor: "#11131a",
      subtitleColor: "#414755",
      accentColor: "#695cff",
      annotationSurface: "rgba(255, 255, 255, 0.9)",
      annotationText: "#25283a",
      shadowColor: "rgba(54, 46, 92, 0.26)",
      lensBorder: "rgba(255, 255, 255, 0.94)",
    }),
    electric: Object.freeze({
      id: "electric",
      label: "电光",
      description: "高能蓝紫",
      background: Object.freeze({
        type: "linear",
        stops: Object.freeze([
          [0, "#124bff"],
          [1, "#6c3ceb"],
        ]),
      }),
      titleColor: "#ffffff",
      subtitleColor: "#e5eaff",
      accentColor: "#bde0ff",
      annotationSurface: "rgba(7, 16, 55, 0.82)",
      annotationText: "#ffffff",
      shadowColor: "rgba(10, 7, 52, 0.4)",
      lensBorder: "rgba(224, 235, 255, 0.9)",
    }),
  });

  const centeredCopy = Object.freeze({
    top: 130,
    left: 82,
    width: 1156,
    align: "center",
    titleScale: 1,
    subtitleScale: 1,
  });

  function device(slot, cx, top, width, rotation, z = 1) {
    return Object.freeze({ type: "device", slot, cx, top, width, rotation, z });
  }

  function card(slot, cx, top, width, rotation, z = 1) {
    return Object.freeze({ type: "card", slot, cx, top, width, rotation, z });
  }

  const LAYOUT_PRESETS = Object.freeze({
    classic: Object.freeze({
      id: "classic",
      label: "经典主视觉",
      description: "原版单机居中",
      slotCount: 1,
      copy: centeredCopy,
      nodes: Object.freeze([]),
      controls: Object.freeze([]),
      annotations: null,
    }),
    "editorial-shift": Object.freeze({
      id: "editorial-shift",
      label: "编辑式偏移",
      description: "左文案 · 右主屏",
      slotCount: 1,
      copy: Object.freeze({
        top: 150,
        left: 78,
        width: 840,
        align: "left",
        titleScale: 0.82,
        subtitleScale: 0.72,
      }),
      nodes: Object.freeze([device(0, 850, 730, 900, 5, 2)]),
      controls: Object.freeze(["scale", "y", "tilt"]),
      annotations: null,
    }),
    "focus-lens": Object.freeze({
      id: "focus-lens",
      label: "细节聚焦",
      description: "主屏 + 2× 放大窗",
      slotCount: 1,
      copy: centeredCopy,
      nodes: Object.freeze([device(0, 660, 760, 980, -3, 2)]),
      lens: Object.freeze({ cx: 950, cy: 1680, diameter: 340, zoom: 2, z: 8 }),
      controls: Object.freeze(["scale", "y", "tilt", "focusX", "focusY"]),
      annotations: null,
    }),
    "duo-flow": Object.freeze({
      id: "duo-flow",
      label: "双屏流转",
      description: "操作 → 结果",
      slotCount: 2,
      copy: centeredCopy,
      nodes: Object.freeze([
        device(0, 350, 920, 680, -7, 1),
        device(1, 830, 700, 800, 5, 2),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt"]),
      annotations: Object.freeze({
        connector: Object.freeze({ type: "arrow", cx: 640, cy: 1510, size: 104 }),
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 300, top: 2370, width: 430 }),
          Object.freeze({ slot: 1, cx: 860, top: 2410, width: 430 }),
        ]),
      }),
    }),
    "duo-compare": Object.freeze({
      id: "duo-compare",
      label: "并列对照",
      description: "双场景 · 双模式",
      slotCount: 2,
      copy: centeredCopy,
      nodes: Object.freeze([
        device(0, 340, 820, 640, -2, 1),
        device(1, 980, 820, 640, 2, 1),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 340, top: 2260, width: 470 }),
          Object.freeze({ slot: 1, cx: 980, top: 2260, width: 470 }),
        ]),
      }),
    }),
    "depth-stack": Object.freeze({
      id: "depth-stack",
      label: "纵深叠层",
      description: "中心突出 · 两侧延展",
      slotCount: 3,
      copy: centeredCopy,
      nodes: Object.freeze([
        device(0, 330, 980, 600, -7, 1),
        device(1, 660, 760, 720, 0, 3),
        device(2, 990, 980, 600, 7, 1),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 250, top: 2290, width: 360 }),
          Object.freeze({ slot: 1, cx: 660, top: 2390, width: 400 }),
          Object.freeze({ slot: 2, cx: 1070, top: 2290, width: 360 }),
        ]),
      }),
    }),
    "arc-fan": Object.freeze({
      id: "arc-fan",
      label: "弧形扇面",
      description: "三屏展开 · 丰富有序",
      slotCount: 3,
      copy: centeredCopy,
      nodes: Object.freeze([
        device(0, 290, 1060, 580, -12, 1),
        device(1, 660, 820, 660, 0, 3),
        device(2, 1030, 1060, 580, 12, 1),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 230, top: 2340, width: 340 }),
          Object.freeze({ slot: 1, cx: 660, top: 2350, width: 380 }),
          Object.freeze({ slot: 2, cx: 1090, top: 2340, width: 340 }),
        ]),
      }),
    }),
    "step-cascade": Object.freeze({
      id: "step-cascade",
      label: "三步阶梯",
      description: "渐进流程 · 任务闭环",
      slotCount: 3,
      copy: Object.freeze({
        top: 150,
        left: 78,
        width: 840,
        align: "left",
        titleScale: 0.86,
        subtitleScale: 0.72,
      }),
      nodes: Object.freeze([
        device(0, 280, 720, 500, -4, 1),
        device(1, 650, 1080, 530, 0, 2),
        device(2, 1020, 1440, 500, 4, 3),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 230, top: 1770, width: 360 }),
          Object.freeze({ slot: 1, cx: 650, top: 2180, width: 360 }),
          Object.freeze({ slot: 2, cx: 1060, top: 2510, width: 360 }),
        ]),
      }),
    }),
    "card-gallery": Object.freeze({
      id: "card-gallery",
      label: "无框画廊",
      description: "圆角截图卡片",
      slotCount: 3,
      copy: centeredCopy,
      nodes: Object.freeze([
        card(0, 300, 1030, 500, -8, 1),
        card(1, 660, 800, 560, 0, 3),
        card(2, 1020, 1030, 500, 8, 1),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 250, top: 2240, width: 360 }),
          Object.freeze({ slot: 1, cx: 660, top: 2290, width: 380 }),
          Object.freeze({ slot: 2, cx: 1070, top: 2240, width: 360 }),
        ]),
      }),
    }),
  });

  function clamp(value, min, max, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function normalizeLayoutId(layoutId) {
    return Object.hasOwn(LAYOUT_PRESETS, layoutId) ? layoutId : "classic";
  }

  function normalizeThemeId(themeId) {
    return Object.hasOwn(THEMES, themeId) ? themeId : "porcelain";
  }

  function normalizeTuning(tuning = {}) {
    return {
      scale: clamp(
        tuning.scale,
        TUNING_RANGES.scale.min,
        TUNING_RANGES.scale.max,
        TUNING_RANGES.scale.default,
      ),
      y: clamp(tuning.y, TUNING_RANGES.y.min, TUNING_RANGES.y.max, TUNING_RANGES.y.default),
      spread: clamp(
        tuning.spread,
        TUNING_RANGES.spread.min,
        TUNING_RANGES.spread.max,
        TUNING_RANGES.spread.default,
      ),
      tilt: clamp(
        tuning.tilt,
        TUNING_RANGES.tilt.min,
        TUNING_RANGES.tilt.max,
        TUNING_RANGES.tilt.default,
      ),
      focusX: clamp(
        tuning.focusX,
        TUNING_RANGES.focusX.min,
        TUNING_RANGES.focusX.max,
        TUNING_RANGES.focusX.default,
      ),
      focusY: clamp(
        tuning.focusY,
        TUNING_RANGES.focusY.min,
        TUNING_RANGES.focusY.max,
        TUNING_RANGES.focusY.default,
      ),
    };
  }

  function createDefaultLayoutState(overrides = {}) {
    return {
      layoutId: normalizeLayoutId(overrides.layoutId ?? "classic"),
      layoutTuning: normalizeTuning(overrides.layoutTuning),
      slotOverrides: { ...(overrides.slotOverrides ?? {}) },
      annotations: {
        enabled: Boolean(overrides.annotations?.enabled),
        labels: [0, 1, 2].map((index) =>
          String(overrides.annotations?.labels?.[index] ?? "").replace(/[\r\n]+/g, " "),
        ),
      },
    };
  }

  function resolveSlotPages(pages, activePageId, slotOverrides = {}, slotCount = 1) {
    const activeIndex = pages.findIndex((page) => page.id === activePageId);
    if (activeIndex < 0) return Array.from({ length: slotCount }, () => null);

    const activePage = pages[activeIndex];
    const resolved = [];
    const usedIds = new Set();

    for (let slot = 0; slot < slotCount; slot += 1) {
      const overrideId = slotOverrides[slot];
      const overridePage = pages.find(
        (page) => page.id === overrideId && !usedIds.has(page.id) && page.screenshot,
      );

      if (overridePage) {
        resolved.push(overridePage);
        usedIds.add(overridePage.id);
        continue;
      }

      if (slot === 0) {
        resolved.push(activePage);
        usedIds.add(activePage.id);
        continue;
      }

      let automaticPage = null;
      for (let offset = 1; offset < pages.length; offset += 1) {
        const candidate = pages[(activeIndex + offset) % pages.length];
        if (!candidate?.screenshot || usedIds.has(candidate.id)) continue;
        automaticPage = candidate;
        break;
      }

      resolved.push(automaticPage);
      if (automaticPage) usedIds.add(automaticPage.id);
    }

    return resolved;
  }

  function transformHorizontal(value, spread, center = ARTBOARD.width / 2) {
    return center + (value - center) * spread;
  }

  function resolveComposition({
    layoutId,
    tuning,
    classicDeviceWidth = 930,
    classicDeviceTop = 730,
  }) {
    const preset = LAYOUT_PRESETS[normalizeLayoutId(layoutId)];
    const safeTuning = normalizeTuning(tuning);
    const baseNodes =
      preset.id === "classic"
        ? [device(0, ARTBOARD.width / 2, classicDeviceTop, classicDeviceWidth, 0, 2)]
        : preset.nodes;

    const nodes = baseNodes
      .map((node) => ({
        ...node,
        cx: transformHorizontal(node.cx, safeTuning.spread),
        top: node.top + safeTuning.y,
        width: node.width * safeTuning.scale,
        rotation: node.rotation * safeTuning.tilt,
      }))
      .sort((left, right) => left.z - right.z);

    const lens = preset.lens
      ? {
          ...preset.lens,
          cx: transformHorizontal(preset.lens.cx, safeTuning.spread),
          cy: preset.lens.cy + safeTuning.y,
          diameter: preset.lens.diameter * safeTuning.scale,
          focusX: safeTuning.focusX,
          focusY: safeTuning.focusY,
        }
      : null;

    const annotations = preset.annotations
      ? {
          connector: preset.annotations.connector
            ? {
                ...preset.annotations.connector,
                cx: transformHorizontal(preset.annotations.connector.cx, safeTuning.spread),
                cy: preset.annotations.connector.cy + safeTuning.y,
                size: preset.annotations.connector.size * safeTuning.scale,
              }
            : null,
          labels: (preset.annotations.labels ?? []).map((label) => ({
            ...label,
            cx: transformHorizontal(label.cx, safeTuning.spread),
            top: label.top + safeTuning.y,
            width: label.width * safeTuning.scale,
          })),
        }
      : null;

    return {
      preset,
      tuning: safeTuning,
      copy: preset.copy,
      nodes,
      lens,
      annotations,
    };
  }

  function validateComposition({ slots, slotCount, annotationOverflow = false }) {
    const errors = [];
    for (let slot = 0; slot < slotCount; slot += 1) {
      const page = slots[slot];
      if (!page?.screenshot) errors.push(`第 ${slot + 1} 个截图槽位为空`);
      if (page?.imageState === "error") errors.push(`第 ${slot + 1} 个截图无法读取`);
    }
    if (annotationOverflow) errors.push("步骤标签过长，请缩短后再导出");
    return { valid: errors.length === 0, errors };
  }

  function getBackgroundCss(themeId) {
    const theme = THEMES[normalizeThemeId(themeId)];
    if (theme.background.type === "solid") return theme.background.color;
    const stops = theme.background.stops
      .map(([position, color]) => `${color} ${Math.round(position * 100)}%`)
      .join(", ");
    return `linear-gradient(to bottom right, ${stops})`;
  }

  const api = Object.freeze({
    ARTBOARD,
    TUNING_RANGES,
    THEMES,
    LAYOUT_PRESETS,
    normalizeLayoutId,
    normalizeThemeId,
    normalizeTuning,
    createDefaultLayoutState,
    resolveSlotPages,
    resolveComposition,
    validateComposition,
    getBackgroundCss,
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalScope.LaunchFrameLayouts = api;
})(typeof globalThis === "undefined" ? this : globalThis);
