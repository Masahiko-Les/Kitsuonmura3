"use client";

// 退会。消えるもの・残るものを先に伝え、パスワードで本人を確かめてから消す
import { useState, type FormEvent } from "react";
import { Header } from "@/components/Header";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { confirmPassword, deleteAccount } from "@/lib/firebase/account";

export function LeaveView() {
  const { user, setExitTo } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || busy) return;
    const fd = new FormData(e.currentTarget);
    if (!fd.get("agree")) {
      setError("内容を確かめたら、チェックを入れてください。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await confirmPassword(user, String(fd.get("password") ?? ""));
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(
        code === "auth/too-many-requests"
          ? "試行が多すぎます。しばらく時間をおいてから、もう一度お試しください。"
          : code.includes("credential") || code.includes("password") || code.includes("missing")
            ? "パスワードが違います。"
            : "確かめられませんでした。通信状態を確かめて、もう一度お試しください。",
      );
      setBusy(false);
      return;
    }
    try {
      // アカウントが消えると住民限定エリアから出されるので、行き先を先に決めておく
      setExitTo("/goodbye");
      await deleteAccount(user);
    } catch {
      setExitTo(null);
      setError("途中で止まりました。もう一度「退会する」を押すと、続きから消します。");
      setBusy(false);
    }
  };

  return (
    <>
      <Header kind="back" href="/app/me" title="退会する" />
      <main className={`${s.main} ${s.withNav}`}>
        <div className={s.stack}>
          <p className={s.lead}>退会すると、あなたのアカウントと、村に残したものを消します。消したものは元に戻せません。</p>
        </div>
        <section className={s.card}>
          <span className={s.cardLabel}>消えるもの</span>
          <ul className={s.list}>
            <li>住民票と吃音史</li>
            <li>集会に置いた語り</li>
            <li>図書館に置いた本の物語</li>
            <li>あなたが押した共感</li>
            <li>ログイン用のアカウント（メールアドレスとパスワード）</li>
          </ul>
        </section>
        <section className={s.cardMuted}>
          <span className={s.cardLabel}>残るもの</span>
          <ul className={`${s.list} ${s.small}`}>
            <li>運営への通報の記録（理由と補足。あなたが送ったものと、あなたの投稿についてのもの）。運営の対応のために残します。住民票が消えるので、誰のものかは画面に出ません。</li>
            <li>ほかの住民があなたの語りに押した共感の記録。語りが消えるので、どこにも表示されません。</li>
          </ul>
        </section>
        <p className={`${s.small} ${s.muted}`}>
          しばらく休みたいだけなら、退会せずにログアウトして、村を離れることもできます。書いたものは「自分」の画面から一つずつ消すこともできます。
        </p>
        <form onSubmit={onSubmit}>
          <label className={s.check}>
            <input type="checkbox" name="agree" onChange={() => setError("")} />
            消えるもの・残るものを確かめました
          </label>
          <div className={s.field}>
            <label htmlFor="leave-pass">パスワード（本人の確認のため）</label>
            <input id="leave-pass" name="password" type="password" autoComplete="current-password" required />
          </div>
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
          <button className={s.btnDanger} disabled={busy}>
            {busy ? "消しています…" : "退会する"}
          </button>
        </form>
      </main>
    </>
  );
}
