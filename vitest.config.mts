import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    include: ["src/**/*.spec.ts", "tests/**/*.spec.ts"],
    exclude: [
      "src/**/*.e2e.spec.ts",
      "tests/**/*.e2e.spec.ts",
      "node_modules",
      "dist",
      ".git",
    ],
  },
});
