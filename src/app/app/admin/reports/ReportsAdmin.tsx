"use client";

// 運営（管理者）が通報を確かめて対応する画面。
// 通報 → 内容を読む → 非表示にする・削除する・そのままにする → 対応済みにする、の順で使う。
// 画面の出し分けは目安で、読み書きの制限は firestore.rules で行う
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Header } from "@/components/Header";
import { LoadError, Loading } from "@/components/Status";
import { useToast } from "@/components/Toast";
import s from "@/components/ui.module.css";
import { useAuth } from "@/lib/auth/AuthProvider";
import { REPORT_REASONS } from "@/lib/constants";
import {
  deleteReported,
  getReportTarget,
  listReports,
  setHidden,
  setReportResolved,
  type ReportTarget,
} from "@/lib/firebase/moderation";
import { formatDate } from "@/lib/format";
import type { Report, ReportTargetType } from "@/lib/types";

const TYPE_LABEL: Record<ReportTargetType, string> = { post: "集会の語り", book: "図書館の本の物語", profile: "住民票" };
const reasonLabel = (k: string) => REPORT_REASONS.find((r) => r.key === k)?.label ?? k;

export function ReportsAdmin() {
  const { user } = useAuth();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Report["status"]>("open");
  const [list, setList] = useState<{ status: string; reports: Report[] } | null>(null);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const refresh = useCallback(() => setReload((n) => n + 1), []);

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
    listReports(status).then(
      (reports) => {
        if (!alive) return;
        setError(false);
        setList({ status, reports });
      },
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, [admin, status, reload]);

  const cur = list?.status === status ? list : null;
  return (
    <>
      <Header kind="back" href="/app/me" title="通報の確認" />
      <main className={`${s.main} ${s.withNav}`}>
        {admin === null ? (
          <Loading />
        ) : !admin ? (
          <p className={s.muted}>この画面は運営（管理者）だけが使えます。</p>
        ) : (
          <>
            <p className={s.note}>
              非表示にすると、書いた本人と運営にだけ見える状態になります（本人の「自分」の画面には「運営が非表示にしています」と出ます）。
              削除は元に戻せません。通報した人の名前は、書いた人には伝わりません。
            </p>
            <div className={s.tags} role="group" aria-label="表示する通報">
              {(["open", "resolved"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  className={st === status ? s.btn : s.btnGhost}
                  style={{ width: "auto", padding: "6px 16px", fontSize: 14 }}
                  aria-pressed={st === status}
                  onClick={() => setStatus(st)}
                >
                  {st === "open" ? "未対応" : "対応済み"}
                </button>
              ))}
            </div>
            {error ? (
              <LoadError what="通報" />
            ) : !cur ? (
              <Loading />
            ) : cur.reports.length === 0 ? (
              <p className={`${s.small} ${s.muted}`}>{status === "open" ? "未対応の通報はありません。" : "対応済みの通報はありません。"}</p>
            ) : (
              <div className={s.stack}>
                {cur.reports.map((r) => (
                  <ReportCard key={`${r.id}-${reload}`} report={r} onChanged={refresh} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

type TargetState = { loaded: false } | { loaded: true; target: ReportTarget | null } | { loaded: true; error: true };

function ReportCard({ report: r, onChanged }: { report: Report; onChanged: () => void }) {
  const toast = useToast();
  const [t, setT] = useState<TargetState>({ loaded: false });
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let alive = true;
    getReportTarget(r.targetType, r.targetId).then(
      (target) => alive && setT({ loaded: true, target }),
      () => alive && setT({ loaded: true, error: true }),
    );
    return () => {
      alive = false;
    };
  }, [r.targetType, r.targetId]);

  const run = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await fn();
      toast(done);
      onChanged();
    } catch {
      toast("できませんでした。管理者の権限と通信状態を確かめてください");
      setBusy(false);
    }
  };

  const target = t.loaded && !("error" in t) ? t.target : null;
  return (
    <article className={s.card} style={{ gap: 10 }}>
      <span className={s.cardLabel}>
        {TYPE_LABEL[r.targetType]}　{formatDate(r.createdAt)}
        {r.status === "resolved" && r.resolvedAt && `（${formatDate(r.resolvedAt)}に対応済み）`}
      </span>
      <span className={s.cardTitle}>{reasonLabel(r.reason)}</span>
      {r.details && <p className={`${s.small} ${s.prose}`}>{r.details}</p>}
      <Link href={`/app/residents/${r.reporterUid}`} className={`${s.small} ${s.headerLink}`} style={{ padding: 0 }}>
        通報した住民の住民票
      </Link>

      <div className={s.cardMuted} style={{ padding: 14 }}>
        {!t.loaded ? (
          <p className={`${s.small} ${s.muted}`}>対象を読み込んでいます…</p>
        ) : "error" in t ? (
          <p className={s.error}>対象を読み込めませんでした。</p>
        ) : !target ? (
          <p className={`${s.small} ${s.muted}`}>対象はすでに削除されています。</p>
        ) : (
          <>
            {target.hidden && <p className={s.hiddenNote}>いまは非表示です</p>}
            <span className={s.small}>
              書いた人：
              <Link href={`/app/residents/${target.authorUid}`} style={{ color: "var(--brand)", fontWeight: 700 }}>
                {target.authorNickname}
              </Link>
            </span>
            {target.heading && <span className={s.name}>{target.heading}</span>}
            <p className={`${s.small} ${s.prose}`} style={{ maxHeight: 260, overflowY: "auto" }}>
              {target.text || "（書かれている内容はありません）"}
            </p>
            <Link href={target.href} className={`${s.small} ${s.headerLink}`} style={{ padding: 0 }}>
              住民の画面で開く
            </Link>
          </>
        )}
      </div>

      <div className={s.tags}>
        {target && (
          <button
            type="button"
            className={s.btnGhost}
            style={{ width: "auto", padding: "6px 14px", fontSize: 14 }}
            disabled={busy}
            onClick={() =>
              run(
                () => setHidden(r.targetType, r.targetId, !target.hidden),
                target.hidden ? "表示に戻しました" : "非表示にしました",
              )
            }
          >
            {target.hidden ? "表示に戻す" : "非表示にする"}
          </button>
        )}
        {target && r.targetType !== "profile" && (
          <button
            type="button"
            className={s.dangerBtn}
            disabled={busy}
            onClick={() => setConfirmDelete(true)}
          >
            削除する
          </button>
        )}
        <button
          type="button"
          className={r.status === "open" ? s.btn : s.btnGhost}
          style={{ width: "auto", padding: "6px 14px", fontSize: 14 }}
          disabled={busy}
          onClick={() =>
            run(
              () => setReportResolved(r.id, r.status === "open"),
              r.status === "open" ? "対応済みにしました" : "未対応に戻しました",
            )
          }
        >
          {r.status === "open" ? "対応済みにする" : "未対応に戻す"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        message={`${TYPE_LABEL[r.targetType]}を削除しますか？元に戻せません。書いた人の画面からも消えます。`}
        confirmLabel="削除する"
        onConfirm={() => {
          setConfirmDelete(false);
          if (r.targetType !== "profile") void run(() => deleteReported(r.targetType as "post" | "book", r.targetId), "削除しました");
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </article>
  );
}
