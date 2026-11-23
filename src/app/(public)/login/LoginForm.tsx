"use client";

// ログイン。ログインしたら ?next= のページ（なければ村のホーム）へ
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage } from "@/lib/auth/errors";
import { firebaseAuth } from "@/lib/firebase/client";
import { useHydrated } from "@/lib/useHydrated";

/** ログイン後の移動先。外部サイトへの移動を防ぐため、村の中のパスだけを許す */
function safeNext(next: string | null) {
  return next && next.startsWith("/app") ? next : "/app";
}

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { loading, user, isResident } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const hydrated = useHydrated();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(isResident ? next : "/verify-email");
  }, [loading, user, isResident, next, router]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth(), String(fd.get("email") ?? "").trim(), String(fd.get("password") ?? ""));
      // 移動は上の useEffect がログイン状態の変化を受けて行う
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form method="post" onSubmit={onSubmit}>
      <div className={s.field}>
        <label htmlFor="l-mail">メールアドレス</label>
        <input id="l-mail" name="email" type="email" autoComplete="email" required />
      </div>
      <div className={s.field}>
        <label htmlFor="l-pass">パスワード</label>
        <input id="l-pass" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      <button className={s.btn} disabled={busy || !hydrated}>
        {busy ? "ログインしています…" : "ログイン"}
      </button>
      <Link href="/reset-password" className={s.textLink}>
        パスワードを忘れた方
      </Link>
      <Link href="/welcome" className={s.textLink}>
        はじめての方はこちら
      </Link>
    </form>
  );
}
