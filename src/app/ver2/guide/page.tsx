// 公開の吃音情報ガイド（試作）。掲載情報は公開前に要再確認
import { Header } from "../_components/Header";
import { GUIDE_CATEGORIES, GUIDE_RESOURCES } from "../_data/demo";
import s from "../ver2.module.css";

export const metadata = { title: "吃音情報ガイド" };

export default function Guide() {
  return (
    <>
      <Header kind="back" href="/ver2" title="吃音情報ガイド" />
      <main className={s.main}>
        <p className={s.lead}>登録しなくても読める、吃音に関する情報の案内です。</p>
        <section className={s.section}>
          <h2 className={s.h2}>カテゴリー</h2>
          <div className={s.tags}>
            {GUIDE_CATEGORIES.map((c) => (
              <span key={c} className={s.tag}>
                {c}
              </span>
            ))}
          </div>
          <p className={`${s.small} ${s.muted}`}>カテゴリーごとのページは、掲載情報を確認してから作ります。</p>
        </section>
        <section className={s.section}>
          <h2 className={s.h2}>掲載候補</h2>
          {GUIDE_RESOURCES.map((g) => (
            <div key={g.name} className={s.card}>
              <span className={s.cardLabel}>{g.category}</span>
              <span className={s.cardTitle}>{g.name}</span>
              <a href={g.official_url} target="_blank" rel="noopener noreferrer" className={s.small}>
                {g.official_url}
              </a>
              <span className={`${s.small} ${s.muted}`}>{g.verification_status}</span>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
