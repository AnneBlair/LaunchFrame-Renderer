(function initializeLaunchFrameDragDrop(globalScope) {
  "use strict";

  const FILES_TYPE = "files";
  const MOZ_FILE_TYPE = "application/x-moz-file";
  const URI_LIST_TYPE = "text/uri-list";
  const HTML_TYPE = "text/html";
  const PLAIN_TEXT_TYPE = "text/plain";
  const MOZ_URL_TYPE = "text/x-moz-url";
  const SUPPORTED_TEXT_TYPES = Object.freeze([
    URI_LIST_TYPE,
    HTML_TYPE,
    PLAIN_TEXT_TYPE,
    MOZ_URL_TYPE,
  ]);

  function toArray(value) {
    if (!value) return [];

    try {
      return Array.from(value);
    } catch (_error) {
      const items = [];
      const length = Number.isFinite(Number(value.length)) ? Number(value.length) : 0;
      for (let index = 0; index < length; index += 1) {
        if (value[index] !== undefined) items.push(value[index]);
      }
      return items;
    }
  }

  function getTransferTypes(dataTransfer) {
    const seen = new Set();
    const types = [];

    for (const type of toArray(dataTransfer?.types)) {
      const normalized = String(type ?? "").trim().toLowerCase();
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      types.push(normalized);
    }

    return types;
  }

  function isFileItem(item) {
    return String(item?.kind ?? "").toLowerCase() === "file";
  }

  function dataTransferHasPayload(dataTransfer) {
    if (!dataTransfer) return false;
    if (toArray(dataTransfer.files).length > 0) return true;
    if (toArray(dataTransfer.items).some(isFileItem)) return true;

    const types = getTransferTypes(dataTransfer);
    return (
      types.includes(FILES_TYPE) ||
      types.includes(MOZ_FILE_TYPE) ||
      SUPPORTED_TEXT_TYPES.some((type) => types.includes(type))
    );
  }

  function isFileLike(value) {
    return Boolean(value && (typeof value === "object" || typeof value === "function"));
  }

  function getFileSignature(file) {
    const name = typeof file.name === "string" ? file.name : "";
    const size = Number.isFinite(Number(file.size)) ? Number(file.size) : null;
    const type = typeof file.type === "string" ? file.type.toLowerCase() : "";
    const lastModified = Number.isFinite(Number(file.lastModified))
      ? Number(file.lastModified)
      : null;

    if (!name && lastModified === null) return "";
    return JSON.stringify([name, size, type, lastModified]);
  }

  function collectFiles(dataTransfer) {
    const files = [];
    const seenObjects = new Set();
    const fileListSignatures = new Set();

    function addFile(file, { skipFileListDuplicate = false } = {}) {
      if (!isFileLike(file) || seenObjects.has(file)) return;

      const signature = getFileSignature(file);
      if (skipFileListDuplicate && signature && fileListSignatures.has(signature)) return;

      seenObjects.add(file);
      files.push(file);
      return signature;
    }

    for (const file of toArray(dataTransfer?.files)) {
      const signature = addFile(file);
      if (signature) fileListSignatures.add(signature);
    }

    for (const item of toArray(dataTransfer?.items)) {
      if (!isFileItem(item) || typeof item.getAsFile !== "function") continue;
      try {
        addFile(item.getAsFile(), { skipFileListDuplicate: true });
      } catch (_error) {
        // Some file-promise providers only expose the file after the drop completes.
      }
    }

    return files;
  }

  function readTransferData(dataTransfer, canonicalType) {
    if (!dataTransfer || typeof dataTransfer.getData !== "function") return "";

    const actualType = toArray(dataTransfer.types).find(
      (type) => String(type ?? "").trim().toLowerCase() === canonicalType,
    );
    const candidates = actualType ? [String(actualType), canonicalType] : [canonicalType];

    for (const type of candidates) {
      try {
        const value = dataTransfer.getData(type);
        if (typeof value === "string" && value.trim()) return value;
      } catch (_error) {
        // Text data can be protected during dragover and unavailable to the page.
      }
    }

    return "";
  }

  function normalizeUrl(value) {
    const url = String(value ?? "").trim();
    if (!url) return "";

    if (/^https?:\/\//i.test(url)) return url;
    if (/^\/\//.test(url)) return url;
    if (/^blob:/i.test(url)) return url;
    if (/^file:/i.test(url)) return url;
    if (/^data:image\//i.test(url)) return url;
    return "";
  }

  function extractUrlsFromUriList(value) {
    const urls = [];
    for (const line of String(value ?? "").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const url = normalizeUrl(trimmed);
      if (url) urls.push(url);
    }
    return urls;
  }

  function decodeHtmlEntities(value) {
    return String(value ?? "").replace(
      /&(?:amp|quot|apos|#39|lt|gt|#x[0-9a-f]+|#[0-9]+);/gi,
      (entity) => {
        const normalized = entity.toLowerCase();
        const named = {
          "&amp;": "&",
          "&quot;": '"',
          "&apos;": "'",
          "&#39;": "'",
          "&lt;": "<",
          "&gt;": ">",
        };
        if (named[normalized]) return named[normalized];

        const numeric = normalized.startsWith("&#x")
          ? Number.parseInt(normalized.slice(3, -1), 16)
          : Number.parseInt(normalized.slice(2, -1), 10);
        return Number.isFinite(numeric) && numeric >= 0 && numeric <= 0x10ffff
          ? String.fromCodePoint(numeric)
          : entity;
      },
    );
  }

  function extractUrlsFromHtml(value) {
    const html = String(value ?? "");
    const urls = [];
    const imageSourcePattern =
      /<img\b[^>]*?\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
    let match;

    while ((match = imageSourcePattern.exec(html))) {
      const source = decodeHtmlEntities(match[1] ?? match[2] ?? match[3] ?? "");
      const url = normalizeUrl(source);
      if (url) urls.push(url);
    }

    return urls;
  }

  function uniqueUrls(values) {
    const urls = [];
    const seen = new Set();
    for (const value of values) {
      const url = normalizeUrl(value);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      urls.push(url);
    }
    return urls;
  }

  function parseDataTransfer(dataTransfer) {
    if (!dataTransfer) {
      return { kind: "empty", files: [], urls: [], types: [] };
    }

    const types = getTransferTypes(dataTransfer);
    const items = toArray(dataTransfer.items);
    const files = collectFiles(dataTransfer);
    const uriList = readTransferData(dataTransfer, URI_LIST_TYPE);
    const html = readTransferData(dataTransfer, HTML_TYPE);
    const plainText = readTransferData(dataTransfer, PLAIN_TEXT_TYPE);
    const mozUrl = readTransferData(dataTransfer, MOZ_URL_TYPE);
    const urls = uniqueUrls([
      ...extractUrlsFromUriList(uriList),
      ...extractUrlsFromHtml(html),
      ...extractUrlsFromUriList(plainText),
      ...extractUrlsFromUriList(mozUrl),
    ]);

    if (files.length > 0) return { kind: "file", files, urls, types };
    if (urls.length > 0) return { kind: "url", files, urls, types };

    const hasDescriptor = types.length > 0 || items.length > 0;
    if (hasDescriptor) return { kind: "unsupported", files, urls, types };
    return { kind: "empty", files, urls, types };
  }

  function extractFiles(dataTransfer) {
    return collectFiles(dataTransfer);
  }

  function extractUrl(dataTransfer) {
    return parseDataTransfer(dataTransfer).urls[0] ?? "";
  }

  const api = Object.freeze({
    getTransferTypes,
    dataTransferHasPayload,
    hasSupportedPayload: dataTransferHasPayload,
    parseDataTransfer,
    describePayload: parseDataTransfer,
    extractFiles,
    extractUrl,
    extractUrlsFromUriList,
    extractUrlsFromHtml,
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalScope.LaunchFrameDragDrop = api;
})(typeof globalThis === "undefined" ? this : globalThis);
