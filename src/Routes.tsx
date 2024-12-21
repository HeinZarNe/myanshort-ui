import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdPage from "./AdPage";
import Home from "./Home";

function AppRoutes() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/ad/:shortId" element={<AdPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default AppRoutes;
