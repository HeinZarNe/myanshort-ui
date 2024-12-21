import { useContext, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { shortenUrl } from "./api";
import { AdLink, AdLinkContext } from "./contexStore";
import dayjs from "dayjs";
import { FaClipboard } from "react-icons/fa";

export const notify = (message: string, type: "success" | "error") => {
  toast[type](message);
};
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

export default function ShortUrl() {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [shortId, setShortId] = useState<string>("");
  const lastSubmitTime = useRef<number | null>(null);
  const context = useContext(AdLinkContext);

  if (!context) {
    throw new Error("AdLinkList must be used within an AdLinkProvider");
  }

  const { data, setData } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortId("");
    const value = e.target.value;
    setInputValue(value);
    setIsValid(validateURL(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = Date.now();

    if (lastSubmitTime.current && now - lastSubmitTime.current < 2000) {
      notify("Please wait before submitting again.", "error");
      return;
    }
    lastSubmitTime.current = now;

    if (!validateURL(inputValue)) {
      setIsValid(false);
      notify("Invalid URL. Please enter a valid URL.", "error");
      return;
    }

    try {
      const response = await shortenUrl(inputValue);

      if (!response || !response.shortId) {
        notify("Error: Invalid response from server", "error");
        return;
      }

      setShortId(response.shortId);
      notify("URL shortened successfully!", "success");

      const newAd: AdLink = {
        originalUrl: inputValue,
        shortId: response.shortId,
        clicks: 0,
        createdAt: dayjs().toISOString(),
      };

      setData([newAd, ...data]);
    } catch (error) {
      console.error("Error:", error);

      const status = (error as { status?: string }).status;

      if (status === "409") {
        notify("URL already exists", "error");
      } else {
        notify("Error shortening URL. Please try again later.", "error");
      }
    }

    setInputValue("");
    setIsValid(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${location.origin}/ad/${shortId}`);
    notify("Link copied to clipboard!", "success");
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-white shadow-md rounded-lg">
      <span className="text-lg font-semibold text-gray-700">Add Ads</span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row justify-center flex-wrap items-center gap-4"
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
          aria-invalid={!isValid}
          aria-describedby={!isValid ? "error-message" : undefined}
        />
        <button
          type="submit"
          className="sm:px-4 px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Ad
        </button>
      </form>
      {!isValid && (
        <p id="error-message" className="text-red-500" aria-live="polite">
          Please enter a valid URL.
        </p>
      )}
      {shortId && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded-md flex items-center">
          <span className="text-green-700">New Link: </span>
          <a
            href={`${location.origin}/ad/${shortId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500 underline"
          >
            {`${location.origin}/ad/${shortId}`}
          </a>
          <button
            onClick={copyToClipboard}
            className="ml-2 text-gray-500 hover:text-gray-700"
            title="Copy to clipboard"
          >
            <FaClipboard />
          </button>
        </div>
      )}
      <ToastContainer
        autoClose={1000}
        hideProgressBar
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        limit={2}
        position="top-right"
      />
    </div>
  );
}
