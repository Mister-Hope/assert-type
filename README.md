# @mr-hope/assert-type

<!-- markdownlint-disable MD033 -->

[![作者: Mr.Hope](https://img.shields.io/badge/作者-Mr.Hope-blue.svg?style=for-the-badge)](https://mister-hope.com)
[![License](https://img.shields.io/github/license/mister-hope/assert-type?style=for-the-badge)](https://github.com/Mister-Hope/assert-type/tree/master/LICENSE)

一个简单的类型判断库。

## assertType

```ts
interface TypeOption<T = unknown> {
    type: string | string[];
    enum?: T[];
    additional?: T[];
}

assertType<T = unknown>(variable: T, type: string[] | string | TypeOption, variableName?: string) => boolean;
```

<details>
<summary>案例</summary>

```js
const a = 1;
const b = true;
const c = "abc";
const d = undefined;
const e = [];
const f = {};
const g = [1, 2, 3];
const h = ["a", "b", "c"];
const i = [1, "b", "c"];
const j = { a: 1, b: 2 };
const k = { a: "a", b: "b" };
const l = null;

assertType(a, "boolean"); // false
assertType(b, "boolean"); // true
assertType(b, "string"); // false
assertType(b, { type: "boolean", enum: [true] }); // true
assertType(c, "string"); // true
assertType(c, "undefined"); // false
assertType(d, "undefined"); // true
assertType(d, "number"); // false
assertType(a, "number"); // true
assertType(l, "null"); // true
assertType(l, "object"); // false
assertType(l, "number"); // false

assertType(e, "object"); // false
assertType(e, "array"); // true
assertType(f, "array"); // false
assertType(f, "object"); // true
assertType(g, "array"); // true
assertType(h, "array"); // true
assertType(i, "array"); // true
assertType(j, "object"); // true
assertType(k, "object"); // true

assertType(g, "string[]"); // false
assertType(g, "number[]"); // true
assertType(h, "number[]"); // false
assertType(h, "string[]"); // true
assertType(i, "number[]"); // false
assertType(i, "string[]"); // false
assertType(j, "Record<string,string>"); // false
assertType(j, "Record<string, string>"); // false
assertType(j, "Record<string,number>"); // true
assertType(j, "Record<string, number>"); // true
assertType(k, "Record<string,number>"); // false
assertType(k, "Record<string, number>"); // false
assertType(k, "Record<string,string>"); // true
assertType(k, "Record<string, string>"); // true
```

</details>

## checkKeys

```ts
checkKeys<T = unknown>(obj: T, config: Record<string, string[] | string | TypeOption>, objName?: string) => boolean;
```

<details>
<summary>案例</summary>

```js
checkKeys({ title: "a", desc: "b" }, { title: "string", desc: "string" }); // true

checkKeys(
  { title: "a", desc: "b" },
  { title: ["boolean", "string"], desc: ["string", "number"] }
); // true

checkKeys({ title: "a", desc: "b", a: 1 }, { title: "string", desc: "string" }); // false

checkKeys({ title: "a" }, { title: "string", desc: "string" }); // false

checkKeys({ title: "a", desc: 3 }, { title: "string", desc: "string" }); // false

checkKeys(
  { title: "a", desc: "b" },
  { title: "string", desc: "string", content: "array" }
); // false
```

</details>
