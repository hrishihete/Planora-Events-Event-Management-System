import { describe, expect, it } from "vitest";
import { dollarsToCents, toOffsetDateTime } from "./events";

describe("toOffsetDateTime", () => {
  it("combines Figma date and time fields into an offset datetime", () => {
    const result = toOffsetDateTime("2031-08-15", "16:00");
    expect(result.startsWith("2031-08-15T16:00:00")).toBe(true);
    expect(result).toMatch(/[+-]\d{2}:\d{2}$/);
  });

  it("rejects missing values", () => {
    expect(() => toOffsetDateTime("", "16:00")).toThrow(/required/i);
  });
});

describe("dollarsToCents", () => {
  it("converts whole and fractional dollars", () => {
    expect(dollarsToCents("12000")).toBe(1_200_000);
    expect(dollarsToCents("12.50")).toBe(1250);
    expect(dollarsToCents("")).toBe(0);
  });

  it("rejects negative budgets", () => {
    expect(() => dollarsToCents("-1")).toThrow(/non-negative/i);
  });
});
