import { createRoot } from "react-dom/client";
import "./index.css";
import { AdLinkProvider } from "./context/adStore.tsx";
import { AuthProvider } from "./context/authStore.tsx";
import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <AuthProvider>
      <AdLinkProvider>
        <AppRoutes />
      </AdLinkProvider>
    </AuthProvider>
  </Router>
);
