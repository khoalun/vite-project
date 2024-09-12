import React from "react";
import { TPreferenceItem } from "../types";

type TProp = {
  item: TPreferenceItem;
  editItem: (item: TPreferenceItem) => void;
  deleteTodo: (id: number) => void;
};

const PreferenceItem: React.FC<TProp> = ({ item, editItem, deleteTodo }) => {
  return (
    <li className="flex justify-between items-center bg-purple-700 text-white p-3 rounded-md">
      <div className="flex flex-col">
        <span
          className={`cursor-pointer
        `}
          // onClick={() => toggleComplete(item.id)}
        >
          Name: {item.name}
        </span>
        <span>Description: {item.description}</span>
      </div>
      <div className="flex space-x-3">
        <button
          className="text-gray-300 hover:text-white transition-all"
          onClick={() => editItem(item)}
        >
          ✏️
        </button>
        <button
          className="text-red-500 hover:text-red-700 transition-all"
          onClick={() => deleteTodo(item.id)}
        >
          🗑️
        </button>
      </div>
    </li>
  );
};

export default PreferenceItem;
