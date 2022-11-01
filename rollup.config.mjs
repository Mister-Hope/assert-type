import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/index.ts",
    output: [{ file: "./dist/index.cjs", format: "cjs", sourcemap: true }],
    plugins: [json(), typescript(), terser()],
  },
  {
    input: "./src/index.ts",
    output: [{ file: "./dist/index.mjs", format: "esm", sourcemap: true }],
    plugins: [json(), typescript(), terser()],
  },
  {
    input: "./src/index.ts",
    output: [
      { file: "./dist/index.d.ts", format: "esm", sourcemap: true },
      { file: "./dist/index.d.cts", format: "esm", sourcemap: true },
      { file: "./dist/index.d.mts", format: "esm", sourcemap: true },
    ],
    plugins: [dts()],
  },
];
