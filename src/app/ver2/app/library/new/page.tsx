// 本の物語を残す（デモ）。項目は PRODUCT_SPEC.md §7
import { DemoForm } from "../../../_components/DemoForm";
import { Header } from "../../../_components/Header";
import s from "../../../ver2.module.css";

export const metadata = { title: "本の物語を残す" };

const FIELDS: { id: string; label: string; long?: boolean; required?: boolean; hint?: string }[] = [
  { id: "heading", label: "タイトル", required: true },
  { id: "struggle", label: "悩み・苦労、または夢", long: true },
  { id: "book", label: "本のタイトル", required: true },
  { id: "author", label: "著者", hint: "任意" },
  { id: "words", label: "支えられた考え方", long: true },
  { id: "change", label: "自分の考えや変化", long: true, hint: "変わらなかった経験も、大切な物語です。" },
];

export default function NewBook() {
  return (
    <>
      <Header kind="back" href="/ver2/app/library" title="本の物語を残す" />
      <main className={`${s.main} ${s.withNav}`}>
        <DemoForm submitLabel="本棚に置く" next="/ver2/app/library" nextLabel="図書館に戻る">
          {FIELDS.map((f) => (
            <div key={f.id} className={s.field}>
              <label htmlFor={`v2-b-${f.id}`}>{f.label}</label>
              {f.long ? <textarea id={`v2-b-${f.id}`} maxLength={2000} /> : <input id={`v2-b-${f.id}`} required={f.required} maxLength={60} />}
              {f.hint && <span className={s.hint}>{f.hint}</span>}
            </div>
          ))}
        </DemoForm>
      </main>
    </>
  );
}
