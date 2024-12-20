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
  plugins: [react(), tsconfigPaths(), EnvironmentPlugin("all")],
});
