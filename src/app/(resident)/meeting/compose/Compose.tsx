"use client";

// 今月のテーマで語る（試作品の V.compose）
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/TopBar";
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
      router.replace("/meeting");
    } catch {
      setError("置けませんでした。今月のテーマが変わった可能性があります。集会のページを開き直してお試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TopBar title="語る" back fallbackHref="/meeting" />
      <div className="pad">
        {theme === undefined && !error ? (
          <p className="muted small" role="status">
            読み込んでいます…
          </p>
        ) : theme === null ? (
          <p className="muted">今月の集会のテーマは、まだ用意されていません。</p>
        ) : (
          <>
            {theme && (
              <div>
                <span className="eyebrow">{formatThemeMonth(theme.month)}の集会</span>
                <h2 className="display" style={{ fontSize: 19, marginTop: 4 }}>
                  {theme.title}
                </h2>
              </div>
            )}
            <form onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="c-text">あなたの語り</label>
                <textarea
                  id="c-text"
                  className="tall"
                  required
                  maxLength={LIMITS.meetingPost}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="うまくまとめなくて大丈夫です。思ったことを、思ったままに。"
                />
                <div className="counter" aria-live="polite">
                  {text.length} / {LIMITS.meetingPost}
                </div>
              </div>
              <p className="note">
                この語りは集会が終わったあともアーカイブに残り、あとから来た住民も読めます。いつでも自分で削除できます。
              </p>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="btn block" disabled={busy || !theme || !profile || !text.trim()}>
                {busy ? "置いています…" : "集会に置く"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
