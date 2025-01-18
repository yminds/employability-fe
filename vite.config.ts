import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    EnvironmentPlugin([
      "VITE_X_API_KEY",
      "VITE_API_BASE_URL",
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_REGION",
      "AWS_S3_BUCKET_NAME",
    ]),
  ],
});
