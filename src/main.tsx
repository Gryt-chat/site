import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GrytProvider } from "@gryt/ui";
import "./index.css";
import App from "./App";

const tree = (
  <StrictMode>
    {/* Everything Gryt UI renders through a portal — dialogs, menus, tooltips —
        reads its theme from here rather than from the DOM it pops out of.
        `entry-server.tsx` wraps the same three, in the same order; a difference
        between the two is a hydration mismatch. */}
    <GrytProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GrytProvider>
  </StrictMode>
);

const root = document.getElementById("root")!;

/* Hydrate what the build already rendered, or mount from nothing.
   The check is what is actually in the element rather than a flag, because the
   two ways to arrive here are a prerendered file from nginx and `vite dev`,
   and only one of them has anything to hydrate. */
if (root.firstChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
