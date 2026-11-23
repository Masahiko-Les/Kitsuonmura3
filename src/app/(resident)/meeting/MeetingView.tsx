"use client";

// 集会（試作品の V.meeting）。今月のテーマと語り、これまでの集会（アーカイブ）
import Link from "next/link";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { countThemePosts, getCurrentThemeId, listThemes } from "@/lib/firebase/meeting";
import { formatThemeMonth } from "@/lib/format";
import type { Theme } from "@/lib/types";
import { ThemePosts } from "./ThemePosts";

export const MEETING_NOTE =
  "集会は「言いっぱなし、聞きっぱなし」の場です。コメントやアドバイスはつきません。読んで心に届いたら、ボタンで伝えてください。";

export function MeetingView() {
  const [data, setData] = useState<{ current: Theme | null; archive: Theme[] } | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([getCurrentThemeId(), listThemes()]).then(
      ([currentId, themes]) => {
        if (!alive) return;
        const current = themes.find((t) => t.id === currentId) ?? null;
        const archive = themes.filter((t) => t.id !== currentId);
        setData({ current, archive });
        Promise.all(archive.map(async (t) => [t.id, await countThemePosts(t.id)] as const)).then(
          (pairs) => alive && setCounts(Object.fromEntries(pairs)),
          () => {},
        );
      },
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <TopBar title="集会" />
      <div className="pad">
        {error ? (
          <p className="error">集会を読み込めませんでした。時間をおいて、もう一度お試しください。</p>
        ) : !data ? (
          <p className="muted small" role="status">
            読み込んでいます…
          </p>
        ) : (
          <>
            {data.current ? (
              <>
                <div className="theme-head">
                  <span className="eyebrow">今月のテーマ　{formatThemeMonth(data.current.month)}</span>
                  <h2 className="display" style={{ fontSize: 21 }}>
                    {data.current.title}
                  </h2>
                  {data.current.description && <p>{data.current.description}</p>}
                  <Link href="/meeting/compose" className="btn">
                    このテーマで語る
                  </Link>
                </div>
                <p className="note">{MEETING_NOTE}</p>
                <ThemePosts themeId={data.current.id} />
              </>
            ) : (
              <p className="muted">今月の集会のテーマは、まだ用意されていません。</p>
            )}
            {data.archive.length > 0 && (
              <>
                <h2 className="sec">これまでの集会</h2>
                <div className="list">
                  {data.archive.map((t) => (
                    <Link key={t.id} href={`/meeting/${t.id}`} className="card">
                      <div className="archive-row">
                        <div>
                          <span className="eyebrow">{formatThemeMonth(t.month)}</span>
                          <div style={{ fontWeight: 700, marginTop: 4 }}>{t.title}</div>
                        </div>
                        {counts[t.id] !== undefined && <span className="count">{counts[t.id]}件の語り</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
