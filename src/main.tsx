import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Self-hosted fonts.
// Inter Variable — body / UI. Cormorant Garamond 500 + 500-italic — display / brand.
import "@fontsource-variable/inter";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";

import "leaflet/dist/leaflet.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
