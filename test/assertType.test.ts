import { describe, it } from "mocha";
import { expect } from "chai";
import { assertType, checkKeys } from "../src/";

const a = 1;
const b = true;
const c = "abc";
const d = undefined;
const e: any[] = [];
const f: Record<never, never> = {};
const g = [1, 2, 3];
const h = ["a", "b", "c"];
const i = [1, "b", "c"];
const j = { a: 1, b: 2 };
const k = { a: "a", b: "b" };
const l = null;

describe("assert test", () => {
  it("should assert simple type", () => {
    expect(assertType(a, "boolean")).to.be.equal(false);
    expect(assertType(b, "boolean")).to.be.equal(true);
    expect(assertType(b, "string")).to.be.equal(false);
    expect(assertType(b, { type: "boolean", enum: [true] })).to.be.equal(true);
    expect(assertType(c, "string")).to.be.equal(true);
    expect(assertType(c, "undefined")).to.be.equal(false);
    expect(assertType(d, "undefined")).to.be.equal(true);
    expect(assertType(d, "number")).to.be.equal(false);
    expect(assertType(a, "number")).to.be.equal(true);
    expect(assertType(l, "null")).to.be.equal(true);
    expect(assertType(l, "object")).to.be.equal(false);
    expect(assertType(l, "number")).to.be.equal(false);
  });

  it("should assert type", () => {
    expect(assertType(e, "object")).to.be.equal(false);
    expect(assertType(e, "array")).to.be.equal(true);
    expect(assertType(f, "array")).to.be.equal(false);
    expect(assertType(f, "object")).to.be.equal(true);
    expect(assertType(g, "array")).to.be.equal(true);
    expect(assertType(h, "array")).to.be.equal(true);
    expect(assertType(i, "array")).to.be.equal(true);
    expect(assertType(j, "object")).to.be.equal(true);
    expect(assertType(k, "object")).to.be.equal(true);
  });

  it("should assert specific type", () => {
    expect(assertType(g, "string[]")).to.be.equal(false);
    expect(assertType(g, "number[]")).to.be.equal(true);
    expect(assertType(h, "number[]")).to.be.equal(false);
    expect(assertType(h, "string[]")).to.be.equal(true);
    expect(assertType(i, "number[]")).to.be.equal(false);
    expect(assertType(i, "string[]")).to.be.equal(false);
    expect(assertType(j, "Record<string,string>")).to.be.equal(false);
    expect(assertType(j, "Record<string, string>")).to.be.equal(false);
    expect(assertType(j, "Record<string,number>")).to.be.equal(true);
    expect(assertType(j, "Record<string, number>")).to.be.equal(true);
    expect(assertType(k, "Record<string,number>")).to.be.equal(false);
    expect(assertType(k, "Record<string, number>")).to.be.equal(false);
    expect(assertType(k, "Record<string,string>")).to.be.equal(true);
    expect(assertType(k, "Record<string, string>")).to.be.equal(true);
  });

  it("should assert muti type", () => {
    expect(assertType(a, ["boolean", "null"])).to.be.equal(false);
    expect(assertType(b, ["boolean", "object"])).to.be.equal(true);
    expect(assertType(b, ["string", "array"])).to.be.equal(false);
    expect(
      assertType(b, { type: ["string", "array"], additional: [true] })
    ).to.be.equal(true);
    expect(assertType(h, ["number", "string[]"])).to.be.equal(true);
    expect(assertType(h, ["number[]", "string[]"])).to.be.equal(true);
    expect(assertType(i, ["number[]", "string[]"])).to.be.equal(false);
    expect(
      assertType(j, ["Record<string, boolean>", "Record<string, string>"])
    ).to.be.equal(false);
    expect(
      assertType(j, ["Record<string, number>", "Record<string, string>"])
    ).to.be.equal(true);
    expect(
      assertType(k, ["Record<string, number>", "Record<string, string>"])
    ).to.be.equal(true);
    expect(assertType(k, "Record<string, string>")).to.be.equal(true);
  });

  it("should check keys", () => {
    expect(
      checkKeys({ title: "a", desc: "b" }, { title: "string", desc: "string" })
    ).to.be.equal(true);
    expect(
      checkKeys(
        { title: "a", desc: "b" },
        { title: ["boolean", "string"], desc: ["string", "number"] }
      )
    ).to.be.equal(true);
    expect(
      checkKeys(
        { title: "a", desc: "b", a: 1 },
        { title: "string", desc: "string" }
      )
    ).to.be.equal(false);
    expect(
      checkKeys({ title: "a" }, { title: "string", desc: "string" })
    ).to.be.equal(false);
    expect(
      checkKeys({ title: "a", desc: 3 }, { title: "string", desc: "string" })
    ).to.be.equal(false);
    expect(
      checkKeys(
        { title: "a", desc: "b" },
        { title: "string", desc: "string", content: "array" }
      )
    ).to.be.equal(false);
  });
});
