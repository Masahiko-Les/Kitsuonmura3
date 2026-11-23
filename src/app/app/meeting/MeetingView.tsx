"use client";

// 集会：今月のテーマと語り、これまでの集会
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { LoadError, Loading } from "@/components/Status";
import s from "@/components/ui.module.css";
import { getCurrentThemeId, listThemes } from "@/lib/firebase/meeting";
import { formatThemeMonth } from "@/lib/format";
import type { Theme } from "@/lib/types";
import { ThemePosts } from "./ThemePosts";
import { MEETING_NOTE, TopicHead } from "./TopicHead";

export function MeetingView() {
  const [data, setData] = useState<{ current: Theme | null; archive: Theme[] } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([getCurrentThemeId(), listThemes()]).then(
      ([currentId, themes]) =>
        alive && setData({ current: themes.find((t) => t.id === currentId) ?? null, archive: themes.filter((t) => t.id !== currentId) }),
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Header logoHref="/app" />
      <main className={`${s.main} ${s.withNav}`}>
        {error ? (
          <LoadError what="集会" />
        ) : !data ? (
          <Loading />
        ) : (
          <>
            {data.current ? (
              <>
                <TopicHead theme={data.current} />
                <Link href="/app/meeting/compose" className={s.btn}>
                  このテーマで語る
                </Link>
                <p className={s.note}>{MEETING_NOTE}</p>
                <section className={s.section}>
                  <h2 className={s.h2}>住民の語り</h2>
                  <ThemePosts themeId={data.current.id} />
                </section>
              </>
            ) : (
              <p className={s.muted}>今月の集会のテーマは、まだ用意されていません。</p>
            )}
            {data.archive.length > 0 && (
              <section className={s.section}>
                <h2 className={s.h2}>これまでの集会</h2>
                {data.archive.map((t) => (
                  <Link key={t.id} href={`/app/meeting/${t.id}`} className={s.card}>
                    <span className={s.cardLabel}>{formatThemeMonth(t.month)}</span>
                    <span className={s.cardTitle}>{t.title}</span>
                  </Link>
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}
