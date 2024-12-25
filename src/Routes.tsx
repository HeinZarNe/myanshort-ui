import { Route, Routes } from "react-router-dom";
import AdPage from "./AdPage";
import Home from "./Home";
import Profile from "./Profile";
import Register from "./auth/Register";
import Login from "./Login";
import { NavBar } from "./NavBar";
import { toast, ToastContainer } from "react-toastify";
import { EmailVerify } from "./EmailVerify";
import { Header } from "./Header";
import PrivateRoute from "./PrivateRoute";
import GoogleCallback from "./GoogleCallBack";
export const notify = (message: string, type: "success" | "error") => {
  toast[type](message);
};
function AppRoutes() {
  return (
    <div>
      <ToastContainer
        autoClose={3000}
        hideProgressBar
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        limit={2}
        position="top-right"
      />
      <NavBar />
      {location.pathname.includes("/ad") ? "" : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ad/:shortId" element={<AdPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/verify-email" element={<EmailVerify />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
