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
} as const;

/** メール確認を必須にするか（開発中は false） */
export const REQUIRE_EMAIL_VERIFICATION = process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true";
