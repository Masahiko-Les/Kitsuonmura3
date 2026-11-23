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

/** 投稿に複製して持つ書き手の情報（一覧で住民票を読みに行かずに名前を出すため） */
export type AuthorFields = {
  authorUid: string;
  authorNickname: string;
  authorAgeGroup: AgeGroup;
};

/** themes/{themeId}。ID は月（"2026-11"） */
export type Theme = {
  id: string;
  month: string;
  title: string;
  description: string;
};

/** meetingPosts/{postId} */
export type MeetingPost = AuthorFields & {
  id: string;
  themeId: string;
  text: string;
  reactionCount: number;
  createdAt: Timestamp | null;
};

/** 共感の対象。post＝集会の語り、book＝図書館の本、history＝吃音史（id は住民の uid） */
export type ReactionType = "post" | "book" | "history";
export type ReactionTarget = { type: ReactionType; id: string };
