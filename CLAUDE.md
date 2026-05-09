# Whitepapers — Agent Instructions

This repo contains long-form A4 PDF documents — whitepapers, research reports, in-depth thought leadership pieces. Each whitepaper is a folder of standalone HTML pages rendered to a single merged PDF.

Brand assets (guidelines, tone of voice, design tokens, logos) are pulled in from a separate submodule at `brand-shared/`.

> **Setup required:** If this is a freshly-cloned repo, run `node setup.js` once before creating any materials. The script pulls in the Brand-Shared submodule, installs the renderer, and checks your environment. It writes a `.setup-complete` marker when done and self-skips on subsequent runs. See [`README.md`](./README.md) for details.

---

## First-time setup check

Before starting any work in this repo, check that initial setup has been completed:

1. Check whether `.setup-complete` exists at the repo root.
2. **If it does NOT exist**, this is a freshly-cloned repo that hasn't been set up yet. Stop, tell the user, and run setup before proceeding:

   > "This repo hasn't been set up yet. I'll run `node setup.js` — it walks through pulling in the Brand-Shared resources, installing the renderer, and checking your environment. This only happens once."

   Then run `node setup.js` for them. Surface any errors (Node missing, Ghostscript missing, network access denied, etc.) as they happen so the user can resolve them. The script is interactive and will pause for an Enter keypress at the start — let the user respond, don't try to bypass it.
3. **If `.setup-complete` exists**, proceed with the work the user has asked for.

If setup is interrupted partway through (e.g. Ghostscript missing), the script exits without writing the marker. Re-running picks up where it left off.

> **Note on this repo's maturity:** Unlike `Presentations-Template` and `Brochures-Template`, this repo does not yet have a fully built-out catalogue of whitepaper page templates. The design system, workflow, and renderer are in place — but specific layouts in `templates/` will be added over time. Until then, compose new whitepaper pages directly from the design system rules below, drawing on patterns from `Brochures-Template` (similar multi-page A4 format) where useful.

---

## Scaffolding a new whitepaper

To create a new whitepaper folder pre-populated with three starter pages:

```bash
node server/scaffold.js <whitepaper-name>
```

This creates `materials/<whitepaper-name>/design-files/` with:
- `cover.html` — title page with eyebrow, title, subtitle, author/date
- `intro.html` — introduction page with section title and three placeholder paragraphs
- `back-cover.html` — final page with CTA
- `pages.json` — lists all three in display order

After running scaffold:
1. Open `http://localhost:3000/materials/<whitepaper-name>/design-files/cover.html` in your browser via `node server/serve.js`
2. Edit the placeholder text in place
3. Ask Claude to add body sections, pull quotes, references pages, etc.
4. Render with `node server/render-whitepaper.js materials/<whitepaper-name>/`

A typical full whitepaper adds a TOC, multiple body sections, pull quotes, conclusion, and references. The scaffold gives you the minimum viable structure to extend from.

---

## Folder structure

```
brand-shared/                 # Submodule — shared brand resources (do NOT edit here; edit in the Brand-Shared repo)
  references/
    brand-guidelines.md
    tone-of-voice.md
  tokens.css
  tokens.json
  brand/                      # Logo SVGs
templates/                    # Whitepaper page blueprints — to be populated over time
server/                       # Render tooling (Puppeteer + Ghostscript)
  render-whitepaper.js        # Renders a whitepaper folder to PDF
  serve.js                    # Static file server for local viewing
images/                       # Shared image library with metadata
  index.json
  stock/
  product/
  other/
materials/                    # All output whitepapers live here
  <whitepaper-name>/
    <whitepaper-name>-print.pdf # 300 dpi rendered output (auto-generated)
    <whitepaper-name>.pdf       # 150 dpi screen/distribution version (auto-generated)
    design-files/
      cover.html                # source HTML — title page
      toc.html                  # source HTML — table of contents
      intro.html                # source HTML — introduction
      section-1.html            # source HTML — body section
      ...
      references.html           # source HTML — citations
      back-cover.html           # source HTML — final page
      pages.json                # page order + type — read by render-whitepaper.js
      review.html               # (optional) iframe-based scrollable viewer
```

All output whitepapers **must** live inside `materials/<whitepaper-name>/`. Never create whitepaper folders at the project root.

**Why the `design-files/` subfolder?** It keeps the deliverable PDFs at the top of the whitepaper folder so they're easy to find, share, and link to. The page HTML files, `pages.json`, and `review.html` stay tucked away one level deeper.

---

## Format basics

