import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authStore";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, []);
  console.log(user);

  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(user);
  return <div>Profile</div>;
}
