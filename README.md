# 吃音村

吃音当事者のためのオンライン自助グループ「吃音村」のWebアプリです。

- 仕様：[docs/開発指示書.md](docs/開発指示書.md)
- 画面・文言・デザインの基準：[docs/prototype.html](docs/prototype.html)（ブラウザで直接開けます）

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

Firestore のセキュリティルールは `firestore.rules`。反映は `firebase deploy --only firestore:rules`。

開発中はメール確認を無効にしています。本番前に `.env` の `NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION=true` と、
`firestore.rules` の `requireEmailVerification()` を `true` にしてください。

## 構成

```
src/app/(public)/     公開エリア（ログイン不要・検索エンジンに公開）
src/app/(resident)/   住民限定エリア（ログイン必須・noindex・下部タブあり）
src/components/       共通コンポーネント（村のイラスト、下部タブ、上部バー、トースト、確認ダイアログ）
src/lib/firebase/     Firestore の読み書き
src/lib/auth/         ログイン状態（AuthProvider）
scripts/              seed.ts（サンプルデータ）
content/guide.ts      吃音情報ガイドのデータ（URL・情報源・最終確認日はここで更新）
src/app/globals.css   デザイントークン（試作品の :root を移植）と共通クラス
```
