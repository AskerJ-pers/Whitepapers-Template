#!/usr/bin/env node
//
// Renders a multi-file whitepaper folder into a single merged PDF.
//
// Usage:
//   node server/render-whitepaper.js materials/<whitepaper-name>/
//
// Pages are read from pages.json in the target folder, which lists the
// HTML files in order with their page type ("single" or "spread").

const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

// Page order fallback — used only when no pages.json exists in the target folder.
const PAGES_FALLBACK = [
  { file: "cover.html",               type: "single" },
  { file: "benefits.html",            type: "spread" },
  { file: "platform.html",            type: "spread" },
  { file: "features.html",            type: "spread" },
  { file: "incident-management.html", type: "spread" },
  { file: "expert.html",              type: "spread" },
  { file: "back-cover.html",          type: "single" },
];

// Physical dimensions in mm — avoids pixel-to-point conversion distortion
const MM = { single: { w: "210mm", h: "297mm" }, spread: { w: "420mm", h: "297mm" } };

// Viewport dimensions in CSS pixels (96 dpi: 1mm = 3.7795px)
const VP = { single: { width: 794, height: 1123 }, spread: { width: 1588, height: 1123 } };

// MIME types for embedded images
const MIME = {
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".svg":  "image/svg+xml",
  ".webp": "image/webp",
  ".gif":  "image/gif",
};

// Replace all relative <img src> paths with inline base64 data URIs so
// Puppeteer never needs to load images from disk via file://.
// Resolves relative to the HTML file's directory, then walks up the tree
// until the file is found — handles cases where paths in HTML are off by
// one level (e.g. ../../images/ vs ../../../images/).
function embedImages(html, htmlFilePath) {
  const dir = path.dirname(htmlFilePath);
  return html.replace(/(<img\b[^>]*?\s)src="([^"]+)"/gi, (match, prefix, src) => {
    if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
      return match;
    }
    let abs = null;
    let searchDir = dir;
    while (searchDir !== path.dirname(searchDir)) {
      const candidate = path.resolve(searchDir, src);
      if (fs.existsSync(candidate)) { abs = candidate; break; }
      searchDir = path.dirname(searchDir);
    }
    if (!abs) {
      console.warn(`    Warning: image not found — ${src}`);
      return match;
    }
    const ext = path.extname(abs).toLowerCase();
    const mimeType = MIME[ext] || "application/octet-stream";
    const data = fs.readFileSync(abs).toString("base64");
    return `${prefix}src="data:${mimeType};base64,${data}"`;
  });
}

async function render(folderArg) {
  const folder = path.resolve(folderArg);
  if (!fs.existsSync(folder)) {
    console.error(`Folder not found: ${folder}`);
    process.exit(1);
  }

  // Source HTML and pages.json live in design-files/
  const designFilesDir = path.join(folder, "design-files");
  if (!fs.existsSync(designFilesDir)) {
    console.error(`No design-files/ folder found inside ${folder}.`);
    console.error(
      "Source HTML and pages.json live in design-files/ — see CLAUDE.md for the expected structure."
    );
    process.exit(1);
  }

  // Load page list from pages.json if present, otherwise use fallback constant
  let pages;
  const pagesJsonPath = path.join(designFilesDir, "pages.json");
  if (fs.existsSync(pagesJsonPath)) {
    const fileNames = JSON.parse(fs.readFileSync(pagesJsonPath, "utf8"));
    pages = fileNames.map(file => ({ file, type: null }));
  } else {
    pages = PAGES_FALLBACK;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--font-render-hinting=none",
      "--disable-skia-runtime-opts",
      "--force-color-profile=srgb",
    ],
  });
  const mergedPdf = await PDFDocument.create();

  for (const entry of pages) {
    const filePath = path.join(designFilesDir, entry.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  Skipping missing file: design-files/${entry.file}`);
      continue;
    }

    // Auto-detect spread vs single by probing for .spread-wrapper element
    let type = entry.type;
    const rawHtml = fs.readFileSync(filePath, "utf8");
    if (!type) {
      type = rawHtml.includes("spread-wrapper") ? "spread" : "single";
    }

    const { file } = entry;
    const { width, height } = VP[type];
    const { w: pdfW, h: pdfH } = MM[type];
    console.log(`  Rendering ${file} (${type}: ${pdfW} × ${pdfH})`);

    // Embed all local images as base64 data URIs before handing to Puppeteer
    const html = embedImages(rawHtml, filePath);

    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.emulateMediaType("screen");
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);

    // Improve font rendering fidelity in headless Chrome
    await page.addStyleTag({ content: `
      * {
        -webkit-font-smoothing: subpixel-antialiased !important;
        -moz-osx-font-smoothing: auto !important;
        text-rendering: geometricPrecision !important;
      }
    ` });

    // Reset viewport scaling and strip decorative body background
    await page.evaluate(() => {
      document.documentElement.style.cssText = "margin:0;padding:0;overflow:hidden;background:transparent!important;";
      document.body.style.cssText = "margin:0;padding:0;overflow:hidden;background:transparent!important;display:block;";
      const el = document.getElementById("spreadWrapper") || document.querySelector(".page-wrapper");
      if (el) {
        el.style.transform = "scale(1)";
        el.style.transformOrigin = "top left";
        el.style.position = "fixed";
        el.style.top = "0";
        el.style.left = "0";
        el.style.margin = "0";
        el.style.flexShrink = "0";
      }
    });

    const pdfBuffer = await page.pdf({
      width: pdfW,
      height: pdfH,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const srcPdf = await PDFDocument.load(pdfBuffer);
    const [copied] = await mergedPdf.copyPages(srcPdf, [0]);
    mergedPdf.addPage(copied);

    await page.close();
  }

  await browser.close();

  // Output filename = folder name + .pdf
  const folderName = path.basename(folder);
  const rawPath    = path.join(folder, `${folderName}-raw.pdf`);
  const printPath  = path.join(folder, `${folderName}-print.pdf`);
  const screenPath = path.join(folder, `${folderName}.pdf`);

  fs.writeFileSync(rawPath, await mergedPdf.save());

  console.log("\n  Compressing with Ghostscript...");

  // 300dpi print version
  execSync(
    `gs -q -dBATCH -dNOPAUSE -dSAFER \
     -sDEVICE=pdfwrite \
     -dCompatibilityLevel=1.4 \
     -dPDFSETTINGS=/printer \
     -dColorImageResolution=300 \
     -dGrayImageResolution=300 \
     -dMonoImageResolution=600 \
     -sOutputFile="${printPath}" \
     "${rawPath}"`,
    { stdio: "inherit" }
  );

  // 150dpi screen/distribution version
  execSync(
    `gs -q -dBATCH -dNOPAUSE -dSAFER \
     -sDEVICE=pdfwrite \
     -dCompatibilityLevel=1.4 \
     -dPDFSETTINGS=/ebook \
     -sOutputFile="${screenPath}" \
     "${rawPath}"`,
    { stdio: "inherit" }
  );

  fs.unlinkSync(rawPath);

  const printSize  = fs.statSync(printPath).size;
  const screenSize = fs.statSync(screenPath).size;
  console.log(`Generated: ${printPath} (${(printSize / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`Generated: ${screenPath} (${(screenSize / 1024 / 1024).toFixed(1)} MB)`);
}

const input = process.argv[2];
if (!input) {
  console.error("Usage: node server/render-whitepaper.js <whitepaper-folder>");
  console.error("  e.g. node server/render-whitepaper.js materials/my-whitepaper/");
  process.exit(1);
}

render(input).catch((err) => {
  console.error("Render failed:", err.message);
  process.exit(1);
});
