import AdLinkList from "./AdLinkList";
import { Header } from "./Header";
import ShortUrl from "./ShortUrl";

export default function Home() {
  return (
    <div className="max-w-screen min-h-screen flex flex-col p-2 sm:p-5 pt-10 gap-5  items-center">
      <Header />
      <ShortUrl />
      <AdLinkList />
    </div>
  );
}
