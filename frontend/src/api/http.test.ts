import { describe, expect, it } from "vitest";
import { apiBaseUrl, authHeader } from "./http";

describe("authHeader", () => {
  it("adds a Bearer token only when present", () => {
    expect(authHeader(null)).toEqual({});
    expect(authHeader("abc.def")).toEqual({ Authorization: "Bearer abc.def" });
  });
});

describe("apiBaseUrl", () => {
  it("returns a string", () => {
    expect(typeof apiBaseUrl()).toBe("string");
  });
});
