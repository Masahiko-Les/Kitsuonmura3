"use client";

// あるテーマの語りの一覧。新しい順に30件ずつ読み、自分が共感したかどうかもまとめて確かめる
import { useEffect, useState } from "react";
import { PostCard } from "@/components/PostCard";
import { useAuth } from "@/lib/auth/AuthProvider";
import { countThemePosts, listThemePosts } from "@/lib/firebase/meeting";
import { myReactions } from "@/lib/firebase/reactions";
import type { MeetingPost } from "@/lib/types";

const PAGE_SIZE = 30;

type Cursor = Awaited<ReturnType<typeof listThemePosts>>["cursor"];

export function ThemePosts({ themeId }: { themeId: string }) {
  const { user } = useAuth();
  const uid = user?.uid ?? "";
  const [state, setState] = useState<{
    themeId: string;
    posts: MeetingPost[];
    cursor: Cursor;
    reacted: Set<string> | null;
    count: number | null;
  } | null>(null);
  const [error, setError] = useState(false);
  const [more, setMore] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([listThemePosts(themeId, PAGE_SIZE), countThemePosts(themeId)]).then(
      async ([page, count]) => {
        if (!alive) return;
        setState({ themeId, ...page, reacted: null, count });
        const reacted = await myReactions("post", page.posts.map((p) => p.id), uid).catch(() => new Set<string>());
        if (alive) setState((s) => (s && s.themeId === themeId ? { ...s, reacted } : s));
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
      setState((s) =>
        s && {
          ...s,
          posts: [...s.posts, ...page.posts],
          cursor: page.cursor,
          reacted: new Set([...(s.reacted ?? []), ...reacted]),
        },
      );
    } catch {
      setError(true);
    } finally {
      setMore(false);
    }
  };

  if (error) return <p className="error">語りを読み込めませんでした。時間をおいて、もう一度お試しください。</p>;
  if (!state || state.themeId !== themeId) {
    return (
      <p className="muted small" role="status">
        読み込んでいます…
      </p>
    );
  }
  return (
    <>
      <h2 className="sec">{state.count ?? state.posts.length}件の語り</h2>
      <div className="list">
        {state.posts.length ? (
          state.posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              mine={p.authorUid === uid}
              reacted={state.reacted ? state.reacted.has(p.id) : undefined}
            />
          ))
        ) : (
          <p className="muted">まだ語りはありません。</p>
        )}
        {state.cursor && (
          <button type="button" className="btn ghost block" onClick={loadMore} disabled={more}>
            {more ? "読み込んでいます…" : "もっと見る"}
          </button>
        )}
      </div>
    </>
  );
}
