import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "./Routes";
import { User } from "./types";
import { useAuth } from "./context/authStore";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    const loginWithData = () => {
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get("user");
      if (userParam) {
        const userJson = JSON.parse(userParam || "") as {
          token: string;
          refreshToken: string;
          user: User;
        };
        try {
          notify("Welcome", "success");
          login(userJson.token, userJson.refreshToken, userJson.user);
          navigate("/");
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };
    loginWithData();
  }, []);
  return <div></div>;
};

export default GoogleCallback;
