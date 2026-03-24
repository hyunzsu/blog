import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import globals from "globals";
import { createJiti } from "jiti";

// ---------------------------------------------------------------------------
// Single source of truth: import LAYER_ORDER from the shared config so that
// ESLint boundary rules and runtime code stay in sync automatically.
// jiti transpiles the TypeScript at lint time — no extra build step needed.
// ---------------------------------------------------------------------------
const jiti = createJiti(import.meta.url);
const { LAYER_ORDER } = await jiti.import(
  "./src/shared/config/layer-order.ts",
);

/**
 * Build the boundaries/elements settings from LAYER_ORDER.
 *
 * The 'app' layer uses a shallower glob (src/app/**) so that top-level App
 * Router files (layout.tsx, page.tsx) are captured after eslint-plugin-boundaries
 * appends /**\/* at runtime.  All other layers use src/<layer>/**\/*.
 */
const boundaryElements = [
  ...LAYER_ORDER.map((layer) => ({
    type: layer,
    pattern: layer === "app" ? "src/app/**" : `src/${layer}/**/*`,
  })),
  // Non-FSD zone: test-only files live here and must NOT import from any
  // recognised FSD layer (default: "disallow" covers them automatically).
  { type: "tests", pattern: "src/__tests__/**/*" },
];

/**
 * Build the boundaries/dependencies rules from LAYER_ORDER.
 *
 * Predicate: a layer at index i may import only from layers at index ≥ i
 * (itself and all more-foundational layers).  This encodes the FSD rule that
 * imports must always flow "downward" toward shared.
 */
const dependencyRules = LAYER_ORDER.map((layer, index) => ({
  from: { type: layer },
  // slice from current index: allows self-imports + all lower layers
  allow: { to: { type: LAYER_ORDER.slice(index) } },
}));

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

  // ---------------------------------------------------------------------------
  // FSD layer boundary enforcement
  //
  // Layer stack (outermost → innermost, derived from LAYER_ORDER in
  // src/shared/config/layer-order.ts):
  //   app → features → entities → shared
  //
  // Why no 'pages' layer?  This project uses Next.js 15 App Router; there is
  // no src/pages/ directory.  Page-level files live inside src/app/ and are
  // classified as the 'app' layer.
  //
  // Why no 'widgets' layer?  The project adopts a 4-layer FSD variant
  // (app / features / entities / shared) — widgets are intentionally omitted
  // because the current complexity does not require a widget abstraction.
  //
  // Dependency direction predicate (falsifiable):
  //   A file in layer L may only import from layer L itself OR from any layer
  //   that appears AFTER L in LAYER_ORDER (more foundational layers).
  //   Any import in the reverse direction (upward) is a reportable ESLint error.
  //
  // LAYER_ORDER is the single source of truth — boundaryElements and
  // dependencyRules are both generated from it so lint config and runtime
  // code remain in sync automatically.
  // ---------------------------------------------------------------------------
  {
    plugins: {
      boundaries,
    },
    settings: {
      // Define FSD layer zones for eslint-plugin-boundaries.
      // Note: @boundaries/elements (FOLDER mode) appends /**/* to each pattern at runtime.
      // Use src/app/** (not src/app/**/*) so that top-level app files (layout.tsx, page.tsx)
      // are recognised as "app" elements after the /**/* suffix is applied.
      "boundaries/elements": boundaryElements,
      // TypeScript path alias resolution (allows @/ imports to be resolved correctly)
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // boundaries/dependencies — enforce downward-only imports between FSD layers.
      // default: "disallow" means any cross-layer import not covered by the `rules`
      // array is an error; `rules` explicitly permits the allowed directions.
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          // Generated from LAYER_ORDER — each layer allows self + more-foundational layers.
          rules: dependencyRules,
        },
      ],
      // boundaries/no-unknown — report any import whose target file does not
      // match any declared element type.  This catches imports to unlisted
      // directories and prevents silently unclassified code from bypassing the
      // layer checks.
      "boundaries/no-unknown": "error",
    },
  },

  // Prettier (must be last to disable formatting-related rules)
  prettierConfig,
];

export default eslintConfig;
