import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The theme's CSS styles plain <img> tags inside <figure>, so next/image isn't used
      "@next/next/no-img-element": "off",
      // The site and dashboard load their own stylesheets/fonts per layout (React 19 <link precedence>)
      "@next/next/no-css-tags": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/theme/**",
    "src/generated/**",
  ]),
]);

export default eslintConfig;
