import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import { App } from "./components/App/App";

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById("app")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
