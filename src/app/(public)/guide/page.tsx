// 公開の吃音情報まとめページの入口。登録しなくても読める（kitsuon_info_guide/CONTENT_GUIDE.md）
import Link from "next/link";
import { GUIDE_GROUPS, GUIDE_PAGES, GUIDE_RESOURCES, GUIDE_REVIEW_DATE } from "@content/guide";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { formatIsoDate } from "@/lib/format";
import { publicMetadata } from "@/lib/metadata";
import g from "./_components/guide.module.css";
import { GuideSearch } from "./_components/GuideSearch";
import { Breadcrumbs, GuideNote } from "./_components/parts";

export const metadata = publicMetadata({
  title: "吃音情報まとめページ",
  description:
    "吃音について知りたいとき、仲間を探したいときに。吃音の解説、自助グループ、医療・相談、学校・仕事、研究資料への入口です。登録しなくても使えます。",
  path: "/guide",
});

export default function Guide() {
  return (
    <>
      <Header kind="back" href="/" title="吃音情報まとめページ" />
      <main className={s.main}>
        <div className={s.stack}>
          <Breadcrumbs items={[{ href: "/", label: "吃音村" }, { label: "吃音情報まとめページ" }]} />
          <h1 className={s.h1}>吃音について知りたいとき、仲間を探したいとき。</h1>
          <p className={s.lead}>
            吃音村の吃音情報まとめページは、吃音に関する信頼できる情報や、地域の自助グループへの入口です。登録しなくても使えます。あなたのペースで、必要な情報を探してください。
          </p>
        </div>

        <section className={s.section} aria-labelledby="search">
          <h2 id="search" className={s.h2}>
            ことば・地域で探す
          </h2>
          <GuideSearch
            pages={GUIDE_PAGES.map(({ slug, title, need, description, keywords, categories }) => ({ slug, title, need, description, keywords, categories }))}
            resources={GUIDE_RESOURCES}
            groups={GUIDE_GROUPS}
          />
        </section>

        <section className={s.section} aria-labelledby="needs">
          <h2 id="needs" className={s.h2}>
            困りごとから探す
          </h2>
          <div className={g.needs}>
            {GUIDE_PAGES.map((p) => (
              <Link key={p.slug} href={`/guide/${p.slug}`} className={g.need}>
                {p.need}
              </Link>
            ))}
          </div>
        </section>

        <p className={`${s.small} ${s.muted}`}>
          掲載している情報源は{GUIDE_RESOURCES.length}件、自助グループは{GUIDE_GROUPS.length}団体です（{formatIsoDate(GUIDE_REVIEW_DATE)}
          に出典を確認）。少しずつ増やしていきます。
        </p>

        <GuideNote />

        <Link href="/welcome" className={s.textLink}>
          吃音村の住民になる（オンラインで仲間と語る）
        </Link>
      </main>
    </>
  );
}
