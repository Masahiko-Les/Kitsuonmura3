// 自分：住民票、編集、過去の投稿、アカウント設定、退会、安全の案内
import Link from "next/link";
import { Header } from "../../_components/Header";
import { ME } from "../../_data/demo";
import s from "../../ver2.module.css";

export const metadata = { title: "自分" };

export default function Me() {
  return (
    <>
      <Header />
      <main className={`${s.main} ${s.withNav}`}>
        <div className={s.card}>
          <div className={s.who}>
            <span className={s.avatar} aria-hidden="true">
              あ
            </span>
            <div className={s.name}>{ME.nickname}（デモ）</div>
          </div>
          <p className={`${s.small} ${s.muted}`}>住民票はまだ書かれていません。書かずに過ごすこともできます。</p>
          <Link href="/ver2/app/me/edit" className={s.btnGhost}>
            住民票・吃音史を書く
          </Link>
        </div>
        <section className={s.section}>
          <h2 className={s.h2}>あなたの語り</h2>
          <p className={`${s.small} ${s.muted}`}>集会や図書館に置いた語りが、ここに並びます。自分でいつでも消せます。</p>
        </section>
        <section className={s.section}>
          <h2 className={s.h2}>設定と案内</h2>
          <div className={s.card} style={{ gap: 12 }}>
            <span>アカウント設定（メールアドレス・パスワード）</span>
            <span>退会とデータの削除</span>
            <span className={`${s.small} ${s.muted}`}>この2つは本番で用意します（デモでは使えません）。</span>
          </div>
          <Link href="/ver2/guide" className={s.card}>
            <span className={s.cardTitle}>つらいときの相談先</span>
            <span className={`${s.small} ${s.muted}`}>
              村は医療や危機対応の場ではありません。相談先は吃音情報ガイドにまとめていきます。
            </span>
          </Link>
          <Link href="/ver2/about" className={s.textLink}>
            吃音村について
          </Link>
          <Link href="/ver2" className={s.textLink}>
            ログアウト（デモのトップへ）
          </Link>
        </section>
      </main>
    </>
  );
}
