import { dts } from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default [
  {
    input: "./src/index.ts",
    output: [{ file: "./dist/index.cjs", format: "cjs", sourcemap: true }],
    plugins: [
      esbuild({
        charset: "utf8",
        minify: true,
        target: "node18",
      }),
    ],
  },
  {
    input: "./src/index.ts",
    output: [{ file: "./dist/index.mjs", format: "esm", sourcemap: true }],
    plugins: [
      esbuild({
        charset: "utf8",
        minify: true,
        target: "node18",
      }),
    ],
  },
  {
    input: "./src/index.ts",
    output: [
      { file: "./dist/index.d.ts", format: "esm", sourcemap: true },
      { file: "./dist/index.d.cts", format: "esm", sourcemap: true },
      { file: "./dist/index.d.mts", format: "esm", sourcemap: true },
    ],
    plugins: [
      dts({
        compilerOptions: {
          moduleResolution: 99,
        },
      }),
    ],
  },
];
