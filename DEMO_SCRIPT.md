# Demo Video Script

Target length: **2 min 30 s – 3 min**. Record at 1440×900, browser zoom 100 %, no bookmarks bar. Start on a hard refresh of `/` so the live reading is genuinely fresh.

The single most important thing to show is the **US / CPCB toggle** and the **AI grounding** — those are what separate this from a weather widget.

---

## 0:00 – 0:20 · Hook

**On screen:** Dashboard, Delhi loaded, AQI hero visible.

**Say:**

> "This is AirAware AI. Most air quality apps show you a number. The problem is, that number is usually the US EPA index — while the person reading it in Delhi is thinking in CPCB terms, and those are not the same thing."

**Do:** Click the **CPCB AQI** toggle. The large number changes from the US value to the computed CPCB value; the category name changes with it.

**Say:**

> "Same air, two standards, two different answers. Here they are side by side, and the app tells you which is which — and that neither is an official CPCB station reading."

---

## 0:20 – 0:50 · Dashboard depth

**On screen:** Scroll slowly through the dashboard.

**Say:**

> "Underneath: the full pollutant breakdown, each with its own US sub-index and a bar showing how far into the scale it sits. The dominant pollutant is marked, because that is the one that matters today."

**Do:** Scroll to the PM2.5 trend chart.

**Say:**

> "Seven days of hourly PM2.5, with India's 24-hour standard drawn at 60 micrograms — so you can see how far above the legal limit the city is sitting, not just whether it is 'bad'."

**Do:** Scroll to the weather card.

**Say:**

> "Temperature, humidity and wind, because low wind is why pollution accumulates overnight. And notice the copy: it explains dispersion rather than pretending to be a forecast."

---

## 0:50 – 1:20 · The daily plan

**Do:** Navigate to **Daily plan**. Change one or two selects — e.g. *Office, 9 to 6*, *Asthma or allergies*, *Metro or train*. Click **Build today's plan**. Let it generate.

**Say:**

> "This is the part I care about. It takes a five-question household profile and builds five actions for today, in order — morning, travel, outdoor time, indoor time, evening."

**Do:** Scroll through one recommendation card.

**Say:**

> "Each item has to say what to do, why — tied to the actual measured pollutant — what you get from it, and critically, what it will not fix."

**Do:** Point at the *Limits* line.

**Say:**

> "That last field is deliberate. An assistant that only tells you the upside is not giving advice, it is giving marketing."

---

## 1:20 – 1:50 · Grounding, which is the hard part

**Do:** Navigate to **Assistant**. Click the suggestion *"Which pollutant should I worry about most right now?"*

**Say:**

> "Every answer here is grounded in a server-side fetch. The browser sends coordinates — not numbers. The server fetches the readings itself, puts them in the prompt, and the model is instructed to say what is missing rather than guess."

**Do:** While it is generating, point at the reading chips above the thread.

**Say:**

> "So the model cannot be talked into reasoning about air quality that does not exist, which is the failure mode you get when you let the client supply the context."

---

## 1:50 – 2:15 · What happens when things break

**Say:**

> "The honest test of an AI feature is what it does when the model is down."

**Do:** Show the busy/error panel behaviour — either by triggering it live, or cut to a pre-recorded clip of the 503 state. Show the "Gemini is busy" panel with the retry button.

**Say:**

> "Free-tier Gemini returns 503 under load constantly. The server retries the same model once, then falls back to a different model. If all three attempts fail, you get this — an explanation and a retry, not a fabricated answer."

**Do:** Cut to the missing-key state briefly.

**Say:**

> "And if the key is not configured at all, the app says exactly that, and every data feature still works."

---

## 2:15 – 2:40 · Impact + close

**Do:** Navigate to **Impact**. Change the mode to *Metro*.

**Say:**

> "One more: compare a commute across eight modes, in kilograms of CO₂ per week, with every emission factor printed underneath — because a savings claim without its assumption is just a slogan."

**Do:** Scroll to the assumptions list.

**Say:**

> "All of it is responsive, all six pages pass an automated accessibility scan, and there are 46 unit tests and 18 browser tests behind it — including the failure paths you just saw."

**Do:** Return to the dashboard, hover the location picker.

**Say:**

> "AirAware AI. Understand your air, protect your everyday."

---

## Recording checklist

- [ ] `npm run build && npm run start` running (production, not dev — no HMR overlay)
- [ ] `.env.local` present so AI features actually work
- [ ] Browser zoom 100 %, no bookmarks bar, no other tabs visible
- [ ] Hard refresh before recording so the reading timestamp is current
- [ ] Close DevTools
- [ ] Have the 503 clip pre-recorded — do not gamble on Gemini cooperating on camera
- [ ] Capture at 1080p or 1440×900; upload to YouTube as **Unlisted** and use that link
- [ ] Verify the final video is under the challenge's length limit before submitting

## If Gemini is busy during recording

Do not fake it. Record the plan and assistant segments in a second take, or show the busy panel and use it as the honesty beat at 1:50. The panel is a feature, not a failure.
