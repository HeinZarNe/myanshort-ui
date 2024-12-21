import { useState } from "react";
import { getClickCounts } from "./api";

export default function ShowCount() {
  const [count, setCount] = useState(0);
  const [shortId, setshortId] = useState("");
  async function fetchCount() {
    const { clicks } = await getClickCounts(shortId || "");
    setCount(clicks);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCount();
  };

  return (
    <div className="flex flex-col items-start space-y-2 p-4 bg-white shadow-md rounded-lg">
      <span className="text-lg font-semibold text-gray-700">
        Show Click Count
      </span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row justify-center flex-wrap items-center gap-4"
      >
        <input
          type="text"
          value={shortId}
          onChange={(e) => setshortId(e.target.value)}
          placeholder="Enter shortId"
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${"border-gray-300 focus:ring-blue-500"}`}
        />

        <button
          type="submit"
          className="sm:px-4 px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Ad
        </button>
      </form>
      <span className="font-semibold text-gray-600">Count : {count}</span>
    </div>
  );
}
