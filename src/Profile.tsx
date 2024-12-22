import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "./api";

export default function Profile() {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const userData = query.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Fetch user data from backend if not available in query params
      const fetchProfile = async () => {
        try {
          const res = await getProfile();
          const data = res?.data;
          if (data) {
            setUser(data);
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          navigate("/");
        }
      };
      fetchProfile();
    }
  }, []);
  console.log(user);

  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(user);
  return <div>Profile</div>;
}
