import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node, // important fix
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {},
  },
]);
