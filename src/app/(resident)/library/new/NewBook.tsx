"use client";

// 本棚に一冊置く（試作品の V.bookCompose）
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { BOOK_TAGS, LIMITS, type BookTag } from "@/lib/constants";
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
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const input: BookInput = {
      title: get("title"),
      bookAuthor: get("bookAuthor"),
      tag: get("tag") as BookTag,
      struggle: get("struggle"),
      encounter: get("encounter"),
      words: get("words"),
      thought: get("thought"),
      change: get("change"),
    };
    if (!input.title) {
      setError("書名を入力してください。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const ref = await createBook(input, profile);
      form.reset();
      toast("本棚に一冊置きました");
      router.replace(`/library/${ref.id}`);
    } catch {
      setError("置けませんでした。時間をおいて、もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TopBar title="本棚に一冊置く" back fallbackHref="/library" />
      <div className="pad">
        <p className="muted small">悩みだけでなく、夢や挑戦を支えてくれた本も歓迎します。書ける項目だけで構いません。</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="b-title">書名</label>
            <input id="b-title" name="title" required maxLength={LIMITS.bookTitle} />
          </div>
          <div className="field">
            <label htmlFor="b-author">著者</label>
            <input id="b-author" name="bookAuthor" maxLength={LIMITS.bookAuthor} />
          </div>
          <div className="field">
            <label htmlFor="b-tag">テーマ</label>
            <select id="b-tag" name="tag">
              {BOOK_TAGS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          {BOOK_QUESTIONS.map((q) => (
            <div className="field" key={q.key}>
              <label htmlFor={`b-${q.key}`}>{q.question}</label>
              <textarea id={`b-${q.key}`} name={q.key} maxLength={LIMITS.bookAnswer} />
              {q.hint && <span className="hint">{q.hint}</span>}
            </div>
          ))}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="btn block" disabled={busy || !profile}>
            {busy ? "置いています…" : "本棚に置く"}
          </button>
        </form>
      </div>
    </>
  );
}