| Property | Value |
|---|---|
| Page size | A4 portrait (most pages) or A4 landscape spread (data-heavy pages) |
| Single page @ 96 dpi | 794 × 1123 px |
| Spread @ 96 dpi | 1588 × 1123 px |
| Print dimensions | 210 × 297 mm per page |
| Typical length | 5–30 pages |
| File output | One HTML per page, two merged PDFs (300 dpi print + 150 dpi screen) |

Whitepapers are **long-form, text-dense, authoritative**. They are typically more research-oriented than brochures and have:

- A title cover with subtitle and author/date
- A table of contents
- An introduction setting up the thesis
- Multiple body sections, often with subsections
- Pull quotes, callouts, and data visualizations interspersed
- A conclusion summarizing the argument
- A references / further reading page
- A back cover with CTA

### When to use a whitepaper vs. another format

| Goal | Format |
|---|---|
| Long-form research, argument, or thought leadership (5+ pages) | **Whitepaper** (this repo) |
| Multi-page product overview (sales-oriented) | Brochure (`Brochures-Template`) |
| Short, standalone summary or flyer (1 page) | One-pager (`OnePagers-Template`) |
| Slide deck for presentation | Presentation (`Presentations-Template`) |
| Square / vertical post for social channels | Social (`Social-Template`) |

The key distinction from a brochure: a whitepaper makes an **argument** with evidence; a brochure **describes** a product. Tone, density, and visual treatment differ accordingly.

---

## Mandatory workflow

**Every step is mandatory. Do not skip any step. Do not write any HTML until steps 1–4 are complete.**

### Step 1 — Read the tone of voice file
Read `brand-shared/references/tone-of-voice.md` in full. Apply every rule without exception. Whitepapers especially require careful adherence — text density amplifies any tone errors.

### Step 2 — Read the brand guidelines
Read `brand-shared/references/brand-guidelines.md` to confirm colour, typography, and component usage.

### Step 3 — Establish the argument structure
Confirm with the user:
- What is the central thesis or question?
- Who is the intended reader and what do they already know?
- What is the structural outline — sections, subsections, evidence type?
- Are there specific data points, charts, or sources to include?
- What is the desired length (page count)?

A whitepaper is built around an argument. Without a clear thesis and outline, the document drifts into generic content.

### Step 4 — Plan the page order

Sketch out `pages.json` before writing any HTML:

```json
[
  { "file": "cover.html",        "type": "single" },
  { "file": "toc.html",          "type": "single" },
  { "file": "intro.html",        "type": "single" },
  { "file": "section-1.html",    "type": "single" },
  { "file": "section-1-data.html", "type": "spread" },
  { "file": "section-2.html",    "type": "single" },
  { "file": "section-3.html",    "type": "single" },
  { "file": "conclusion.html",   "type": "single" },
  { "file": "references.html",   "type": "single" },
  { "file": "back-cover.html",   "type": "single" }
]
```

Confirm the count and structure with the user before building.

### Step 5 — Check for templates

