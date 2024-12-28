import React from "react";
import { BiTrash } from "react-icons/bi";
import { AdGridCardProps } from "./types";

export const AdGridCard = React.memo(
  ({ item, handleDelete }: AdGridCardProps) => {
    const {} = item;
    return (
      <div className="p-4 border rounded-lg shadow-md relative">
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
    );
  }
);
