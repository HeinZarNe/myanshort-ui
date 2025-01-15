import { useEffect, useState, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdLink } from "./types";
import { getAdDetials, modifyUrl } from "./api";
import { FaArrowLeft } from "react-icons/fa";
import { validateURL } from "./ShortUrl";
import { notify } from "./Routes";
import { CgSpinner } from "react-icons/cg";

export const LinkDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<AdLink | null>(null);
  const [isFetching, startFetching] = useTransition();
  const [updateName, setUpdateName] = useState<string | undefined>(
    data?.name || ""
  );
  const [updateLink, setUpdateLink] = useState<string | undefined>(
    data?.originalUrl || ""
  );
  const [updating, setUpdating] = useState<{ name: boolean; link: boolean }>({
    name: false,
    link: false,
  });
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
    startFetching(() => {
      fetchDetail();
    });
  }, [id]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateName(e.target.value);
  };
  const handleSubmitName = async () => {
    if (!id) return navigate("/");
    if (data && updateName) {
      try {
        await modifyUrl(id, updateName, updateLink);
        setData({ ...data, name: updateName });
        notify("Success", "success");
        setUpdating({ ...updating, name: false });
      } catch (error) {
        notify("Failed", "error");
      }
    }
  };
  const handleSubmitLink = () => {
    if (data && updateLink) {
      const valid = validateURL(updateLink);
      if (valid) {
        setData({ ...data, originalUrl: updateLink });
        notify("Success", "success");
        setUpdating({ ...updating, link: false });
      } else {
        notify("Invalid Url", "error");
      }
    }
  };
  const handleChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateLink(e.target.value);
  };
  if (isFetching || !data)
    return (
      <div className="flex items-center justify-center mt-40">
        <CgSpinner className="animate-spin text-blue-500 " size={50} />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center  p-2 sm:p-4">
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
        <div className="flex flex-col sm:flex-row flex-wrap  sm:gap-2  sm:items-center mb-4">
          <span className="font-semibold">Name:</span>
          <div className="flex items-center gap-3">
            {updating.name ? (
              <div className="flex flex-row items-center  gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={updateName || data.name}
                  onChange={handleChangeName}
                  className={`px-4 py-2 max-w-[200px] border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                    updateName?.length === 0
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  aria-invalid={updateName?.length === 0}
                  aria-describedby={
                    updateName?.length === 0 ? "error-message" : undefined
                  }
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={(_) => {
                      setUpdateName(data.name);
                      setUpdating({ ...updating, name: false });
                    }}
                    className=" px-3 py-1 rounded-md bg-gray-800 hover:scale-105 hover:ring-1 active:bg-gray-800 active:scale-100 active:ring-0 hover:ring-slate-700 hover:bg-black font-semibold text-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={
                      updateName?.length === 0 || updateName === data.name
                    }
                    onClick={(_) => handleSubmitName()}
                    className={`${
                      updateName?.length === 0 || updateName === data.name
                        ? "bg-gray-500"
                        : " bg-green-700 hover:scale-105 hover:ring-1 active:bg-green-800 active:scale-100 active:ring-0 hover:ring-green-700 hover:bg-green-600 hover:text-gray-100"
                    } cursor-pointer px-3 py-1 rounded-md font-semibold text-white  `}
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center gap-5">
                <p>{data.name}</p>
                <button
                  onClick={(_) => {
                    setUpdating({ ...updating, name: true });
                    setUpdateName(data.name);
                  }}
                  className=" px-3 py-1 rounded-md bg-gray-800 hover:scale-105 hover:ring-1 active:bg-gray-800 active:scale-100 active:ring-0 hover:ring-slate-700 hover:bg-black font-semibold text-gray-100"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap  sm:gap-2  sm:items-center mb-4">
          <span className="font-semibold">Original URL:</span>
          <div className="flex items-center gap-3">
            {updating.link ? (
              <div className="flex flex-row items-center  gap-5">
                <input
                  type="text"
                  name="link"
                  placeholder="Enter Name"
                  value={updateLink || ""}
                  onChange={handleChangeLink}
                  className={`px-4 py-2 max-w-[200px] border rounded-md focus:outline-none focus:ring-2 flex-1 ${
                    updateLink?.length != 0 || validateURL(updateLink || "")
                      ? "border-gray-300 focus:ring-blue-500"
                      : "border-red-500 focus:ring-red-500"
                  }`}
                  aria-invalid={updateLink?.length === 0}
                  aria-describedby={
                    updateLink?.length === 0 ? "error-message" : undefined
                  }
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={(_) => {
                      setUpdateLink(data.originalUrl);
                      setUpdating({ ...updating, link: false });
                    }}
                    className=" px-3 py-1 rounded-md bg-gray-800 hover:scale-105 hover:ring-1 active:bg-gray-800 active:scale-100 active:ring-0 hover:ring-slate-700 hover:bg-black font-semibold text-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={
                      updateLink?.length === 0 ||
                      updateLink === data.originalUrl ||
                      !validateURL(updateLink || "")
                    }
                    onClick={(_) => handleSubmitLink()}
                    className={`${
                      updateLink?.length === 0 ||
                      updateLink === data.originalUrl ||
                      !validateURL(updateLink || "")
                        ? "bg-gray-500"
                        : " bg-green-700 hover:scale-105 hover:ring-1 active:bg-green-800 active:scale-100 active:ring-0 hover:ring-green-700 hover:bg-green-600 hover:text-gray-100"
                    } cursor-pointer px-3 py-1 rounded-md font-semibold text-white  `}
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center gap-5">
                <a
                  className="text-blue-500 break-words"
                  href={data.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.originalUrl}
                </a>
                <button
                  onClick={(_) => {
                    setUpdating({ ...updating, link: true });
                    setUpdateLink(data.originalUrl);
                  }}
                  className=" px-3 py-1 rounded-md bg-gray-800 hover:scale-105 hover:ring-1 active:bg-gray-800 active:scale-100 active:ring-0 hover:ring-slate-700 hover:bg-black font-semibold text-gray-100"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap  sm:gap-2  sm:items-center mb-4">
          <span className="font-semibold">Ad Link :</span>
          <a
            className="text-blue-500 break-words"
            href={`${location.origin}/ad/${data.shortId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${location.origin}/ad/${data.shortId}`}
          </a>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap  sm:gap-2  sm:items-center mb-4">
          <span className="font-semibold">Clicks :</span>
          <span>{data.clicks}</span>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap  sm:gap-2  sm:items-center mb-4">
          <span className="font-semibold">Created At :</span>
          <span>
            {new Date(data.createdAt).toLocaleDateString()}
            {new Date(data.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap  sm:gap-2  sm:items-center mb-4">
          <span className="font-semibold">Updated At :</span>
          <span>
            {new Date(data.createdAt).toLocaleDateString()}
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
