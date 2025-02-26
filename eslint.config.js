export default [
    {
      ignores: ["node_modules/", "dist/"],
    },
    {
      languageOptions: {
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
        },
      },
      rules: {
        "no-unused-vars": "warn",
        "no-console": "off",
      },
    },
  ];