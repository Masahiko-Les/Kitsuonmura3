// ガイドの各カテゴリページの共通の形：パンくず、見出し、本文、情報源、ほかのカテゴリ、注意書き
import Link from "next/link";
import { GUIDE_PAGES, getGuidePage, resourcesFor, type GuidePageSlug } from "@content/guide";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { publicMetadata } from "@/lib/metadata";
import g from "./guide.module.css";
import { Breadcrumbs, GuideNote, ResourceCard } from "./parts";

export function guideMetadata(slug: GuidePageSlug) {
  const p = getGuidePage(slug);
  const meta = publicMetadata({ title: `${p.title}｜吃音情報まとめページ`, description: p.description, path: `/guide/${slug}` });
  // 中身のない準備中のページは検索結果に出さない（sitemap にも載せていない）
  return p.categories.length === 0 && slug === "books" ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export function GuidePageView({ slug, children }: { slug: GuidePageSlug; children?: React.ReactNode }) {
  const page = getGuidePage(slug);
  const resources = resourcesFor(page);
  return (
    <>
      <Header kind="back" href="/guide" title="吃音情報まとめページ" />
      <main className={s.main}>
        <div className={s.stack}>
          <Breadcrumbs items={[{ href: "/", label: "吃音村" }, { href: "/guide", label: "吃音情報まとめページ" }, { label: page.title }]} />
          <h1 className={s.h1}>{page.title}</h1>
          {page.body.map((p) => (
            <p key={p} className={s.lead}>
              {p}
            </p>
          ))}
        </div>

        {children}

        {resources.length > 0 && (
          <section className={s.section} aria-labelledby="sources">
            <h2 id="sources" className={s.h2}>
              公式の情報・出典
            </h2>
            {resources.map((r) => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </section>
        )}

        <section className={s.section} aria-labelledby="others">
          <h2 id="others" className={s.h2}>
            ほかの困りごとから探す
          </h2>
          <div className={g.needs}>
            {GUIDE_PAGES.filter((p) => p.slug !== slug).map((p) => (
              <Link key={p.slug} href={`/guide/${p.slug}`} className={g.need}>
                {p.need}
              </Link>
            ))}
          </div>
        </section>

        <GuideNote />
      </main>
    </>
  );
}
