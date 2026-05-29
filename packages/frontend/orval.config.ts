import dotenv from "dotenv";
import { defineConfig } from "orval";

dotenv.config();
const backendUrl = process.env.VITE_BACK_BASE_URL;
export default defineConfig({
  api: {
    input: `${backendUrl}/docs-json`,
    output: {
      target: "./src/api/api.ts",
      client: "react-query",
      mock: false,
      mode: "tags-split",
      schemas: "src/api/model",
      baseUrl: backendUrl,
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/lib/custom-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});
