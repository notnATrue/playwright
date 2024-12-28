import prettier from "eslint-plugin-prettier"
import playwright from "eslint-plugin-playwright";
import typescriptParser from "@typescript-eslint/parser";
import airbnb from "eslint-config-airbnb";

export default [
  {
    files: ["tests/**/*.ts", "tests/**/*.spec.ts", "tests/**/*.tsx"],
    plugins: {
      "playwright": playwright,
      "prettier": prettier,
      "airbnb": airbnb
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      "no-console": "warn",
      "prettier/prettier": "error",
      "indent": ["error", 2],
      "padding-line-between-statements": [
        "error",
        {
          "blankLine": "always",
          "prev": "*",
          "next": "return"
        }
      ]
    },

  }
];