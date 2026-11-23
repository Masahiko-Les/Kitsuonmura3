import type { Metadata } from "next";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = { title: "パスワードの再設定", robots: { index: false } };

export default function ResetPassword() {
  return (
    <>
      <Header kind="back" href="/login" title="パスワードの再設定" />
      <main className={s.main}>
        <p className={s.lead}>登録したメールアドレスに、パスワードを設定し直すためのメールを送ります。</p>
        <ResetForm />
      </main>
    </>
  );
}
