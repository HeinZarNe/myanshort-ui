import { useEffect, useState } from "react";
import RedirectBtn from "./RedirectBtn";
import { getOriginalUrl } from "./api";
import { useParams } from "react-router-dom";

function AdPage() {
  const { shortId } = useParams();
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const fetchUrl = async () => {
      if (shortId) {
        const response = await getOriginalUrl(shortId);
        const { originalUrl } = response.data;
        setUrl(originalUrl);
      }
    };
    fetchUrl();
  }, [shortId]);

  return (
    <>
      <div className="relative text-white text-lg flex flex-col bg-stone-900 max-w-screen min-h-screen items-center justify-center gap-2 p-3">
        <a href="#btn">Scroll down to get link ⬇</a>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <img
              key={index}
              src={`https://placehold.co/800x130/?text=Ads+${index + 1}`}
              className={``}
              alt="ads"
            />
          ))}
        <RedirectBtn link={url} />
      </div>
    </>
  );
}

export default AdPage;
