// 公開の吃音情報まとめページのデータ。
// 元データは kitsuon_info_guide/（2026-11-24 に公式サイトを参照して編集）。
// resources.json・groups.json を直せば画面も変わる。確認日を更新するときは verified_on も直す。
//
// 掲載の決まり（kitsuon_info_guide/CONTENT_GUIDE.md）
// - 出典にリンクし、紹介文は短く自分たちの言葉で書く。本文を転載しない。
// - 団体が一覧に載っていることと、いま活動していることを分けて書く。
// - 開催日・連絡先・受診の受付状況・都道府県を推測で書かない。
// - 医療機関や団体の推薦、効果の保証と読める書き方をしない。
import groupsData from "./groups.json";
import resourcesData from "./resources.json";

export type ResourceCategory = "basics" | "groups" | "children" | "consultation" | "work" | "research";

export type GuideResource = {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  url: string;
  audience: string;
  /** "全国" か都道府県名 */
  region: string;
  source_type: string;
  /** 出典ページを確認した日（"2026-11-24"） */
  verified_on: string;
  /** 何を確認したか */
  verification_scope: string;
  /** reviewed 以外は「要確認」と表示する */
  status: string;
};

export type GuideGroup = {
  name: string;
  /** 加盟団体一覧の地域区分。団体の所在地（都道府県）ではない */
  area: string;
  source_url: string;
  source_checked_on: string;
  individual_site_verified: boolean;
  meeting_schedule_verified: boolean;
  contact_details_verified: boolean;
  public_label: string;
};

export const GUIDE_REVIEW_DATE: string = resourcesData.review_date;
export const GUIDE_RESOURCES = resourcesData.resources as GuideResource[];
export const GUIDE_GROUPS = groupsData.groups as GuideGroup[];

/** 自助グループの一覧の出典（全国言友会連絡協議会・加盟団体一覧） */
export const GROUP_LIST_URL = "https://www.zengenren.org/加盟団体一覧/";

/** 加盟団体一覧の地域区分（groups.json の area）。並び順は北から */
export const AREAS = ["北海道・東北", "関東", "中部", "関西", "中国・四国", "九州・沖縄"] as const;

/**
 * 情報源の region（都道府県）を、地域で絞り込むときの区分に当てはめる。
 * 地理上の区分で、団体の所在地を推測するためのものではない（団体には使わない）。
 */
const PREFECTURE_AREA: Record<string, (typeof AREAS)[number]> = {
  北海道: "北海道・東北", 青森県: "北海道・東北", 岩手県: "北海道・東北", 宮城県: "北海道・東北",
  秋田県: "北海道・東北", 山形県: "北海道・東北", 福島県: "北海道・東北",
  茨城県: "関東", 栃木県: "関東", 群馬県: "関東", 埼玉県: "関東", 千葉県: "関東", 東京都: "関東", 神奈川県: "関東",
  新潟県: "中部", 富山県: "中部", 石川県: "中部", 福井県: "中部", 山梨県: "中部", 長野県: "中部",
  岐阜県: "中部", 静岡県: "中部", 愛知県: "中部", 三重県: "中部",
  滋賀県: "関西", 京都府: "関西", 大阪府: "関西", 兵庫県: "関西", 奈良県: "関西", 和歌山県: "関西",
  鳥取県: "中国・四国", 島根県: "中国・四国", 岡山県: "中国・四国", 広島県: "中国・四国", 山口県: "中国・四国",
  徳島県: "中国・四国", 香川県: "中国・四国", 愛媛県: "中国・四国", 高知県: "中国・四国",
  福岡県: "九州・沖縄", 佐賀県: "九州・沖縄", 長崎県: "九州・沖縄", 熊本県: "九州・沖縄", 大分県: "九州・沖縄",
  宮崎県: "九州・沖縄", 鹿児島県: "九州・沖縄", 沖縄県: "九州・沖縄",
};

export function resourceArea(r: GuideResource): string | null {
  return r.region === "全国" ? null : (PREFECTURE_AREA[r.region] ?? null);
}

export const SOURCE_TYPE_LABEL: Record<string, string> = {
  official_or_academic: "公的機関・学会・当事者団体など",
};

export type GuidePageSlug = "about" | "groups" | "children" | "support" | "work" | "research" | "books";

export type GuidePage = {
  slug: GuidePageSlug;
  /** ページの見出し・タイトル */
  title: string;
  /** 入口に出す「困りごと」の言い方 */
  need: string;
  /** 検索結果と meta description に使う */
  description: string;
  /** 本文の段落 */
  body: string[];
  /** このページに並べる情報源のカテゴリ */
  categories: ResourceCategory[];
  /** 自由語検索で拾うことば */
  keywords: string[];
};

