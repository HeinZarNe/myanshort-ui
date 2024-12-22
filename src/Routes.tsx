import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdPage from "./AdPage";
import Home from "./Home";
import Profile from "./Profile";
import Register from "./auth/Register";

function AppRoutes() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ad/:shortId" element={<AdPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default AppRoutes;
