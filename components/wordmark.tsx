import Link from "next/link";

export function Wordmark({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="AirAware AI home">
      <span className="flex h-7 w-7 items-center justify-center bg-accent">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <g stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round">
            <path d="M5 8h9" />
            <path d="M5 12h14" opacity="0.75" />
            <path d="M5 16h6" opacity="0.5" />
          </g>
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
        AirAware<span className="text-ink-muted"> AI</span>
      </span>
    </Link>
  );
}