export const GUIDE_PAGES: GuidePage[] = [
  {
    slug: "about",
    title: "吃音とは",
    need: "吃音について知りたい",
    description: "吃音の特徴と、話し方だけではない困りごとについて。学会や国の研究機関の解説への入口です。",
    body: [
      "吃音は、話すときに音を繰り返す、音を引き伸ばす、言葉が出にくくなるといった特徴がみられる、発話の障害のひとつです。どんな形で現れるか、どんな場面で困るかは、人によっても、場面によっても異なります。",
      "目に見える話し方だけでなく、話すことへの不安や、避けてきた場面、周りの理解なども、吃音とともに暮らすうえで大切なことです。",
      "吃音は、本人の努力不足や、親の育て方だけが原因ではありません。原因やこれからの見通しについて詳しく知りたいときは、下の専門機関の解説を読んでください。",
    ],
    categories: ["basics"],
    keywords: ["吃音とは", "どもり", "原因", "症状", "特徴", "連発", "伸発", "難発", "ブロック"],
  },
  {
    slug: "groups",
    title: "自助グループを探す",
    need: "仲間や自助グループを探したい",
    description: "全国言友会連絡協議会の加盟団体一覧をもとに、吃音の自助グループの名前を地域ごとに並べています。",
    body: [
      "全国言友会連絡協議会の加盟団体一覧をもとに、地域ごとに団体の名前を並べています。",
      "参加の条件、開催日、連絡先は、各団体の最新の公式情報で確認してください。吃音村では、それぞれの団体の活動状況や連絡先を確かめていません。ここに載っていない団体や集まりもあります。",
      "地域の集まりと、吃音村のオンラインの交流は、どちらかを選ぶものではありません。自分に合う場所を、組み合わせて使ってください。",
    ],
    categories: ["groups"],
    keywords: ["自助グループ", "言友会", "仲間", "集まり", "当事者団体", "例会", "セルフヘルプ"],
  },
  {
    slug: "children",
    title: "子どもの吃音",
    need: "子どもの吃音について知りたい",
    description: "子どもの吃音について、周りの大人ができることと、相談先の探し方。保護者・支援者向けの資料への入口です。",
    body: [
      "子どもの吃音について、周りの大人ができることとして、話しやすい環境を整えること、話し方をからかったり急がせたりしないこと、本人の気持ちを大切にすることが挙げられています。",
      "必要に応じて、ことばの教室、言語聴覚士、地域の相談窓口などに相談する方法があります。お子さんについての個別の判断は、専門家と相談してください。",
    ],
    categories: ["children"],
    keywords: ["子ども", "こども", "保護者", "親", "幼児", "小学生", "ことばの教室", "保育", "学校", "先生"],
  },
  {
    slug: "support",
    title: "医療・相談",
    need: "医療や相談先を探したい",
    description: "吃音について相談できる先の探し方。言語聴覚士による支援や、専門外来の公式案内への入口です。",
    body: [
      "吃音への支援は、年齢や本人の希望、困りごとによって異なります。言語聴覚士などに相談するという選択肢があります。",
      "医療機関ごとに、受け入れる対象や予約の方法が違います。受診を考えるときは、各機関の公式サイトで最新の案内を確かめてください。",
      "ここに載せている機関は、ごく一部です。掲載は受診のおすすめや、効果の保証ではありません。",
    ],
    categories: ["consultation"],
    keywords: ["病院", "医療", "受診", "外来", "言語聴覚士", "ST", "相談", "リハビリ", "専門家"],
  },
  {
    slug: "work",
    title: "学校・仕事・配慮",
    need: "学校や仕事での困りごとを考えたい",
    description: "自己紹介、面接、電話など、学校や職場で困る場面と、配慮を伝えるときに役立つ公的な情報への入口です。",
    body: [
      "自己紹介、音読、面接、電話対応など、吃音で困る場面は人によって異なります。周りに必要な配慮を伝えたり、話す以外の方法を相談したりする選択肢があります。",
      "内閣府の障害者白書では、お店などで、話すことに障害のあるお客さんへの配慮の例として、話し終わるまで待つことや、話す以外の方法を用意することが紹介されています。",
      "改正された障害者差別解消法により、2024年4月から、事業者による合理的配慮の提供が義務になりました。ただし、働く場面での配慮には、障害者雇用促進法など別の制度が関係します。",
    ],
    categories: ["work"],
    keywords: ["仕事", "職場", "就職", "就活", "面接", "電話", "学校", "音読", "自己紹介", "合理的配慮", "配慮", "障害者差別解消法", "雇用"],
  },
  {
    slug: "research",
    title: "研究・資料",
    need: "研究や資料を読みたい",
    description: "吃音について専門的に調べたい人へ。学会や研究機関の解説、総説論文への入口です。",
    body: [
      "専門的な説明を読みたい方に、学会や研究機関の資料、論文を案内します。資料の本文は、リンク先で読んでください。",
    ],
    categories: ["research"],
    keywords: ["研究", "論文", "資料", "学会", "ガイドライン", "専門職", "総説"],
  },
  {
    slug: "books",
    title: "吃音に関する本",
    need: "本を探したい",
    description: "吃音に関する本の案内は準備中です。書誌情報を確認できた本から載せていきます。",
    body: [
      "吃音に関する本の案内を準備しています。書名、著者、出版社、版などを確かめられた本から載せていきます。",
      "治し方の本だけでなく、当事者の経験や、吃音とともに豊かに生きることを描いた本も紹介したいと考えています。",
      "なお、吃音村に登録した人のみが使える「図書館」は、吃音村の村人たちの心の支えになった本やそのエピソードが大切に保管されています。吃音の方はぜひ村人になってください。",
    ],
    categories: [],
    keywords: ["本", "書籍", "読書", "ブックガイド"],
  },
];

export function getGuidePage(slug: GuidePageSlug): GuidePage {
  return GUIDE_PAGES.find((p) => p.slug === slug)!;
}

export function resourcesFor(page: GuidePage): GuideResource[] {
  return GUIDE_RESOURCES.filter((r) => page.categories.includes(r.category));
}

/** 情報源のカテゴリが載っているページ */
export function pageOfCategory(c: ResourceCategory): GuidePage | undefined {
  return GUIDE_PAGES.find((p) => p.categories.includes(c));
}
