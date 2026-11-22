// 吃音情報ガイドのデータ。Firestoreではなくこのファイルで管理し、静的生成する。
//
// 掲載内容は試作品（docs/prototype.html）から移した仮のもの。
// url / source / checkedAt は公式情報を確認してから入れる。空欄のままでも表示は崩れない。

export type GuideItem = {
  /** 名称 */
  name: string;
  /** 種別（当事者団体、学会など） */
  type: string;
  /** 説明 */
  description: string;
  /** 向いている人 */
  suitedFor: string;
  /** 公式サイトURL（未確認なら空欄） */
  url?: string;
  /** 情報源（例：「公式サイト」）。未確認なら空欄 */
  source?: string;
  /** 最終確認日（YYYY-MM-DD）。未確認なら空欄 */
  checkedAt?: string;
};

export type GuideCategory = {
  /** URLに使う英語表記（/guide/[slug]） */
  slug: string;
  /** カテゴリ名 */
  name: string;
  /** カテゴリの説明（一覧とカテゴリページの冒頭、meta description に使う） */
  description: string;
  items: GuideItem[];
};

export const GUIDE: GuideCategory[] = [
  {
    slug: "genyukai",
    name: "全国の言友会",
    description: "言友会は、吃音のある人たちが集まり、語り合う自助グループです。全国各地で例会が開かれています。",
    items: [
      {
        name: "全国言友会連絡協議会",
        type: "当事者団体",
        description: "全国各地の言友会をつなぐ連絡組織です。お住まいの地域の言友会を探すときの起点になります。",
        suitedFor: "近くで参加できる自助グループを探している人",
      },
      {
        name: "東京言友会",
        type: "当事者団体",
        description: "東京で活動する言友会です。例会などを通じて、当事者同士が顔を合わせて語り合えます。",
        suitedFor: "首都圏で対面の交流をしたい人",
      },
    ],
  },
  {
    slug: "consultation",
    name: "医療・相談窓口",
    description: "吃音について専門家に相談したいときの窓口です。",
    items: [
      {
        name: "各都道府県の言語聴覚士会",
        type: "専門職団体",
        description: "吃音の相談先を探すときの窓口のひとつです。地域の相談機関について情報を得られることがあります。",
        suitedFor: "専門家に相談したい人、子どもの吃音について相談したい保護者",
      },
    ],
  },
  {
    slug: "children",
    name: "子どもの吃音と保護者向け",
    description: "子どもの吃音が気になる保護者や、保育・教育に関わる人に向けた情報です。",
    items: [
      {
        name: "幼児吃音臨床ガイドライン",
        type: "ガイドライン",
        description: "AMED研究班が作成した、幼児の吃音に関する臨床ガイドラインです。園の先生向けの資料なども添付されています。",
        suitedFor: "幼児の吃音が気になる保護者、保育・教育関係者",
      },
    ],
  },
  {
    slug: "research",
    name: "学会・研究機関",
    description: "吃音の研究や、最新の知見に触れられる学会・研究機関です。",
    items: [
      {
        name: "日本吃音・流暢性障害学会",
        type: "学会",
        description: "吃音や流暢性障害に関する研究者・臨床家・当事者が集まる学会です。",
        suitedFor: "吃音について研究や最新の知見を知りたい人",
      },
    ],
  },
  {
    slug: "online",
    name: "オンライン自助グループ",
    description: "近くに自助グループがない人や、対面での参加が不安な人も参加できる、オンラインの集まりです。",
    items: [
      {
        name: "（掲載候補を調査中）",
        type: "—",
        description: "オンラインで参加できる吃音の自助グループを調べて掲載します。",
        suitedFor: "近くに自助グループがない人、対面が不安な人",
      },
    ],
  },
];

export function findGuideCategory(slug: string) {
  return GUIDE.find((c) => c.slug === slug);
}
