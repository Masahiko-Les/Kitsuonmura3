import type { Metadata } from "next";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { VerifyEmail } from "./VerifyEmail";

export const metadata: Metadata = { title: "メールアドレスの確認", robots: { index: false } };

// メール確認を必須にしたとき（NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION=true）に使う画面
export default function Page() {
  return (
    <>
      <Header />
      <main className={s.main}>
        <VerifyEmail />
      </main>
    </>
  );
}
