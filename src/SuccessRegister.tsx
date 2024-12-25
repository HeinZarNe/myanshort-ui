import { MdEmail } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

export const SuccessRegister = () => {
  const [message] = useSearchParams();
  const email = message.get("email");
  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-10">
      <div className="bg-white shadow-lg rounded-md flex-col flex items-center justify-center p-3 sm:p-5 max-w-[400px] border text-gray-900 border-gray-200">
        <p className="text-xl font-semibold">Verify your email address</p>
        <MdEmail className="text-gray-400" size={70} />
        <p className="text-balance">
          A verification email has been successfully sent to{" "}
          <span className="font-semibold">{email}</span>. It may take a few
          minutes to arrive. If you don't receive the email, you can request it
          again here:{" "}
          <a
            href="/verify-email"
            className="text-blue-600 font-semibold hover:text-blue-500"
          >
            Request
          </a>
          .
        </p>
      </div>
    </div>
  );
};
