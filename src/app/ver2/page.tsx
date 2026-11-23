// 公開トップ（DESIGN_SYSTEM.md「公開トップ」）
import Link from "next/link";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { SITE } from "./_data/demo";
import s from "./ver2.module.css";

const FEATURES = [
  { title: "住民票", text: "住民一人ひとりの人生と、吃音とともに歩んできた吃音史を読めます。書くかどうかは自由です。" },
  { title: "集会", text: "毎月ひとつのテーマについて語ります。返信やアドバイスはなく、語りっぱなし・聴きっぱなしの場です。" },
  { title: "図書館", text: "苦労や夢と、それを支えてくれた本との体験を残す本棚です。" },
];

export default function Ver2Top() {
  return (
    <>
      <Header right={{ href: "/ver2/login", label: "ログイン" }} />
      <main className={s.main}>
        <Hero preload />
        <div className={s.stack}>
          <h1 className={s.h1}>{SITE.tagline}</h1>
          <p className={s.lead}>声を出さなくても、言葉を交わせる。互いの人生に触れ、支え合える場所。</p>
        </div>
        <div className={s.stack}>
          <Link href="/ver2/welcome" className={s.btn}>
            村の住民になる
          </Link>
          <Link href="/ver2/login" className={s.btnGhost}>
            すでに住民の方はこちら
          </Link>
          <Link href="/ver2/guide" className={s.textLink}>
            登録せずに吃音の情報を探す
          </Link>
        </div>
        <section className={s.section}>
          <h2 className={s.h2}>村でできること</h2>
          {FEATURES.map((f) => (
            <div key={f.title} className={s.card}>
              <span className={s.cardTitle}>{f.title}</span>
              <p className={`${s.small} ${s.muted}`}>{f.text}</p>
            </div>
          ))}
        </section>
        <section className={s.section}>
          <h2 className={s.h2}>吃音情報ガイド</h2>
          <Link href="/ver2/guide" className={s.cardMuted}>
            <span className={s.cardTitle}>自助グループや相談先を探す</span>
            <span className={`${s.small} ${s.muted}`}>登録しなくても読めます</span>
          </Link>
          <Link href="/ver2/about" className={s.textLink}>
            吃音村について
          </Link>
        </section>
      </main>
    </>
  );
}
