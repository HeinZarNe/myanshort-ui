import { redirect, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RedirectBtn from "./RedirectBtn";

const AdPage = () => {
  const { shortId } = useParams();
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    Array(5).fill(false)
  );

  useEffect(() => {
    if (shortId?.length === 0) {
      redirect("/");
    }
  }, []);
  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  const allImagesLoaded = imagesLoaded.every((loaded) => loaded);

  return (
    <>
      <div className="relative text-white text-lg flex flex-col bg-stone-900 max-w-screen min-h-screen items-center justify-center gap-2 p-3">
        <a href="#btn">Get the Link ⬇</a>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <img
              key={index}
              src={`https://placehold.co/800x130/?text=Ads+${index + 1}`}
              className=""
              alt="ads"
              onLoad={() => handleImageLoad(index)}
            />
          ))}
        {allImagesLoaded && <RedirectBtn shortId={shortId || ""} />}
      </div>
    </>
  );
};

export default AdPage;
