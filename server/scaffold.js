#!/usr/bin/env node
//
// scaffold.js — Create a new whitepaper folder with starter pages
//
// Usage:
//   node server/scaffold.js <whitepaper-name>
//
// Creates:
//   materials/<whitepaper-name>/
//     design-files/
//       cover.html         ← title page
//       intro.html         ← introduction
//       back-cover.html    ← final page
//       pages.json         ← lists the three pages in order

const fs = require("fs");
const path = require("path");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};
const supportsColour = process.stdout.isTTY;
const paint = (col, msg) => (supportsColour ? col + msg + c.reset : msg);
const log = (msg) => process.stdout.write(msg + "\n");
const ok = (msg) => log("  " + paint(c.green, "✓ ") + msg);
const fail = (msg) => {
  log("  " + paint(c.red, "✗ ") + msg);
  process.exit(1);
};

function validateName(name) {
  if (!name) {
    fail(
      "Need a whitepaper name as the first argument.\n  e.g.  node server/scaffold.js future-of-grc"
    );
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    fail(
      `"${name}" is not a valid name. Use lowercase letters, numbers, and hyphens only.`
    );
  }
  return name;
}

function humanize(name) {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const sharedHeadCss = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --blue: #0658fa;
    --blue-dark: #0a0756;
    --purple: #8000ff;
    --black: #000000;
    --bg-grey: #ecedf0;
    --bg-light-blue: #e7f1fd;
    --white: #ffffff;
    --text-grey: #7f7f7f;
    --border: #d4d6dc;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 100%;
    min-height: 100%;
    background: #d0d0d0;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .page-wrapper {
    width: 794px;
    height: 1123px;
    transform-origin: top center;
  }

  .page {
    width: 794px;
    height: 1123px;
    background: var(--white);
    position: relative;
    overflow: hidden;
    padding: 80px 72px 80px;
    color: var(--black);
  }

  .eyebrow {
    font-size: 11px;
    font-weight: 600;
    color: var(--blue);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 24px;
  }

  .title {
    font-size: 48px;
    font-weight: 300;
    line-height: 1.15;
    margin-bottom: 16px;
  }

  .subtitle {
    font-size: 18px;
    font-weight: 300;
    color: #808080;
    line-height: 1.4;
    margin-bottom: 24px;
  }

  .meta {
    font-size: 11px;
    color: var(--text-grey);
    margin-top: 48px;
  }

  .body p {
    font-size: 12px;
    line-height: 1.6;
    color: var(--black);
    margin-bottom: 14px;
  }

  .section-title {
    font-size: 22px;
    font-weight: 300;
    margin-bottom: 16px;
    margin-top: 32px;
  }

  .logo {
    position: absolute;
    bottom: 32px;
    left: 56px;
    z-index: 10;
  }

  .page-number {
    position: absolute;
    bottom: 36px;
    right: 56px;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-grey);
  }

  .cta {
    display: inline-block;
    background: var(--blue);
    color: var(--white);
    font-weight: 600;
    font-size: 14px;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    margin-top: 24px;
  }

  /* Contenteditable styles */
  [contenteditable]:hover {
    outline: 1px dashed var(--border);
    border-radius: 2px;
    cursor: text;
  }
  [contenteditable]:focus {
    outline: 1px dashed var(--blue);
    border-radius: 2px;
  }
</style>`;

const sharedScript = `<!-- Logo template — replace with your brand's logo SVG from brand-shared/brand/ -->
<template id="logo-svg">
  <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="32" fill="var(--blue)" rx="4"/>
    <text x="60" y="20" font-family="Inter" font-size="13" font-weight="600" fill="white" text-anchor="middle">YOUR LOGO</text>
  </svg>
</template>

