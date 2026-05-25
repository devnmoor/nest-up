# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestUp is a single-file static landing page (`index.html`). There is no build step, no package manager, and no bundler — edit the file and refresh the browser.

**Run locally:**
```bash
open index.html
# or with a live-reload server:
python3 -m http.server 8080
```

## Stack

- **Tailwind CSS** via CDN (`cdn.tailwindcss.com`). An inline `tailwind.config` block immediately after the CDN `<script>` tag extends the theme with two custom color scales: `nest` (orange) and `sage` (green).
- **Google Fonts** (`Inter`) loaded via `<link>`.
- **No JavaScript** — all interactivity is CSS-only (hover states, smooth scroll, float keyframe animation).
- **Custom CSS** lives in a single `<style>` block in `<head>`: `.gradient-hero`, `.card-hover`, `.pill-badge`, `.feature-icon`, `.float`, `.comparison-check/cross`.

## Design System

| Token | Value | Use |
|---|---|---|
| `nest-500` | `#ff6d1a` | Primary brand (buttons, accents) |
| `nest-600` | `#f0500f` | Hover state for primary buttons |
| `sage-500` | `#668260` | Secondary / success / checkmarks |
| `nest-50/100` | pale peach | Pill badge backgrounds |

Container pattern: `max-w-6xl mx-auto px-6` for all sections except pricing (`max-w-4xl`).

### ⚠️ Tailwind CDN Custom Color Caveat

The Tailwind CDN can have a timing issue where custom `nest-*` and `sage-*` color classes silently fail to apply (resulting in a transparent/white background). Any element where a missing background would make text illegible **must** include an inline `style` fallback:

```html
<!-- correct pattern for critical colored elements -->
<a class="bg-nest-500 text-white ..." style="background-color: #ff6d1a; color: #ffffff;">
```

This fallback is already applied to: the header CTA button, the hero CTA button, the NestUp Plus pricing card, and the bottom CTA button.

## SVG Icon Sprite

All icons are Lucide icons, inlined as `<symbol>` elements inside a hidden `<svg>` at the very top of `<body>`. Reference them anywhere in the page with:

```html
<svg class="w-5 h-5 text-nest-500"><use href="#ic-house"/></svg>
```

Available IDs: `ic-house`, `ic-sparkles`, `ic-graduation-cap`, `ic-package`, `ic-shopping-cart`, `ic-wallet`, `ic-circle-check`, `ic-tag`, `ic-clipboard-list`, `ic-banknote`, `ic-rocket`, `ic-bed`, `ic-utensils`, `ic-briefcase`, `ic-building-2`, `ic-key-round`, `ic-lightbulb`, `ic-target`, `ic-heart`, `ic-droplets`, `ic-monitor`, `ic-box`, `ic-triangle-alert`, `ic-arrow-down`, `ic-arrow-up`, `ic-check`, `ic-x`, `ic-star`.

To add a new icon, copy the SVG path data from [lucide.dev](https://lucide.dev), wrap it in a `<symbol id="ic-name" viewBox="0 0 24 24" ...>` element inside the hidden sprite block, then use `<use href="#ic-name"/>`.

## Page Structure & Anchor IDs

Sections in document order, with their anchor `id` for nav links:

| Section | `id` |
|---|---|
| Hero / entry point | `#start` |
| How It Works (4-step) | `#how-it-works` |
| 6 Move-In Types grid | `#move-in-types` |
| Core Features (5 features) | `#features` |
| Competitive comparison table | *(no anchor)* |
| Pricing (Free + Plus) | `#pricing` |
| Final CTA | *(no anchor)* |
| Footer | *(no anchor)* |

The sticky header nav links to `#features`, `#how-it-works`, `#move-in-types`, and `#pricing`. Smooth scroll is enabled globally via `html { scroll-behavior: smooth; }`.
