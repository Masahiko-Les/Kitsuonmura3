// ver2 の試作で使う架空データ（kitsuon_village_handoff/data/seed.json の写し）。
// 実在の住民ではない。Firebase にはつながず、画面の確認だけに使う。
import seed from "./seed.json";

export type Resident = (typeof seed.residents)[number];
export type Topic = (typeof seed.meeting_topics)[number];
export type MeetingPost = (typeof seed.meeting_posts)[number];
export type BookStory = (typeof seed.book_stories)[number];

export const SITE = seed.site;
export const RESIDENTS: Resident[] = seed.residents;
export const TOPICS: Topic[] = seed.meeting_topics;
export const POSTS: MeetingPost[] = seed.meeting_posts;
export const BOOKS: BookStory[] = seed.book_stories;
export const GUIDE_RESOURCES = seed.guide_resources;

/** 先頭が今月の集会 */
export const CURRENT_TOPIC = TOPICS[0];

/** デモで「あなた」として振る舞う住民票 */
export const ME = {
  nickname: "あなた",
  age_band: "",
  occupation: "",
  intro: "",
  history: "",
};

export const findResident = (id: string) => RESIDENTS.find((r) => r.id === id);
export const findTopic = (id: string) => TOPICS.find((t) => t.id === id);
export const findBook = (id: string) => BOOKS.find((b) => b.id === id);
export const postsOf = (topicId: string) => POSTS.filter((p) => p.topic_id === topicId);

/** 公開ガイドのカテゴリー（仕様書 §4 /guide） */
export const GUIDE_CATEGORIES = [
  "自助グループ",
  "医療・相談",
  "仕事・就職",
  "子どもの吃音",
  "研究",
  "書籍",
  "当事者の発信",
  "イベント",
];
