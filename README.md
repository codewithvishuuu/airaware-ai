# AirAware AI

**Understand your air. Protect your everyday.**

An air-quality assistant built for Indian cities, where the gap between an index number and a decision — *do I run now, do I open the windows, is the metro actually better* — is the whole problem.

Live demo: **https://airaware-ai-nine.vercel.app**

---

## The problem this solves

Most AQI apps show a number and a colour. Three things go wrong after that:

1. **The wrong index.** India's regulator (CPCB) and the US EPA use different breakpoints. The same air scores differently on each. Apps routinely serve a US number and label it "AQI", which leads people to misjudge their own risk.
2. **No decision.** "Unhealthy for sensitive groups" does not tell a parent whether the 7am school walk is fine.
3. **No honesty about the data.** These are modelled concentrations on an ~11 km grid, not a monitor on your street. An app that hides that is lying by omission.

AirAware AI addresses all three: both indices side by side with the difference explained, a plan built around *your* day, and a persistent disclosure of what the data actually is.

---

## What it does

| Page | What you get |
|---|---|
| **Landing** `/` | Editorial marketing page: live modelled reading in the hero, a live data plate, environmental storytelling, six product previews fed by the same endpoint, and the assistant's grounding inputs |
| **Dashboard** `/dashboard` | AQI hero with a US/CPCB toggle, pollutant breakdown, seven-day PM2.5 trend, weather context, and an on-demand AI briefing |
| **Assistant** `/assistant` | Multi-turn chat grounded in the live reading. Suggested questions included |
| **Daily plan** `/plan` | Five chronological actions for today, from a five-question household profile |
| **Indoor** `/indoor` | A ventilate-or-seal call for today, plus kitchen, dust and purifier guidance |
| **Impact** `/impact` | Compare a commute across eight travel modes in kg CO₂e, with every emission factor printed |
| **Insights** `/insights` | Threshold alert, 24 h vs previous-48 h trend, and how to read the numbers |

Every AI recommendation carries four fields: what to do, **why** (tied to the measured pollutant), expected benefit, and **limitations** — what it will not fix.

---

## India-aware by design

This is the requirement the app is built around, so it gets its own section.

**US AQI** comes from Open-Meteo, which applies the EPA breakpoint table to CAMS modelled concentrations. It is labelled as such everywhere it appears.

**CPCB AQI** is computed in this app (`lib/aqi.ts`) from the modelled concentrations using the CPCB breakpoint table, including the CO unit conversion (µg/m³ → mg/m³). It follows the CPCB rule that at least three pollutants must be present, one of them PM2.5 or PM10. When that rule is not met, the app returns `null` and says so — it does not invent a number.

Both are labelled **"not an official CPCB station reading"**, because they are not. That disclosure appears in the hero, in the footer, and in the AI prompt context itself, so the model cannot claim otherwise.

The CPCB bands (Good → Severe) and US bands (Good → Hazardous) are separate tables with separate guidance text, because the categories do not mean the same thing at the same number.

---

## Architecture

```
Browser (client components)
   │
   ├── LocationProvider ......... place in localStorage, refetches /api/air on change
   │
   ├── GET  /api/air ............ Open-Meteo air quality + weather, computes CPCB AQI
   ├── GET  /api/cities ......... Open-Meteo geocoding, 24 h cache
   └── POST /api/ai ............. re-fetches readings server-side, then calls Gemini
                                      │
                                      └── Gemini fallback chain (3 attempts max)
```

**The browser never supplies air quality numbers to the AI.** `/api/ai` takes coordinates and a place name, fetches the readings itself, and builds the prompt from that server-side data. A malicious or buggy client cannot make the model reason about invented pollution.

### Gemini configuration

- Primary model: `gemini-flash-lite-latest` (override with `GEMINI_MODEL`)
- Fallback: `gemini-flash-latest`
- Attempt sequence: primary, primary again after 700 ms, then the fallback model — capped at three calls
- Free-tier 503s ("high demand") are frequent and transient. The same-model retry exists precisely for that.
- Timeouts are **not** retried: the per-call budget is already spent
- 400s are **not** retried: a malformed request fails the same way twice
- 404s **are** retried on the next model: that means a retired model name
- Gemini response envelopes and structured output are validated with zod. A response that parses but has the wrong shape is discarded, never half-rendered

---

## Failure behaviour

The app is judged on what it does when things break, so each failure has a deliberate response.

