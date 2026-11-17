import type { RecommendationSet } from "@/lib/types";
import { AlertIcon } from "./icons";

const DIFFICULTY_STYLE: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-800 border-emerald-200",
  moderate: "bg-amber-50 text-amber-800 border-amber-200",
  hard: "bg-rose-50 text-rose-800 border-rose-200",
};

export function RecommendationList({ set }: { set: RecommendationSet }) {
  return (
    <div className="space-y-3">
      <p className="rounded-xl border border-line bg-stone-50/70 px-4 py-3 text-sm leading-relaxed text-ink">
        {set.summary}
      </p>

      <ol className="space-y-3">
        {set.items.map((item, index) => (
          <li key={`${item.slot}-${index}`} className="rounded-xl border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
                {item.slot}
              </p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                  DIFFICULTY_STYLE[item.difficulty] ?? "border-line bg-stone-50 text-ink-soft"
                }`}
              >
                {item.difficulty}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium leading-snug text-ink">{item.action}</p>

            <dl className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">Why</dt>
                <dd className="text-[13px] leading-relaxed text-ink-soft">{item.why}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">
                  Expected benefit
                </dt>
                <dd className="text-[13px] leading-relaxed text-ink-soft">{item.benefit}</dd>
              </div>
            </dl>

            <p className="mt-3 flex items-start gap-1.5 border-t border-line pt-2.5 text-[12px] leading-relaxed text-ink-muted">
              <AlertIcon className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                <span className="font-medium text-ink-soft">Limits: </span>
                {item.limitations}
              </span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AiText({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={key} className="ml-4 list-disc space-y-1.5 text-sm leading-relaxed text-ink-soft">
        {bullets.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (!line) {
      flushBullets(`list-${index}`);
      return;
    }
    if (/^[-*•]\s+/.test(line)) {
      bullets.push(line.replace(/^[-*•]\s+/, ""));
      return;
    }
    flushBullets(`list-${index}`);
    if (/^limits:/i.test(line)) {
      blocks.push(
        <p
          key={index}
          className="rounded-lg border border-line bg-stone-50 px-3 py-2 text-[12px] leading-relaxed text-ink-muted"
        >
          {line}
        </p>,
      );
      return;
    }
    blocks.push(
      <p key={index} className="text-sm leading-relaxed text-ink-soft">
        {line}
      </p>,
    );
  });
  flushBullets("list-end");

  return <div className="space-y-2.5">{blocks}</div>;
}
