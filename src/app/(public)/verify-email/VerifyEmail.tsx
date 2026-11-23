"use client";

// 確認メールのリンクを開いたら村に入れる。戻ってきたときに自動で確かめる
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage } from "@/lib/auth/errors";

export function VerifyEmail() {
  const router = useRouter();
  const { loading, user, isResident, refresh, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (isResident) router.replace("/onboarding");
  }, [loading, user, isResident, router]);

  const check = useCallback(async () => {
    setBusy(true);
    try {
      await refresh();
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refresh]);

  const resend = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await sendEmailVerification(user, { url: `${window.location.origin}/onboarding` });
      setMessage("確認メールをもう一度送りました。");
    } catch (e) {
      setMessage(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (!user) return null;
  return (
    <>
      <h1 className={s.h2}>確認メールを送りました</h1>
      <p>{user.email} 宛てのメールにあるリンクを開くと、村に入れます。</p>
      <p className={s.hint}>見つからないときは、迷惑メールのフォルダも確認してください。</p>
      {message && (
        <p className={s.small} role="status">
          {message}
        </p>
      )}
      <button type="button" className={s.btn} onClick={check} disabled={busy}>
        確認しました
      </button>
      <button type="button" className={s.btnGhost} onClick={resend} disabled={busy}>
        確認メールをもう一度送る
      </button>
      <button type="button" className={s.textLink} style={{ background: "none", border: 0, font: "inherit" }} onClick={() => void logout()}>
        ログアウト
      </button>
    </>
  );
}
