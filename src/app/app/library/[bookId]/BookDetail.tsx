"use client";

// 図書館の一冊の物語
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ReactionButton } from "@/components/ReactionButton";
import { ReportButton } from "@/components/ReportButton";
import { LoadError, Loading } from "@/components/Status";
import s from "@/components/ui.module.css";
import { Who } from "@/components/Who";
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
      // 運営が非表示にした物語は、書き手と運営以外には読めない（ルールで拒否される）
      (e) => alive && setState(e?.code === "permission-denied" ? { id: bookId, book: null, reacted: undefined } : { id: bookId, error: true }),
    );
    return () => {
      alive = false;
    };
  }, [bookId, me]);

  const cur = state?.id === bookId ? state : null;
  return (
    <>
      <Header kind="back" href="/app/library" title="図書館" />
      <main className={`${s.main} ${s.withNav}`}>
        {!cur ? (
          <Loading />
        ) : "error" in cur ? (
          <LoadError what="本の物語" />
        ) : !cur.book ? (
          <p className={s.muted}>この物語は見つかりませんでした。書き手が削除したか、表示できない状態になっています。</p>
        ) : (
          <>
            <div className={s.stack}>
              {cur.book.hidden && <p className={s.hiddenNote}>運営が非表示にしています。ほかの住民には見えません。</p>}
              <h1 className={s.h1}>{cur.book.heading}</h1>
              <Who
                uid={cur.book.authorUid}
                nickname={cur.book.authorNickname}
                ageGroup={cur.book.authorAgeGroup}
                note={formatDate(cur.book.createdAt)}
                isMe={cur.book.authorUid === me}
              />
            </div>
            <article className={s.card} style={{ gap: 18 }}>
              <div>
                <span className={s.cardLabel}>出会った本</span>
                <p className={s.prose}>
                  『{cur.book.title}』{cur.book.bookAuthor && `　${cur.book.bookAuthor}`}
                </p>
              </div>
              {BOOK_QUESTIONS.filter((q) => cur.book![q.key]).map((q) => (
                <div key={q.key}>
                  <span className={s.cardLabel}>{q.heading}</span>
                  <p className={s.prose}>{cur.book![q.key]}</p>
                </div>
              ))}
              <div className={s.row}>
                <ReactionButton key={cur.book.id} target={{ type: "book", id: cur.book.id }} mine={cur.book.authorUid === me} reacted={cur.reacted} />
                <ReportButton type="book" id={cur.book.id} mine={cur.book.authorUid === me} />
              </div>
            </article>
          </>
        )}
      </main>
    </>
  );
}
