"use client";

// 確認ダイアログ（試作品の ask()）。ネイティブの <dialog> を使い、フォーカス管理とEscキーをブラウザに任せる
import { useEffect, useLayoutEffect, useRef } from "react";
import styles from "./ConfirmDialog.module.css";
import ui from "./ui.module.css";

type Props = {
  open: boolean;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  message,
  confirmLabel,
  cancelLabel = "やめる",
  danger = true,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      cancelRef.current?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  // 画面が非表示になったら（別ページへ移動したら）閉じる
  useLayoutEffect(() => {
    const d = ref.current;
    return () => {
      if (d?.open) d.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.dlg}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onCancel();
      }}
    >
      <p>{message}</p>
      <div className={styles.row}>
        <button ref={cancelRef} type="button" className={ui.btnGhost} onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className={danger ? ui.btnDanger : ui.btn} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
