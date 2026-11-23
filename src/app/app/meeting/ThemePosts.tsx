"use client";

// あるテーマの語りの一覧。返信はなく、共感ボタンだけ（件数は出さない）。新しい順に30件ずつ
import { useEffect, useState } from "react";
import { ReactionButton } from "@/components/ReactionButton";
import { LoadError, Loading } from "@/components/Status";
import s from "@/components/ui.module.css";
import { Who } from "@/components/Who";
import { useAuth } from "@/lib/auth/AuthProvider";
import { listThemePosts } from "@/lib/firebase/meeting";
import { myReactions } from "@/lib/firebase/reactions";
import { formatDate } from "@/lib/format";
import type { MeetingPost } from "@/lib/types";

const PAGE_SIZE = 30;
type Cursor = Awaited<ReturnType<typeof listThemePosts>>["cursor"];
type State = { themeId: string; posts: MeetingPost[]; cursor: Cursor; reacted: Set<string> | null };

export function ThemePosts({ themeId }: { themeId: string }) {
  const { user } = useAuth();
  const uid = user?.uid ?? "";
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState(false);
  const [more, setMore] = useState(false);

  useEffect(() => {
    let alive = true;
    listThemePosts(themeId, PAGE_SIZE).then(
      async (page) => {
        if (!alive) return;
        setState({ themeId, ...page, reacted: null });
        const reacted = await myReactions("post", page.posts.map((p) => p.id), uid).catch(() => new Set<string>());
        if (alive) setState((x) => (x && x.themeId === themeId ? { ...x, reacted } : x));
      },
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, [themeId, uid]);

  const loadMore = async () => {
    if (!state?.cursor) return;
    setMore(true);
    try {
      const page = await listThemePosts(themeId, PAGE_SIZE, state.cursor);
      const reacted = await myReactions("post", page.posts.map((p) => p.id), uid).catch(() => new Set<string>());
      setState((x) => x && { ...x, posts: [...x.posts, ...page.posts], cursor: page.cursor, reacted: new Set([...(x.reacted ?? []), ...reacted]) });
    } catch {
      setError(true);
    } finally {
      setMore(false);
    }
  };

  if (error) return <LoadError what="語り" />;
  if (!state || state.themeId !== themeId) return <Loading />;
  if (!state.posts.length) return <p className={s.muted}>まだ語りはありません。</p>;
  return (
    <div className={s.stack}>
      {state.posts.map((p) => (
        <article key={p.id} className={s.card}>
          <Who uid={p.authorUid} nickname={p.authorNickname} ageGroup={p.authorAgeGroup} note={formatDate(p.createdAt)} isMe={p.authorUid === uid} />
          <p className={s.prose}>{p.text}</p>
          <ReactionButton target={{ type: "post", id: p.id }} mine={p.authorUid === uid} reacted={state.reacted ? state.reacted.has(p.id) : undefined} />
        </article>
      ))}
      {state.cursor && (
        <button type="button" className={s.btnGhost} onClick={loadMore} disabled={more}>
          {more ? "読み込んでいます…" : "もっと見る"}
        </button>
      )}
    </div>
  );
}
