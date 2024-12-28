import dayjs from "dayjs";
import { BiTrash } from "react-icons/bi";
import { FaClipboard, FaSortDown } from "react-icons/fa";
import { AdTableProps } from "./types";
import { BsEyeFill } from "react-icons/bs";
import { notify } from "./Routes";

export const AdTable: React.FC<AdTableProps> = ({
  filteredAndSortedData,
  handleDelete,
  isSortByClicksDescending,
  setIsSortByClicksDescending,
}) => {
  const handleSortClicks = () => {
    setIsSortByClicksDescending((prev: boolean) => !prev);
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    notify("Link copied to clipboard!", "success");
  };

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b whitespace-nowrap">No.</th>
          <th className="px-4 py-2 border-b whitespace-nowrap">Name</th>
          <th className="px-4 py-2 border-b whitespace-nowrap">Original URL</th>
          <th className="px-4 py-2 border-b whitespace-nowrap">Ad Url</th>
          <th className="px-4 py-2 border-b whitespace-nowrap">
            <div className="flex items-baseline">
              Clicks
              <button onClick={handleSortClicks} className="ml-2">
                <FaSortDown
                  className={`h-full ${
                    isSortByClicksDescending ? "text-blue-500" : "text-gray-500"
                  }`}
                />
              </button>
            </div>
          </th>
          <th className="px-4 py-2 border-b whitespace-nowrap">Created At</th>
          <th className="px-4 py-2 border-b whitespace-nowrap"></th>
        </tr>
      </thead>
      <tbody>
        {filteredAndSortedData.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="px-4 py-2 border-b  max-w-[200px] sm:max-w-[500px]  ">
              {index + 1}
            </td>{" "}
            <td className="px-4 py-2 border-b   sm:max-w-[500px] min-w-[200px] ">
              {item.name || "-"}
            </td>
            <td className="px-4 py-2 border-b max-w-[350px] min-w-[200px]   ">
              <div className="flex items-center gap-1 relative break-words overflow-hidden">
                <a
                  className="text-blue-500 "
                  href={item.originalUrl}
                  target="_blank"
                >
                  {item.originalUrl}
                </a>
                <button
                  onClick={(_) => copyToClipboard(item.originalUrl)}
                  className="absolute top-0 bg-white px-1 h-full right-0 text-gray-500 hover:text-gray-700"
                  title="Copy"
                >
                  <FaClipboard />
                </button>
              </div>
            </td>
            <td className="px-4 py-2 border-b max-w-[350px] min-w-[200px]   ">
              <div className="flex items-center gap-1 relative break-words overflow-hidden">
                <a
                  className="text-blue-500 "
                  href={`${location.origin}/ad/${item.shortId}`}
                  target="_blank"
                >
                  {`${location.origin}/ad/${item.shortId}`}
                </a>
                <button
                  onClick={(_) =>
                    copyToClipboard(`${location.origin}/ad/${item.shortId}`)
                  }
                  className="absolute top-0 bg-white px-1 h-full right-0 text-gray-500 hover:text-gray-700"
                  title="Copy"
                >
                  <FaClipboard />
                </button>
              </div>
            </td>
            <td className="px-4 py-2 border-b">{item.clicks}</td>
            <td className="px-4 py-2 border-b text-center">
              {dayjs(item.createdAt).format("DD.MM.YYYY")}
            </td>
            <td className="px-4 py-2 border-b text-center flex items-baseline justify-center gap-3">
              <div>
                <BiTrash
                  onClick={(_) => handleDelete(item.shortId)}
                  className="text-gray-600 hover:text-red-500 cursor-pointer hover:bg-stone-100  rounded-md bg-opacity-15"
                  size={20}
                />
              </div>
              <div>
                <a href={`/links/${item._id}`}>
                  <BsEyeFill
                    className="text-gray-600 hover:text-blue-500 cursor-pointer hover:bg-stone-100  rounded-md bg-opacity-15"
                    size={20}
                  />
                </a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
