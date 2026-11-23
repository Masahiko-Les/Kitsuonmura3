"use client";

// 本の物語を残す（PRODUCT_SPEC.md §7）。見出しと書名以外は任意
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Header } from "@/components/Header";
import { useToast } from "@/components/Toast";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { LIMITS } from "@/lib/constants";
import { createBook } from "@/lib/firebase/books";
import { BOOK_QUESTIONS, type BookInput } from "@/lib/types";

export function NewBook() {
  const router = useRouter();
  const toast = useToast();
  const { profile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const input: BookInput = {
      heading: get("heading"),
      title: get("title"),
      bookAuthor: get("bookAuthor"),
      struggle: get("struggle"),
      words: get("words"),
      change: get("change"),
    };
    if (!input.heading || !input.title) {
      setError("タイトルと本の書名を入力してください。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const ref = await createBook(input, profile);
      toast("本棚に置きました");
      router.replace(`/app/library/${ref.id}`);
    } catch {
      setError("置けませんでした。時間をおいて、もう一度お試しください。");
      setBusy(false);
    }
  };

  return (
    <>
      <Header kind="back" href="/app/library" title="本の物語を残す" />
      <main className={`${s.main} ${s.withNav}`}>
        <p className={`${s.small} ${s.muted}`}>悩みだけでなく、夢や挑戦を支えてくれた本も歓迎します。書ける項目だけでかまいません。</p>
        <form onSubmit={onSubmit}>
          <div className={s.field}>
            <label htmlFor="b-heading">タイトル</label>
            <input id="b-heading" name="heading" required maxLength={LIMITS.bookHeading} placeholder="例：自分のことばかり考えていた頃" />
          </div>
          <div className={s.field}>
            <label htmlFor="b-title">本の書名</label>
            <input id="b-title" name="title" required maxLength={LIMITS.bookTitle} />
          </div>
          <div className={s.field}>
            <label htmlFor="b-author">著者</label>
            <input id="b-author" name="bookAuthor" maxLength={LIMITS.bookAuthor} />
            <span className={s.hint}>任意</span>
          </div>
          {BOOK_QUESTIONS.map((q) => (
            <div className={s.field} key={q.key}>
              <label htmlFor={`b-${q.key}`}>{q.heading}</label>
              <textarea id={`b-${q.key}`} name={q.key} maxLength={LIMITS.bookAnswer} />
              {q.hint && <span className={s.hint}>{q.hint}</span>}
            </div>
          ))}
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
          <button className={s.btn} disabled={busy || !profile}>
            {busy ? "置いています…" : "本棚に置く"}
          </button>
        </form>
      </main>
    </>
  );
}