<script>
  document.querySelectorAll('.logo').forEach(el => {
    if (el.querySelector('svg')) return;
    el.appendChild(document.getElementById('logo-svg').content.cloneNode(true));
  });

  function scalePage() {
    const wrapper = document.getElementById('pageWrapper');
    const availableWidth = window.innerWidth - 48;
    const availableHeight = window.innerHeight - 48;
    const scale = Math.min(availableWidth / 794, availableHeight / 1123, 1);
    wrapper.style.transform = \`scale(\${scale})\`;
  }
  window.addEventListener('resize', scalePage);
  scalePage();

  let _fileHandle = null;
  document.addEventListener('keydown', async e => {
    if (!(e.code === 'KeyS' && e.altKey && (e.metaKey || e.ctrlKey))) return;
    e.preventDefault();
    try {
      if (!_fileHandle) {
        _fileHandle = await window.showSaveFilePicker({
          suggestedName: decodeURIComponent(window.location.pathname.split('/').pop()) || 'index.html',
          types: [{ description: 'HTML file', accept: { 'text/html': ['.html'] } }]
        });
      }
      const writable = await _fileHandle.createWritable();
      await writable.write(document.documentElement.outerHTML);
      await writable.close();
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Save failed:', err);
    }
  });
</script>`;

function pageWrap(title, bodyHtml, includePageNumber = true) {
  const pn = includePageNumber
    ? `<div class="page-number" contenteditable="true">1 / 3</div>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${sharedHeadCss}
</head>
<body>
<div class="page-wrapper" id="pageWrapper">
  <div class="page">
${bodyHtml}
    <div class="logo"></div>
${pn ? "    " + pn : ""}
  </div>
</div>

${sharedScript}
</body>
</html>
`;
}

function coverHTML(name) {
  const human = humanize(name);
  const bodyHtml = `    <div class="eyebrow" contenteditable="true">WHITEPAPER</div>
    <h1 class="title" contenteditable="true">${human}</h1>
    <p class="subtitle" contenteditable="true">TODO Add a one-line subtitle that captures the central thesis or question this whitepaper addresses</p>
    <div class="meta">
      <p contenteditable="true">By TODO Author Name</p>
      <p contenteditable="true">TODO Month Year</p>
    </div>`;
  return pageWrap(human + " — Cover", bodyHtml, false);
}

function introHTML(name) {
  const human = humanize(name);
  const bodyHtml = `    <div class="eyebrow" contenteditable="true">INTRODUCTION</div>
    <h2 class="section-title" contenteditable="true">TODO Section title</h2>
    <div class="body">
      <p contenteditable="true">TODO Open with the question or claim this whitepaper sets out to answer. Whitepapers are arguments, not descriptions — make sure the reader knows what they're being asked to consider before you build the case.</p>
      <p contenteditable="true">TODO Establish the stakes. Why does this matter? What changes if the reader accepts the argument?</p>
      <p contenteditable="true">TODO Outline the structure of the document — what each section will cover and how the argument develops.</p>
    </div>`;
  return pageWrap(human + " — Introduction", bodyHtml);
}

function backCoverHTML(name) {
  const human = humanize(name);
  const bodyHtml = `    <div class="eyebrow" contenteditable="true">NEXT STEPS</div>
    <h2 class="title" contenteditable="true">TODO What should the reader do next?</h2>
    <p class="subtitle" contenteditable="true">TODO One sentence summarizing the call to action</p>
    <a href="https://your-domain.com" class="cta" contenteditable="true" target="_blank">Learn more</a>`;
  return pageWrap(human + " — Back cover", bodyHtml, false);
}

function main() {
  const name = validateName(process.argv[2]);
  const repoRoot = path.resolve(__dirname, "..");
  const folderPath = path.join(repoRoot, "materials", name);
  const designFilesDir = path.join(folderPath, "design-files");

  if (fs.existsSync(folderPath)) {
    fail(
      `materials/${name}/ already exists. Use a different name, or delete the folder first.`
    );
  }

  log("");
  log(paint(c.bold, `Scaffolding new whitepaper: ${name}`));
  log("");

  fs.mkdirSync(designFilesDir, { recursive: true });
  ok(`Created materials/${name}/design-files/`);

  fs.writeFileSync(path.join(designFilesDir, "cover.html"), coverHTML(name));
  ok(`Created design-files/cover.html`);

  fs.writeFileSync(path.join(designFilesDir, "intro.html"), introHTML(name));
  ok(`Created design-files/intro.html`);

  fs.writeFileSync(
    path.join(designFilesDir, "back-cover.html"),
    backCoverHTML(name)
  );
  ok(`Created design-files/back-cover.html`);

  const pagesJson =
    JSON.stringify(["cover.html", "intro.html", "back-cover.html"], null, 2) +
    "\n";
  fs.writeFileSync(path.join(designFilesDir, "pages.json"), pagesJson);
  ok(`Created design-files/pages.json`);

  log("");
  log(paint(c.bold, "Next steps:"));
  log("");
  log("  • Start the static server (in another terminal):");
  log(paint(c.dim, `      $ node server/serve.js`));
  log("  • Open the cover in your browser to edit:");
  log(
    paint(
      c.dim,
      `      http://localhost:3000/materials/${name}/design-files/cover.html`
    )
  );
  log("  • Press Cmd+Alt+S (Ctrl+Alt+S on Windows) to save your edits.");
  log("  • Ask Claude to add body sections, pull quotes, references pages, etc.");
  log("  • Render to PDF when ready:");
  log(
    paint(
      c.dim,
      `      $ node server/render-whitepaper.js materials/${name}/`
    )
  );
  log("");
  log(
    paint(
      c.dim,
      "  Note: this is a 3-page starter (cover + intro + back-cover). A typical full"
    )
  );
  log(
    paint(
      c.dim,
      "  whitepaper adds a TOC, body sections, pull quotes, conclusion, and references."
    )
  );
  log("");
}

main();
