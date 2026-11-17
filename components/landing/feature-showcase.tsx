"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocation } from "@/lib/location";
import { POLLUTANT_KEYS, POLLUTANT_META } from "@/lib/aqi";
import { computeImpact, formatKg, TRAVEL_MODES } from "@/lib/impact";
import { BandPill } from "@/components/pollutant-grid";
import { TrendChart } from "@/components/trend-chart";
import { ScaleStrip } from "@/components/aqi-hero";
import { ArrowIcon, SparkIcon } from "@/components/icons";

function FeatureCopy({
  index,
  label,
  title,
  body,
  href,
  cta,
  tone = "light",
}: {
  index: string;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div>
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
          dark ? "text-sage" : "text-ink-muted"
        }`}
      >
        <span className="tnum">{index}</span> {label}
      </p>
      <h3
        className={`mt-4 max-w-[20ch] text-[clamp(1.65rem,2.7vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em] ${
          dark ? "text-canvas" : "text-ink"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-4 max-w-md text-[15px] leading-[1.7] ${
          dark ? "text-canvas/70" : "text-ink-soft"
        }`}
      >
        {body}
      </p>
      <Link
        href={href}
        className={`group mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
          dark ? "text-canvas" : "text-accent"
        }`}
      >
        <span className="link-underline">{cta}</span>
        <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function PreviewLabel({ children, right }: { children: React.ReactNode; right?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        {children}
      </p>
      {right ? <p className="text-[11px] text-ink-muted">{right}</p> : null}
    </div>
  );
}

function Unavailable({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-line-strong px-5 py-8">
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}

export function FeatureShowcase() {
  const { air, place, loading } = useLocation();
  const [distance, setDistance] = useState(7);
  const [mode, setMode] = useState("car");

  const pm25 = air?.pollutants.pm2_5.value ?? null;
  const ventilate = pm25 != null ? pm25 < 30 : null;

  const impact = computeImpact({ oneWayKm: distance, tripsPerWeek: 10, mode });
  const compareIds = ["car", "bus", "metro", "cycle"];
  const compare = compareIds
    .map((id) => impact.find((row) => row.mode.id === id))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));
  const baseline = Math.max(...compare.map((row) => row.weeklyGrams), 1);
  const selected = TRAVEL_MODES.find((item) => item.id === mode) ?? TRAVEL_MODES[0];

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-24 border-t border-line"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-8" data-reveal>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
              The product
            </p>
            <h2
              id="features-heading"
              className="mt-5 max-w-[20ch] text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink"
            >
              Six ways to work with the same reading.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            One live data source, six different jobs. Nothing here is a mock screenshot: the panels
            below read the same endpoint as the product.
          </p>
        </div>

        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-24">
          <article
            className="grid items-center gap-10 border-t border-line pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16"
            data-reveal
          >
            <FeatureCopy
              index="01"
              label="Air quality dashboard"
              title="The whole reading, on one screen."
              body="US and CPCB indices side by side, all six pollutants, weather context and a seven day trend. The dashboard is the reference every other screen links back to."
              href="/dashboard"
              cta="Open the dashboard"
            />

            <div className="border border-line-strong bg-surface">
              <PreviewLabel right={loading ? "refreshing" : undefined}>
                Dashboard preview
              </PreviewLabel>
              {air ? (
                <>
                  <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                        US AQI, {place.name}
                      </p>
                      <div className="mt-2 flex flex-wrap items-end gap-3">
                        <p
                          className="tnum text-[64px] font-semibold leading-[0.8] tracking-[-0.05em]"
                          style={{ color: air.usBand?.color ?? "var(--color-ink)" }}
                        >
                          {air.usAqi == null ? "—" : Math.round(air.usAqi)}
                        </p>
                        {air.usBand ? <BandPill band={air.usBand} /> : null}
                      </div>
                      <div className="mt-5">
                        <ScaleStrip value={air.usAqi} />
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                      {POLLUTANT_KEYS.map((key) => (
                        <div key={key}>
                          <dt className="text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                            {POLLUTANT_META[key].label}
                          </dt>
                          <dd className="tnum mt-1 text-sm font-medium text-ink">
                            {air.pollutants[key].value == null
                              ? "—"
                              : Math.round(air.pollutants[key].value ?? 0)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="border-t border-line px-5 py-3 text-[11px] text-ink-muted">
                    {air.weather
                      ? `${air.weather.temperatureC?.toFixed(1) ?? "—"} °C, ${
                          air.weather.humidityPct ?? "—"
                        }% humidity, ${air.weather.windKph?.toFixed(1) ?? "—"} km/h${
                          air.weather.windCompass ? ` ${air.weather.windCompass}` : ""
                        }`
                      : "Weather context unavailable for this reading."}
                  </div>
                </>
              ) : (
                <div className="p-5">
                  <Unavailable>
                    Live preview unavailable. The dashboard will try the same endpoint and say so
                    plainly if it fails.
                  </Unavailable>
                </div>
              )}
            </div>
          </article>

          <article
            className="bg-accent px-5 py-12 text-canvas sm:px-10 sm:py-16 lg:px-12"
            data-reveal
          >
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
              <div className="border border-canvas/20">
                <div className="flex items-center justify-between gap-3 border-b border-canvas/20 px-5 py-3">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sage">
                    <SparkIcon className="h-3.5 w-3.5" />
                    AirAware assistant
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-canvas/65">
                    {place.name}
                  </p>
                </div>
                <div className="px-5 py-6">
                  <p className="text-[13px] leading-relaxed text-canvas/70">
                    Ask anything about today&apos;s air. Useful starting points:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Is it safe to run outside at 7pm?",
                      "Which pollutant should I worry about most right now?",
                      "Should I ventilate my flat today?",
                    ].map((question) => (
                      <span
                        key={question}
                        className="border border-canvas/25 px-3 py-1.5 text-[11px] leading-snug text-canvas/80"
                      >
                        {question}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 border border-dashed border-canvas/20 px-4 py-6">
                    <p className="text-[13px] leading-relaxed text-canvas/60">
                      Answers are generated from the reading fetched on the server. If the model is
                      unavailable, this panel says so instead of improvising one.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-canvas/20 px-4 py-3">
                  <span className="flex-1 border border-canvas/20 px-3 py-2 text-[12px] text-canvas/65">
                    e.g. Is 6am better than 6pm for a walk today?
                  </span>
                  <span className="bg-sage px-3 py-2 text-[12px] font-semibold text-accent">
                    Send
                  </span>
                </div>
              </div>

              <FeatureCopy
                index="02"
                label="AI air assistant"
                title="A conversation anchored in today's numbers."
                body="The assistant receives the current reading for your city from the server, then answers in plain language. It is told to name what is missing rather than invent a value."
                href="/assistant"
                cta="Meet the assistant"
                tone="dark"
              />
            </div>
          </article>

          <article
            className="grid gap-10 border-t border-line pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
            data-reveal
          >
            <FeatureCopy
              index="03"
              label="Daily action planner"
              title="A day arranged around the reading."
              body="Tell the planner how you usually spend the day. It builds a routine around the current pollution levels instead of generic advice that could apply to any city on any date."
              href="/plan"
              cta="Open the daily plan"
            />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                What the plan works with
              </p>
              <ol>
                {[
                  {
                    slot: "Morning",
                    body: "A suggested window for a walk or a run, and the reason attached to it.",
                  },
                  {
                    slot: "Afternoon",
                    body: "The commute option with the lowest exposure for today's air.",
                  },
                  {
                    slot: "Evening",
                    body: "Ventilate or seal the house, and what to run indoors if you have it.",
                  },
                ].map((item, index) => (
                  <li
                    key={item.slot}
                    className="grid grid-cols-[64px_1fr] gap-5 border-t border-line-strong py-5 sm:grid-cols-[88px_1fr] sm:gap-8 sm:py-6"
                  >
                    <span className="font-serif text-3xl italic leading-none text-accent/60 sm:text-4xl">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.slot}</p>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-soft">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="border-t border-line-strong pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                  Guidance for the current reading
                </p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink">
                  {air?.usBand?.activity ??
                    "The plan reads the live band before it writes a single suggestion."}
                </p>
              </div>
            </div>
          </article>

          <article
            className="grid items-center gap-10 border-t border-line pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
            data-reveal
          >
            <div className="grid border border-line-strong sm:grid-cols-2">
              <div className="p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  Outdoor PM2.5
                </p>
                <p className="tnum mt-3 text-5xl font-semibold leading-none tracking-[-0.04em] text-ink">
                  {pm25 == null ? "—" : Math.round(pm25)}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  µg/m³ in {place.name}
                </p>
                <p className="mt-6 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-soft">
                  This is the outdoor reading. Indoor air is never measured by this product.
                </p>
              </div>
              <div className="border-t border-line bg-accent-soft p-6 sm:border-l sm:border-t-0 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  Today&apos;s call
                </p>
                <p className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-accent">
                  {ventilate == null
                    ? "Waiting for a reading"
                    : ventilate
                      ? "Open the windows"
                      : "Keep them closed"}
                </p>
                <p className="mt-4 text-[12px] leading-relaxed text-ink-soft">
                  {ventilate == null
                    ? "The indoor screen waits for the outdoor number before making a call."
                    : ventilate
                      ? "Outdoor particles are low enough for a short cross-draught. Ten focused minutes usually beats a window left ajar all day."
                      : "Outdoor particles are elevated. Filter the air you have and keep the kitchen exhaust running while you cook."}
                </p>
                <p className="mt-4 text-[10.5px] leading-relaxed text-ink-muted">
                  Threshold: about 30 µg/m³ PM2.5. Guidance only, not a measurement of your home.
                </p>
              </div>
            </div>

            <FeatureCopy
              index="04"
              label="Indoor air quality"
              title="A decision about your windows, not just a number."
              body="The indoor screen turns the outdoor reading into a ventilate or seal call, then gets specific about kitchens, purifiers, floors and the limits of each suggestion."
              href="/indoor"
              cta="Open indoor air"
            />
          </article>

          <article className="border-t border-line pt-14" data-reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <FeatureCopy
                index="05"
                label="Sustainable impact explorer"
                title="Make the trade-off visible."
                body="Compare a weekly commute by car, bus, metro or cycle. Every figure is a printed assumption, not a silent estimate."
                href="/impact"
                cta="Compare a commute"
              />
            </div>

            <div className="mt-10 grid gap-8 border border-line-strong bg-surface p-5 sm:p-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
              <div>
                <div className="flex items-end justify-between gap-4">
                  <label
                    htmlFor="impact-distance"
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted"
                  >
                    One way distance
                  </label>
                  <span className="tnum text-lg font-medium text-ink">{distance} km</span>
                </div>
                <input
                  id="impact-distance"
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={distance}
                  onChange={(event) => setDistance(Number(event.target.value))}
                  className="mt-3 w-full accent-[#173d35]"
                />
                <p className="mt-2 text-[11px] text-ink-muted">Ten round trips each week.</p>

                <div className="mt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                    Your usual mode
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {TRAVEL_MODES.filter((item) =>
                      ["car", "two-wheeler", "bus", "metro", "cycle", "auto"].includes(item.id),
                    ).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={mode === item.id}
                        onClick={() => setMode(item.id)}
                        className={`border px-2.5 py-2 text-left text-[11px] leading-tight transition ${
                          mode === item.id
                            ? "border-accent bg-accent text-canvas"
                            : "border-line-strong text-ink-soft hover:border-ink-muted hover:text-ink"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                    Weekly CO₂ by mode
                  </p>
                  <p className="text-[11px] text-ink-muted">{distance * 2 * 10} km total</p>
                </div>
                <div className="mt-5 space-y-4">
                  {compare.map((row) => {
                    const active = row.mode.id === mode;
                    return (
                      <div key={row.mode.id}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span
                            className={`text-xs ${active ? "font-semibold text-ink" : "text-ink-soft"}`}
                          >
                            {row.mode.label}
                          </span>
                          <span className="tnum text-xs text-ink">
                            {formatKg(row.weeklyGrams)} CO₂
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full bg-accent-soft">
                          <div
                            className={`h-full ${active ? "bg-accent" : "bg-[#7a8c76]"}`}
                            style={{ width: `${Math.max(1, (row.weeklyGrams / baseline) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-6 border-t border-line pt-4 text-[11px] leading-relaxed text-ink-muted">
                  Planning figure, not a measurement. {selected.assumption} Your selection:{" "}
                  {selected.label.toLowerCase()}.
                </p>
              </div>
            </div>
          </article>

          <article className="border-t border-line pt-14" data-reveal>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <FeatureCopy
                index="06"
                label="Environmental insights"
                title="A spike means more with context."
                body="Seven days of hourly PM2.5, the India 24 hour standard marked, and the weather that decides how fast today's pollution clears."
                href="/insights"
                cta="Read the insights"
              />
              <p className="max-w-sm justify-self-end text-sm leading-relaxed text-ink-soft lg:text-right">
                The chart below is the live history for {place.name}. It is not an illustration.
              </p>
            </div>

            <div className="mt-8 border border-line-strong bg-surface p-5 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  PM2.5, last seven days
                </p>
                <p className="text-[11px] text-ink-muted">{place.name}</p>
              </div>
              <div className="pt-5">
                {air ? (
                  <TrendChart history={air.history} />
                ) : (
                  <Unavailable>
                    History is fetched with the current reading. There is nothing to plot until that
                    request succeeds.
                  </Unavailable>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
