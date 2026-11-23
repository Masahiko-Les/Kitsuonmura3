// 今月のテーマで語る（デモ）
import { DemoForm } from "../../../_components/DemoForm";
import { Header } from "../../../_components/Header";
import { CURRENT_TOPIC } from "../../../_data/demo";
import s from "../../../ver2.module.css";

export const metadata = { title: "語る" };

export default function Compose() {
  return (
    <>
      <Header kind="back" href="/ver2/app/meeting" title="語る" />
      <main className={`${s.main} ${s.withNav}`}>
        <div>
          <span className={s.cardLabel}>{CURRENT_TOPIC.month_label}の集会</span>
          <p className={s.cardTitle}>{CURRENT_TOPIC.title}</p>
        </div>
        <DemoForm submitLabel="集会に置く" next="/ver2/app/meeting" nextLabel="集会に戻る">
          <div className={s.field}>
            <label htmlFor="v2-post">あなたの語り</label>
            <textarea id="v2-post" required maxLength={5000} style={{ minHeight: 260 }} placeholder="短くても、まとまっていなくても大丈夫です。" />
          </div>
        </DemoForm>
      </main>
    </>
  );
}