Look in `templates/` for layouts that match each page type. If suitable templates exist, follow them strictly. If not, [compose from scratch](#composing-from-scratch).

### Step 6 — Build each page file

Build one HTML file per page. Apply all brand rules. Each file must:

- Include `contenteditable="true"` on all editable text elements
- Include the Cmd+Alt+S save handler with the correct `suggestedName` (the actual filename)
- Include responsive scaling JS so the page can be viewed in the browser at fit-to-viewport scale
- Use the logo double-clone guard (see below)

### Step 7 — Create pages.json

Save the `pages.json` from Step 4 inside the whitepaper folder.

### Step 8 — (Optional) Create review.html

Create `review.html` — a scrollable iframe-based viewer that shows all pages stacked vertically for review. Iframes are non-interactive (`pointer-events: none`) — users open individual page files to edit copy.

### Step 9 — Render the PDF

```
node server/render-whitepaper.js materials/<whitepaper-name>/
```

This produces two PDF files:
- `<whitepaper-name>-print.pdf` — 300 dpi
- `<whitepaper-name>.pdf` — 150 dpi

Both files are committed to the repo alongside the HTML source files.

---

## Composing from scratch

Until specific templates exist, work from the design system rules below as the foundation. Treat new pages as candidates for templates — keep structure clean and self-contained so they can be saved into `templates/` for reuse.

**Reasonable starting points from sibling repos:**
- `Brochures-Template/templates/cover.html` — works as a whitepaper cover with minor copy adjustments
- `Brochures-Template/templates/back-cover.html` — directly usable as whitepaper back cover
- `Brochures-Template/templates/expert-spread.html` — pattern for "about the author/company" pages

**Whitepaper-specific patterns to consider when composing:**
- **Multi-column body** — 2-column layout for dense reading (column-gap 24–32px, line-length 60–75 chars per column)
- **Pull quote** — large, weight 300, `--blue` colour, 24–32px, hanging quote mark in `--bg-light-blue`
- **Sidebar callout** — narrow right column with key facts, related stat, or "in this section" pointer
- **Section header** — large numbered section title with colour bar, marking the start of each major section
- **Data visualization** — embed SVG or use Chart.js inline; always label clearly with source attribution
- **Footnotes** — superscript references in body, full citations on a `references.html` page

---

## Design system

All whitepaper pages MUST use this exact design system. Values come from `brand-shared/tokens.css`. The same CSS variables and typography rules apply as in any other use case.

### CSS variables

```css
:root {
  --blue: #0658fa;          /* Headlines, stat numbers, pull quotes, accents */
  --blue-dark: #0a0756;     /* Optional dark sections (cover bottom, back cover) */
  --purple: #8000ff;        /* Sparingly — secondary accent only */
  --black: #000000;         /* Main body and heading text */
  --bg-grey: #ecedf0;       /* Page backgrounds, panel backgrounds, sidebar fills */
  --bg-light-blue: #e7f1fd; /* Pull quote backgrounds, callouts, emphasis */
  --white: #ffffff;          /* Default page background */
  --text-grey: #7f7f7f;     /* Body text */
  --border: #d4d6dc;        /* Card borders, dividers, column rules */
}
```

> **TODO:** Replace these values with your brand colours in `brand-shared/tokens.css`.

**Permitted raw hex exceptions:**
- `#808080` — subtitle and secondary headline colour
- `#000000` — where explicit black is required

**Never use raw hex values for any other colour. Never use greens, oranges, or reds for any purpose.**

### Typography

Whitepapers are text-dense — typography hierarchy matters more here than in any other format.

- Font: `'Inter'` via Google Fonts (weights 300, 400, 500, 600, 700)
- Always import: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`

| Style | Size | Weight | Colour | Notes |
|---|---|---|---|---|
| Cover title | 48–60px | 300 | `--black` | One line if possible |
| Section title | 28–36px | 300 | `--black` | Numbered (e.g. "1. Section title") |
| Subsection title | 18–22px | 600 | `--black` | Sentence case |
| Body text | 11–13px, line-height 1.6 | 400 | `--black` (slightly darker than `--text-grey` for long reading) | Use `--text-grey` only for secondary/meta text |
| Pull quote | 22–28px, line-height 1.4 | 300 | `--blue` | Hanging quote mark, attribution below in 11px `--text-grey` |
| Caption / source | 9–10px | 400 | `--text-grey` | Italic |
| Footnote reference | 9px superscript | 600 | `--blue` | Numbered |
| Stat number (callout) | 36–48px | 300 | `--blue` | Optional descriptor below |

**Body text colour exception:** in whitepapers, body text uses `--black` rather than `--text-grey`. Long-form reading at small sizes needs higher contrast than presentation/brochure copy. Reserve `--text-grey` for captions, sources, footnotes, and meta text.

**Typography rules — non-negotiable:**
- Headlines and section titles use sentence case (only first word and proper nouns capitalised)
- Pull quotes are weight 300 in `--blue` — never bold
- Never bold text mid-sentence
- Numbers are never zero-padded
- All text elements must have `contenteditable="true"`
- Section numbers use plain integers (1, 2, 3) not zero-padded (01, 02, 03)

### Page setup

Every whitepaper page HTML file should set up the page like this (for single pages):

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  width: 794px;
  height: 1123px;
  font-family: 'Inter', sans-serif;
  background: var(--white);
  color: var(--black);
  overflow: hidden;
}

.page {
  width: 794px;
  height: 1123px;
  position: relative;
  padding: 80px 72px 80px;  /* generous breathing room top and bottom */
}
```

For spreads, double the width to 1588px.

**Padding guidance:**
- Top: 64–96px (more on cover and section-opening pages)
- Sides: 64–80px (slightly larger than brochures because text density is higher)
- Bottom: minimum 72px to clear the page number and chrome
- Two-column layouts: column-gap 28–32px

### Chrome — required on every page

| Element | Specification |
|---|---|
| Logo | `position: absolute`, `bottom: 32px`, `left: 56px`. Use `<div class="logo"></div>` with the standard `<template id="logo-svg">` clone pattern |
| Page number | `position: absolute`, `bottom: 32px`, `right: 56px`, weight 500, 11–12px, `--text-grey` |
| (Optional) Running header | `position: absolute`, `top: 32px`, with whitepaper title left and section name right, 10px uppercase, `--text-grey` |

Whitepapers should number their pages — readers will reference them. Cover, back cover, and section dividers may suppress the page number, but body pages must show it.

### Logo clone guard, save handler, contenteditable styles, icons

These follow the same patterns as `Brochures-Template`. Include each on every page file:

**Logo SVG template + clone (with guard):**
```javascript
document.querySelectorAll('.logo').forEach(el => {
  if (el.querySelector('svg')) return;
  el.appendChild(document.getElementById('logo-svg').content.cloneNode(true));
});
```

**Cmd+Alt+S save handler:**
```javascript
let _fileHandle = null;
document.addEventListener('keydown', async e => {
  if (!(e.code === 'KeyS' && e.altKey && (e.metaKey || e.ctrlKey))) return;
  e.preventDefault();
  try {
    if (!_fileHandle) {
      _fileHandle = await window.showSaveFilePicker({
        suggestedName: decodeURIComponent(window.location.pathname.split("/").pop()) || "index.html", // ← match the actual filename
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
```

**Contenteditable styles:**
```css
[contenteditable]:hover {
  outline: 1px dashed var(--border);
  border-radius: 2px;
  cursor: text;
}
[contenteditable]:focus {
  outline: 1px dashed var(--blue);
  border-radius: 2px;
}
```

**Lucide icons** — script tag immediately before `</body>`, never in `<head>`. Stroke `var(--blue)`, stroke-width `1.5`, fill `none`. Target `svg` in CSS, not `i`.

---

## Whitepaper-specific patterns

### Pull quote

```html
<aside class="pull-quote">
  <p class="quote-mark">"</p>
  <p class="quote-text" contenteditable="true">The headline insight that pulls the reader's eye.</p>
  <p class="quote-attribution" contenteditable="true">— Author name, role / organization</p>
</aside>
```

```css
.pull-quote {
  margin: 32px 0;
  padding: 24px 32px;
  background: var(--bg-light-blue);
  border-left: 3px solid var(--blue);
  position: relative;
}
.quote-mark {
  font-size: 60px;
  color: var(--blue);
  font-weight: 300;
  line-height: 0.5;
  position: absolute;
  top: 24px;
  left: 16px;
}
.quote-text {
  font-size: 22px;
  font-weight: 300;
  color: var(--blue);
  line-height: 1.4;
  margin-left: 32px;
}
.quote-attribution {
  font-size: 11px;
  color: var(--text-grey);
  margin-top: 12px;
  margin-left: 32px;
}
```

### Section header

A clear visual marker for the start of each major section — enables scanning.

```html
<header class="section-header">
  <span class="section-number" contenteditable="true">1</span>
  <h2 class="section-title" contenteditable="true">Section title in sentence case</h2>
  <p class="section-summary" contenteditable="true">One-line summary of what this section argues or shows.</p>
</header>
```

### Sidebar callout

Narrow column on the right (or left) for key facts, related stats, or "in this section" pointers. Two-column body with a sidebar:

```css
.body-with-sidebar {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 32px;
}
.sidebar {
  background: var(--bg-grey);
  padding: 20px;
  border-radius: 8px;
}
```

### Two-column body

For long passages of body copy, use two columns to keep line lengths readable:

```css
.body-two-col {
  column-count: 2;
  column-gap: 28px;
  font-size: 11px;
  line-height: 1.6;
}
```

### Footnotes

Use superscript numbers in body text and a numbered list at the bottom of the page or on a `references.html` page:

```html
<p>...as recent research has shown.<sup class="fn-ref">1</sup></p>
```

```css
.fn-ref {
  font-size: 9px;
  font-weight: 600;
  color: var(--blue);
  vertical-align: super;
}
```

---

## Images

The `images/` directory mirrors the structure used in the other use-case repos.

```
images/
  index.json
  stock/                          # Cover photography, atmospheric shots
  product/                        # Product UI, dashboards, screenshots
  other/                          # Charts, diagrams, illustrations
```

When a whitepaper needs an image, check `images/index.json` first. Ask the user to provide missing images. Whitepapers often need:

- A cover hero image (atmospheric, conceptual)
- Charts and data visualizations (drop these in `other/` if static, or generate inline SVG/Chart.js)
- Author / contributor photos (drop in `stock/` with descriptive metadata)

---

## Generating PDFs

### Setup (one-time)

```
cd server
npm install
```

You also need Ghostscript installed:
- macOS: `brew install ghostscript`
- Linux: `apt install ghostscript`
- Windows: download from [ghostscript.com](https://www.ghostscript.com/)

### Static file server — serve.js

```
node server/serve.js
```

Then open `http://localhost:3000/materials/<whitepaper-name>/design-files/<page>.html` in your browser.

### Render to PDF — render-whitepaper.js

```
node server/render-whitepaper.js materials/<whitepaper-name>/
```

The script reads `pages.json` from the whitepaper folder. It always produces two output files:

- `<whitepaper-name>-print.pdf` — 300 dpi, Ghostscript `/printer` preset
- `<whitepaper-name>.pdf` — 150 dpi, Ghostscript `/ebook` preset (for screen/distribution)

### When the user asks to "generate a PDF"

1. Confirm `pages.json` exists in the whitepaper folder (create it if missing)
2. Run: `node server/render-whitepaper.js materials/<whitepaper-name>/`
3. Both PDFs are produced automatically
4. Report the final output paths to the user

---

## Editing workflow

1. Start the static server: `node server/serve.js`
2. Open `http://localhost:3000/materials/<whitepaper-name>/design-files/<page>.html` in your browser
3. Edit any `contenteditable` text directly in place
4. Save with Cmd+Alt+S — first press opens a Save As dialog, subsequent presses save silently
5. When done, render: `node server/render-whitepaper.js materials/<whitepaper-name>/`

---

## Quality checklist

**Brand and colour**
- [ ] All colours use CSS variables — no raw hex values except `#808080` and `#000000`
- [ ] No green, orange, or red used anywhere
- [ ] Body text is `--black` for readability (not `--text-grey` — that's reserved for captions/meta)

**Typography**
- [ ] All headlines and section titles use sentence case
- [ ] Section numbers are plain integers (1, 2, 3) — never zero-padded
- [ ] No text is bolded mid-sentence
- [ ] Body text line-height is 1.5–1.6 for readability
- [ ] Pull quotes are weight 300 in `--blue`

**Tone of voice**
- [ ] No em dashes (—)
- [ ] No exclamation marks
- [ ] All numbers written as numerals
- [ ] All statistics attributed to a named source
- [ ] All footnotes have full citations on the `references.html` page

**Layout**
- [ ] All pages are A4 portrait (794 × 1123 px) or A4 landscape spread (1588 × 1123 px)
- [ ] Generous padding (top/bottom 64–96px, sides 64–80px)
- [ ] Page numbers visible on all body pages (suppressed only on cover, back cover, section dividers)
- [ ] Two-column body layouts have column-gap 28–32px

**Interactivity**
- [ ] All text elements have `contenteditable="true"`
- [ ] Contenteditable hover/focus styles present
- [ ] Cmd+Alt+S save handler included (auto-detects filename from URL)
- [ ] Logo clone guard present (`if (!el.querySelector('svg'))`)

**Files**
- [ ] `pages.json` reflects the actual page order
- [ ] All pages saved before running the renderer

---

## Common errors to avoid

| Wrong | Right |
|---|---|
| Body text in `--text-grey` for long-form pages | Body text in `--black` — `--text-grey` is for captions/meta only |
| Citations only in body text without a references page | Always include `references.html` with full citations |
| Page numbers absent from body pages | Show page numbers on all body pages — readers reference them |
| Pull quote in body weight (400) | Pull quotes are always weight 300 in `--blue` |
| Em dash — mid sentence | Comma or restructured sentence |
| Cramped padding (under 60px sides) | Whitepapers need breathing room — minimum 64px sides |
| Logo cloning JS without double-clone guard | Always check `if (!el.querySelector('svg'))` before cloning |
| Lucide CDN script in `<head>` | Place immediately before `</body>` |
| Forgetting `pages.json` before rendering | Renderer needs `pages.json` to know the page order and type |
| Editing files in `brand-shared/` directly | Edit in the Brand-Shared repo, then update the submodule pointer |
| Forgetting to run `git submodule update --init` after cloning | Always init submodules first |

---

## Rules summary

- **Never modify files in `brand-shared/`** — edit them in the Brand-Shared repo, then run `git submodule update --remote brand-shared` and commit the updated pointer
- **Self-contained pages** — each page is its own standalone HTML file
- **Stick to the palette** — only use the CSS variables defined in `brand-shared/tokens.css`
- **Stick to Inter** — no other fonts
- **Argument first** — a whitepaper makes a case with evidence; structure every page around the central thesis
- **Always cite** — every statistic, claim, or quotation needs a source
- **File naming** — whitepaper folders are lowercase, hyphen-separated. Page files match the order in `pages.json`