| Failure | What the user sees |
|---|---|
| Upstream air quality 5xx | "Could not load readings for {city}" + retry |
| Upstream air quality timeout | Same, with a timeout message |
| Invalid coordinates | 400 `invalid_location`, surfaced as an error card |
| Weather call fails | Dashboard still renders; weather card says data was unavailable rather than showing a guess |
| Reading older than 3 h | Amber stale banner on the dashboard and insights |
| `GEMINI_API_KEY` missing | "Live AI is not configured" — explicitly states no answer was generated |
| Gemini 503 / 429 | "Gemini is busy" + retry button; nothing invented |
| Gemini timeout | "The model timed out" after 30 s rather than hanging |
| Malformed / wrong-shape JSON | `bad_output` — discarded, not rendered |
| Rate limit exceeded | 429 with `Retry-After`, 12 requests/minute per client |
| CPCB not computable | Says which rule was not met, shows `—` |

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then add your Gemini key
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes, for AI features | Google AI Studio key. Server-side only — never exposed to the browser |
| `GEMINI_MODEL` | No | Defaults to `gemini-flash-lite-latest` |

Air quality, weather and geocoding need **no key**. Without `GEMINI_API_KEY` the data features work fully and the AI panels explain that they are not configured.

`.env.local` is gitignored. `.env.example` documents the shape and contains no values.

---

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # 46 unit tests (vitest)
npm run test:e2e   # 18 browser tests (playwright) — build first
```

Playwright reuses an existing server on port 3000 if one is running, otherwise starts the production build itself.

---

## Testing

**Unit — 46 tests (vitest)**

- US EPA breakpoints at every boundary, clamping of out-of-range input
- CPCB: interpolation inside a band, worst-sub-index selection, the CO unit conversion, the "no particulates" and "fewer than three pollutants" rejections, the 500 ceiling
- Air: payload mapping, stale detection, weather-failure resilience, 5xx and network failures, coordinate rejection before any fetch
- AI: missing key never calls the network, 503 → same-model retry → fallback model, non-retryable 400, retired-model 404, malformed JSON, schema violations, prompt context containing the measured values *and* the CPCB caveat, missing values stated rather than omitted
- Impact: distance clamping, linear scaling, baseline correctness
- Rate limit: window, blocking, per-client buckets

**Browser — 18 tests (playwright)**

- Live data: real Open-Meteo readings render, AQI is within 0–500, city search returns geocoded places
- Failure states: invalid location, missing API key, Gemini 503, assistant refusing to invent an answer
- Data honesty: US/CPCB toggle shows the computed value and the caveat; stale readings flagged
- Responsive: no horizontal overflow at 390 px, 834 px, 1440 px; navigation reachable on a phone
- Accessibility: axe scan on all six pages, zero serious or critical violations

Accessibility was not assumed — the first axe run found six real violations (two contrast failures on tinted backgrounds, a malformed definition list, and a link whose `aria-label` did not match its text). All were fixed in the source, not suppressed in the test.

---

## Project structure

```
app/
  api/air/route.ts        readings + computed CPCB AQI
  api/cities/route.ts     geocoding proxy
  api/ai/route.ts         validated AI gateway, rate limited
  page.tsx                landing page
  dashboard/page.tsx      dashboard
  assistant|plan|indoor|impact|insights/page.tsx
components/               hero, pollutants, trend, weather, AI states, header, reading chips
components/landing/       landing data views, feature previews, reveal observer
lib/
  aqi.ts                  US + CPCB bands, CPCB computation
  air.ts                  Open-Meteo clients, stale detection
  ai.ts                   Gemini client, fallback chain, prompts, schemas
  ai-client.ts            grounded /api/ai request payload
  format.ts               observed-at formatting shared by hero and landing
  health-guidance.ts      tier mapping and advice copy
  history.ts              PM2.5 series, averages and trend direction
  http.ts                 API error envelope, response reader, query parsing
  impact.ts               deterministic emission factors
  location.tsx            place state + fetch lifecycle
  rate-limit.ts           per-client token bucket
  site.ts                 shared site metadata constants
  types.ts                shared domain and API response types
  use-ai.ts               AI request hook
tests/                    vitest
e2e/                      playwright + axe
```

---

## Data sources and honest limits

- **Air quality:** Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo — modelled, ~11 km resolution, hourly
- **Weather:** Open-Meteo forecast API
- **Geocoding:** Open-Meteo geocoding
- **AI:** Google Gemini

Known limits, stated rather than hidden:

- Modelled values can differ materially from a monitor on your street, especially near traffic
- CPCB AQI here is computed, not read from a station
- The rate limiter is per-instance memory on serverless, so it is a speed bump rather than a hard quota (marked with a `shortcut:` comment in `lib/rate-limit.ts`)
- Indoor air is never measured. Indoor advice is derived from outdoor conditions only
- Emission factors are published planning figures, not a lifecycle assessment
- Nothing here is medical advice

---

## Licence

MIT. Built for Hack2Skill PromptWars Virtual Challenge 6.
