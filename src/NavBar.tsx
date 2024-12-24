import { BiUserCircle } from "react-icons/bi";
import { useAuth } from "./context/authStore";
import { Logo } from "./Logo";
import { useLocation } from "react-router-dom";

export const NavBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <div
      className={`flex flex-row gap-3 items-center justify-between shadow-md p-2 sm:px-5 ${
        location.pathname.includes("/ad") ? "bg-gray-700" : ""
      }`}
    >
      <Logo />
      <div>
        {!user ? (
          <a
            href={location.pathname === "/login" ? "/register" : "/login"}
            className="text-blue-900 font-semibold hover:text-blue-500"
          >
            {location.pathname === "/login" ? "Register" : "Login"}
          </a>
        ) : !location.pathname.includes("/ad") ? (
          <a href="/profile" className="">
            <BiUserCircle
              size={35}
              className="text-blue-900 hover:text-blue-500"
            />
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
