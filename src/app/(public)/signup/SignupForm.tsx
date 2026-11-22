"use client";

import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage } from "@/lib/auth/errors";
import { AGE_GROUPS, LIMITS, REQUIRE_EMAIL_VERIFICATION, type AgeGroup } from "@/lib/constants";
import { firebaseAuth } from "@/lib/firebase/client";
import { createProfile } from "@/lib/firebase/users";

export const WELCOME_TOAST = "住民票ができました。ようこそ、吃音村へ。";
/** メール確認後に歓迎のトーストを出すための目印 */
export const WELCOME_PENDING_KEY = "kitsuonmura:welcome-pending";

export function SignupForm() {
  const router = useRouter();
  const toast = useToast();
  const { loading, isResident } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);

  // すでに住民なら村に入る（登録処理の途中は、登録側で移動させる）
  useEffect(() => {
    if (!loading && isResident && !submitting.current) router.replace("/home");
  }, [loading, isResident, router]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const nickname = String(fd.get("nickname") ?? "").trim();
    const ageGroup = String(fd.get("ageGroup") ?? "") as AgeGroup;
    if (!nickname) {
      setError("ニックネームを入力してください。");
      return;
    }
    setError("");
    setBusy(true);
    submitting.current = true;
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth(), email, password);
      await createProfile(cred.user.uid, nickname, ageGroup);
      if (REQUIRE_EMAIL_VERIFICATION) {
        await sendEmailVerification(cred.user, { url: `${window.location.origin}/verify-email` });
        localStorage.setItem(WELCOME_PENDING_KEY, "1");
        router.replace("/verify-email");
      } else {
        router.replace("/home");
        toast(WELCOME_TOAST);
      }
    } catch (err) {
      submitting.current = false;
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="r-mail">メールアドレス</label>
        <input id="r-mail" name="email" type="email" required autoComplete="email" />
        <span className="hint">ログインに使います。ほかの住民には表示されません。</span>
      </div>
      <div className="field">
        <label htmlFor="r-pass">パスワード</label>
        <input id="r-pass" name="password" type="password" required minLength={8} autoComplete="new-password" />
        <span className="hint">8文字以上</span>
      </div>
      <div className="field">
        <label htmlFor="r-nick">ニックネーム</label>
        <input id="r-nick" name="nickname" required maxLength={LIMITS.nickname} placeholder="例：うみかぜ" />
        <span className="hint">本名でなくて構いません。</span>
      </div>
      <div className="field">
        <label htmlFor="r-age">年代</label>
        <select id="r-age" name="ageGroup" defaultValue={AGE_GROUPS[0]}>
          {AGE_GROUPS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>
      <p className="note">住民票は、登録した住民だけが読めます。検索エンジンには公開されません。</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="btn block" disabled={busy}>
        {busy ? "住民票をつくっています…" : "村に入る"}
      </button>
      <p className="small muted" style={{ textAlign: "center" }}>
        すでに住民の方は <Link href="/login" style={{ color: "var(--green)", fontWeight: 700 }}>ログイン</Link>
      </p>
    </form>
  );
}
