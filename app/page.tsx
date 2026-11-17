import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AiContextPanel,
  HeroReading,
  LiveAirSection,
} from "@/components/landing/live-air";
import { FeatureShowcase } from "@/components/landing/feature-showcase";
import { RevealObserver } from "@/components/landing/reveal-observer";
import { ArrowIcon, SparkIcon } from "@/components/icons";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "AirAware AI | The air around you matters" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const STEPS = [
  {
    title: "Discover your local air quality",
    body: "Pick a city or use your location. The dashboard fetches modelled hourly readings and shows what is driving the index, with the US and CPCB values kept separate.",
  },
  {
    title: "Get AI-powered personalized guidance",
    body: "Ask the assistant, request a briefing, or build a daily plan. Each request carries the current reading to the model from the server, so the answer has something real to work from.",
  },
  {
    title: "Make informed everyday decisions",
    body: "Time a walk, change a commute, decide whether to ventilate. Every suggestion stays linked to the reading it came from, and to its limits.",
  },
];

const REFUSALS = [
  {
    title: "No invented numbers",
    body: "If the provider does not return a value, the interface shows the gap. It never fills one in to look complete.",
  },
  {
    title: "No station claims",
    body: "Every reading is described as modelled, because that is what it is. CPCB figures are calculated here and labelled as estimates.",
  },
  {
    title: "No medical advice",
    body: "Guidance describes exposure and comfort. It does not diagnose, prescribe or promise a health outcome.",
  },
];

