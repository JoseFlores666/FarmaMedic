import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom", 
    setupFiles: "./tests/setup.js",
       include: [
      "tests/pages/admin/AdminRuleta.test.jsx",
      "tests/pages/clients/Ruleta.test.jsx"
    ],
  },
});
