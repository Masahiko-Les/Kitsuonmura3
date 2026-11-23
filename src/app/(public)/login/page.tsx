import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "ログイン", robots: { index: false } };

export default function Login() {
  return (
    <>
      <Header kind="back" href="/" title="ログイン" />
      <main className={s.main}>
        {/* ログイン後の移動先（?next=）を読むため Suspense で包む */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
