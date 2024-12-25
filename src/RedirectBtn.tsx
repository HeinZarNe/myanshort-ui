import { useState, useEffect, useRef } from "react";

export default function RedirectBtn({ shortId }: { shortId: string }) {
  const [counter, setCounter] = useState(10);
  const [isDisabled, setIsDisabled] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (counter > 0) {
      timerRef.current = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setIsDisabled(false);
    }

    const handleBlur = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

    const handleFocus = () => {
      if (counter > 0) {
        timerRef.current = setTimeout(() => setCounter(counter - 1), 1000);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [counter]);

  const formatLink = (shortId: string) => {
    const api = import.meta.env.VITE_BACKEND_API;
    const url = `${api}/urls/${shortId}`;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div
      id="btn"
      className={`w-fit py-1 px-3 rounded-sm text-lg flex items-center justify-center text-white ${
        isDisabled ? "bg-gray-500" : "bg-red-500"
      }`}
    >
      <a
        href={isDisabled ? "#" : formatLink(shortId)}
        className={isDisabled ? "pointer-events-none" : ""}
      >
        {isDisabled ? `wait ${counter}s` : "Go to Link"}
      </a>
    </div>
  );
}
