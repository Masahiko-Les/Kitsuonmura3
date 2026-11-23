"use client";

// 本棚の一冊の詳細（試作品の V.book）
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { BookCover } from "@/components/BookCover";
import { ReactionButton } from "@/components/ReactionButton";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getBook } from "@/lib/firebase/books";
import { myReactions } from "@/lib/firebase/reactions";
import { formatDate } from "@/lib/format";
import { BOOK_QUESTIONS, type Book } from "@/lib/types";

type State = { id: string; book: Book | null; reacted: boolean | undefined } | { id: string; error: true };

export function BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const { user } = useAuth();
  const me = user?.uid ?? "";
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    let alive = true;
    getBook(bookId).then(
      async (book) => {
        if (!alive) return;
        setState({ id: bookId, book, reacted: undefined });
        if (!book || book.authorUid === me) return;
        const set = await myReactions("book", [bookId], me).catch(() => new Set<string>());
        if (alive) setState({ id: bookId, book, reacted: set.has(bookId) });
      },
      () => alive && setState({ id: bookId, error: true }),
    );
    return () => {
      alive = false;
    };
  }, [bookId, me]);

  const s = state?.id === bookId ? state : null;
  const b = s && !("error" in s) ? s.book : null;

  return (
    <>
      <TopBar title="図書館" back fallbackHref="/library" />
      <div className="pad">
        {!s ? (
          <p className="muted small" role="status">
            読み込んでいます…
          </p>
        ) : "error" in s ? (
          <p className="error">本を読み込めませんでした。時間をおいて、もう一度お試しください。</p>
        ) : !b ? (
          <p className="muted">この本は見つかりませんでした。書き手が削除した可能性があります。</p>
        ) : (
          <>
            <div className="book-row">
              <BookCover title={b.title} large />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <h2 className="display" style={{ fontSize: 21 }}>
                  『{b.title}』
                </h2>
                {b.bookAuthor && <span className="muted">{b.bookAuthor}</span>}
                <span className="chip brown" style={{ alignSelf: "flex-start" }}>
                  {b.tag}
                </span>
              </div>
            </div>
            <Link href={`/residents/${b.authorUid}`} className="who">
              <Avatar uid={b.authorUid} nickname={b.authorNickname} />
              <div>
                <div className="name">{b.authorUid === me ? "あなたの一冊" : `${b.authorNickname}さんの一冊`}</div>
                <div className="meta">
                  <span>{b.authorAgeGroup}</span>
                  <span>{formatDate(b.createdAt)}</span>
                </div>
              </div>
            </Link>
            <article className="card" style={{ padding: 20, gap: 18 }}>
              {BOOK_QUESTIONS.filter((q) => b[q.key]).map((q) => (
                <div key={q.key}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>
                    {q.heading}
                  </div>
                  <p className="prose">{b[q.key]}</p>
                </div>
              ))}
              <ReactionButton
                key={b.id}
                target={{ type: "book", id: b.id }}
                count={b.reactionCount}
                mine={b.authorUid === me}
                reacted={s.reacted}
              />
            </article>
          </>
        )}
      </div>
    </>
  );
}
