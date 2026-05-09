# Brand-Shared

Shared brand resources used as a git submodule by the use-case-specific marketing template repos:

- `Presentations-Template`
- `Brochures-Template`
- `Social-Template`
- `Whitepapers-Template`
- *(and any future use-case repo)*

This repo holds the single source of truth for brand assets so that updating brand guidelines, tone of voice, or design tokens only needs to happen in one place.

---

## What's here

| File / folder | Purpose |
|---|---|
| `references/brand-guidelines.md` | Colour palette, typography, components, layout rules |
| `references/tone-of-voice.md` | Voice attributes, writing rules, pre-output checklist |
| `tokens.css` | CSS custom properties consumed by every slide / page |
| `tokens.json` | Machine-readable design tokens (colours, type scale, spacing) |
| `brand/` | Canonical logo SVGs (`logo-dark.svg`, `logo-light.svg`, `logo-mark.svg`) |

---

## Setup

This repo is consumed as a git submodule. In a use-case repo (e.g. `Presentations-Template`):

```bash
# First clone after creating from template:
git submodule update --init --recursive

# To pull the latest brand updates into the parent repo:
git submodule update --remote brand-shared
git add brand-shared
git commit -m "Update brand-shared to latest"
```

In each use-case repo, files are referenced from `brand-shared/...` (e.g. `brand-shared/references/tone-of-voice.md`).

---

## Updating the brand

1. Edit files in this repo directly
2. Commit and push
3. In each use-case repo, run `git submodule update --remote brand-shared` and commit the updated submodule pointer

---

## Setup for a new brand

If using these templates for a new brand:

1. Fork or copy this repo
2. Replace the placeholder content in `references/brand-guidelines.md` and `references/tone-of-voice.md` with your brand's actual content
3. Update `tokens.css` and `tokens.json` with your brand's colours, type scale, and spacing
4. Drop your logo SVGs into `brand/`
5. Update the submodule URL in each use-case repo's `.gitmodules` to point to your fork
