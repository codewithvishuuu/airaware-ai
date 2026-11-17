# Research Notes

What was investigated before writing code, what the findings changed, and what remains uncertain. Every claim below was checked against a live endpoint or the Next.js 16.4.6 documentation bundled in `node_modules/next/dist/docs/` during this build.

---

## 1. The index problem: US AQI vs CPCB AQI

### Finding

The US EPA and India's Central Pollution Control Board both map pollutant concentrations onto a 0–500 scale, but **use different breakpoints and different category names**. They are not interchangeable, and the same air produces different numbers.

| System | Categories | PM2.5 basis |
|---|---|---|
| US EPA | Good, Moderate, Unhealthy for sensitive groups, Unhealthy, Very unhealthy, Hazardous | 24 h, breakpoints from 0–500 µg/m³ |
| CPCB | Good, Satisfactory, Moderate, Poor, Very poor, Severe | 24 h, breakpoints 0–500 µg/m³ but shifted |

The two systems also disagree about which pollutants participate and how:

- CPCB requires **at least three pollutants**, one of which must be **PM2.5 or PM10**. The overall AQI is the **maximum sub-index**.
- CPCB expresses CO in **mg/m³**, while Open-Meteo reports CO in **µg/m³**, so a unit conversion is mandatory before scoring. Getting this wrong inflates the CO sub-index by 1000×.

### Decision

Serve both, side by side, each labelled:

- **US AQI** is consumed directly from Open-Meteo, which already applies the EPA table.
- **CPCB AQI** is computed locally in `lib/aqi.ts` from the modelled concentrations, applying the CPCB table, the CO conversion, and the three-pollutant rule.

### Why not just relabel the US number as CPCB?

Because it would be wrong, and the error is not small. In the live Delhi reading captured during this build:

| Metric | Value |
|---|---|
| US AQI | 150 — *Unhealthy for sensitive groups* |
| CPCB AQI (computed) | 151 — *Moderate* |

Same air, different category name at nearly the same number. A user told "Unhealthy" and a user told "Moderate" make different decisions. Relabelling would also be a false claim of regulatory authority.

### Consequence for the UI

- The hero has an explicit US / CPCB toggle, so the user chooses the standard rather than receiving a silent default.
- When CPCB cannot be computed, the app shows `—` and names the unmet rule. It never falls back to the US number under a CPCB label.
- The disclosure "not an official CPCB station reading" appears in the hero, the footer, and the AI's context block.

---

## 2. Data source selection

### Evaluated

| Source | Verdict |
|---|---|
| Open-Meteo Air Quality (CAMS) | **Chosen.** Free, no key, hourly, per-pollutant concentrations *and* per-pollutant US sub-indices |
| CPCB official station feed | No stable public API; would imply official authority the app cannot support |
| IQAir / AQICN | Requires a key, restrictive free tier |
| OpenWeather Air Pollution | Requires a key; coarser pollutant set |

### Verified against the live API

Request:
```
GET https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude=28.6139&longitude=77.2090
  &current=us_aqi,us_aqi_pm2_5,...,pm2_5,pm10,nitrogen_dioxide,...
  &hourly=pm2_5&past_days=7&timezone=auto
```

Response (200), key fields:

```json
{ "current": { "time": "2026-11-17T18:30", "us_aqi": 150, "us_aqi_pm2_5": 150,
  "us_aqi_pm10": 53, "us_aqi_nitrogen_dioxide": 41, "us_aqi_ozone": 58,
  "pm2_5": 75.7, "pm10": 77.8, "nitrogen_dioxide": 83.7,
  "sulphur_dioxide": 37.8, "carbon_monoxide": 2372, "ozone": 34,
  "european_aqi": 73 } }
```

This confirmed the assumption the pollutant breakdown depends on: **per-pollutant US sub-indices exist**, so each tile can show its own contribution without the app reimplementing the EPA table for every gas.

### Two API details that cost time

1. **The weather endpoint is `/v1/forecast`**, not `/v1/weather`. The latter 404s. `/v1/forecast` with `current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m` returns the same location's weather in one call.
2. **`past_days=7&forecast_days=0`** is what yields a clean seven-day history without future rows polluting the trend chart.

### Weather is optional, air quality is not

The two fetches run under `Promise.allSettled`. A weather failure degrades the weather card; a failure of the air quality call fails the page. This mirrors the actual dependency: wind explains dispersion, but it is not the reading itself.

---

## 3. Gemini model selection and capacity behaviour

### Verified

| Model | Result |
|---|---|
| `gemini-flash-lite-latest` | 200. Working. Resolves to `gemini-3.5-flash-lite` |
| `gemini-2.5-flash-lite` | **404** — "no longer available to new users. Please update your code to use models/gemini-3.5-flash-lite" |
| `gemini-flash-latest` | 200. Used as the distinct fallback |

### The 503 problem, measured

Free-tier capacity errors are **not rare**. Observed during manual testing of `/api/ai` in plan mode:

```
attempt 1  FAIL   5.2s  busy
attempt 2  FAIL  13.2s  busy
attempt 3  OK     4.4s  5 items
```

