const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getTransferTypes,
  dataTransferHasPayload,
  hasSupportedPayload,
  parseDataTransfer,
  describePayload,
  extractFiles,
  extractUrl,
  extractUrlsFromUriList,
  extractUrlsFromHtml,
} = require("../dragdrop.js");

function file(name, options = {}) {
  return {
    name,
    size: options.size ?? 42,
    type: options.type ?? "image/png",
    lastModified: options.lastModified ?? 1234,
  };
}

function transfer({ types = [], files = [], items = [], data = {} } = {}) {
  return {
    types,
    files,
    items,
    getData(type) {
      return data[type] ?? data[String(type).toLowerCase()] ?? "";
    },
  };
}

test("normalizes transfer types and recognizes Files case-insensitively", () => {
  const dataTransfer = transfer({ types: ["FILES", "Text/HTML", "files"] });

  assert.deepEqual(getTransferTypes(dataTransfer), ["files", "text/html"]);
  assert.equal(dataTransferHasPayload(dataTransfer), true);
  assert.equal(hasSupportedPayload(dataTransfer), true);
  assert.equal(parseDataTransfer(dataTransfer).kind, "unsupported");
  assert.equal(describePayload(dataTransfer).kind, "unsupported");
});

test("recognizes Firefox file descriptors during dragover", () => {
  const dataTransfer = transfer({ types: ["APPLICATION/X-MOZ-FILE"] });

  assert.equal(dataTransferHasPayload(dataTransfer), true);
  assert.equal(parseDataTransfer(dataTransfer).kind, "unsupported");
});

test("collects files from files and items.getAsFile while removing duplicates", () => {
  const screenshot = file("screen.png");
  const duplicateInstance = file("screen.png");
  const otherScreenshot = file("other.webp", { type: "image/webp", size: 64 });
  const dataTransfer = transfer({
    files: [screenshot],
    items: [
      { kind: "FILE", getAsFile: () => screenshot },
      { kind: "file", getAsFile: () => duplicateInstance },
      { kind: "file", getAsFile: () => otherScreenshot },
    ],
  });

  const result = parseDataTransfer(dataTransfer);
  assert.equal(dataTransferHasPayload(dataTransfer), true);
  assert.equal(result.kind, "file");
  assert.deepEqual(result.files, [screenshot, otherScreenshot]);
});

test("keeps distinct files even when their metadata matches", () => {
  const first = file("same.png");
  const second = file("same.png");
  const result = parseDataTransfer(transfer({ files: [first, second] }));

  assert.equal(result.kind, "file");
  assert.deepEqual(result.files, [first, second]);
});

test("ignores unavailable and throwing file-promise items without aborting parsing", () => {
  const dataTransfer = transfer({
    types: ["Files"],
    items: [
      { kind: "file", getAsFile: () => null },
      {
        kind: "file",
        getAsFile() {
          throw new Error("not ready");
        },
      },
    ],
  });

  assert.deepEqual(parseDataTransfer(dataTransfer), {
    kind: "unsupported",
    files: [],
    urls: [],
    types: ["files"],
  });
});

test("extracts URL-list entries, skips comments, and rejects unsafe schemes", () => {
  assert.deepEqual(
    extractUrlsFromUriList(
      "# source\r\nhttps://example.com/a.png\r\n\r\nblob:https://example.com/id\n" +
        "javascript:alert(1)\nfile:///tmp/image.png",
    ),
    [
      "https://example.com/a.png",
      "blob:https://example.com/id",
      "file:///tmp/image.png",
    ],
  );
});

test("extracts image sources from HTML and decodes URL entities", () => {
  assert.deepEqual(
    extractUrlsFromHtml(`
      <a href="https://example.com/page">
        <img alt="one" src="https://cdn.example.com/a.png?x=1&amp;y=2">
      </a>
      <img src='data:image/png;base64,AAAA'>
      <img src=javascript:alert(1)>
    `),
    ["https://cdn.example.com/a.png?x=1&y=2", "data:image/png;base64,AAAA"],
  );
});

test("returns a deduplicated URL payload from URI-list and HTML", () => {
  const url = "https://example.com/screenshot.png";
  const dataTransfer = transfer({
    types: ["TEXT/URI-LIST", "text/html"],
    data: {
      "text/uri-list": `${url}\n# ignored`,
      "text/html": `<img src="${url}"><img src="https://example.com/second.jpg">`,
    },
  });

  assert.deepEqual(parseDataTransfer(dataTransfer), {
    kind: "url",
    files: [],
    urls: [url, "https://example.com/second.jpg"],
    types: ["text/uri-list", "text/html"],
  });
});

test("recognizes an image URL exposed as plain text", () => {
  const url = "https://example.com/plain-screenshot.webp";
  const dataTransfer = transfer({
    types: ["TEXT/PLAIN"],
    data: { "text/plain": url },
  });

  assert.equal(dataTransferHasPayload(dataTransfer), true);
  assert.deepEqual(parseDataTransfer(dataTransfer), {
    kind: "url",
    files: [],
    urls: [url],
    types: ["text/plain"],
  });
});

test("recognizes Firefox text/x-moz-url payloads", () => {
  const url = "https://example.com/firefox-screenshot.png";
  const dataTransfer = transfer({
    types: ["text/x-moz-url"],
    data: { "text/x-moz-url": `${url}\nScreenshot title` },
  });

  assert.equal(dataTransferHasPayload(dataTransfer), true);
  assert.deepEqual(parseDataTransfer(dataTransfer), {
    kind: "url",
    files: [],
    urls: [url],
    types: ["text/x-moz-url"],
  });
});

test("prefers a file payload while retaining accompanying URL metadata", () => {
  const screenshot = file("screen.png");
  const dataTransfer = transfer({
    types: ["Files", "text/uri-list"],
    files: [screenshot],
    data: { "text/uri-list": "https://example.com/screen.png" },
  });

  assert.deepEqual(parseDataTransfer(dataTransfer), {
    kind: "file",
    files: [screenshot],
    urls: ["https://example.com/screen.png"],
    types: ["files", "text/uri-list"],
  });
  assert.deepEqual(extractFiles(dataTransfer), [screenshot]);
  assert.equal(extractUrl(dataTransfer), "https://example.com/screen.png");
});

test("distinguishes unsupported descriptors from a truly empty transfer", () => {
  assert.deepEqual(parseDataTransfer(transfer({ types: ["text/plain"] })), {
    kind: "unsupported",
    files: [],
    urls: [],
    types: ["text/plain"],
  });
  assert.deepEqual(parseDataTransfer(transfer()), {
    kind: "empty",
    files: [],
    urls: [],
    types: [],
  });
  assert.deepEqual(parseDataTransfer(null), {
    kind: "empty",
    files: [],
    urls: [],
    types: [],
  });
});

test("tolerates getData failures from protected drag payloads", () => {
  const dataTransfer = {
    types: ["text/uri-list"],
    files: [],
    items: [],
    getData() {
      throw new Error("protected");
    },
  };

  assert.equal(dataTransferHasPayload(dataTransfer), true);
  assert.equal(parseDataTransfer(dataTransfer).kind, "unsupported");
});
