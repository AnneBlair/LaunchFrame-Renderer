const test = require("node:test");
const assert = require("node:assert/strict");

const {
  LAYOUT_PRESETS,
  THEMES,
  normalizeLayoutId,
  normalizeThemeId,
  normalizeTuning,
  createDefaultLayoutState,
  resolveSlotPages,
  resolveComposition,
  validateComposition,
} = require("../layouts.js");

function page(id, screenshot = `${id}.png`) {
  return { id, screenshot, imageState: "ready" };
}

test("registers classic plus eight new layouts and four themes", () => {
  assert.equal(Object.keys(LAYOUT_PRESETS).length, 9);
  assert.equal(Object.keys(THEMES).length, 4);
  assert.equal(LAYOUT_PRESETS["card-gallery"].slotCount, 3);
});

test("unknown identifiers fall back without changing the classic defaults", () => {
  assert.equal(normalizeLayoutId("unknown"), "classic");
  assert.equal(normalizeThemeId("unknown"), "porcelain");
  assert.deepEqual(createDefaultLayoutState(), {
    layoutId: "classic",
    layoutTuning: {
      scale: 1,
      y: 0,
      spread: 1,
      tilt: 1,
      focusX: 0.5,
      focusY: 0.5,
    },
    slotOverrides: {},
    annotations: { enabled: false, labels: ["", "", ""] },
  });
});

test("tuning values are clamped to the safe ranges", () => {
  assert.deepEqual(
    normalizeTuning({ scale: 2, y: -500, spread: 0, tilt: 4, focusX: -1, focusY: 2 }),
    { scale: 1.06, y: -120, spread: 0.85, tilt: 1, focusX: 0.2, focusY: 0.8 },
  );
});

test("automatic slots wrap forward without repeating the primary page", () => {
  const pages = [page("a"), page("b"), page("c")];
  assert.deepEqual(
    resolveSlotPages(pages, "c", {}, 3).map((item) => item?.id),
    ["c", "a", "b"],
  );
});

test("manual slot overrides survive reordering and invalid overrides fall back", () => {
  const pages = [page("a"), page("b"), page("c")];
  const overrides = { 1: "c" };
  assert.deepEqual(
    resolveSlotPages([pages[2], pages[0], pages[1]], "a", overrides, 3).map(
      (item) => item?.id,
    ),
    ["a", "c", "b"],
  );
  assert.deepEqual(
    resolveSlotPages([pages[0], pages[1]], "a", overrides, 3).map((item) => item?.id),
    ["a", "b", undefined],
  );
});

test("composition applies safe scale, spread, vertical shift, and tilt", () => {
  const scene = resolveComposition({
    layoutId: "duo-flow",
    tuning: { scale: 1.06, y: 120, spread: 1.15, tilt: 0.5 },
  });
  assert.equal(scene.nodes.length, 2);
  assert.equal(scene.nodes[0].width, 680 * 1.06);
  assert.equal(scene.nodes[0].top, 1040);
  assert.equal(scene.nodes[0].rotation, -3.5);
  assert.ok(scene.nodes[0].cx < 350);
  assert.ok(scene.nodes[1].cx > 830);
});

test("classic scene retains legacy geometry", () => {
  const scene = resolveComposition({
    layoutId: "classic",
    classicDeviceWidth: 930,
    classicDeviceTop: 730,
  });
  assert.deepEqual(
    scene.nodes.map(({ cx, top, width, rotation }) => ({ cx, top, width, rotation })),
    [{ cx: 660, top: 730, width: 930, rotation: 0 }],
  );
});

test("validation reports missing, failed, and overflowing content", () => {
  const result = validateComposition({
    slots: [page("a"), { ...page("b"), imageState: "error" }, null],
    slotCount: 3,
    annotationOverflow: true,
  });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, [
    "第 2 个截图无法读取",
    "第 3 个截图槽位为空",
    "步骤标签过长，请缩短后再导出",
  ]);
});
