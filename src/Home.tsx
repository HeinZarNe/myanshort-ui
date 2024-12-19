import { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { shortenUrl } from "./api";
export const validateURL = (url: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(url);
};
export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [shortId, setShortId] = useState<string>("");
  const lastSubmitTime = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortId("");
    const value = e.target.value;
    setInputValue(value);
    setIsValid(validateURL(value));
  };

  const notify = (message: string, type: "success" | "error") => {
    toast[type](message);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = Date.now();
    if (lastSubmitTime.current && now - lastSubmitTime.current < 2000) {
      return;
    }
    lastSubmitTime.current = now;

    if (!validateURL(inputValue)) {
      setIsValid(false);
      notify("Invalid URL", "error");
      return;
    }

    try {
      const data = await shortenUrl(inputValue);
      setShortId(data.shortId);
      notify("Valid URL", "success");
    } catch (error) {
      console.error("Error:", error);
      notify("Error shortening URL", "error");
    }

    setInputValue("");
    setIsValid(true);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-300">
      <div className="flex flex-col items-center space-y-2 p-4 bg-white shadow-md rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-row items-center space-x-4"
        >
          <input
            type="text"
            placeholder="Enter link"
            value={inputValue}
            onChange={handleChange}
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              isValid
                ? "border-gray-300 focus:ring-blue-500"
                : "border-red-500 focus:ring-red-500"
            }`}
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Ad
          </button>
        </form>
        {!isValid && <p className="text-red-500">Please enter a valid URL.</p>}
        {shortId && (
          <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded-md">
            <span className="text-green-700">New Link: </span>
            <a
              href={`${location.origin}/ad/${shortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {`${location.origin}/ad/${shortId}`}
            </a>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
