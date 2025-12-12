import { describe, it, expect, vi } from "vitest";
import {formatPostcode, isMinimumAge, validatePostcode} from "@/lib/validations/validators";

describe("validatePostcode", () => {
  it("accepts valid UK postcodes", () => {
    expect(validatePostcode("SW1A 1AA")).toBe(true);
    expect(validatePostcode("sw1a1aa")).toBe(true);
    expect(validatePostcode("EC1A 1BB")).toBe(true);
    expect(validatePostcode("W1A 0AX")).toBe(true);
    expect(validatePostcode("M11AE")).toBe(true);
  });

  it("rejects invalid UK postcodes", () => {
    expect(validatePostcode("")).toBe(false);
    expect(validatePostcode("12345")).toBe(false);
    expect(validatePostcode("ABCDE")).toBe(false);
    expect(validatePostcode("SW1A1AAA")).toBe(false); // too long
    expect(validatePostcode("SW1")).toBe(false);
  });

  it("handles whitespace and formatting", () => {
    expect(validatePostcode("  sw1a   1aa ")).toBe(true);
  });

  it("accepts edge-case valid formats", () => {
    // Single-letter area, single-digit district
    expect(validatePostcode("W1A 0AX")).toBe(true);

    // Two-letter area, single-digit district
    expect(validatePostcode("EC1A 1BB")).toBe(true);

    // Areas with optional letter in district
    expect(validatePostcode("BX1 1LT")).toBe(true);
  });

  it("rejects known tricky invalid formats", () => {
    expect(validatePostcode("A1 1A")).toBe(false);     // too short
    expect(validatePostcode("AAA 1AA")).toBe(false);    // invalid outward code
    expect(validatePostcode("SWAAA1AA")).toBe(false);   // too many letters
    expect(validatePostcode("SW1A£AA")).toBe(false);    // invalid symbol
    expect(validatePostcode("SW1A-1AA")).toBe(false);   // invalid separator
  });

  it("rejects extremely long or weird input", () => {
    expect(validatePostcode("SW1A1AAXXX")).toBe(false);
    expect(validatePostcode("💥SW1A1AA")).toBe(false);
    expect(validatePostcode("   ")).toBe(false);
  });

  it("rejects null-like or non-string input", () => {
    // @ts-expect-error - testing runtime behavior
    expect(validatePostcode(null)).toBe(false);

    // @ts-expect-error - testing runtime behavior
    expect(validatePostcode(undefined)).toBe(false);
  });
});

describe("formatPostcode", () => {
  it("formats lowercase postcodes", () => {
    expect(formatPostcode("sw1a1aa")).toBe("SW1A 1AA");
  });

  it("formats with inconsistent spacing", () => {
    expect(formatPostcode("SW1A   1AA")).toBe("SW1A 1AA");
  });

  it("returns input formatted even if invalid", () => {
    expect(formatPostcode("abcde")).toBe("AB CDE"); // still inserts space
  });

  it("handles short postcodes gracefully", () => {
    expect(formatPostcode("AB1")).toBe("AB1"); // too short to split
  });

  it("handles excessive whitespace gracefully", () => {
    expect(formatPostcode("   sw1a     1aa  ")).toBe("SW1A 1AA");
  });

  it("handles minimal input", () => {
    expect(formatPostcode("A")).toBe("A");
    expect(formatPostcode("AB")).toBe("AB");
    expect(formatPostcode("AB1")).toBe("AB1");
    expect(formatPostcode("AB12")).toBe("AB12");
  });

  it("handles too short strings without throwing", () => {
    expect(formatPostcode("1")).toBe("1");
    expect(formatPostcode("")).toBe("");
  });
});

describe("isMinimumAge", () => {
  it("returns true when age is above minimum", () => {
    const today = new Date();
    const birthYear = today.getFullYear() - 25;
    const dob = new Date(birthYear, today.getMonth(), today.getDate()).toISOString();

    expect(isMinimumAge(dob, 18)).toBe(true);
  });

  it("returns false when age is below minimum", () => {
    const today = new Date();
    const birthYear = today.getFullYear() - 10;
    const dob = new Date(birthYear, today.getMonth(), today.getDate()).toISOString();

    expect(isMinimumAge(dob, 18)).toBe(false);
  });

  it("returns true if user turns the exact age today", () => {
    const today = new Date();
    const birthYear = today.getFullYear() - 18;
    const dob = new Date(birthYear, today.getMonth(), today.getDate()).toISOString();

    expect(isMinimumAge(dob, 18)).toBe(true);
  });

  it("returns false if birthday hasn't occurred yet this year", () => {
    const today = new Date();
    const birthYear = today.getFullYear() - 18;

    // One day after birthday
    const dob = new Date(
      birthYear,
      today.getMonth(),
      today.getDate() + 1
    ).toISOString();

    expect(isMinimumAge(dob, 18)).toBe(false);
  });

  it("handles invalid date strings (returns false)", () => {
    expect(isMinimumAge("not-a-date")).toBe(false);
    expect(isMinimumAge("")).toBe(false);
  });

  it("handles leap-year birthdays correctly", () => {
    // freeze current time
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-02-28"));

    // Born on leap-day 2000-02-29; on 2024-02-28 they are not yet 24
    expect(isMinimumAge("2000-02-29", 24)).toBe(false);

    // Move to leap day
    vi.setSystemTime(new Date("2024-02-29"));
    expect(isMinimumAge("2000-02-29", 24)).toBe(true);

    vi.useRealTimers();
  });

  it("handles timezone edge cases (midnight boundaries)", () => {
    const dob = "2007-01-01T00:00:00.000Z"; // turns 18 at 2025-01-01T00:00:00Z

    vi.useFakeTimers();
    // one second before turning 18 (still 17)
    vi.setSystemTime(new Date("2024-12-31T23:59:59.000Z").getTime());
    expect(isMinimumAge(dob, 18)).toBe(false);

    // exactly when they turn 18
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z").getTime());
    expect(isMinimumAge(dob, 18)).toBe(true);

    vi.useRealTimers();
  });


  it("handles very old ages correctly", () => {
    const dob = "1900-01-01";
    expect(isMinimumAge(dob, 18)).toBe(true);
    expect(isMinimumAge(dob, 150)).toBe(false);
  });
});
