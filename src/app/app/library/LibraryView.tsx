"use client";

// 図書館：村人の苦労や夢と、それを支えた本の物語。新しい順に30件ずつ
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { LoadError, Loading } from "@/components/Status";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { listBooks } from "@/lib/firebase/books";
import type { Book } from "@/lib/types";

const PAGE_SIZE = 30;
type Cursor = Awaited<ReturnType<typeof listBooks>>["cursor"];

export function LibraryView() {
  const { user } = useAuth();
  const [state, setState] = useState<{ books: Book[]; cursor: Cursor } | null>(null);
  const [error, setError] = useState(false);
  const [more, setMore] = useState(false);

  useEffect(() => {
    let alive = true;
    listBooks(PAGE_SIZE).then(
      (p) => alive && setState(p),
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, []);

  const loadMore = async () => {
    if (!state?.cursor) return;
    setMore(true);
    try {
      const p = await listBooks(PAGE_SIZE, state.cursor);
      setState((x) => x && { books: [...x.books, ...p.books], cursor: p.cursor });
    } catch {
      setError(true);
    } finally {
      setMore(false);
    }
  };

  return (
    <>
      <Header logoHref="/app" />
      <main className={`${s.main} ${s.withNav}`}>
        <div className={s.stack}>
          <h1 className={s.h2}>図書館</h1>
          <p className={s.muted}>村人の苦労や夢と、それを支えた本の物語です。</p>
        </div>
        <Link href="/app/library/new" className={s.btn}>
          本の物語を残す
        </Link>
        {error ? (
          <LoadError what="図書館" />
        ) : !state ? (
          <Loading />
        ) : state.books.length ? (
          <div className={s.stack}>
            {state.books.map((b) => (
              <Link key={b.id} href={`/app/library/${b.id}`} className={s.card}>
                <span className={s.cardLabel}>
                  『{b.title}』{b.bookAuthor && `　${b.bookAuthor}`}
                </span>
                <span className={s.cardTitle}>{b.heading}</span>
                {b.struggle && <p className={`${s.small} ${s.muted}`}>{b.struggle.length > 80 ? `${b.struggle.slice(0, 80)}…` : b.struggle}</p>}
                <span className={s.meta}>{b.authorUid === user?.uid ? "あなたの本棚" : `${b.authorNickname}さんの本棚`}</span>
              </Link>
            ))}
            {state.cursor && (
              <button type="button" className={s.btnGhost} onClick={loadMore} disabled={more}>
                {more ? "読み込んでいます…" : "もっと見る"}
              </button>
            )}
          </div>
        ) : (
          <p className={s.muted}>本棚にはまだ物語がありません。</p>
        )}
        <p className={s.note}>図書館は、吃音の治し方を教え合う場所ではありません。苦労や夢と、本との体験を分かち合う場所です。</p>
      </main>
    </>
  );
}
