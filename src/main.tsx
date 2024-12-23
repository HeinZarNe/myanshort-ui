import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AdLinkProvider } from "./context/adStore.tsx";
import { AuthProvider } from "./context/authStore.tsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home.tsx";
import AdPage from "./AdPage.tsx";
import Profile from "./Profile.tsx";
import Register from "./auth/Register.tsx";
import Login from "./Login.tsx";
import AppRoutes from "./Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <AdLinkProvider>
          <AppRoutes />
        </AdLinkProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
