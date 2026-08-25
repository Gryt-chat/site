import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GrytProvider } from "@gryt/ui";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Everything Gryt UI renders through a portal — dialogs, menus, tooltips —
        reads its theme from here rather than from the DOM it pops out of. */}
    <GrytProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GrytProvider>
  </StrictMode>
);
