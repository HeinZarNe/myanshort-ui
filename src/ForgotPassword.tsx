import { useState } from "react";
import { forgotPassword } from "./api";
import { notify } from "./Routes";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({});
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      setErrors({ email: "Email is required" });
      setLoading(false);
      return;
    }
    try {
      const response = await forgotPassword(email);
      if (response?.status === 200) {
        notify("An email has been sent to reset your password.", "success");
      }
      navigate("/login");
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      notify("Failed to send email. Please try again.", "error");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-5 items-center">
      <div className="w-full sm:w-[350px] mx-auto bg-white shadow-lg rounded-lg p-5 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-1"
            >
              {loading ? <CgSpinner className="animate-spin" /> : ""}
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
