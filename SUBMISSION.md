# Submission Kit — Hack2Skill PromptWars Virtual Challenge 6

Ready-to-paste field values. Links below were deployed and verified, not assumed.

---

## Links

| Field | Value |
|---|---|
| **GitHub Repository** | https://github.com/codewithvishuuu/airaware-ai |
| **Live Demo** | https://airaware-ai-nine.vercel.app |
| **Demo Video** | _to be recorded — see `DEMO_SCRIPT.md`_ |

---

## Project title

**AirAware AI — Understand Your Air. Protect Your Everyday.**

---

## Short description (1–2 sentences)

An India-aware air quality assistant that shows US EPA and CPCB AQI side by side instead of
silently mixing them, then turns the reading into a personalised daily plan, indoor guidance and a
commute comparison — all grounded in live data fetched server-side by Gemini.

---

## Detailed description

### The problem

Air quality apps show a number and a colour. Three things go wrong after that.

**The wrong index reaches the user.** India's CPCB and the US EPA use different breakpoints and
different category names. The same air scores differently on each. Apps commonly serve the US
number and label it "AQI", so someone in Delhi reads "Moderate" when the CPCB equivalent says
something else — or the reverse. The mistake is not cosmetic; it changes whether a parent lets a
child play outside.

**A number is not a decision.** "Unhealthy for sensitive groups" does not answer *should I run at
7pm, should I open the windows, is the metro actually better than driving*. Most apps stop at the
number.

**The data is modelled, and apps rarely say so.** These are CAMS concentrations on an ~11 km grid,
not a monitor on your street. Hiding that is lying by omission.

### What AirAware AI does

- **Both indices, clearly separated.** US AQI comes from the provider applying the EPA table. CPCB
  AQI is computed in the app from the modelled concentrations using CPCB breakpoints, including the
  CO µg/m³ → mg/m³ conversion and the rule that at least three pollutants must be present, one of
  them PM2.5 or PM10. When that rule is not met the app shows `—` and names the unmet rule instead
  of inventing a number. Both are labelled "not an official CPCB station reading" — in the hero, in
  the footer, and inside the AI's own context block.
- **A dashboard that explains.** Pollutant breakdown with per-pollutant US sub-indices and the
  dominant pollutant marked, a seven-day hourly PM2.5 trend with India's 60 µg/m³ 24-hour standard
  drawn on it, and weather context that explains dispersion rather than pretending to forecast it.
- **A daily plan.** Five chronological actions generated from a five-question household profile.
  Every item states what to do, **why** (tied to the measured pollutant), the expected benefit, and
  **what it will not fix**. That last field is deliberate: advice without limits is marketing.
- **Indoor guidance.** A ventilate-or-seal call for today, with kitchen, dust and purifier specifics.
- **Commute impact.** Eight travel modes compared in kg CO₂e per week, with every emission factor
  printed underneath, because a savings claim without its assumption is a slogan.
- **Insights.** Threshold alert, 24 h versus previous-48 h trend, and a short guide to reading the
  numbers.

### How the AI is kept honest

The browser sends **coordinates, not measurements**. `/api/ai` re-fetches the readings itself,
builds the prompt from that server-side data, and validates the model's JSON against a zod schema.
A response that parses but has the wrong shape is discarded, never half-rendered. The model is
instructed to use only the supplied context, to cite the pollutant driving the reading, and to say
what is missing rather than guess.

### How failure is handled

Free-tier Gemini returns 503 under load constantly — measured at roughly one success in three
first attempts during testing. So the server tries the primary model, retries it once after 700 ms,
then falls back to a different model, capped at three calls. Timeouts are not retried (the budget is
already spent), 400s are not retried (they fail identically), 404s are retried on the next model
(that means a retired model name). If all three attempts fail the user gets an explanation and a
retry button. If the key is absent, the app says exactly that and every data feature still works.

### Verification

46 unit tests and 18 Playwright browser tests. The browser suite covers live Open-Meteo data, invalid
locations, a missing API key, Gemini 503s, the assistant refusing to invent an answer, the US/CPCB
toggle, stale readings, no horizontal overflow at 390/834/1440 px, and an axe accessibility scan on
all six pages. The first axe run found six real violations — two contrast failures, a malformed
definition list, and a link whose `aria-label` did not match its text — all fixed in the source
rather than suppressed in the test.

Production was verified after deploy, not just built: live readings served, chat and the structured
plan path both answered, and invalid requests rejected with the right status codes.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4.6 (App Router, Turbopack), React 19.3, TypeScript 5 |
| Styling | Tailwind CSS v4, hand-rolled SVG charts (no chart library) |
| AI | Google Gemini — `gemini-flash-lite-latest`, 3-attempt fallback chain |
| Validation | zod |
| Data | Open-Meteo Air Quality (CAMS), Forecast, Geocoding — all keyless |
| Testing | Vitest (46 unit), Playwright + axe-core (18 browser) |
| Hosting | Vercel |

---

## Key features (bullets, if the form wants them)

- US EPA AQI and CPCB AQI shown side by side with the difference explained, never conflated
- CPCB AQI computed locally with the CO unit conversion and the three-pollutant rule
- Pollutant breakdown with per-pollutant sub-indices and the dominant driver marked
- Seven-day hourly PM2.5 trend with the Indian 24-hour standard overlaid
- Gemini assistant grounded in a server-side fetch — the client cannot supply the numbers
- Five-action daily plan that states its own limitations
- Indoor ventilate-or-seal guidance
- Commute emissions comparison with every factor disclosed
- Explicit stale-data banner, missing-key disclosure and busy-model retry
- Responsive, keyboard navigable, zero serious axe violations across six pages

---

## Challenges and what was learned

1. **Two AQI standards are genuinely different, not two labels on one number.** Verified against the
   live API: the same Delhi air read US AQI 150 (*Unhealthy for sensitive groups*) and CPCB 151
   (*Moderate*). Relabelling either as the other would change what a user decides to do.
2. **A retired model name is a silent trap.** `gemini-2.5-flash-lite` returns 404 for newer keys
   while the rest of the API works. The fallback chain had to treat 404 as "try the next model",
   distinct from 400 "do not retry".
3. **Structured output is slow.** Asking for 6–7 plan items exceeded a 25 s per-call timeout.
   Bounding it to exactly five items, trimming `maxOutputTokens`, and raising the route's
   `maxDuration` made the structured path reliable.
4. **Accessibility regressions come back.** A purely visual polish pass reintroduced a contrast
   failure that the axe test caught on the next run. That is the argument for keeping the scan in
   the suite rather than running it once.
5. **A test found a real bug.** The AI client was retrying HTTP 400s, burning quota on every
   malformed request. The source was fixed rather than the assertion relaxed.

---

## Repository hygiene

- 54 tracked files, ~500 KB — well under the 10 MB limit
- `.env.local` gitignored, verified with `git check-ignore`
- No key material in tracked files or git objects (scanned for the Google API key pattern)
- `.env.example` documents both variables with no values

---

## Deliberate corner-cuts

Stated openly rather than hidden:

- The rate limiter is per-instance memory, so on serverless it is a speed bump rather than a hard
  quota. Marked with a `shortcut:` comment in `lib/rate-limit.ts`.
- Indoor air is never measured. Indoor advice is inference from outdoor conditions plus general
  principles, and the UI says so.
- Emission factors are published planning figures, not a lifecycle assessment.
- No push notifications; the threshold alert is evaluated when the Insights page loads, and the page
  says that.
