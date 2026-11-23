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

/** 居住地域の選択肢（都道府県＋海外）。未選択は空文字 */
export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県", "海外",
] as const;
