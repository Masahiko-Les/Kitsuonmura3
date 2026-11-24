"use client";

// 住民票の一覧。いちばん上に自分の住民票、その下にほかの住民を新しく村に来た順に30人ずつ
// （仕様は「自分以外の住民」だが、書いた本人が見当たらず戸惑うため、自分のものを先頭に出す）
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { LoadError, Loading } from "@/components/Status";
import s from "@/components/ui.module.css";
import { Who } from "@/components/Who";
import { useAuth } from "@/lib/auth/AuthProvider";
import { listResidents, type ResidentPage } from "@/lib/firebase/users";
import { readingMinutes, splitTags } from "@/lib/format";
import type { UserProfile } from "@/lib/types";

const PAGE_SIZE = 30;

export function ResidentsView() {
  const { user, profile } = useAuth();
  const [list, setList] = useState<{ residents: UserProfile[]; cursor: ResidentPage["cursor"] } | null>(null);
  const [error, setError] = useState(false);
  const [more, setMore] = useState(false);

  useEffect(() => {
    let alive = true;
    listResidents(PAGE_SIZE).then(
      (p) => alive && setList(p),
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, []);

  const loadMore = async () => {
    if (!list?.cursor) return;
    setMore(true);
    try {
      const p = await listResidents(PAGE_SIZE, list.cursor);
      setList((l) => l && { residents: [...l.residents, ...p.residents], cursor: p.cursor });
    } catch {
      setError(true);
    } finally {
      setMore(false);
    }
  };

  const others = list?.residents.filter((r) => r.uid !== user?.uid) ?? [];
  return (
    <>
      <Header logoHref="/app" />
      <main className={`${s.main} ${s.withNav}`}>
        <h1 className={s.h2}>住民票</h1>
        {profile && (
          <section className={s.section} aria-labelledby="mine">
            <h2 id="mine" className={`${s.small} ${s.muted}`} style={{ margin: 0, fontWeight: 400 }}>
              あなたの住民票
            </h2>
            <ResidentCard r={profile} isMe />
          </section>
        )}
        {profile && (
          <h2 className={`${s.small} ${s.muted}`} style={{ margin: 0, fontWeight: 400 }}>
            村で暮らす人たち
          </h2>
        )}
        {error ? (
          <LoadError what="住民票" />
        ) : !list ? (
          <Loading />
        ) : others.length ? (
          <div className={s.stack}>
            {others.map((r) => (
              <ResidentCard key={r.uid} r={r} />
            ))}
            {list.cursor && (
              <button type="button" className={s.btnGhost} onClick={loadMore} disabled={more}>
                {more ? "読み込んでいます…" : "もっと見る"}
              </button>
            )}
          </div>
        ) : (
          <p className={s.muted}>ほかの住民は、まだいません。</p>
        )}
      </main>
    </>
  );
}

function ResidentCard({ r, isMe = false }: { r: UserProfile; isMe?: boolean }) {
  const tags = splitTags(r.hardScenes);
  return (
    <Link href={`/app/residents/${r.uid}`} className={s.card}>
      <Who uid={r.uid} nickname={r.nickname} ageGroup={r.ageGroup} job={r.job} link={false} isMe={isMe} />
      {r.intro && <p className={s.small}>{r.intro}</p>}
      {tags.length > 0 && (
        <div className={s.tags}>
          {tags.map((t, i) => (
            <span key={`${t}-${i}`} className={s.tag}>
              {t}
            </span>
          ))}
        </div>
      )}
      {r.history && <span className={`${s.small} ${s.muted}`}>吃音史　約{readingMinutes(r.history)}分で読めます</span>}
    </Link>
  );
}
