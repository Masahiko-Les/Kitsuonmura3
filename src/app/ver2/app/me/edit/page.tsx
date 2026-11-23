// 住民票・吃音史を書く（デモ）。ニックネーム以外は任意
import { DemoForm } from "../../../_components/DemoForm";
import { Header } from "../../../_components/Header";
import s from "../../../ver2.module.css";

export const metadata = { title: "住民票を書く" };

const SHORT = [
  ["age", "年代"],
  ["region", "居住地域"],
  ["job", "職業や普段の生活"],
  ["onset", "吃音の始まった時期"],
  ["sounds", "苦手な音・単語・場面"],
  ["hobby", "趣味・好きなこと"],
  ["hope", "やりたいこと"],
] as const;

export default function EditMe() {
  return (
    <>
      <Header kind="back" href="/ver2/app/me" title="住民票を書く" />
      <main className={`${s.main} ${s.withNav}`}>
        <p className={s.note}>ニックネーム以外はすべて任意です。書きたいところだけ、書きたいときに。</p>
        <DemoForm submitLabel="保存する" next="/ver2/app/me" nextLabel="自分のページに戻る">
          <div className={s.field}>
            <label htmlFor="v2-e-nick">ニックネーム</label>
            <input id="v2-e-nick" required maxLength={20} defaultValue="あなた" />
          </div>
          {SHORT.map(([id, label]) => (
            <div key={id} className={s.field}>
              <label htmlFor={`v2-e-${id}`}>{label}</label>
              <input id={`v2-e-${id}`} maxLength={200} />
            </div>
          ))}
          <div className={s.field}>
            <label htmlFor="v2-e-struggle">抱えている苦労と、自分なりの工夫</label>
            <textarea id="v2-e-struggle" maxLength={2000} />
          </div>
          <div className={s.field}>
            <label htmlFor="v2-e-history">吃音史</label>
            <textarea id="v2-e-history" maxLength={10000} style={{ minHeight: 260 }} />
            <span className={s.hint}>あなたの人生と吃音について、10,000字まで。空欄のままでもかまいません。</span>
          </div>
        </DemoForm>
      </main>
    </>
  );
}
