// 集会：今月のテーマ、語り、これまでの集会
import Link from "next/link";
import { Header } from "../../_components/Header";
import { CURRENT_TOPIC, TOPICS } from "../../_data/demo";
import s from "../../ver2.module.css";
import { TopicPosts } from "./TopicPosts";

export const metadata = { title: "集会" };

export default function Meeting() {
  const t = CURRENT_TOPIC;
  return (
    <>
      <Header />
      <main className={`${s.main} ${s.withNav}`}>
        <div className={s.cardMuted}>
          <span className={s.cardLabel}>{t.month_label}の集会</span>
          <h1 className={s.cardTitle} style={{ margin: 0 }}>
            {t.title}
          </h1>
          <p className={s.small}>{t.description}</p>
        </div>
        <Link href="/ver2/app/meeting/compose" className={s.btn}>
          このテーマで語る
        </Link>
        <p className={s.note}>語りっぱなし、聴きっぱなしの場です。返信やアドバイスはつきません。</p>
        <section className={s.section}>
          <h2 className={s.h2}>住民の語り</h2>
          <TopicPosts topicId={t.id} />
        </section>
        <section className={s.section}>
          <h2 className={s.h2}>これまでの集会</h2>
          {TOPICS.filter((x) => x.id !== t.id).map((x) => (
            <Link key={x.id} href={`/ver2/app/meeting/${x.id}`} className={s.card}>
              <span className={s.cardLabel}>{x.month_label}</span>
              <span className={s.cardTitle}>{x.title}</span>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
