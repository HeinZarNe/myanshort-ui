import { useContext, useRef, useState } from "react";
import { shortenUrl } from "./api";
import { AdLinkContext } from "./context/adStore";
import dayjs from "dayjs";
import { FaClipboard } from "react-icons/fa";
import { AdLink } from "./types";
import { notify } from "./Routes";
import { useAuth } from "./context/authStore";

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
  const { isAuthenticated, user } = useAuth();
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
      const response = await shortenUrl(inputValue, user?.id);
      console.log(user);
      if (!response || !response.shortId) {
        notify("Error: Invalid response from server", "error");
        return;
      }

      setShortId(response.shortId);
      notify("URL shortened successfully!", "success");

      const newAd: AdLink = isAuthenticated
        ? {
            userId: user?.id,
            originalUrl: inputValue,
            shortId: response.shortId,
            clicks: 0,
            createdAt: dayjs().toISOString(),
          }
        : {
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
    <div className="flex flex-col items-center  p-2 w-full xs:w-fit">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row justify-center flex-wrap items-center  gap-4 w-full xs:w-fit"
      >
        <input
          type="text"
          placeholder="Enter link"
          value={inputValue}
          onChange={handleChange}
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 flex-1 ${
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
        <div className="mt-4 p-1 w-full xs:w-fit sm:p-2 bg-green-100 border border-green-400 rounded-md flex flex-col sm:flex-row items-center">
          <span className="text-green-700">New Link: </span>
          <div className="flex flex-row items-center max-w-[250px] p-1 sm:p-2 gap-1 sm:gap-2">
            <a
              href={`${location.origin}/ad/${shortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className=" text-blue-500 underline truncate overflow-hidden"
            >
              {`${location.origin}/ad/${shortId}`}
            </a>
            <button
              onClick={copyToClipboard}
              className=" text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              <FaClipboard />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
