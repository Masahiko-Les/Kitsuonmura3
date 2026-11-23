import type { Timestamp } from "firebase/firestore";
import type { AgeGroup, BookTag } from "./constants";

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

/** books/{bookId}。5つの問いはすべて任意 */
export type Book = AuthorFields & {
  id: string;
  title: string;
  bookAuthor: string;
  tag: BookTag;
  struggle: string;
  encounter: string;
  words: string;
  thought: string;
  change: string;
  reactionCount: number;
  createdAt: Timestamp | null;
};

export type BookInput = Pick<Book, "title" | "bookAuthor" | "tag" | "struggle" | "encounter" | "words" | "thought" | "change">;

/** 本棚の5つの問い（入力欄と詳細の見出し） */
export const BOOK_QUESTIONS: { key: keyof Pick<Book, "struggle" | "encounter" | "words" | "thought" | "change">; heading: string; question: string; hint?: string }[] = [
  { key: "struggle", heading: "抱えていた苦労や悩み", question: "どのような苦労や悩みを抱えていましたか" },
  { key: "encounter", heading: "この本との出会い", question: "どのようにこの本と出会いましたか" },
  {
    key: "words",
    heading: "支えになった考え方や言葉",
    question: "どのような考え方や言葉に支えられましたか",
    hint: "本文の長い引用は避け、あなたの言葉で書いてください。",
  },
  { key: "thought", heading: "読んで考えたこと", question: "読んで、どのようなことを考えましたか" },
  {
    key: "change",
    heading: "自分の中で変わったこと",
    question: "生き方や考え方に、変化はありましたか",
    hint: "「大きな変化はなかった」も、大切な体験です。",
  },
];
