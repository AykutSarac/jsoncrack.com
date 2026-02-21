import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["src/enums", "**/next.config.js"]),
  {
    extends: [
      ...nextCoreWebVitals,
      ...compat.extends("prettier"),
      ...compat.extends("plugin:@typescript-eslint/recommended"),
    ],

    plugins: {
      prettier,
      "unused-imports": unusedImports,
    },

    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": "error",
      "space-in-parens": "error",
      "no-empty": "error",
      "no-multiple-empty-lines": "error",
      "no-irregular-whitespace": "error",
      strict: ["error", "never"],
      "linebreak-style": ["error", "unix"],

      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
        },
      ],

      semi: ["error", "always"],
      "prefer-const": "error",

      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
    },
  },
]);
