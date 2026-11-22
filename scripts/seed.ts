/**
 * 開発用サンプルデータの投入（docs/prototype.html と同じ架空の住民・集会・本棚）。
 * 本番環境には投入しないこと。
 *
 * 使い方：
 *   Emulator に入れる（おすすめ）
 *     FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npx tsx scripts/seed.ts
 *   開発用の Firebase プロジェクトに入れる（サービスアカウントの鍵が必要）
 *     GOOGLE_APPLICATION_CREDENTIALS=./kitsuonmura3-service-account.json \
 *       npx tsx scripts/seed.ts --project kitsuonmura3 --remote
 *   サンプルを消す
 *     上のどちらかに --clear を付ける
 *
 * サンプルのドキュメントIDはすべて "sample-" で始まる。サンプル住民はログインアカウントを持たない。
 */
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const option = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const emulator = process.env.FIRESTORE_EMULATOR_HOST;
const projectId = option("--project") ?? process.env.GCLOUD_PROJECT ?? (emulator ? "kitsuonmura3" : undefined);

if (!projectId) {
  console.error("--project を指定してください。");
  process.exit(1);
}
if (!emulator && !flag("--remote")) {
  console.error(
    "Emulator ではなく実際の Firebase プロジェクトに書き込もうとしています。\n" +
      `開発用プロジェクト（${projectId}）で間違いなければ --remote を付けて実行してください。本番環境には投入しないこと。`,
  );
  process.exit(1);
}

initializeApp(emulator ? { projectId } : { projectId, credential: applicationDefault() });
const db = getFirestore();

/** "2026-11-03" → Timestamp（日本時間の正午） */
const at = (ymd: string) => Timestamp.fromDate(new Date(`${ymd}T12:00:00+09:00`));

type SampleUser = {
  id: string;
  joined: string;
  historyReactionCount: number;
  nickname: string;
  ageGroup: string;
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
};

