// 初めて訪れた人への歓迎（静止画。動きのある演出は入れない）
import Link from "next/link";
import { Header } from "@/components/Header";
import { publicMetadata } from "@/lib/metadata";
import { Hero } from "@/components/Hero";
import s from "@/components/ui.module.css";

export const metadata = publicMetadata({
  title: "ようこそ、吃音村へ",
  description: "ここには、あなたと同じように吃音を抱えながら生きる人たちがいます。たくさん語っても、何も語らずに過ごしてもかまいません。",
  path: "/welcome",
});

export default function Welcome() {
  return (
    <>
      <Header />
      <main className={s.main}>
        <Hero preload />
        <div className={s.stack}>
          <h1 className={s.h1} style={{ fontFamily: "var(--f-display)", fontSize: 27 }}>
            ようこそ、吃音村へ。
          </h1>
          <p className={s.lead}>ここには、あなたと同じように吃音を抱えながら生きる人たちがいます。</p>
          <p className={s.lead}>たくさん語っても、何も語らずに過ごしてもかまいません。どうぞ、あなたのペースで。</p>
        </div>
        <div className={s.stack}>
          <Link href="/signup" className={s.btn}>
            住民登録へ進む
          </Link>
          <Link href="/" className={s.textLink}>
            あとで
          </Link>
        </div>
      </main>
    </>
  );
}
