// 図書館の一冊の物語
import { notFound } from "next/navigation";
import { Header } from "../../../_components/Header";
import { Reaction } from "../../../_components/Reaction";
import { Who } from "../../../_components/Who";
import { BOOKS, findBook, findResident } from "../../../_data/demo";
import s from "../../../ver2.module.css";

export function generateStaticParams() {
  return BOOKS.map((b) => ({ id: b.id }));
}

export default async function BookPage({ params }: PageProps<"/ver2/app/library/[id]">) {
  const { id } = await params;
  const b = findBook(id);
  if (!b) notFound();
  const a = findResident(b.author_id);
  return (
    <>
      <Header kind="back" href="/ver2/app/library" title="図書館" />
      <main className={`${s.main} ${s.withNav}`}>
        <div className={s.stack}>
          <h1 className={s.h1}>{b.heading}</h1>
          {a && <Who resident={a} />}
        </div>
        <article className={s.card} style={{ gap: 18 }}>
          <div>
            <span className={s.cardLabel}>抱えていた苦労・夢</span>
            <p className={s.prose}>{b.struggle_or_dream}</p>
          </div>
          <div>
            <span className={s.cardLabel}>出会った本</span>
            <p className={s.prose}>
              『{b.book_title}』{b.book_author && `　${b.book_author}`}
            </p>
          </div>
          <div>
            <span className={s.cardLabel}>読んで感じたこと、変わったこと</span>
            <p className={s.prose}>{b.reading_experience}</p>
          </div>
          <Reaction />
        </article>
      </main>
    </>
  );
}
