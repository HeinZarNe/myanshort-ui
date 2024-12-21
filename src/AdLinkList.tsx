import { useContext, useEffect, useState, useMemo } from "react";
import { deleteAd, getAdLinks } from "./api";
import { AdLinkContext } from "./contexStore";
import SearchBar from "./SearchBar";
import { FaBoxOpen, FaSortDown, FaTable, FaTh } from "react-icons/fa";
import dayjs from "dayjs";
import { BiTrash } from "react-icons/bi";
import { notify } from "./ShortUrl";

export default function AdLinkList() {
  const context = useContext(AdLinkContext);
  if (!context) {
    throw new Error("AdLinkList must be used within an AdLinkProvider");
  }

  const { data, setData } = context;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortByClicksDescending, setIsSortByClicksDescending] =
    useState(false);
  const [view, setView] = useState("table");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const res = await getAdLinks();
      setData(res || []);
    };
    fetchData();
  }, [setData]);

  // Filtered and sorted data (using useMemo for efficiency)
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(
      (item) =>
        item.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isSortByClicksDescending) {
      filtered = [...filtered].sort((a, b) => b.clicks - a.clicks);
    }

    return filtered;
  }, [data, searchQuery, isSortByClicksDescending]);

  const handleSortClicks = () => {
    setIsSortByClicksDescending((prev) => !prev);
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteAd(id);
      // Optionally, update the state to remove the deleted item from the list
      setData([...data].filter((item) => item.shortId !== id));
      notify("Ad link deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting ad link:", error);
      notify("Failed to delete ad link", "error");
    }
  };
  return (
    <div className="container mx-auto sm:p-4 ">
      <div className="flex flex-row items-center justify-center sm:justify-between flex-wrap gap-1 mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Links</h1>
          <div className="flex flex-row items-center gap-1">
            <button
              onClick={() => setView("table")}
              className={`border-r pr-1 border-black ${
                view === "table" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <FaTable size={20} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={` ${
                view === "grid" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <FaTh size={20} />
            </button>
          </div>
        </div>
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search by URL or Short ID"
        />
      </div>

      {filteredAndSortedData.length === 0 ? (
        <div className="flex items-center  justify-center font-semibold text-gray-300">
          <FaBoxOpen size={100} />
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredAndSortedData.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md relative"
            >
              <div className="w-full">
                <p className="text-lg font-semibold">Original URL:</p>
                <div className="max-w-full truncate overflow-hidden whitespace-nowrap">
                  <a
                    className="text-blue-500 truncate overflow-hidden whitespace-nowrap"
                    href={item.originalUrl}
                    target="_blank"
                  >
                    {item.originalUrl}
                  </a>
                </div>
                <p className="text-lg font-semibold mt-2">Ad Link:</p>
                <div className="max-w-full truncate overflow-hidden whitespace-nowrap">
                  <a
                    className="text-blue-500 "
                    href={`${location.origin}/ad/${item.shortId}`}
                    target="_blank"
                  >
                    {`${location.origin}/ad/${item.shortId}`}
                  </a>
                </div>
                <p className="text-lg font-semibold mt-2">Click:</p>
                <p className="text-gray-700">{item.clicks}</p>
              </div>
              <div className="absolute top-5 right-3">
                <BiTrash
                  onClick={(_) => handleDelete(item.shortId)}
                  className="text-gray-600 hover:text-red-500 cursor-pointer hover:bg-stone-100  rounded-md bg-opacity-15"
                  size={20}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b whitespace-nowrap">
                  Original URL
                </th>
                <th className="px-4 py-2 border-b whitespace-nowrap">Ad Url</th>
                <th className="px-4 py-2 border-b whitespace-nowrap">
                  <div className="flex items-baseline">
                    Clicks
                    <button onClick={handleSortClicks} className="ml-2">
                      <FaSortDown
                        className={`h-full ${
                          isSortByClicksDescending
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-2 border-b whitespace-nowrap">
                  Created At
                </th>
                <th className="px-4 py-2 border-b whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b  whitespace-nowrap">
                    <a
                      className="text-blue-500 "
                      href={item.originalUrl}
                      target="_blank"
                    >
                      {item.originalUrl}
                    </a>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <a
                      className="text-blue-500 whitespace-nowrap"
                      href={`${location.origin}/ad/${item.shortId}`}
                      target="_blank"
                    >
                      {`${location.origin}/ad/${item.shortId}`}
                    </a>
                  </td>
                  <td className="px-4 py-2 border-b">{item.clicks}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {dayjs(item.createdAt).format("DD.MM.YYYY")}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <BiTrash
                      onClick={(_) => handleDelete(item.shortId)}
                      className="text-gray-600 hover:text-red-500 cursor-pointer hover:bg-stone-100  rounded-md bg-opacity-15"
                      size={20}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
