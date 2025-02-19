import { useState } from "react";
import { verifyEmail } from "./api";
import { notify } from "./Routes";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

export const EmailVerify = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.length === 0) {
      setError("Email is required");
      return;
    } else {
      setError("");
    }

    try {
      setLoading(true);
      // Submit form data to the server
      await verifyEmail(email);

      notify("Verification Email Sent", "success");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);

      if ((error as any)?.status === 400) {
        setLoading(false);
        notify("User is aready verified", "error");
        navigate("/login");
      } else if ((error as any)?.status === 404) {
        notify("User with this email is not found", "error");
        navigate("/register");
      } else if ((error as any)?.status === 500) {
        notify("Internal server error", "error");
        navigate("/register");
      }
      notify((error as any).data.message, "error");
      setError((error as any).data.message);
    }
  };
  return (
    <div className="flex flex-col items-center gap-5 p-2 py-4 sm:p-5">
      <div className="p-2 py-4 sm:p-5 shadow-lg gap-1 rounded-lg flex flex-col bg-white ">
        <div>
          <span className="text-lg ">Request Verification Email</span>
          <p className="text-gray-700 text-sm">
            Enter your registered email to sent verification email
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start gap-3"
        >
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className={`px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                error.length > 0
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {error.length > 0 && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-2 flex items-center justify-center gap-1 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? <CgSpinner className="animate-spin" /> : ""}
              Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
