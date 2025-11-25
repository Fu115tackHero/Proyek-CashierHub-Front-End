import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] }, // Folder build akan diabaikan

  // --- KONFIGURASI UNTUK FILE REACT (Browser) ---
  {
    files: ["**/*.{js,jsx}"], // Cek semua file JS dan JSX di src
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Set global variabel browser (window, document, dll)
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // 👇 TAMBAHAN 1: Matikan aturan Prop Types biar ga rewel minta validasi
      "react/prop-types": "off",
    },
  },

  // 👇 TAMBAHAN 2: Konfigurasi Khusus untuk file Config (Node.js)
  // Ini untuk mengatasi error "module is not defined" di postcss.config.js, tailwind.config.js, dll.
  {
    files: ["*.config.js", ".eslintrc.cjs"],
    languageOptions: {
      globals: globals.node, // Set global variabel Node (module, require, process, dll)
    },
  },
];