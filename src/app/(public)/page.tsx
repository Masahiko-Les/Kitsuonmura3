// 公開トップ（DESIGN_SYSTEM.md「公開トップ」）
import Link from "next/link";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import s from "@/components/ui.module.css";
import { publicMetadata } from "@/lib/metadata";

const FEATURES = [
  { title: "住民票", text: "住民一人ひとりの人生と、吃音とともに歩んできた吃音史を読めます。書くかどうかは自由です。" },
  { title: "集会", text: "毎月ひとつのテーマについて語ります。返信やアドバイスはなく、語りっぱなし・聴きっぱなしの場です。" },
  { title: "図書館", text: "苦労や夢と、それを支えてくれた本との体験を残す本棚です。" },
];

export const metadata = publicMetadata({
  description:
    "吃音者の、吃音者による、吃音者のためのオンライン自助コミュニティ。声を出さなくても、言葉を交わせる。互いの人生に触れ、支え合える場所です。",
  path: "/",
});

export default function Top() {
  return (
    <>
      <Header right={{ href: "/login", label: "ログイン" }} />
      <main className={s.main}>
        <Hero preload />
        <div className={s.stack} style={{ textAlign: "center" }}>
          <h1 className={s.h1} style={{ fontFamily: "var(--f-display)" }}>
            ようこそ、吃音村へ
          </h1>
          <p className={s.lead}>ここは、吃音者の、吃音者による、吃音者のための小さな村です。</p>
          <p className={s.lead}>
            吃音を抱えながら生きてきた人たちが集まり、完全にテキストベースで、互いの存在を感じ、支え合う場所です。
          </p>
        </div>
        <div className={s.stack}>
          <Link href="/welcome" className={s.btn}>
            吃音村の住民になる
          </Link>
          <Link href="/login" className={s.btnGhost}>
            すでに住民の方はこちら
          </Link>
          <Link href="/guide" className={s.textLink}>
            吃音情報をまとめたページはこちら
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
          <Link href="/guide" className={s.cardMuted}>
            <span className={s.cardTitle}>自助グループや相談先を探す</span>
            <span className={`${s.small} ${s.muted}`}>登録しなくても読めます</span>
          </Link>
          <Link href="/about" className={s.textLink}>
            吃音村について
          </Link>
        </section>
      </main>
    </>
  );
}
