import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Self-hosted variable fonts.
// Inter Variable — body / UI. Cormorant Garamond Variable — wordmark + editorial display.
import "@fontsource-variable/inter";
import "@fontsource-variable/cormorant-garamond";

import "leaflet/dist/leaflet.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
