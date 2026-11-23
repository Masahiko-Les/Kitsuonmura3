// 図書館：苦労 × 本 × 変化の物語
import Link from "next/link";
import { Header } from "../../_components/Header";
import { BOOKS, findResident } from "../../_data/demo";
import s from "../../ver2.module.css";

export const metadata = { title: "図書館" };

export default function Library() {
  return (
    <>
      <Header />
      <main className={`${s.main} ${s.withNav}`}>
        <div className={s.stack}>
          <h1 className={s.h2}>図書館</h1>
          <p className={s.muted}>村人の苦労や夢と、それを支えた本の物語です。</p>
        </div>
        <Link href="/ver2/app/library/new" className={s.btn}>
          本の物語を残す
        </Link>
        <div className={s.stack}>
          {BOOKS.map((b) => (
            <Link key={b.id} href={`/ver2/app/library/${b.id}`} className={s.card}>
              <span className={s.cardLabel}>
                『{b.book_title}』{b.book_author && `　${b.book_author}`}
              </span>
              <span className={s.cardTitle}>{b.heading}</span>
              <p className={`${s.small} ${s.muted}`}>{b.struggle_or_dream}</p>
              <span className={s.meta}>{findResident(b.author_id)?.nickname}さんの本棚</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
