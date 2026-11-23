"use client";

// 共感ボタン（集会・図書館・吃音史で共通）。
// 件数は出さず、押したことを本人にだけ示す（PRODUCT_SPEC.md §6）。もう一度押すと取り消せる。
// 記録は reactions に残し、対象の件数も同じトランザクションで±1する（firestore.rules で整合を確認）。
// 自分の投稿にはボタンを出さない。
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { toggleReaction } from "@/lib/firebase/reactions";
import type { ReactionTarget } from "@/lib/types";
import { useToast } from "./Toast";
import s from "./ui.module.css";

type Props = {
  target: ReactionTarget;
  mine: boolean;
  /** 自分が共感済みか。確認中は undefined */
  reacted: boolean | undefined;
};

export function ReactionButton({ target, mine, reacted }: Props) {
  const { user } = useAuth();
  const toast = useToast();
  const [result, setResult] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  if (mine) return null;
  const on = result ?? reacted ?? false;

  const onClick = async () => {
    if (!user || busy) return;
    setBusy(true);
    try {
      setResult((await toggleReaction(target, user.uid)).reacted);
    } catch {
      toast("うまく届けられませんでした。もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={on ? s.reactOn : s.react}
      aria-pressed={on}
      onClick={onClick}
      disabled={busy || reacted === undefined}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
      {on ? "届きました" : "あなたの言葉が届きました"}
    </button>
  );
}
