# Brand — Logo Files

Place your canonical logo SVGs here. The system expects three variants:

| File | Use |
|---|---|
| `logo-dark.svg` | Dark wordmark — for use on white and light-grey backgrounds |
| `logo-light.svg` | White wordmark — for use on dark/coloured backgrounds (closing slide) |
| `logo-mark.svg` | Mark only (no wordmark) — optional, for favicon or compact use |

The logo is embedded inline in every slide via a `<template id="logo-svg">` element and cloned into `.logo` divs at runtime. Replace the placeholder in the template files with your actual SVG paths.

**Important:** Logo dimensions in `tokens.json` default to `186 × 32px`. Adjust `--logo-w` and `--logo-h` in `tokens.css` to match your actual logo proportions.
