"use client";

// 通報ボタンと、理由を選ぶダイアログ（SECURITY_AND_DATA.md「投稿と安全運営」）。
// 自分の投稿には出さない。通報した人の名前は、書いた人には伝わらない
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { LIMITS, REPORT_REASONS, type ReportReason } from "@/lib/constants";
import { submitReport } from "@/lib/firebase/moderation";
import type { ReportTargetType } from "@/lib/types";
import dlg from "./ConfirmDialog.module.css";
import { useToast } from "./Toast";
import s from "./ui.module.css";

type Props = { type: ReportTargetType; id: string; mine: boolean };

const WHAT: Record<ReportTargetType, string> = { post: "この語り", book: "この本の物語", profile: "この住民票" };

export function ReportButton({ type, id, mine }: Props) {
  const { user } = useAuth();
  const toast = useToast();
  const uid = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  if (mine || !user) return null;

  const close = () => {
    setOpen(false);
    setError("");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const reason = String(fd.get("reason") ?? "") as ReportReason;
    if (!reason) {
      setError("理由をひとつ選んでください。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await submitReport(type, id, reason, String(fd.get("details") ?? "").trim(), user.uid);
      close();
      toast(
        r === "sent"
          ? "通報を受け付けました。運営が内容を確認します"
          : "受け付けられませんでした。すでに通報済みか、削除された可能性があります",
      );
    } catch {
      setError("送れませんでした。時間をおいて、もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" className={s.reportLink} onClick={() => setOpen(true)}>
        通報する
      </button>
      <dialog
        ref={ref}
        className={dlg.dlg}
        aria-labelledby={`${uid}-t`}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        {open && (
          <form onSubmit={onSubmit} style={{ gap: 12 }}>
            <p id={`${uid}-t`} style={{ fontWeight: 700 }}>
              {WHAT[type]}を運営に通報する
            </p>
            <fieldset className={s.reasons} onChange={() => setError("")}>
              <legend className={s.small}>理由</legend>
              {REPORT_REASONS.map((r) => (
                <label key={r.key} className={s.check}>
                  <input type="radio" name="reason" value={r.key} />
                  {r.label}
                </label>
              ))}
            </fieldset>
            <div className={s.field}>
              <label htmlFor={`${uid}-d`} style={{ fontSize: 13 }}>
                補足（任意）
              </label>
              <textarea id={`${uid}-d`} name="details" maxLength={LIMITS.reportDetails} style={{ minHeight: 80 }} />
            </div>
            <p className={`${s.small} ${s.muted}`}>
              通報したことや、あなたの名前は、書いた人には伝わりません。運営が内容を確かめ、必要なら非表示にします。
              命の危険があるときは、通報ではなく119番・110番へ連絡してください。
            </p>
            {error && (
              <p className={s.error} role="alert">
                {error}
              </p>
            )}
            <div className={dlg.row} style={{ marginTop: 0 }}>
              <button type="button" className={s.btnGhost} onClick={close}>
                やめる
              </button>
              <button className={s.btn} disabled={busy}>
                {busy ? "送っています…" : "通報する"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
