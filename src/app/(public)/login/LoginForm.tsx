"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage } from "@/lib/auth/errors";
import { firebaseAuth } from "@/lib/firebase/client";

/** ログイン後の移動先。外部サイトへの移動を防ぐため、サイト内のパスだけを許す */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/home";
}

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { loading, user, isResident } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="l-mail">メールアドレス</label>
        <input id="l-mail" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="l-pass">パスワード</label>
        <input id="l-pass" name="password" type="password" required autoComplete="current-password" />
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="btn block" disabled={busy}>
        {busy ? "確認しています…" : "村に入る"}
      </button>
      <p className="small muted" style={{ textAlign: "center" }}>
        はじめての方は <Link href="/welcome" style={{ color: "var(--green)", fontWeight: 700 }}>こちら</Link>
      </p>
    </form>
  );
}
