"use client";

// 共感ボタン（試作品の reactBtn()）。
// 未押下「あなたの言葉が届きました」、押下後「届きました」。もう一度押すと取り消せる。
// 自分の投稿にはボタンを出さず、届いた人数だけを表示する。
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { toggleReaction } from "@/lib/firebase/reactions";
import type { ReactionTarget } from "@/lib/types";
import { LeafIcon } from "./icons";
import { useToast } from "./Toast";

type Props = {
  target: ReactionTarget;
  count: number;
  mine: boolean;
  /** 自分が共感済みか。確認中は undefined */
  reacted: boolean | undefined;
};

export function ReactionButton({ target, count, mine, reacted }: Props) {
  const { user } = useAuth();
  const toast = useToast();
  // 押したあとはサーバーの結果を優先して表示する
  const [result, setResult] = useState<{ reacted: boolean; count: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const on = result?.reacted ?? reacted ?? false;
  const n = result?.count ?? count;

  if (mine) {
    return (
      <span className="react mine">
        <LeafIcon />
        <span>あなたの言葉が届いた人</span>
        <b>{n}</b>
      </span>
    );
  }

  const onClick = async () => {
    if (!user || busy) return;
    setBusy(true);
    try {
      setResult(await toggleReaction(target, user.uid));
    } catch {
      toast("うまく届けられませんでした。もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`react ${on ? "on" : ""}`}
      aria-pressed={on}
      onClick={onClick}
      disabled={busy || reacted === undefined}
    >
      <LeafIcon />
      <span>{on ? "届きました" : "あなたの言葉が届きました"}</span>
      <b>{n}</b>
    </button>
  );
}
