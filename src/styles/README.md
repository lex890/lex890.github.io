# Styling system

Light-only "game UI" look: chunky rounded cards, black number pills, outlined
section numerals, slanted frames and a holographic gradient on hover. There is
no dark mode. The full spec is in `PORTFOLIO_PLAN.md` §7. Every component is in use on
the home page, so that's the place to see them live.

## Two stylesheets, one set of tokens

| File | What it is | Who uses it |
|---|---|---|
| `global.css` | Tailwind v4 entry + shadcn's `@theme` mapping. **No colors.** | shadcn components in `src/components/ui/` only |
| `global.scss` | Our global styles; pulls in the partials below | Everything else |

`BaseLayout.astro` imports `global.css` **first**, then `global.scss`. They
stay separate because Sass can't compile Tailwind v4's CSS-first directives.

Rules:

1. **No Tailwind classes in our own components.** Tailwind exists only so
   shadcn works. Our components use a `*.module.scss` next to the component.
2. **Colors exist only in `_tokens.scss`.** shadcn's variables (`--primary`,
   `--background`, …) are defined there as references to our tokens, so both
   systems always match. Don't add colors without updating the plan.
3. **Every partial starts with a comment block** explaining its contents.

## Partials

| Partial | Contents |
|---|---|
| `_tokens.scss` | CSS custom properties on `:root`: colors, `--holo`, radius, spacing, motion, font, and the shadcn mapping |
| `_mixins.scss` | `bp()`, `bp-down()`, `container`, `focus-ring`, `visually-hidden`, `reduced-motion`, `cut-corner()`, `slant()`, `diamond()`. Emits no CSS |
| `_typography.scss` | Element defaults (in `@layer base`) and the `.t-*` type classes |
| `_effects.scss` | `.hf`, `.hf-dark`, `.hr`, `.lift`, `.press`, the `holo-shift` keyframes, reduced-motion overrides |
| `_shadcn.scss` | Shape/size overrides for shadcn components, targeted by their `data-slot` attribute |
| `_print.scss` | `@media print` rules for `/cv`: A4 page, hides `.no-print` (nav, buttons), no page breaks inside entries. Loaded by `PrintLayout` only |

## Writing a component style

```scss
// src/components/cards/Thing.module.scss
@use 'mixins' as *;   // resolved through the Sass loadPath in astro.config.mjs

.thing {
  padding: var(--space-5);
  border-radius: var(--r-card);
  background: var(--card);

  @include bp(md) { padding: var(--space-6); }
}
```

```astro
---
import { hoverClass } from '@/lib/hover';
import s from './Thing.module.scss';
---
<div class:list={[s.thing, hoverClass('ring')]}>…</div>
```

Global classes can be reused inside a module with
`composes: t-label from global;`.

## Hover treatments (pure CSS)

Each element gets **one** of these, usually through a component's `hover` prop
(`src/lib/hover.ts`):

| `hover` prop | Classes | Use on | Effect |
|---|---|---|---|
| `fill` | `.hf` | Filled elements with dark text (lime, yellow, gray) | Background fades to the shimmering holo gradient |
| `fill-dark` | `.hf .hf-dark` | Black / violet elements with white text | Same, plus all text, icons and borders turn ink; `.rule` dividers and `.wm` watermarks darken |
| `ring` | `.hr` | White elements (cards, tiles, secondary buttons) | 3px holo outline fades in |
| `none` | — | — | — |

- If you put `.hf-dark` on an element, mark any divider with `class="rule"` and
  any faded watermark with `class="wm"` so they adapt too. Its color overrides
  use `!important` on purpose: it's a state utility that must beat component
  colors.
- `.hf` needs the element's own background to be set. Its `::before` layer
  paints over that background but under the content.
- `.hr` uses `::after`. Don't combine it with `clip-path` (cut corners/slants),
  because the ring would be clipped.
- All effects also trigger on `:focus-visible`, which additionally shows a 3px
  violet ring with a 3px offset.
- `.lift` (cards) and `.press` (buttons) add movement. Under
  `prefers-reduced-motion: reduce` the shimmer and all movement stop; the color
  fades remain.

## shadcn components

Never hand-edit `src/components/ui/`. To restyle a shadcn component, target its
`data-slot` attribute in `_shadcn.scss`. For buttons, use
`src/components/game/ActionButton.tsx`, which wraps shadcn's `Button` with our
tones (`primary` violet, `secondary` white, `ink` black) and the right hover
classes.

## Name clash to know about

shadcn's `--muted` means a subtle **background**; ours is a **text** color.
`global.css` therefore points Tailwind's `muted` colors at `--sc-muted` and
`--sc-muted-foreground` (defined in `_tokens.scss`) instead of `--muted`.
