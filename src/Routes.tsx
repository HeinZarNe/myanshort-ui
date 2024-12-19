import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdPage from "./AdPage";
import Home from "./Home";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/ad/:shortId" element={<AdPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
