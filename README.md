# Whitepapers Template

A template for building long-form A4 PDF whitepapers, research reports, and in-depth thought leadership pieces. Each whitepaper is a folder of standalone HTML pages rendered to a single merged PDF via Puppeteer + Ghostscript.

Brand assets (guidelines, tone of voice, design tokens, logos) are pulled in from a separate `Brand-Shared` repo as a git submodule, so brand updates only happen in one place.

> **Maturity note:** Unlike `Presentations-Template` and `Brochures-Template`, this repo does not yet have a fully built-out catalogue of whitepaper page templates. The design system, workflow, and renderer are in place — but specific layouts in `templates/` will be added over time. Compose new whitepaper pages from the design system rules in `CLAUDE.md` until then.

---

## Getting started

**After cloning this repo, run the setup script. It walks you through everything in plain language:**

```bash
node setup.js
```

The script will:

- Pull in the `Brand-Shared` submodule (so the `brand-shared/` folder isn't empty)
- Install the renderer dependencies (Puppeteer)
- Check that Ghostscript is installed (it compresses PDFs after rendering)
- Tell you whether your brand has been filled in yet

It runs once. After it's done it skips itself on subsequent runs.

**Prerequisites:** Node.js installed. Get the LTS version from [nodejs.org](https://nodejs.org/) if you don't have it.

Once setup is complete:

1. **Fill in your brand** — populate the [Brand-Shared](https://github.com/AskerJ-pers/Brand-Shared) repo with your tokens, references, and logos. The setup script will tell you whether this still needs doing.
2. **Add your images** — drop assets into `images/stock/`, `images/product/`, or `images/other/`
3. **Start creating** — open Claude Code in this repo and ask it to create your first whitepaper

<details>
<summary><strong>Prefer to do it manually?</strong></summary>

```bash
# Pull the brand submodule
git submodule update --init --recursive

# Install the renderer
cd server && npm install

# Install Ghostscript (one-time, system-wide)
# macOS:    brew install ghostscript
# Linux:    sudo apt install ghostscript
# Windows:  download from ghostscript.com
```
</details>

---

## Format basics

| Property | Value |
|---|---|
| Page size | A4 portrait (most pages) or A4 landscape spread (data-heavy pages) |
| Single page @ 96 dpi | 794 × 1123 px |
| Spread @ 96 dpi | 1588 × 1123 px |
| Print dimensions | 210 × 297 mm per page |
| Typical length | 5–30 pages |
| Output | One HTML per page, two merged PDFs (300 dpi print + 150 dpi screen) |

---

## Folder structure

| Path | What it is |
|---|---|
| [`brand-shared/`](./brand-shared/) | Submodule — shared brand resources |
| [`templates/`](./templates/) | Whitepaper page blueprints — populated over time |
| [`materials/`](./materials/) | Output whitepapers, one folder each |
| [`images/`](./images/) | Shared image library with per-image JSON metadata |
| [`server/`](./server/) | Puppeteer-based PDF renderer + static file server |
| [`CLAUDE.md`](./CLAUDE.md) | Agent-facing workflow and rules |

---

## Editing workflow

```bash
# Start the static server
node server/serve.js
# → open http://localhost:3000/materials/<whitepaper-name>/design-files/<page>.html
```

Edit `contenteditable` text directly in the browser. Save with **Cmd+Alt+S** (Ctrl+Alt+S on Windows).

---

## Scaffolding a new whitepaper

The fastest way to start a new whitepaper:

```bash
node server/scaffold.js <whitepaper-name>
```

This creates `materials/<whitepaper-name>/design-files/` with three starter pages (cover, intro, back-cover) and a `pages.json` listing them in order. Open the cover via `node server/serve.js`, edit in place, then ask Claude to add body sections, pull quotes, and a references page.

---

## Rendering to PDF

```bash
node server/render-whitepaper.js materials/<whitepaper-name>/
```

The script reads `pages.json` from the whitepaper folder. Produces both PDFs in one command:
- `<whitepaper-name>-print.pdf` — 300 dpi
- `<whitepaper-name>.pdf` — 150 dpi

See [`CLAUDE.md`](./CLAUDE.md) for the full workflow.

---

## When to use a whitepaper vs. another format

| Goal | Format |
|---|---|
| Long-form research, argument, or thought leadership (5+ pages) | **Whitepaper** (this repo) |
| Multi-page product overview (sales-oriented) | Brochure (`Brochures-Template`) |
| Short, standalone summary or flyer (1 page) | One-pager (`OnePagers-Template`) |
| Slide deck for presentation | Presentation (`Presentations-Template`) |
| Square / vertical post for social channels | Social (`Social-Template`) |

The key distinction from a brochure: a whitepaper makes an **argument** with evidence; a brochure **describes** a product.

---

## Updating shared brand assets

```bash
# In the Brand-Shared repo:
# 1. Edit references/, tokens.css, tokens.json, brand/
# 2. Commit and push

# Back in this repo:
git submodule update --remote brand-shared
git add brand-shared
git commit -m "Update brand-shared to latest"
git push
```

---

## Using this as a GitHub template

This repo is designed to be used as a [GitHub template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository). When you create a new repo from it:

1. Run `git submodule update --init --recursive` to pull in the brand assets
2. Either fork `Brand-Shared` or populate the existing one
3. Add your images to `images/`
4. Start creating whitepapers
