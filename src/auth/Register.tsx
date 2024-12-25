import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { notify } from "../Routes";
import { useAuth } from "../context/authStore";
import { GoogleOauth } from "../GoogleOauth";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { isAuthenticated, loading } = useAuth();
  const [errors, setErrors] = useState<
    Partial<typeof formData> & { server?: string }
  >({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form data
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Submit form data to the server
      const response = await registerUser(formData);

      if (response?.status === 201) {
        notify("A Verification email is sent to your email.", "success");
        navigate("/");
      }
    } catch (error) {
      console.error("Error registering user:", error);

      if ((error as any).status == 409) {
        notify("Email already exists", "error");
        setErrors({ server: "Email already exists" });
      } else {
        notify("Failed to register user", "error");
        setErrors({ server: "Failed to register user" });
      }
    }
  };

  const validateForm = (data: typeof formData) => {
    const errors: Partial<typeof formData> = {};
    if (!data.username) errors.username = "Username is required";
    if (!data.email) errors.email = "Email is required";
    if (!data.password) errors.password = "Password is required";
    if (data.password !== data.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };
  if (loading) {
    return "";
  }
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <div className="container mx-auto px-2 py-4 sm:p-4 flex flex-col gap-5  items-center">
      <div className="w-full sm:w-[450px] mx-auto bg-white shadow-lg rounded-lg p-2 py-4 sm:p-5">
        <GoogleOauth />
        <p className="text-gray-600">or</p>
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                !errors.username
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                !errors.email
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
          {errors.server && (
            <p className="text-red-500 text-sm">{errors.server}</p>
          )}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-sm mt-3">
          Already have an account?
          <a href="/Login" className="text-blue-700 ms-1">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
