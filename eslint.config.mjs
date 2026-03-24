import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import globals from "globals";

// FSD 4단계 레이어 순서 (상위 → 하위)
const LAYER_ORDER = ["app", "features", "entities", "shared"];

const eslintConfig = [
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },

  {
    ...js.configs.recommended,
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module" },
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-undef": "off",
    },
  },

  {
    plugins: { "@next/next": nextPlugin },
    rules: { ...nextPlugin.configs["core-web-vitals"].rules },
    settings: { next: { rootDir: "." } },
  },

  // FSD 레이어 경계 강제
  // app → features → entities → shared (하향만 허용)
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": LAYER_ORDER.map((layer) => ({
        type: layer,
        pattern: layer === "app" ? "src/app/**" : `src/${layer}/**/*`,
      })),
      "import/resolver": {
        typescript: { alwaysTryTypes: true, project: "./tsconfig.json" },
      },
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: LAYER_ORDER.map((layer, i) => ({
            from: { type: layer },
            allow: { to: { type: LAYER_ORDER.slice(i) } },
          })),
        },
      ],
      "boundaries/no-unknown": "error",
    },
  },

  prettierConfig,
];

export default eslintConfig;
