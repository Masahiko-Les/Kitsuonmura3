# 吃音村

吃音当事者のためのオンライン自助グループ「吃音村」のWebアプリです。

- 仕様：[docs/開発指示書.md](docs/開発指示書.md)
- 画面・文言・デザインの基準：[docs/prototype.html](docs/prototype.html)（ブラウザで直接開けます）

## 開発

```bash
npm install
npm run dev   # http://localhost:3000
```

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm run lint` | ESLint |

## 構成

```
src/app/(public)/     公開エリア（ログイン不要・検索エンジンに公開）
src/app/(resident)/   住民限定エリア（ログイン必須・noindex・下部タブあり）
src/components/       共通コンポーネント（村のイラスト、下部タブ、上部バー、トースト、確認ダイアログ）
src/app/globals.css   デザイントークン（試作品の :root を移植）と共通クラス
```
