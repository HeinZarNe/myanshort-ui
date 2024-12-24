import AdLinkList from "./AdLinkList";
import { useAuth } from "./context/authStore";
import ShortUrl from "./ShortUrl";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  return (
    <div className="max-w-screen  flex flex-col p-2   gap-1  items-center">
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
        <span className="text-yellow-600 max-w-[450px] text-center text-sm  text-">
          Please note that you need to log in or create a new account to save
          URLs and view their stats.
        </span>
      )}
    </div>
  );
}
