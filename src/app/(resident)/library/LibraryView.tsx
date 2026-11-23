"use client";

// 図書館（試作品の V.library）。テーマで絞り込み、新しく置かれた順に30冊ずつ
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { BOOK_TAGS, type BookTag } from "@/lib/constants";
import { listBooks } from "@/lib/firebase/books";
import type { Book } from "@/lib/types";

const PAGE_SIZE = 30;
type Cursor = Awaited<ReturnType<typeof listBooks>>["cursor"];

export function LibraryView() {
  const { user } = useAuth();
  const [tag, setTag] = useState<BookTag | null>(null);
  const [state, setState] = useState<{ tag: BookTag | null; books: Book[]; cursor: Cursor } | null>(null);
  const [error, setError] = useState(false);
  const [more, setMore] = useState(false);

  useEffect(() => {
    let alive = true;
    listBooks(tag, PAGE_SIZE).then(
      (page) => {
        if (!alive) return;
        setError(false);
        setState({ tag, ...page });
      },
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, [tag]);

  const loadMore = async () => {
    if (!state?.cursor) return;
    setMore(true);
    try {
      const forTag = state.tag;
      const page = await listBooks(forTag, PAGE_SIZE, state.cursor);
      // 読み込み中にテーマを切り替えていたら捨てる
      setState((s) => (s && s.tag === forTag ? { ...s, books: [...s.books, ...page.books], cursor: page.cursor } : s));
    } catch {
      setError(true);
    } finally {
      setMore(false);
    }
  };

  const current = state && state.tag === tag ? state : null;
  return (
    <>
      <TopBar title="図書館" />
      <div className="pad">
        <p className="display" style={{ fontSize: 16, lineHeight: 1.9 }}>
          苦しいときに支えになった本と、その人の物語が並ぶ本棚です。
        </p>
        <Link href="/library/new" className="btn block">
          本棚に一冊置く
        </Link>
        <div className="filters" role="group" aria-label="テーマで絞り込む">
          {[null, ...BOOK_TAGS].map((t) => (
            <button
              key={t ?? "all"}
              type="button"
              className={`filter ${t === tag ? "on" : ""}`}
              aria-pressed={t === tag}
              onClick={() => setTag(t)}
            >
              {t ?? "すべて"}
            </button>
          ))}
        </div>
        <div className="list">
          {error ? (
            <p className="error">本棚を読み込めませんでした。時間をおいて、もう一度お試しください。</p>
          ) : !current ? (
            <p className="muted small" role="status">
              読み込んでいます…
            </p>
          ) : current.books.length ? (
            current.books.map((b) => <BookCard key={b.id} book={b} mine={b.authorUid === user?.uid} />)
          ) : (
            <p className="muted">{tag ? "このテーマの本はまだありません。" : "本棚にはまだ本がありません。"}</p>
          )}
          {current?.cursor && (
            <button type="button" className="btn ghost block" onClick={loadMore} disabled={more}>
              {more ? "読み込んでいます…" : "もっと見る"}
            </button>
          )}
        </div>
        <p className="note">
          図書館は、吃音の治し方を教え合う場所ではありません。吃音を抱えながら豊かに生きるための読書を分かち合う場所です。
        </p>
      </div>
    </>
  );
}
