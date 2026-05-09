# materials/

Each whitepaper lives in its own subfolder, e.g. `materials/<whitepaper-name>/`. Inside each folder:

```
<whitepaper-name>/
  <whitepaper-name>-print.pdf  # 300 dpi rendered output (auto-generated)
  <whitepaper-name>.pdf        # 150 dpi screen/distribution version (auto-generated)
  design-files/
    cover.html                 # source HTML — title page
    toc.html                   # source HTML — table of contents
    intro.html                 # source HTML — introduction
    section-1.html             # source HTML — body section
    ...                        # additional sections / data spreads / pull quotes
    references.html            # source HTML — citations
    back-cover.html            # source HTML — final page
    pages.json                 # page order + type — read by render-whitepaper.js
    review.html                # (optional) iframe-based scrollable viewer
```

The deliverable PDFs sit at the top of the folder so they're easy to find and share. All page HTML files, `pages.json`, and `review.html` stay tucked into `design-files/`.

Folder names are lowercase, hyphen-separated.

## Render

```bash
node server/render-whitepaper.js materials/<whitepaper-name>/
```

The renderer reads `design-files/pages.json` for page order, renders each page from `design-files/`, and writes both PDFs to the whitepaper folder root.

This produces both PDFs in one command.
