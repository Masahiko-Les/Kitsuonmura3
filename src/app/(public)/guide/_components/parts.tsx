// 吃音情報まとめページの共通部品（サーバーで描画する）
import Link from "next/link";
import { SOURCE_TYPE_LABEL, type GuideResource } from "@content/guide";
import s from "@/components/ui.module.css";
import { formatIsoDate } from "@/lib/format";
import g from "./guide.module.css";

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="パンくずリスト" className={g.crumbs}>
      <ol>
        {items.map((it) => (
          <li key={it.label}>{it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

/** 外部サイトへのリンク。新しいタブで開き、開いた先からこちらを操作させない */
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={g.ext}>
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  );
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function ResourceCard({ r, headingLevel = 3 }: { r: GuideResource; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={s.card}>
      {r.status !== "reviewed" && <span className={g.warn}>要確認</span>}
      <H className={s.cardTitle} style={{ margin: 0 }}>
        {r.title}
      </H>
      <p className={s.small}>{r.description}</p>
      <dl className={g.facts}>
        <dt>対象</dt>
        <dd>{r.audience}</dd>
        <dt>地域</dt>
        <dd>{r.region}</dd>
        <dt>発信元</dt>
        <dd>
          {SOURCE_TYPE_LABEL[r.source_type] ?? "要確認"}（{hostOf(r.url)}）
        </dd>
        <dt>確認日</dt>
        <dd>{r.verified_on ? `${formatIsoDate(r.verified_on)}（${r.verification_scope}）` : "要確認"}</dd>
      </dl>
      <ExternalLink href={r.url}>公式ページを開く</ExternalLink>
    </article>
  );
}

/** ガイドの各ページの下に出す注意書き */
export function GuideNote() {
  return (
    <aside className={s.note} aria-label="このまとめページについて">
      このまとめページは、医療行為や診断ではありません。確認日は、出典のページが存在し、その主旨を確かめた日です。
      団体がいま活動していることや、相談窓口が受け付けていること、リンク先がいまも開けることを保証するものではありません。
      すべての情報を網羅しているわけでもありません。急な体調の変化や命の危険があるときは、ためらわずに119番・110番へ連絡してください。
    </aside>
  );
}
