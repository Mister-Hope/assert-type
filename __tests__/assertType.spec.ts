import { describe, expect, it } from "vitest";

import { assertType, checkKeys } from "../src/index.js";

const a = 1;
const b = true;
const c = "abc";
const d = undefined;
const e: unknown[] = [];
const f: Record<never, never> = {};
const g = [1, 2, 3];
const h = ["a", "b", "c"];
const i = [1, "b", "c"];
const j = { a: 1, b: 2 };
const k = { a: "a", b: "b" };
const l = null;

describe("assert test", () => {
  it("should assert simple type", () => {
    expect(assertType(a, "boolean")).toEqual(false);
    expect(assertType(b, "boolean")).toEqual(true);
    expect(assertType(b, "string")).toEqual(false);
    expect(assertType(b, { type: "boolean", enum: [true] })).toEqual(true);
    expect(assertType(c, "string")).toEqual(true);
    expect(assertType(c, "undefined")).toEqual(false);
    expect(assertType(d, "undefined")).toEqual(true);
    expect(assertType(d, "number")).toEqual(false);
    expect(assertType(a, "number")).toEqual(true);
    expect(assertType(l, "null")).toEqual(true);
    expect(assertType(l, "object")).toEqual(false);
    expect(assertType(l, "number")).toEqual(false);
  });

  it("should assert type", () => {
    expect(assertType(e, "object")).toEqual(false);
    expect(assertType(e, "array")).toEqual(true);
    expect(assertType(f, "array")).toEqual(false);
    expect(assertType(f, "object")).toEqual(true);
    expect(assertType(g, "array")).toEqual(true);
    expect(assertType(h, "array")).toEqual(true);
    expect(assertType(i, "array")).toEqual(true);
    expect(assertType(j, "object")).toEqual(true);
    expect(assertType(k, "object")).toEqual(true);
  });

  it("should assert specific type", () => {
    expect(assertType(g, "string[]")).toEqual(false);
    expect(assertType(g, "number[]")).toEqual(true);
    expect(assertType(h, "number[]")).toEqual(false);
    expect(assertType(h, "string[]")).toEqual(true);
    expect(assertType(i, "number[]")).toEqual(false);
    expect(assertType(i, "string[]")).toEqual(false);
    expect(assertType(j, "Record<string,string>")).toEqual(false);
    expect(assertType(j, "Record<string, string>")).toEqual(false);
    expect(assertType(j, "Record<string,number>")).toEqual(true);
    expect(assertType(j, "Record<string, number>")).toEqual(true);
    expect(assertType(k, "Record<string,number>")).toEqual(false);
    expect(assertType(k, "Record<string, number>")).toEqual(false);
    expect(assertType(k, "Record<string,string>")).toEqual(true);
    expect(assertType(k, "Record<string, string>")).toEqual(true);
  });

  it("should assert multi type", () => {
    expect(assertType(a, ["boolean", "null"])).toEqual(false);
    expect(assertType(b, ["boolean", "object"])).toEqual(true);
    expect(assertType(b, ["string", "array"])).toEqual(false);
    expect(
      assertType(b, { type: ["string", "array"], additional: [true] }),
    ).toEqual(true);
    expect(assertType(h, ["number", "string[]"])).toEqual(true);
    expect(assertType(h, ["number[]", "string[]"])).toEqual(true);
    expect(assertType(i, ["number[]", "string[]"])).toEqual(false);
    expect(
      assertType(j, ["Record<string, boolean>", "Record<string, string>"]),
    ).toEqual(false);
    expect(
      assertType(j, ["Record<string, number>", "Record<string, string>"]),
    ).toEqual(true);
    expect(
      assertType(k, ["Record<string, number>", "Record<string, string>"]),
    ).toEqual(true);
    expect(assertType(k, "Record<string, string>")).toEqual(true);
  });

  it("should check keys", () => {
    expect(
      checkKeys({ title: "a", desc: "b" }, { title: "string", desc: "string" }),
    ).toEqual(true);
    expect(
      checkKeys(
        { title: "a", desc: "b" },
        { title: ["boolean", "string"], desc: ["string", "number"] },
      ),
    ).toEqual(true);
    expect(
      checkKeys(
        { title: "a", desc: "b", a: 1 },
        { title: "string", desc: "string" },
      ),
    ).toEqual(false);
    expect(
      checkKeys({ title: "a" }, { title: "string", desc: "string" }),
    ).toEqual(false);
    expect(
      checkKeys({ title: "a", desc: 3 }, { title: "string", desc: "string" }),
    ).toEqual(false);
    expect(
      checkKeys(
        { title: "a", desc: "b" },
        { title: "string", desc: "string", content: "array" },
      ),
    ).toEqual(false);
  });
});
