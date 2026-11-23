"use client";

// 過去の集会。読むことと共感はできるが、新しく語れるのは今月のテーマだけ
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { LoadError, Loading } from "@/components/Status";
import s from "@/components/ui.module.css";
import { getCurrentThemeId, getTheme } from "@/lib/firebase/meeting";
import type { Theme } from "@/lib/types";
import { ThemePosts } from "../ThemePosts";
import { MEETING_NOTE, TopicHead } from "../TopicHead";

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
        // 今月のテーマなら集会のページで読む
        if (theme && theme.id === currentId) router.replace("/app/meeting");
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
      <Header kind="back" href="/app/meeting" title="過去の集会" />
      <main className={`${s.main} ${s.withNav}`}>
        {error ? (
          <LoadError what="集会" />
        ) : theme === undefined ? (
          <Loading />
        ) : theme === null ? (
          <p className={s.muted}>この集会は見つかりませんでした。</p>
        ) : (
          <>
            <TopicHead theme={theme} />
            <p className={s.note}>{MEETING_NOTE}</p>
            <ThemePosts themeId={theme.id} />
          </>
        )}
      </main>
    </>
  );
}