const USERS: SampleUser[] = [
  {
    id: "sample-minato",
    joined: "2026-09-01",
    historyReactionCount: 14,
    nickname: "みなと",
    ageGroup: "30代",
    region: "神奈川県",
    job: "会社員（営業職）",
    features: "言葉の最初の音が出にくくなる「難発」が多い",
    onset: "小学2年生ごろ",
    hardSounds: "か行、た行",
    hardWords: "自分の名前、会社名、ありがとうございます",
    hardScenes: "電話対応、自己紹介、会議での発言",
    struggles: "取引先への電話で、最初のひと言が出ない。名乗るまでに沈黙が続いて、いたずら電話だと思われたことがある。",
    tips: "名乗る前に「お世話になっております」をゆっくり置く。どうしても出ないときは、無理をせずメールに切り替える。",
    hobbies: "釣り、喫茶店めぐり",
    challenges: "社内の勉強会で、一度だけ発表してみたい。",
    history:
      "小学2年生の国語の時間、音読の順番が回ってきたとき、最初の一文字がどうしても出ませんでした。教室が静かになって、誰かが小さく笑った。その日から、音読の順番を数えるのが癖になりました。\n\n中学・高校では「おとなしい人」として過ごしました。本当は話したいことがたくさんあったのに、言い換えられる言葉を探しているうちに会話が先に進んでしまう。家に帰ってから、言えなかった言葉をノートに書いていました。\n\n大学3年のとき、初めて言友会の例会に行きました。部屋に入ると、自分と同じようにつっかえながら自己紹介をする人たちがいました。誰も笑わないし、誰も急かさない。帰りの電車で、なぜか涙が出ました。吃音があるのは自分だけではない、と頭ではなく体で分かった日でした。\n\n就職では、あえて営業職を選びました。克服したかったからではなく、人と話すことが本当は好きだったからです。今も電話は怖いし、名前が出ない日もあります。それでも、つっかえながら話す自分を少しずつ許せるようになってきました。\n\nこれを読んでいる誰かが、昔の自分と同じように音読の順番を数えているなら、そこから先にも人生は続いていると伝えたいです。",
  },
  {
    id: "sample-kotori",
    joined: "2026-10-01",
    historyReactionCount: 9,
    nickname: "ことり",
    ageGroup: "20代",
    region: "大阪府",
    job: "大学院生（心理学）",
    features: "連発が出やすい。緊張すると難発も出る",
    onset: "3歳ごろ（親から聞いた）",
    hardSounds: "あ行",
    hardWords: "「ありがとう」「あの」",
    hardScenes: "ゼミ発表、飲食店での注文、初対面",
    struggles: "ゼミで発表するたびに、内容よりも「どもらずに言えるか」ばかり考えてしまう。",
    tips: "発表原稿に、言いやすい言い換えを小さくメモしておく。",
    hobbies: "読書、ラジオ",
    challenges: "学会でポスター発表をしてみたい。",
    history:
      "物心ついたときには、もうどもっていました。小学校では友だちに真似されて、家では「ゆっくり話しなさい」と言われ続けました。ゆっくり話しても出ない言葉があることを、うまく説明できませんでした。\n\n高校で、吃音について調べた本を読んで、自分の話し方に名前があると知りました。それだけで少し楽になったのを覚えています。\n\n今は心理学を学んでいます。自分の苦労を研究対象にしたい気持ちと、まだ距離を置きたい気持ちの両方があります。",
  },
  {
    id: "sample-shigeru",
    joined: "2026-08-01",
    historyReactionCount: 21,
    nickname: "しげる",
    ageGroup: "50代",
    region: "北海道",
    job: "元郵便局員",
    features: "若いころは難発が強かった。今は落ち着いている日が多い",
    onset: "小学校入学前",
    hardSounds: "さ行",
    hardWords: "住所、数字",
    hardScenes: "窓口での読み上げ、電話",
    struggles: "今は大きな苦労は少ないが、若い人の話を聞くと昔の自分を思い出す。",
    tips: "出ない言葉は「書いて見せる」と割り切った。",
    hobbies: "家庭菜園、将棋",
    challenges: "若い世代の話を聴く場に、いつか参加したい。",
    history:
      "私の若いころは、吃音という言葉を知っている人はほとんどいませんでした。「気の持ちよう」と言われ、自分でもそう思い込んでいました。\n\n郵便局の窓口に30年立ちました。数字が言えずに、お客さんを待たせたことは数えきれません。それでも、毎日来てくれるおばあさんが「あんたの窓口がいい」と言ってくれたことがありました。話し方ではなく、人を見てくれる人もいるのだと知りました。\n\n40代になってようやく、吃音を隠すのをやめました。隠すことに使っていた力を、ほかのことに使えるようになりました。",
  },
  {
    id: "sample-aoi",
    joined: "2026-10-15",
    historyReactionCount: 11,
    nickname: "あおい",
    ageGroup: "40代",
    region: "福岡県",
    job: "看護師",
    features: "難発。言い換えでしのぐことが多い",
    onset: "小学3年生ごろ",
    hardSounds: "は行、ま行",
    hardWords: "患者さんの名前、薬の名前",
    hardScenes: "申し送り、医師への電話報告",
    struggles: "患者さんの名前を呼べないとき、申し訳なさと焦りでいっぱいになる。",
    tips: "職場の一部の人には吃音のことを伝えた。それだけで電話報告がずいぶん楽になった。",
    hobbies: "ヨガ、温泉",
    challenges: "後輩の吃音のある看護学生の相談に乗れる人になりたい。",
    history:
      "看護師になると決めたとき、周りからは「話す仕事なのに大丈夫？」と言われました。正直、自分でも不安でした。\n\n新人のころは、申し送りが怖くて毎朝胃が痛かったです。患者さんの名前が出なくて、言い換えもできない。そんなとき、先輩が黙って待ってくれたことを今も覚えています。\n\n今は、吃音があるからこそ、言葉にならない患者さんの気持ちを待てるのかもしれないと思うことがあります。",
  },
  {
    id: "sample-haruka",
    joined: "2026-11-01",
    historyReactionCount: 7,
    nickname: "はるか",
    ageGroup: "20代",
    region: "東京都",
    job: "カフェ店員",
    features: "連発と難発の両方。日によって波がある",
    onset: "幼稚園のころ",
    hardSounds: "い、う",
    hardWords: "「いらっしゃいませ」",
    hardScenes: "接客の第一声、電話注文",
    struggles: "「いらっしゃいませ」が出ない日がある。",
    tips: "お辞儀を先にして、声はあとからついてくるようにしている。",
    hobbies: "イラスト、カフェめぐり",
    challenges: "いつか自分のお店を持ちたい。",
    history:
      "接客の仕事を選んだら、友だちに驚かれました。私自身、なぜ選んだのかうまく説明できません。ただ、お店という場所が好きでした。\n\n最初の1か月は毎日やめようと思っていました。今も、いらっしゃいませが出ない日はあります。でも、常連さんの顔を覚えるのは誰よりも早いと言われます。",
  },
];

