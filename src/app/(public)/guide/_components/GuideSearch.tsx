"use client";

// ガイドの中を、ことばと地域で探す。データはすべてページに含まれているので、ブラウザの中だけで絞り込む
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { AREAS, GROUP_LIST_URL, resourceArea, type GuideGroup, type GuidePage, type GuideResource } from "@content/guide";
import s from "@/components/ui.module.css";
import { GroupItem } from "./GroupFinder";
import g from "./guide.module.css";
import { ExternalLink, ResourceCard } from "./parts";

type Props = {
  pages: Pick<GuidePage, "slug" | "title" | "need" | "description" | "keywords" | "categories">[];
  resources: GuideResource[];
  groups: GuideGroup[];
};

const NATIONWIDE = "全国";

/** 全角・半角、大文字・小文字、カタカナ・ひらがなの違いを無視して比べる */
function norm(t: string) {
  return t
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

function matches(haystack: string[], terms: string[]) {
  const h = norm(haystack.join(" "));
  return terms.every((t) => h.includes(t));
}

export function GuideSearch({ pages, resources, groups }: Props) {
  const id = useId();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const terms = useMemo(() => norm(q).split(/\s+/).filter(Boolean), [q]);
  const active = terms.length > 0 || region !== "";

  // 情報源は、それが載っているページのことばでも見つかるようにする（「面接」→ 内閣府の配慮の資料）
  const categoryWords = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const p of pages) for (const c of p.categories) m.set(c, [p.title, p.need, ...p.keywords]);
    return m;
  }, [pages]);

  const result = useMemo(() => {
    if (!active) return null;
    const inRegion = (r: GuideResource) =>
      !region || (region === NATIONWIDE ? r.region === NATIONWIDE : resourceArea(r) === region);
    return {
      // ページは地域を持たないので、ことばで探したときだけ出す
      pages: terms.length ? pages.filter((p) => matches([p.title, p.need, p.description, ...p.keywords], terms)) : [],
      resources: resources.filter(
        (r) => inRegion(r) && matches([r.title, r.description, r.audience, r.region, ...(categoryWords.get(r.category) ?? [])], terms),
      ),
      groups:
        region === NATIONWIDE
          ? []
          : groups.filter((x) => (!region || x.area === region) && matches([x.name, x.area, "自助グループ 言友会"], terms)),
    };
  }, [active, pages, resources, groups, terms, region, categoryWords]);

  const total = result ? result.pages.length + result.resources.length + result.groups.length : 0;

  return (
    <div className={s.stack}>
      <form role="search" className={g.search} onSubmit={(e) => e.preventDefault()}>
        <div className={g.searchRow}>
          <div className={g.searchField}>
            <label htmlFor={`${id}-q`}>ことばで探す</label>
            <input
              id={`${id}-q`}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="例：面接、子ども、言語聴覚士"
              enterKeyHint="search"
            />
          </div>
          <div className={g.searchField}>
            <label htmlFor={`${id}-r`}>地域</label>
            <select id={`${id}-r`} value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">すべて</option>
              <option value={NATIONWIDE}>全国向けの情報</option>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </form>

      <p className={`${s.small} ${s.muted}`} aria-live="polite">
        {result ? `${total}件見つかりました。` : ""}
      </p>

      {result && total === 0 && (
        <p className={s.small}>
          見つかりませんでした。ことばを短くするか、下の「困りごとから探す」から選んでください。
        </p>
      )}

      {result && result.pages.length > 0 && (
        <section className={s.section} aria-label="カテゴリのページ">
          {result.pages.map((p) => (
            <Link key={p.slug} href={`/guide/${p.slug}`} className={s.cardMuted}>
              <span className={s.cardTitle}>{p.title}</span>
              <span className={s.small}>{p.description}</span>
            </Link>
          ))}
        </section>
      )}

      {result && result.resources.length > 0 && (
        <section className={s.section} aria-label="情報源">
          {result.resources.map((r) => (
            <ResourceCard key={r.id} r={r} />
          ))}
        </section>
      )}

      {result && result.groups.length > 0 && (
        <section className={s.section} aria-label="自助グループ">
          <h3 className={s.h2} style={{ fontSize: 15 }}>
            自助グループ（{result.groups.length}団体）
          </h3>
          <ul className={g.groupList}>
            {result.groups.map((x) => (
              <GroupItem key={x.name} x={x} />
            ))}
          </ul>
          <p className={`${s.small} ${s.muted}`}>
            地域は加盟団体一覧の区分で、団体の所在地ではありません。連絡先や開催日は、一覧のページから各団体の情報を確かめてください。
          </p>
          <ExternalLink href={GROUP_LIST_URL}>全国言友会連絡協議会・加盟団体一覧</ExternalLink>
        </section>
      )}
    </div>
  );
}
