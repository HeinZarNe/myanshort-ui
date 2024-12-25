import { BsGoogle } from "react-icons/bs";
const API_URL = import.meta.env.VITE_BACKEND_API;

export const GoogleOauth = () => {
  return (
    <a
      href={`${API_URL}auth/google`}
      className="  w-full min-w-[280px] flex items-center gap-2 justify-center font-semibold text-gray-800 py-3 border border-gray-300 mb-3 cursor-pointer bg-white rounded-lg shadow-sm hover:bg-gray-100"
    >
      <BsGoogle size={30} className="text-blue-500" />
      <p>Sign in with Google</p>
    </a>
  );
};
