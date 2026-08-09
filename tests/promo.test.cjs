const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const repositoryRoot = resolve(__dirname, "..");

for (const entry of ["index.html", "ipad.html"]) {
  test(`${entry} includes the editor-only FreeLingo recommendation`, () => {
    const html = readFileSync(resolve(repositoryRoot, entry), "utf8");
    const controlsStart = html.indexOf('<aside class="controls"');
    const controlsEnd = html.indexOf("</aside>", controlsStart);
    const promoStart = html.indexOf('class="app-promo"');
    const stageStart = html.indexOf('<main id="stage"');

    assert.ok(controlsStart >= 0 && controlsEnd > controlsStart);
    assert.ok(promoStart > controlsStart && promoStart < controlsEnd);
    assert.ok(promoStart < stageStart, "推荐入口不应写入可导出的宣传图画布");
    assert.match(html, /href="https:\/\/freelingo\.ai\/"/);
    assert.match(html, /target="_blank"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.match(html, />FreeLingo</);
    assert.match(html, /背过的单词，不该再忘。/);
  });
}

test("the FreeLingo recommendation has a shared responsive style", () => {
  const css = readFileSync(resolve(repositoryRoot, "styles.css"), "utf8");
  assert.match(css, /\.app-promo\s*\{/);
  assert.match(css, /grid-template-columns:\s*38px minmax\(0, 1fr\) 24px/);
  assert.match(css, /\.app-promo:focus-visible\s*\{/);
});
