// ホーム（reference-ui.png の骨格：村のイラスト、おかえりなさい。、集会・図書館のカード）
import Link from "next/link";
import { Header } from "../_components/Header";
import { Hero } from "../_components/Hero";
import { CURRENT_TOPIC } from "../_data/demo";
import s from "../ver2.module.css";

export const metadata = { title: "ホーム" };

export default function Home() {
  return (
    <>
      <Header />
      <main className={`${s.main} ${s.withNav}`}>
        <Hero preload />
        <div className={s.stack}>
          <h1 className={s.h1}>おかえりなさい。</h1>
          <p className={s.lead}>ここには、あなたと同じように吃音を抱えながら生きている人たちがいます。</p>
        </div>
        <div className={s.stack}>
          <Link href="/ver2/app/meeting" className={s.cardMuted}>
            <span className={s.cardLabel}>今月の集会</span>
            <span className={s.cardTitle}>{CURRENT_TOPIC.title}</span>
            <span className={s.muted}>村人たちの語りを読む</span>
          </Link>
          <Link href="/ver2/app/library" className={s.cardMuted}>
            <span className={s.cardLabel}>図書館</span>
            <span className={s.cardTitle}>村人の人生を支えた本</span>
            <span className={s.muted}>苦労と読書の物語に触れる</span>
          </Link>
          <Link href="/ver2/app/residents" className={s.cardMuted}>
            <span className={s.cardLabel}>住民票</span>
            <span className={s.cardTitle}>村で暮らす人たち</span>
            <span className={s.muted}>それぞれの吃音史を読む</span>
          </Link>
        </div>
      </main>
    </>
  );
}
