import { useContext, useEffect, useState, useMemo } from "react";
import { deleteAd, getAdLinks } from "./api";
import { AdLinkContext } from "./context/adStore";
import SearchBar from "./SearchBar";
import { FaBoxOpen, FaTable, FaTh } from "react-icons/fa";
import { notify } from "./Routes";
import { AdGridCard } from "./AdGridCard";
import { CgSpinner } from "react-icons/cg";
import { BsArrowClockwise } from "react-icons/bs";
import { AdTable } from "./AdTable";

export default function AdLinkList() {
  const context = useContext(AdLinkContext);
  if (!context) {
    throw new Error("AdLinkList must be used within an AdLinkProvider");
  }
  const { data, setData } = context;
  const [searchQuery, setSearchQuery] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSortByClicksDescending, setIsSortByClicksDescending] =
    useState(false);
  const [view, setView] = useState("table");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getAdLinks();
      setData(res || []);
      setIsLoading(false);
    };
    fetchData();
  }, [setData, refetch]);

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
              disabled={isLoading}
              onClick={() => setRefetch((prev) => !prev)}
              className={`border-r pr-1 border-black ${
                view === "table" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {isLoading ? (
                <CgSpinner
                  size={20}
                  className={`transition-transform ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
              ) : (
                <BsArrowClockwise />
              )}
            </button>
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
        <div className="flex items-center  justify-center font-semibold text-gray-300 h-[200px]">
          <FaBoxOpen size={100} />
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredAndSortedData.map((item, index) => (
            <AdGridCard key={index} item={item} handleDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <AdTable
            handleDelete={handleDelete}
            setIsSortByClicksDescending={setIsSortByClicksDescending}
            filteredAndSortedData={filteredAndSortedData}
            isSortByClicksDescending={isSortByClicksDescending}
          />
        </div>
      )}
    </div>
  );
}
