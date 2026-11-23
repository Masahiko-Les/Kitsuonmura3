// ログイン（デモ）
import Link from "next/link";
import { DemoForm } from "../_components/DemoForm";
import { Header } from "../_components/Header";
import s from "../ver2.module.css";

export const metadata = { title: "ログイン" };

export default function Login() {
  return (
    <>
      <Header kind="back" href="/ver2" title="ログイン" />
      <main className={s.main}>
        <DemoForm submitLabel="ログイン" next="/ver2/app" nextLabel="デモの村に入る">
          <div className={s.field}>
            <label htmlFor="v2-lmail">メールアドレス</label>
            <input id="v2-lmail" type="email" autoComplete="email" required />
          </div>
          <div className={s.field}>
            <label htmlFor="v2-lpass">パスワード</label>
            <input id="v2-lpass" type="password" autoComplete="current-password" required />
          </div>
        </DemoForm>
        <p className={`${s.small} ${s.muted}`} style={{ textAlign: "center" }}>
          パスワードの再設定は、本番で用意します（デモでは使えません）。
        </p>
        <Link href="/ver2/app" className={s.textLink}>
          ログインせずにデモの村を見る
        </Link>
      </main>
    </>
  );
}
