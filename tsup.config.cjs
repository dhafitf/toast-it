import { defineConfig } from "tsup";
import umdWrapper from "esbuild-plugin-umd-wrapper";
import { umd, dependencies, version } from "./package.json";

const externalDependencies = Object.keys(dependencies);
const clientName = umd;

/** @type {import('tsup').Options} */
const baseConfig = {
  entry: {
    ["toast-it"]: "src/index.ts",
  },
  outDir: "dist",
  outExtension({ format, options }) {
    const ext = { esm: "js", cjs: "cjs", umd: "umd.js" }[format];
    const outputExtension = options.minify ? `min.${ext}` : `${ext}`;
    return {
      js: `.${outputExtension}`,
    };
  },
  platform: "browser",
  format: ["cjs", "esm"],
  name: clientName,
  globalName: clientName,
  bundle: true,
  esbuildPlugins: [],
  banner: { js: `/*! toast-it v${version} | MIT */\n` },
  define: {
    __VERSION__: `'${version}'`,
  },
  noExternal: externalDependencies,
  minify: false,
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
};

export default defineConfig([
  {
    ...baseConfig,
    esbuildPlugins: [],
  },
  {
    ...baseConfig,
    format: ["umd"],
    esbuildPlugins: [umdWrapper({ external: "inherit" })],
  },
]);
