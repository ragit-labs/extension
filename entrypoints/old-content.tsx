import ReactDOM from "react-dom/client";
import App from "./content/App.tsx";
import "./content/content.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateBlockNote } from "@blocknote/react";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const queryClient = new QueryClient();
    console.log(queryClient);
    const ui = await createShadowRootUi(ctx, {
      name: "example-ui",
      position: "inline",
      onMount: (container) => {
        const app = document.createElement("div");
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>,
        );
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
