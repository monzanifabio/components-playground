import { defineConfig } from "vite";
import playground from "./vite/playground.js";

export default defineConfig({
  plugins: [playground()],
});
