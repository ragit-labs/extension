import ReactDOM from "react-dom/client";
import App from "./content/App.tsx";
import "./content/content.css";
import { Readability } from "@mozilla/readability";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "example-ui",
      position: "inline",
      onMount: (container) => {
        const app = document.createElement("div");
        container.append(app);
        var documentClone = document.cloneNode(true); 
        // @ts-ignore
        const article = new Readability(documentClone).parse();
        const root = ReactDOM.createRoot(app);
        // @ts-ignore
        root.render(<App article={article} />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
