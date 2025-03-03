import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import EnvironmentPlugin from "vite-plugin-environment";
import { visualizer } from "rollup-plugin-visualizer";


export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    EnvironmentPlugin('all', { prefix: 'VITE_' }),
    visualizer({
      open: true,           
      filename: 'stats.html', 
      gzipSize: true,       
      brotliSize: true,     
      template: 'treemap'  
    }) as PluginOption
  ],

});