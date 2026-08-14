import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

// Shared eslint preset for all Next.js apps in the monorepo.
export const sharedEslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
