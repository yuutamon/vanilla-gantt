# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

vanilla-gantt — a **read-only Gantt chart showcase** built with **D3.js**. The point
is a single, good-looking "Mission Control" visualization that shows **plan vs actual**
(planned baseline vs actual schedule, with slip highlighted). It is a showpiece, not a
reusable library, and not an editor.

## Structure

The entire app is one self-contained file:

- `index.html` — the showcase. Inline data + inline JS. Loads D3 v7 from CDN
  (`d3-scale` / `d3-time` / `d3-axis` / `d3-zoom`) and renders an SVG Gantt with
  horizontal pan/zoom.

There is no build step, no package manager, no framework. **Open `index.html` in a
browser** (needs internet for the D3 CDN). The render script is wrapped in an IIFE.

## Deploy

`.github/workflows/deploy.yml` publishes `index.html` to **GitHub Pages** on every
push to `master` (static upload, no build — copies `index.html` into `_site/` and
deploys via `actions/deploy-pages`). Live at https://yuutamon.github.io/vanilla-gantt/.

## What it draws

- Two tracks per task: **planned (ghost outline, top)** and **actual (solid, bottom)**;
  horizontal offset = schedule slip.
- Slip rendered as a red overrun on the actual bar + `+Nd` label; header shows
  `N on plan / N slipped / worst slip +Nd`.
- Critical path (orange, glowing), dependency elbow lines, milestones (planned ghost
  diamond → actual filled diamond), a dashed TODAY line.
- d3-zoom is **X (time) only**: `rescaleX` updates bar x/width and the d3-axis; bar
  thickness and text stay constant. The left label column is fixed and the chart area
  is clipped so bars never spill into it. Zoom updates element attributes only — it does
  **not** rebuild `innerHTML`.

## Conventions

- Keep it a single file. No build tooling, no npm packaging, no framework.
- read-only: do not add editing/drag/inline-edit UI.
- Mission Control theme via CSS variables at the top of `index.html`.
- Degenerate cases are handled in the normalize step (empty data, zero time-span,
  invalid dates).
