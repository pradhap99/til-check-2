import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Self-hosted variable fonts (Phase A: Inter Variable UI, Geist Mono numerics).
import "@fontsource-variable/inter";
import "@fontsource-variable/geist-mono";

import "leaflet/dist/leaflet.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
