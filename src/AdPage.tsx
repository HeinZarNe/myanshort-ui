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
      <div className="relative text-white text-lg flex flex-col min-h-[calc(100vh-64px)] items-center justify-center bg-stone-900 max-w-screen  gap-2 p-3">
        <a href="#btn" className="text-center">
          Get the Link ⬇
        </a>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="w-full">
              <img
                src={`https://placehold.co/280x60/?text=Ads+${index + 1}`}
                className="w-full"
                alt="ads"
                onLoad={() => handleImageLoad(index)}
              />
            </div>
          ))}
        {allImagesLoaded && <RedirectBtn shortId={shortId || ""} />}
      </div>
    </>
  );
};

export default AdPage;
