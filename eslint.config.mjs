export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      // Add project-specific rules here
    },
    plugins: {},
    ignores: ["node_modules/**"]
  }
];
