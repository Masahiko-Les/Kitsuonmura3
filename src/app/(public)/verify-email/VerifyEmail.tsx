"use client";

import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage } from "@/lib/auth/errors";
import { WELCOME_PENDING_KEY, WELCOME_TOAST } from "../signup/SignupForm";

export function VerifyEmail() {
  const router = useRouter();
  const toast = useToast();
  const { loading, user, isResident, refresh, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // 確認が済んだら村に入る。登録直後なら歓迎のトーストを出す
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (isResident) {
      router.replace("/home");
      if (localStorage.getItem(WELCOME_PENDING_KEY)) {
        localStorage.removeItem(WELCOME_PENDING_KEY);
        toast(WELCOME_TOAST);
      }
    }
  }, [loading, user, isResident, router, toast]);

  const check = useCallback(async () => {
    setBusy(true);
    try {
      await refresh();
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  // メールのリンクを開いて戻ってきたときに自動で確かめる
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    void refresh();
    return () => document.removeEventListener("visibilitychange", onVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resend = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await sendEmailVerification(user, { url: `${window.location.origin}/verify-email` });
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
      <h2 className="display" style={{ fontSize: 20 }}>
        確認メールを送りました
      </h2>
      <p>
        {user.email} 宛てに、確認のためのメールを送りました。メールにあるリンクを開くと、村に入れます。
      </p>
      <p className="hint">メールが見つからないときは、迷惑メールのフォルダも確認してください。</p>
      {message && (
        <p className="small" role="status">
          {message}
        </p>
      )}
      <button type="button" className="btn block" onClick={check} disabled={busy}>
        確認しました
      </button>
      <button type="button" className="btn ghost block" onClick={resend} disabled={busy}>
        確認メールをもう一度送る
      </button>
      <button type="button" className="text-btn" onClick={() => void logout()}>
        ログアウト
      </button>
    </>
  );
}
