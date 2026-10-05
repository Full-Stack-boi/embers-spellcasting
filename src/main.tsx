import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import ExtensionApp from "./app/ExtensionApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ExtensionApp />
    </BrowserRouter>
  </StrictMode>,
);
