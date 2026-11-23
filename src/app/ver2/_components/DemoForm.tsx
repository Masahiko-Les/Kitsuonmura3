"use client";

// デモ用のフォーム。送信しても何も保存せず、そのことを画面で伝えてから次の画面へ進む。
// 「登録できた」「投稿できた」と偽らないため（CLAUDE.md の原則8）。
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import s from "../ver2.module.css";

type Props = {
  children: ReactNode;
  submitLabel: string;
  /** 送信後に進む先。省略するとその場にとどまる */
  next?: string;
  nextLabel?: string;
};

export function DemoForm({ children, submitLabel, next, nextLabel = "次へ進む" }: Props) {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <form method="post" onSubmit={onSubmit}>
      {children}
      {sent ? (
        <>
          <p className={s.note} role="status">
            これはデモです。入力内容は保存も送信もされていません。
          </p>
          {next && (
            <button type="button" className={s.btn} onClick={() => router.push(next)}>
              {nextLabel}
            </button>
          )}
        </>
      ) : (
        <button className={s.btn}>{submitLabel}</button>
      )}
    </form>
  );
}
