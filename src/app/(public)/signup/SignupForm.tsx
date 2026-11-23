"use client";

// 住民登録。メール・パスワード・ニックネームと、村の約束への同意だけで登録できる。
// 年代などはあとから住民票で書ける（登録時は「答えない」にしておく）。
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage } from "@/lib/auth/errors";
import { LIMITS, REQUIRE_EMAIL_VERIFICATION } from "@/lib/constants";
import { firebaseAuth } from "@/lib/firebase/client";
import { createProfile } from "@/lib/firebase/users";
import { useHydrated } from "@/lib/useHydrated";

export function SignupForm() {
  const router = useRouter();
  const { loading, isResident } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const hydrated = useHydrated();
  const submitting = useRef(false);

  // すでに住民なら村に入る（登録処理の途中は、登録側で移動させる）
  useEffect(() => {
    if (!loading && isResident && !submitting.current) router.replace("/app");
  }, [loading, isResident, router]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const nickname = String(fd.get("nickname") ?? "").trim();
    if (!nickname) {
      setError("ニックネームを入力してください。");
      return;
    }
    setError("");
    setBusy(true);
    submitting.current = true;
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth(), email, password);
      await createProfile(cred.user.uid, nickname, "答えない");
      if (REQUIRE_EMAIL_VERIFICATION) {
        await sendEmailVerification(cred.user, { url: `${window.location.origin}/onboarding` });
        router.replace("/verify-email");
      } else {
        router.replace("/onboarding");
      }
    } catch (err) {
      submitting.current = false;
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <form method="post" onSubmit={onSubmit}>
      <div className={s.field}>
        <label htmlFor="r-mail">メールアドレス</label>
        <input id="r-mail" name="email" type="email" autoComplete="email" required />
        <span className={s.hint}>ほかの住民には表示されません。</span>
      </div>
      <div className={s.field}>
        <label htmlFor="r-pass">パスワード</label>
        <input id="r-pass" name="password" type="password" autoComplete="new-password" minLength={8} required />
        <span className={s.hint}>8文字以上</span>
      </div>
      <div className={s.field}>
        <label htmlFor="r-nick">ニックネーム</label>
        <input id="r-nick" name="nickname" maxLength={LIMITS.nickname} required />
        <span className={s.hint}>住民票や語りに表示されます。あとから変えられます。</span>
      </div>
      <div className={s.note}>
        <ul className={s.list}>
          <li>村は登録した住民だけが読めますが、画面の撮影などによる外への流出を完全には防げません。</li>
          <li>吃音の治療や改善を約束する場所ではありません。</li>
        </ul>
      </div>
      <label className={s.check}>
        <input type="checkbox" name="agree" required />
        <span>
          <Link href="/about" className={s.headerLink} style={{ padding: 0 }}>
            村の約束
          </Link>
          を読み、同意します
        </span>
      </label>
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      <button className={s.btn} disabled={busy || !hydrated}>
        {busy ? "登録しています…" : "住民登録する"}
      </button>
      <Link href="/login" className={s.textLink}>
        すでに住民の方はこちら
      </Link>
    </form>
  );
}
