// 図書館の一覧に並ぶ一冊
import Link from "next/link";
import type { Book } from "@/lib/types";
import { BookCover } from "./BookCover";
import { LeafIcon } from "./icons";

/** 一覧に出す一文。支えになった言葉がなければ、ほかの問いの答えを使う */
export function bookExcerpt(b: Book) {
  return b.words || b.struggle || b.thought || b.change || b.encounter;
}

export function BookCard({ book: b, mine }: { book: Book; mine: boolean }) {
  const excerpt = bookExcerpt(b);
  return (
    <Link href={`/library/${b.id}`} className="card">
      <div className="book-row">
        <BookCover title={b.title} />
        <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
          <b>『{b.title}』</b>
          {b.bookAuthor && <span className="small muted">{b.bookAuthor}</span>}
          {excerpt && <span className="small clamp">{excerpt}</span>}
          <div className="meta">
            <span>{mine ? "あなたの一冊" : `${b.authorNickname}さんの一冊`}</span>
            <span className="chip brown">{b.tag}</span>
            <span aria-label={`届いた人 ${b.reactionCount}`}>
              <LeafIcon width={14} height={14} style={{ verticalAlign: -2 }} /> {b.reactionCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
