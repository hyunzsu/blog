import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import globals from "globals";

const eslintConfig = [
  // Ignores
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },

  // Base JavaScript rules with browser + Node globals
  {
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // TypeScript files: use TS parser + plugin, disable no-undef (TS handles this)
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // TypeScript handles undefined variables better than no-undef
      "no-undef": "off",
    },
  },

  // Next.js core-web-vitals
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
    settings: {
      next: {
        rootDir: ".",
      },
    },
  },

  // FSD layer boundary enforcement (app → features → entities → shared)
  {
    plugins: {
      boundaries,
    },
    settings: {
      // Define FSD layer zones for eslint-plugin-boundaries.
      // Note: @boundaries/elements (FOLDER mode) appends /**/* to each pattern at runtime.
      // Use src/app/** (not src/app/**/*) so that top-level app files (layout.tsx, page.tsx)
      // are recognised as "app" elements after the /**/* suffix is applied.
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "features", pattern: "src/features/**/*" },
        { type: "entities", pattern: "src/entities/**/*" },
        { type: "shared", pattern: "src/shared/**/*" },
      ],
      // TypeScript path alias resolution (allows @/ imports to be resolved correctly)
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            // app can import from features, entities, shared (direct is allowed per FSD 4-layer)
            {
              from: { type: "app" },
              allow: { to: { type: ["app", "features", "entities", "shared"] } },
            },
            // features can import from entities, shared, and within features
            {
              from: { type: "features" },
              allow: { to: { type: ["features", "entities", "shared"] } },
            },
            // entities can import from shared and within entities
            {
              from: { type: "entities" },
              allow: { to: { type: ["entities", "shared"] } },
            },
            // shared can import within shared (cross-segment imports are valid in FSD)
            {
              from: { type: "shared" },
              allow: { to: { type: "shared" } },
            },
            // shared cannot import from app, features, or entities (default: disallow covers this)
          ],
        },
      ],
    },
  },

  // Prettier (must be last to disable formatting-related rules)
  prettierConfig,
];

export default eslintConfig;
