# AirAware AI: design direction

## Design read

Air quality data is uncertain, local and constantly changing. The interface should behave like a
careful environmental correspondent, not a dashboard that shouts. The landing page is therefore
editorial: generous negative space, documentary photography, hairline rules instead of stacked
cards, and one large number per screen. The product surface stays dense and practical because it is
a working instrument. The marketing surface sells the instrument by showing it honestly.

Dials: VARIANCE 7 (asymmetric hero, alternating feature compositions), MOTION 4 (reveal, parallax,
hover only), DENSITY 3 (calm, wide gutters, long line lengths capped at 68ch).

## Visual identity

Environmental Intelligence meets Premium Editorial SaaS.

- Warm ivory paper, deep forest ink, muted sage as the only soft accent.
- Photography carries the atmosphere. No gradients used as decoration, no glass panels, no blobs.
- One idea per section. If a section can be read in three seconds, it does not need another card.
- Data is always attributed, dated and labelled as modelled. Honesty is part of the brand.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#F7F7F2` | page background |
| `surface` | `#FFFFFF` | product cards, data plates |
| `line` | `#E2E2D8` | hairlines |
| `line-strong` | `#CBCDC0` | inputs, dividers |
| `ink` | `#242A27` | headings, body |
| `ink-soft` | `#4F5650` | body copy (7.03:1 on canvas) |
| `ink-muted` | `#5F665F` | micro-labels (5.50:1 on canvas) |
| `accent` | `#173D35` | brand, primary buttons (11.13:1 on canvas) |
| `accent-soft` | `#E9EEDD` | quiet fills |
| `sage` | `#C6D9A5` | highlight, dark-section accents (9.66:1 with ink) |

AQI colours stay on the existing scientific bands in `lib/aqi.ts` (green, amber, orange, red,
purple, crimson) and are never used as the only signal: every band is also written out.

## Typography

- **Manrope** for everything structural: navigation, headings, body, labels. Tight tracking on
  display sizes, generous line height in paragraphs.
- **Instrument Serif italic** for pull quotes and the closing statement only. Never inside a
  headline that also uses Manrope, never at body size.
- Data uses tabular numerals in Manrope, so numbers align without a third font family.
- Scale: display `clamp(2.9rem, 6.6vw, 6rem)` at 0.94 line height; section heading
  `clamp(2rem, 4vw, 3.25rem)`; body 16 to 18px at 1.7; micro-label 11px uppercase, 0.18em tracking.

## Section plan

1. **Navigation**: ivory bar, hairline base, wordmark left, anchor links with underline animation,
   forest CTA, text secondary action, disclosure mobile menu.
2. **Hero**: asymmetric 12-column split. Copy on ivory at left, documentary skyline bleeding off the
   right edge, live reading card overlapping the seam. Strong negative space above the headline.
3. **Live air intelligence**: one wide data plate, no card grid. Large AQI, city picker, US/CPCB
   toggle, four hairline-separated metrics, freshness and source disclosure. Honest failure state.
4. **Environmental storytelling**: full-bleed Kolkata maidan photograph, editorial headline, three
   short factual paragraphs, serif pull quote, and a plain list of what the product refuses to do.
5. **Product features**: six capabilities, six compositions. Wide live data plate, inverted dark
   assistant, hairline routine timeline, split indoor decision, interactive emissions bars, real
   seven-day chart. No repeated card grid.
6. **How it works**: three numbered steps on hairlines with a tall Mysuru street photograph beside
   them. Numbers, not icons.
7. **AI experience**: forest panel with the real grounding inputs listed, authentic assistant
   interface, real suggested questions, no invented answers or capabilities.
8. **Final CTA**: full-bleed forest, serif statement, single primary action to the dashboard.
9. **Footer**: brand, product navigation, about, data sources, GitHub, photography credits,
   disclaimer, copyright.

## Motion

- Section reveal: one IntersectionObserver adds `is-visible`; CSS transitions opacity and 18px rise.
- Image parallax: CSS `animation-timeline: view()` inside `@supports`, no scroll listeners.
- Nav underline: scaleX on hover and focus.
- Buttons lift 1px on hover.
- Hero entrance: three staggered CSS keyframe runs.
- All of it inside `prefers-reduced-motion: no-preference` or disabled by the global reduced-motion
  rule. No animation library, no layout shift.

## Photography

All local, optimised, credited in the footer.

- `hero-city-haze.jpg`: City in the Haze, MohammedSuman22, CC BY-SA 4.0, Wikimedia Commons.
- `story-maidan-haze.jpg`: Winter Maidan Morning Kolkata, SukantaBhowmik, CC BY-SA 4.0.
- `story-fog-street.jpg`: Misty Morning in Mysuru, Pradyumnakp, CC0.

## Out of scope

The dashboard and the five product pages keep their existing layout, copy and interactions. Only
shared tokens, chrome and the route move. No claims of certification, partnership or health
guarantee appear anywhere on the marketing surface.
