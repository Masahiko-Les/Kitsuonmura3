"use client";

// パスワード再設定のメールを送る。登録の有無が他人に分からないよう、結果は同じ文で伝える
import { sendPasswordResetEmail } from "firebase/auth";
import { useState, type FormEvent } from "react";
import s from "@/components/ui.module.css";
import { firebaseAuth } from "@/lib/firebase/client";
import { useHydrated } from "@/lib/useHydrated";

export function ResetForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const hydrated = useHydrated();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    setBusy(true);
    setError("");
    try {
      await sendPasswordResetEmail(firebaseAuth(), email, { url: `${window.location.origin}/login` });
      setSent(true);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found") setSent(true);
      else if (code === "auth/invalid-email") setError("メールアドレスの形式を確かめてください。");
      else setError("送れませんでした。時間をおいて、もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <p className={s.note} role="status">
        入力したメールアドレスが登録されていれば、再設定のためのメールを送りました。届かないときは、迷惑メールのフォルダも確認してください。
      </p>
    );
  }
  return (
    <form method="post" onSubmit={onSubmit}>
      <div className={s.field}>
        <label htmlFor="rp-mail">メールアドレス</label>
        <input id="rp-mail" name="email" type="email" autoComplete="email" required />
      </div>
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      <button className={s.btn} disabled={busy || !hydrated}>
        {busy ? "送っています…" : "再設定のメールを送る"}
      </button>
    </form>
  );
}
