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
    EnvironmentPlugin({
      // List only the variables you need
      NODE_ENV: "development",
      API_URL: "http://localhost:3000", // Example
    }),
  ],
});
