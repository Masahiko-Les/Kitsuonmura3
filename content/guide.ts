// 公開の吃音情報ガイドのデータ（PRODUCT_SPEC.md §4・§8）。
// 掲載するのは実在する団体・サイトだけ。架空の団体やページを作らない。
// 公開前にリンク・現存・内容を確認し、checkedAt（最終確認日）を入れる。

export type GuideResource = {
  name: string;
  category: string;
  summary: string;
  url: string;
  /** 最終確認日（"2026-11-23" の形式）。未確認なら空 */
  checkedAt: string;
};

/** カテゴリー。ページは掲載情報を確認してから作る */
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

export const GUIDE_RESOURCES: GuideResource[] = [
  {
    name: "全国言友会連絡協議会",
    category: "自助グループ",
    summary: "全国の言友会（吃音のある人の自助グループ）の連絡組織です。",
    url: "https://www.zengenren.org/",
    checkedAt: "",
  },
  {
    name: "日本吃音・流暢性障害学会",
    category: "研究",
    summary: "吃音・流暢性障害に関する研究と臨床の学会です。",
    url: "https://jssfd.org/",
    checkedAt: "",
  },
];
