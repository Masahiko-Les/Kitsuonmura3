# 吃音村

吃音当事者のためのオンライン自助グループ「吃音村」のWebアプリです。

- 仕様：引き継ぎパック `kitsuon_village_handoff/`（CLAUDE.md・docs/PRODUCT_SPEC.md・docs/DESIGN_SYSTEM.md・docs/SECURITY_AND_DATA.md）。
  参考画像を含むため、このリポジトリには入れていません。
- 以前の仕様と試作品：[docs/開発指示書.md](docs/開発指示書.md)、[docs/prototype.html](docs/prototype.html)（2026-11-23 に引き継ぎパックの仕様へ置き換え）

## 開発

```bash
cp .env.example .env.local   # Firebase の設定値を入れる
npm install
npm run dev   # http://localhost:3000
```

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm run lint` | ESLint |
| `npm run emulators` | Firebase Emulator（Auth / Firestore）。Java が必要 |
| `npm run seed` | 開発用サンプルデータの投入（使い方は [scripts/seed.ts](scripts/seed.ts) の冒頭）。本番には入れない |
| `npm run test:rules` | `firestore.rules` のテスト（[tests/firestore.rules.test.ts](tests/firestore.rules.test.ts)）を Emulator 上で実行。Java が必要 |
| `npm run set-admin -- <メール>` | 管理者にする（`--remove` で外す）。サービスアカウントの鍵が必要（[scripts/set-admin.ts](scripts/set-admin.ts) の冒頭） |

Firestore のセキュリティルールは `firestore.rules`、複合インデックスは `firestore.indexes.json`。
反映は `firebase deploy --only firestore:rules,firestore:indexes`。

開発中はメール確認を無効にしています。本番前に `.env` の `NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION=true` と、
`firestore.rules` の `requireEmailVerification()` を `true` にしてください。

## 公開（Vercel）

GitHub の main に push すると、Vercel が自動でビルド・公開します。
Vercel の「Settings → Environment Variables」に `.env.example` と同じ変数を入れてください
（`NEXT_PUBLIC_` の値はビルド時に埋め込まれるので、変えたら再デプロイが必要です）。

- `NEXT_PUBLIC_ALLOW_INDEXING` は本番ドメインをつなぐまで `false`（サイト全体を noindex・クロール禁止にする）。
- kitsuonmura.com をつなぐときは、`NEXT_PUBLIC_SITE_URL` と `NEXT_PUBLIC_ALLOW_INDEXING=true` を設定し、
  Firebase コンソールの Authentication →「設定」→「承認済みドメイン」にドメインを追加する。

## 集会のテーマ

テーマは管理者だけが `/app/admin/themes` で追加できます（管理者の自分ページにも入口が出ます）。
いちばん新しい月のテーマが「今月の集会」になり、住民はそのテーマにだけ語りを置けます。
過去のテーマはアーカイブとして残り、削除できません。

## 吃音情報ガイド（/guide）

登録しなくても読める公開ページです。データは `content/guide/` の JSON から描画しています。
元の資料は `kitsuon_info_guide/`（CONTENT_GUIDE.md・IMPLEMENT_FOR_CLAUDE.md。リポジトリには入れていません）。

- 情報源を足す・直すときは `resources.json` を編集し、出典を確かめた日を `verified_on` に入れる。
  `status` が `reviewed` 以外のものは「要確認」と表示される。
- `groups.json` の `area` は加盟団体一覧の地域区分で、所在地ではない。開催日・連絡先・団体のサイトは未確認のため、
  団体ごとのリンクは出さず、全国言友会連絡協議会の一覧ページへ案内している。県別ページは個別に確かめてから作る。
- 書籍（/guide/books）は書誌情報を確かめるまで準備中（noindex、sitemap にも載せない）。
- リンク切れの定期確認はまだ仕組みがない。2026-11-24 時点では13件すべて開けることを確認した。

## 通報と運営の対応

住民は、ほかの住民の語り・本の物語・住民票を「通報する」から運営に知らせられます（理由を選び、補足は任意）。
同じ人が同じものを通報できるのは1回だけで、通報の内容は運営（管理者）にしか読めません。

運営は「自分」→「通報の確認」（`/app/admin/reports`）で、通報と対象の本文を読み、次の対応ができます。

- 非表示にする／表示に戻す：非表示にすると、書いた本人と運営にだけ見えます（本人の画面には「運営が非表示にしています」と出る）。
- 削除する（語り・本の物語のみ。元に戻せない）。住民票は退会の仕組みができるまで削除しない。
- 対応済みにする／未対応に戻す。

非表示はルール（`firestore.rules`）でも守っています。一覧の取得には `where("hidden", "==", false)` が必要です。
新しい通報が来てもメールなどの通知はないので、運営が定期的に画面を開いて確かめてください。

## 退会

住民は「自分」→「退会する」（`/app/me/leave`）で、パスワードを入れ直して退会できます（[src/lib/firebase/account.ts](src/lib/firebase/account.ts)）。

- 消すもの：住民票・吃音史、集会の語り、図書館の本の物語、自分が押した共感（対象の件数も1減らす）、ログイン用のアカウント。
- 残すもの：通報の記録（運営の対応のため）、ほかの住民がその人の語りに押した共感の記録（対象がないので表示されない）。
- 途中で失敗しても、もう一度押せば続きから消す。

## 利用規約・プライバシーポリシー

`/terms`・`/privacy`。運営者名と連絡先、制定日は `src/lib/metadata.ts`（OPERATOR_NAME・CONTACT_EMAIL・POLICY_DATE）。
プライバシーポリシーには、いまの仕組み（Firebase Authentication、Cloud Firestore〔東京 asia-northeast1〕、Vercel、
アクセス解析・広告なし）を書いている。外部サービスや集める情報を変えたら、ポリシーも直すこと。

## 構成

```
src/app/(public)/     公開エリア：トップ、吃音村について、情報ガイド、歓迎、住民登録、ログイン、
                      パスワード再設定、住民票の案内（/onboarding）
src/app/app/          住民限定エリア（/app。ログイン必須・noindex・下部タブ）：
                      ホーム、住民票、集会、図書館、自分、集会テーマの管理（/app/admin/themes）
src/components/       共通の部品（上部、下部タブ、村のイラスト、共感ボタン、確認ダイアログ、トースト）
src/components/ui.module.css  画面の部品のスタイル（DESIGN_SYSTEM.md に従う）
src/app/globals.css   色・書体と、入力欄などの土台
src/lib/firebase/     Firestore の読み書き
src/lib/auth/         ログイン状態（AuthProvider）
content/guide/        吃音情報ガイドのデータ（resources.json・groups.json と各ページの文章）
scripts/              seed.ts（サンプルデータ。本番には入れない）、set-admin.ts（管理者の付与）
tests/                セキュリティルールのテスト
```

## 作っていないもの（仕様にあり、これから）

- 通報が来たときの運営への通知（メールなど）。いまは運営が画面を開いて確かめる。
- メールアドレスの変更。
- 図書館の物語の書き直し（集会の語りは書き直せます）。