Roughly a one-in-three success rate on a first attempt at that moment. This is an upstream property, not a bug in the client, so the design had to absorb it rather than "fix" it.

### Resulting strategy

```
sequence = [primary, primary, fallback].slice(0, 3)
```

- **Retry the same model once** after 700 ms. Capacity blips clear in seconds; switching models immediately wastes the model the prompt was tuned for.
- **Then switch** to a genuinely different model.
- **Cap at 3 calls.** Unbounded retries turn a 4-second answer into a 40-second one and burn quota.
- **Never retry a timeout** — the per-call budget is already spent, so a retry doubles worst-case latency.
- **Never retry a 400** — a malformed request fails identically.
- **Do retry a 404** — that signals a retired model name, so the next model is the correct response.

### Latency budget

Structured output with `responseSchema` is slower than free text because the model must satisfy the JSON shape. An early version asked for 6–7 plan items and exceeded a 25 s per-call timeout.

| Change | Effect |
|---|---|
| Plan items: 6–7 → exactly 5 | Bounded the output |
| `maxOutputTokens`: 1600 → 1400 | Less headroom for rambling |
| Per-call timeout: 25 s → 30 s | Room for the schema |
| `maxDuration = 50` on the route | Two attempts fit inside the platform limit |

---

## 4. Next.js 16.4.6

The project's `AGENTS.md` warns that this version differs from training data, so the bundled docs were read before writing route handlers or config.

### Findings that changed the implementation

| Topic | Finding | Action |
|---|---|---|
| `cacheComponents` | Scaffold enabled it. It requires `<Suspense>` around anything that fetches | Removed — the app fetches client-side through its own API routes |
| `partialPrefetching` | Scaffold enabled it | Removed for the same reason |
| Turbopack | Default bundler | Kept; `turbopack.root` set to silence a lockfile warning caused by a `pnpm-lock.yaml` above the repo |
| Route handlers | Web `Request`/`Response`, `dynamic = "force-dynamic"` for per-request data | Used for all three API routes |
| Async request APIs | Params/search are async in 16 | Avoided entirely by keeping location in client context instead of URL params |

### Why location is not in the URL

Reading `useSearchParams` in a client component forces a `<Suspense>` boundary or a dynamic render, which complicates every page for no user-visible gain. A `LocationProvider` context backed by `localStorage` keeps the place across navigation, survives reloads, and keeps the pages simple.

---

## 5. Accessibility findings

Automated axe scans across all six pages initially reported **six serious or critical violations**. Each was fixed at the source rather than silenced:

| Violation | Cause | Fix |
|---|---|---|
| `color-contrast` ×2 | Text at 60–80 % opacity on tinted alert backgrounds | Full-opacity text colours |
| `color-contrast` | Muted eyebrow text on a tinted (non-white) guidance card | Darkened to `ink-soft` |
| `definition-list` | `<div>` wrappers directly inside `<dl>` | Removed the `<dl>` — the weather rows are not a definition list |
| `dlitem` ×6 | `<dt>`/`<dd>` nested one level too deep inside a `<dl>` | Removed with the list |
| `label-content-name-mismatch` | Logo link had `aria-label="AirAware AI home"` but visible text "AirAware AI" | Dropped the redundant label; the visible text is the accessible name |

The visual polish pass then reintroduced one contrast failure (a tinted card removed the white backing behind muted text), which the suite caught on the next run. This is the argument for keeping the axe test in CI rather than treating it as a one-time audit.

---

## 6. Testing approach

The brief required verifying that the app **works**, not that it builds. That shaped the split:

- **Unit tests** cover the pure logic where correctness is checkable exactly: breakpoint boundaries, the CO unit conversion, the three-pollutant rule, fallback sequencing, schema rejection.
- **Browser tests** cover what unit tests cannot: real Open-Meteo data arriving, error panels appearing for the right HTTP status, the US/CPCB toggle changing the displayed number, overflow at three viewports, and axe.
- **AI failures are mocked, never live**, in the browser suite. A test that depends on Gemini returning 503 would be flaky by design. The fallback chain itself is unit-tested with stubbed responses for each status code.

One test found a real bug: the AI client retried HTTP 400s, which would have burned quota on every malformed request. The test that asserted "does not retry a non-retryable client error" failed, and the source was fixed rather than the test relaxed.

---

## 7. Remaining uncertainty

Stated plainly, since the app's whole position is that uncertainty should be disclosed:

- **CAMS grid resolution is ~11 km.** A street canyon next to traffic can read far worse than the grid cell.
- **CPCB breakpoint table accuracy** was transcribed from the published CPCB criteria. The app's values were checked against known worked examples but not against a live CPCB station feed, because no stable public feed exists.
- **Free-tier Gemini capacity** is outside the app's control. The chain reduces the failure rate; it cannot eliminate it. The UI surfaces a busy state honestly when all three attempts fail.
- **Indoor air is never measured.** All indoor guidance is inference from outdoor conditions plus general principles.
- **The rate limiter is per-instance.** On serverless, concurrent instances each hold their own bucket. It is a speed bump against accidental loops, not an abuse defence.
