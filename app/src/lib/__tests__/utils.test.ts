import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn (classnames merger)", () => {
  it("combina classes simples", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("resolve conflitos de tailwind", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("ignora valores falsy", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("suporta objetos condicionais", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });
});
