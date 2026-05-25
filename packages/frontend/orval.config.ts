import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "http://localhost:3000/docs-json",
    output: {
      target: "./src/shared/api.ts",
      client: "fetch",
      mode: "single",
    },
  },
});
