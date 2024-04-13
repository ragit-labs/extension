import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  entrypointsDir: 'entrypoints',
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
    host_permissions: ["*://app.arkive.site/*", "<all_urls>"],
    commands: {
      "toggle-action-bar": {
        suggested_key: {
          default: "Ctrl+K",
          mac: "Command+K",
        },
        description: "Toggle the action bar",
      },
    }
  },
});
