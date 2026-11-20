// eslint.config.js – minimal ESLint v9 configuration
import js from "@eslint/js";
import globals from "globals";

export default [
  // Ignore build artifacts and dependencies
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Turn off rules that cause false positives in compiled output
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-undef": "off",
      "no-constant-condition": "off",
      "no-prototype-builtins": "off",
    },
  },
];

