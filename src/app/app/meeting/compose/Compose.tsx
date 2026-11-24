"use client";

// 今月のテーマで語る
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Status";
import { useToast } from "@/components/Toast";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { LIMITS } from "@/lib/constants";
import { createMeetingPost, getCurrentThemeId, getTheme } from "@/lib/firebase/meeting";
import { formatThemeMonth } from "@/lib/format";
import type { Theme } from "@/lib/types";

export function Compose() {
  const router = useRouter();
  const toast = useToast();
  const { profile } = useAuth();
  const [theme, setTheme] = useState<Theme | null | undefined>(undefined);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    getCurrentThemeId()
      .then((id) => (id ? getTheme(id) : null))
      .then(
        (t) => alive && setTheme(t),
        () => alive && setError("今月のテーマを読み込めませんでした。"),
      );
    return () => {
      alive = false;
    };
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = text.replace(/^\s*\n|\s+$/g, "");
    if (!body.trim() || !theme || !profile) return;
    setBusy(true);
    setError("");
    try {
      await createMeetingPost(theme.id, body, profile);
      setText("");
      toast("集会に語りを置きました");
      router.replace("/app/meeting");
    } catch {
      setError("置けませんでした。今月のテーマが変わった可能性があります。集会のページを開き直してお試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header kind="back" href="/app/meeting" title="語る" />
      <main className={`${s.main} ${s.withNav}`}>
        {theme === undefined && !error ? (
          <Loading />
        ) : theme === null ? (
          <p className={s.muted}>今月の集会のテーマは、まだ用意されていません。</p>
        ) : (
          <>
            {theme && (
              <div>
                <span className={s.cardLabel}>{formatThemeMonth(theme.month)}の集会のテーマ</span>
                <p className={s.cardTitle}>{theme.title}</p>
              </div>
            )}
            <form onSubmit={onSubmit}>
              <div className={s.field}>
                <label htmlFor="c-text">あなたの語り</label>
                <textarea
                  id="c-text"
                  required
                  maxLength={LIMITS.meetingPost}
                  style={{ minHeight: 280 }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="短くても、まとまっていなくても大丈夫です。"
                />
                <div className={s.counter} aria-live="polite">
                  {text.length} / {LIMITS.meetingPost}
                </div>
              </div>
              <p className={s.note}>この語りは集会が終わったあとも残り、あとから来た住民も読めます。自分でいつでも書き直したり、消したりできます。</p>
              {error && (
                <p className={s.error} role="alert">
                  {error}
                </p>
              )}
              <button className={s.btn} disabled={busy || !theme || !profile || !text.trim()}>
                {busy ? "置いています…" : "集会に置く"}
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}
