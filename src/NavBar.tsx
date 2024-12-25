import { BiHome, BiLogIn, BiUserCircle } from "react-icons/bi";
import { useAuth } from "./context/authStore";
import { Logo } from "./Logo";
import { useLocation } from "react-router-dom";

export const NavBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <div
      className={`flex flex-row gap-3 items-center justify-between shadow-md p-2 sm:px-5 ${
        location.pathname.includes("/ad") ? "bg-stone-900" : ""
      }`}
    >
      <Logo />
      <div>
        {!user && !location.pathname.includes("/ad") ? (
          <a
            href={location.pathname === "/login" ? "/register" : "/login"}
            className="text-blue-900 font-semibold hover:text-blue-500 flex items-center justify-center gap-1 border border-gray-300 hover:bg-gray-50   rounded-md px-2 py-1"
          >
            {location.pathname === "/login" ? "Register" : "Login"}
            <BiLogIn size={25} className="" />
          </a>
        ) : !location.pathname.includes("/ad") &&
          !location.pathname.includes("/profile") ? (
          <a href="/profile" className="">
            <BiUserCircle
              size={35}
              className="text-blue-900 hover:text-blue-500"
            />
          </a>
        ) : !location.pathname.includes("/ad") ? (
          <a href="/" className="">
            <BiHome size={30} className="text-blue-900 hover:text-blue-500" />
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
