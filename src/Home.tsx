import { useSearchParams } from "react-router-dom";
import AdLinkList from "./AdLinkList";
import { useAuth } from "./context/authStore";
import ShortUrl from "./ShortUrl";
import { useEffect } from "react";
import { notify } from "./Routes";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");

  useEffect(() => {
    if (message) {
      notify(message, "success");
      window.history.replaceState({}, document.title, "/login");
    } else if (error) {
      notify(error, "error");
      window.history.replaceState({}, document.title, "/login");
    }
  }, []);
  return (
    <div className="max-w-screen  flex flex-col p-2 gap-1  items-center">
      <h1 className="text-xl sm:text-3xl font-bold text-center">
        Welcome to URL Shortener
      </h1>
      <p className="text-center text-sm text-gray-800">
        Shorten your URLs and track their performance.
      </p>
      <ShortUrl />
      {loading ? (
        ""
      ) : isAuthenticated ? (
        <AdLinkList />
      ) : (
        <span className="text-yellow-600  max-w-[450px] text-center text-sm">
          Please be aware that you must log in or create a new account to save
          URLs and access their statistics.
          <span className="font-semibold mx-1">
            Additionally, URLs will be deleted after 5 days.
          </span>
        </span>
      )}
    </div>
  );
}
