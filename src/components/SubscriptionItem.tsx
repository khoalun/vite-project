import React from "react";
import { TSubscriptionItem } from "../types";

type TProp = {
  item: TSubscriptionItem;
  editItem: (item: TSubscriptionItem) => void;
  deleteItem: (id: number) => void;
  userName?: string;
  preferenceName?: string;
};

const SubscriptionItem: React.FC<TProp> = ({
  item,
  editItem,
  deleteItem,
  userName,
  preferenceName,
}) => {
  return (
    <li className="flex justify-between items-center bg-purple-700 text-white p-3 rounded-md">
      <span
        className={`cursor-pointer ${
          !item.enabled ? "line-through text-gray-400" : ""
        }`}
      >
        {!!preferenceName && `Preference name: ${preferenceName}`}
        {!!userName && ` - User's name: ${userName}`}
      </span>
      <div className="flex space-x-3">
        <button
          className="text-gray-300 hover:text-white transition-all"
          onClick={() => editItem(item)}
        >
          ✏️
        </button>
        <button
          className="text-red-500 hover:text-red-700 transition-all"
          onClick={() => deleteItem(item.id)}
        >
          🗑️
        </button>
      </div>
    </li>
  );
};

export default SubscriptionItem;
