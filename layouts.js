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

  function roundedCard(slot, cx, top, width, rotation, radius, z = 1) {
    return Object.freeze({ type: "card", slot, cx, top, width, rotation, radius, z });
  }

  function detail(slot, cx, top, width, height, rotation, focusOffsetX, focusOffsetY, z = 1) {
    return Object.freeze({
      type: "detail",
      slot,
      cx,
      top,
      width,
      height,
      rotation,
      focusOffsetX,
      focusOffsetY,
      z,
    });
  }

  function typedSlot(product, role, label) {
    return Object.freeze({ product, role, label });
  }

  function typedDevice(product, slot, cx, top, width, rotation, z = 1) {
    return Object.freeze({ type: "device", product, slot, cx, top, width, rotation, z });
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

  const IPAD_ARTBOARD = Object.freeze({ width: 2732, height: 2048 });
  const IPAD_TUNING_RANGES = Object.freeze({
    scale: Object.freeze({ min: 0.94, max: 1.05, default: 1 }),
    y: Object.freeze({ min: -80, max: 80, default: 0 }),
    spread: Object.freeze({ min: 0.9, max: 1.1, default: 1 }),
    tilt: Object.freeze({ min: 0, max: 1, default: 1 }),
    focusX: Object.freeze({ min: 0.2, max: 0.8, default: 0.5 }),
    focusY: Object.freeze({ min: 0.2, max: 0.8, default: 0.5 }),
    mirror: Object.freeze({ default: false }),
  });

  const IPAD_THEMES = Object.freeze({
    porcelain: Object.freeze({
      ...THEMES.porcelain,
      background: Object.freeze({
        type: "solid",
        color: "#f2f2f2",
        stops: Object.freeze([[0, "#f2f2f2"]]),
      }),
    }),
    midnight: THEMES.midnight,
    aurora: THEMES.aurora,
    electric: THEMES.electric,
  });

  const ipadCenteredCopy = Object.freeze({
    top: 150,
    left: 160,
    width: 2412,
    align: "center",
    titleScale: 1,
    subtitleScale: 1,
    maxTitleLines: 1,
    maxSubtitleLines: 1,
  });

  const IPAD_LAYOUT_PRESETS = Object.freeze({
    classic: Object.freeze({
      id: "classic",
      label: "经典主视觉",
      description: "原版单机居中",
      slotCount: 1,
      copy: Object.freeze({
        top: 215,
        left: 160,
        width: 2412,
        align: "center",
        titleScale: 1,
        subtitleScale: 1,
      }),
      nodes: Object.freeze([]),
      controls: Object.freeze([]),
      annotations: null,
    }),
    "editorial-split": Object.freeze({
      id: "editorial-split",
      label: "编辑式分栏",
      description: "左文案 · 右主屏",
      slotCount: 1,
      copy: Object.freeze({
        top: 230,
        left: 150,
        width: 760,
        align: "left",
        titleScale: 1.15,
        subtitleScale: 0.86,
        maxTitleLines: 2,
        maxSubtitleLines: 2,
      }),
      nodes: Object.freeze([device(0, 1895, 500, 1700, 2, 2)]),
      controls: Object.freeze(["scale", "y", "tilt", "mirror"]),
      annotations: null,
    }),
    "panorama-stage": Object.freeze({
      id: "panorama-stage",
      label: "全景舞台",
      description: "大屏沉浸 · 视觉压场",
      slotCount: 1,
      copy: ipadCenteredCopy,
      nodes: Object.freeze([device(0, 1366, 510, 2200, 0, 2)]),
      controls: Object.freeze(["scale", "y"]),
      annotations: null,
    }),
    "detail-callout": Object.freeze({
      id: "detail-callout",
      label: "细节拆解",
      description: "主屏 + 双细节窗",
      slotCount: 1,
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        device(0, 1150, 590, 1850, -1, 2),
        detail(0, 2260, 700, 620, 360, 2, -0.16, -0.13, 5),
        detail(0, 2220, 1190, 620, 360, -2, 0.16, 0.15, 6),
      ]),
      controls: Object.freeze(["scale", "y", "tilt", "focusX", "focusY", "mirror"]),
      annotations: null,
    }),
    "duo-flow": Object.freeze({
      id: "duo-flow",
      label: "双屏流转",
      description: "操作 → 结果",
      slotCount: 2,
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        device(0, 760, 710, 1320, -4, 1),
        device(1, 1800, 590, 1480, 3, 2),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt", "mirror"]),
      annotations: Object.freeze({
        connector: Object.freeze({ type: "arrow", cx: 1366, cy: 1130, size: 112 }),
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 700, top: 1760, width: 720 }),
          Object.freeze({ slot: 1, cx: 1980, top: 1760, width: 720 }),
        ]),
      }),
    }),
    "compare-split": Object.freeze({
      id: "compare-split",
      label: "无框对照",
      description: "双场景 · 并列比较",
      slotCount: 2,
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        roundedCard(0, 700, 620, 1180, -1, 44, 1),
        roundedCard(1, 2032, 620, 1180, 1, 44, 1),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt", "mirror"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 700, top: 1660, width: 760 }),
          Object.freeze({ slot: 1, cx: 2032, top: 1660, width: 760 }),
        ]),
      }),
    }),
    "master-detail": Object.freeze({
      id: "master-detail",
      label: "主从联动",
      description: "主屏统领 · 双卡补充",
      slotCount: 3,
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        device(0, 1020, 650, 1580, 0, 2),
        roundedCard(1, 2220, 650, 760, 2, 38, 3),
        roundedCard(2, 2220, 1220, 760, -2, 38, 3),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt", "mirror"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 900, top: 1810, width: 760 }),
          Object.freeze({ slot: 1, cx: 2200, top: 1050, width: 600 }),
          Object.freeze({ slot: 2, cx: 2200, top: 1620, width: 600 }),
        ]),
      }),
    }),
    "window-gallery": Object.freeze({
      id: "window-gallery",
      label: "窗口画廊",
      description: "中心突出 · 两侧延展",
      slotCount: 3,
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        roundedCard(1, 620, 790, 1000, -5, 44, 1),
        roundedCard(2, 2112, 790, 1000, 5, 44, 1),
        roundedCard(0, 1366, 590, 1350, 0, 52, 3),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt", "mirror"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 1366, top: 1720, width: 760 }),
          Object.freeze({ slot: 1, cx: 500, top: 1660, width: 560 }),
          Object.freeze({ slot: 2, cx: 2232, top: 1660, width: 560 }),
        ]),
      }),
    }),
    "ecosystem-hero": Object.freeze({
      id: "ecosystem-hero",
      label: "跨设备主视觉",
      description: "同一体验 · 大小屏延展",
      category: "ecosystem",
      badge: "iPad + iPhone",
      slotCount: 2,
      slots: Object.freeze([
        typedSlot("ipad", "primary", "iPad 主屏"),
        typedSlot("iphone", "support", "iPhone 辅助屏"),
      ]),
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        typedDevice("ipad", 0, 1540, 540, 1860, 1, 2),
        typedDevice("iphone", 1, 455, 720, 470, -4, 4),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt", "mirror"]),
      annotations: null,
    }),
    "capture-to-canvas": Object.freeze({
      id: "capture-to-canvas",
      label: "随手记录到大屏",
      description: "快速输入 → 深度处理",
      category: "ecosystem",
      badge: "iPad + iPhone",
      slotCount: 2,
      slots: Object.freeze([
        typedSlot("ipad", "primary", "iPad 结果屏"),
        typedSlot("iphone", "support", "iPhone 输入屏"),
      ]),
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        typedDevice("iphone", 1, 450, 700, 500, -3, 2),
        typedDevice("ipad", 0, 1730, 540, 1700, 1, 3),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt", "mirror"]),
      annotations: Object.freeze({
        connector: Object.freeze({ type: "arrow", cx: 860, cy: 1160, size: 108 }),
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 1800, top: 1780, width: 720 }),
          Object.freeze({ slot: 1, cx: 420, top: 1780, width: 650 }),
        ]),
      }),
    }),
    "continuity-stack": Object.freeze({
      id: "continuity-stack",
      label: "无缝接续",
      description: "大屏为主 · 手机接续",
      category: "ecosystem",
      badge: "iPad + iPhone",
      slotCount: 2,
      slots: Object.freeze([
        typedSlot("ipad", "primary", "iPad 主任务"),
        typedSlot("iphone", "support", "iPhone 接续任务"),
      ]),
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        typedDevice("ipad", 0, 1340, 500, 2050, 0, 2),
        typedDevice("iphone", 1, 2300, 740, 480, 5, 4),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt", "mirror"]),
      annotations: null,
    }),
    "companion-mode": Object.freeze({
      id: "companion-mode",
      label: "双端协同",
      description: "主工作台 + 辅助端",
      category: "ecosystem",
      badge: "iPad + iPhone",
      slotCount: 2,
      slots: Object.freeze([
        typedSlot("ipad", "primary", "iPad 工作台"),
        typedSlot("iphone", "support", "iPhone 辅助端"),
      ]),
      copy: ipadCenteredCopy,
      nodes: Object.freeze([
        typedDevice("ipad", 0, 1120, 600, 1680, -1, 2),
        typedDevice("iphone", 1, 2280, 680, 500, 3, 3),
      ]),
      controls: Object.freeze(["scale", "y", "spread", "tilt", "mirror"]),
      annotations: Object.freeze({
        labels: Object.freeze([
          Object.freeze({ slot: 0, cx: 1040, top: 1800, width: 760 }),
          Object.freeze({ slot: 1, cx: 2280, top: 1780, width: 650 }),
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

  function resolveTypedSlots({
    pools,
    activeProduct,
    activeItemId,
    slotOverrides = {},
    slots = [],
  }) {
    const activePool = pools?.[activeProduct] ?? [];
    const activeIndex = activePool.findIndex((item) => item.id === activeItemId);
    const activeItem = activePool[activeIndex] ?? null;
    const resolved = [];
    const usedIds = new Set();

    slots.forEach((slot, index) => {
      const pool = pools?.[slot.product] ?? [];
      if (slot.product === activeProduct && slot.role === "primary" && activeItem?.screenshot) {
        resolved.push(activeItem);
        usedIds.add(activeItem.id);
        return;
      }

      const overrideId = slotOverrides[index];
      const overrideItem = pool.find(
        (item) => item.id === overrideId && item.screenshot && !usedIds.has(item.id),
      );
      if (overrideItem) {
        resolved.push(overrideItem);
        usedIds.add(overrideItem.id);
        return;
      }

      const startIndex = slot.product === activeProduct && activeIndex >= 0 ? activeIndex + 1 : 0;
      let automaticItem = null;
      for (let offset = 0; offset < pool.length; offset += 1) {
        const candidate = pool[(startIndex + offset) % pool.length];
        if (!candidate?.screenshot || usedIds.has(candidate.id)) continue;
        automaticItem = candidate;
        break;
      }
      resolved.push(automaticItem);
      if (automaticItem) usedIds.add(automaticItem.id);
    });

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
      if (page?.validationError) errors.push(page.validationError);
      else if (page?.imageState === "error") errors.push(`第 ${slot + 1} 个截图无法读取`);
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

  function createProductApi({
    productKey,
    artboard,
    tuningRanges,
    themes,
    presets,
    annotationStyle,
    thumbnail,
  }) {
    function normalizeProductLayoutId(layoutId) {
      return Object.hasOwn(presets, layoutId) ? layoutId : "classic";
    }

    function normalizeProductThemeId(themeId) {
      return Object.hasOwn(themes, themeId) ? themeId : "porcelain";
    }

    function normalizeProductTuning(tuning = {}) {
      const normalized = {};
      for (const key of ["scale", "y", "spread", "tilt", "focusX", "focusY"]) {
        const range = tuningRanges[key];
        normalized[key] = clamp(tuning[key], range.min, range.max, range.default);
      }
      normalized.mirror =
        tuning.mirror === true ||
        tuning.mirror === 1 ||
        tuning.mirror === "1" ||
        tuning.mirror === "true";
      return normalized;
    }

    function createDefaultProductLayoutState(overrides = {}) {
      return {
        layoutId: normalizeProductLayoutId(overrides.layoutId ?? "classic"),
        layoutTuning: normalizeProductTuning(overrides.layoutTuning),
        slotOverrides: { ...(overrides.slotOverrides ?? {}) },
        annotations: {
          enabled: Boolean(overrides.annotations?.enabled),
          labels: [0, 1, 2].map((index) =>
            String(overrides.annotations?.labels?.[index] ?? "").replace(/[\r\n]+/g, " "),
          ),
        },
      };
    }

    function transformProductHorizontal(value, spread, center = artboard.width / 2) {
      return center + (value - center) * spread;
    }

    function resolveProductComposition({
      layoutId,
      tuning,
      classicDeviceWidth = 1760,
      classicDeviceTop = 536,
    }) {
      const preset = presets[normalizeProductLayoutId(layoutId)];
      const safeTuning = normalizeProductTuning(tuning);
      const mirrored = preset.controls.includes("mirror") && safeTuning.mirror;
      const scale = preset.controls.includes("scale") ? safeTuning.scale : 1;
      const y = preset.controls.includes("y") ? safeTuning.y : 0;
      const spread = preset.controls.includes("spread") ? safeTuning.spread : 1;
      const tilt = preset.controls.includes("tilt") ? safeTuning.tilt : 1;
      const baseNodes =
        preset.id === "classic"
          ? [device(0, artboard.width / 2, classicDeviceTop, classicDeviceWidth, 0, 2)]
          : preset.nodes;

      const mirrorX = (value) => (mirrored ? artboard.width - value : value);
      const nodes = baseNodes
        .map((node) => {
          const resolved = {
            ...node,
            cx: mirrorX(transformProductHorizontal(node.cx, spread)),
            top: node.top + y,
            width: node.width * scale,
            rotation: node.rotation * tilt * (mirrored ? -1 : 1),
          };
          if (node.height) resolved.height = node.height * scale;
          if (node.type === "detail") {
            resolved.focusX = clamp(
              safeTuning.focusX + node.focusOffsetX,
              tuningRanges.focusX.min,
              tuningRanges.focusX.max,
              tuningRanges.focusX.default,
            );
            resolved.focusY = clamp(
              safeTuning.focusY + node.focusOffsetY,
              tuningRanges.focusY.min,
              tuningRanges.focusY.max,
              tuningRanges.focusY.default,
            );
          }
          return resolved;
        })
        .sort((left, right) => left.z - right.z);

      const lens = preset.lens
        ? {
            ...preset.lens,
            cx: mirrorX(transformProductHorizontal(preset.lens.cx, spread)),
            cy: preset.lens.cy + y,
            diameter: preset.lens.diameter * scale,
            focusX: safeTuning.focusX,
            focusY: safeTuning.focusY,
          }
        : null;

      const annotations = preset.annotations
        ? {
            connector: preset.annotations.connector
              ? {
                  ...preset.annotations.connector,
                  cx: mirrorX(
                    transformProductHorizontal(preset.annotations.connector.cx, spread),
                  ),
                  cy: preset.annotations.connector.cy + y,
                  size: preset.annotations.connector.size * scale,
                  direction: mirrored ? -1 : 1,
                }
              : null,
            labels: (preset.annotations.labels ?? []).map((label) => ({
              ...label,
              cx: mirrorX(transformProductHorizontal(label.cx, spread)),
              top: label.top + y,
              width: label.width * scale,
            })),
          }
        : null;

      const copy = mirrored
        ? {
            ...preset.copy,
            left: artboard.width - preset.copy.left - preset.copy.width,
            align:
              preset.copy.align === "left"
                ? "right"
                : preset.copy.align === "right"
                  ? "left"
                  : preset.copy.align,
          }
        : preset.copy;

      return {
        preset,
        tuning: safeTuning,
        copy,
        nodes,
        lens,
        annotations,
      };
    }

    function getProductBackgroundCss(themeId) {
      const theme = themes[normalizeProductThemeId(themeId)];
      if (theme.background.type === "solid") return theme.background.color;
      const stops = theme.background.stops
        .map(([position, color]) => `${color} ${Math.round(position * 100)}%`)
        .join(", ");
      return `linear-gradient(to bottom right, ${stops})`;
    }

    return Object.freeze({
      productKey,
      ARTBOARD: artboard,
      TUNING_RANGES: tuningRanges,
      THEMES: themes,
      LAYOUT_PRESETS: presets,
      ANNOTATION_STYLE: annotationStyle,
      THUMBNAIL: thumbnail,
      normalizeLayoutId: normalizeProductLayoutId,
      normalizeThemeId: normalizeProductThemeId,
      normalizeTuning: normalizeProductTuning,
      createDefaultLayoutState: createDefaultProductLayoutState,
      resolveSlotPages,
      resolveTypedSlots,
      resolveComposition: resolveProductComposition,
      validateComposition,
      getBackgroundCss: getProductBackgroundCss,
    });
  }

  const ipadApi = createProductApi({
    productKey: "ipad",
    artboard: IPAD_ARTBOARD,
    tuningRanges: IPAD_TUNING_RANGES,
    themes: IPAD_THEMES,
    presets: IPAD_LAYOUT_PRESETS,
    annotationStyle: Object.freeze({ fontSize: 42, indexSize: 32, circleSize: 72, gap: 22 }),
    thumbnail: Object.freeze({ width: 52, height: 38 }),
  });

  const api = Object.freeze({
    productKey: "iphone",
    ARTBOARD,
    TUNING_RANGES,
    THEMES,
    LAYOUT_PRESETS,
    normalizeLayoutId,
    normalizeThemeId,
    normalizeTuning,
    createDefaultLayoutState,
    resolveSlotPages,
    resolveTypedSlots,
    resolveComposition,
    validateComposition,
    getBackgroundCss,
    ANNOTATION_STYLE: Object.freeze({ fontSize: 38, indexSize: 28, circleSize: 64, gap: 16 }),
    THUMBNAIL: Object.freeze({ width: 32, height: 52 }),
    forProduct(productKey) {
      return productKey === "ipad" ? ipadApi : api;
    },
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalScope.LaunchFrameLayouts = api;
})(typeof globalThis === "undefined" ? this : globalThis);
