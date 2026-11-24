import type { Timestamp } from "firebase/firestore";
import type { AgeGroup } from "./constants";

/** users/{uid} */
export type UserProfile = {
  uid: string;
  nickname: string;
  ageGroup: AgeGroup;
  /** ひとことの自己紹介（一覧に出る） */
  intro: string;
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
  /** 運営が非表示にしたか。本人と運営にしか読めなくなる */
  hidden: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

/** 住民票の編集で書き換えられる項目 */
export type EditableProfile = Omit<UserProfile, "uid" | "historyReactionCount" | "hidden" | "createdAt" | "updatedAt">;

export const EMPTY_PROFILE_FIELDS = {
  intro: "",
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
  /** 運営が非表示にしたか */
  hidden: boolean;
  createdAt: Timestamp | null;
};

/** 共感の対象。post＝集会の語り、book＝図書館の本、history＝吃音史（id は住民の uid） */
export type ReactionType = "post" | "book" | "history";
export type ReactionTarget = { type: ReactionType; id: string };

/** books/{bookId}。苦労・夢 × 本 × 変化の物語（PRODUCT_SPEC.md §7）。書名と見出し以外は任意 */
export type Book = AuthorFields & {
  id: string;
  /** 物語の見出し */
  heading: string;
  /** 本の書名 */
  title: string;
  bookAuthor: string;
  /** 悩み・苦労、または夢 */
  struggle: string;
  /** 支えられた考え方 */
  words: string;
  /** 自分の考えや変化 */
  change: string;
  reactionCount: number;
  /** 運営が非表示にしたか */
  hidden: boolean;
  createdAt: Timestamp | null;
};

export type BookInput = Pick<Book, "heading" | "title" | "bookAuthor" | "struggle" | "words" | "change">;

/** 本の物語の問い（入力欄と詳細の見出し） */
export const BOOK_QUESTIONS: { key: "struggle" | "words" | "change"; heading: string; hint?: string }[] = [
  { key: "struggle", heading: "悩み・苦労、または夢" },
  { key: "words", heading: "支えられた考え方", hint: "本文の長い引用は避け、あなたの言葉で書いてください。" },
  { key: "change", heading: "自分の考えや変化", hint: "変わらなかった経験も、大切な物語です。" },
];

/** 通報できるもの。profile＝住民票（吃音史を含む）、id は住民の uid */
export type ReportTargetType = "post" | "book" | "profile";

/** reports/{targetType_targetId_reporterUid}。運営（管理者）だけが読める */
export type Report = {
  id: string;
  reporterUid: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  details: string;
  status: "open" | "resolved";
  createdAt: Timestamp | null;
  resolvedAt: Timestamp | null;
};
