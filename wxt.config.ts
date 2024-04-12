import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    name: "lightcone",
    permissions: [
      "contextMenus",
      "identity",
      "storage",
      "tabs",
      "activeTab",
      "cookies",
      "scripting",
    ],
    host_permissions: ["*://app.arkive.site/*"],
  },
});