// テーマのIDは月（"2026-11"）。1か月に1テーマなので重複しない
const THEMES = [
  { id: "2026-08", title: "吃音と就職活動について", description: "面接、エントリー、職場選び。就職活動の中で経験したことを書いてください。" },
  { id: "2026-09", title: "最近、少し勇気を出せたことはありますか？", description: "どんなに小さなことでも構いません。" },
  { id: "2026-10", title: "電話対応で苦労したことはありますか？", description: "電話にまつわる経験や、今の思いを聞かせてください。" },
  { id: "2026-11", title: "自分の名前を言うときの苦労について", description: "自己紹介、電話、受付。自分の名前を言う場面で感じてきたことを、自由に書いてください。" },
];
const CURRENT_THEME_ID = "2026-11";

const POSTS = [
  { id: "sample-p1", themeId: "2026-11", author: "sample-minato", date: "2026-11-03", reactionCount: 8, text: "名刺交換のとき、自分の名前だけが出ません。会社名は言えるのに、苗字の最初の音で止まってしまう。\n\n最近は、名刺を先に差し出してから名乗るようにしています。相手が名刺に目を落としている間なら、少しつっかえても大丈夫だと思えるからです。" },
  { id: "sample-p2", themeId: "2026-11", author: "sample-aoi", date: "2026-11-08", reactionCount: 5, text: "自分の名前より、患者さんの名前を呼ぶほうがつらいです。呼べないまま病室の前で立ち止まってしまうことがあります。\n\nここに書いてみて、名前を呼ぶことを、私はそれだけ大切にしているのだと気づきました。" },
  { id: "sample-p3", themeId: "2026-11", author: "sample-haruka", date: "2026-11-15", reactionCount: 3, text: "カフェでは名札をつけているので、名乗らなくていいのが少しありがたいです。名札に助けられているなんて、誰にも言ったことがありませんでした。" },
  { id: "sample-p4", themeId: "2026-10", author: "sample-shigeru", date: "2026-10-05", reactionCount: 12, text: "若いころ、電話が鳴るたびにトイレに逃げていました。今思えば、逃げ場があったことに救われていたのかもしれません。" },
  { id: "sample-p5", themeId: "2026-10", author: "sample-kotori", date: "2026-10-19", reactionCount: 6, text: "美容院の予約は、ずっとネット予約ができるお店しか選んでいません。電話をしなくていい時代でよかったと思う一方で、電話をしない自分に少し負けた気もしています。" },
  { id: "sample-p6", themeId: "2026-09", author: "sample-haruka", date: "2026-09-12", reactionCount: 9, text: "先週、初めて自分から常連さんに話しかけました。「いつもありがとうございます」の「い」が出なくて、結局お辞儀だけになりました。でも、常連さんは笑ってお辞儀を返してくれました。" },
  { id: "sample-p7", themeId: "2026-09", author: "sample-kotori", date: "2026-09-20", reactionCount: 4, text: "ゼミで、自分の吃音のことを初めて話しました。手が震えていたけれど、話し終えたあと、先生が「話してくれてありがとう」と言ってくれました。" },
  { id: "sample-p8", themeId: "2026-08", author: "sample-minato", date: "2026-08-02", reactionCount: 15, text: "面接で吃音のことを伝えるか、最後まで迷いました。結局、伝えた会社に入りました。伝えたからこそ、ありのままで働ける場所を選べたのだと今は思います。" },
  { id: "sample-p9", themeId: "2026-08", author: "sample-shigeru", date: "2026-08-25", reactionCount: 7, text: "私の時代は、面接で吃音を伝えるなど考えられませんでした。今の若い人が、自分の言葉で選んでいることを心強く思います。" },
];

