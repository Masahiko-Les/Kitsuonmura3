import type { Metadata } from "next";
import { Suspense } from "react";
import { TopBar } from "@/components/TopBar";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "ログイン", robots: { index: false } };

export default function LoginPage() {
  return (
    <>
      <TopBar title="住民の方はこちら" back />
      <div className="pad">
        <p>おかえりなさい。メールアドレスとパスワードで村に入れます。</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
