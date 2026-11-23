"use client";

// 過去の集会（アーカイブ）。読むことと共感はできるが、新しく語ることはできない
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { getCurrentThemeId, getTheme } from "@/lib/firebase/meeting";
import { formatThemeMonth } from "@/lib/format";
import type { Theme } from "@/lib/types";
import { MEETING_NOTE } from "../MeetingView";
import { ThemePosts } from "../ThemePosts";

export function PastMeeting() {
  const { themeId } = useParams<{ themeId: string }>();
  const router = useRouter();
  const [loaded, setLoaded] = useState<{ id: string; theme: Theme | null } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([getTheme(themeId), getCurrentThemeId()]).then(
      ([theme, currentId]) => {
        if (!alive) return;
        // 今月のテーマなら集会のトップで読む
        if (theme && theme.id === currentId) router.replace("/meeting");
        else setLoaded({ id: themeId, theme });
      },
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, [themeId, router]);

  const theme = loaded?.id === themeId ? loaded.theme : undefined;
  return (
    <>
      <TopBar title="過去の集会" back fallbackHref="/meeting" />
      <div className="pad">
        {error ? (
          <p className="error">集会を読み込めませんでした。時間をおいて、もう一度お試しください。</p>
        ) : theme === undefined ? (
          <p className="muted small" role="status">
            読み込んでいます…
          </p>
        ) : theme === null ? (
          <p className="muted">この集会は見つかりませんでした。</p>
        ) : (
          <>
            <div className="theme-head">
              <span className="eyebrow">過去の集会　{formatThemeMonth(theme.month)}</span>
              <h2 className="display" style={{ fontSize: 21 }}>
                {theme.title}
              </h2>
              {theme.description && <p>{theme.description}</p>}
            </div>
            <p className="note">{MEETING_NOTE}</p>
            <ThemePosts themeId={theme.id} />
          </>
        )}
      </div>
    </>
  );
}
