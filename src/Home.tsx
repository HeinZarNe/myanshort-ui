import AdLinkList from "./AdLinkList";
import ShortUrl from "./ShortUrl";

export default function Home() {
  return (
    <div className="max-w-screen min-h-screen flex flex-col p-5 pt-10 gap-5  items-center">
      <span className="text-3xl xs:text-5xl text-blue-500 font-bold">
        Myan Short
      </span>
      <ShortUrl />
      <AdLinkList />
    </div>
  );
}
