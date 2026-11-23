// アプリ全体で使う選択肢と上限値。firestore.rules の検証と揃えること

export const AGE_GROUPS = ["10代", "20代", "30代", "40代", "50代", "60代以上", "答えない"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const LIMITS = {
  nickname: 20,
  /** 住民票の一行項目（居住地域、苦手な音など） */
  shortField: 200,
  /** 住民票の複数行項目（いま抱えている苦労、自分なりの工夫） */
  longField: 2000,
  history: 10000,
  meetingPost: 5000,
  bookTitle: 60,
  bookAuthor: 40,
  /** 本棚の5つの問いそれぞれ */
  bookAnswer: 2000,
  themeTitle: 100,
  themeDescription: 500,
} as const;

/** 図書館のテーマ */
export const BOOK_TAGS = ["吃音", "勇気", "孤独", "仕事", "人生の意味", "自己理解", "夢・挑戦"] as const;
export type BookTag = (typeof BOOK_TAGS)[number];

/** メール確認を必須にするか（開発中は false） */
export const REQUIRE_EMAIL_VERIFICATION = process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true";
