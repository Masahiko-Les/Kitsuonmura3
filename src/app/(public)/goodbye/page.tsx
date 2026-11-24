// 退会のあとに表示する
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";

export const metadata: Metadata = { title: "退会しました", robots: { index: false } };

export default function Goodbye() {
  return (
    <>
      <Header />
      <main className={s.main}>
        <div className={s.stack}>
          <h1 className={s.h1}>退会しました。</h1>
          <p className={s.lead}>これまで吃音村で過ごしてくださって、ありがとうございました。</p>
          <p className={s.lead}>
            吃音情報まとめページは、登録しなくてもいつでも読めます。また来たくなったら、いつでも新しく住民になれます。
          </p>
        </div>
        <div className={s.stack}>
          <Link href="/guide" className={s.btnGhost}>
            吃音情報まとめページを見る
          </Link>
          <Link href="/" className={s.textLink}>
            トップへ
          </Link>
        </div>
      </main>
    </>
  );
}
