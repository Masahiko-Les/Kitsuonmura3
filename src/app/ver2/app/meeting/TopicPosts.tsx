// テーマの語りの一覧（返信なし、共感ボタンのみ）
import { Reaction } from "../../_components/Reaction";
import { Who } from "../../_components/Who";
import { findResident, postsOf } from "../../_data/demo";
import s from "../../ver2.module.css";

export function TopicPosts({ topicId }: { topicId: string }) {
  const posts = postsOf(topicId);
  if (!posts.length) return <p className={s.muted}>まだ語りはありません。</p>;
  return (
    <div className={s.stack}>
      {posts.map((p) => {
        const a = findResident(p.author_id);
        return (
          <article key={p.id} className={s.card}>
            {a && <Who resident={a} />}
            <p className={s.prose}>{p.body}</p>
            <Reaction />
          </article>
        );
      })}
    </div>
  );
}
