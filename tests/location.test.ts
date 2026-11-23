import { describe, expect, it } from "vitest";
import { parseStoredPlace } from "@/lib/location";

describe("parseStoredPlace", () => {
  it("accepts a complete stored place", () => {
    const raw = JSON.stringify({
      name: "New Delhi",
      admin: "NCT of Delhi",
      country: "India",
      countryCode: "IN",
      latitude: 28.6139,
      longitude: 77.209,
    });

    expect(parseStoredPlace(raw)).toEqual({
      name: "New Delhi",
      admin: "NCT of Delhi",
      country: "India",
      countryCode: "IN",
      latitude: 28.6139,
      longitude: 77.209,
    });
  });

  it("rejects malformed JSON and non-objects", () => {
    expect(parseStoredPlace("{not json")).toBeNull();
    expect(parseStoredPlace("null")).toBeNull();
    expect(parseStoredPlace('"New Delhi"')).toBeNull();
  });

  it("rejects missing coordinates, empty names and wrong field types", () => {
    expect(parseStoredPlace(JSON.stringify({ name: "X", latitude: 10 }))).toBeNull();
    expect(
      parseStoredPlace(JSON.stringify({ name: "", latitude: 10, longitude: 20 })),
    ).toBeNull();
    expect(
      parseStoredPlace(JSON.stringify({ name: "X", latitude: "10", longitude: 20 })),
    ).toBeNull();
    expect(
      parseStoredPlace(JSON.stringify({ name: "X", latitude: NaN, longitude: 20 })),
    ).toBeNull();
    expect(
      parseStoredPlace(
        JSON.stringify({ name: "X", latitude: 10, longitude: 20, admin: { value: "Delhi" } }),
      ),
    ).toBeNull();
  });

  it("treats absent optional fields as absent rather than inventing values", () => {
    expect(parseStoredPlace(JSON.stringify({ name: "X", latitude: 10, longitude: 20 }))).toEqual({
      name: "X",
      latitude: 10,
      longitude: 20,
    });
  });
});
