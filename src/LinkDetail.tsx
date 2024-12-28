import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdLink } from "./types";
import { getAdDetials } from "./api";
import { FaArrowLeft } from "react-icons/fa";

export const LinkDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<AdLink | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchDetail = async () => {
      try {
        const response = await getAdDetials(id);
        response ? setData(response) : console.error(response);
      } catch (error) {
        console.error("Error fetching link detail:", error);
      }
    };
    fetchDetail();
  }, [id]);

  if (!data) return <div></div>;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-2 sm:p-4">
      <div className="w-full mb-3 ">
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaArrowLeft />
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Link Details</h2>
        <div className="mb-4">
          <span className="font-semibold">Name: </span>
          {data.name}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Ad Link: </span>
          <a
            className="text-blue-500 break-words"
            href={`${location.origin}/ad/${data.shortId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${location.origin}/ad/${data.shortId}`}
          </a>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Original URL: </span>
          <a
            className="text-blue-500 break-words"
            href={data.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.originalUrl}
          </a>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Clicks: </span>
          <span>{data.clicks}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Created At: </span>
          <span>
            {new Date(data.createdAt).toLocaleDateString()}{" "}
            {new Date(data.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
