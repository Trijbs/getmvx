import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated Cloudflare / OpenNext build output (gitignored, not source).
    // Without these, `eslint` crawls thousands of bundled files, making lint
    // extremely slow and failing on machine-generated code.
    ".open-next/**",
    ".wrangler/**",
    // Local tooling state (Claude Code worktrees etc.) — never source.
    ".claude/**",
    // Generated Prisma client.
    "prisma/generated/**",
  ]),
]);

export default eslintConfig;
