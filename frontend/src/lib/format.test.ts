import { describe, expect, it } from "vitest";
import { eventTypeLabel, formatMoney, statusLabel } from "./format";

describe("format helpers", () => {
  it("maps catalog types to Figma filter labels", () => {
    expect(eventTypeLabel("PRIVATE_PARTY")).toBe("Private Party");
    expect(eventTypeLabel("WEDDING")).toBe("Wedding");
  });

  it("formats USD from cents", () => {
    expect(formatMoney(1_200_000, "USD")).toBe("$12,000");
  });

  it("humanizes request status", () => {
    expect(statusLabel("DRAFT_REQUEST")).toBe("Draft Request");
  });
});
