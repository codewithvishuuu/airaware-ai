import { describe, expect, it } from "vitest";
import { formatObservedAt } from "@/lib/format";

describe("formatObservedAt", () => {
  it("formats a real observation timestamp", () => {
    const label = formatObservedAt("2026-11-17T18:30:00Z");
    expect(label).toBeTypeOf("string");
    expect(label).not.toBe("");
  });

  it("returns null for an invalid timestamp so callers show their own fallback", () => {
    expect(formatObservedAt("not-a-date")).toBeNull();
    expect(formatObservedAt("")).toBeNull();
  });
});
