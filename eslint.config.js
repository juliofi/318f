// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/**
 * ESLint Configuration (Vite + React + TS + Rolldown)
 */
export default [
  // Ignora a pasta de build
  { ignores: ["dist", "node_modules"] },

  // Config principal
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.recommended,
      reactRefresh.configs.vite,
      prettier, // desativa regras que conflitam com Prettier
    ],
    rules: {
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "react-hooks/exhaustive-deps": "warn",
      "no-console": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