export default function LandingPage() {
  return (
    <>
      <RevealObserver />

      <section className="relative">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-0 lg:pb-0 lg:pt-0">
            <div className="relative z-10 lg:flex lg:min-h-[660px] lg:flex-col lg:justify-center lg:py-24 lg:pr-16">
              <p className="hero-in text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
                Environmental intelligence
              </p>
              <h1 className="hero-in mt-6 max-w-[11ch] text-[clamp(2.9rem,6.4vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-ink [animation-delay:90ms]">
                The air around you matters.
              </h1>
              <p className="hero-in mt-7 max-w-[46ch] text-[17px] leading-[1.7] text-ink-soft [animation-delay:180ms]">
                Understand your environment, discover healthier everyday routines and make more
                informed choices with AI-powered air quality intelligence.
              </p>

              <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center [animation-delay:260ms]">
                <Link
                  href="#live-air"
                  className="lift inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-canvas hover:bg-ink"
                >
                  Explore Air Quality
                  <ArrowIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/assistant"
                  className="lift inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-ink hover:border-accent hover:bg-surface"
                >
                  <SparkIcon className="h-4 w-4" />
                  Meet Your AI Assistant
                </Link>
              </div>

              <p className="hero-in mt-8 max-w-sm text-[11.5px] leading-relaxed text-ink-muted [animation-delay:340ms]">
                Modelled CAMS data via Open-Meteo. US and CPCB indices kept separate. No account
                required.
              </p>
            </div>

            <div className="relative -mx-5 min-h-[430px] sm:-mx-8 sm:min-h-[540px] lg:mx-0 lg:-mr-12 lg:min-h-[660px]">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="/images/hero-city-haze.jpg"
                  alt="A city skyline of high-rise towers rising above dense green tree canopy in morning haze."
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="parallax object-cover object-center"
                />
                <div className="absolute inset-0 bg-accent/[0.07]" aria-hidden="true" />
                <div
                  className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,#f7f7f2_0%,rgba(247,247,242,0.5)_10%,rgba(247,247,242,0)_32%)]"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/25 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <HeroReading className="absolute bottom-6 left-5 right-5 z-10 sm:left-8 sm:right-8 lg:-left-10 lg:bottom-20 lg:right-auto lg:w-[330px]" />
            </div>
          </div>
        </div>
      </section>

      <LiveAirSection />

      <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div data-reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
                Why it matters
              </p>
              <h2
                id="about-heading"
                className="mt-5 max-w-[16ch] text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink"
              >
                You cannot see the air. You can learn to read it.
              </h2>
              <p className="mt-8 max-w-sm font-serif text-[clamp(1.45rem,2.1vw,1.95rem)] italic leading-[1.35] text-accent">
                The air is shared. What you notice, you can act on.
              </p>
            </div>

            <div className="space-y-6 text-[17px] leading-[1.75] text-ink-soft" data-reveal>
              <p>
                Air quality is a mixture, not a score. Fine particles, ozone, nitrogen dioxide and
                sulphur dioxide behave differently, peak at different hours and come from different
                places.
              </p>
              <p>
                A clear view is not proof of clean air. Haze carries fine particles. Still, cold
                mornings trap pollution near the ground. Wind can clear one street while carrying
                smoke into the next.
              </p>
              <p>
                The useful question is not whether today is good or bad. It is what is in the air
                right now, what is driving it, and what you can reasonably change about the next
                few hours.
              </p>
            </div>
          </div>
        </div>

        <figure>
          <div className="relative h-[46vh] min-h-[300px] max-h-[560px] overflow-hidden">
            <Image
              src="/images/story-maidan-haze.jpg"
              alt="A herder walking a flock of goats across a wide urban maidan, with a single tower and the sun dissolving into morning haze behind them."
              fill
              sizes="100vw"
              className="parallax object-cover object-center"
            />
            <div className="absolute inset-0 bg-accent/10" aria-hidden="true" />
          </div>
          <figcaption className="mx-auto max-w-[1440px] px-5 pt-3 text-[11px] text-ink-muted sm:px-8 lg:px-12">
            Winter Maidan Morning Kolkata, by SukantaBhowmik. CC BY-SA 4.0, Wikimedia Commons.
          </figcaption>
        </figure>

        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid gap-8 border-t border-line-strong pt-8 md:grid-cols-3" data-reveal>
            {REFUSALS.map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureShowcase />

      <section
        id="how-it-works"
        aria-labelledby="how-heading"
        className="scroll-mt-24 border-t border-line bg-accent-soft/60"
      >
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-12">
          <div>
            <div data-reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
                How it works
              </p>
              <h2
                id="how-heading"
                className="mt-5 max-w-[18ch] text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink"
              >
                Three steps, no guesswork about where the number came from.
              </h2>
            </div>

            <ol className="mt-10" data-reveal>
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[56px_1fr] gap-5 border-t border-line-strong py-7 sm:grid-cols-[88px_1fr] sm:gap-8"
                >
                  <span className="font-serif text-4xl italic leading-none text-accent/60 sm:text-5xl">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/dashboard"
              className="lift mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-canvas hover:bg-ink"
            >
              Start with your city
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>

          <figure className="relative min-h-[360px] overflow-hidden lg:min-h-[560px]">
            <Image
              src="/images/story-fog-street.jpg"
              alt="A foggy early morning street in Mysuru, framed by tree branches, with an auto-rickshaw disappearing into the mist."
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="parallax object-cover object-center"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent"
              aria-hidden="true"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 px-4 pb-4 text-[10.5px] leading-relaxed text-canvas">
              Misty Morning in Mysuru, by Pradyumnakp. CC0, Wikimedia Commons.
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="ai-heading" className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-start lg:gap-20">
            <div data-reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
                Inside the assistant
              </p>
              <h2
                id="ai-heading"
                className="mt-5 max-w-[16ch] text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink"
              >
                Context first, then the answer.
              </h2>
              <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                Ask a question and the server fetches the current reading for your selected place
                before the model is called. The browser does not supply the numbers.
              </p>
              <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-ink-soft">
                That context includes both indices, the pollutant concentrations, the dominant
                pollutant and the weather. The model is instructed to name what it does not know.
                If Gemini is unavailable, the page says so instead of writing something plausible.
              </p>
              <Link
                href="/assistant"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent"
              >
                <span className="link-underline">Open the assistant</span>
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div data-reveal>
              <AiContextPanel />
              <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
                These are the live values for your selected city. They change when the reading
                changes, not when the page copy does.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent text-canvas">
        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end" data-reveal>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
                AirAware AI
              </p>
              <h2 className="mt-6 max-w-[17ch] font-serif text-[clamp(2.5rem,5.4vw,4.6rem)] italic leading-[1.02] tracking-[-0.02em]">
                Better awareness starts with a single breath.
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="max-w-sm text-[15px] leading-relaxed text-canvas/75">
                Explore your local air quality and discover practical ways to navigate your
                everyday environment.
              </p>
              <Link
                href="/dashboard"
                className="lift mt-7 inline-flex items-center gap-2 bg-canvas px-5 py-3 text-sm font-semibold text-accent hover:bg-sage"
              >
                Explore AirAware AI
                <ArrowIcon className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-[11px] text-canvas/65">
                No account. No installation. Just the reading.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
