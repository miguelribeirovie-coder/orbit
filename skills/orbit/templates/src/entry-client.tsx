import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./fx.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Em produção o HTML vem pré-renderizado: hidrata. No dev, monta do zero.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