const BOOKS = [
  {
    id: "sample-b1", author: "sample-minato", date: "2026-10-12", reactionCount: 10,
    title: "きよしこ", bookAuthor: "重松清", tag: "吃音",
    struggle: "中学生のころ、自分の話し方を誰にも説明できずに、ひとりで抱えていました。",
    encounter: "図書室で偶然手に取りました。吃音のある少年が主人公の小説だと、読み始めてから知りました。",
    words: "言いたいことが言えない少年の、言葉にならない気持ちが丁寧に描かれていて、自分の気持ちを代わりに書いてもらったように感じました。",
    thought: "吃音のある人が、物語の主人公になれるのだと思いました。",
    change: "自分の経験も、いつか誰かに届く物語になるかもしれないと思えるようになりました。",
  },
  {
    id: "sample-b2", author: "sample-shigeru", date: "2026-09-03", reactionCount: 13,
    title: "夜と霧", bookAuthor: "V・E・フランクル", tag: "人生の意味",
    struggle: "40代のころ、仕事も家庭もうまくいかず、自分の人生に意味があるのか分からなくなっていました。",
    encounter: "職場の先輩に勧められました。",
    words: "人生に何を期待するかではなく、人生から何を問われているかを考える、という考え方に支えられました。",
    thought: "吃音がなければ、と考え続けるのをやめて、吃音とともに今日をどう生きるかを考えるようになりました。",
    change: "大きく変わったわけではありませんが、つらい日にも「今日は何を問われているのか」と考える習慣ができました。",
  },
  {
    id: "sample-b3", author: "sample-kotori", date: "2026-10-28", reactionCount: 6,
    title: "嫌われる勇気", bookAuthor: "岸見一郎・古賀史健", tag: "勇気",
    struggle: "人にどう思われるかが気になって、発表の前は眠れませんでした。",
    encounter: "大学の友人と読書会で読みました。",
    words: "他人の評価は自分では変えられない、という考え方に出会いました。",
    thought: "聞き手がどう感じるかは、聞き手の課題なのかもしれないと考えました。",
    change: "まだ発表は怖いです。でも、怖いまま話してもいいのだと少し思えるようになりました。",
  },
  {
    id: "sample-b4", author: "sample-haruka", date: "2026-11-10", reactionCount: 4,
    title: "星の王子さま", bookAuthor: "サン＝テグジュペリ", tag: "孤独",
    struggle: "接客の仕事を始めたばかりで、毎日自信をなくしていました。",
    encounter: "子どものころ読んだ本を、なんとなく読み返しました。",
    words: "大切なものは目に見えない、という一節が有名ですが、今回は王子さまがひとつの花を大切にする場面が心に残りました。",
    thought: "正直、読んで何かが大きく変わったわけではありません。",
    change: "ただ、うまく話せなかった日も、お店に来てくれる人を大切に思う気持ちは本物だと思えました。",
  },
];

async function clear() {
  const batch = db.batch();
  for (const u of USERS) batch.delete(db.doc(`users/${u.id}`));
  for (const p of POSTS) batch.delete(db.doc(`meetingPosts/${p.id}`));
  for (const b of BOOKS) batch.delete(db.doc(`books/${b.id}`));
  await batch.commit();
  console.log("サンプルの住民票・語り・本棚を削除しました（テーマと config/meeting は残しています）。");
}

async function seed() {
  const byId = new Map(USERS.map((u) => [u.id, u]));
  const author = (id: string) => {
    const u = byId.get(id)!;
    return { authorUid: u.id, authorNickname: u.nickname, authorAgeGroup: u.ageGroup };
  };
  const batch = db.batch();

  for (const { id, joined, ...u } of USERS) {
    batch.set(db.doc(`users/${id}`), { ...u, createdAt: at(joined), updatedAt: at(joined) });
  }
  for (const t of THEMES) {
    batch.set(db.doc(`themes/${t.id}`), {
      month: t.id,
      title: t.title,
      description: t.description,
      createdAt: at(`${t.id}-01`),
    });
  }
  batch.set(db.doc("config/meeting"), { currentThemeId: CURRENT_THEME_ID });
  for (const p of POSTS) {
    batch.set(db.doc(`meetingPosts/${p.id}`), {
      themeId: p.themeId,
      ...author(p.author),
      text: p.text,
      reactionCount: p.reactionCount,
      createdAt: at(p.date),
    });
  }
  for (const { id, author: a, date, ...b } of BOOKS) {
    batch.set(db.doc(`books/${id}`), { ...author(a), ...b, createdAt: at(date) });
  }

  await batch.commit();
  console.log(
    `投入しました：住民 ${USERS.length}人、テーマ ${THEMES.length}件、集会の語り ${POSTS.length}件、本 ${BOOKS.length}冊（${emulator ? "Emulator" : projectId}）`,
  );
}

(flag("--clear") ? clear() : seed()).then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
