// 公開の吃音情報ガイド。登録しなくても読める（PRODUCT_SPEC.md §8）
import { GUIDE_CATEGORIES, GUIDE_RESOURCES } from "@content/guide";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { formatIsoDate } from "@/lib/format";
import { publicMetadata } from "@/lib/metadata";

export const metadata = publicMetadata({
  title: "吃音情報ガイド",
  description: "吃音の自助グループ、相談先、研究機関など、吃音に関する情報の案内です。登録しなくても読めます。",
  path: "/guide",
});

export default function Guide() {
  return (
    <>
      <Header kind="back" href="/" title="吃音情報ガイド" />
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
          <p className={`${s.small} ${s.muted}`}>カテゴリーごとの案内は、掲載する情報を確認しながら増やしていきます。</p>
        </section>
        <section className={s.section}>
          <h2 className={s.h2}>掲載している情報</h2>
          {GUIDE_RESOURCES.map((g) => (
            <div key={g.name} className={s.card}>
              <span className={s.cardLabel}>{g.category}</span>
              <span className={s.cardTitle}>{g.name}</span>
              <p className={s.small}>{g.summary}</p>
              <a href={g.url} target="_blank" rel="noopener noreferrer" className={s.small} style={{ color: "var(--brand)" }}>
                公式サイト：{g.url}
              </a>
              <span className={`${s.small} ${s.muted}`}>
                {g.checkedAt ? `最終確認日：${formatIsoDate(g.checkedAt)}` : "掲載内容は確認中です"}
              </span>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
