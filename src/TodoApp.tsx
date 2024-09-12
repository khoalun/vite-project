import React, { useEffect, useMemo, useState } from "react";
import supabaseClient from "./api";
import Buttons from "./components/Buttons";
import { generateSmallestUniqueId } from "./utils";
import PreferenceItem from "./components/PreferenceItem";
import SubscriptionItem from "./components/SubscriptionItem";
import {
  ListingType,
  TPreferenceItem,
  TSubscriptionItem,
  TUser,
} from "./types";
const TodoApp: React.FC = () => {
  const [selectedListingType, setSelectedListingType] = useState(
    ListingType.PREFERENCES
  );
  const [actionStatus, setActionStatus] = useState<"add" | "update">("add");

  const [preferenceItems, setPreferenceItems] = useState<TPreferenceItem[]>([]);
  const [subscriptionItems, setSubscriptionItems] = useState<
    TSubscriptionItem[]
  >([]);
  const [users, setUsers] = useState<TUser[]>([]);
  const [preferenceName, setPreferenceName] = useState<string>("");
  const [preferenceDescription, setPreferenceDescription] =
    useState<string>("");
  const [editItemId, setEditItemId] = useState<number>(0);

  const [selectedPreferenceId, setSelectedPreferenceId] = useState<number>(0);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [enabledStatus, setEnabledStatus] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsersList = async () => {
      const usersRes = await supabaseClient.get<TUser[]>(`/users?select=*`);
      if (usersRes.data) {
        setUsers(usersRes.data);
      }
    };
    fetchUsersList();
  }, []);

  useEffect(() => {
    const fetchListingItems = async () => {
      const listingItemsRes = await supabaseClient.get<
        TPreferenceItem[] | TSubscriptionItem[]
      >(`/${selectedListingType}?select=*`);

      if (listingItemsRes?.data) {
        if (selectedListingType === ListingType.PREFERENCES) {
          setPreferenceItems(listingItemsRes.data as TPreferenceItem[]);
        } else {
          setSubscriptionItems(listingItemsRes.data as TSubscriptionItem[]);
        }
      }
    };
    if (!preferenceItems?.length || !subscriptionItems?.length) {
      fetchListingItems();
    }
  }, [selectedListingType, preferenceItems, subscriptionItems]);

  const addPreference = async () => {
    if (preferenceName !== "" && preferenceDescription !== "") {
      const id = generateSmallestUniqueId(preferenceItems?.map(({ id }) => id));
      const payload = {
        id,
        name: preferenceName,
        description: preferenceDescription,
      };
      const res = await supabaseClient.post(`/${selectedListingType}`, payload);
      if (res.status === 201) {
        setPreferenceItems([...preferenceItems, payload]);
      }

      resetState();
    }
  };

  const addSubscription = async () => {
    if (selectedPreferenceId !== 0 && selectedUserId !== "") {
      const id = generateSmallestUniqueId(
        subscriptionItems?.map(({ id }) => id)
      );
      const payload = {
        id,
        enabled: enabledStatus,
        preference_id: selectedPreferenceId,
        user_id: selectedUserId,
      };
      const res = await supabaseClient.post(`/${selectedListingType}`, payload);
      if (res.status === 201) {
        setSubscriptionItems([...subscriptionItems, payload]);
      }

      resetState();
    }
  };

  const editPreference = async (id: number) => {
    if (preferenceName !== "" && preferenceDescription !== "" && id !== 0) {
      const payload = {
        name: preferenceName,
        description: preferenceDescription,
      };
      const res = await supabaseClient.patch(
        `/${selectedListingType}?id=eq.${id}`,
        payload
      );
      if (res.status === 204) {
        setPreferenceItems(
          preferenceItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...payload,
                }
              : item
          )
        );
      }
      resetState();
    }
  };

  const editSubscription = async (id: number) => {
    if (selectedPreferenceId !== 0 && selectedUserId !== "" && id !== 0) {
      const payload = {
        preference_id: selectedPreferenceId,
        user_id: selectedUserId,
        enabled: enabledStatus,
      };
      const res = await supabaseClient.patch(
        `/${selectedListingType}?id=eq.${id}`,
        payload
      );
      if (res.status === 204) {
        setSubscriptionItems(
          subscriptionItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...payload,
                }
              : item
          )
        );
      }
      resetState();
    }
  };

  const deletePreference = async (id: number) => {
    try {
      const res = await supabaseClient.delete(
        `/${selectedListingType}?id=eq.${id}`
      );

      if (res.status === 204) {
        setPreferenceItems(preferenceItems.filter((item) => item.id !== id));
      }
    } catch (error: any) {
      alert(
        !!error?.message
          ? error?.message
          : "Failed to delete the preference, please try again!"
      );
    }
    resetState();
  };

  const deleteSubscription = async (id: number) => {
    try {
      const res = await supabaseClient.delete(
        `/${selectedListingType}?id=eq.${id}`
      );
      if (res.status === 204) {
        setSubscriptionItems(
          subscriptionItems.filter((item) => item.id !== id)
        );
      }
    } catch (error: any) {
      alert(
        !!error?.message
          ? error?.message
          : "Failed to delete the subscription, please try again!"
      );
    }
    resetState();
  };

  const resetState = () => {
    setActionStatus("add");
    setPreferenceDescription("");
    setPreferenceName("");
    setEditItemId(0);
    setSelectedUserId("");
    setSelectedPreferenceId(0);
    setEnabledStatus(false);
  };

  const preferenceHandleBtnDisabled = useMemo(() => {
    if (selectedListingType === ListingType.PREFERENCES) {
      return actionStatus === "update"
        ? preferenceName === "" ||
            preferenceDescription === "" ||
            editItemId === 0
        : preferenceName === "" || preferenceDescription === "";
    } else {
      return false;
    }
  }, [
    actionStatus,
    editItemId,
    preferenceDescription,
    preferenceName,
    selectedListingType,
  ]);

  const subscriptionHandleBtnDisabled = useMemo(() => {
    if (selectedListingType === ListingType.SUBSCRIPTIONS) {
      return selectedPreferenceId === 0 || selectedUserId === "";
    } else {
      return false;
    }
  }, [selectedPreferenceId, selectedUserId, selectedListingType]);

  const handleButton = () => {
    return (
      <button
        className={`${
          actionStatus === "update" ? "w-1/2" : "w-full"
        } mt-3 p-3 bg-purple-700 text-white rounded-md hover:bg-purple-600 transition-all ${
          preferenceHandleBtnDisabled || subscriptionHandleBtnDisabled
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={() => {
          if (selectedListingType === ListingType.SUBSCRIPTIONS) {
            if (actionStatus === "update") {
              editSubscription(editItemId);
            } else {
              addSubscription();
            }
          } else {
            actionStatus === "update"
              ? editPreference(editItemId)
              : addPreference();
          }
        }}
        disabled={subscriptionHandleBtnDisabled || preferenceHandleBtnDisabled}
      >
        {selectedListingType === ListingType.SUBSCRIPTIONS
          ? actionStatus === "update"
            ? "Update subscription"
            : "Add subscription"
          : actionStatus === "update"
          ? "Update preference"
          : "Add preference"}
      </button>
    );
  };

  const handleSelectedPreferenceId = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPreferenceId(Number(event.target.value));
  };

  const handleSelectedUserId = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedUserId(event.target.value);
  };
  return (
    <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-purple-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Get Things Done!
        </h1>

        <div className="mb-4">
          {selectedListingType === ListingType.SUBSCRIPTIONS ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-white">
                Preferences:{" "}
              </label>
              <select
                value={selectedPreferenceId}
                onChange={handleSelectedPreferenceId}
              >
                <option value={0} disabled>
                  Select an option
                </option>
                {preferenceItems?.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <label htmlFor="" className="text-white">
                Users:{" "}
              </label>
              <select value={selectedUserId} onChange={handleSelectedUserId}>
                <option value="" disabled>
                  Select an option
                </option>
                {users?.map((user) => (
                  <option value={user.id} key={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <label className="text-white flex gap-3">
                Enabled:
                <input
                  type="checkbox"
                  checked={enabledStatus}
                  onChange={(e) => setEnabledStatus(e.target.checked)}
                />
              </label>
            </div>
          ) : (
            <>
              <input
                type="text"
                className="w-full p-3 border border-purple-300 rounded-md text-white bg-purple-800 placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Name...."
                value={preferenceName}
                onChange={(e) => setPreferenceName(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-3 border border-purple-300 rounded-md text-white bg-purple-800 placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Description..."
                value={preferenceDescription}
                onChange={(e) => setPreferenceDescription(e.target.value)}
              />
            </>
          )}
          <div className="flex w-full gap-2">
            {handleButton()}
            {actionStatus === "update" && (
              <button
                className={`w-1/2 mt-3 p-3 bg-purple-700 text-white rounded-md hover:bg-purple-600 transition-all`}
                onClick={() => {
                  resetState();
                }}
              >
                Back
              </button>
            )}
          </div>
        </div>

        <ul className="space-y-2">
          {selectedListingType === ListingType.SUBSCRIPTIONS &&
            subscriptionItems.map((item) => {
              const subscriptionUser = users?.find(
                (user) => user.id === item.user_id
              );
              const preferenceItem = preferenceItems.find(
                (prefItem) => prefItem.id === item.preference_id
              );
              return (
                <SubscriptionItem
                  key={item.id}
                  item={item}
                  editItem={() => {
                    setSelectedPreferenceId(item.preference_id);
                    setSelectedUserId(item.user_id);
                    setActionStatus("update");
                    setEnabledStatus(item.enabled);
                    setEditItemId(item.id);
                  }}
                  deleteItem={deleteSubscription}
                  userName={
                    subscriptionUser !== undefined ? subscriptionUser.name : ""
                  }
                  preferenceName={
                    preferenceItem !== undefined ? preferenceItem.name : ""
                  }
                />
              );
            })}
          {selectedListingType === ListingType.PREFERENCES &&
            preferenceItems.map((item) => (
              <PreferenceItem
                key={item.id}
                item={item}
                editItem={() => {
                  setPreferenceName(item.name);
                  setPreferenceDescription(item.description);
                  setActionStatus("update");
                  setEditItemId(item.id);
                }}
                deleteTodo={deletePreference}
              />
            ))}
        </ul>

        <div className="mt-6">
          <Buttons
            handlePreferencesClick={() => {
              setSelectedListingType(ListingType.PREFERENCES);
              resetState();
            }}
            handleSubscriptionsClick={() => {
              setSelectedListingType(ListingType.SUBSCRIPTIONS);
              resetState();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
