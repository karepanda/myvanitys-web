import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { ignores: ["dist/**", "build/**", "coverage/**", "node_modules/**", "Docker/wiremock/mappings/**"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  {
    files: ["postcss.config.js", "tailwind.config.js"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["vitest.config.mjs", "vite.config.mjs", "src/test/**/*.{js,jsx}"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
    },
  },
]);
