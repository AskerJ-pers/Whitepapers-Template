# Brand Guidelines

> **TODO:** Replace this file with your brand guidelines. The sections below show the structure the system expects — fill each one in for your brand.

---

## Colour palette

Define your primary and supporting colours here. Map them to the CSS variables in `tokens.css`:

| Variable | Hex | Use |
|---|---|---|
| `--blue` | `#______` | Primary accent — headlines, CTAs, icons, progress bar |
| `--blue-dark` | `#______` | Closing slide background only |
| `--purple` | `#______` | Secondary accent — use sparingly |
| `--bg-grey` | `#______` | Slide and panel backgrounds |
| `--bg-light-blue` | `#______` | Info cards, emphasis |
| `--text-grey` | `#______` | Body text |
| `--border` | `#______` | Card borders and dividers |

**Colour rules:**
- Light mode only — white or `--bg-grey` slide backgrounds everywhere except the closing slide
- Primary colour (`--blue`) carries all accent duty
- No semantic colour — never use green, orange, or red for status

---

## Typography

Font: [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts (weights 300, 400, 500, 600, 700).

| Style | Size | Weight | Colour |
|---|---|---|---|
| Hero headline | `clamp(36px, 5vw, 60px)` | 300 | `--black` |
| Section headline | `clamp(24px, 3vw, 40px)` | 300 | `--black` |
| Subtitle | `18–24px` | 300 | `#808080` |
| Body | `14–15px` | 400 | `--text-grey` |
| Card title | `15px` | 600 | `--black` |
| Stat number | `clamp(28px, 4vw, 48px)` | 300 | `--blue` |
| Overline | `10px` | 600 | `--blue` |

**Typography rules:**
- Headlines use sentence case only — first word and proper nouns capitalised, nothing else
- Never bold a headline
- Body text is `--text-grey`, never black
- Subtitle colour is always `#808080` — never `--text-grey`

---

## Logo

Three SVG variants are required — see `brand/README.md` for details.

---

## Slide dimensions and layout

- Fixed: **1280 × 720px** (16:9)
- Content padding: `56px 72px 140px` — the 140px bottom padding is non-negotiable
- Logo: bottom-left, `bottom: 52px`, `left: 72px`
- Nav buttons: bottom-right, `bottom: 48px`, `right: 72px`
- Progress bar: top, 3px, primary colour

---

## Components

See `components/` for isolated HTML fragments of each component pattern.
