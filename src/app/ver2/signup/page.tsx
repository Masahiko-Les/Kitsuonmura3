// 住民登録（デモ）。メール・パスワード・ニックネーム、注意事項への同意
import Link from "next/link";
import { DemoForm } from "../_components/DemoForm";
import { Header } from "../_components/Header";
import s from "../ver2.module.css";

export const metadata = { title: "住民登録" };

export default function Signup() {
  return (
    <>
      <Header kind="back" href="/ver2" title="住民登録" />
      <main className={s.main}>
        <p className={s.lead}>登録に必要なのは、メールアドレス・パスワード・ニックネームだけです。実名は要りません。</p>
        <DemoForm submitLabel="住民登録する" next="/ver2/onboarding" nextLabel="デモの続きを見る">
          <div className={s.field}>
            <label htmlFor="v2-mail">メールアドレス</label>
            <input id="v2-mail" type="email" autoComplete="email" required />
          </div>
          <div className={s.field}>
            <label htmlFor="v2-pass">パスワード</label>
            <input id="v2-pass" type="password" autoComplete="new-password" minLength={8} required />
            <span className={s.hint}>8文字以上</span>
          </div>
          <div className={s.field}>
            <label htmlFor="v2-nick">ニックネーム</label>
            <input id="v2-nick" maxLength={20} required />
            <span className={s.hint}>住民票や語りに表示されます。あとから変えられます。</span>
          </div>
          <div className={s.note}>
            <ul className={s.list}>
              <li>村は登録した住民だけが読めますが、画面の撮影などによる外への流出を完全には防げません。</li>
              <li>吃音の治療や改善を約束する場所ではありません。</li>
            </ul>
          </div>
          <label className={s.check}>
            <input type="checkbox" required />
            <span>
              <Link href="/ver2/about" className={s.headerLink} style={{ padding: 0 }}>
                村の約束
              </Link>
              を読み、同意します
            </span>
          </label>
        </DemoForm>
      </main>
    </>
  );
}
