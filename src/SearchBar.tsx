import { useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { AdLinkContext } from "./contexStore";

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
}: {
  placeholder?: string;
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const context = useContext(AdLinkContext);
  if (!context) {
    throw new Error("AdLinkList must be used within an AdLinkProvider");
  }
  const { data } = context;
  useEffect(() => {
    setQuery("");
  }, [data]);
  const handleSearch = (text: string) => {
    onSearch(text);
  };

  return (
    <div className="flex items-center border-b border-gray-300 py-2">
      <FaSearch className="text-gray-500 mr-3" />
      <input
        type="text"
        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          if (e.target.value == "") {
            handleSearch("");
          }
          setQuery(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSearch(query);
          }
        }}
      />
      <button
        className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
        type="button"
        onClick={(_) => handleSearch(query)}
      >
        Search
      </button>
    </div>
  );
}
