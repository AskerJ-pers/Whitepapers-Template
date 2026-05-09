# templates/

This folder will hold whitepaper page HTML blueprints once specific layouts have been designed and built.

Each template is a single self-contained HTML file at A4 portrait dimensions (794 × 1123px @ 96dpi for single pages, 1588 × 1123px for spreads), with all CSS/JS inline and the brand chrome baked in.

## Suggested template types

When templates are added, organize them by purpose:

| Filename | Use for |
|---|---|
| `cover.html` | Title page — whitepaper title, subtitle, author/date, hero image |
| `toc.html` | Table of contents — section list with page numbers |
| `intro-page.html` | Single-page introduction — sets up the thesis |
| `body-page.html` | Standard body page — headline + multi-column copy |
| `body-spread.html` | Body spread — for content that benefits from a wider layout |
| `data-page.html` | Chart / visualization-heavy single page |
| `pull-quote-page.html` | Emphasis page — large pull quote, attributed |
| `sidebar-callout-page.html` | Body page with a sidebar callout column |
| `conclusion-page.html` | Closing summary page |
| `references-page.html` | Citations, footnotes, further reading |
| `back-cover.html` | Final page — CTA, contact, brand mark |

Add new template types as needed. Keep filenames lowercase and hyphenated.

## Format

Whitepapers are typically text-dense and authoritative. Most pages are single A4 portrait, but spreads (1588 × 1123 px) are appropriate for data-heavy or visual content.

## Building a template

Until specific templates exist, work from the design system documented in `CLAUDE.md`:

1. Read `brand-shared/references/brand-guidelines.md` and `brand-shared/references/tone-of-voice.md`
2. Use the CSS variables from `brand-shared/tokens.css`
3. Apply the typography scale, spacing, and chrome rules from `CLAUDE.md`
4. Build at A4 dimensions with breathing room — whitepapers should not feel cramped despite being text-dense

A template is a complete working example — the user should be able to drop in copy and an image and have a finished page.
