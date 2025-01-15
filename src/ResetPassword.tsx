import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "./api";
import { notify } from "./Routes";
import { CgSpinner } from "react-icons/cg";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const email = new URLSearchParams(location.search).get("email");

  useEffect(() => {
    if (!token || !email) {
      notify("Something Wrong", "error");
      navigate("/login");
    }
  }, [token, navigate, email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!password || !confirmPassword) {
      setErrors({
        password: "Password is required",
        confirmPassword: "Confirm Password is required",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }
    try {
      if (email && token) {
        const response = await resetPassword(email, token, password);
        console.log(response);
        if (response?.status === 200) {
          notify("Password has been reset successfully.", "success");
          navigate("/login");
        } else {
          throw new Error(response?.statusText || "Unknown error");
        }
      } else {
        notify("Something went wrong", "error");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      notify("Failed to reset password. Please try again.", "error");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-5 items-center">
      <div className="w-full sm:w-[350px] mx-auto bg-white shadow-lg rounded-lg p-5 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className={`px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                !errors.confirmPassword
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-1"
            >
              {loading ? <CgSpinner className="animate-spin" /> : ""}
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
