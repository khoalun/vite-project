import React from "react";

const Buttons: React.FC<{
  handlePreferencesClick: () => void;
  handleSubscriptionsClick: () => void;
}> = ({ handlePreferencesClick, handleSubscriptionsClick }) => {
  return (
    <div className="flex justify-between">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition-all"
        onClick={() => handlePreferencesClick()}
      >
        Preferences
      </button>
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-600 transition-all"
        onClick={() => handleSubscriptionsClick()}
      >
        Subscriptions
      </button>
    </div>
  );
};

export default Buttons;
