# AirAware AI: design direction

## Design read

Air quality data is uncertain, local and constantly changing. The interface should behave like a
careful environmental correspondent, not a dashboard that shouts. The landing page is therefore
editorial: generous negative space, documentary photography, hairline rules instead of stacked
cards, and one large number per screen. The product surface stays dense and practical because it is
a working instrument. The marketing surface sells the instrument by showing it honestly.

Dials: VARIANCE 8 (asymmetric hero, six different feature compositions), MOTION 5 (entrance,
reveal, parallax, hover only), DENSITY 3 (calm, wide gutters, long line lengths capped at 68ch).

## Visual identity

Premium editorial technology meets environmental intelligence.

- Warm ivory paper, midnight charcoal ink, one electric cobalt accent. Cobalt is the only chroma
  used decoratively; everything else is paper, ink or a hairline.
- Photography carries the atmosphere. No decorative gradients, no glass panels, no blobs, no emoji.
- One idea per section. If a section can be read in three seconds, it does not need another card.
- Shape rule: marketing panels and data plates are square, interactive controls are pills. Product
  cards keep their existing 16px radius, so the instrument still feels like an app.
- Data is always attributed, dated and labelled as modelled. Honesty is part of the brand.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#F5F3EE` | page background |
| `surface` | `#FFFFFF` | product plates, live panels |
| `line` | `#E4E0D7` | hairlines |
| `line-strong` | `#CBC6BA` | panel edges, dividers |
| `ink` | `#171C24` | headings, body (15.42:1 on canvas) |
| `ink-soft` | `#454B55` | body copy (7.92:1 on canvas) |
| `ink-muted` | `#5C636D` | micro-labels, disclosures (5.47:1 on canvas) |
| `muted` | `#858991` | decorative hairlines and rules only, never body text (3.16:1) |
| `accent` | `#315CFF` | brand, primary buttons, links (4.61:1 on canvas, white on it 5.12:1) |
| `accent-soft` | `#DCE6FF` | quiet fills, the planner band, dark-surface accents |

AQI colours stay on the existing scientific bands in `lib/aqi.ts` (green, amber, orange, red,
purple, crimson) and are never used as the only signal: every band is also written out.

## Typography

- **Manrope** for everything structural: navigation, headings, body, labels, numerics.
- **Instrument Serif italic** for selected editorial lines only: the second half of the hero
  headline, the storytelling pull quote, the step numerals and the closing statement. Never at body
  size.
- Data uses tabular numerals in Manrope, so numbers align without a third font family.
- Scale: hero `clamp(2.7rem, 5vw, 4.5rem)` at 0.98 line height; section heading
  `clamp(2rem, 4vw, 3.4rem)`; body 15 to 17px at 1.7; micro-label 11px uppercase, 0.18em tracking.
- One eyebrow on the whole page (the live section). Everything else is a stacked heading.

## Section plan

1. **Navigation**: translucent ivory at the top, condensing to solid once the hero leaves view, via
   CSS `animation-timeline: scroll()` with a solid fallback. Anchor links with underline animation
   and an active indicator, cobalt "Explore Dashboard" CTA, staggered mobile menu.
2. **Hero**: asymmetric split. Copy on ivory at left, documentary skyline bleeding off the right
   edge, live reading panel overlapping the seam. Three text elements: headline, one sentence, two
   CTAs. The panel reads `/api/air`, never a hardcoded value, and says so if the request fails.
3. **Live air intelligence**: one wide data plate, no card grid. Large AQI, city picker, US/CPCB
   segmented control, four hairline-separated metrics, observation age, scale strip and source
   disclosure. Honest loading and failure states.
4. **Environmental storytelling**: full-bleed Kolkata maidan photograph with a stepped ivory text
   block, editorial headline, serif pull quote, three short factual paragraphs, and a plain list of
   what the product refuses to do.
5. **Product features**: six capabilities, six compositions. Wide live data plate, inverted charcoal
   assistant, soft-blue routine band, staggered indoor decision panels, interactive emissions bars,
   real seven-day chart. No repeated card grid, no numbered eyebrows.
6. **How it works**: three numbered steps on hairlines over a soft-blue band, closed by a full-bleed
   Mysuru street photograph.
7. **AI transparency**: light grounding panel listing the real inputs sent with every question, the
   limitations stated plainly, and a live link to the assistant.
8. **Final CTA**: the only full cobalt block on the page, serif statement, one primary action.
9. **Footer**: brand, product navigation, explore, data sources, GitHub, photography credits,
   disclaimer, copyright.

## Motion

- Section reveal: one IntersectionObserver adds `is-visible`; CSS transitions opacity and 20px rise.
- Image parallax: CSS `animation-timeline: view()` inside `@supports`, no scroll listeners.
- Nav condense: CSS `animation-timeline: scroll()`, no scroll listeners.
- Nav underline: scaleX on hover, focus and current page.
- Buttons lift 2px on hover and settle on press.
- Hero entrance: three staggered CSS keyframe runs; mobile menu links stagger by index.
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
guarantee appear anywhere on the marketing surface. On product surfaces only, a missing value is
shown with a dash; the marketing surface does the same with a plain hyphen.
