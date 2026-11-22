import type { Timestamp } from "firebase/firestore";
import type { AgeGroup } from "./constants";

/** users/{uid} */
export type UserProfile = {
  uid: string;
  nickname: string;
  ageGroup: AgeGroup;
  region: string;
  job: string;
  features: string;
  onset: string;
  hardSounds: string;
  hardWords: string;
  hardScenes: string;
  struggles: string;
  tips: string;
  hobbies: string;
  challenges: string;
  history: string;
  historyReactionCount: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

/** 住民票の編集で書き換えられる項目 */
export type EditableProfile = Omit<UserProfile, "uid" | "historyReactionCount" | "createdAt" | "updatedAt">;

export const EMPTY_PROFILE_FIELDS = {
  region: "",
  job: "",
  features: "",
  onset: "",
  hardSounds: "",
  hardWords: "",
  hardScenes: "",
  struggles: "",
  tips: "",
  hobbies: "",
  challenges: "",
  history: "",
} satisfies Partial<EditableProfile>;
