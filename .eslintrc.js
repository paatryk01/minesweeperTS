module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/airbnb",
    "@vue/typescript",
    "plugin:prettier/recommended"
  ],
  rules: {
    "no-plusplus": "off",
    "no-param-reassign": 0,
    radix: "off",
    "no-unused-vars": "off",
    "no-alert": "off"
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaVersion: 2018
  }
};
