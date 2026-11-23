// 初めて訪れた人への歓迎（静止画。動きのある演出は入れない）
import Link from "next/link";
import { Header } from "../_components/Header";
import { Hero } from "../_components/Hero";
import s from "../ver2.module.css";

export const metadata = { title: "ようこそ、吃音村へ" };

export default function Welcome() {
  return (
    <>
      <Header />
      <main className={s.main}>
        <Hero preload />
        <div className={s.stack}>
          <h1 className={s.h1} style={{ fontFamily: "var(--v2-display)", fontSize: 27 }}>
            ようこそ、吃音村へ。
          </h1>
          <p className={s.lead}>ここには、あなたと同じように吃音を抱えながら生きる人たちがいます。</p>
          <p className={s.lead}>たくさん語っても、何も語らずに過ごしてもかまいません。どうぞ、あなたのペースで。</p>
        </div>
        <div className={s.stack}>
          <Link href="/ver2/signup" className={s.btn}>
            住民登録へ進む
          </Link>
          <Link href="/ver2" className={s.textLink}>
            あとで
          </Link>
        </div>
      </main>
    </>
  );
}
