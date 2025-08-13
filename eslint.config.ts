import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default tseslint.config(
  {
    ignores: [
      ".nuxt",
      "dist",
      "node_modules"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...(pluginVue.configs?.["flat/essential"] ?? []),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    languageOptions: { globals: globals.browser },
    rules: {
      'eqeqeq': "warn",
      'curly': "warn",
      'no-else-return': "warn",
    }
  },
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
);
