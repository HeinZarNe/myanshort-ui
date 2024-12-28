import { useContext, useRef, useState } from "react";
import { shortenUrl } from "./api";
import { AdLinkContext } from "./context/adStore";
import { FaClipboard } from "react-icons/fa";
import { AdLink } from "./types";
import { notify } from "./Routes";
import { useAuth } from "./context/authStore";
import { CgSpinner } from "react-icons/cg";

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
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shortId, setShortId] = useState<string>("");
  const lastSubmitTime = useRef<number | null>(null);
  const { user } = useAuth();
  const context = useContext(AdLinkContext);

  if (!context) {
    throw new Error("AdLinkList must be used within an AdLinkProvider");
  }

  const { data, setData } = context;
  const { isAuthenticated } = useAuth();
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortId("");
    const value = e.target.value;
    setLink(value);
    setIsValid(validateURL(value));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortId("");
    const value = e.target.value;
    setName(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = Date.now();

    if (lastSubmitTime.current && now - lastSubmitTime.current < 2000) {
      notify("Please wait before submitting again.", "error");
      return;
    }
    lastSubmitTime.current = now;
    if (!validateURL(link)) {
      setIsValid(false);
      notify("Invalid URL. Please enter a valid URL.", "error");
      return;
    }
    try {
      setLoading(true);
      const response = await shortenUrl(link, name, user?.id);
      if (!response || !response.newLink) {
        console.log(response);
        notify("Error: Invalid response from server", "error");
        setLoading(false);
        return;
      }
      setShortId(response.newLink.shortId);
      notify("URL shortened successfully!", "success");
      const newAd: AdLink = response.newLink;
      setLoading(false);
      !response.exists ? setData([newAd, ...data]) : "";
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);

      const status = (error as { status?: Number }).status;

      if (status === 409) {
        notify("URL is already shortened", "success");
      } else {
        notify("Error shortening URL. Please try again later.", "error");
      }
    }

    setLink("");
    setName("");
    setIsValid(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${location.origin}/ad/${shortId}`);
    notify("Link copied to clipboard!", "success");
  };

  return (
    <div className="flex flex-col items-center p-2 w-full xs:w-fit">
      <form
        onSubmit={handleSubmit}
        className={`flex ${
          isAuthenticated ? "flex-col items-start" : "flex-row items-center"
        } justify-center flex-wrap gap-2 w-full sm:w-[280px]`}
      >
        {isAuthenticated ? (
          <div className="flex flex-col w-full">
            <label htmlFor="name" className="font-semibold mb-1 text-gray-900">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={name}
              onChange={handleNameChange}
              className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                isValid
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
              aria-invalid={!isValid}
              aria-describedby={!isValid ? "error-message" : undefined}
            />
          </div>
        ) : (
          ""
        )}
        <div className="flex flex-col w-full">
          {isAuthenticated ? (
            <label htmlFor="link" className="font-semibold mb-1 text-gray-900">
              Link
            </label>
          ) : (
            ""
          )}
          <input
            type="text"
            name="link"
            placeholder="google.com"
            value={link}
            onChange={handleLinkChange}
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 flex-1 ${
              isValid
                ? "border-gray-300 focus:ring-blue-500"
                : "border-red-500 focus:ring-red-500"
            }`}
            aria-invalid={!isValid}
            aria-describedby={!isValid ? "error-message" : undefined}
          />
        </div>

        <button
          type="submit"
          className="px-4 mt-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-1"
        >
          {loading ? <CgSpinner className="animate-spin" /> : ""}
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
          <span className="text-green-700">Ad Link: </span>
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
