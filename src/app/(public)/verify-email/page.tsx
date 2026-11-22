import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";
import { VerifyEmail } from "./VerifyEmail";

export const metadata: Metadata = { title: "メールアドレスの確認", robots: { index: false } };

// メール確認を必須にしているとき（NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION=true）に使う画面
export default function VerifyEmailPage() {
  return (
    <>
      <TopBar title="メールアドレスの確認" />
      <div className="pad">
        <VerifyEmail />
      </div>
    </>
  );
}
