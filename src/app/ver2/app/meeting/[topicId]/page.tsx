// 過去の集会（読むだけ。新しく語れるのは今月のテーマのみ）
import { notFound } from "next/navigation";
import { Header } from "../../../_components/Header";
import { CURRENT_TOPIC, TOPICS, findTopic } from "../../../_data/demo";
import s from "../../../ver2.module.css";
import { TopicPosts } from "../TopicPosts";

export function generateStaticParams() {
  return TOPICS.filter((t) => t.id !== CURRENT_TOPIC.id).map((t) => ({ topicId: t.id }));
}

export default async function PastTopic({ params }: PageProps<"/ver2/app/meeting/[topicId]">) {
  const { topicId } = await params;
  const t = findTopic(topicId);
  if (!t) notFound();
  return (
    <>
      <Header kind="back" href="/ver2/app/meeting" title="過去の集会" />
      <main className={`${s.main} ${s.withNav}`}>
        <div className={s.cardMuted}>
          <span className={s.cardLabel}>{t.month_label}の集会</span>
          <h1 className={s.cardTitle} style={{ margin: 0 }}>
            {t.title}
          </h1>
          <p className={s.small}>{t.description}</p>
        </div>
        <TopicPosts topicId={t.id} />
      </main>
    </>
  );
}
