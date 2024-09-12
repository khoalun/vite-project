export type TSubscriptionItem = {
  created_at?: Date;
  enabled: boolean;
  id: number;
  preference_id: number;
  user_id: string;
};

export type TPreferenceItem = {
  created_at?: Date;
  name: string;
  description: string;
  id: number;
};

export type TUser = {
  name: string;
  id: string;
  created_at?: Date;
};

export enum ListingType {
  PREFERENCES = "preferences",
  SUBSCRIPTIONS = "subscriptions",
}
