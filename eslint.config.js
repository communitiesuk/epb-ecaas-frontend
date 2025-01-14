import js from "@eslint/js";

export default [
  js.configs.recommended,
  // Your custom configs here
  {
    ignores: [".nuxt/dev/index.mjs"],
  },
  {
    rules: {
      semi: "error"
    }
  }
];
