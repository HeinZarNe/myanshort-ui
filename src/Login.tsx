import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "./api";
import { notify } from "./Routes";
import { useAuth } from "./context/authStore";
import { GoogleOauth } from "./GoogleOauth";
import { CgSpinner } from "react-icons/cg";

export default function Login() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");

  useEffect(() => {
    if (message) {
      notify(message, "success");
      window.history.replaceState({}, document.title, "/login");
    } else if (error) {
      notify(error, "error");
      window.history.replaceState({}, document.title, "/login");
    }
  }, []);

  const [errors, setErrors] = useState<
    Partial<typeof formData> & { server?: string }
  >({});
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form data
    setLoading(true);
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      setErrors(newErrors);
      return;
    }

    try {
      // Submit form data to the server
      const response = await loginUser(formData);
      if (response?.status === 200) {
        notify(response.data.message, "success");
        login(
          response.data.token,
          response.data.refreshToken,
          response.data.user
        );
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error Login user:", error);
      setErrors({ usernameOrEmail: " ", password: " " });
      notify("Double-check your credentials and try again.", "error");
    }
    setLoading(false);
  };

  const validateForm = (data: typeof formData) => {
    const errors: Partial<typeof formData> = {};
    if (!data.usernameOrEmail)
      errors.usernameOrEmail = "Username/Email is required";
    if (!data.password) errors.password = "Password is required";
    return errors;
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <div className="container mx-auto p-4 flex flex-col gap-5  items-center ">
      <div className="w-full sm:w-[350px] mx-auto bg-white shadow-lg rounded-lg p-5 border border-gray-200">
        <GoogleOauth />
        <p className="text-gray-600">or</p>
        <h1 className="text-2xl font-bold mb-4 ">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className={`px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                !errors.usernameOrEmail
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {errors.usernameOrEmail && (
              <p className="text-red-500 text-sm">{errors.usernameOrEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                !errors.password
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {errors.server && (
            <p className="text-red-500 text-sm">{errors.server}</p>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm  font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-1"
            >
              {loading ? <CgSpinner className="animate-spin" /> : ""}
              Login
            </button>
          </div>
        </form>
        <div className="flex flex-row items-center justify-end ">
          <a
            href="/forgot-password"
            className="text-blue-600  text-sm  mt-1 cursor-pointer"
          >
            Forgot password
          </a>
        </div>
        <p className="text-sm mt-3">
          Create new account -
          <a href="/Register" className="text-blue-700 ms-1">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
