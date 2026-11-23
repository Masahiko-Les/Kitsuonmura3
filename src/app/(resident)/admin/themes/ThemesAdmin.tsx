"use client";

// 管理者だけが使う、集会テーマの追加画面。
// 管理者かどうかは Firebase のカスタムクレーム（admin: true）で判定する（scripts/set-admin.ts で付ける）。
// 画面の出し分けは目安で、実際の書き込み制限は firestore.rules で行う。
import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "@/components/Toast";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { LIMITS } from "@/lib/constants";
import { addTheme, getCurrentThemeId, listThemes } from "@/lib/firebase/meeting";
import { formatThemeMonth } from "@/lib/format";
import type { Theme } from "@/lib/types";

/** 次に追加しそうな月（いちばん新しいテーマの翌月。なければ今月） */
function nextMonth(themes: Theme[]) {
  const d = new Date();
  let [y, m] = [d.getFullYear(), d.getMonth() + 1];
  const latest = themes[0]?.month;
  const mm = latest && /^(\d{4})-(\d{2})$/.exec(latest);
  if (mm) {
    [y, m] = [Number(mm[1]), Number(mm[2]) + 1];
    if (m > 12) [y, m] = [y + 1, 1];
  }
  return `${y}-${String(m).padStart(2, "0")}`;
}

export function ThemesAdmin() {
  const { user } = useAuth();
  const toast = useToast();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [data, setData] = useState<{ themes: Theme[]; current: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    // クレームを付けた直後でも反映されるよう、トークンを取り直す
    user.getIdTokenResult(true).then(
      (r) => alive && setAdmin(r.claims.admin === true),
      () => alive && setAdmin(false),
    );
    return () => {
      alive = false;
    };
  }, [user]);

  useEffect(() => {
    if (!admin) return;
    let alive = true;
    Promise.all([listThemes(), getCurrentThemeId()]).then(
      ([themes, current]) => alive && setData({ themes, current }),
      () => alive && setError("テーマを読み込めませんでした。"),
    );
    return () => {
      alive = false;
    };
  }, [admin, reload]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const month = String(fd.get("month") ?? "");
    const title = String(fd.get("title") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || !title) {
      setError("月とテーマを入力してください。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { becomesCurrent } = await addTheme({ month, title, description });
      form.reset();
      toast(becomesCurrent ? "テーマを追加し、今月の集会にしました" : "テーマを追加しました");
      setReload((n) => n + 1);
    } catch (err) {
      setError(
        err instanceof Error && err.message === "theme-exists"
          ? `${formatThemeMonth(month)}のテーマはすでにあります。`
          : "追加できませんでした。管理者の権限があるか確認してください。",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TopBar title="集会テーマの管理" back fallbackHref="/me" />
      <div className="pad">
        {admin === null ? (
          <p className="muted small" role="status">
            確認しています…
          </p>
        ) : !admin ? (
          <p className="muted">この画面は管理者だけが使えます。</p>
        ) : (
          <>
            <p className="note">
              テーマは月に1つです。いちばん新しい月のテーマが「今月の集会」になり、住民はそのテーマにだけ語りを置けます。過去のテーマはアーカイブとして残り、削除できません。
            </p>
            {data && (
              <form onSubmit={onSubmit} key={data.themes[0]?.id ?? "none"}>
                <div className="field">
                  <label htmlFor="t-month">月</label>
                  <input id="t-month" name="month" type="month" required defaultValue={nextMonth(data.themes)} />
                </div>
                <div className="field">
                  <label htmlFor="t-title">テーマ</label>
                  <input id="t-title" name="title" required maxLength={LIMITS.themeTitle} placeholder="例：電話対応で苦労したことはありますか？" />
                </div>
                <div className="field">
                  <label htmlFor="t-desc">説明</label>
                  <textarea id="t-desc" name="description" maxLength={LIMITS.themeDescription} />
                  <span className="hint">任意です。集会のテーマの下に表示されます。</span>
                </div>
                {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
                )}
                <button className="btn block" disabled={busy}>
                  {busy ? "追加しています…" : "テーマを追加する"}
                </button>
              </form>
            )}
            <h2 className="sec">これまでのテーマ</h2>
            {!data ? (
              <p className="muted small" role="status">
                読み込んでいます…
              </p>
            ) : data.themes.length ? (
              <div className="list">
                {data.themes.map((t) => (
                  <div className="card" key={t.id}>
                    <span className="eyebrow">
                      {formatThemeMonth(t.month)}
                      {t.id === data.current && "　今月の集会"}
                    </span>
                    <b>{t.title}</b>
                    {t.description && <p className="small muted">{t.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted small">まだテーマはありません。</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
