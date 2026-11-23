"use client";

// 自分ページの「届いた回数」と「あなたの語り」（集会の語りと本棚の本）。確認ダイアログを経て削除できる
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LeafIcon } from "@/components/icons";
import { useToast } from "@/components/Toast";
import { deleteBook, listMyBooks } from "@/lib/firebase/books";
import { deleteMeetingPost, listMyPosts, listThemes } from "@/lib/firebase/meeting";
import { formatDate } from "@/lib/format";
import type { Book, MeetingPost } from "@/lib/types";

type Works = { uid: string; posts: MeetingPost[]; books: Book[]; themeTitles: Record<string, string> };
type Target = { kind: "post" | "book"; id: string };

export function MyWorks({ uid, historyReactionCount }: { uid: string; historyReactionCount: number }) {
  const toast = useToast();
  const [works, setWorks] = useState<Works | null>(null);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([listMyPosts(uid), listMyBooks(uid), listThemes()]).then(
      ([posts, books, themes]) => {
        if (!alive) return;
        setError(false);
        setWorks({ uid, posts, books, themeTitles: Object.fromEntries(themes.map((t) => [t.id, t.title])) });
      },
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, [uid]);

  const w = works?.uid === uid ? works : null;
  const reached =
    historyReactionCount +
    (w?.posts.reduce((a, p) => a + p.reactionCount, 0) ?? 0) +
    (w?.books.reduce((a, b) => a + b.reactionCount, 0) ?? 0);

  const onConfirm = async () => {
    if (!target || deleting) return;
    setDeleting(true);
    try {
      if (target.kind === "post") await deleteMeetingPost(target.id);
      else await deleteBook(target.id);
      setWorks((s) =>
        s && {
          ...s,
          posts: s.posts.filter((p) => p.id !== target.id),
          books: s.books.filter((b) => b.id !== target.id),
        },
      );
      toast("削除しました");
    } catch {
      toast("削除できませんでした。時間をおいて、もう一度お試しください。");
    } finally {
      setDeleting(false);
      setTarget(null);
    }
  };

  return (
    <>
      <div className="card" style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <span className="feature">
          <span className="ic">
            <LeafIcon />
          </span>
        </span>
        <p className="small">
          あなたの言葉は、これまでに
          <b style={{ fontSize: 18, fontVariantNumeric: "tabular-nums" }}> {w ? reached : "…"} </b>
          回、誰かに届きました。
        </p>
      </div>

      <h2 className="sec">あなたの語り</h2>
      {error ? (
        <p className="error">あなたの語りを読み込めませんでした。時間をおいて、もう一度お試しください。</p>
      ) : !w ? (
        <p className="muted small" role="status">
          読み込んでいます…
        </p>
      ) : w.posts.length || w.books.length ? (
        <div className="list">
          {w.posts.map((p) => (
            <div className="card" key={p.id}>
              <Link href={`/meeting/${p.themeId}`} className="eyebrow">
                集会　{w.themeTitles[p.themeId] ?? p.themeId}
              </Link>
              <p className="small clamp">{p.text}</p>
              <div className="archive-row">
                <span className="count">
                  {formatDate(p.createdAt)}・{p.reactionCount}人に届きました
                </span>
                <button
                  type="button"
                  className="text-btn"
                  style={{ color: "var(--danger)" }}
                  onClick={() => setTarget({ kind: "post", id: p.id })}
                  aria-label={`集会の語り（${formatDate(p.createdAt)}）を削除`}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
          {w.books.map((b) => (
            <div className="card" key={b.id}>
              <span className="eyebrow">図書館</span>
              <Link href={`/library/${b.id}`}>
                <b>『{b.title}』</b>
              </Link>
              <div className="archive-row">
                <span className="count">
                  {formatDate(b.createdAt)}・{b.reactionCount}人に届きました
                </span>
                <button
                  type="button"
                  className="text-btn"
                  style={{ color: "var(--danger)" }}
                  onClick={() => setTarget({ kind: "book", id: b.id })}
                  aria-label={`『${b.title}』を削除`}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted small">集会や図書館に置いた語りが、ここに並びます。</p>
      )}

      <ConfirmDialog
        open={!!target}
        message="この語りを削除しますか？削除すると、ほかの住民も読めなくなります。"
        confirmLabel={deleting ? "削除しています…" : "削除する"}
        onConfirm={onConfirm}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
