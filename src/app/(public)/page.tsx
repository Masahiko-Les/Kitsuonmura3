// 公開トップ（DESIGN_SYSTEM.md「公開トップ」）
import Link from "next/link";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import s from "@/components/ui.module.css";
import { OPERATOR_NAME, publicMetadata } from "@/lib/metadata";

const FEATURES = [
  { title: "住民票", text: "住民一人ひとりのプロフィールと、吃音とともに歩んできた吃音史を読めます。もちろん書くかどうかは自由です。" },
  { title: "集会", text: "毎月ひとつのテーマについて村人たちが文章で語ります。コメントやアドバイスはなく、みんなの語りをじっくり読み合うための場です。" },
  { title: "図書館", text: "村人たちの心の支えになった本とそのエピソードを大切に保管している場所です。交流しながら読書を深めましょう。" },
];

export const metadata = publicMetadata({
  description:
    "ここは、吃音者の、吃音者による、吃音者のための小さな村。吃音を抱えながら生きてきた人たちが集まり、文字だけで交流し、互いに支え合う場所です。",
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
          <p className={s.lead}>ここは、吃音者の、吃音者による、吃音者のための小さな村。</p>
          <p className={s.lead}>
            吃音を抱えながら生きてきた人たちが集まり、文字だけで交流し、互いに支え合う場所です。
          </p>
          <p className={s.lead}>吃音の方は、ぜひ村人になってください。一緒に語り合いましょう。</p>
        </div>
        <div className={s.stack}>
          <Link href="/welcome" className={s.btn}>
            吃音村の住民になる
          </Link>
          <Link href="/guide" className={s.btnGhost}>
            吃音情報をまとめたページはこちら
          </Link>
        </div>
        <section className={s.section}>
          <h2 className={s.h2}>吃音村でできること</h2>
          {FEATURES.map((f) => (
            <div key={f.title} className={s.card}>
              <span className={s.cardTitle}>{f.title}</span>
              <p className={`${s.small} ${s.muted}`}>{f.text}</p>
            </div>
          ))}
        </section>
        <section className={s.section}>
          <h2 className={s.h2}>吃音情報まとめページ</h2>
          <Link href="/guide" className={s.cardMuted}>
            <span className={s.cardTitle}>自助グループや相談先を探す</span>
            <span className={`${s.small} ${s.muted}`}>吃音村の村人でなくても読めます</span>
          </Link>
          <Link href="/about" className={s.textLink}>
            吃音村について
          </Link>
        </section>
        <section className={s.section} aria-label="規約と運営者">
          <nav className={s.tags} style={{ justifyContent: "center", gap: 16 }}>
            <Link href="/terms" className={`${s.small} ${s.muted}`} style={{ padding: 8 }}>
              利用規約
            </Link>
            <Link href="/privacy" className={`${s.small} ${s.muted}`} style={{ padding: 8 }}>
              プライバシーポリシー
            </Link>
          </nav>
          <p className={`${s.small} ${s.muted}`} style={{ textAlign: "center" }}>
            運営：{OPERATOR_NAME}
          </p>
        </section>
      </main>
    </>
  );
}
