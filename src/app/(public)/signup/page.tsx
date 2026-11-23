import type { Metadata } from "next";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "住民登録", robots: { index: false } };

export default function Signup() {
  return (
    <>
      <Header kind="back" href="/" title="住民登録" />
      <main className={s.main}>
        <p className={s.lead}>登録に必要なのは、メールアドレス・パスワード・ニックネームだけです。実名は要りません。</p>
        <SignupForm />
      </main>
    </>
  );
}
